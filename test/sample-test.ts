
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    console.log("starting ...");

    const provider = await ethers.provider;
  
    const CoinFlip = await ethers.getContractFactory("CoinFlip");
    const deploy_tx = await CoinFlip.deploy();
  
    const coinFlip = await deploy_tx.deployed();
  
    const FACTOR = BigNumber.from("57896044618658097711785492504343953926634992332820282019728792003956564819968");
  
    const currentBlock = await provider.getBlock("latest");
    
    const usedBlockNumber = currentBlock.number;
    
    const usedBlock = await provider.getBlock(usedBlockNumber);
    const blockValue = BigNumber.from(usedBlock.hash);
    
    const coinFlipResult = blockValue.div(FACTOR);
    const side = coinFlipResult.toNumber() === 1 ? true : false;

    // console.log(`Trying for block ${usedBlockNumber}, result: ${coinFlipResult}, side: ${side}`);
    console.log(`Script block number: ${usedBlockNumber}`);
    console.log(`Script blockValue: ${blockValue}`);
    console.log(`script coinFlipResult: ${coinFlipResult}`);
    console.log(`Script side: ${side}`);

    const feeData = await provider.getFeeData();
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!.mul(5);
    const maxFeePerGas = feeData.maxFeePerGas!.mul(5);
    
    console.log("running the coinFLip");
    const guess_tx = await coinFlip.flip(side, { maxPriorityFeePerGas: maxPriorityFeePerGas, maxFeePerGas: maxFeePerGas });
    await guess_tx.wait(1);
    console.log("ran the coinFlip");
    const consecutivesWins = await coinFlip.consecutiveWins();

    if(+consecutivesWins > 0) {
      if(+consecutivesWins >= 10) return;
      console.log(`Congrats You made ${consecutivesWins} wins.`);
    } else {
      console.log("Try again. You have 0 wins.");
    }
  });
});
