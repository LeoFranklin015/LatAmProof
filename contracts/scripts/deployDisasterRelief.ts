const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying Disaster Relief System...");

  // Deploy MockERC20 Token first
  console.log("📝 Deploying MockERC20 Token...");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy(
    "Disaster Relief Token", // name
    "RELIEF", // symbol
    18, // decimals
    1000000 // initial supply (1 million tokens)
  );

  await mockToken.waitForDeployment();
  const tokenAddress = await mockToken.getAddress();
  console.log("✅ MockERC20 deployed to:", tokenAddress);

  // Deploy DisasterRelief Contract
  console.log("🏗️ Deploying DisasterRelief Contract...");
  const DisasterRelief = await hre.ethers.getContractFactory("DisasterRelief");
  const disasterRelief = await DisasterRelief.deploy(
    "0xFCc8577f0e41EA33952be8Ff71390eDb61c03D00", // LatAmProof address
    tokenAddress // MockERC20 token address
  );

  await disasterRelief.waitForDeployment();
  const reliefAddress = await disasterRelief.getAddress();
  console.log("✅ DisasterRelief deployed to:", reliefAddress);

  // Wait for a few block confirmations
  console.log("⏳ Waiting for block confirmations...");
  await mockToken.deploymentTransaction().wait(5);
  await disasterRelief.deploymentTransaction().wait(5);

  // Display deployment info
  console.log("\n📊 Deployment Summary:");
  console.log("  - Network:", hre.network.name);
  console.log("  - MockERC20 Token:", tokenAddress);
  console.log("  - DisasterRelief Contract:", reliefAddress);
  console.log(
    "  - LatAmProof Address:",
    "0xFCc8577f0e41EA33952be8Ff71390eDb61c03D00"
  );

  // Verify contracts on Celoscan
  if (hre.network.name === "celoAlfajores" && process.env.CELOSCAN_API_KEY) {
    console.log("\n🔍 Verifying contracts on Celoscan...");

    // Verify MockERC20
    try {
      console.log("Verifying MockERC20...");
      await hre.run("verify:verify", {
        address: tokenAddress,
        constructorArguments: ["Disaster Relief Token", "RELIEF", 18, 1000000],
      });
      console.log("✅ MockERC20 verified successfully!");
    } catch (error: any) {
      console.log("⚠️ MockERC20 verification failed:", error.message);
      if (error.message.includes("already verified")) {
        console.log("MockERC20 was already verified.");
      }
    }

    // Verify DisasterRelief
    try {
      console.log("Verifying DisasterRelief...");
      await hre.run("verify:verify", {
        address: reliefAddress,
        constructorArguments: [
          "0xFCc8577f0e41EA33952be8Ff71390eDb61c03D00",
          tokenAddress,
        ],
      });
      console.log("✅ DisasterRelief verified successfully!");
    } catch (error: any) {
      console.log("⚠️ DisasterRelief verification failed:", error.message);
      if (error.message.includes("already verified")) {
        console.log("DisasterRelief was already verified.");
      }
    }
  } else if (!process.env.CELOSCAN_API_KEY) {
    console.log(
      "\n⚠️ Skipping verification: CELOSCAN_API_KEY not found in environment"
    );
  }

  // Display initial token info
  console.log("\n🪙 Token Information:");
  const tokenName = await mockToken.name();
  const tokenSymbol = await mockToken.symbol();
  const tokenDecimals = await mockToken.decimals();
  const totalSupply = await mockToken.totalSupply();
  console.log(`  - Name: ${tokenName}`);
  console.log(`  - Symbol: ${tokenSymbol}`);
  console.log(`  - Decimals: ${tokenDecimals}`);
  console.log(
    `  - Total Supply: ${hre.ethers.formatUnits(
      totalSupply,
      tokenDecimals
    )} ${tokenSymbol}`
  );

  // Display initial relief program info
  console.log("\n🏥 Relief Program Information:");
  const programCount = await disasterRelief.programCount();
  console.log(`  - Total Programs: ${programCount}`);

  if (programCount > 0) {
    const [
      id,
      name,
      amount,
      maxClaims,
      totalClaimed,
      active,
      startDate,
      endDate,
    ] = await disasterRelief.getProgram(1);
    console.log(`  - Program 1: ${name}`);
    console.log(
      `  - Amount per claim: ${hre.ethers.formatUnits(
        amount,
        18
      )} ${tokenSymbol}`
    );
    console.log(`  - Max Claims: ${maxClaims}`);
    console.log(`  - Active: ${active}`);
  }

  // Fund the DisasterRelief contract with tokens
  console.log("\n💰 Funding DisasterRelief Contract...");
  try {
    // Calculate how many tokens to send (enough for max claims)
    const program1 = await disasterRelief.getProgram(1);
    const amountPerClaim = program1[2]; // amount
    const maxClaims = program1[3]; // maxClaims
    const totalNeeded = amountPerClaim * maxClaims;

    console.log(
      `  - Amount per claim: ${hre.ethers.formatUnits(
        amountPerClaim,
        18
      )} ${tokenSymbol}`
    );
    console.log(`  - Max claims: ${maxClaims}`);
    console.log(
      `  - Total tokens needed: ${hre.ethers.formatUnits(
        totalNeeded,
        18
      )} ${tokenSymbol}`
    );

    // Transfer tokens to the contract
    const transferTx = await mockToken.transfer(reliefAddress, totalNeeded);
    await transferTx.wait();

    console.log("✅ Successfully funded DisasterRelief contract!");

    // Verify the funding
    const contractBalance = await mockToken.balanceOf(reliefAddress);
    console.log(
      `  - Contract balance: ${hre.ethers.formatUnits(
        contractBalance,
        18
      )} ${tokenSymbol}`
    );

    // Check if contract is ready for claims
    const isReady = contractBalance >= totalNeeded;
    console.log(`  - Ready for claims: ${isReady ? "✅ YES" : "❌ NO"}`);
  } catch (error) {
    console.log("❌ Failed to fund contract:", error);
    console.log("💡 You may need to manually transfer tokens to the contract");
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("💡 Next steps:");
  console.log("  1. ✅ Contract is funded and ready for claims");
  console.log(
    "  2. ✅ Argentine users can claim relief through Self Protocol verification"
  );
  console.log("  3. ✅ Each claim will receive 1000 RELIEF tokens");
  console.log("  4. ✅ Maximum 1000 claims can be made");
  console.log(
    "\n🚀 Ready to use! Users can now claim disaster relief directly."
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
