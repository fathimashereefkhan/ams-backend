import { FastifyInstance } from "fastify";
import authMiddleware from "@/middleware/auth";
import { isAdmin } from "@/middleware/roles";
import { configCreateSchema, configUpdateSchema, configListSchema } from "./schema";
import {
    listConfig,
    listPublicConfig,
    createConfig,
    updateConfig,
    deleteConfig,
} from "./service";

export default async function (fastify: FastifyInstance) {
    // Public endpoint: no auth required
    fastify.get("/", listPublicConfig);

    // All other routes require auth
    fastify.addHook("preHandler", authMiddleware);

    fastify.get<{ Querystring: { page?: number; limit?: number } }>(
        "/list",
        { schema: configListSchema, preHandler: [isAdmin] },
        listConfig
    );

    fastify.post("/", { schema: configCreateSchema, preHandler: [isAdmin] }, createConfig);

    fastify.put<{ Params: { key: string } }>(
        "/:key",
        { schema: configUpdateSchema, preHandler: [isAdmin] },
        updateConfig
    );

    fastify.delete<{ Params: { key: string } }>(
        "/:key",
        { preHandler: [isAdmin] },
        deleteConfig
    );
}
