import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, formatISO, addDays, isSunday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, MapPin, Phone, Instagram, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { useListServices, useCreateAppointment, useGetAvailableTimes, getGetAvailableTimesQueryKey } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import img1 from "@assets/Screenshot_2026-04-09-13-11-24-389_com.whatsapp-edit_1775751197771.jpg";
import img2 from "@assets/Screenshot_2026-04-09-13-11-55-006_com.whatsapp-edit_1775751197834.jpg";
import img3 from "@assets/Screenshot_2026-04-09-13-12-13-354_com.whatsapp-edit_1775751197866.jpg";
import img4 from "@assets/Screenshot_2026-04-09-13-12-21-809_com.whatsapp-edit_1775751197908.jpg";

// Hardcoded fallback services if API fails
const FALLBACK_SERVICES = [
  {
    id: 1,
    name: "Corte Simples",
    description: "Corte clássico com acabamento perfeito",
    price: 25,
    durationMinutes: 30
  },
  {
    id: 2,
    name: "Corte + Barba",
    description: "Corte completo com modelagem de barba",
    price: 45,
    durationMinutes: 60
  },
  {
    id: 3,
    name: "Navalhado",
    description: "Barba completa com navalha profissional",
    price: 35,
    durationMinutes: 45
  },
  {
    id: 4,
    name: "Degradê",
    description: "Degradê moderno com acabamento preciso",
    price: 35,
    durationMinutes: 45
  }
];

const AVAILABLE_HOURS = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const formSchema = z.object({
  name: z.string().min(2, "Nome completo é obrigatório"),
  phone: z.string().min(10, "Telefone válido é obrigatório"),
  serviceId: z.string().min(1, "Selecione um serviço"),
  date: z.date({
    required_error: "Selecione uma data",
  }),
  time: z.string().min(1, "Selecione um horário"),
  notes: z.string().optional(),
});

