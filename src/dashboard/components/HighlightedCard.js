import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function HighlightedCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
        <Button
          variant="contained"
          size="small"
          color="primary"
          endIcon={<ChevronRightRoundedIcon />}
          fullWidth={isSmallScreen}
        >
          Ultimate BURN
        </Button>
      </CardContent>
    </Card>
  );
}
