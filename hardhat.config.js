require("@nomiclabs/hardhat-waffle");
const dotenv = require("dotenv");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
dotenv.config();
module.exports = {
  solidity: "0.8.7",
  networks: {
    rinkeby: {
      url: `${process.env.RINKEBY_ALCHEMY_WAVE_PROJECT_URL}`,
      accounts: [`${process.env.RINKEBY_ETH_DEV_TESTNET_ACCOUNT_PRIV}`]
    }
  }
};
