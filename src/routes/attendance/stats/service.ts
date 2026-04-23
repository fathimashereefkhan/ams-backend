import { FastifyRequest, FastifyReply } from "fastify";
import { AttendanceSession } from "@/plugins/db/models/attendance.model";
import mongoose from "mongoose";

interface StatsQuery {
  student?: string;
}

export const getStats = async (
  request: FastifyRequest<{ Querystring: StatsQuery }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user.id;
    const userRole = request.user.role;
    const { student } = request.query;

    let targetStudentId = userId;

    if (student) {
      if (userRole === "student" && student !== userId) {
        return reply.status(403).send({
          status_code: 403,
          message: "Students can only view their own stats",
          data: "",
        });
      }
      
      if (!mongoose.Types.ObjectId.isValid(student)) {
        return reply.status(400).send({
          status_code: 400,
          message: "Invalid student ID format",
          data: "",
        });
      }
      targetStudentId = student;
    }

    const studentObjectId = new mongoose.Types.ObjectId(targetStudentId);

    const pipeline: any[] = [
      { $match: { "records.student": studentObjectId } },
      { $unwind: "$records" },
      { $match: { "records.student": studentObjectId } },
      {
        $group: {
          _id: "$subject",
          totalClasses: { $sum: 1 },
          attendedClasses: {
            $sum: { $cond: [{ $eq: ["$records.status", "present"] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "subject",
          localField: "_id",
          foreignField: "_id",
          as: "subjectData"
        }
      },
      { $unwind: "$subjectData" },
      {
        $project: {
          _id: 0,
          subjectName: "$subjectData.name",
          totalClasses: 1,
          attendedClasses: 1,
          percentage: {
            $cond: [
              { $gt: ["$totalClasses", 0] },
              { $round: [{ $multiply: [{ $divide: ["$attendedClasses", "$totalClasses"] }, 100] }, 0] },
              0
            ]
          }
        }
      },
      {
        $addFields: {
          classesNeeded: {
            $cond: [
              { $lt: ["$percentage", 75] },
              { $subtract: [{ $multiply: [3, "$totalClasses"] }, { $multiply: [4, "$attendedClasses"] }] },
              0
            ]
          },
          classesCanSkip: {
            $cond: [
              { $gte: ["$percentage", 75] },
              { $floor: { $subtract: [{ $divide: [{ $multiply: [4, "$attendedClasses"] }, 3] }, "$totalClasses"] } },
              0
            ]
          }
        }
      },
      { $sort: { subjectName: 1 } }
    ];

    const stats = await AttendanceSession.aggregate(pipeline);

    return reply.send({
      status_code: 200,
      message: "Stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    return reply.status(500).send({
      status_code: 500,
      message: "Failed to fetch stats",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
