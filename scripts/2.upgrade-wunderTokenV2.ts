// scripts/2.upgradeV2.ts
import { ethers, upgrades } from "hardhat"

const proxyAddress = "0x58be876955484309706dFd5Fbccdf6D470666774"

async function main() {
  const signers = await ethers.getSigners()
  const signer = signers[0]
  const WunderTokenV1 = await ethers.getContractFactory("WunderTokenV1")
  const wunderTokenV1 = WunderTokenV1.attach(proxyAddress)
  const UPGRADER_ROLE = await wunderTokenV1.UPGRADER_ROLE()

  console.log(`Granting UPGRADER_ROLE to ${signer.address}`)

  await wunderTokenV1.grantRole(UPGRADER_ROLE, signer.address)

  const WunderTokenV2 = await ethers.getContractFactory("WunderTokenV2")

  console.log(
    `Upgrading WunderToken using wallet ${signer.address} with proxy at ${proxyAddress}`,
  )

  const wunderTokenV2 = await upgrades.upgradeProxy(proxyAddress, WunderTokenV2)
  const wunderTokenV2Address = await wunderTokenV2.getAddress()

  console.log("WunderTokenV2 at:", wunderTokenV2Address)

  const wunderImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(proxyAddress)

  console.log(`WunderTokenV2 proxy deployed to: ${proxyAddress}`)
  console.log(
    `WunderTokenV2 implementation deployed to: ${wunderImplementationAddress}`,
  )

  console.log("Removing UPGRADER_ROLE from", signer.address)
  await wunderTokenV1.revokeRole(UPGRADER_ROLE, signer.address)
  console.log("UPGRADER_ROLE removed")

  console.log("Done")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

// 0x9ae666611ddDb9d6158D4Bc4c04564f25C9A25a4
