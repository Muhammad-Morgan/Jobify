"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  JobStatus,
  JobMode,
  createAndEditJobSchema,
  CreateAndEditJobType,
} from "@/lib/utils/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField, CustomSelectField } from "../form/FormComponents";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getSingleJobAction, updateJobAction } from "@/lib/utils/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EditForm = ({ jobId }: { jobId: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getSingleJobAction(jobId),
  });

  const { isPending, mutate } = useMutation({
    mutationFn: (values: CreateAndEditJobType) =>
      updateJobAction(jobId, values),
    onSuccess: (job) => {
      if (!job) return toast.error("there was an error");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Job updated");
      router.push("/jobs");
    },
  });

  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: data?.position || "",
      company: data?.company || "",
      location: data?.location || "",
      status: (data?.status as JobStatus) || JobStatus.Pending,
      mode: (data?.mode as JobMode) || JobMode.FullTime,
    },
  });
  function onSubmit(values: CreateAndEditJobType) {
    mutate(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">add job</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          <CustomFormField control={form.control} name="position" />
          <CustomFormField control={form.control} name="company" />
          <CustomFormField control={form.control} name="location" />
          <CustomSelectField
            control={form.control}
            name="status"
            labelText="job status"
            items={Object.values(JobStatus)}
          />
          <CustomSelectField
            control={form.control}
            name="mode"
            labelText="job mode"
            items={Object.values(JobMode)}
          />

          <Button
            type="submit"
            className="self-end capitalize"
            disabled={isPending}
          >
            {isPending ? "loading..." : "edit job"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditForm;
