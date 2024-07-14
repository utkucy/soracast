import { List, ActionPanel, Action, showToast, Toast, Clipboard } from "@raycast/api";
import { runStellarCommand } from "./utils/soraban";
import { useState, useEffect } from "react";

interface KeyInfo {
  name: string;
  address: string;
}

export default function ListKeys() {
  const [keys, setKeys] = useState<KeyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    setIsLoading(true);
    try {
      const result = await runStellarCommand("keys ls");
      const keyNames = result.split("\n").filter(Boolean);

      const keyInfoPromises = keyNames.map(async (name) => {
        const address = await runStellarCommand(`keys address ${name}`);
        return { name, address: address.trim() };
      });

      const keyInfos = await Promise.all(keyInfoPromises);
      setKeys(keyInfos);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to list keys",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function copyAddress(address: string) {
    try {
      await Clipboard.copy(address);
      await showToast({
        style: Toast.Style.Success,
        title: "Address Copied",
        message: "Public key copied to clipboard",
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to copy address",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <List isLoading={isLoading}>
      <List.EmptyView title="No keys found" description="You haven't created any Stellar keys yet." />
      {keys.map((key, index) => (
        <List.Item
          key={index}
          title={key.name}
          subtitle={key.address}
          accessories={[{ text: "Copy", icon: "clipboard-16" }]}
          actions={
            <ActionPanel>
              <Action title="Copy Public Key" onAction={() => copyAddress(key.address)} />
              <Action title="Refresh List" onAction={fetchKeys} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
