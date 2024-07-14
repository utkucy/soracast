import { ActionPanel, Form, Action, showToast, Toast, List, useNavigation } from "@raycast/api";
import * as StellarSdk from "@stellar/stellar-sdk";
import { useState, useEffect } from "react";
import { fetchAccount } from "./utils/horizon";
import { formatPrice } from "./utils/helpers";

function AccountInfoDisplay({ accountId }: { accountId: string }) {
  const [items, setItems] = useState<{ title: string; subtitle: string }[]>([]);

  useEffect(() => {
    async function fetchAccountInfo() {
      try {
        await showToast({ style: Toast.Style.Animated, title: "Fetching account info..." });

        const serverURL = "https://horizon-testnet.stellar.org";
        const server = new StellarSdk.Horizon.Server(serverURL);

        const account = await fetchAccount(accountId, server);

        const newItems = [
          { title: "Account ID", subtitle: account.id },
          { title: "Sequence", subtitle: account.sequence },
          ...account.balances.map((balance: any) => ({
            title: `Balance (${balance.asset_type})`,
            subtitle: `${formatPrice(balance.balance, balance.asset_code || "XLM")}`,
          })),
        ];

        setItems(newItems);

        await showToast({ style: Toast.Style.Success, title: "Account info fetched successfully" });
      } catch (error) {
        console.log("Error fetching account info:", error);
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to fetch account info",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    fetchAccountInfo();
  }, [accountId]);

  return (
    <List>
      {items.map((item, index) => (
        <List.Item key={index} title={item.title} subtitle={item.subtitle} />
      ))}
    </List>
  );
}

export default function AccountInfo() {
  const { push } = useNavigation();

  async function handleSubmit({ accountId }: { accountId: string }) {
    push(<AccountInfoDisplay accountId={accountId} />);
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="accountId" title="Account ID" placeholder="Enter Stellar account ID" />
    </Form>
  );
}

// {
//   "name": "deployContract",
//   "title": "Deploy Smart Contract",
//   "description": "Deploy a Soroban smart contract",
//   "mode": "view"
// },
// {
//   "name": "keyManagement",
//   "title": "Key Management",
//   "description": "Manage Stellar keys",
//   "mode": "view"
// },
// {
//   "name": "networkManagement",
//   "title": "Network Management",
//   "description": "Manage Stellar networks",
//   "mode": "view"
// },
// {
//   "name": "eventMonitoring",
//   "title": "Event Monitoring",
//   "description": "Monitor Soroban contract events",
//   "mode": "view"
// },
// {
//   "name": "customCommands",
//   "title": "Custom Commands",
//   "description": "Manage and run custom Soroban CLI commands",
//   "mode": "view"
// }
