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
    burnHistories(first: 30, orderBy: date, orderDirection: desc){
      id
      date
      burnedAmount
    }
    holderCountHistories(first: 30, orderBy: date, orderDirection: desc){
      id
      date
      count
    }
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

export default function MainGrid() {
  const { loading, error, data } = useQuery(GET_TOKEN_DATA);

  if (loading) return <div>Loading...</div>

  const circulatingSuppliesHistory = data?.circulatingSupplies.map(data => parseFloat(formatEther(data.supply))).reverse();
  const circulatingSuppliesChartData = Array(30 - circulatingSuppliesHistory.length).fill(0).concat(circulatingSuppliesHistory);
  const circulatingSupplyDecreasePercent = ((circulatingSuppliesHistory[circulatingSuppliesHistory.length - 1] - circulatingSuppliesHistory[0])
    / circulatingSuppliesHistory[0] * 100).toFixed(2).toString();

  const holderCountHistories = data?.holderCountHistories.map(data => parseInt(data.count)).reverse();
  const holderCountHistoriesChartData = Array(30 - holderCountHistories.length).fill(0).concat(holderCountHistories);
  const holderCountIncreasePercent = ((holderCountHistories[holderCountHistories.length - 1] - holderCountHistories[0])
    / holderCountHistories[0] * 100).toFixed(0).toString();

  const burnHistories = data?.burnHistories.map(data => parseFloat(formatEther(data.burnedAmount))).reverse();
  const burnHistoriesChartData = Array(30 - burnHistories.length).fill(0).concat(burnHistories);



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
          <StatCard {...{
            title: 'Holders',
            value: parseInt(data?.tokenStats[0]?.totalHolderCount),
            interval: 'Last 30 days',
            trendValue: `${holderCountIncreasePercent} %`,
            trend: 'up',
            data: holderCountHistoriesChartData
          }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard {...{
            title: 'Burned Today',
            value: formatNumberWithCommas(burnHistoriesChartData[burnHistoriesChartData.length - 1].toString()),
            interval: 'Last 30 days',
            trendValue: null,
            trend: 'up',
            data: burnHistoriesChartData
          }} />
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
      &nbsp;
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
