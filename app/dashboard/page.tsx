import AddNewProject from "@/features/dashboard/components/AddNewProject";
import AddRepo from "@/features/dashboard/components/AddRepo";
import ProjectTable from "@/features/dashboard/components/ProjectTable";
import { deletePlayGroundById, duplicatePlaygroundById, editPlayGroundById, toggleStarMarked, getAllPlayground } from "@/features/playground/actions";
 
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl" />
      <div className="relative bg-muted/50 rounded-2xl p-6">
        <img src="/empty-state.svg" alt="No projects" className="w-48 h-48 mb-4" />
      </div>
    </div>
    <h2 className="text-xl font-semibold text-muted-foreground">No projects found</h2>
    <p className="text-muted-foreground/70">Create a new project to get started!</p>
  </div>
);

const DashboardMainPage = async () => { 
  const playgrounds = await getAllPlayground();
  console.log("playgrounds from dashboard main page ", playgrounds)
  return (
    <div className="flex flex-col justify-start items-center h-fit mx-auto max-w-7xl px-4 py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-fit">
        <AddNewProject />
        <AddRepo />
      </div>
      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ProjectTable 
              projects={playgrounds ?? []}
              onDeleteProject={deletePlayGroundById}
              onUpdateProject={editPlayGroundById}
              onDuplicateProject={duplicatePlaygroundById}
              onMarkasFavorite={toggleStarMarked}
            />
          </>
        )}
       
      </div>
    </div>
  );
};

export default DashboardMainPage;