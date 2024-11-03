import React, { useState } from 'react';
import { Button, Menu, MenuItem, Typography, Box } from '@mui/material';
import { AccountBalanceWallet, ExpandMore } from '@mui/icons-material';
import { useWallet } from '../../../providers/walletContext';

export default function WalletConnect() {
  const { walletAddress, setWalletAddress, handleConnectWallet, handleDisconnect } = useWallet();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const connectWalletAndUpdate = async (providerType) => {
    await handleConnectWallet(providerType);
    setWalletAddress(localStorage.getItem('walletAddress'));
  };

  const disconnectWalletAndUpdate = () => {
    handleDisconnect();
    setWalletAddress(null);
  };

  return (
    <div>
      <Box>
        <Button
          variant="contained"
          onClick={walletAddress ? disconnectWalletAndUpdate : handleClick}
          endIcon={walletAddress ? null : <ExpandMore />}
          startIcon={<AccountBalanceWallet />}
          sx={{
            backgroundColor: walletAddress ? 'green' : 'primary.main',
            color: '#fff',
            '&:hover': {
              backgroundColor: walletAddress ? 'darkgreen' : 'primary.dark',
            },
          }}
        >
          {walletAddress ? 'Disconnect' : 'Connect Wallet'}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => connectWalletAndUpdate('metamask')}>MetaMask</MenuItem>
          <MenuItem onClick={() => connectWalletAndUpdate('walletconnect')}>WalletConnect</MenuItem>
          <MenuItem onClick={() => connectWalletAndUpdate('coinbase')}>Coinbase Wallet</MenuItem>
        </Menu>
        {walletAddress && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: 'green',
              fontWeight: 'bold',
              backgroundColor: '#f0f4f8',
              borderRadius: 1,
              padding: '4px 8px',
            }}
          >
            Connected: {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
          </Typography>
        )}
      </Box>
    </div>
  );
}
