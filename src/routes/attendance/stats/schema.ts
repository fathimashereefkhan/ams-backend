import { RouteShorthandOptions } from "fastify";

export const statsSchema: RouteShorthandOptions["schema"] = {
  querystring: {
    type: "object",
    properties: {
      student: { type: "string" },
    },
  },
};
