import * as React from 'react';
import { formatEther } from 'ethers';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';

import TokenBurn from './TokenBurn';
import Holders from './Holders';

import HighlightedCard from './HighlightedCard';
import CustomizedChart from './CustomizedChart';
import StatCard from './StatCard';
import InitialSupplyCard from './InitialSupplyCard';

import { useQuery, gql } from '@apollo/client';

import { formatNumberWithCommas } from '../../utils/number';

// Define your GraphQL query
const GET_TOKEN_DATA = gql`
  query {
    tokenStats {
        id
        totalSupply
        currentSupply
        totalHolderCount
    }
    circulatingSupplies(first: 30, orderBy: date, orderDirection: desc){
      id
      date
      supply
    }
  }
`;
const dataSample = [
  {
    title: 'Burnt Today',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
];

export default function MainGrid() {
  const { loading, error, data } = useQuery(GET_TOKEN_DATA);
  const tokenStats = {
    title: 'Holders',
    value: parseInt(data?.tokenStats[0]?.totalHolderCount),
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  };

  if (loading) return <div>Loading...</div>

  const circulatingSuppliesHistory = data?.circulatingSupplies.map(data => parseFloat(formatEther(data.supply))).reverse();
  const circulatingSuppliesChartData = Array(30 - circulatingSuppliesHistory.length).fill(0).concat(circulatingSuppliesHistory);
  const circulatingSupplyDecreasePercent = ((circulatingSuppliesHistory[circulatingSuppliesHistory.length - 1] - circulatingSuppliesHistory[0])
    / circulatingSuppliesHistory[0] * 100).toFixed(2).toString();

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <InitialSupplyCard
            title='Initital Supply'
            value={`${formatNumberWithCommas(parseFloat(formatEther(data?.tokenStats[0]?.totalSupply)).toString())} $BRRR`}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard {...tokenStats} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard {...dataSample[0]} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomizedChart
            title='Circulating Supply'
            value={`${formatNumberWithCommas(parseFloat(formatEther(data?.tokenStats[0]?.currentSupply)).toString())} $BRRR`}
            subValueType={circulatingSupplyDecreasePercent > 0 ? 'error' : 'success'}
            subValue={`${circulatingSupplyDecreasePercent}%`}
            chartData={circulatingSuppliesChartData} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomizedChart title='Your Balance' />
        </Grid>
      </Grid>

      <div>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Burn History
        </Typography>
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <TokenBurn />
          </Grid>
        </Grid>
      </div>
      <div>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Holders
        </Typography>
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <Holders />
          </Grid>
        </Grid>
      </div>

      <Copyright sx={{ my: 4 }} />
    </Box >
  );
}
