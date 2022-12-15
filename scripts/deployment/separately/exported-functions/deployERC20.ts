// This script contains the function for deployment and verification of the `contracts/PositiveEvenSetter.sol`.

import hre from "hardhat";
const ethers = hre.ethers;

import type { ERC20Mock } from "../../../../typechain-types";

async function deployERC20(): Promise<ERC20Mock> {
    /*
     * Hardhat always runs the compile task when running scripts with its command line interface.
     *
     * If this script is run directly using `node`, then it should be called compile manually
     * to make sure everything is compiled.
     */
    // await hre.run("compile");

    const [deployer] = await ethers.getSigners();

    // Deployment.
    const ERC20Mock = (await ethers.getContractFactory("ERC20Mock")).connect(deployer);
    const erc20: ERC20Mock = await ERC20Mock.deploy();

    await erc20.deployed();

    console.log(`\`erc20\` is deployed to ${erc20.address}.`);

    // Verification of the deployed contract.
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("Sleeping before verification...");
        await new Promise((resolve) => setTimeout(resolve, 60000)); // 60 seconds.

        await hre.run("verify:verify", { address: erc20.address, constructorArguments: [] });
    }

    return erc20;
}

export { deployERC20 };
