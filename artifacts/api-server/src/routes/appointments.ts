import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateAppointmentBody } from "@workspace/api-zod";

const OWNER_WHATSAPP = "5527988995055";

const AVAILABLE_TIMES = [
  "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const router = Router();

router.get("/available-times", async (req, res) => {
  const { date } = req.query;
  if (!date || typeof date !== "string") {
    res.status(400).json({ error: "Data é obrigatória" });
    return;
  }

  try {
    const bookedAppointments = await db
      .select({ time: appointmentsTable.time })
      .from(appointmentsTable)
      .where(eq(appointmentsTable.date, date));

    const bookedTimes = new Set(bookedAppointments.map((a) => a.time));
    const available = AVAILABLE_TIMES.filter((t) => !bookedTimes.has(t));

    res.json({ date, times: available });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch available times");
    res.status(500).json({ error: "Falha ao buscar horários disponíveis" });
  }
});

router.post("/", async (req, res) => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados inválidos" });
    return;
  }

  const { clientName, clientPhone, serviceId, date, time, notes } = parsed.data;

  try {
    const [service] = await db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.id, serviceId));

    if (!service) {
      res.status(400).json({ error: "Serviço não encontrado" });
      return;
    }

    const [appointment] = await db
      .insert(appointmentsTable)
      .values({ clientName, clientPhone, serviceId, date, time, notes: notes ?? null, status: "pending" })
      .returning();

    const message = `Olá Rocky! Gostaria de agendar: ${service.name} - ${date} às ${time}. Nome: ${clientName}. Telefone: ${clientPhone}${notes ? `. Obs: ${notes}` : ""}.`;
    const whatsappLink = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;

    res.status(201).json({
      id: appointment.id,
      clientName: appointment.clientName,
      clientPhone: appointment.clientPhone,
      serviceId: appointment.serviceId,
      serviceName: service.name,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes ?? undefined,
      status: appointment.status,
      whatsappLink,
      createdAt: appointment.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create appointment");
    res.status(500).json({ error: "Falha ao criar agendamento" });
  }
});

export default router;
