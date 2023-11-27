import { ethers, upgrades } from "hardhat"
import "@nomicfoundation/hardhat-chai-matchers"
import { WunderTokenV1 } from "../../typechain-types"
import { wunderToEth } from "./conversions"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
export const deployWunderTokenV1 = async () => {
  const [owner, notOwner, minter, pauser, burner, governor, acc1, acc2, acc3] =
    (await ethers.getSigners()) as HardhatEthersSigner[]

  const WunderTokenV1 = await ethers.getContractFactory("WunderTokenV1")
  const wunderTokenV1Proxy = await upgrades.deployProxy(
    WunderTokenV1,
    [owner.address],
    { initializer: "initialize" },
  )
  await wunderTokenV1Proxy.waitForDeployment()
  const wunderTokenV1ProxyAddress = await wunderTokenV1Proxy.getAddress()
  const wunderTokenV1: WunderTokenV1 = await ethers.getContractAt(
    "WunderTokenV1",
    wunderTokenV1ProxyAddress,
  )
  return {
    wunderTokenV1,
    owner,
    notOwner,
    minter,
    pauser,
    burner,
    governor,
    acc1,
    acc2,
    acc3,
  }
}

export const applyMinterRole = async (
  wunderTokenV1: WunderTokenV1,
  owner: HardhatEthersSigner,
  minter: HardhatEthersSigner,
) => {
  await wunderTokenV1
    .connect(owner)
    .grantRole(await wunderTokenV1.MINTER_ROLE(), minter.address)
}

export const applyPauserRole = async (
  wunderTokenV1: WunderTokenV1,
  owner: HardhatEthersSigner,
  pauser: HardhatEthersSigner,
) => {
  await wunderTokenV1
    .connect(owner)
    .grantRole(await wunderTokenV1.PAUSER_ROLE(), pauser.address)
}

export const applyBurnerRole = async (
  wunderTokenV1: WunderTokenV1,
  owner: HardhatEthersSigner,
  burner: HardhatEthersSigner,
) => {
  await wunderTokenV1
    .connect(owner)
    .grantRole(await wunderTokenV1.BURNER_ROLE(), burner.address)
}

export const applyGovernRole = async (
  wunderTokenV1: WunderTokenV1,
  owner: HardhatEthersSigner,
  govern: HardhatEthersSigner,
) => {
  await wunderTokenV1
    .connect(owner)
    .grantRole(await wunderTokenV1.GOVERN_ROLE(), govern.address)
}

// /**
//  * Fixture to
//  *  - deploy WunderToken
//  *  - apply roles
//  *  - mint 1000 Wunder (1e21) tokens to acc1, acc2, acc3
//  *
//  * @returns
//  * wunderTokenV1: WunderTokenV1 contract
//  * owner: owner of WunderTokenV1
//  * notOwner: not owner of WunderTokenV1
//  * minter: minter of WunderTokenV1
//  * pauser: pauser of WunderTokenV1
//  * burner: burner of WunderTokenV1
//  * governor: governor of WunderTokenV1
//  * acc1: account 1
//  * acc2: account 2
//  * acc3: account 3
//  *
//  */
export const deployFullWunderTokenV1 = async () => {
  const {
    wunderTokenV1,
    owner,
    notOwner,
    minter,
    pauser,
    burner,
    governor,
    acc1,
    acc2,
    acc3,
  } = await loadFixture(deployWunderTokenV1)

  await applyMinterRole(wunderTokenV1, owner, minter)
  await applyPauserRole(wunderTokenV1, owner, pauser)
  await applyBurnerRole(wunderTokenV1, owner, burner)
  await applyGovernRole(wunderTokenV1, owner, governor)

  await wunderTokenV1.connect(minter).mint(acc1.address, wunderToEth("1000"))
  await wunderTokenV1.connect(minter).mint(acc2.address, wunderToEth("1000"))
  await wunderTokenV1.connect(minter).mint(acc3.address, wunderToEth("1000"))

  return {
    wunderTokenV1,
    owner,
    notOwner,
    minter,
    pauser,
    burner,
    governor,
    acc1,
    acc2,
    acc3,
  }
}
