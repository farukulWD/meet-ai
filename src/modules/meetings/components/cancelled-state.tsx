import EmptyState from "@/components/empty-state";

function CancelledState() {
  return (
    <div className=" bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center ">
      <EmptyState
        title="Meeting Cancelled"
        description="Meeting was Cancelled"
        image="/upcoming.svg"
      />
     
    </div>
  );
}

export default CancelledState;
