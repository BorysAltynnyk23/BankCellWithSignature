// This is a script for deployment and automatically verification of the `contracts/Bank.sol`.

import { deployBank } from "./exported-functions/deployBank";

async function main() {
    await deployBank();
}

// This pattern is recommended to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
