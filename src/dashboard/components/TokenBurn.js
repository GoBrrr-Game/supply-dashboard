import * as React from 'react';
import { formatEther } from 'ethers';
import { DataGrid } from '@mui/x-data-grid';

import { useQuery, gql } from '@apollo/client';

import { formatNumberWithCommas } from '../../utils/number';

// Define your GraphQL query
const GET_TOKEN_BURNS = gql`
  query {
    tokenBurns( orderBy: timestamp, orderDirection: desc) {
        id
        from
        amount
        timestamp
    }
  }
`;

const columns = [
  { field: 'from', headerName: 'Address', flex: 1.5, minWidth: 200 },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 1,
    minWidth: 120,
    renderCell: (params) =>
      <div>
        {formatNumberWithCommas(parseFloat(formatEther(params.value)).toFixed(2).toString())}
      </div>
  },
  {
    field: 'id',
    headerName: 'Transaction',
    flex: 0.5,
    minWidth: 300,
    renderCell: (params) =>
      <div>
        <a href={`https://etherscan.io/tx/${params.value.split('-')[0]}`}>{params.value.slice(0, 30)}...</a>
      </div>,
  },
  {
    field: 'timestamp',
    headerName: 'Date',
    flex: 1,
    minWidth: 100,
    renderCell: (params) => {
      const date = new Date(parseInt(params.value) * 1000);
      const formattedDate = date.toLocaleDateString();
      return <div>
        {formattedDate}
      </div>
    }
  }
];


export default function TokenBurn() {
  const { loading, error, data } = useQuery(GET_TOKEN_BURNS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <DataGrid
      rows={data.tokenBurns}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
