// scripts/2.upgradeV2.ts
import { ethers, upgrades } from "hardhat"

const proxyAddress = "0x18C52c6F945a41f43EA556B279478E087cEe87e8"

async function main() {
  const signers = await ethers.getSigners()
  const WunderTokenV2 = await ethers.getContractFactory("WunderTokenV2")
  const defaultAdmin = signers[0].address

  console.log(
    `Upgrading WunderToken using wallet ${defaultAdmin} with proxy at ${proxyAddress}`,
  )

  const wunderTokenV2 = await upgrades.upgradeProxy(proxyAddress, WunderTokenV2)
  const wunderTokenV2Address = await wunderTokenV2.getAddress()

  console.log("WunderTokenV2 at:", wunderTokenV2Address)

  const wunderImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(proxyAddress)
  const wunderAdminAdress = await upgrades.erc1967.getAdminAddress(proxyAddress)

  console.log(`WunderTokenV2 proxy deployed to: ${proxyAddress}`)
  console.log(
    `WunderTokenV2 implementation deployed to: ${wunderImplementationAddress}`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
