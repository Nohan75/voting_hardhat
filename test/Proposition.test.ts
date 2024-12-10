import { ethers } from "hardhat";
import { expect } from "chai";
import { Proposition } from "../typechain-types";

describe("Proposition", function () {
    let proposition: Proposition;
    let owner: any, voter1: any, voter2: any;

    beforeEach(async function () {
        [owner, voter1, voter2] = await ethers.getSigners();
        const PropositionFactory = await ethers.getContractFactory("Proposition");
        proposition = await PropositionFactory.deploy("Proposal 1", 3600) as Proposition; // 1 hour duration
    });

    it("should initialize with correct values", async function () {
        expect(await proposition.title()).to.equal("Proposal 1");
        expect(await proposition.creator()).to.equal(owner.address);
    });

    it("should allow voting", async function () {
        await proposition.connect(voter1).vote(true);
        const [votesFor, votesAgainst] = await proposition.getResults();
        expect(votesFor).to.equal(1);
        expect(votesAgainst).to.equal(0);

        await proposition.connect(voter2).vote(false);
        const [votesForUpdated, votesAgainstUpdated] = await proposition.getResults();
        expect(votesForUpdated).to.equal(1);
        expect(votesAgainstUpdated).to.equal(1);
    });

    it("should prevent double voting", async function () {
        await proposition.connect(voter1).vote(true);
        await expect(proposition.connect(voter1).vote(false)).to.be.revertedWith("You have already voted.");
    });

    it("should prevent voting after the end time", async function () {
        await ethers.provider.send("evm_increaseTime", [3600]);
        await ethers.provider.send("evm_mine");

        await expect(proposition.connect(voter1).vote(true)).to.be.revertedWith("Voting is closed.");
    });

    it("should close voting only by creator", async function () {
        await ethers.provider.send("evm_increaseTime", [3600]);
        await ethers.provider.send("evm_mine");

        await expect(proposition.connect(voter1).closeVoting()).to.be.revertedWith("Only creator can call this.");

        await proposition.closeVoting();
        expect(await proposition.votingClosed()).to.equal(true);
    });
});
