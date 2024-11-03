// src/utils/walletConnect.js
import { Web3Provider } from "@ethersproject/providers"; // Import Web3Provider only
import WalletConnectProvider from "@walletconnect/web3-provider";

export const connectWallet = async (providerType) => {
    let provider;

    if (providerType === "metamask") {
        if (window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            provider = new Web3Provider(window.ethereum); // Use Web3Provider with MetaMask
        } else {
            throw new Error("MetaMask not detected");
        }
    } else if (providerType === "walletconnect") {
        const walletConnectProvider = new WalletConnectProvider({
            infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
        });

        await walletConnectProvider.enable(); // Enable WalletConnect session
        provider = new Web3Provider(walletConnectProvider); // Use Web3Provider with WalletConnect
    } else if (providerType === "coinbase") {
        if (window.coinbaseWallet) {
            await window.coinbaseWallet.request({ method: "eth_requestAccounts" });
            provider = new Web3Provider(window.coinbaseWallet); // Use Web3Provider with Coinbase Wallet
        } else {
            throw new Error("Coinbase Wallet not detected");
        }
    } else {
        throw new Error("Invalid provider type");
    }

    return provider;
};
