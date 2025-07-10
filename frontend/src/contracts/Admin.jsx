import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "../utils/contractABI.json";
import { CONTRACT_ADDRESS } from "../utils/contractAddress";

const ADMIN_PASSWORD = "admin123";

const Admin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [voterID, setVoterID] = useState("");
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const connectWalletAndContract = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found. Please install it.");
      return null;
    }

    try {
      setLoading(true);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);
      setContract(contractInstance);
      return contractInstance;
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Wallet connection failed.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (password !== ADMIN_PASSWORD) {
      alert("Incorrect password");
      return;
    }

    const connectedContract = await connectWalletAndContract();
    if (connectedContract) {
      setLoggedIn(true);
    }
  };

  const handleAddCandidate = async () => {
    if (!candidateName || !contract) return;
    try {
      setStatus("Adding candidate...");
      const tx = await contract.addCandidate(candidateName);
      await tx.wait();
      setCandidateName("");
      setStatus("✅ Candidate added!");
    } catch (err) {
      console.error("Transaction failed:", err);
      setStatus("❌ Failed to add candidate: " + (err?.reason || err?.message));
    }
  };

  const handleRegisterVoter = async () => {
    if (!voterID || !contract) return;
    try {
      setStatus("Registering voter...");
      const tx = await contract.registerVoter(voterID);
      await tx.wait();
      setVoterID("");
      setStatus("✅ Voter registered!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to register voter.");
    }
  };

  const handleStartVoting = async () => {
    try {
      const tx = await contract.startVoting();
      await tx.wait();
      setStatus("✅ Voting started!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to start voting.");
    }
  };

  const handleEndVoting = async () => {
    try {
      const tx = await contract.endVoting();
      await tx.wait();
      setStatus("✅ Voting ended!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to end voting.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl mt-10">
      {!loggedIn ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <input
            type="password"
            className="w-full border px-4 py-2 rounded"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            disabled={loading}
          >
            {loading ? "Connecting..." : "Login"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>

          {/* Add Candidate */}
          <div>
            <h3 className="font-semibold">Add Candidate</h3>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full mt-2"
              placeholder="Candidate name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />
            <button
              onClick={handleAddCandidate}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2"
            >
              Add Candidate
            </button>
          </div>

          {/* Register Voter */}
          <div>
            <h3 className="font-semibold">Register Voter</h3>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full mt-2"
              placeholder="Voter ID (dummy)"
              value={voterID}
              onChange={(e) => setVoterID(e.target.value)}
            />
            <button
              onClick={handleRegisterVoter}
              className="bg-purple-600 text-white px-4 py-2 rounded mt-2"
            >
              Register Voter
            </button>
          </div>

          {/* Start/End Voting */}
          <div className="flex gap-4">
            <button
              onClick={handleStartVoting}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Start Voting
            </button>
            <button
              onClick={handleEndVoting}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              End Voting
            </button>
          </div>

          {status && <p className="text-sm text-gray-700 mt-4">{status}</p>}
        </div>
      )}
    </div>
  );
};

export default Admin;
