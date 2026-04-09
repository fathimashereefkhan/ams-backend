import { RouteShorthandOptions } from "fastify";

export const userListSchema: RouteShorthandOptions["schema"] = {
  querystring: {
    type: "object",
    required: ["role"],
    properties: {
      page: { type: "number", minimum: 1, default: 1 },
      limit: { type: "number", minimum: 1, maximum: 100, default: 10 },
      role: {
        type: "string",
        enum: [
          "student",
          "teacher",
          "parent",
          "principal",
          "hod",
          "staff",
          "admin",
        ],
      },
      search: { type: "string", minLength: 1 },
    },
  },
};

export const userUpdateSchema: RouteShorthandOptions["schema"] = {
  body: {
    type: "object",
    required: [],
    properties: {
      name: { type: "string", minLength: 3 },
      password: { type: "string", minLength: 8 },
      image: { type: "string" },
      role: {
        type: "string",
        enum: [
          "student",
          "teacher",
          "parent",
          "principal",
          "hod",
          "staff",
          "admin",
        ],
      },
      phone: { type: "number" },
      first_name: { type: "string" },
      last_name: { type: "string" },
      gender: { type: "string", enum: ["male", "female", "other"] },

      student: {
        type: "object",
        required: [],
        properties: {
          adm_number: { type: "string" },
          adm_year: { type: "number" },
          candidate_code: { type: "string" },
          department: { type: "string", enum: ["CSE", "ECE", "IT"] },
          date_of_birth: { type: "string", format: "date" },
          batch: { type: "string" },
        },
        additionalProperties: false,
      },

      teacher: {
        type: "object",
        required: [],
        properties: {
          designation: { type: "string" },
          department: { type: "string" },
          date_of_joining: { type: "string", format: "date" },
        },
        additionalProperties: false,
      },

      parent: {
        type: "object",
        required: [],
        properties: {
          relation: { type: "string", enum: ["mother", "father", "guardian"] },
          childID: { type: "string" },
        },
        additionalProperties: false,
      },
    },

    additionalProperties: false,
  },
};

export const userCreateSchema: RouteShorthandOptions["schema"] = {
  body: {
    type: "object",
    required: [
      "name",
      "first_name",
      "last_name",
      "gender",
      "phone",
    ],
    properties: {
      name: { type: "string", minLength: 3 },
      password: { type: "string", minLength: 8 },
      email: { type: "string" },
      image: { type: "string" },
      phone: { type: "number" },
      first_name: { type: "string" },
      last_name: { type: "string" },
      gender: { type: "string", enum: ["male", "female", "other"] },

      student: {
        type: "object",
        properties: {
          adm_number: { type: "string" },
          adm_year: { type: "number" },
          candidate_code: { type: "string" },
          department: { type: "string", enum: ["CSE", "ECE", "IT"] },
          date_of_birth: { type: "string", format: "date" },
          batch: { type: "string" },
        },
        additionalProperties: false,
      },

      teacher: {
        type: "object",
        required: ["designation", "date_of_joining"],
        properties: {
          designation: { type: "string" },
          department: { type: "string" },
          date_of_joining: { type: "string", format: "date" },
        },
        additionalProperties: false,
      },

      parent: {
        type: "object",
        required: ["relation", "childID"],
        properties: {
          relation: { type: "string", enum: ["mother", "father", "guardian"] },
          childID: { type: "string" },
        },
        additionalProperties: false,
      },
    },

    allOf: [
      {
        if: {
          required: ["student"],
        },
        then: {
          properties: {
            student: {
              type: "object",
            },
          },
        },
      },
      {
        if: {
          required: ["teacher"],
        },
        then: {
          properties: {
            teacher: {
              type: "object",
              required: ["designation", "date_of_joining"],
            },
          },
        },
      },
      {
        if: {
          required: ["parent"],
        },
        then: {
          properties: {
            parent: {
              type: "object",
              required: ["relation", "childID"],
            },
          },
        },
      },
    ],

    additionalProperties: false,
  },
};

export const bulkCreateSchema: RouteShorthandOptions["schema"] = {
  body: {
    type: "object",
    required: ["users"],
    properties: {
      users: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["first_name", "last_name", "role"],
          properties: {
            email: { type: "string", format: "email" },
            generate_mail: { type: "boolean", default: false },
            password: { type: "string", minLength: 8 },
            first_name: { type: "string", minLength: 1 },
            last_name: { type: "string", minLength: 1 },
            role: {
              type: "string",
              enum: [
                "student",
                "teacher",
                "parent",
                "principal",
                "hod",
                "staff",
                "admin",
              ],
            },
            adm_number: { type: "string" },
            adm_year: { type: "number" },
            candidate_code: { type: "string" },
            department: { type: "string", enum: ["CSE", "ECE", "IT"] },
            date_of_birth: { type: "string", format: "date" },
            batch: { type: "string" },
          },
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
  },
};
