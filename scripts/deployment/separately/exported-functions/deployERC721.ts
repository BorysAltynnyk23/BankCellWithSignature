// This script contains the function for deployment and verification of the `contracts/PositiveEvenSetter.sol`.

import hre from "hardhat";
const ethers = hre.ethers;

import type { ERC721Mock } from "../../../../typechain-types";

async function deployERC721(): Promise<ERC721Mock> {
    /*
     * Hardhat always runs the compile task when running scripts with its command line interface.
     *
     * If this script is run directly using `node`, then it should be called compile manually
     * to make sure everything is compiled.
     */
    // await hre.run("compile");

    const [deployer] = await ethers.getSigners();

    // Deployment.
    const ERC721Mock = (await ethers.getContractFactory("ERC721Mock")).connect(deployer);
    const erc721: ERC721Mock = await ERC721Mock.deploy();

    await erc721.deployed();

    console.log(`\`erc721\` is deployed to ${erc721.address}.`);

    // Verification of the deployed contract.
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("Sleeping before verification...");
        await new Promise((resolve) => setTimeout(resolve, 60000)); // 60 seconds.

        await hre.run("verify:verify", { address: erc721.address, constructorArguments: [] });
    }

    return erc721;
}

export { deployERC721 };
