// This is a script for deployment and automatically verification of all the contracts (`contracts/`).

import hre from "hardhat";
const ethers = hre.ethers;

async function main() {
    const [deployer] = await ethers.getSigners();
    const CONTRACT_ADDRESS = "0x1961BF773C0A4f27bC2f15ca50Ad52840cAaCf3a";
    // const Bank = await ethers.getContractFactory("Bank");
    const bank = await hre.ethers.getContractAt("Bank", CONTRACT_ADDRESS);

    const x = await bank.createCellEther({ value: 1 });
    console.log(x);

    // let x = await bank.getMessageHash(1,1)
    // console.log(x)
}

// This pattern is recommended to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//npx hardhat run scripts/interaction/interaction.ts --network mumbai
// npx hardhat verify "0x1961BF773C0A4f27bC2f15ca50Ad52840cAaCf3a" --network mumbai
