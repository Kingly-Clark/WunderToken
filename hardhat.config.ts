import { HardhatUserConfig, task } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@openzeppelin/hardhat-upgrades"
import "solidity-coverage"
import "hardhat-gas-reporter"
import * as dotenv from "dotenv"
import "hardhat-contract-sizer"
import "solidity-docgen"
import "@nomicfoundation/hardhat-verify"
import "@nomicfoundation/hardhat-ledger"

dotenv.config()
const WUNDERPAR_DEPLOYER_WALLET = "0x5f73be3809D89e13257877Aa8c47157c3765d081"
const WUNDERFAN_DEPLOYER_WALLET = "0xB5a8A434912Ac6ff9Fa1b3C99fDC8Af5789b06b8"

const DEPLOYER_WALLET = WUNDERFAN_DEPLOYER_WALLET

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

task("sign", "Signs a message", async (_, hre) => {
  const message = "asdf"
  const account = DEPLOYER_WALLET

  const signature = await hre.network.provider.request({
    method: "personal_sign",
    params: [message, account],
  })

  console.log(
    "Signed message",
    message,
    "for Ledger account",
    account,
    "and got",
    signature,
  )
})

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY ?? "",
      polygonAmoy: process.env.POLYGONSCAN_API_KEY ?? "",
      polygon: process.env.POLYGONSCAN_API_KEY ?? "",
      arbitrumOne: process.env.ARBITRUMSCAN_API_KEY ?? "",
      arbitrumSepolia: process.env.ARBITRUMSCAN_API_KEY ?? "",
    },
  },
  sourcify: {
    enabled: true,
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
      ledgerAccounts: [DEPLOYER_WALLET],
    },
    mumbai: {
      url: process.env.MUMBAI_NODE,
      // accounts: [process.env.WUNDERPAR_DEPLOYER_PRIVATE_KEY ?? ""],
      gasPrice: 10e9,
      ledgerAccounts: [DEPLOYER_WALLET],
    },
    amoy: {
      url: process.env.AMOY_NODE,
      accounts: [process.env.WUNDERPAR_DEPLOYER_PRIVATE_KEY ?? ""],
      gasPrice: 35e9,
      // ledgerAccounts: [DEPLOYER_WALLET],
    },
    polygon: {
      url: process.env.POLYGON_NODE,
      accounts: [process.env.WUNDERPAR_DEPLOYER_PRIVATE_KEY ?? ""],
      gasPrice: 45e9,
      // ledgerAccounts: [DEPLOYER_WALLET],
    },
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL,
      accounts: [process.env.WUNDERPAR_DEPLOYER_PRIVATE_KEY ?? ""],
      gasPrice: 10e9,
      // ledgerAccounts: [DEPLOYER_WALLET],
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL,
      accounts: [process.env.WUNDERPAR_DEPLOYER_PRIVATE_KEY ?? ""],
      gasPrice: 10e6,
      /* The line `// accounts: [process.env.WUNDERPAR_DEPLOYER_PRIVATE_KEY ?? ""],` is a commented-out
      line in the Hardhat configuration file. In TypeScript, the `??` operator is the nullish
      coalescing operator, which returns the right-hand operand if the left-hand operand is `null`
      or `undefined`, otherwise it returns the left-hand operand. */
      // ledgerAccounts: [DEPLOYER_WALLET],
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
