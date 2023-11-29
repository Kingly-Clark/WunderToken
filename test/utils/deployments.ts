import { ethers, upgrades } from "hardhat"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import { WunderTokenV1, WunderTokenV2 } from "../../typechain-types"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
// eslint-disable-next-line node/no-missing-import
import { initialBalance } from "./constants"
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
export const applyUpgaraderRole = async (
  wunderTokenV1: WunderTokenV1,
  owner: HardhatEthersSigner,
  upgrader: HardhatEthersSigner,
) => {
  await wunderTokenV1
    .connect(owner)
    .grantRole(await wunderTokenV1.UPGRADER_ROLE(), upgrader.address)
}
export const revokeUpgaraderRole = async (
  wunderTokenV1: WunderTokenV1,
  owner: HardhatEthersSigner,
  upgrader: HardhatEthersSigner,
) => {
  await wunderTokenV1
    .connect(owner)
    .revokeRole(await wunderTokenV1.UPGRADER_ROLE(), upgrader.address)
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

  await wunderTokenV1.connect(minter).mint(acc1.address, initialBalance)
  await wunderTokenV1.connect(minter).mint(acc2.address, initialBalance)
  await wunderTokenV1.connect(minter).mint(acc3.address, initialBalance)

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

export const deployWunderTokenV2 = async () => {
  const [owner, notOwner, minter, pauser, burner, governor, acc1, acc2, acc3] =
    (await ethers.getSigners()) as HardhatEthersSigner[]

  const WunderTokenV1 = await ethers.getContractFactory("WunderTokenV1")
  const WunderTokenV2 = await ethers.getContractFactory("WunderTokenV2")
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

  await applyUpgaraderRole(wunderTokenV1, owner, owner)
  const wunderTokenV2Proxy = await upgrades.upgradeProxy(
    wunderTokenV1ProxyAddress,
    WunderTokenV2,
  )
  await revokeUpgaraderRole(wunderTokenV1, owner, owner)
  const wunderTokenV2ProxyAddress = await wunderTokenV2Proxy.getAddress()
  const wunderTokenV2: WunderTokenV2 = await ethers.getContractAt(
    "WunderTokenV2",
    wunderTokenV2ProxyAddress,
  )

  return {
    wunderTokenV2,
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

export const deployFullWunderTokenV2 = async () => {
  const {
    wunderTokenV2,
    owner,
    notOwner,
    minter,
    pauser,
    burner,
    governor,
    acc1,
    acc2,
    acc3,
  } = await loadFixture(deployWunderTokenV2)

  await applyMinterRole(wunderTokenV2, owner, minter)
  await applyPauserRole(wunderTokenV2, owner, pauser)
  await applyBurnerRole(wunderTokenV2, owner, burner)
  await applyGovernRole(wunderTokenV2, owner, governor)

  await wunderTokenV2.connect(minter).mint(acc1.address, initialBalance)
  await wunderTokenV2.connect(minter).mint(acc2.address, initialBalance)
  await wunderTokenV2.connect(minter).mint(acc3.address, initialBalance)

  return {
    wunderTokenV2,
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
