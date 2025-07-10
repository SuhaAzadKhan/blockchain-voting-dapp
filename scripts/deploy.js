const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  await voting.waitForDeployment(); // ✅ replaces voting.deployed()

  console.log("Voting contract deployed to:", voting.target); // ✅ updated for latest Ethers
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
