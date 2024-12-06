// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Proposition {
    string public title;
    uint256 public endTime;
    uint256 public votesFor;
    uint256 public votesAgainst;
    bool public votingClosed;

    address public creator;

    mapping(address => bool) public hasVoted;

    event Vote(address indexed voter, bool support);
    event VotingClosed(uint256 votesFor, uint256 votesAgainst);

    modifier onlyDuringVoting() {
        require(block.timestamp < endTime, "Voting has ended.");
        _;
    }

    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this.");
        _;
    }

    constructor(string memory _title, uint256 _duration) {
        title = _title;
        endTime = block.timestamp + _duration;
        creator = msg.sender;
    }

    function vote(bool support) external onlyDuringVoting {
        require(!hasVoted[msg.sender], "You have already voted.");

        hasVoted[msg.sender] = true;
        if (support) {
            votesFor++;
        } else {
            votesAgainst++;
        }

        emit Vote(msg.sender, support);
    }

    function closeVoting() external onlyCreator {
        require(block.timestamp >= endTime, "Voting not yet ended.");
        require(!votingClosed, "Voting already closed.");

        votingClosed = true;

        emit VotingClosed(votesFor, votesAgainst);
    }

    function getResults() external view returns (uint256, uint256, uint256, uint256) {
        uint256 totalVotes = votesFor + votesAgainst;
        uint256 percentFor = totalVotes > 0 ? (votesFor * 100) / totalVotes : 0;
        uint256 percentAgainst = totalVotes > 0 ? (votesAgainst * 100) / totalVotes : 0;

        return (votesFor, votesAgainst, percentFor, percentAgainst);
    }
}
