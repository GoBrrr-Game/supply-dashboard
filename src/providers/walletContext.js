import React, { createContext, useContext, useState } from 'react';
import { connectWallet } from '../utils/walletConnect';

const WalletContext = createContext();

export function WalletProvider({ children }) {
    const [walletAddress, setWalletAddress] = useState(null);

    const handleConnectWallet = async (providerType) => {
        try {
            const provider = await connectWallet(providerType);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setWalletAddress(address);
            localStorage.setItem('walletAddress', address);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    const handleDisconnect = () => {
        setWalletAddress(null);
        localStorage.removeItem('walletAddress');
    };

    return (
        <WalletContext.Provider value={{ walletAddress, setWalletAddress, handleConnectWallet, handleDisconnect }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => useContext(WalletContext);
