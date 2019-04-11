import React from 'react';




const shortHash = (hash, num, showEnd = true) => {
    const sanitized = (hash).substring(2);
    const shorten = `${sanitized.slice(0, 3)}...${showEnd ? sanitized.slice(-num) : ''}`;
    return '0x'.concat(shorten);
};

export const getEtherscanLink= ({txHash, networkId, address}) => {
    let subdomain = '';
    let etherscanLink;
    if (txHash) { 
	 etherscanLink = `https://scan.thundercore.com/transactions/${txHash}`;
    } else {
	 etherscanLink = `https://scan.thundercore.com/address/${address}`;
    }
    return etherscanLink;
}



