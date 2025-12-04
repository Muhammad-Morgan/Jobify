"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import ComplianceTable from "./ComplianceTable";
import { type ComplianceItem } from "./complianceItemsActions";
import { type Column } from "./ComplianceTable";
import { useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

type Props = {
  initialData: ComplianceItem[];
  page: number;
  pageCount: number;
  initialSearch: string;
};
// simple generic debounce function
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

const ComplianceWrapper = ({
  initialData,
  page,
  pageCount,
  initialSearch = "",
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState(initialSearch);
  const debouncedSearch = useDebouncedValue(search, 400);

  const columns: Column<ComplianceItem>[] = [
    { key: "name", header: "Name" },
    { key: "status", header: "Status" },
    { key: "jurisdiction", header: "Jurisdiction" },
  ] as const;
  const handlePageChange = (nextPage: number) => {
    // construct new seach url using the current url
    const params = new URLSearchParams(searchParams.toString());
    // adding nextPage
    params.set("page", String(nextPage));
    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");
    // navigate to the new constructed url
    router.push(`?${params.toString()}`);
  };
  // when search changes, always reset to page 1
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (debouncedSearch) params.set("q", debouncedSearch);
    else params.delete("q");

    router.push(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, router]);
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center justify-between gap-2">
        <label className="flex-1 text-sm">
          <span className="sr-only">Search compliance items</span>
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </label>
      </div>
      {/* Table */}
      <ComplianceTable<ComplianceItem>
        columns={columns}
        onPageChange={handlePageChange}
        data={initialData}
        page={page}
        pageCount={pageCount}
        onRowSelect={(item) => console.log(item.id)}
      />
    </div>
  );
};

export default ComplianceWrapper;
