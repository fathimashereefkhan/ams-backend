import { RouteShorthandOptions } from "fastify";

export const configCreateSchema: RouteShorthandOptions["schema"] = {
    body: {
        type: "object",
        required: ["key", "value"],
        properties: {
            key: { type: "string", minLength: 1 },
            value: {},
            description: { type: "string" },
        },
    },
};

export const configUpdateSchema: RouteShorthandOptions["schema"] = {
    body: {
        type: "object",
        properties: {
            value: {},
            description: { type: "string" },
        },
    },
};

export const configListSchema: RouteShorthandOptions["schema"] = {
    querystring: {
        type: "object",
        properties: {
            page: { type: "number", minimum: 1, default: 1 },
            limit: { type: "number", minimum: 1, maximum: 200, default: 100 },
        },
    },
};
