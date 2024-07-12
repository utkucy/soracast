import { ActionPanel, Form, Action, showToast, Toast } from "@raycast/api";
import axios from "axios";
// import axios from "axios";
import StellarSdk from "stellar-sdk";

export default function FundTestnetAccount() {
  async function handleSubmit({ accountId }: { accountId: string }) {
    try {
      await showToast({ style: Toast.Style.Animated, title: "Funding account..." });

      const response = await axios.get(`https://friendbot.stellar.org?addr=${encodeURIComponent(accountId)}`);

      if (response.status === 200) {
        await showToast({
          style: Toast.Style.Success,
          title: "Account funded",
          message: `Successfully funded account ${accountId}`,
        });
      } else {
        console.log(response);
        throw new Error(`Failed to fund account: ${response.statusText}`);
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
    </Form>
  );
}
