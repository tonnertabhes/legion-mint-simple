import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const MetaMask = new InjectedConnector({});

export const WalletConnect = new WalletConnectConnector({
  rpc: {
    1: "https://mainnet.infura.io/v3/0e494fb6fc0c453bb4ad876a4c1c7538",
  },
  bridge: "https://bridge.walletconnect.org",
});

export function resetWalletConnectConnector(connector) {
  if (connector && connector instanceof WalletConnectConnector) {
    connector.walletConnectProvider = undefined;
  }
}
