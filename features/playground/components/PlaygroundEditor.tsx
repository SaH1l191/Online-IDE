"use client";
import React, { useRef, useEffect, useCallback } from "react";
import Editor, { type Monaco } from "@monaco-editor/react"
import { TemplateFile } from "../lib/path-to-json";

interface PlaygroundEditorProps {
    activeFile: TemplateFile | undefined;
    content: string;
    onContentChange: (value: string) => void;
}

const PlaygroundEditor = ({
    activeFile,
    content,
    onContentChange,
}: PlaygroundEditorProps) => {
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<Monaco | null>(null);


    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    }


    return <div className="h-full relative">
        
        <Editor 
            height="100%"
        value={content}
        onChange={(value) => onContentChange(value || "")}
        onMount={handleEditorDidMount}
        // @ts-ignore
        //  options={defaultEditorOptions}
        />
        </div>;
};

export default PlaygroundEditor;