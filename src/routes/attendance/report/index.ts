import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import authMiddleware from "@/middleware/auth";
import { isAnyStaff } from "@/middleware/roles";
import { getReport, ReportQuery } from "./service";
import { reportSchema } from "./schema";

export default async function (fastify: FastifyInstance) {
  fastify.addHook("preHandler", authMiddleware);
  fastify.get<{ Querystring: ReportQuery; }>("/", { schema: reportSchema, preHandler: [isAnyStaff] }, getReport);
}
