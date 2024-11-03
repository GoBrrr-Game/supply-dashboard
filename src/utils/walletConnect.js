// src/utils/walletConnect.js
import { BrowserProvider } from "ethers"; // Import BrowserProvider from ethers
import WalletConnectProvider from "@walletconnect/web3-provider";

export const connectWallet = async (providerType) => {
    let provider;

    if (providerType === "metamask") {
        // Check if MetaMask is installed
        if (window.ethereum) {
            provider = new BrowserProvider(window.ethereum); // Create a new BrowserProvider using MetaMask
            await window.ethereum.request({ method: "eth_requestAccounts" }); // Request account access
        } else {
            throw new Error("MetaMask not detected");
        }
    } else if (providerType === "walletconnect") {
        // Create WalletConnect Provider
        const walletConnectProvider = new WalletConnectProvider({
            infuraId: process.env.REACT_APP_INFURA_PROJECT_ID // Replace with your Infura Project ID
        });

        // Enable session (triggers QR Code modal)
        await walletConnectProvider.enable();
        provider = new BrowserProvider(walletConnectProvider); // Create a new BrowserProvider using WalletConnect
    } else if (providerType === "coinbase") {
        // Check if Coinbase Wallet is installed
        if (window.coinbaseWallet) {
            provider = new BrowserProvider(window.coinbaseWallet); // Create a new BrowserProvider using Coinbase Wallet
            await window.coinbaseWallet.request({ method: "eth_requestAccounts" }); // Request account access
        } else {
            throw new Error("Coinbase Wallet not detected");
        }
    } else {
        throw new Error("Invalid provider type");
    }

    // Return the ethers provider
    return provider;
};
