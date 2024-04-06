// Function to calculate balance changes for each token type for a specific owner address
import SolflareService from "../../services/solflare";

// Function to calculate balance changes for each token type for a specific owner address
export async function calculateTokenBalanceChanges(preBalances:any, postBalances:any, ownerAddress:any, hash: any, timestamp:any) {
    const tokenTransactions = [];

    // Filter balances for the specified owner
    const filteredPreBalances = preBalances.filter((balance: any) => {
        return balance.owner === ownerAddress;
    });
    const filteredPostBalances = postBalances.filter((balance:any) => balance.owner === ownerAddress);

    // Iterate over preBalances to calculate net changes
    for (const preBalance of filteredPreBalances) {
        const postBalance = filteredPostBalances.find((balance:any) => balance.mint === preBalance.mint);
        const value = postBalance 
            ? postBalance.uiTokenAmount.uiAmount - preBalance.uiTokenAmount.uiAmount
            : -preBalance.uiTokenAmount.uiAmount; // If no postBalance, the entire amount was deducted

            const preSymbol: string = await SolflareService.getSymbol(preBalance?.mint ?? '') || '';

        tokenTransactions.push({
            timestamp,
            symbol:preSymbol,
            quantity:'',
            type: '',
            price:'',
            value,
            hash
        });
    }

    // Check for any new tokens added that weren't in preBalances
    for (const postBalance of filteredPostBalances) {
        const postSymbol = await SolflareService.getSymbol(postBalance?.mint ?? '') || ''
        if (!filteredPreBalances.find((balance:any)  => balance.mint === postBalance.mint)) {
            tokenTransactions.push({
            timestamp,
            symbol:postSymbol,
            quantity:'',
            type: '',
            price:'',
            value:postBalance.uiTokenAmount.uiAmount, // Entire postBalance is the net addition,
            hash // Entire postBalance is the net addition
            });
        }
    }

    console.log(tokenTransactions)
    return tokenTransactions;
}