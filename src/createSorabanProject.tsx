import { ActionPanel, Form, Action, showToast, Toast, getPreferenceValues } from "@raycast/api";
import { runStellarCommand } from "./utils/soraban";
import path from "path";
import os from "os";
import { useState, useEffect } from "react";

interface Preferences {
  contractDirectories: string;
}

interface Directory {
  name: string;
  path: string;
}

export default function CreateSorobanProject() {
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [selectedDirectory, setSelectedDirectory] = useState<string>("");

  useEffect(() => {
    loadDirectories();
  }, []);

  function loadDirectories() {
    const homeDir = os.homedir();
    const desktopDir = path.join(homeDir, "Desktop");

    const preferences = getPreferenceValues<Preferences>();
    const userDirs = preferences.contractDirectories
      .split(",")
      .map((dir) => dir.trim())
      .filter(Boolean)
      .map((dir) => ({
        name: path.basename(dir),
        path: path.isAbsolute(dir) ? dir : path.join(homeDir, dir),
      }));

    const allDirs = [{ name: "Desktop", path: desktopDir }, ...userDirs];

    setDirectories(allDirs);
    setSelectedDirectory(desktopDir); // Set Desktop as default
  }

  async function handleSubmit({ projectName }: { projectName: string }) {
    try {
      await showToast({ style: Toast.Style.Animated, title: "Creating Soroban project..." });

      const projectPath = path.join(selectedDirectory);

      const result = await runStellarCommand(`contract init ${projectName}`, projectPath);

      await showToast({
        style: Toast.Style.Success,
        title: "Soroban project created",
        message: `Project '${projectName}' created successfully in ${selectedDirectory}`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to create Soroban project",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="projectName" title="Project Name" placeholder="Enter project name" />
      <Form.Dropdown
        id="projectDirectory"
        title="Project Directory"
        value={selectedDirectory}
        onChange={setSelectedDirectory}
      >
        {directories.map((dir) => (
          <Form.Dropdown.Item key={dir.path} value={dir.path} title={dir.name} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
