import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import "@nomicfoundation/hardhat-chai-matchers"
import { deployFullWunderTokenV1 } from "./utils/deployments"
import * as chai from "chai"
import { wunderToEth } from "./utils/conversions"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect

describe("Government", () => {
  describe("Freezing ", () => {
    it("Should be able to transfer between 2 accounts that aren't frozen", async () => {
      const { wunderTokenV1, acc1, acc2 } = await loadFixture(
        deployFullWunderTokenV1,
      )

      // confirm acc1 and acc2 aren't frozen
      expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()
      expect(await wunderTokenV1.isFrozen(acc2.address)).to.be.false()

      // confirm acc1 has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(
        wunderToEth("1000"),
      )

      // confirm acc2 has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(acc2.address)).to.equal(
        wunderToEth("1000"),
      )

      // transfer 100 ZARS from acc1 to acc2
      await wunderTokenV1
        .connect(acc1)
        .transfer(acc2.address, wunderToEth("100"))

      // confirm acc1 has 900 ZARS
      expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(
        wunderToEth("900"),
      )

      // confirm acc2 has 1100 ZARS
      expect(await wunderTokenV1.balanceOf(acc2.address)).to.equal(
        wunderToEth("1100"),
      )
    })

    it("Should not be able to transfer if source account is frozen", async () => {
      const { wunderTokenV1, governor, acc1, acc2 } = await loadFixture(
        deployFullWunderTokenV1,
      )

      const src = acc1
      const dst = acc2

      // confirm src and dst aren't frozen
      expect(await wunderTokenV1.isFrozen(src.address)).to.be.false()
      expect(await wunderTokenV1.isFrozen(dst.address)).to.be.false()

      // confirm src has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("1000"),
      )

      // confirm dst has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        wunderToEth("1000"),
      )

      // freeze src
      await wunderTokenV1.connect(governor).freeze(src.address)

      // confirm src is frozen
      expect(await wunderTokenV1.isFrozen(src.address)).to.be.true()

      // confirm dst is not frozen
      expect(await wunderTokenV1.isFrozen(dst.address)).to.be.false()

      // confirm src has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("1000"),
      )

      // confirm dst has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        wunderToEth("1000"),
      )

      // transfer 100 ZARS from src to dst
      await expect(
        wunderTokenV1.connect(src).transfer(dst.address, wunderToEth("100")),
      ).to.be.revertedWithCustomError(wunderTokenV1, "WunderTokenAccountFrozen")

      // confirm src has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("1000"),
      )

      // confirm dst has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        wunderToEth("1000"),
      )
    })

    it("Should not be able to transfer if destination account is frozen", async () => {
      const { wunderTokenV1, governor, acc1, acc2 } = await loadFixture(
        deployFullWunderTokenV1,
      )

      const src = acc1
      const dst = acc2

      // confirm src and dst aren't frozen
      expect(await wunderTokenV1.isFrozen(src.address)).to.be.false()
      expect(await wunderTokenV1.isFrozen(dst.address)).to.be.false()

      // confirm src has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("1000"),
      )

      // confirm dst has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        wunderToEth("1000"),
      )

      // freeze dst
      await wunderTokenV1.connect(governor).freeze(dst.address)

      // confirm src is not frozen
      expect(await wunderTokenV1.isFrozen(src.address)).to.be.false()

      // confirm dst is frozen
      expect(await wunderTokenV1.isFrozen(dst.address)).to.be.true()

      // confirm src has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("1000"),
      )

      // confirm dst has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        wunderToEth("1000"),
      )

      // transfer 100 ZARS from src to dst
      await expect(
        wunderTokenV1.connect(src).transfer(dst.address, wunderToEth("100")),
      ).to.be.revertedWithCustomError(wunderTokenV1, "WunderTokenAccountFrozen")

      // confirm src has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("1000"),
      )

      // confirm dst has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        wunderToEth("1000"),
      )
    })

    it("Should not be able to transfer if both source and destination accounts are frozen", async () => {
      const { wunderTokenV1, governor, acc1, acc2 } = await loadFixture(
        deployFullWunderTokenV1,
      )

      const src = acc1
      const dst = acc2

      // confirm src and dst aren't frozen
      expect(await wunderTokenV1.isFrozen(src.address)).to.be.false()
      expect(await wunderTokenV1.isFrozen(dst.address)).to.be.false()

      // confirm src has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("1000"),
      )

      // confirm dst has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        wunderToEth("1000"),
      )

      // freeze src
      await wunderTokenV1.connect(governor).freeze(src.address)

      // freeze dst
      await wunderTokenV1.connect(governor).freeze(dst.address)

      // confirm src is frozen
      expect(await wunderTokenV1.isFrozen(src.address)).to.be.true()

      // confirm dst is frozen
      expect(await wunderTokenV1.isFrozen(dst.address)).to.be.true()

      // confirm src has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("1000"),
      )

      // confirm dst has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        wunderToEth("1000"),
      )

      // transfer 100 ZARS from src to dst
      await expect(
        wunderTokenV1.connect(src).transfer(dst.address, wunderToEth("100")),
      ).to.be.revertedWithCustomError(wunderTokenV1, "WunderTokenAccountFrozen")

      // confirm src has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("1000"),
      )

      // confirm dst has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        wunderToEth("1000"),
      )
    })

    it("Should not be able to freeze an account if it is already frozen", async () => {
      const { wunderTokenV1, governor, acc1 } = await loadFixture(
        deployFullWunderTokenV1,
      )

      // confirm acc1 isn't frozen
      expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()

      // freeze acc1
      await wunderTokenV1.connect(governor).freeze(acc1.address)

      // confirm acc1 is frozen
      expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.true()

      // freeze acc1 again
      await expect(
        wunderTokenV1.connect(governor).freeze(acc1.address),
      ).to.be.revertedWithCustomError(wunderTokenV1, "WunderTokenAccountFrozen")

      // confirm acc1 is still frozen
      expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.true()
    })

    it("Should not be able to unfreeze an account if it is not frozen", async () => {
      const { wunderTokenV1, governor, acc1 } = await loadFixture(
        deployFullWunderTokenV1,
      )

      // confirm acc1 isn't frozen
      expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()

      // unfreeze acc1
      await expect(
        wunderTokenV1.connect(governor).unfreeze(acc1.address),
      ).to.be.revertedWithCustomError(
        wunderTokenV1,
        "WunderTokenAccountNotFrozen",
      )

      // confirm acc1 is still not frozen
      expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()
    })

    it("Should not be able to mint to a frozen account", async () => {
      const { wunderTokenV1, governor, minter, acc1 } = await loadFixture(
        deployFullWunderTokenV1,
      )

      // confirm acc1 isn't frozen
      expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()

      // freeze acc1
      await wunderTokenV1.connect(governor).freeze(acc1.address)

      // confirm acc1 is frozen
      expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.true()

      // confirm acc1 has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(
        wunderToEth("1000"),
      )

      // mint 100 ZARS to acc1
      await expect(
        wunderTokenV1.connect(minter).mint(acc1.address, wunderToEth("100")),
      ).to.be.revertedWithCustomError(wunderTokenV1, "WunderTokenAccountFrozen")

      // confirm acc1 still has 1000 ZARS
      expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(
        wunderToEth("1000"),
      )
    })
  })

  describe("Seizing", () => {})

  describe("Withdrawing", () => {})
})
