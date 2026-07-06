"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingStep from "@/components/ui/loader";
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { useEditorStore } from "@/features/playground/hooks/useEditorStore";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { useWebContainer } from "@/features/web-containers/hooks/useWebContainer";
import { PlaygroundLayout } from "@/features/playground/components/PlaygroundLayout";
import WebContainerPreview from "@/features/web-containers/components/WebContainerPreview";

const MainPlaygroundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const { playgroundData, templateData, isLoading, error } = usePlayground(id);
  const { templateData: explorerData, setTemplateData, setPlaygroundId, saveFile } = useFileExplorer();
  const { isLoading: containerLoading, error: containerError, instance, writeFileSync, boot } = useWebContainer();

  const currentTemplateData = explorerData ?? templateData;

  useEffect(() => { setPlaygroundId(id); }, [id]);
  useEffect(() => {
    if (templateData && !explorerData) setTemplateData(templateData);
  }, [templateData]);

  // Lazy boot WebContainer only when user toggles preview ON
  useEffect(() => {
    if (isPreviewVisible && !instance && !containerLoading) {
      boot();
    }
  }, [isPreviewVisible, instance, containerLoading, boot]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        const activeId = useEditorStore.getState().activeFileId;
        if (activeId) saveFile(activeId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saveFile]);

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <Button onClick={() => window.location.reload()} variant="destructive">Try Again</Button>
    </div>
  );

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-6 text-center">Loading Playground</h2>
        <LoadingStep currentStep={1} step={1} label="Loading playground data" />
        <LoadingStep currentStep={2} step={2} label="Setting up environment" />
        <LoadingStep currentStep={3} step={3} label="Ready to code" />
      </div>
    </div>
  );

  if (!currentTemplateData) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
      <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
      <h2 className="text-xl font-semibold text-amber-600 mb-2">No template data available</h2>
      <Button onClick={() => window.location.reload()} variant="outline">Reload Template</Button>
    </div>
  );

  return (
    <PlaygroundLayout
      playgroundData={playgroundData}
      isPreviewVisible={isPreviewVisible}
      onPreviewToggle={() => setIsPreviewVisible(v => !v)}
      previewPanel={isPreviewVisible ? (
        <WebContainerPreview
          templateData={currentTemplateData}
          isLoading={containerLoading}
          error={containerError}
          instance={instance}
          writeFileSync={writeFileSync}
          forceResetup={false}
        />
      ) : null}
    />
  );
};

export default MainPlaygroundPage;
