import { JobFilterValues } from "@/lib/Validation";
import JobListItem from "./JobListItem";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
interface JobResultProps {
  filterValues: JobFilterValues;
  page?: number;
}
const JobResults = async ({
  filterValues: { q, type, location, remote },
  page = 1,
}: JobResultProps) => {
  const jobsPerPage = 6;
  const skip = (page - 1) * jobsPerPage;
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");
  const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          { title: { search: searchString } },
          { companyName: { search: searchString } },
          { type: { search: searchString } },
          { location: { search: searchString } },
          { locationType: { search: searchString } },
        ],
      }
    : {};
  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type ? { type } : {},
      location ? { location } : {},
      remote ? { locationType: "Remote" } : {},
      { approved: true },
    ],
  };
  const jobsPromise = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: jobsPerPage,
    skip,
  });

  const countPromise = prisma.job.count({ where });
  const [jobs, totalResults] = await Promise.all([jobsPromise, countPromise]);
  return (
    <div className="grow space-y-4">
      {jobs.map((job) => {
        return <JobListItem key={job.id} job={job} />;
      })}
      {jobs.length === 0 && (
        <p className="m-auto text-center text-xl">
          {" "}
          No jobs found. Try adjusting your search filters{" "}
        </p>
      )}
    </div>
  );
};

export default JobResults;
