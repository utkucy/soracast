import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import OpenAI from "openai";
import { getOpenAIApiKey } from "./utils/soraban";

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: getOpenAIApiKey(),
});

export default function GenerateSnippet() {
  const [snippet, setSnippet] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(values: { description: string }) {
    setIsLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates Soroban smart contract code snippets.",
          },
          {
            role: "user",
            content: `Generate a Soroban smart contract code snippet for the following description:\n${values.description}`,
          },
        ],
        max_tokens: 150,
        n: 1,
        temperature: 0.7,
      });

      const generatedSnippet = response.choices[0].message.content?.trim();
      if (generatedSnippet) {
        setSnippet(generatedSnippet);
        await showToast({ style: Toast.Style.Success, title: "Snippet generated successfully" });
      } else {
        throw new Error("No snippet generated");
      }
    } catch (error) {
      console.error("Error generating snippet:", error);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to generate snippet",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
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
      <Form.TextArea
        id="description"
        title="Describe the code snippet you need"
        placeholder="E.g., A function to transfer tokens between two accounts"
      />
      {snippet && <Form.Description title="Generated Snippet" text={snippet} />}
    </Form>
  );
}
