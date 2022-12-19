// This is a script for deployment and automatically verification of all the contracts (`contracts/`).

import hre from "hardhat";
const ethers = hre.ethers;

async function main() {
    const [deployer, alice, bob] = await ethers.getSigners();

    const CONTRACT_ADDRESS = "0x1961BF773C0A4f27bC2f15ca50Ad52840cAaCf3a";
    const ERC20_ADDRESS = "0x1D9b05C38487abDd21eB2bb0fB2d2237575B5164";
    const AMOUNT = ethers.utils.parseEther("10000");

    const bank = await hre.ethers.getContractAt("Bank", CONTRACT_ADDRESS);

    // const x = await ethers.provider.getBlock("latest");
    // console.log(x.timestamp);
}

// This pattern is recommended to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//npx hardhat run scripts/interaction/interaction.ts --network mumbai
