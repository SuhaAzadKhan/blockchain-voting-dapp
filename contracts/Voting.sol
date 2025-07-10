// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    address public admin;
    bool public isVotingOpen;

    struct Candidate {
        string name;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint voteIndex;
    }

    Candidate[] public candidates;
    mapping(string => Voter) private votersByID; // voterID = any unique string like Aadhaar

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    // ---------------- Admin Functions ----------------

    function addCandidate(string memory name) public onlyAdmin {
        require(!isVotingOpen, "Cannot add candidates during voting");
        candidates.push(Candidate(name, 0));
    }

    function registerVoter(string memory voterID) public onlyAdmin {
        require(!votersByID[voterID].isRegistered, "Voter already registered");
        votersByID[voterID] = Voter(true, false, 0);
    }

    function startVoting() public onlyAdmin {
        require(!isVotingOpen, "Voting already started");
        require(candidates.length > 0, "Add candidates first");
        isVotingOpen = true;
    }

    function endVoting() public onlyAdmin {
        require(isVotingOpen, "Voting already ended");
        isVotingOpen = false;
    }

    // ---------------- Voter Function ----------------

    function vote(string memory voterID, uint candidateIndex) public {
        require(isVotingOpen, "Voting is closed");
        require(votersByID[voterID].isRegistered, "Voter not registered");
        require(!votersByID[voterID].hasVoted, "Voter has already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");

        votersByID[voterID].hasVoted = true;
        votersByID[voterID].voteIndex = candidateIndex;

        candidates[candidateIndex].voteCount += 1;
    }

    // ---------------- Public View Functions ----------------

    function getCandidate(uint index) public view returns (string memory name, uint voteCount) {
        require(index < candidates.length, "Candidate does not exist");
        Candidate memory c = candidates[index];
        return (c.name, isVotingOpen ? 0 : c.voteCount); // hide votes during voting
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getCandidateCount() public view returns (uint) {
        return candidates.length;
    }

    function getResults() public view returns (Candidate[] memory) {
        require(!isVotingOpen, "Voting is still in progress");
        return candidates;
    }

    function isVoterRegistered(string memory voterID) public view returns (bool) {
        return votersByID[voterID].isRegistered;
    }

    function hasVoterVoted(string memory voterID) public view returns (bool) {
        return votersByID[voterID].hasVoted;
    }
}
