import StatsLoading from "@/components/Stats/StatsLoading";

const Loading = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-x-3.5">
      <StatsLoading />
      <StatsLoading />
      <StatsLoading />
    </div>
  );
};

export default Loading;
