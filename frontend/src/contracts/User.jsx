import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Voting from "../artifacts/contracts/Voting.sol/Voting.json";
import { CONTRACT_ADDRESS } from "../utils/contractAddress";

const User = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [voterID, setVoterID] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [message, setMessage] = useState("");

  // Connect wallet and contract
  const connectWalletAndContract = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return false;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const votingContract = new ethers.Contract(CONTRACT_ADDRESS, Voting.abi, signer);
      setContract(votingContract);
      return true;
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("Failed to connect wallet.");
      return false;
    }
  };

  // Fetch candidates from contract
  const fetchCandidates = async () => {
    if (!contract) return;
    try {
      const count = await contract.getCandidateCount();
      const list = [];
      for (let i = 0; i < count; i++) {
        const [name] = await contract.getCandidate(i);
        list.push({ name, index: i });
      }
      setCandidates(list);
    } catch (err) {
      console.error("Fetching candidates failed:", err);
      setMessage("Failed to fetch candidates.");
    }
  };

  // Handle wallet connect on component mount
  useEffect(() => {
    const init = async () => {
      const connected = await connectWalletAndContract();
      if (connected) {
        fetchCandidates();
      }
    };
    init();
    // eslint-disable-next-line
  }, [contract]);

  // Vote function
  const handleVote = async () => {
    if (!voterID || selectedCandidate === null) {
      setMessage("Please enter your Voter ID and select a candidate.");
      return;
    }
    if (!contract) {
      setMessage("Wallet not connected.");
      return;
    }

    setMessage("Submitting your vote... Please wait.");

    try {
      const tx = await contract.vote(voterID, selectedCandidate);
      await tx.wait();
      setMessage("✅ Vote cast successfully!");
      setVoterID("");
      setSelectedCandidate(null);
      fetchCandidates(); // Refresh if needed
    } catch (err) {
      console.error("Voting failed:", err);
      const reason = err.data?.message || err.message || "Unknown error";
      setMessage("❌ Failed to vote: " + reason);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Voter Portal</h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold" htmlFor="voterID">
          Enter Voter ID
        </label>
        <input
          id="voterID"
          type="text"
          placeholder="Enter your Voter ID"
          className="border p-2 w-full rounded"
          value={voterID}
          onChange={(e) => setVoterID(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Choose Candidate</h3>
        {candidates.length === 0 && <p>No candidates available.</p>}
        <ul className="space-y-2">
          {candidates.map((c) => (
            <li key={c.index} className="flex items-center">
              <input
                type="radio"
                name="candidate"
                className="mr-2"
                checked={selectedCandidate === c.index}
                onChange={() => setSelectedCandidate(c.index)}
              />
              <span>{c.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleVote}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
      >
        Cast Vote
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700 break-words">{message}</p>
      )}

      {account && (
        <p className="mt-6 text-center text-gray-600 text-xs">
          Connected wallet: {account}
        </p>
      )}
    </div>
  );
};

export default User;
