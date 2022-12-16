// This is a script for deployment and automatically verification of all the contracts (`contracts/`).

import hre from "hardhat";
const ethers = hre.ethers;

async function main() {
    const [deployer, alice, bob] = await ethers.getSigners();

    const CONTRACT_ADDRESS = "0x1961BF773C0A4f27bC2f15ca50Ad52840cAaCf3a";
    const ERC20_ADDRESS = "0x1D9b05C38487abDd21eB2bb0fB2d2237575B5164";
    const ERC721_ADDRESS = "0x8d5306AD2a90031d1fCb50d7410FFe6E0E688bdf";

    const bank = await hre.ethers.getContractAt("Bank", CONTRACT_ADDRESS);
    const erc20 = await hre.ethers.getContractAt("ERC20Mock", ERC20_ADDRESS);
    const erc721 = await hre.ethers.getContractAt("ERC721Mock", ERC721_ADDRESS);

    const AMOUNT = ethers.utils.parseEther("100");

    await erc20.connect(alice).increaseAllowance(bank.address, AMOUNT);
    await bank.connect(alice).createCellERC20(ERC20_ADDRESS, AMOUNT);

    // const cellId = 1;
    // let currentTime = (await ethers.provider.getBlock("latest")).timestamp

    // const deadline = (currentTime) + 10000;
    // const confidant = bob.address;

    // const messageHash = await bank.getMessageHash(cellId, confidant, deadline);
    // const signature = await alice.signMessage(ethers.utils.arrayify(messageHash));
}

// This pattern is recommended to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//npx hardhat run scripts/interaction/CreateCellERC20.ts --network mumbai
