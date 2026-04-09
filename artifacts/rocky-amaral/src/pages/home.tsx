import { useState } from "react";
import {
  MapPin,
  Phone,
  Instagram,
  CheckCircle2,
  Clock,
  Scissors,
  ChevronLeft,
  ChevronRight,
  User,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useListServices } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import img1 from "@assets/Screenshot_2026-04-09-13-11-24-389_com.whatsapp-edit_1775751197771.jpg";
import img2 from "@assets/Screenshot_2026-04-09-13-11-55-006_com.whatsapp-edit_1775751197834.jpg";
import img3 from "@assets/Screenshot_2026-04-09-13-12-13-354_com.whatsapp-edit_1775751197866.jpg";
import img4 from "@assets/Screenshot_2026-04-09-13-12-21-809_com.whatsapp-edit_1775751197908.jpg";

const FALLBACK_SERVICES = [
  { id: 1, name: "Corte Simples", description: "Corte clássico com acabamento perfeito", price: 25, durationMinutes: 30 },
  { id: 2, name: "Corte + Barba", description: "Corte completo com modelagem de barba", price: 45, durationMinutes: 60 },
  { id: 3, name: "Navalhado", description: "Barba completa com navalha profissional", price: 35, durationMinutes: 45 },
  { id: 4, name: "Degradê", description: "Degradê moderno com acabamento preciso", price: 35, durationMinutes: 45 },
];

const STEPS = [
  { id: 1, label: "Serviço" },
  { id: 2, label: "Seus Dados" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.25, ease: "easeIn" } }),
};

