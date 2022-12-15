import type { SnapshotRestorer } from "@nomicfoundation/hardhat-network-helpers";
import { takeSnapshot } from "@nomicfoundation/hardhat-network-helpers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Bank, ERC20Mock, ERC721Mock } from "../typechain-types";
// import { utils } from "mocha";

describe("bank", function () {
    let snapshotA: SnapshotRestorer;

    // Signers.
    let deployer: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress;

    let bank: Bank;
    let token: ERC20Mock;
    let erc721: ERC721Mock;

    before(async () => {
        // Getting of signers.
        [deployer, alice, bob] = await ethers.getSigners();

        // Deployment of the factory.
        const Bank = await ethers.getContractFactory("Bank", deployer);
        bank = await Bank.deploy();
        await bank.deployed();

        const ERC20 = await ethers.getContractFactory("ERC20Mock", deployer);
        token = await ERC20.deploy();
        await token.deployed();

        const ERC721 = await ethers.getContractFactory("ERC721Mock", deployer);
        erc721 = await ERC721.deploy();
        await erc721.deployed();

        snapshotA = await takeSnapshot();
    });

    afterEach(async () => await snapshotA.restore());

    describe("ERC20 Signature", function () {
        it("Cell can be collected by signature", async () => {
            const AMOUNT = ethers.utils.parseEther("100");

            await token.mint(alice.address, AMOUNT);
            await token.connect(alice).increaseAllowance(bank.address, AMOUNT);
            await bank.connect(alice).createCellERC20(token.address, AMOUNT);

            const cellId = 1;
            const deadline = (await time.latest()) + 10000;
            const confidant = bob.address;

            const messageHash = await bank.getMessageHash(cellId, confidant, deadline);
            const signature = await alice.signMessage(ethers.utils.arrayify(messageHash));

            await bank.connect(bob).takeCellContentBySignature(cellId, deadline, signature);

            expect(await token.balanceOf(bob.address)).to.be.equal(AMOUNT);
        });
        it("Cell cannot be collected after deadline", async () => {
            const AMOUNT = ethers.utils.parseEther("100");

            await token.mint(alice.address, AMOUNT);
            await token.connect(alice).increaseAllowance(bank.address, AMOUNT);
            await bank.connect(alice).createCellERC20(token.address, AMOUNT);

            const cellId = 1;
            const deadline = (await time.latest()) + 10000;
            const confidant = bob.address;

            const messageHash = await bank.getMessageHash(cellId, confidant, deadline);
            const signature = await alice.signMessage(ethers.utils.arrayify(messageHash));

            await time.increase(10001);

            await expect(bank.connect(bob).takeCellContentBySignature(cellId, deadline, signature)).to.be.revertedWith(
                "ExpiredSignature"
            );
        });
        it("Cell can be collected twice", async () => {
            const AMOUNT = ethers.utils.parseEther("100");

            await token.mint(alice.address, AMOUNT.mul(2));
            await token.connect(alice).increaseAllowance(bank.address, AMOUNT.mul(2));
            await bank.connect(alice).createCellERC20(token.address, AMOUNT);
            await bank.connect(alice).createCellERC20(token.address, AMOUNT);

            const cellId = 1;
            const deadline = (await time.latest()) + 10000;
            const confidant = bob.address;

            const messageHash = await bank.getMessageHash(cellId, confidant, deadline);
            const signature = await alice.signMessage(ethers.utils.arrayify(messageHash));

            await bank.connect(bob).takeCellContentBySignature(cellId, deadline, signature);
            await expect(bank.connect(bob).takeCellContentBySignature(cellId, deadline, signature)).to.be.revertedWith(
                "Invalid signature"
            );
        });
    });
    describe("ERC721 Signature", function () {
        it("Cell can be collected by signature", async () => {
            const NFT_ID = 1;

            await erc721.mint(alice.address);
            await erc721.connect(alice).approve(bank.address, NFT_ID);
            await bank.connect(alice).createCellERC721(erc721.address, NFT_ID);

            const cellId = 1;
            const deadline = (await time.latest()) + 10000;
            const confidant = bob.address;

            const messageHash = await bank.getMessageHash(cellId, confidant, deadline);
            const signature = await alice.signMessage(ethers.utils.arrayify(messageHash));

            await bank.connect(bob).takeCellContentBySignature(cellId, deadline, signature);

            expect(await erc721.ownerOf(NFT_ID)).to.be.equal(bob.address);
        });
        it("Cell cannot be collected after deadline", async () => {
            const NFT_ID = 1;

            await erc721.mint(alice.address);
            await erc721.connect(alice).approve(bank.address, NFT_ID);
            await bank.connect(alice).createCellERC721(erc721.address, NFT_ID);

            const cellId = 1;
            const deadline = (await time.latest()) + 10000;
            const confidant = bob.address;

            const messageHash = await bank.getMessageHash(cellId, confidant, deadline);
            const signature = await alice.signMessage(ethers.utils.arrayify(messageHash));

            await time.increase(10001);

            await expect(bank.connect(bob).takeCellContentBySignature(cellId, deadline, signature)).to.be.revertedWith(
                "ExpiredSignature"
            );
        });
        it("Cell can be collected twice", async () => {
            const NFT_ID = 1;

            await erc721.mint(alice.address);
            await erc721.connect(alice).approve(bank.address, NFT_ID);
            await bank.connect(alice).createCellERC721(erc721.address, NFT_ID);

            const cellId = 1;
            const deadline = (await time.latest()) + 10000;
            const confidant = bob.address;

            const messageHash = await bank.getMessageHash(cellId, confidant, deadline);
            const signature = await alice.signMessage(ethers.utils.arrayify(messageHash));

            await bank.connect(bob).takeCellContentBySignature(cellId, deadline, signature);

            await expect(bank.connect(bob).takeCellContentBySignature(cellId, deadline, signature)).to.be.revertedWith(
                "Invalid signature"
            );
        });
    });
    describe("Ether Signature", function () {
        it("Cell can be collected by signature", async () => {
            await bank.connect(alice).createCellEther({ value: ethers.utils.parseEther("1") });

            const cellId = 1;
            const deadline = (await time.latest()) + 10000;
            const confidant = bob.address;

            const messageHash = await bank.getMessageHash(cellId, confidant, deadline);
            const signature = await alice.signMessage(ethers.utils.arrayify(messageHash));

            const ethBalanceBefore = await bob.getBalance();

            await bank.connect(bob).takeCellContentBySignature(cellId, deadline, signature);

            const ethBalanceAfter = await bob.getBalance();

            expect(ethBalanceAfter.sub(ethBalanceBefore)).to.be.gt(ethers.utils.parseEther("1").mul(99).div(100));
        });
        it("User can collect his own cell by signature", async () => {
            await bank.connect(alice).createCellEther({ value: ethers.utils.parseEther("1") });

            const cellId = 1;
            const deadline = (await time.latest()) + 10000;
            const confidant = alice.address;

            const messageHash = await bank.getMessageHash(cellId, confidant, deadline);
            const signature = await alice.signMessage(ethers.utils.arrayify(messageHash));

            const ethBalanceBefore = await alice.getBalance();

            await bank.connect(alice).takeCellContentBySignature(cellId, deadline, signature);

            const ethBalanceAfter = await alice.getBalance();

            expect(ethBalanceAfter.sub(ethBalanceBefore)).to.be.gt(ethers.utils.parseEther("1").mul(99).div(100));
        });
    });
});

////npx hardhat run test/Bank.ts --network mumbai
