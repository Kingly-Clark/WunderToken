import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import { applyMinterRole, deployWunderTokenV2 } from "../utils/deployments"
// eslint-disable-next-line node/no-missing-import
import { initialBalance } from "../utils/constants"
// eslint-disable-next-line node/no-missing-import
import { wunderToEth } from "../utils/conversions"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect

describe("V2", () => {
  describe("BatchTransfer", () => {
    it("Should be able to transfer to multiple accounts", async () => {
      const { wunderTokenV2, acc1, acc2, acc3, minter, owner } =
        await loadFixture(deployWunderTokenV2)
      await applyMinterRole(wunderTokenV2, owner, minter)
      await wunderTokenV2
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address, acc3.address],
          [initialBalance, initialBalance, initialBalance],
        )

      const src = acc1

      // confirm src has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(src.address)).to.equal(
        initialBalance,
      )
      // confirm acc2 has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(acc2.address)).to.equal(
        initialBalance,
      )
      // confirm acc3 has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(acc3.address)).to.equal(
        initialBalance,
      )

      // transfer 100 Wunder from src to acc2 and acc3 respectively
      await wunderTokenV2
        .connect(src)
        .batchTransfer(
          [acc2.address, acc3.address],
          [wunderToEth("100"), wunderToEth("100")],
        )

      // confirm src has 900 Wunder
      expect(await wunderTokenV2.balanceOf(src.address)).to.equal(
        wunderToEth("800"),
      )

      // confirm acc2 has 1100 Wunder
      expect(await wunderTokenV2.balanceOf(acc2.address)).to.equal(
        wunderToEth("1100"),
      )

      // confirm acc3 has 1100 Wunder
      expect(await wunderTokenV2.balanceOf(acc3.address)).to.equal(
        wunderToEth("1100"),
      )
    })

    it("Should be able to transfer to the same account as destination account", async () => {
      const { wunderTokenV2, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV2)
      await applyMinterRole(wunderTokenV2, owner, minter)
      await wunderTokenV2
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address],
          [initialBalance, initialBalance],
        )

      const src = acc1
      const dst = acc2
      // confirm src has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(dst.address)).to.equal(
        initialBalance,
      )

      await wunderTokenV2
        .connect(src)
        .batchTransfer(
          [dst.address, dst.address],
          [wunderToEth("100"), wunderToEth("100")],
        )

      // confirm src has 800 Wunder
      expect(await wunderTokenV2.balanceOf(src.address)).to.equal(
        wunderToEth("800"),
      )

      // confirm dst has 1200 Wunder
      expect(await wunderTokenV2.balanceOf(dst.address)).to.equal(
        wunderToEth("1200"),
      )
    })

    it("Shouldn't be able to transfer to the same destination account if src funds run out after first transfer", async () => {
      const { wunderTokenV2, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV2)
      await applyMinterRole(wunderTokenV2, owner, minter)
      await wunderTokenV2
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address],
          [initialBalance, initialBalance],
        )

      const src = acc1
      const dst = acc2

      // confirm src has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(dst.address)).to.equal(
        initialBalance,
      )

      await expect(
        wunderTokenV2
          .connect(src)
          .batchTransfer(
            [dst.address, dst.address],
            [wunderToEth("600"), wunderToEth("600")],
          ),
      ).to.be.revertedWithCustomError(wunderTokenV2, "ERC20InsufficientBalance")

      // confirm src has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(dst.address)).to.equal(
        initialBalance,
      )
    })

    it("Should revert if length of addresses and amounts are not equal", async () => {
      const { wunderTokenV2, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV2)
      await applyMinterRole(wunderTokenV2, owner, minter)
      await wunderTokenV2
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address],
          [initialBalance, initialBalance],
        )

      const src = acc1
      const dst = acc2

      // confirm src has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(dst.address)).to.equal(
        initialBalance,
      )

      await expect(
        wunderTokenV2
          .connect(src)
          .batchTransfer([dst.address, dst.address], [wunderToEth("600")]),
      ).to.be.revertedWithCustomError(
        wunderTokenV2,
        "WunderTokenArrayLengthMismatch",
      )
    })

    it("Should revert if there is more than 256 addresses", async () => {
      const { wunderTokenV2, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV2)
      await applyMinterRole(wunderTokenV2, owner, minter)
      await wunderTokenV2
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address],
          [initialBalance, initialBalance],
        )

      const src = acc1
      const dst = acc2

      // confirm src has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(dst.address)).to.equal(
        initialBalance,
      )

      const receipients = Array(257).fill(dst.address)
      const amounts = Array(257).fill(wunderToEth("1"))
      await expect(
        wunderTokenV2.connect(src).batchTransfer(receipients, amounts),
      ).to.be.revertedWithCustomError(
        wunderTokenV2,
        "WunderTokenArrayLengthExceeded",
      )
    })

    it("Should revert if there are 0 addresses and 0 amounts", async () => {
      const { wunderTokenV2, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV2)
      await applyMinterRole(wunderTokenV2, owner, minter)
      await wunderTokenV2
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address],
          [initialBalance, initialBalance],
        )

      const src = acc1
      const dst = acc2

      // confirm src has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(dst.address)).to.equal(
        initialBalance,
      )

      await expect(
        wunderTokenV2.connect(src).batchTransfer([], []),
      ).to.be.revertedWithCustomError(wunderTokenV2, "WunderTokenArrayEmpty")
    })
  })
})
