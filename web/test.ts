import { ethers } from "ethers";

const resolve = async () => {
  const provider = new ethers.JsonRpcProvider(
    "https://ethereum-sepolia-rpc.publicnode.com"
  );
  const resolve = await provider.resolveName("testing.aust.eth");
  const res = await provider.lookupAddress(
    "0x2559284bC8fD9Ca6235AF2379A4D9C4B2Ade4cCa"
  );
  console.log(resolve);
  console.log(res);
};

resolve();
