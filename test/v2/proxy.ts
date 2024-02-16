import * as chai from "chai"
import { ethers, upgrades } from "hardhat"
import "@nomicfoundation/hardhat-chai-matchers"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
// eslint-disable-next-line node/no-missing-import
import {
  WunderTokenV3,
  WunderTokenV2,
  WunderTokenV1,
  // eslint-disable-next-line node/no-missing-import
} from "../../typechain-types"
// eslint-disable-next-line node/no-missing-import
import { applyUpgaraderRole } from "../utils/deployments"
const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect

describe("V2", () => {
  describe("Proxy", () => {
    it("Should be able to deploy a proxy for V2", async () => {
      const [owner] = (await ethers.getSigners()) as HardhatEthersSigner[]

      const WunderTokenV2 = await ethers.getContractFactory("WunderTokenV2")
      const wunderTokenV2Proxy = await upgrades.deployProxy(
        WunderTokenV2,
        [owner.address],
        { initializer: "initialize" },
      )
      await wunderTokenV2Proxy.waitForDeployment()
      const wunderTokenV2ProxyAddress = await wunderTokenV2Proxy.getAddress()
      const wunderTokenV2: WunderTokenV2 = await ethers.getContractAt(
        "WunderTokenV2",
        wunderTokenV2ProxyAddress,
      )

      const wunderTokenV2Name = await wunderTokenV2.name()
      const wunderTokenV2Symbol = await wunderTokenV2.symbol()

      expect(wunderTokenV2Name).to.equal("Wunderpar")
      expect(wunderTokenV2Symbol).to.equal("WUNDER")

      expect(wunderTokenV2ProxyAddress).to.not.be.undefined()
      expect(wunderTokenV2ProxyAddress).to.not.be.null()
      expect(wunderTokenV2ProxyAddress).to.not.be.empty()
    })

    it("Shouldn't be possible to upgrade the proxy to V2 without UPGRADER_ROLE", async () => {
      const [owner, notOwner] =
        (await ethers.getSigners()) as HardhatEthersSigner[]

      const WunderTokenV2 = await ethers.getContractFactory("WunderTokenV2")
      const WunderTokenV3 = await ethers.getContractFactory("WunderTokenV3")
      const wunderTokenV3Proxy = await upgrades.deployProxy(
        WunderTokenV2,
        [owner.address],
        { initializer: "initialize" },
      )
      await wunderTokenV3Proxy.waitForDeployment()
      const wunderTokenV3ProxyAddress = await wunderTokenV3Proxy.getAddress()

      const wunderTokenV3: WunderTokenV3 = await ethers.getContractAt(
        "WunderTokenV3",
        wunderTokenV3ProxyAddress,
      )

      await applyUpgaraderRole(wunderTokenV3, owner, notOwner)

      await expect(
        upgrades.upgradeProxy(wunderTokenV3ProxyAddress, WunderTokenV3),
      ).to.be.revertedWithCustomError(
        wunderTokenV3,
        "AccessControlUnauthorizedAccount",
      )
    })

    it("Should be able to upgrade the proxy to V3", async () => {
      const [owner] = (await ethers.getSigners()) as HardhatEthersSigner[]

      const WunderTokenV1 = await ethers.getContractFactory("WunderTokenV1")
      const WunderTokenV2 = await ethers.getContractFactory("WunderTokenV2")
      const WunderTokenV3 = await ethers.getContractFactory("WunderTokenV3")

      // Deploy V1
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

      // Upgrade to V2
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

      // Upgrade to V3
      await applyUpgaraderRole(wunderTokenV2, owner, owner)
      const wunderTokenV3Proxy = await upgrades.upgradeProxy(
        wunderTokenV2ProxyAddress,
        WunderTokenV3,
      )

      const wunderTokenV3ProxyAddress = await wunderTokenV3Proxy.getAddress()
      const wunderTokenV3: WunderTokenV3 = await ethers.getContractAt(
        "WunderTokenV3",
        wunderTokenV3ProxyAddress,
      )

      const wunderTokenV3Name = await wunderTokenV3.name()
      const wunderTokenV3Symbol = await wunderTokenV3.symbol()

      expect(wunderTokenV3Name).to.equal("Wunderpar")
      expect(wunderTokenV3Symbol).to.equal("WUNDER")
    })
  })
})
