const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Deploying ProofOfHuman contract...");

  const mockScope = 1; // unless you use create2 and know the address of the contract before deploying, use a mock scope and update it after deployment.
  // see https://tools.self.xyz to compute the real value of the scope will set after deployment.
  const hubAddress = "0x68c931C9a534D37aa78094877F46fE46a49F1A51";
  const verificationConfigId =
    "0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61";

  console.log("Using IdentityVerificationHub at:", hubAddress);
  console.log("Using VerificationConfigId at:", verificationConfigId);
  // Deploy the contract
  const ProofOfHuman = await hre.ethers.getContractFactory("LatAmProof");
  const proofOfHuman = await ProofOfHuman.deploy(
    hubAddress,
    mockScope,
    verificationConfigId
  );

  await proofOfHuman.waitForDeployment();
  const contractAddress = await proofOfHuman.getAddress();

  console.log("ProofOfHuman deployed to:", contractAddress);
  console.log("Network:", hre.network.name);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await proofOfHuman.deploymentTransaction().wait(5);

  const registryAddresses = {
    ARG: "0xe42cfac25e82e3b77fefc740a934e11f03957c17",
    BLZ: "0x86dd241529ae8e05c7426789ec87e65903b95eab",
  };

  const contract = await hre.ethers.getContractAt(
    "LatAmProof",
    contractAddress
  );

  console.log("Setting registries for countries...");
  for (const [country, registryAddress] of Object.entries(registryAddresses)) {
    try {
      console.log(`Setting registry for ${country} to ${registryAddress}...`);
      const tx = await contract._setRegistry(country, registryAddress);
      await tx.wait();
      console.log(`✅ Registry set for ${country}`);
    } catch (error: any) {
      console.error(`❌ Failed to set registry for ${country}:`, error.message);
    }
  }

  // Verify the contract on Celoscan
  if (hre.network.name === "celoAlfajores" && process.env.CELOSCAN_API_KEY) {
    console.log("Verifying contract on Celoscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [hubAddress, mockScope, verificationConfigId],
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

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    hubAddress: hubAddress,
    deployedAt: new Date().toISOString(),
    deployer: (await hre.ethers.provider.getSigner()).address,
  };

  fs.writeFileSync(
    "./deployments/latest.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment complete!");
  console.log("Contract address:", contractAddress);
  console.log("\nNext steps:");
  console.log("1. Update NEXT_PUBLIC_SELF_ENDPOINT in app/.env");
  console.log(
    "2. Go to https://tools.self.xyz, generate the scope and update it in your contract"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
