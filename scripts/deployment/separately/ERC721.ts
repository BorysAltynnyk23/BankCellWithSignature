// This is a script for deployment and automatically verification of the `contracts/Bank.sol`.

import { deployERC721 } from "./exported-functions/deployERC721";

async function main() {
    await deployERC721();
}

// This pattern is recommended to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//npx hardhat run scripts/deployment/separately/ERC721.ts --network mumbai
