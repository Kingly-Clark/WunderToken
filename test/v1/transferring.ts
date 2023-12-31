import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import {
  applyGovernRole,
  applyMinterRole,
  deployWunderTokenV1,
  // eslint-disable-next-line node/no-missing-import
} from "../utils/deployments"
// eslint-disable-next-line node/no-missing-import
import { initialBalance } from "../utils/constants"
// eslint-disable-next-line node/no-missing-import
import { wunderToEth } from "../utils/conversions"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect

describe("V1", () => {
  describe("BatchTransfer", () => {
    it("Should be able to transfer to multiple accounts", async () => {
      const { wunderTokenV1, acc1, acc2, acc3, minter, owner } =
        await loadFixture(deployWunderTokenV1)
      await applyMinterRole(wunderTokenV1, owner, minter)
      await wunderTokenV1
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address, acc3.address],
          [initialBalance, initialBalance, initialBalance],
        )

      const src = acc1

      // confirm src has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        initialBalance,
      )
      // confirm acc2 has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(acc2.address)).to.equal(
        initialBalance,
      )
      // confirm acc3 has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(acc3.address)).to.equal(
        initialBalance,
      )

      // transfer 100 Wunder from src to acc2 and acc3 respectively
      await wunderTokenV1
        .connect(src)
        .batchTransfer(
          [acc2.address, acc3.address],
          [wunderToEth("100"), wunderToEth("100")],
        )

      // confirm src has 900 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("800"),
      )

      // confirm acc2 has 1100 Wunder
      expect(await wunderTokenV1.balanceOf(acc2.address)).to.equal(
        wunderToEth("1100"),
      )

      // confirm acc3 has 1100 Wunder
      expect(await wunderTokenV1.balanceOf(acc3.address)).to.equal(
        wunderToEth("1100"),
      )
    })

    it("Should be able to transfer to the same account as destination account", async () => {
      const { wunderTokenV1, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV1)
      await applyMinterRole(wunderTokenV1, owner, minter)
      await wunderTokenV1
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address],
          [initialBalance, initialBalance],
        )

      const src = acc1
      const dst = acc2
      // confirm src has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        initialBalance,
      )

      await wunderTokenV1
        .connect(src)
        .batchTransfer(
          [dst.address, dst.address],
          [wunderToEth("100"), wunderToEth("100")],
        )

      // confirm src has 800 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("800"),
      )

      // confirm dst has 1200 Wunder
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        wunderToEth("1200"),
      )
    })

    it("Shouldn't be able to transfer to the same destination account if src funds run out after first transfer", async () => {
      const { wunderTokenV1, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV1)
      await applyMinterRole(wunderTokenV1, owner, minter)
      await wunderTokenV1
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address],
          [initialBalance, initialBalance],
        )

      const src = acc1
      const dst = acc2

      // confirm src has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        initialBalance,
      )

      await expect(
        wunderTokenV1
          .connect(src)
          .batchTransfer(
            [dst.address, dst.address],
            [wunderToEth("600"), wunderToEth("600")],
          ),
      ).to.be.revertedWithCustomError(wunderTokenV1, "ERC20InsufficientBalance")

      // confirm src has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        initialBalance,
      )
    })

    it("Should revert if length of addresses and amounts are not equal", async () => {
      const { wunderTokenV1, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV1)
      await applyMinterRole(wunderTokenV1, owner, minter)
      await wunderTokenV1
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address],
          [initialBalance, initialBalance],
        )

      const src = acc1
      const dst = acc2

      // confirm src has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        initialBalance,
      )

      await expect(
        wunderTokenV1
          .connect(src)
          .batchTransfer([dst.address, dst.address], [wunderToEth("600")]),
      ).to.be.revertedWithCustomError(
        wunderTokenV1,
        "WunderTokenArrayLengthMismatch",
      )
    })

    it("Should revert if there is more than 256 addresses", async () => {
      const { wunderTokenV1, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV1)
      await applyMinterRole(wunderTokenV1, owner, minter)
      await wunderTokenV1
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address],
          [initialBalance, initialBalance],
        )

      const src = acc1
      const dst = acc2

      // confirm src has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        initialBalance,
      )

      const receipients = Array(257).fill(dst.address)
      const amounts = Array(257).fill(wunderToEth("1"))
      await expect(
        wunderTokenV1.connect(src).batchTransfer(receipients, amounts),
      ).to.be.revertedWithCustomError(
        wunderTokenV1,
        "WunderTokenArrayLengthExceeded",
      )
    })

    it("Should revert if there are 0 addresses and 0 amounts", async () => {
      const { wunderTokenV1, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV1)
      await applyMinterRole(wunderTokenV1, owner, minter)
      await wunderTokenV1
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address],
          [initialBalance, initialBalance],
        )

      const src = acc1
      const dst = acc2

      // confirm src has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm dst has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
        initialBalance,
      )

      await expect(
        wunderTokenV1.connect(src).batchTransfer([], []),
      ).to.be.revertedWithCustomError(wunderTokenV1, "WunderTokenArrayEmpty")
    })

    it("Should revert if sender is frozen", async () => {
      const { wunderTokenV1, acc1, acc2, acc3, minter, owner, governor } =
        await loadFixture(deployWunderTokenV1)
      await applyMinterRole(wunderTokenV1, owner, minter)
      await wunderTokenV1
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address, acc3.address],
          [initialBalance, initialBalance, initialBalance],
        )

      const src = acc2

      // confirm src has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        initialBalance,
      )
      // confirm acc2 has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(acc2.address)).to.equal(
        initialBalance,
      )
      // confirm acc3 has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(acc3.address)).to.equal(
        initialBalance,
      )

      await applyGovernRole(wunderTokenV1, owner, governor)

      // // freeze acc2
      await wunderTokenV1.connect(governor).freeze(acc2.address)

      // transfer 100 Wunder from src to acc2 and acc3 respectively
      await expect(
        wunderTokenV1
          .connect(src)
          .batchTransfer(
            [acc1.address, acc3.address],
            [wunderToEth("100"), wunderToEth("100")],
          ),
      ).to.be.revertedWithCustomError(wunderTokenV1, "WunderTokenAccountFrozen")

      // confirm src has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        initialBalance,
      )

      // confirm acc2 has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(acc2.address)).to.equal(
        initialBalance,
      )

      // confirm acc3 has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(acc3.address)).to.equal(
        initialBalance,
      )
    })

    it("Shouldn't revert if receiver is frozen", async () => {
      const { wunderTokenV1, acc1, acc2, acc3, minter, owner, governor } =
        await loadFixture(deployWunderTokenV1)
      await applyMinterRole(wunderTokenV1, owner, minter)
      await wunderTokenV1
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address, acc3.address],
          [initialBalance, initialBalance, initialBalance],
        )

      const receiver = acc2
      const src = acc1

      // confirm src has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(receiver.address)).to.equal(
        initialBalance,
      )
      // confirm acc2 has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(acc2.address)).to.equal(
        initialBalance,
      )
      // confirm acc3 has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(acc3.address)).to.equal(
        initialBalance,
      )

      await applyGovernRole(wunderTokenV1, owner, governor)

      // // freeze acc2
      await wunderTokenV1.connect(governor).freeze(acc2.address)

      // transfer 100 Wunder from src to acc2 and acc3 respectively
      await wunderTokenV1
        .connect(src)
        .batchTransfer(
          [acc2.address, acc3.address],
          [wunderToEth("100"), wunderToEth("100")],
        )
      // confirm src has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
        wunderToEth("800"),
      )

      // confirm acc2 has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(acc2.address)).to.equal(
        wunderToEth("1100"),
      )

      // confirm acc3 has 1000 Wunder
      expect(await wunderTokenV1.balanceOf(acc3.address)).to.equal(
        wunderToEth("1100"),
      )
    })
  })
})
