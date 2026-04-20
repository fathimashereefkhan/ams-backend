import { FastifyRequest, FastifyReply } from "fastify";
import { Config } from "@/plugins/db/models/config.model";

/** GET /config  — list all config vars (admin only) */
export const listConfig = async (
    request: FastifyRequest<{ Querystring: { page?: number; limit?: number } }>,
    reply: FastifyReply
) => {
    try {
        const { page = 1, limit = 100 } = request.query;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Config.find().sort({ key: 1 }).skip(skip).limit(limit),
            Config.countDocuments(),
        ]);

        return reply.send({
            status_code: 200,
            message: "Config fetched successfully",
            data: {
                items,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        return reply.status(500).send({
            status_code: 500,
            message: "Failed to fetch config",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

/** GET /config/public  — list all config vars without auth (for frontend bootstrap) */
export const listPublicConfig = async (
    _request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const items = await Config.find().sort({ key: 1 });
        const map: Record<string, any> = {};
        items.forEach((item) => {
            map[item.key] = item.value;
        });

        return reply.send({
            status_code: 200,
            message: "Config fetched successfully",
            data: map,
        });
    } catch (error) {
        return reply.status(500).send({
            status_code: 500,
            message: "Failed to fetch config",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

/** POST /config  — create a new config var (admin only) */
export const createConfig = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const { key, value, description } = request.body as {
            key: string;
            value: any;
            description?: string;
        };

        const existing = await Config.findOne({ key });
        if (existing) {
            return reply.status(409).send({
                status_code: 409,
                message: `Config key "${key}" already exists`,
                data: "",
            });
        }

        const config = new Config({ key, value, description: description ?? "" });
        await config.save();

        return reply.status(201).send({
            status_code: 201,
            message: "Config created successfully",
            data: config,
        });
    } catch (error) {
        return reply.status(500).send({
            status_code: 500,
            message: "Failed to create config",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

/** PUT /config/:key  — update a config var (admin only) */
export const updateConfig = async (
    request: FastifyRequest<{ Params: { key: string } }>,
    reply: FastifyReply
) => {
    try {
        const { key } = request.params;
        const { value, description } = request.body as { value?: any; description?: string };

        const updatePayload: Record<string, any> = {};
        if (value !== undefined) updatePayload.value = value;
        if (description !== undefined) updatePayload.description = description;

        const updated = await Config.findOneAndUpdate(
            { key },
            { $set: updatePayload },
            { new: true }
        );

        if (!updated) {
            return reply.status(404).send({
                status_code: 404,
                message: `Config key "${key}" not found`,
                data: "",
            });
        }

        return reply.send({
            status_code: 200,
            message: "Config updated successfully",
            data: updated,
        });
    } catch (error) {
        return reply.status(500).send({
            status_code: 500,
            message: "Failed to update config",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

/** DELETE /config/:key  — delete a config var (admin only) */
export const deleteConfig = async (
    request: FastifyRequest<{ Params: { key: string } }>,
    reply: FastifyReply
) => {
    try {
        const { key } = request.params;

        const deleted = await Config.findOneAndDelete({ key });
        if (!deleted) {
            return reply.status(404).send({
                status_code: 404,
                message: `Config key "${key}" not found`,
                data: "",
            });
        }

        return reply.send({
            status_code: 200,
            message: "Config deleted successfully",
            data: "",
        });
    } catch (error) {
        return reply.status(500).send({
            status_code: 500,
            message: "Failed to delete config",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
