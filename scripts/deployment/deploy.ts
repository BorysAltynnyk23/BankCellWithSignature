// This is a script for deployment and automatically verification of all the contracts (`contracts/`).

import { deployBank } from "./separately/exported-functions/deployBank";

async function main() {
    // Deployment and verification of the `contracts/Bank.sol`.
    await deployBank();
}

// This pattern is recommended to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//npx hardhat run scripts/deployment/deploy.ts --network mumbai
// npx hardhat verify "0x60A76a22B77c5Dd5395E02297C2957B21f845aC9" --network mumbai
