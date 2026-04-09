import { Router } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const services = await db.select().from(servicesTable);
    res.json(services);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch services");
    res.status(500).json({ error: "Falha ao buscar serviços" });
  }
});

export default router;
