// scripts/deploy.js
/* eslint-disable @typescript-eslint/no-require-imports */
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const travelPoints = await hre.ethers.deployContract("TravelPoints", [deployer.address]);

  await travelPoints.deployed();

  console.log(`TravelPoints contract deployed to: ${travelPoints.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
