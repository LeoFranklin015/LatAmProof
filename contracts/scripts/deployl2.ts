import { ethers } from "hardhat";
import { hashEndpointWithScope } from "@selfxyz/core";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const L2Registrar = await ethers.getContractFactory("L2Registrar");

  console.log("Deploying L2Registrar...");
  const selfHappyBirthday = await L2Registrar.deploy(
    "0xe42cfac25e82e3b77fefc740a934e11f03957c17"
  );

  await selfHappyBirthday.waitForDeployment();

  const deployedAddress = await selfHappyBirthday.getAddress();
  console.log("SelfHappyBirthday deployed to:", deployedAddress);

  console.log("\nSetting verification config...");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
