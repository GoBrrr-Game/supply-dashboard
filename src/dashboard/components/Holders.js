import * as React from 'react';
import { formatEther } from 'ethers';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery, gql } from '@apollo/client';

import { formatNumberWithCommas } from '../../utils/number';

const GET_TOKEN_HOLDERS = gql`
  query {
    tokenHolders( orderBy: balance, orderDirection: desc){
        id
        balance
    }
  }
`;


const columns = [
    { field: 'id', headerName: 'Address', flex: 1.5, minWidth: 200 },
    {
        field: 'balance',
        headerName: 'Amount',
        flex: 1,
        minWidth: 120,
        renderCell: (params) =>
            <div>
                {formatNumberWithCommas(parseFloat(formatEther(params.value)).toFixed(2).toString())}
            </div>
    }
];


export default function TokenHolders() {
    const { loading, error, data } = useQuery(GET_TOKEN_HOLDERS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <DataGrid
            rows={data.tokenHolders}
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
