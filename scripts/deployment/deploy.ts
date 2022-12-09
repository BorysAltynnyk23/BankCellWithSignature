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
