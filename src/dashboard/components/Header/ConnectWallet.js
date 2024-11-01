import React, { useState } from 'react'
import { Button, Menu, MenuItem, Typography, Box } from '@mui/material'
import { AccountBalanceWallet, ExpandMore } from '@mui/icons-material'

// Placeholder function for wallet connection
const connectWallet = async (walletType) => {
  // In a real application, this would interact with the chosen wallet
  console.log(`Connecting to ${walletType}...`)
  return '0x1234...5678' // Simulated wallet address
}

export default function WalletConnect() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleConnectWallet = async (walletType) => {
    const address = await connectWallet(walletType)
    setWalletAddress(address)
    handleClose()
  }

  const handleDisconnect = () => {
    setWalletAddress(null)
  }

  return (
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
        <MenuItem onClick={() => handleConnectWallet('MetaMask')}>MetaMask</MenuItem>
        <MenuItem onClick={() => handleConnectWallet('WalletConnect')}>WalletConnect</MenuItem>
        <MenuItem onClick={() => handleConnectWallet('Coinbase Wallet')}>Coinbase Wallet</MenuItem>
      </Menu>
      {walletAddress && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Connected: {walletAddress}
        </Typography>
      )}
    </Box>
  )
}
