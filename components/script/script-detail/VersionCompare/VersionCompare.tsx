"use client";

import React, { useState, useEffect, useRef } from "react";
import { diffLines } from "diff";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useTheme } from "next-themes";
import { Book } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Hooks - to be implemented with Next.js API routes
import { useFetchScriptFile, useFetchScriptInfo } from "@/hooks/useFetchScript";

// CSS for highlighting diff (you may want to move this to a global stylesheet or CSS module)
import "./VersionCompare.css";

const VersionCompareTab = () => {
  const { theme } = useTheme();
  const params = useParams();
  const userId = params?.userId as string;
  const scriptId = params?.scriptId as string;

  const leftEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  const rightEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  let leftDecorations = useRef<monaco.editor.IModelDeltaDecoration[]>([]);
  let rightDecorations = useRef<monaco.editor.IModelDeltaDecoration[]>([]);

  const [editorKey1, setEditorKey1] = useState(0);
  const [editorKey2, setEditorKey2] = useState(0);
  const forceReload = () => {
    setEditorKey1((prev) => prev + 1);
    setEditorKey2((prev) => prev + 1);
  };

  const t = useTranslations("dashboard.scripts.detail");

  // Fetch version
  const {
    data: scriptInfo,
    setData: setScriptInfo,
    loading: scriptInfoLoading,
    error: scriptInfoError,
  } = useFetchScriptInfo(userId, scriptId);

  const [version1, setVersion1] = useState<number>(-1.0);
  const [version2, setVersion2] = useState<number>(-1.0);

  useEffect(() => {
    const fetchData = async () => {
      setVersion2(scriptInfo?.version?.[0] ? scriptInfo.version[0] : -1.0);
    };
    fetchData();
  }, [scriptInfo]);

  // Fetch file data
  const {
    data: fileData1,
    setData: setFileData1,
    reload: reloadFileData1,
  } = useFetchScriptFile(userId, scriptId, version1);

  const {
    data: fileData2,
    setData: setFileData2,
    reload: reloadFileData2,
  } = useFetchScriptFile(userId, scriptId, version2);

  const normalizeText = (text: string | null): string => {
    if (!text) return "";
    return text
      .replace(/\r\n/g, "\n") // Convert CRLF -> LF
      .split("\n")
      .map((line) => line.trim().replace(/,$/, ""))
      .filter((line) => line !== "")
      .join("\n")
      .trim();
  };

  // Function to compare and highlight differences
  const compareTexts = (): void => {
    if (
      !leftEditorRef.current ||
      !rightEditorRef.current ||
      !fileData1 ||
      !fileData2
    )
      return;

    const normalizedFileData1 = normalizeText(fileData1);
    const normalizedFileData2 = normalizeText(fileData2);
    const diffResult = diffLines(normalizedFileData1, normalizedFileData2);

    leftDecorations.current = [];
    rightDecorations.current = [];
    let lineNumber1 = 1;
    let lineNumber2 = 1;

    diffResult.forEach((part) => {
      let lines = part.value.split("\n").length;

      if (part.removed) {
        leftDecorations.current.push({
          range: new monaco.Range(lineNumber1, 1, lineNumber1 + lines - 1, 1),
          options: { className: "removed-line" },
        });
      } else if (part.added) {
        rightDecorations.current.push({
          range: new monaco.Range(lineNumber2, 1, lineNumber2 + lines - 1, 1),
          options: { className: "added-line" },
        });
      }

      lineNumber1 +=
        !part.added && !part.removed ? lines - 1 : !part.added ? lines - 1 : 0;

      lineNumber2 +=
        !part.removed && !part.added
          ? lines - 1
          : !part.removed
          ? lines - 1
          : 0;
    });

    forceReload();
  };

  useEffect(() => {
    if (fileData1 && fileData2) compareTexts();
  }, [fileData1, fileData2]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="container mx-auto px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("versionCompare.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Editor Section */}
              <div className="flex flex-col space-y-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm" className="w-fit">
                      <Book className="mr-2 h-4 w-4" />
                      {t("code.version", {
                        version: version1 === -1.0 ? "" : version1.toFixed(1),
                      })}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[200px]">
                    {scriptInfo?.version
                      ?.slice()
                      .sort((a, b) => b - a)
                      .map((version, index) => (
                        <DropdownMenuItem
                          key={index}
                          disabled={
                            version === version1 || version === version2
                          }
                          onClick={() => {
                            setVersion1(version);
                            reloadFileData1?.();
                          }}
                        >
                          {t("code.version", { version: version.toFixed(1) })}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="h-[700px] w-full border rounded-md overflow-hidden">
                  <Editor
                    key={editorKey1}
                    height="100%"
                    width="100%"
                    language="json"
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    value={fileData1 || "{}"}
                    options={{
                      inlineSuggest: { enabled: true },
                      fontSize: 16,
                      formatOnType: true,
                      autoClosingBrackets: "always",
                      minimap: { enabled: false },
                      readOnly: true,
                    }}
                    onMount={(editor) => {
                      leftEditorRef.current = editor;
                      leftEditorRef.current.deltaDecorations(
                        [],
                        leftDecorations.current
                      );
                    }}
                  />
                </div>
              </div>

              {/* Right Editor Section */}
              <div className="flex flex-col space-y-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm" className="w-fit">
                      <Book className="mr-2 h-4 w-4" />
                      {t("code.version", {
                        version: version2 === -1.0 ? "" : version2.toFixed(1),
                      })}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[200px]">
                    {scriptInfo?.version
                      ?.slice()
                      .sort((a, b) => b - a)
                      .map((version, index) => (
                        <DropdownMenuItem
                          key={index}
                          disabled={
                            version === version1 || version === version2
                          }
                          onClick={() => {
                            setVersion2(version);
                            reloadFileData2?.();
                          }}
                        >
                          {t("code.version", { version: version.toFixed(1) })}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="h-[700px] w-full border rounded-md overflow-hidden">
                  <Editor
                    key={editorKey2}
                    height="100%"
                    width="100%"
                    language="json"
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    value={fileData2 || "{}"}
                    options={{
                      inlineSuggest: { enabled: true },
                      fontSize: 16,
                      formatOnType: true,
                      autoClosingBrackets: "always",
                      minimap: { enabled: false },
                      readOnly: true,
                    }}
                    onMount={(editor) => {
                      rightEditorRef.current = editor;
                      rightEditorRef.current.deltaDecorations(
                        [],
                        rightDecorations.current
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VersionCompareTab;