const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function Home() {
  const { data: servicesData } = useListServices();
  const services = servicesData || FALLBACK_SERVICES;

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  function goTo(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};
    if (step === 1 && !selectedServiceId) newErrors.service = "Escolha um serviço para continuar.";
    if (step === 2) {
      if (!name.trim() || name.trim().length < 2) newErrors.name = "Informe seu nome completo.";
      if (!phone.trim() || phone.trim().length < 10) newErrors.phone = "Informe um telefone válido.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function next() {
    if (validateStep()) goTo(step + 1);
  }

  function back() {
    goTo(step - 1);
  }

  function handleConfirm() {
    if (!validateStep()) return;
    const lines = [
      `Olá! Gostaria de agendar um horário na Barbearia Rocky Amaral.`,
      ``,
      `*Serviço:* ${selectedService?.name} — R$ ${selectedService?.price}`,
      `*Nome:* ${name}`,
      `*Telefone:* ${phone}`,
      ...(notes ? [`*Observações:* ${notes}`] : []),
    ];
    const message = lines.join("\n");
    setSubmitted(true);
    window.open(`https://wa.me/5527988995055?text=${encodeURIComponent(message)}`, "_blank");
  }

  function resetBooking() {
    setStep(1);
    setDir(1);
    setSelectedServiceId(null);
    setName("");
    setPhone("");
    setNotes("");
    setErrors({});
    setSubmitted(false);
  }

  return (
    <div className="min-h-[100dvh] w-full bg-black text-white selection:bg-accent selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="font-serif text-2xl font-bold tracking-tight text-white">R.A</div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
          <a href="#servicos" className="hover:text-accent transition-colors">Serviços</a>
          <a href="#galeria" className="hover:text-accent transition-colors">Galeria</a>
          <Button
            variant="outline"
            className="rounded-none border-white hover:bg-white hover:text-black uppercase tracking-widest text-xs h-9 px-6"
            onClick={() => document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth" })}
          >
            Agendar
          </Button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-serif font-bold text-white/5 pointer-events-none select-none">R</div>
        <motion.div className="relative z-10 text-center px-6 max-w-4xl" initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.p variants={fadeInUp} className="text-accent uppercase tracking-[0.3em] text-sm mb-6 font-medium">Tradição & Excelência</motion.p>
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
              onClick={() => document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth" })}
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">Serviços</h2>
              <div className="w-16 h-1 bg-accent" />
            </div>
            <p className="text-white/60 max-w-md">Técnicas clássicas executadas com maestria. Do corte impecável à navalha tradicional, cada serviço é uma experiência premium.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                className="group relative border-b border-white/10 pb-8 flex flex-col"
              >
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-2xl font-serif font-bold group-hover:text-accent transition-colors">{service.name}</h3>
                  <span className="text-xl font-light">R$ {service.price}</span>
                </div>
                <p className="text-white/50 mb-4">{service.description}</p>
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-accent/80 font-medium">
                  <Clock className="w-3 h-3" />
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Nosso Trabalho</h2>
            <div className="w-16 h-1 bg-accent mx-auto" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[img1, img2, img3, img4].map((img, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.5 } } }}
                className="aspect-[4/5] relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-500" />
                <img src={img} alt={`Trabalho ${i + 1}`} className="w-full h-full object-cover filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="agendar" className="py-32 px-6 bg-zinc-950 relative border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-14">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">Agende seu horário</h2>
            <p className="text-white/60">Escolha o serviço e fale direto com a gente pelo WhatsApp.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-black border border-white/10">

            {/* Step indicator */}
            {!submitted && (
              <div className="flex border-b border-white/10">
                {STEPS.map((s, i) => (
                  <div key={s.id} className={cn("flex-1 py-4 px-3 flex flex-col items-center gap-1 transition-colors relative", step === s.id ? "bg-white/5" : "")}>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border",
                      step > s.id ? "bg-accent border-accent text-black" :
                      step === s.id ? "bg-white border-white text-black" :
                      "bg-transparent border-white/20 text-white/30"
                    )}>
                      {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                    </div>
                    <span className={cn("text-[10px] uppercase tracking-widest hidden sm:block transition-colors",
                      step === s.id ? "text-white" : step > s.id ? "text-accent" : "text-white/30"
                    )}>{s.label}</span>
                    {i < STEPS.length - 1 && (
                      <div className={cn("absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 transition-colors", step > s.id ? "bg-accent/40" : "bg-white/10")} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step content */}
            <div className="overflow-hidden" style={{ minHeight: 360 }}>
              <AnimatePresence mode="wait" custom={dir}>

                {/* STEP 1: Choose Service */}
                {step === 1 && !submitted && (
                  <motion.div key="step1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-8 md:p-10">
                    <p className="text-xs uppercase tracking-widest text-accent mb-6 font-bold">Passo 1 — Escolha o serviço</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {services.map((service) => {
                        const isSelected = selectedServiceId === service.id;
                        return (
                          <button
                            key={service.id}
                            onClick={() => { setSelectedServiceId(service.id); setErrors({}); }}
                            data-testid={`card-service-${service.id}`}
                            className={cn(
                              "text-left p-5 border transition-all duration-200 group relative overflow-hidden",
                              isSelected
                                ? "border-white bg-white text-black"
                                : "border-white/15 hover:border-white/40 bg-white/2 hover:bg-white/5"
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className={cn("font-serif text-lg font-bold", isSelected ? "text-black" : "text-white")}>{service.name}</span>
                              <span className={cn("text-sm font-light ml-3 shrink-0", isSelected ? "text-black/70" : "text-white/50")}>R$ {service.price}</span>
                            </div>
                            <p className={cn("text-sm mb-3 leading-relaxed", isSelected ? "text-black/70" : "text-white/50")}>{service.description}</p>
                            <div className={cn("flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium", isSelected ? "text-black/60" : "text-accent/80")}>
                              <Clock className="w-3 h-3" />
                              {service.durationMinutes} min
                            </div>
                            {isSelected && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                                <CheckCircle2 className="w-4 h-4 text-black" />
                              </motion.div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {errors.service && <p className="text-accent text-sm mt-4">{errors.service}</p>}
                    <div className="flex justify-end mt-8">
                      <Button onClick={next} className="bg-white text-black hover:bg-accent hover:text-black rounded-none h-12 px-8 text-xs font-bold uppercase tracking-widest" data-testid="button-next-step1">
                        Próximo <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Personal Details */}
                {step === 2 && !submitted && (
                  <motion.div key="step2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-8 md:p-10">
                    <p className="text-xs uppercase tracking-widest text-accent mb-6 font-bold">Passo 2 — Seus dados</p>

                    {/* Selected service summary */}
                    {selectedService && (
                      <div className="flex items-center gap-3 border border-white/10 px-4 py-3 mb-8 bg-white/3">
                        <Scissors className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-sm text-white/70">
                          <span className="text-white font-medium">{selectedService.name}</span>
                          {" — "}R$ {selectedService.price}
                        </span>
                      </div>
                    )}

                    <div className="space-y-8">
                      <div>
                        <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-3">
                          <User className="w-3.5 h-3.5" /> Nome Completo
                        </label>
                        <input
                          value={name}
                          onChange={(e) => { setName(e.target.value); setErrors({}); }}
                          placeholder="Seu nome"
                          data-testid="input-name"
                          className="w-full bg-transparent border-0 border-b border-white/20 pb-3 text-lg text-white placeholder:text-white/20 outline-none focus:border-white transition-colors"
                        />
                        {errors.name && <p className="text-accent text-sm mt-2">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-3">
                          <Phone className="w-3.5 h-3.5" /> WhatsApp / Telefone
                        </label>
                        <input
                          value={phone}
                          onChange={(e) => { setPhone(e.target.value); setErrors({}); }}
                          placeholder="(27) 99999-9999"
                          data-testid="input-phone"
                          className="w-full bg-transparent border-0 border-b border-white/20 pb-3 text-lg text-white placeholder:text-white/20 outline-none focus:border-white transition-colors"
                        />
                        {errors.phone && <p className="text-accent text-sm mt-2">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-3">
                          <MessageSquare className="w-3.5 h-3.5" /> Observações <span className="normal-case text-white/30">(opcional)</span>
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Alguma preferência ou observação?"
                          rows={3}
                          data-testid="input-notes"
                          className="w-full bg-transparent border-0 border-b border-white/20 pb-3 text-lg text-white placeholder:text-white/20 outline-none focus:border-white transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button onClick={back} variant="ghost" className="text-white/50 hover:text-white rounded-none h-12 px-6 text-xs uppercase tracking-widest" data-testid="button-back-step2">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
                      </Button>
                      <Button
                        onClick={handleConfirm}
                        className="bg-white text-black hover:bg-accent hover:text-black rounded-none h-12 px-8 text-xs font-bold uppercase tracking-widest"
                        data-testid="button-confirm"
                      >
                        Enviar pelo WhatsApp <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Success state */}
                {submitted && (
                  <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-10 flex flex-col items-center text-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold mb-2">Mensagem Enviada!</h3>
                      <p className="text-white/50 max-w-sm">Sua solicitação foi enviada pelo WhatsApp. A barbearia entrará em contato para confirmar o horário.</p>
                    </div>
                    <Button onClick={resetBooking} variant="outline" className="rounded-none border-white/20 text-white hover:bg-white hover:text-black uppercase tracking-widest text-xs h-11 px-8 mt-2">
                      Fazer outro agendamento
                    </Button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Como Chegar</h2>
            <div className="w-16 h-1 bg-accent" />
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 flex flex-col justify-center gap-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Endereço</p>
                  <p className="text-white/80 leading-relaxed">Av. Jacaranema, 315<br />Santa Paula 1, Vila Velha - ES</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-accent shrink-0 mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Horário</p>
                  <p className="text-white/80">Segunda — Sábado<br />08:00 — 21:00</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 h-72 lg:h-80 overflow-hidden border border-white/10 relative">
              <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 80%, black)" }} />
              <iframe
                title="Barbearia Rocky Amaral"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.8!2d-40.308!3d-20.361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDIxJzM5LjYiUyA0MMKwMTgnMjguOCJX!5e0!3m2!1spt-BR!2sbr!4v1000000000000"
                className="w-full h-full grayscale contrast-125 brightness-50"
                style={{ border: 0, filter: "grayscale(100%) contrast(1.2) brightness(0.5)" }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="font-serif text-3xl font-bold mb-4">R.A</div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">Tradição, precisão e estilo. Barbearia Rocky Amaral — Vila Velha, ES.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-4 font-bold">Horário</p>
              <p className="text-white/60">Segunda — Sábado</p>
              <p className="text-white font-medium">08:00 — 21:00</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-4 font-bold">Contato</p>
              <div className="flex flex-col gap-3">
                <a href="https://www.instagram.com/barbearia.rockyamaral?igsh=cTIyNmh1c2V4ejJp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                  <Instagram className="w-4 h-4" />
                  @barbearia.rockyamaral
                </a>
                <a href="https://wa.me/5527988995055" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                  <Phone className="w-4 h-4" />
                  (27) 98899-5055
                </a>
                <div className="flex items-start gap-2 text-white/60 text-sm">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  Av. Jacaranema, 315 — Santa Paula 1, Vila Velha - ES
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/20 uppercase tracking-widest">
            <span>© {new Date().getFullYear()} Barbearia Rocky Amaral</span>
            <span>Vila Velha — ES</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
