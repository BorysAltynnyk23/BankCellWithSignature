import type { SnapshotRestorer } from "@nomicfoundation/hardhat-network-helpers";
import { takeSnapshot } from "@nomicfoundation/hardhat-network-helpers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Bank, ERC20Mock, ERC721Mock } from "../typechain-types";
import { utils } from "mocha";

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

            const messageHash = await bank.getMessageHash(cellId, deadline);
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

            const messageHash = await bank.getMessageHash(cellId, deadline);
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

            const messageHash = await bank.getMessageHash(cellId, deadline);
            const signature = await alice.signMessage(ethers.utils.arrayify(messageHash));

            await bank.connect(bob).takeCellContentBySignature(cellId, deadline, signature);
            await expect(bank.connect(bob).takeCellContentBySignature(cellId, deadline, signature)).to.be.revertedWith(
                "Invalid signature"
            );
        });
    });
});
