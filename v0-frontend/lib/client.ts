import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";

// Create public client that works on server and client
export const client = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

// Safely create wallet client only in browser environment
export const walletClient =
  typeof window !== "undefined"
    ? createWalletClient({
        chain: celoAlfajores,
        transport: custom(window.ethereum),
      })
    : null;
