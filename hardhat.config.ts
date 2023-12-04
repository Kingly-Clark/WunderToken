import { HardhatUserConfig, task } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@openzeppelin/hardhat-upgrades"
import "solidity-coverage"
import "hardhat-gas-reporter"
import * as dotenv from "dotenv"
import "hardhat-contract-sizer"
import "solidity-docgen"
import "@nomicfoundation/hardhat-verify"
dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY ?? "",
      polygon: process.env.POLYGONSCAN_API_KEY ?? "",
    },
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled: !!process.env.REPORT_GAS,
    gasPriceApi: `https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice`,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
  networks: {
    hardhat: {
      blockGasLimit: 30e6,
      gas: 24e6,
      gasPrice: 8e9,
    },
    mumbai: {
      url: process.env.MUMBAI_NODE,
      accounts: [process.env.WUNDERPAR_DEPLOYER_PRIVATE_KEY ?? ""],
      gasPrice: 3e9,
    },
    polygon: {
      url: process.env.POLYGON_NODE,
      accounts: [process.env.WUNDERPAR_DEPLOYER_PRIVATE_KEY ?? ""],
      gasPrice: 200e9,
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: ["WunderTokenV1", "WunderTokenV2", "WunderTokenV3"],
  },
}

export default config
