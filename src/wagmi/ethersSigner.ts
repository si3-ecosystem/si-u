import { providers } from "ethers";
import { Config, getConnectorClient } from "@wagmi/core";
import type { Account, Chain, Client, Transport } from "viem";

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);

  return signer;
}

export async function getEthersSigner(
  config: Config,
  { chainId }: { chainId?: number } = {},
) {
  const client = await getConnectorClient(config, { chainId });

  return clientToSigner(client);
}
