"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, XCircle, CheckCircle } from "lucide-react";
import { WebContainer } from "@webcontainer/api";
import TerminalComponent from "./terminal";
import { transformToWebContainerFormat, type TemplateItem } from "../hooks/transformer";
import { useSetupState, type SetupStep } from "../stores/loadingStateStore";

 
interface Props {
  templateData: { folderName: string; items: TemplateItem[] };
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  forceResetup?: boolean;
}
 
const STEPS: { id: SetupStep; label: string }[] = [
  { id: "transforming", label: "Transforming template data" },
  { id: "mounting", label: "Mounting files" },
  { id: "installing", label: "Installing dependencies" },
  { id: "starting", label: "Starting dev server" },
];

const STEP_ORDER: SetupStep[] = ["idle", "transforming", "mounting", "installing", "starting", "ready"];

function StepRow({ id, label, current }: { id: SetupStep; label: string; current: SetupStep }) {
  const ci = STEP_ORDER.indexOf(current);
  const si = STEP_ORDER.indexOf(id);

  return (
    <div className="flex items-center gap-3 text-sm">
      {si < ci ? <CheckCircle className="h-4 w-4 text-green-500 shrink-0" /> :
        id === current ? <Loader2 className="h-4 w-4 animate-spin text-blue-500 shrink-0" /> :
          <div className="h-4 w-4 rounded-full border border-gray-300 shrink-0" />}
      <span className={si < ci ? "text-gray-400 line-through" : id === current ? "font-medium" : "text-gray-500"}>
        {label}
      </span>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────
export default function WebContainerPreview({
  templateData, isLoading, error, instance, writeFileSync, forceResetup
}: Props) {
  const [previewUrl, setPreviewUrl] = useState("");
  const { state, setStep, setError, reset } = useSetupState();
  const terminalRef = useRef<any>(null);
  const setupRan = useRef(false);
  const prevFiles = useRef<Map<string, string>>(new Map()); // path → content

  const log = (msg: string) => terminalRef.current?.writeToTerminal?.(msg + "\r\n");

  // Force reset
  useEffect(() => {
    if (!forceResetup) return;
    reset();
    setPreviewUrl("");
    setupRan.current = false;
    prevFiles.current.clear();
  }, [forceResetup]);

  // Initial setup 
  useEffect(() => {
    if (!instance || setupRan.current || state.step !== "idle") return;
    setupRan.current = true;

    (async () => {
      try {
        setStep("transforming");
        log("🔄 Transforming template data...");
        const files = transformToWebContainerFormat(templateData);

        setStep("mounting");
        log("📁 Mounting files...");
        await instance.mount(files);
        log("✅ Files mounted");

        // Snapshot current file contents so we can diff later
        flattenFiles(templateData.items, "", prevFiles.current);

        setStep("installing");
        log("📦 Installing dependencies...");
        const install = await instance.spawn("npm", ["install"]);
        await install.exit;

        setStep("starting");
        log("🚀 Starting dev server...");
        const server = await instance.spawn("npm", ["run", "start"]);
        server.output.pipeTo(new WritableStream({ write: (d) => log(d) }));

        instance.on("server-ready", (_port, url) => {
          log(`🌐 Ready at ${url}`);
          setPreviewUrl(url);
          setStep("ready");
        });

      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        log(`❌ ${msg}`);
        setError(msg);
      }
    })();
  }, [instance]);

  // Live file sync —runs whenever templateData changes
  useEffect(() => {
    // Only sync after setup is done
    if (!instance || state.step !== "ready" || !writeFileSync) return;

    const current = new Map<string, string>();
    flattenFiles(templateData.items, "", current);

    // Write only files that actually changed
    current.forEach((content, path) => {
      if (prevFiles.current.get(path) !== content) {
        writeFileSync(path, content)
          .then(() => log(`🔄 Synced: ${path}`))
          .catch((e) => log(`⚠️ Sync failed: ${path} — ${e.message}`));
      }
    });

    prevFiles.current = current;
  }, [templateData]);


  //Initializing WebContainer… right panel
  if (isLoading) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-gray-500">Initializing WebContainer…</p>
      </div>
    </div>
  );
  //error display  right panel
  if (error || state.error) return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-5 rounded-lg max-w-md">
        <div className="flex items-center gap-2 mb-2"><XCircle className="h-4 w-4" /><strong>Error</strong></div>
        <p className="text-sm">{error ?? state.error}</p>
      </div>
    </div>
  );

  
  return (
    <div className="h-full w-full flex flex-col">
      {previewUrl ? (
        <>
          <div className="flex-1">
            <iframe src={previewUrl} className="w-full h-full border-none" title="Preview" />
          </div>
          <div className="h-64 border-t">
            <TerminalComponent ref={terminalRef} webContainerInstance={instance} theme="dark" className="h-full" />
          </div>
        </>
      ) : (
        <>
          <div className="w-full max-w-sm mx-auto mt-10 p-6 rounded-xl bg-white dark:bg-zinc-800 shadow space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Setting up environment
            </p>
            {STEPS.map(s => <StepRow key={s.id} id={s.id} label={s.label} current={state.step} />)}
          </div>
          <div className="flex-1 p-4">
            <TerminalComponent ref={terminalRef} webContainerInstance={instance} theme="dark" className="h-full" />
          </div>
        </>
      )}
    </div>
  );
}
 
/** Flatten a template tree into a path→content map */
function flattenFiles(items: TemplateItem[], prefix: string, out: Map<string, string>) {
  for (const item of items) {
    if (item.folderName && item.items) {
      flattenFiles(item.items, prefix ? `${prefix}/${item.folderName}` : item.folderName, out);
    } else if (item.filename) {
      const path = `${prefix ? prefix + "/" : ""}${item.filename}.${item.fileExtension}`;
      out.set(path, item.content ?? "");
    }
  }
}