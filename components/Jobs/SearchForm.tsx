"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { JobStatus } from "@/lib/utils/types";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SearchForm = () => {
  const currentUrl = useSearchParams();
  const search = currentUrl.get("search") || "";
  const jobStatus = currentUrl.get("jobStatus") || "all";

  const router = useRouter();
  const pathname = usePathname();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // The idea is on submit we navigate back to jobs, but adding query params to the url. we will use params in 2 places: 1. default values for inputs 2.we will call react query in the jobsList, we will access same values and use it in our query
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    const jobStatus = formData.get("jobStatus") as string;

    const params = new URLSearchParams();
    params.set("search", search);
    params.set("jobStatus", jobStatus);
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <form
      className="bg-muted mb-16 p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div style={{ background: "var(--background)" }} className="rounded-lg">
        <Input
          type="text"
          placeholder="Search Jobs"
          name="search"
          defaultValue={search}
        />
      </div>
      <div style={{ background: "var(--background)" }} className="rounded-lg">
        <Select name="jobStatus" defaultValue={jobStatus}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["all", ...Object.values(JobStatus)].map((jobStatus) => {
              return (
                <SelectItem key={jobStatus} value={jobStatus}>
                  {jobStatus}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
};

export default SearchForm;
