import React, { useEffect, useState } from 'react';
import { formatEther } from 'ethers';
import { BigNumber } from 'bignumber.js';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';

import TokenBurn from './TokenBurn';
import Holders from './Holders';

import BurnActionCard from './BurnActionCard';
import CirculatingSupplyChart from './Charts/CirculatingSupplyChart';
import BalanceHistoryChart from './Charts/BalanceHistoryChart';
import StatCard from './StatCard';
import InitialSupplyCard from './InitialSupplyCard';

import { useQuery, gql } from '@apollo/client';

import { useWallet } from '../../providers/walletContext';
import { formatNumberWithCommas, getCurrentDateFormatted } from '../../utils/number';
import { fetchTokenHoldHistory } from '../../utils/chainData';

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
  const { walletAddress } = useWallet();
  //const walletAddress = '0x873e6e61b5abbd00dd92e4cd59a4920421c0a863';
  const [userTokenHistoryData, setUserTokenHistoryData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!walletAddress) return; // Do nothing if there's no wallet address
      try {
        const data = await fetchTokenHoldHistory(walletAddress);
        setUserTokenHistoryData(data);
      } catch (err) {
      }
    };

    loadUserData();
  }, [walletAddress]);

  let userTokenHistoryChartData = [];
  if (userTokenHistoryData) {
    const balanceData = {};
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      balanceData[dateString] = new BigNumber(0).toString();
    }

    // Process each transaction
    userTokenHistoryData.forEach(transaction => {
      const value = new BigNumber(transaction.value);
      const date = new Date(transaction.timeStamp * 1000);
      const dateString = date.toISOString().split('T')[0];

      if (transaction.to.toLowerCase() === walletAddress.toLowerCase()) {
        balanceData[dateString] = new BigNumber(balanceData[dateString]).plus(value.dividedBy(new BigNumber(10).pow(18))).toString();
      } else if (transaction.from.toLowerCase() === walletAddress.toLowerCase()) {
        balanceData[dateString] = new BigNumber(balanceData[dateString]).minus(value.dividedBy(new BigNumber(10).pow(18))).toString();
      }
    });

    let previousBalance = new BigNumber(0);
    const sortedDates = Object.keys(balanceData).sort();
    sortedDates.forEach(date => {
      balanceData[date] = new BigNumber(balanceData[date]).plus(previousBalance).toString();
      previousBalance = new BigNumber(balanceData[date]);
    });

    userTokenHistoryChartData = Object.values(balanceData).map(value => Number(value)).reverse();;
  }
  const userTokenHistoryIncreasePercent = userTokenHistoryChartData[0] === 0
    ? (userTokenHistoryChartData[userTokenHistoryChartData.length - 1] === 0 ? 0 : 100)
    : (((userTokenHistoryChartData[userTokenHistoryChartData.length - 1] - userTokenHistoryChartData[0]) / userTokenHistoryChartData[0]) * 100).toFixed(2);


  if (loading) return <div>Loading...</div>

  const last30Days = Array.from({ length: 30 }, (_, index) =>
    dayjs().subtract(index, 'day').format('YYYY-MM-DD')
  ).reverse();

  //Get Circulating Supply dataf
  const circulatingSupplies = data?.circulatingSupplies.map(data => ({
    date: new Date(data.date).toISOString().split('T')[0],
    supply: parseFloat(formatEther(data.supply)),
  })).reverse();

  let lastKnownValue = 0;

  const circulatingSuppliesChartData = Array.from({ length: 30 }, (_, i) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (29 - i));
    const formattedDate = targetDate.toISOString().split('T')[0];

    const entry = circulatingSupplies.find(supplyData => supplyData.date === formattedDate);

    if (entry) {
      lastKnownValue = entry.supply;
    }

    return entry ? entry.supply : lastKnownValue;
  });
  const circulatingSupplyDecreasePercent = (
    circulatingSuppliesChartData[0] !== 0 ? (
      ((circulatingSuppliesChartData[circulatingSuppliesChartData.length - 1] - circulatingSuppliesChartData[0])
        / circulatingSuppliesChartData[0]) * 100
    ).toFixed(2) : (
      circulatingSuppliesChartData[circulatingSuppliesChartData.length - 1] !== 0 ?
        ((circulatingSuppliesChartData[circulatingSuppliesChartData.length - 1] - circulatingSuppliesChartData[circulatingSuppliesChartData.length - 1]) / circulatingSuppliesChartData[circulatingSuppliesChartData.length - 1]) * 100
        : '0.00'
    )
  );

  //Getting Holder Count History
  const holderCountHistories = data?.holderCountHistories || [];
  const holderCountMap = holderCountHistories.reduce((acc, history) => {
    acc[dayjs(history.date).format('YYYY-MM-DD')] = parseInt(history.count);
    return acc;
  }, {});

  const holderCountHistoriesChartData = [];
  let lastKnownCount = 0;
  last30Days.forEach(date => {
    if (holderCountMap[date] !== undefined) {
      lastKnownCount = holderCountMap[date];
    }
    holderCountHistoriesChartData.push(lastKnownCount);
  });
  const holderCountIncreasePercent = holderCountHistoriesChartData[0] === 0
    ? (holderCountHistoriesChartData[holderCountHistoriesChartData.length - 1] === 0 ? 0 : 100)
    : (((holderCountHistoriesChartData[holderCountHistoriesChartData.length - 1] - holderCountHistoriesChartData[0]) / holderCountHistoriesChartData[0]) * 100).toFixed(2);


  //Get Burn History
  const burnHistories = data?.burnHistories.map(data => ({
    date: new Date(data.date).toISOString().split('T')[0],
    burnedAmount: parseFloat(formatEther(data.burnedAmount)),
  })).reverse();
  const burnHistoriesChartData = Array.from({ length: 30 }, (_, i) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (29 - i)); // Calculate the past 30 days

    const formattedDate = targetDate.toISOString().split('T')[0];
    const entry = burnHistories.find(history => history.date === formattedDate);

    return entry ? entry.burnedAmount : 0; // Use the burned amount if date matches; otherwise, 0
  });

  //Get Burned Today
  const burnedTodayData = data?.burnHistories.find(history => history.id === getCurrentDateFormatted());
  const burnedToday = burnedTodayData ? burnedTodayData.burnedAmount : '0';

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
            value: `${formatNumberWithCommas(parseFloat(formatEther(burnedToday)).toString())} $BRRR`,
            interval: 'Last 30 days',
            trendValue: null,
            trend: 'up',
            data: burnHistoriesChartData
          }} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <BurnActionCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CirculatingSupplyChart
            title='Circulating Supply'
            value={`${formatNumberWithCommas(parseFloat(formatEther(data?.tokenStats[0]?.currentSupply)).toString())} $BRRR`}
            subValueType={circulatingSupplyDecreasePercent > 0 ? 'error' : 'success'}
            subValue={`${circulatingSupplyDecreasePercent}%`}
            chartData={circulatingSuppliesChartData} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {walletAddress &&
            <BalanceHistoryChart title='Your Balance'
              value={`${formatNumberWithCommas(parseFloat(userTokenHistoryChartData[userTokenHistoryChartData.length - 1]).toFixed(2).toString())} $BRRR`}
              subValue={`${userTokenHistoryIncreasePercent} %`}
              subValueType={userTokenHistoryIncreasePercent < 0 ? 'error' : 'success'}
              chartData={userTokenHistoryChartData} />}
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
