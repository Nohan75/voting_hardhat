// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Proposition.sol";

contract Proposals {
    struct ProposalDetails {
        address propositionContract;
        string title;
        uint256 endTime;
    }

    ProposalDetails[] public proposals;

    event ProposalCreated(address indexed propositionContract, string title, uint256 endTime);

    function createProposal(string memory _title, uint256 _duration) external {
        Proposition newProposition = new Proposition(_title, _duration);
        proposals.push(ProposalDetails({
            propositionContract: address(newProposition),
            title: _title,
            endTime: block.timestamp + _duration
        }));

        emit ProposalCreated(address(newProposition), _title, block.timestamp + _duration);
    }

    function getProposals() external view returns (ProposalDetails[] memory) {
        return proposals;
    }

    function getActiveProposals() external view returns (ProposalDetails[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (block.timestamp < proposals[i].endTime) {
                count++;
            }
        }

        ProposalDetails[] memory activeProposals = new ProposalDetails[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (block.timestamp < proposals[i].endTime) {
                activeProposals[index] = proposals[i];
                index++;
            }
        }
        return activeProposals;
    }
}