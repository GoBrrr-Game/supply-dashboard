import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Typography, Box } from '@mui/material';
import { AccountBalanceWallet, ExpandMore } from '@mui/icons-material';
import { connectWallet } from '../../../utils/walletConnect';

export default function WalletConnect() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  // Function to retrieve wallet address from local storage
  const loadWalletAddress = () => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  };

  // Load wallet address from local storage on component mount
  useEffect(() => {
    loadWalletAddress();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConnectWallet = async (providerType) => {
    try {
      const provider = await connectWallet(providerType);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setWalletAddress(userAddress);
      localStorage.setItem('walletAddress', userAddress);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    localStorage.removeItem('walletAddress'); // Remove wallet address from local storage on disconnect
  };

  return (
    <div>
      <Box>
        <Button
          variant="contained"
          onClick={walletAddress ? handleDisconnect : handleClick}
          endIcon={walletAddress ? null : <ExpandMore />}
          startIcon={<AccountBalanceWallet />}
        >
          {walletAddress ? 'Disconnect' : 'Connect Wallet'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleConnectWallet('metamask')}>MetaMask</MenuItem>
          <MenuItem onClick={() => handleConnectWallet('walletconnect')}>WalletConnect</MenuItem>
          <MenuItem onClick={() => handleConnectWallet('coinbase')}>Coinbase Wallet</MenuItem>
        </Menu>
      </Box>
    </div>
  );
}
