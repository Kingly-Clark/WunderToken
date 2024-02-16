// scripts/1.deploy_box.ts
import { ethers, upgrades } from "hardhat"

const WUNDERPAR_SERVER_ADDRESS = "0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B"

async function main() {
  const signers = await ethers.getSigners()
  const WunderTokenV1 = await ethers.getContractFactory("WunderTokenV1")
  const signer = signers[0]
  const defaultAdmin = signer.address

  console.log(`Deploying WunderTokenV1 using wallet ${defaultAdmin}`)
  const balance = await ethers.provider.getBalance(defaultAdmin)
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`)

  const wunderTokenV1 = await upgrades.deployProxy(WunderTokenV1, [
    defaultAdmin,
  ])
  await wunderTokenV1.waitForDeployment()
  const wunderTokenAddress = await wunderTokenV1.getAddress()
  const wunderImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(wunderTokenAddress)
  const wunderAdminAdress =
    await upgrades.erc1967.getAdminAddress(wunderTokenAddress)

  console.log(`WunderTokenV1 proxy deployed to: ${wunderTokenAddress}`)
  console.log(
    `WunderTokenV1 implementation deployed to: ${wunderImplementationAddress}`,
  )
  console.log(`WunderTokenV1 admin deployed to: ${wunderAdminAdress}`)

  console.log(`Granting MINTER_ROLE to ${WUNDERPAR_SERVER_ADDRESS}`)
  await wunderTokenV1.grantRole(
    await wunderTokenV1.MINTER_ROLE(),
    WUNDERPAR_SERVER_ADDRESS,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
