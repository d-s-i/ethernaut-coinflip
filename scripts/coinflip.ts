import { BigNumber } from "ethers";
import { ethers } from "hardhat";

async function main() {

  console.log("starting ...");

  const provider = await ethers.provider;

  const [signer] = await ethers.getSigners();

  const CoinFlip = await ethers.getContractFactory("CoinFlip");
  const coinFlip = await new ethers.Contract("0x168f69715E8d71F6E81285D9D66086C8776b059B", CoinFlip.interface, signer);

  const FACTOR = BigNumber.from("57896044618658097711785492504343953926634992332820282019728792003956564819968");

  let waitingForConfirmation = false;

  provider.on("block", async function(blockNumber) {
    const usedBlockNumber = blockNumber;
    
    const usedBlock = await provider.getBlock(usedBlockNumber);
    const usedBlockHash = BigNumber.from(usedBlock.hash);
    
    const coinFlipResult = usedBlockHash.div(FACTOR);
    const side = coinFlipResult.toNumber() === 1 ? true : false;

    
    const feeData = await provider.getFeeData();
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!.mul(5);
    const maxFeePerGas = feeData.maxFeePerGas!.mul(5);
    
    try {
      if(!waitingForConfirmation) {
        waitingForConfirmation = true;
        console.log(`Trying for block ${usedBlockNumber}, result: ${coinFlipResult}, side: ${side}`);
        const guess_tx = await coinFlip.flip(side, { maxPriorityFeePerGas: maxPriorityFeePerGas, maxFeePerGas: maxFeePerGas });
        await guess_tx.wait(1);
        const consecutivesWins = await coinFlip.consecutiveWins();
  
        if(+consecutivesWins > 0) {
          if(+consecutivesWins >= 10) return;
          console.log(`Congrats You made ${consecutivesWins} wins.`);
        } else {
          console.log("Try again. You have 0 wins.");
        }
        waitingForConfirmation = false;
      } else {
        console.log("we had a new block while waiting for a tx");
      }
    } catch(error) {
      console.log("flip function fail");
      console.log(error);
      waitingForConfirmation = false;
    }
  });
}

main();

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
