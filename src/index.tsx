import { showHUD } from "@raycast/api";

export default async function main() {
  await showHUD("Welcome to Soracast!");
}

// import { Action, ActionPanel, List, MenuBarExtra, showToast, Toast } from "@raycast/api";
// import axios from "axios";
// import { useState } from "react";

// export default function Command() {
//   const fundAccount = async () => {
//     const toast = await showToast({
//       style: Toast.Style.Animated,
//       title: "Funding account...",
//     });

//     try {
//       const response = await axios.get(
//         `https://friendbot.stellar.org/?addr=GA2KIXIIJIHOY5HJX45NM3EEQ36XL4O73YKGCYYCVOVGBS3IRWNIQNCR`,
//       );
//       if (response.status === 200) {
//         toast.style = Toast.Style.Success;
//         toast.title = "Account funded successfully! 🎉";
//       } else {
//         toast.style = Toast.Style.Failure;
//         toast.title = "Failed to fund account.";
//       }

//       console.log(response.data);
//     } catch (error) {
//       toast.style = Toast.Style.Failure;
//       toast.title = "error";
//       //@ts-ignore
//       console.log("error", error.config.detail);
//     }
//   };

//   return (
//     <List>
//       <List.Item
//         title="Fund Account"
//         icon={"https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png"}
//         actions={
//           <ActionPanel>
//             <Action title="Fund Account" onAction={fundAccount} />
//           </ActionPanel>
//         }
//       />

//       <List.Item
//         title="Create Soroban Project"
//         icon={"https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png"}
//         actions={
//           <ActionPanel>
//             <Action title="Create New Project" onAction={fundAccount} />
//           </ActionPanel>
//         }
//       />

//       <List.Item
//         title="Deploy Contract"
//         icon={"https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png"}
//         actions={
//           <ActionPanel>
//             <Action title="Deploy Contract" onAction={fundAccount} />
//           </ActionPanel>
//         }
//       />

//       <List.Item
//         title="Run Contract Function"
//         icon={"https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png"}
//         actions={
//           <ActionPanel>
//             <Action title="Invoke Function" onAction={fundAccount} />
//           </ActionPanel>
//         }
//       />

//       <List.Item
//         title="Add Network"
//         icon={"https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png"}
//         actions={
//           <ActionPanel>
//             <Action title="Add Network" onAction={fundAccount} />
//           </ActionPanel>
//         }
//       />

//       <List.Item
//         title="View Account Info"
//         icon={"https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png"}
//         actions={
//           <ActionPanel>
//             <Action title="Account Information" onAction={fundAccount} />
//           </ActionPanel>
//         }
//       />

//       <List.Item
//         title="Generate New Keypair"
//         icon={"https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png"}
//         actions={
//           <ActionPanel>
//             <Action title="Generate Keypair" onAction={fundAccount} />
//           </ActionPanel>
//         }
//       />

//       <List.Item
//         title="View Transactions"
//         icon={"https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png"}
//         actions={
//           <ActionPanel>
//             <Action title="See Transactions" onAction={fundAccount} />
//           </ActionPanel>
//         }
//       />

//       <List.Item
//         title="Run Soraban Command"
//         icon={"https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png"}
//         actions={
//           <ActionPanel>
//             <Action title="Run Soroban Command" onAction={fundAccount} />
//           </ActionPanel>
//         }
//       />

//       {/* <List.Item
//         title="Fund Account on Stellar Testnet"
//         icon={"https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png"}
//         actions={
//           <ActionPanel>
//             <Action title="Fund Account" onAction={fundAccount} />
//           </ActionPanel>
//         }
//       />

//       <List.Item
//         title="Fund Account on Stellar Testnet"
//         icon={"https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png"}
//         actions={
//           <ActionPanel>
//             <Action title="Fund Account" onAction={fundAccount} />
//           </ActionPanel>
//         }
//       /> */}
//     </List>
//   );
// }
