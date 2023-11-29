import * as chai from "chai"
import { ethers, upgrades } from "hardhat"
import "@nomicfoundation/hardhat-chai-matchers"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
// eslint-disable-next-line node/no-missing-import
import { WunderTokenV1, WunderTokenV2 } from "../../typechain-types"
// eslint-disable-next-line node/no-missing-import
import { applyUpgaraderRole } from "../utils/deployments"
const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect

describe("V1", () => {
  describe("Proxy", () => {
    it("Should be able to deploy a proxy for V1", async () => {
      const [owner] = (await ethers.getSigners()) as HardhatEthersSigner[]

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

      const wunderTokenV1Name = await wunderTokenV1.name()
      const wunderTokenV1Symbol = await wunderTokenV1.symbol()

      expect(wunderTokenV1Name).to.equal("Wunder Token")
      expect(wunderTokenV1Symbol).to.equal("WUNDER")

      expect(wunderTokenV1ProxyAddress).to.not.be.undefined()
      expect(wunderTokenV1ProxyAddress).to.not.be.null()
      expect(wunderTokenV1ProxyAddress).to.not.be.empty()
    })

    it("Shouldn't be possible to upgrade the proxy to V2 without UPGRADER_ROLE", async () => {
      const [owner, notOwner] =
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

      await applyUpgaraderRole(wunderTokenV1, owner, notOwner)

      await expect(
        upgrades.upgradeProxy(wunderTokenV1ProxyAddress, WunderTokenV2),
      ).to.be.revertedWithCustomError(
        wunderTokenV1,
        "AccessControlUnauthorizedAccount",
      )
    })

    it("Should be able to upgrade the proxy to V2", async () => {
      const [owner] = (await ethers.getSigners()) as HardhatEthersSigner[]

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

      const wunderTokenV2ProxyAddress = await wunderTokenV2Proxy.getAddress()
      const wunderTokenV2: WunderTokenV2 = await ethers.getContractAt(
        "WunderTokenV2",
        wunderTokenV2ProxyAddress,
      )

      const wunderTokenV2Name = await wunderTokenV2.name()
      const wunderTokenV2Symbol = await wunderTokenV2.symbol()

      expect(wunderTokenV2Name).to.equal("Wunder Token")
      expect(wunderTokenV2Symbol).to.equal("WUNDER")
    })
  })
})
