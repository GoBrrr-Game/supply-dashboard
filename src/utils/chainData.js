export const fetchTokenHoldHistory = async (address) => {
    const baseUrl = process.env.REACT_APP_IS_TESTNET === 'true'
        ? 'https://api-sepolia.etherscan.io/api'
        : 'https://api.etherscan.io/api';

    const url = `${baseUrl}?module=account&action=tokentx&contractaddress=${process.env.REACT_APP_TOKEN_ADDRESS}&address=${address}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "1") {
            return data.result;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};