import EditForm from "@/components/Jobs/EditForm";
import { getSingleJobAction } from "@/lib/utils/actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const EditJob = async ({ params }: { params: { id: string } }) => {
  const queryClient = new QueryClient();
  const { id } = await params;
  await queryClient.prefetchQuery({
    queryKey: ["job", id],
    queryFn: () => getSingleJobAction(id as string),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditForm jobId={id} />
    </HydrationBoundary>
  );
};

export default EditJob;
