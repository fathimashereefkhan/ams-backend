import { FastifyInstance } from "fastify";
import authMiddleware from "@/middleware/auth";
import { isAnyStaff } from "@/middleware/roles";
import { getOverview } from "./service";
import { overviewSchema } from "./schema";

export default async function (fastify: FastifyInstance) {
  fastify.addHook("preHandler", authMiddleware);
  fastify.get("/", { schema: overviewSchema, preHandler: [isAnyStaff] }, getOverview);
}
