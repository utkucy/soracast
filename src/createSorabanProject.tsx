import { ActionPanel, Form, Action, showToast, Toast } from "@raycast/api";
import { runStellarCommand } from "./utils/soraban";

export default function CreateSorobanProject() {
  async function handleSubmit({ projectName }: { projectName: string }) {
    try {
      await showToast({ style: Toast.Style.Animated, title: "Creating Soroban project..." });

      const result = await runStellarCommand(`contract init ${projectName}`);

      await showToast({
        style: Toast.Style.Success,
        title: "Soroban project created",
        message: `Project '${projectName}' created successfully`,
      });

      console.log(result);
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
    </Form>
  );
}
