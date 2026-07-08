"use client";

import { useState, useCallback } from "react";
import { Textarea, Button, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";
import { load as yamlParse, dump as yamlStringify } from "js-yaml";

type Direction = "yaml-to-json" | "json-to-yaml";

export function YamlToJsonConverter() {
  const [direction, setDirection] = useState<Direction>("yaml-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = useCallback(() => {
    setError("");
    setOutput("");
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please enter input data");
      return;
    }
    try {
      if (direction === "yaml-to-json") {
        const parsed = yamlParse(trimmed);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(trimmed);
        setOutput(yamlStringify(parsed, { indent: 2, lineWidth: -1, noRefs: true }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    }
  }, [direction, input]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex gap-2">
        <Button
          variant={direction === "yaml-to-json" ? "primary" : "secondary"}
          onClick={() => { setDirection("yaml-to-json"); setOutput(""); setError(""); }}
        >
          YAML → JSON
        </Button>
        <Button
          variant={direction === "json-to-yaml" ? "primary" : "secondary"}
          onClick={() => { setDirection("json-to-yaml"); setOutput(""); setError(""); }}
        >
          JSON → YAML
        </Button>
      </div>

      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            direction === "yaml-to-json"
              ? "name: Alice\nage: 30\nroles:\n  - admin\n  - user"
              : '{ "name": "Alice", "age": 30, "roles": ["admin", "user"] }'
          }
          rows={10}
          aria-label="Input data"
          className="font-mono text-sm"
        />
        <Button onClick={handleConvert} variant="primary" disabled={!input.trim()}>
          Convert
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mt-4">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      {output && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {direction === "yaml-to-json" ? "Formatted JSON" : "Formatted YAML"}
            </p>
            <CopyButton text={output} />
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-sm leading-6 text-zinc-900 dark:text-zinc-50">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
