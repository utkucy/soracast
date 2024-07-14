import { ActionPanel, Form, Action, showToast, Toast, List, useNavigation, Clipboard } from "@raycast/api";
import { runStellarCommand } from "./utils/soraban";
import { useState, useEffect } from "react";

function KeyList() {
  const [keys, setKeys] = useState<string[]>([]);
  const { pop } = useNavigation();

  useEffect(() => {
    listKeys();
  }, []);

  async function listKeys() {
    try {
      const result = await runStellarCommand("keys ls");
      setKeys(result.split("\n").filter(Boolean));
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to list keys",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async function removeKey(name: string) {
    try {
      await runStellarCommand(`keys remove ${name}`);
      await showToast({
        style: Toast.Style.Success,
        title: "Key removed",
        message: `Key '${name}' removed successfully`,
      });
      listKeys();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to remove key",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async function showAddress(name: string) {
    try {
      const address = await runStellarCommand(`keys address ${name}`);

      // allow address to be copied to clipboard

      await showToast({
        style: Toast.Style.Success,
        title: "Public Key",
        message: address.trim(),
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to get address",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async function copyAddress(name: string) {
    try {
      const address = await runStellarCommand(`keys address ${name}`);
      await Clipboard.copy(address.trim());
      await showToast({
        style: Toast.Style.Success,
        title: "Address Copied",
        message: `Public key for '${name}' copied to clipboard`,
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
    <List
      actions={
        <ActionPanel>
          <Action title="Refresh" onAction={listKeys} />
          <Action title="Add New Key" onAction={() => pop()} />
        </ActionPanel>
      }
    >
      {keys.map((key, index) => (
        <List.Item
          key={index}
          title={key}
          actions={
            <ActionPanel>
              <Action title="Copy Public Key" onAction={() => copyAddress(key)} />
              <Action title="Show Public Key" onAction={() => showAddress(key)} />
              <Action title="Remove Key" onAction={() => removeKey(key)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

export default function KeyManagement() {
  const { push } = useNavigation();

  async function generateKey({
    name,
    network,
    isGlobal,
    noFund,
  }: {
    name: string;
    network: string;
    isGlobal: boolean;
    noFund: boolean;
  }) {
    try {
      await showToast({ style: Toast.Style.Animated, title: "Generating key..." });

      let command = `keys generate ${name} --network ${network}`;
      if (isGlobal) command += " --global";
      if (noFund) command += " --no-fund";

      const result = await runStellarCommand(command);

      await showToast({
        style: Toast.Style.Success,
        title: "Key generated",
        message: `Key '${name}' generated successfully`,
      });

      console.log(result);
      push(<KeyList />);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to generate key",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={generateKey} />
          <Action title="List Keys" onAction={() => push(<KeyList />)} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Key Name" placeholder="Enter name for new key (e.g., alice)" />
      <Form.Dropdown id="network" title="Network">
        <Form.Dropdown.Item value="testnet" title="Testnet" />
        <Form.Dropdown.Item value="futurenet" title="Futurenet" />
        <Form.Dropdown.Item value="mainnet" title="Mainnet" />
      </Form.Dropdown>
      <Form.Checkbox id="isGlobal" label="Store globally" defaultValue={true} />
      <Form.Checkbox id="noFund" label="Do not fund account" defaultValue={false} />
    </Form>
  );
}
