"use client";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "./StatsCard";
import { getStatsAction } from "@/lib/utils/actions";

const StatsContainer = () => {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStatsAction(),
  });
  return (
    <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
      <StatsCard title="pending jobs" value={data?.pending || 0} />
      <StatsCard title="declined jobs" value={data?.declined || 0} />
      <StatsCard title="interview jobs" value={data?.interview || 0} />
    </div>
  );
};

export default StatsContainer;
