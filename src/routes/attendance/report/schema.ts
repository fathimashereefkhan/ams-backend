import { RouteShorthandOptions } from "fastify";

export const reportSchema: RouteShorthandOptions["schema"] = {
  querystring: {
    type: "object",
    required: ["subject", "batch"],
    properties: {
      subject: { type: "string" },
      batch: { type: "string" },
    },
  },
};

