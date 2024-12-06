import { ethers } from "hardhat";
import { expect } from "chai";
import { Proposals } from "../typechain-types";

describe("Proposals", function () {
    let proposals: Proposals;
    let owner: any;
    let proposer: any;
    beforeEach(async function () {
        [owner, proposer] = await ethers.getSigners();

        const ProposalsFactory = await ethers.getContractFactory("Proposals");
        proposals = await ProposalsFactory.deploy() as Proposals;
    });

    it("should create a new proposal", async function () {
        const tx = await proposals.connect(proposer).createProposal("Proposal 1", 3600);
        await tx.wait();

        const allProposals = await proposals.getProposals();
        expect(allProposals.length).to.equal(1);
        expect(allProposals[0].title).to.equal("Proposal 1");
    });

    it("should return active proposals", async function () {
        await proposals.connect(proposer).createProposal("Active Proposal", 3600);
        await proposals.connect(proposer).createProposal("Expired Proposal", 1);

        await ethers.provider.send("evm_increaseTime", [2]);
        await ethers.provider.send("evm_mine");

        const activeProposals = await proposals.getActiveProposals();
        expect(activeProposals.length).to.equal(1);
        expect(activeProposals[0].title).to.equal("Active Proposal");
    });
});
