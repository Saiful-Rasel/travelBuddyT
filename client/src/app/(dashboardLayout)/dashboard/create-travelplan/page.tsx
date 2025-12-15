// src/app/(dashboard)/travel-plans/create/page.tsx

import CreateTravelPlanForm from "@/components/modules/travel-plans/createTravelPlanClient";

const CreateTravelPlanPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div
        className="w-full max-w-2xl rounded-lg border p-6 shadow-lg bg-white
                   max-h-[90vh] overflow-y-auto scrollbar-none"
      >
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-3xl font-bold">Create Travel Plan</h1>
          <p className="text-gray-500">
            Fill in the details to create your travel plan
          </p>
        </div>

        <CreateTravelPlanForm />
      </div>
    </div>
  );
};

export default CreateTravelPlanPage;
