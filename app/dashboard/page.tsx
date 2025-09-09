
import AddNewButton from "@/features/dashboard/components/AddNewProject";
import AddRepo from "@/features/dashboard/components/AddRepo";
import ProjectTable from "@/features/dashboard/components/ProjectTable";
import { deletePlayGroundById, duplicatePlaygroundById, editPlayGroundById, getAllPlayground } from "@/features/playground/actions";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <img src="/empty-state.svg" alt="No projects" className="w-48 h-48 mb-4" />
    <h2 className="text-xl font-semibold text-gray-500">No projects found</h2>
    <p className="text-gray-400">Create a new project to get started!</p>
  </div>
);

const DashboardMainPage = async () => {
  const playgrounds = await getAllPlayground();
  console.log("playgrounds from dashboard main page ", playgrounds)
  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewButton />
        <AddRepo />
      </div>
      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playgrounds && playgrounds.length === 0? (
          <EmptyState />
        ) : (
          <>  
          
            <ProjectTable
            //  @ts-ignore
              projects={playgrounds || []}
              onDeleteProject={deletePlayGroundById}
              onUpdateProject={editPlayGroundById}
              //  @ts-ignore
              onDuplicateProject={duplicatePlaygroundById}
            />
          </>
        )}
        {/* props passed to table component as it is client component and server actions cannot be passed over there */}
      </div>
    </div>
  );
};

export default DashboardMainPage;