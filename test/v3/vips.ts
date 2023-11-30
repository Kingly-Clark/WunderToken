import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import {
  applyVipRole,
  deployWunderTokenV3,
  // eslint-disable-next-line node/no-missing-import
} from "../utils/deployments"
// eslint-disable-next-line node/no-missing-import
import { wunderToEth } from "../utils/conversions"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect
describe("V3", () => {
  describe("VIP ", () => {
    it("Shouldn't be able to grant `VIP` status if no VIP_ROLE", async () => {
      const { wunderTokenV3, acc1, owner } =
        await loadFixture(deployWunderTokenV3)

      await expect(
        wunderTokenV3.connect(owner).setVIP(acc1.address),
      ).to.be.revertedWithCustomError(
        wunderTokenV3,
        "AccessControlUnauthorizedAccount",
      )
    })
    it("Should be able to grant `VIP` status if VIP_ROLE", async () => {
      const { wunderTokenV3, acc1, acc3, owner } =
        await loadFixture(deployWunderTokenV3)

      const viper = acc3
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.false()
      await applyVipRole(wunderTokenV3, owner, viper)
      await wunderTokenV3.connect(viper).setVIP(acc1.address)
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.true()
    })
    it("Shouldn't be able to set `VIP` status twice", async () => {
      const { wunderTokenV3, acc1, acc3, owner } =
        await loadFixture(deployWunderTokenV3)

      const viper = acc3
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.false()
      await applyVipRole(wunderTokenV3, owner, viper)
      await wunderTokenV3.connect(viper).setVIP(acc1.address)
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.true()

      await expect(
        wunderTokenV3.connect(viper).setVIP(acc1.address),
      ).to.be.revertedWithCustomError(wunderTokenV3, "VIPAlreadySet")
    })

    it("Shouldn't be able to unsetVIP `VIP` status if no VIP_ROLE", async () => {
      const { wunderTokenV3, acc1, owner } =
        await loadFixture(deployWunderTokenV3)

      await expect(
        wunderTokenV3.connect(owner).unsetVIP(acc1.address),
      ).to.be.revertedWithCustomError(
        wunderTokenV3,
        "AccessControlUnauthorizedAccount",
      )
    })

    it("Should be able to unsetVIP `VIP` status if VIP_ROLE", async () => {
      const { wunderTokenV3, acc1, acc3, owner } =
        await loadFixture(deployWunderTokenV3)

      const viper = acc3
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.false()
      await applyVipRole(wunderTokenV3, owner, viper)
      await wunderTokenV3.connect(viper).setVIP(acc1.address)
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.true()
      await wunderTokenV3.connect(viper).unsetVIP(acc1.address)
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.false()
    })
    it("Shouldn't be able to unsetVIP `VIP` twice", async () => {
      const { wunderTokenV3, acc1, acc3, owner } =
        await loadFixture(deployWunderTokenV3)

      const viper = acc3
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.false()
      await applyVipRole(wunderTokenV3, owner, viper)
      await wunderTokenV3.connect(viper).setVIP(acc1.address)
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.true()
      await wunderTokenV3.connect(viper).unsetVIP(acc1.address)
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.false()

      await expect(
        wunderTokenV3.connect(viper).unsetVIP(acc1.address),
      ).to.be.revertedWithCustomError(wunderTokenV3, "VIPAlreadyUnset")
    })

    it("Shouldn't be able to `claimReward` if not VIP set", async () => {
      const { wunderTokenV3, acc1 } = await loadFixture(deployWunderTokenV3)

      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(0)

      await expect(
        wunderTokenV3.connect(acc1).claimReward(),
      ).to.be.revertedWithCustomError(wunderTokenV3, "NotVIP")
    })

    it("Should be able to `claimReward` if VIP set", async () => {
      const { wunderTokenV3, acc1, acc3, owner } =
        await loadFixture(deployWunderTokenV3)

      const viper = acc3
      await applyVipRole(wunderTokenV3, owner, viper)
      await wunderTokenV3.connect(viper).setVIP(acc1.address)
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.true()

      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(0)

      await wunderTokenV3.connect(acc1).claimReward()

      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(
        wunderToEth("1000"),
      )
    })
    it("Should only be able to `claimReward` once if VIP set", async () => {
      const { wunderTokenV3, acc1, acc3, owner } =
        await loadFixture(deployWunderTokenV3)

      const viper = acc3
      await applyVipRole(wunderTokenV3, owner, viper)
      await wunderTokenV3.connect(viper).setVIP(acc1.address)
      expect(await wunderTokenV3.isVIP(acc1.address)).to.be.true()

      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(0)

      await wunderTokenV3.connect(acc1).claimReward()

      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(
        wunderToEth("1000"),
      )

      await expect(
        wunderTokenV3.connect(acc1).claimReward(),
      ).to.be.revertedWithCustomError(wunderTokenV3, "RewardAlreadyClaimed")

      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(
        wunderToEth("1000"),
      )
    })
  })
})
