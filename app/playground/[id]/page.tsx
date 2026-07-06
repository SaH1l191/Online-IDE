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
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-destructive/10 to-destructive/5 rounded-full blur-2xl" />
        <div className="relative bg-destructive/10 rounded-2xl p-6">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-destructive mt-4 mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">{error}</p>
      <Button onClick={() => window.location.reload()} variant="destructive">Try Again</Button>
    </div>
  );

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-md p-6 rounded-xl shadow-sm border border-border/50 glass">
        <h2 className="text-xl font-semibold mb-6 text-center text-foreground">Loading Playground</h2>
        <LoadingStep currentStep={1} step={1} label="Loading playground data" />
        <LoadingStep currentStep={2} step={2} label="Setting up environment" />
        <LoadingStep currentStep={3} step={3} label="Ready to code" />
      </div>
    </div>
  );

  if (!currentTemplateData) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-warning/10 to-warning/5 rounded-full blur-2xl" />
        <div className="relative bg-warning/10 rounded-2xl p-6">
          <FolderOpen className="h-12 w-12 text-warning" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-warning mt-4 mb-2">No template data available</h2>
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
