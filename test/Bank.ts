import type { SnapshotRestorer } from "@nomicfoundation/hardhat-network-helpers";
import { takeSnapshot } from "@nomicfoundation/hardhat-network-helpers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Bank, ERC20Mock, Bank__factory } from "../typechain-types";
import { utils } from "mocha";

describe("bank", function () {
    let snapshotA: SnapshotRestorer;

    // Signers.
    let deployer: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress;

    let bank: Bank;
    let token: ERC20Mock;

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

        snapshotA = await takeSnapshot();
    });

    afterEach(async () => await snapshotA.restore());

    describe("", function () {
        it("test 1", async () => {
            const from = alice.address
            const to = bob.address
            const amount = 100
            const deadline = "message"
            const nonce = 1

            const messageHash = await bank.getMessageHash(to, amount, deadline, nonce)
            const signature = await alice.signMessage(ethers.utils.arrayify(messageHash))
            console.log(signature);

            const res = await bank.verify(
                from,
                to,
                amount,
                deadline,
                nonce,
                signature
            )
            console.log(res)

        });
        it("create cell ERC20 and collect by signature", async () =>{

            const AMOUNT  = ethers.utils.parseEther("100")

            await token.mint(alice.address, AMOUNT)
            await token.connect(alice).increaseAllowance(bank.address, AMOUNT)
            await bank.connect(alice).createCellERC20(token.address, AMOUNT)

            const from = alice.address
            const to = bob.address
            const message = "message"
            const nonce = 0

            const messageHash = await bank.getMessageHash(to, AMOUNT, message, nonce)
            const signature = await alice.signMessage(ethers.utils.arrayify(messageHash))

            const cellId = 1
            await bank.connect(bob).takeCellContentBySignature(cellId, signature)

            expect(await token.balanceOf(bob.address)).to.be.equal(AMOUNT)
            console.log(await time.latest())





        })
    });
});
