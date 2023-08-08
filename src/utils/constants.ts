type ContractAddress = { [key: number]: { [key: string]: string } }

export const contractAddresses: ContractAddress = {
  1: {
    sAST: '0x579120871266ccd8De6c85EF59E2fF6743E7CD15',
    AST: '0x27054b13b1B798B345b591a4d22e6562d47eA75a',
    staking: '0x9fc450F9AfE2833Eb44f9A1369Ab3678D3929860'
  },
  5: {
    // TODO: get sAST goerli contract address
    sAST: '0x',
    AST: '0x1a1ec25DC08e98e5E93F1104B5e5cdD298707d31',
    staking: '0x51F372bE64F0612532F28142cECF8F204B272622'
  }
}

