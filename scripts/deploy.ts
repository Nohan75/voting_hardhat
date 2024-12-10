import { ethers } from "hardhat";
import {Proposals, Proposition} from "../typechain-types";

async function main() {
    const ProposalsFactory = await ethers.getContractFactory("Proposals");
    const proposals = (await ProposalsFactory.deploy()) as Proposals;
    await proposals.deploymentTransaction();

    console.log("Proposals contract deployed to:", await proposals.getAddress());

    // Si vous voulez déployer d'autres contrats :
    const PropositionFactory = await ethers.getContractFactory("Proposition");
    const proposition = (await PropositionFactory.deploy("Example Title", 3600, )) as Proposition;
    await proposition.deploymentTransaction();
    console.log("Proposition contract deployed to:", await proposition.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
