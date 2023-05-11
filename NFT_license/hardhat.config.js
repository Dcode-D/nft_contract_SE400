/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY, SEPOLIA_URL } = process.env;
module.exports = {
  solidity: "0.8.9",
  //defaultNetwork: "goerli",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  allowUnlimitedContractSize: true,
  networks: {
    hardhat: {},
    goerli: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    sepolia:{
      url: SEPOLIA_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
}
