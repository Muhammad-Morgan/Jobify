"use server";
import prisma from "./db";
import { auth } from "@clerk/nextjs/server";
import {
  type JobType,
  type CreateAndEditJobType,
  createAndEditJobSchema,
} from "./types";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
export async function authenticateAndRedirect() {
  const user = await auth();
  if (!user) return redirect("/");
  return user.userId as string;
}

export async function createJobAction(
  values: CreateAndEditJobType
): Promise<JobType | null> | never {
  const userId = await authenticateAndRedirect();
  try {
    createAndEditJobSchema.parse(values);
    const job: JobType = await prisma.job.create({
      data: {
        ...values,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    console.error(error);
    return null;
  }
}
type GetAllJobsActionTypes = {
  search?: string;
  jobStatus?: string;
  page?: number;
  limit?: number;
};
export async function getAllJobsAction({
  search,
  jobStatus,
  page = 1,
  limit = 10,
}: GetAllJobsActionTypes): Promise<{
  jobs: JobType[];
  count: number;
  page: number;
  totalPages: number;
}> {
  const userId = await authenticateAndRedirect();

  try {
    let whereClause: Prisma.JobWhereInput = {
      clerkId: userId,
    };
    if (search) {
      whereClause = {
        ...whereClause,
        // use this setup to search in 2 columns
        OR: [
          {
            position: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            company: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };
    }
    // check if jobStatus filter is narrowing the results
    if (jobStatus && jobStatus !== "all") {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      };
    }
    const skip = (page - 1) * limit;
    const jobs: JobType[] = await prisma.job.findMany({
      where: whereClause,
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });

    const count: number = await prisma.job.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(count / limit);
    return { jobs, count, page, totalPages };
  } catch (error) {
    console.log(error);
    return { jobs: [], count: 0, page: 1, totalPages: 0 };
  }
}
export async function deleteJobAction(id: string): Promise<JobType | null> {
  const userId = await authenticateAndRedirect();
  try {
    const job: JobType = await prisma.job.delete({
      where: {
        id,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getSingleJobAction(id: string): Promise<JobType | null> {
  const userId = await authenticateAndRedirect();
  let singleJob: JobType | null;
  try {
    singleJob = await prisma.job.findUnique({
      where: {
        id,
        clerkId: userId,
      },
    });
  } catch (error) {
    console.log(error);

    singleJob = null;
  }
  if (!singleJob) {
    redirect("/jobs");
  }
  return singleJob;
}
export async function updateJobAction(
  id: string,
  values: CreateAndEditJobType
): Promise<JobType | null> {
  const userId = await authenticateAndRedirect();
  try {
    const updatedJob = await prisma.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    });
    return updatedJob;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getStatsAction(): Promise<{
  pending: number;
  declined: number;
  interview: number;
}> {
  const userId = await authenticateAndRedirect();
  try {
    const stats = await prisma.job.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        clerkId: userId, // replace userId with the actual clerkId
      },
    });
    const statsObject: Record<string, number> = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);
    const defaultStats = {
      pending: 0,
      declined: 0,
      interview: 0,
      ...statsObject,
    };
    return defaultStats;
  } catch (error) {
    console.log(error);
    redirect("/jobs");
  }
}
export async function getChartsAction(): Promise<
  Array<{ date: string; count: number }>
> {
  const userId = await authenticateAndRedirect();
  const sixMonthsAgo = dayjs().subtract(6, "month").toDate();
  try {
    const jobs = await prisma.job.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    const applicationsPerMonth = jobs.reduce((acc, job) => {
      const date = dayjs(job.createdAt).format("MMM YY");

      const existingEntry = acc.find((entry) => entry.date === date);
      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }

      return acc;
    }, [] as Array<{ date: string; count: number }>);
    return applicationsPerMonth;
  } catch (error) {
    console.log(error);
    redirect("/jobs");
  }
}
