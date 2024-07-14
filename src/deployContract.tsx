import { ActionPanel, Form, Action, showToast, Toast, getPreferenceValues } from "@raycast/api";
import { runStellarCommand } from "./utils/soraban";
import path from "path";
import { useState, useEffect } from "react";
import fs from "fs/promises";
import os from "os";

interface Preferences {
  contractDirectories: string;
}

interface WasmFile {
  name: string;
  path: string;
}

export default function DeployContract() {
  const [keys, setKeys] = useState<string[]>([]);
  const [wasmFiles, setWasmFiles] = useState<WasmFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedWasm, setSelectedWasm] = useState<string>("");

  useEffect(() => {
    fetchKeys();
    searchWasmFiles();
  }, []);

  async function fetchKeys() {
    try {
      const result = await runStellarCommand("keys ls");
      const fetchedKeys = result.split("\n").filter(Boolean);
      setKeys(fetchedKeys);
      if (fetchedKeys.length > 0) {
        setSelectedSource(fetchedKeys[0]);
      }
    } catch (error) {
      console.error("Error fetching keys:", error);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch keys",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async function searchWasmFiles() {
    try {
      const homeDir = os.homedir();
      const preferences = getPreferenceValues<Preferences>();
      const userDirs = preferences.contractDirectories
        .split(",")
        .map((dir) => dir.trim())
        .filter(Boolean)
        .map((dir) => (path.isAbsolute(dir) ? dir : path.join(homeDir, dir)));

      const searchDirs = [...userDirs];

      const wasmFiles: WasmFile[] = [];

      for (const dir of searchDirs) {
        await searchDirectory(dir, wasmFiles);
      }

      setWasmFiles(wasmFiles);
      if (wasmFiles.length > 0) {
        setSelectedWasm(wasmFiles[0].path);
      }
    } catch (error) {
      console.error("Error searching for WASM files:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function searchDirectory(dir: string, wasmFiles: WasmFile[]) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await searchDirectory(fullPath, wasmFiles);
        } else if (entry.isFile() && entry.name.endsWith(".wasm")) {
          wasmFiles.push({ name: entry.name, path: fullPath });
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
    }
  }

  async function handleSubmit({ network }: { network: string }) {
    try {
      if (!selectedSource) {
        throw new Error("No source account selected");
      }
      if (!selectedWasm) {
        throw new Error("No WASM file selected");
      }

      await showToast({ style: Toast.Style.Animated, title: "Deploying contract..." });

      const command = `contract deploy --wasm "${selectedWasm}" --source ${selectedSource} --network ${network}`;
      const result = await runStellarCommand(command);

      await showToast({
        style: Toast.Style.Success,
        title: "Contract deployed",
        message: `Contract deployed successfully`,
      });

      console.log("Deployment result:", result);
    } catch (error) {
      console.error("Deployment error:", error);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to deploy contract",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="wasm" title="WASM File" value={selectedWasm} onChange={setSelectedWasm}>
        {wasmFiles.map((file) => (
          <Form.Dropdown.Item key={file.path} value={file.path} title={file.name} />
        ))}
      </Form.Dropdown>
      <Form.Dropdown id="source" title="Source Account" value={selectedSource} onChange={setSelectedSource}>
        {keys.map((key) => (
          <Form.Dropdown.Item key={key} value={key} title={key} />
        ))}
      </Form.Dropdown>
      <Form.Dropdown id="network" title="Network">
        <Form.Dropdown.Item value="testnet" title="Testnet" />
        <Form.Dropdown.Item value="futurenet" title="Futurenet" />
        <Form.Dropdown.Item value="mainnet" title="Mainnet" />
      </Form.Dropdown>
    </Form>
  );
}
