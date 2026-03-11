"use client";

import  { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import "xterm/css/xterm.css";
import { cn } from "@/lib/utils";

interface TerminalProps {
  className?: string;
  theme?: "dark" | "light";
  webContainerInstance?: any;
}

export interface TerminalRef {
  writeToTerminal: (data: string) => void;
}

const THEMES = {
  dark:  { background: "#09090B", foreground: "#FAFAFA", cursor: "#FAFAFA", selection: "#27272A", green: "#22C55E", red: "#EF4444", yellow: "#EAB308", blue: "#3B82F6", cyan: "#06B6D4" },
  light: { background: "#FFFFFF", foreground: "#18181B", cursor: "#18181B", selection: "#E4E4E7", green: "#16A34A", red: "#DC2626", yellow: "#CA8A04", blue: "#2563EB", cyan: "#0891B2" },
};

const TerminalComponent = forwardRef<TerminalRef, TerminalProps>(
  ({ className, theme = "dark", webContainerInstance }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const term         = useRef<any>(null);
    const fitAddon     = useRef<any>(null);
    const currentLine  = useRef("");
    const cmdHistory   = useRef<string[]>([]);
    const historyIdx   = useRef(-1);
    const activeProc   = useRef<any>(null);
    const [connected, setConnected] = useState(false);

    // Expose write method
    useImperativeHandle(ref, () => ({
      writeToTerminal: (data: string) => term.current?.write(data),
    }));
//     parent components can do:
// terminalRef.current.writeToTerminal("npm install")

    const writePrompt = () => {
      term.current?.write("\r\n$ ");
      currentLine.current = "";
      historyIdx.current  = -1;
    }; //Creates the shell prompt:$ _

    // Run a command in the WebContainer
    const runCommand = async (cmd: string) => {
      if (!webContainerInstance || !term.current) return;
      const trimmed = cmd.trim();

      if (!trimmed) { writePrompt(); return; }
      if (trimmed === "clear") { term.current.clear(); writePrompt(); return; }

      if (trimmed && cmdHistory.current.at(-1) !== trimmed)
        cmdHistory.current.push(trimmed);

      const [bin, ...args] = trimmed.split(" ");
      term.current.writeln("");

      try {
        const proc = await webContainerInstance.spawn(bin, args, {
          terminal: { cols: term.current.cols, rows: term.current.rows },
        });
        activeProc.current = proc;
        proc.output.pipeTo(new WritableStream({ write: d => term.current?.write(d) }));
        await proc.exit;
      } catch {
        term.current.writeln(`\r\nCommand not found: ${bin}`);
      } finally {
        activeProc.current = null;
        writePrompt();
      }
    };

    // Handle keyboard input
    const handleInput = (data: string) => {
      if (!term.current) return;
      switch (data) {
        case "\r":   // Enter
          runCommand(currentLine.current);
          break;
        case "\u007F": // Backspace
          if (currentLine.current.length > 0) {
            currentLine.current = currentLine.current.slice(0, -1);
            term.current.write("\b \b");
          }
          break;
        case "\u0003": // Ctrl+C
          activeProc.current?.kill();
          term.current.writeln("^C");
          writePrompt();
          break;
        case "\u001b[A": { // Up arrow
          const idx = historyIdx.current === -1
            ? cmdHistory.current.length - 1
            : Math.max(0, historyIdx.current - 1);
          historyIdx.current = idx;
          const entry = cmdHistory.current[idx] ?? "";
          term.current.write(`\r$ ${" ".repeat(currentLine.current.length)}\r$ ${entry}`);
          currentLine.current = entry;
          break;
        }
        case "\u001b[B": { // Down arrow
          if (historyIdx.current === -1) break;
          const idx = historyIdx.current + 1;
          if (idx >= cmdHistory.current.length) {
            historyIdx.current = -1;
            term.current.write(`\r$ ${" ".repeat(currentLine.current.length)}\r$ `);
            currentLine.current = "";
          } else {
            historyIdx.current = idx;
            const entry = cmdHistory.current[idx];
            term.current.write(`\r$ ${" ".repeat(currentLine.current.length)}\r$ ${entry}`);
            currentLine.current = entry;
          }
          break;
        }
        default:
          if (data >= " ") {
            currentLine.current += data;
            term.current.write(data);
          }
      }
    };

    // Init xterm
    useEffect(() => {
      let t: any;
      (async () => {
        const { Terminal }      = await import("xterm");
        const { FitAddon }      = await import("xterm-addon-fit");
        const { WebLinksAddon } = await import("xterm-addon-web-links");
        if (!containerRef.current) return;

        t = new Terminal({
          cursorBlink: true,
          fontFamily: '"Fira Code", "JetBrains Mono", monospace',
          fontSize: 13,
          lineHeight: 1.4,
          theme: THEMES[theme],
          scrollback: 1000,
          // FIX: let xterm manage its own size — don't constrain from outside
          convertEol: true,
        });

        const fit   = new FitAddon();
        const links = new WebLinksAddon();
        t.loadAddon(fit);
        t.loadAddon(links);
        t.open(containerRef.current);
        fit.fit();

        term.current    = t;
        fitAddon.current = fit;

        t.onData(handleInput);
        t.writeln("WebContainer Terminal");
        writePrompt();

        // FIX: re-fit when container resizes so terminal never falls below scroll area
        const ro = new ResizeObserver(() => fit.fit());
        ro.observe(containerRef.current!);
        (t as any)._ro = ro; // stash for cleanup
      })();

      return () => {
        (t as any)?._ro?.disconnect();
        t?.dispose();
        activeProc.current?.kill();
      };
    }, [theme]);

    // Show connected status when webcontainer arrives
    useEffect(() => {
      if (webContainerInstance && term.current && !connected) {
        setConnected(true);
        term.current.writeln("\r\n✅ WebContainer connected");
        writePrompt();
      }
    }, [webContainerInstance]);

    return (
      // FIX: use overflow-hidden + flex col so the inner div never escapes bounds
      <div className={cn("flex flex-col h-full overflow-hidden rounded-lg border bg-background", className)}>
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/50 shrink-0">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-medium">Terminal</span>
          {connected && (
            <div className="flex items-center gap-1 ml-auto">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Connected</span>
            </div>
          )}
        </div>

        {/* Terminal — FIX: min-h-0 forces flex child to respect parent height */}
        <div className="flex-1 min-h-0">
          <div
            ref={containerRef}
            className="w-full h-full p-1"
            style={{ background: THEMES[theme].background }}
          />
        </div>
      </div>
    );
  }
);

TerminalComponent.displayName = "TerminalComponent";
export default TerminalComponent;