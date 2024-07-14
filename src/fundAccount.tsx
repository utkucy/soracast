import { ActionPanel, Form, Action, showToast, Toast } from "@raycast/api";
import axios from "axios";
import StellarSdk from "stellar-sdk";

export default function FundAccount() {
  async function handleSubmit({ accountId, network }: { accountId: string; network: string }) {
    try {
      await showToast({ style: Toast.Style.Animated, title: "Funding account..." });

      let response;
      switch (network) {
        case "testnet":
          response = await axios.get(`https://friendbot.stellar.org?addr=${encodeURIComponent(accountId)}`);
          break;
        // case "futurenet":
        //   response = await axios.get(`https://friendbot-futurenet.stellar.org?addr=${encodeURIComponent(accountId)}`);
        //   break;
        // case "mainnet":
        //   throw new Error("Funding is not available for mainnet. Please use a real funding source.");
        default:
          throw new Error("Invalid network selected");
      }

      if (response && response.status === 200) {
        await showToast({
          style: Toast.Style.Success,
          title: "Account funded",
          message: `Successfully funded account ${accountId} on ${network}`,
        });
      } else {
        console.log(response);
        throw new Error(`Failed to fund account: ${response?.statusText}`);
      }
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to fund account",
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
      <Form.TextField id="accountId" title="Account ID" placeholder="Enter Stellar account ID" />
      <Form.Dropdown id="network" title="Network">
        <Form.Dropdown.Item value="testnet" title="Testnet" />
        {/* <Form.Dropdown.Item value="futurenet" title="Futurenet" />
        <Form.Dropdown.Item value="mainnet" title="Mainnet (Not Supported)" /> */}
      </Form.Dropdown>
    </Form>
  );
}
