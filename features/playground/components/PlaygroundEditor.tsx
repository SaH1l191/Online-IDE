"use client"

import { useRef, useEffect, useState } from "react"
import Editor, { type Monaco } from "@monaco-editor/react"
import type * as monacoEditor from "monaco-editor"
import { configureMonaco, defaultEditorOptions, getEditorLanguage } from "@/features/playground/lib/editor-config"
import type { TemplateFile } from "@/features/playground/lib/path-to-json"
import { Sparkles } from "lucide-react"

interface PlaygroundEditorProps {
  activeFile: TemplateFile | undefined
  content: string
  onContentChange: (value: string) => void
}

export const PlaygroundEditor = ({ activeFile, content, onContentChange }: PlaygroundEditorProps) => {
  const editorRef   = useRef<any>(null)
  const monacoRef   = useRef<Monaco | null>(null)
  const providerRef = useRef<any>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const aiEnabledRef = useRef(false) 
  const [aiEnabled, setAiEnabled] = useState(false)

  const updateLanguage = () => {
    if (!activeFile || !monacoRef.current || !editorRef.current) return
    const model = editorRef.current.getModel()
    if (!model) return
    try {
      monacoRef.current.editor.setModelLanguage(model, getEditorLanguage(activeFile.fileExtension || ""))
    } catch (e) {
      console.warn("Failed to set language:", e)
    }
  }

  const registerCompletionProvider = (monaco: Monaco) => {
    providerRef.current?.dispose()

    providerRef.current = monaco.languages.registerInlineCompletionsProvider("*", {
      provideInlineCompletions( model: monacoEditor.editor.ITextModel,
  position: monacoEditor.Position) {
        // Check ref (not state) — closure captures ref, always current
        if (!aiEnabledRef.current) return Promise.resolve({ items: [], dispose: () => {} })

        const textUntilCursor = model.getValueInRange({
          startLineNumber: 1, startColumn: 1,
          endLineNumber: position.lineNumber, endColumn: position.column,
        })

        if (textUntilCursor.trim().length < 3) return Promise.resolve({ items: [], dispose: () => {} })

        // Debounce: cancel previous pending request, wait 600ms before firing
        return new Promise((resolve) => {
          if (debounceRef.current) clearTimeout(debounceRef.current)

          debounceRef.current = setTimeout(async () => {
            try {
              const res = await fetch("/api/autocomplete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  code: textUntilCursor,
                  language: getEditorLanguage(activeFile?.fileExtension || ""),
                }),
              })

              const { completion } = await res.json()
              if (!completion?.trim()) return resolve({ items: [], dispose: () => {} })

              resolve({
                items: [{
                  insertText: completion,
                  range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                  },
                }],
                dispose: () => {},
              })
            } catch {
              resolve({ items: [], dispose: () => {} })
            }
          }, 800) 
        })
      },
      freeInlineCompletions() {},
      disposeInlineCompletions() {},
    })
  }

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    editor.updateOptions({
      ...defaultEditorOptions,
      cursorSmoothCaretAnimation: "on",
      inlineSuggest: { enabled: true },
    })

    configureMonaco(monaco)
    registerCompletionProvider(monaco)
    updateLanguage()
  }

  const toggleAI = () => {
    const next = !aiEnabled
    setAiEnabled(next)
    aiEnabledRef.current = next  // keep ref in sync so provider closure reads it
  }

  useEffect(() => {
    updateLanguage()
    if (monacoRef.current) registerCompletionProvider(monacoRef.current)
  }, [activeFile])

    //cleanup on unmount
  useEffect(() => {
    return () => {
      providerRef.current?.dispose()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div className="h-full relative">
      <button
        onClick={toggleAI}
        title={aiEnabled ? "Disable AI autocomplete" : "Enable AI autocomplete"}
        className={`absolute top-2 right-4 z-10 flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors ${
          aiEnabled
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        <Sparkles className="h-3 w-3" />
        AI {aiEnabled ? "On" : "Off"}
      </button>

      <Editor
        height="100%"
        value={content}
        onChange={(value) => onContentChange(value || "")}
        onMount={handleEditorDidMount}
        language={activeFile ? getEditorLanguage(activeFile.fileExtension || "") : "plaintext"}
        // @ts-ignore
        options={{ ...defaultEditorOptions, inlineSuggest: { enabled: true } }}
      />
    </div>
  )
}

export default PlaygroundEditor