// This is a script for deployment and automatically verification of the `contracts/Bank.sol`.

import { deployERC20 } from "./exported-functions/deployERC20";

async function main() {
    await deployERC20();
}

// This pattern is recommended to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//npx hardhat run scripts/deployment/separately/ERC20.ts --network mumbai
