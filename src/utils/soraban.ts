import { exec } from "child_process";

import { getPreferenceValues } from "@raycast/api";

export function getOpenAIApiKey() {
  const preferences = getPreferenceValues();
  return preferences.openaiApiKey as string;
}
import { promisify } from "util";
import { showToast, Toast, Alert, confirmAlert, open } from "@raycast/api";
import path from "path";
import os from "os";
import fs from "fs/promises";

const execAsync = promisify(exec);

async function findExecutable(name: string): Promise<string | null> {
  const commonPaths = [
    "/usr/local/bin",
    "/opt/homebrew/bin",
    path.join(os.homedir(), ".cargo/bin"),
    "/usr/bin",
    "/bin",
  ];

  for (const dir of commonPaths) {
    const filePath = path.join(dir, name);
    try {
      await fs.access(filePath, fs.constants.X_OK);
      return filePath;
    } catch (error) {
      console.log(error);
      // File doesn't exist or isn't executable, continue to next path
    }
  }

  return null;
}

async function checkStellarCLIInstalled(): Promise<boolean> {
  return (await findExecutable("stellar")) !== null;
}

async function promptInstallation(tool: string, url: string): Promise<void> {
  const options: Alert.Options = {
    title: `${tool} is not installed`,
    message: `${tool} is required but not found on your system. Would you like to open the installation page?`,
    primaryAction: {
      title: "Open Installation Page",
      onAction: () => open(url),
    },
    dismissAction: {
      title: "Cancel",
    },
  };

  const alert = await confirmAlert(options);
  if (alert) {
    throw new Error(`${tool} is required but not installed.`);
  }
}

export async function runStellarCommand(command: string, pathOption?: string): Promise<string> {
  try {
    const isStellarCLIInstalled = await checkStellarCLIInstalled();
    if (!isStellarCLIInstalled) {
      await promptInstallation(
        "Stellar CLI",
        "https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup",
      );
      throw new Error("Please install Stellar CLI and try again.");
    }

    const stellarPath = await findExecutable("stellar");
    const { stdout, stderr } = await execAsync(`${stellarPath} ${command}`, {
      // shell: "/bin/bash",
      shell: process.env.SHELL,
      cwd: pathOption, // Run the command in the user's desktop directory
    });

    if (stderr) {
      console.error("Command stderr:", stderr);
    }
    return stdout;
  } catch (error) {
    console.error("Error running Stellar command:", error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to run Stellar command",
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function createProjectinDesktopAndInitContract(projectName: string): Promise<void> {
  try {
    await showToast({ style: Toast.Style.Animated, title: "Creating Soroban project..." });

    const desktopPath = path.join(os.homedir(), "Desktop");
    const projectPath = path.join(desktopPath, projectName);

    // Create project directory on desktop
    await fs.mkdir(projectPath, { recursive: true });

    // Run the Stellar CLI command in the created directory
    const result = await runStellarCommand(`soroban contract init ${projectName}`);
    console.log("Command result:", result);

    // Check if the project was created successfully
    const files = await fs.readdir(projectPath);
    if (files.length > 0) {
      await showToast({
        style: Toast.Style.Success,
        title: "Soroban project created",
        message: `Project '${projectName}' created successfully on Desktop`,
      });
    } else {
      throw new Error("Project directory is empty after command execution");
    }
  } catch (error) {
    console.error("Error creating Soroban project:", error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to create Soroban project",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
