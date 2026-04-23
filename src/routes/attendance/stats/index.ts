import { FastifyInstance } from "fastify";
import authMiddleware from "@/middleware/auth";
import { getStats } from "./service";
import { statsSchema } from "./schema";

export default async function (fastify: FastifyInstance) {
  fastify.addHook("preHandler", authMiddleware);
  fastify.get("/", { schema: statsSchema }, getStats);
}
