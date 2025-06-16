import EmptyState from "@/components/empty-state";

function ProcessingState() {
  return (
    <div className=" bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center ">
      <EmptyState
        title="Meeting Completed"
        description="This meeting was completed, A summery will appear soon"
        image="/processing.svg"
      />
    </div>
  );
}

export default ProcessingState;
