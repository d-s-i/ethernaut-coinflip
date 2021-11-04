import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: "0.6.0",
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_RINKEBY_URL,
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    },
    hardhat: {
      mining: {
        auto: false,
        interval: 5000
      },
      forking: {
        url: process.env.ALCHEMY_MAINNET_URL,
      }
    }
  }
};
