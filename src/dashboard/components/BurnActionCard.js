import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

import { BrowserProvider, Contract, parseUnits } from 'ethers';
import { tokenABI } from 'src/constants/tokenABI';

export default function BurnActionCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [burnAmount, setBurnAmount] = React.useState(0);

  const callContractFunction = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required to interact with this feature.");
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new Contract(process.env.REACT_APP_TOKEN_ADDRESS, tokenABI, signer);
      const tx = await contract.burn(parseUnits(burnAmount.toString(), 18));
      await tx.wait();

      alert("Transaction successful!");
    } catch (error) {
      console.error("Error calling contract function:", error);
      alert("Failed to complete the transaction. Check console for details.");
    }
  };



  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <WhatshotIcon />
        <Typography
          component="h2"
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: '600' }}
        >
          Join the Burn
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: '8px' }}>
          Take $BRRR out of circulation forever. Every token we burn makes the rest that much more rare.
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Input slots={{ input: InputElement }} disableUnderline
            type='number'
            value={burnAmount}
            onChange={(e) => setBurnAmount(e.target.value)}
          />
          <Button
            variant="contained"
            size="small"
            color="primary"
            endIcon={<ChevronRightRoundedIcon />}
            fullWidth={isSmallScreen}
            onClick={() => callContractFunction()}
          >
            Ultimate BURN
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const InputElement = styled('input')(
  ({ theme }) => `
  width: 120px;
  margin-right: 10px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);