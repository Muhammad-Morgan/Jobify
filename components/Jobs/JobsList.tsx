"use client";

import { getAllJobsAction } from "@/lib/utils/actions";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import JobCard from "./JobCard";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ButtonContainer from "./ButtonContainer";
import ComplexButtonContainer from "./ComplexButtonContainer";

const JobsList = () => {
  // We get the query values, and use them in React-Query to fetch the data using the server action, and adding the caching identifiers as well
  const currentUrl = useSearchParams();
  const search = currentUrl.get("search") || "";
  const jobStatus = currentUrl.get("jobStatus") || "all";
  const pageNumber = Number(currentUrl.get("page")) || 1;

  const { data, isPending } = useQuery({
    queryKey: ["jobs", search, jobStatus, pageNumber],
    queryFn: () => getAllJobsAction({ search, jobStatus, page: pageNumber }),
  });
  const jobs = data?.jobs || [];
  const count = data?.count || 0;
  const page = data?.page || 1;
  const totalPages = data?.totalPages || 0;
  if (isPending) {
    return <h2 className="text-xl">Please wait...</h2>;
  }
  if (jobs.length === 0) {
    return <h2 className="text-xl">No jobs found...</h2>;
  }
  return (
    <>
      {/* BUTTON CONTAINER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold capitalize">
          <span className="text-muted-foreground">{count}</span> jobs found
        </h2>
        {/* Simple pagination */}
        {/* {totalPages < 2 ? null : (
          <ButtonContainer currentPage={page} totalPages={totalPages} />
        )} */}
        {/* Complex pagination */}
        {totalPages < 2 ? null : (
          <ComplexButtonContainer currentPage={page} totalPages={totalPages} />
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {jobs.map((job) => {
          return <JobCard key={job.id} job={job} />;
        })}
      </div>
    </>
  );
};

export default JobsList;
