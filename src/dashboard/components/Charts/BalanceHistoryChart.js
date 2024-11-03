import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

function AreaGradient({ color, id }) {
    return (
        <defs>
            <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
        </defs>
    );
}

AreaGradient.propTypes = {
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
};

function getLast30Days() {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 30; i++) {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - i);

        const dayString = pastDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });

        days.push(dayString);
    }

    return days.reverse(); // Reverse to show oldest date first
}

function BalanceHistoryChart({ title, value, subValue, subValueType, chartData }) {
    const theme = useTheme();
    const data = getLast30Days();

    const colorPalette = [
        theme.palette.primary.light,
        theme.palette.primary.main,
        theme.palette.primary.dark,
    ];
    console.log(chartData)
    return (
        <Card variant="outlined" sx={{ width: '100%' }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    {title}
                </Typography>
                <Stack sx={{ justifyContent: 'space-between' }}>
                    <Stack
                        direction="row"
                        sx={{
                            alignContent: { xs: 'center', sm: 'flex-start' },
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Typography variant="h4" component="p">
                            {value}
                        </Typography>
                        <Chip size="small" color={subValueType} label={subValue} />
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Sessions per day for the last 30 days
                    </Typography>
                </Stack>
                <LineChart
                    colors={colorPalette}
                    xAxis={[
                        {
                            scaleType: 'point',
                            data,
                            tickInterval: (index, i) => (i + 1) % 5 === 0,
                        },
                    ]}
                    yAxis={[
                        {
                            valueFormatter: (value) => {
                                if (value >= 1000000) {
                                    return `${(value / 1000000).toFixed(0)}M`; // Convert to thousands
                                }
                                return value.toString();
                            }
                        },
                    ]}
                    series={[
                        {
                            id: 'referral',
                            label: 'Circulating Supply',
                            showMark: false,
                            curve: 'linear',
                            area: true,
                            data: chartData ? chartData : [],
                        },
                    ]}
                    height={250}
                    margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
                    grid={{ horizontal: true }}
                    sx={{
                        '& .MuiAreaElement-series-organic': {
                            fill: "url('#referral')",
                        },
                        '& .MuiAreaElement-series-referral': {
                            fill: "url('#referral')",
                        },
                        '& .MuiAreaElement-series-direct': {
                            fill: "url('#referral')",
                        },
                    }}
                    slotProps={{
                        legend: {
                            hidden: true,
                        },
                    }}
                >
                    <AreaGradient color={theme.palette.primary.dark} id="organic" />
                    <AreaGradient color={theme.palette.primary.main} id="referral" />
                    <AreaGradient color={theme.palette.primary.light} id="referral" />
                </LineChart>
            </CardContent>
        </Card>
    );
}

BalanceHistoryChart.propTypes = {
    title: PropTypes.string.isRequired,
};

export default BalanceHistoryChart;