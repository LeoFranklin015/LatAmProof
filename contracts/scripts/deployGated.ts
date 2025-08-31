const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const ProofOfHuman = await hre.ethers.getContractFactory("MyGatedContract");
  const proofOfHuman = await ProofOfHuman.deploy(
    "0x981FEd4eeFfbaFe19F71FFa832CF862a4b9dc5F6"
  );

  await proofOfHuman.waitForDeployment();
  const contractAddress = await proofOfHuman.getAddress();

  console.log("ProofOfHuman deployed to:", contractAddress);
  console.log("Network:", hre.network.name);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await proofOfHuman.deploymentTransaction().wait(5);

  // Verify the contract on Celoscan
  if (hre.network.name === "celoAlfajores" && process.env.CELOSCAN_API_KEY) {
    console.log("Verifying contract on Celoscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: ["0x981FEd4eeFfbaFe19F71FFa832CF862a4b9dc5F6"],
      });
      console.log("Contract verified successfully!");
    } catch (error: any) {
      console.log("Verification failed:", error.message);
      if (error.message.includes("already verified")) {
        console.log("Contract was already verified.");
      }
    }
  } else if (!process.env.CELOSCAN_API_KEY) {
    console.log(
      "Skipping verification: CELOSCAN_API_KEY not found in environment"
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
