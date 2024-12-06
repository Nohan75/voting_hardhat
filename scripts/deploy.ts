import { ethers } from "hardhat";
import {Proposals, Proposition} from "../typechain-types";

async function main() {
    const ProposalsFactory = await ethers.getContractFactory("Proposals");
    const proposals = (await ProposalsFactory.deploy()) as Proposals;
    proposals.deploymentTransaction();

    console.log("Proposals contract deployed to:", proposals.address);

    // Si vous voulez déployer d'autres contrats :
    const PropositionFactory = await ethers.getContractFactory("Proposition");
    const proposition = (await PropositionFactory.deploy("Example Title", 3600)) as Proposition;
    proposition.deploymentTransaction();
    console.log("Proposition contract deployed to:", proposition.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
