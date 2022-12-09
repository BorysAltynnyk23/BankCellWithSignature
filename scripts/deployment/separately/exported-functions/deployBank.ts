// This script contains the function for deployment and verification of the `contracts/PositiveEvenSetter.sol`.

import hre from "hardhat";
const ethers = hre.ethers;

import type { Bank } from "../../../../typechain-types";

async function deployBank(): Promise<Bank> {
    /*
     * Hardhat always runs the compile task when running scripts with its command line interface.
     *
     * If this script is run directly using `node`, then it should be called compile manually
     * to make sure everything is compiled.
     */
    // await hre.run("compile");

    const [deployer] = await ethers.getSigners();

    // Deployment.
    const Bank = (await ethers.getContractFactory("Bank")).connect(deployer);
    const bank: Bank = await Bank.deploy();

    await bank.deployed();

    console.log(`\`bank\` is deployed to ${bank.address}.`);

    // Verification of the deployed contract.
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("Sleeping before verification...");
        await new Promise((resolve) => setTimeout(resolve, 60000)); // 60 seconds.

        await hre.run("verify:verify", { address: bank.address, constructorArguments: [] });
    }

    return bank;
}

export { deployBank };