export default function Home() {
  const { toast } = useToast();
  
  // API Queries
  const { data: servicesData, isLoading: isLoadingServices } = useListServices();
  const services = servicesData || FALLBACK_SERVICES;
  
  const createAppointment = useCreateAppointment();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      serviceId: "",
      time: "",
      notes: "",
    },
  });

  const selectedDate = form.watch("date");
  const selectedDateStr = selectedDate ? formatISO(selectedDate, { representation: 'date' }) : undefined;
  
  // Fetch available times based on date (though we mostly use hardcoded times as requested)
  const { data: availableTimesData } = useGetAvailableTimes(
    { date: selectedDateStr! },
    { query: { enabled: !!selectedDateStr, queryKey: getGetAvailableTimesQueryKey({ date: selectedDateStr! }) } }
  );

  const availableHours = availableTimesData?.times || AVAILABLE_HOURS;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const selectedService = services.find(s => s.id.toString() === values.serviceId);
    const serviceName = selectedService?.name || "Serviço";
    const formattedDate = format(values.date, "dd/MM/yyyy");
    
    const message = `Olá Rocky! Gostaria de agendar: ${serviceName} - ${formattedDate} às ${values.time}. Nome: ${values.name}. Telefone: ${values.phone}.${values.notes ? ` Obs: ${values.notes}` : ''}`;
    
    // First try via API if you want it tracked
    createAppointment.mutate({
      data: {
        clientName: values.name,
        clientPhone: values.phone,
        serviceId: parseInt(values.serviceId),
        date: formatISO(values.date, { representation: 'date' }),
        time: values.time,
        notes: values.notes
      }
    }, {
      onSuccess: (data) => {
        toast({
          title: "Agendamento iniciado!",
          description: "Você será redirecionado para o WhatsApp para confirmar.",
        });
        window.open(data.whatsappLink || `https://wa.me/5527988995055?text=${encodeURIComponent(message)}`, '_blank');
        form.reset();
      },
      onError: () => {
        // Fallback directly to Whatsapp
        toast({
          title: "Redirecionando",
          description: "Confirmando seu agendamento no WhatsApp...",
        });
        window.open(`https://wa.me/5527988995055?text=${encodeURIComponent(message)}`, '_blank');
        form.reset();
      }
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-black text-white selection:bg-accent selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="font-serif text-2xl font-bold tracking-tight text-white">R.A</div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
          <a href="#servicos" className="hover:text-accent transition-colors">Serviços</a>
          <a href="#galeria" className="hover:text-accent transition-colors">Galeria</a>
          <Button variant="outline" className="rounded-none border-white hover:bg-white hover:text-black uppercase tracking-widest text-xs h-9 px-6" onClick={() => document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' })}>
            Agendar
          </Button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Subtle noise/texture background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        
        {/* Large abstract R in background */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-serif font-bold text-white/5 pointer-events-none select-none">
          R
        </div>

        <motion.div 
          className="relative z-10 text-center px-6 max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} className="text-accent uppercase tracking-[0.3em] text-sm mb-6 font-medium">
            Tradição & Excelência
          </motion.p>
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tighter mb-8 leading-none">
            ROCKY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">AMARAL</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto font-light">
            Não é apenas um corte de cabelo. É um resgate da masculinidade clássica com precisão moderna. A barbearia para homens que exigem o melhor.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-accent hover:text-black rounded-none h-14 px-10 text-sm font-bold uppercase tracking-widest transition-all duration-300"
              onClick={() => document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-hero-book"
            >
              Agendar Horário
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* SERVICES SECTION */}
      <section id="servicos" className="py-32 px-6 bg-zinc-950 border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
          >
            <div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">Serviços</h2>
              <div className="w-16 h-1 bg-accent"></div>
            </div>
            <p className="text-white/60 max-w-md">
              Técnicas clássicas executadas com maestria. Do corte impecável à navalha tradicional, cada serviço é uma experiência premium.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {services.map((service, i) => (
              <motion.div 
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                }}
                className="group relative border-b border-white/10 pb-8 flex flex-col"
              >
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-2xl font-serif font-bold group-hover:text-accent transition-colors">{service.name}</h3>
                  <span className="text-xl font-light">R$ {service.price}</span>
                </div>
                <p className="text-white/50 mb-4">{service.description}</p>
                <div className="flex items-center text-xs uppercase tracking-widest text-accent/80 font-medium">
                  {service.durationMinutes} min
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="galeria" className="py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Nosso Trabalho</h2>
            <div className="w-16 h-1 bg-accent mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[img1, img2, img3, img4].map((img, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.5 } }
                }}
                className="aspect-[4/5] relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                <img 
                  src={img} 
                  alt={`Trabalho ${i+1}`} 
                  className="w-full h-full object-cover filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="agendar" className="py-32 px-6 bg-zinc-950 relative border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">Agende seu horário</h2>
            <p className="text-white/60">Reserve sua cadeira. Sem atrasos, sem desculpas.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-black border border-white/10 p-8 md:p-12"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-white/60">Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent text-lg placeholder:text-white/20 h-12" data-testid="input-name" />
                        </FormControl>
                        <FormMessage className="text-accent" />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-white/60">Telefone / WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="(27) 99999-9999" {...field} className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent text-lg placeholder:text-white/20 h-12" data-testid="input-phone" />
                        </FormControl>
                        <FormMessage className="text-accent" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Service */}
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-white/60">Serviço</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:ring-0 focus:border-accent text-lg h-12 data-[state=open]:border-accent" data-testid="select-service">
                              <SelectValue placeholder="Escolha..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-none">
                            {services.map((s) => (
                              <SelectItem key={s.id} value={s.id.toString()} className="focus:bg-white/10 focus:text-white cursor-pointer">
                                {s.name} - R$ {s.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-accent" />
                      </FormItem>
                    )}
                  />

                  {/* Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
                        <FormLabel className="text-xs uppercase tracking-widest text-white/60 mb-3">Data</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full bg-transparent border-0 border-b border-white/20 rounded-none px-0 font-normal hover:bg-transparent hover:text-white justify-start text-lg h-12 focus-visible:ring-0 focus-visible:border-accent",
                                  !field.value && "text-white/20"
                                )}
                                data-testid="button-date"
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Selecione a data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/10 text-white rounded-none" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today || isSunday(date);
                              }}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-accent" />
                      </FormItem>
                    )}
                  />

                  {/* Time */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-white/60">Horário</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDate}>
                          <FormControl>
                            <SelectTrigger className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:ring-0 focus:border-accent text-lg h-12" data-testid="select-time">
                              <SelectValue placeholder="Horário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-none max-h-60">
                            {availableHours.map((time) => (
                              <SelectItem key={time} value={time} className="focus:bg-white/10 focus:text-white cursor-pointer">
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-accent" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-white/60">Observações (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Alguma preferência ou observação?" 
                          className="resize-none bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent min-h-[80px] text-lg placeholder:text-white/20" 
                          {...field} 
                          data-testid="input-notes"
                        />
                      </FormControl>
                      <FormMessage className="text-accent" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-white text-black hover:bg-accent hover:text-black rounded-none h-16 text-sm font-bold uppercase tracking-widest transition-all duration-300 mt-8 group"
                  disabled={createAppointment.isPending}
                  data-testid="button-submit-booking"
                >
                  {createAppointment.isPending ? "Processando..." : (
                    <span className="flex items-center justify-center gap-2">
                      Confirmar no WhatsApp
                      <CheckCircle2 className="w-5 h-5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <h3 className="font-serif text-3xl font-bold mb-6">Rocky Amaral</h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Barbearia premium para homens que valorizam o cuidado clássico e a precisão técnica. A excelência não é uma opção, é a regra.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest text-accent mb-6 font-bold">Contato</h4>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white/40 shrink-0" />
                <span className="text-sm">Av. Exemplo, 123 - Centro<br/>Vitória - ES</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white/40 shrink-0" />
                <a href="https://wa.me/5527988995055" className="text-sm hover:text-accent transition-colors" target="_blank" rel="noreferrer">
                  +55 (27) 98899-5055
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest text-accent mb-6 font-bold">Horário</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Segunda - Sexta</span>
                <span>09:00 - 19:00</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Sábado</span>
                <span>09:00 - 17:00</span>
              </li>
              <li className="flex justify-between border-white/5 pb-2 text-white/40">
                <span>Domingo</span>
                <span>Fechado</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-xs text-white/40">
          <p>© 2025 Rocky Amaral Barbearia. Todos os direitos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
