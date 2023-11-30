import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import { applyMinterRole, deployWunderTokenV3 } from "../utils/deployments"
// eslint-disable-next-line node/no-missing-import
import { initialBalance } from "../utils/constants"
// eslint-disable-next-line node/no-missing-import
import { wunderToEth } from "../utils/conversions"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect
describe("V3", () => {
  describe("Mint ", () => {
    it("Should be able to `mint` Wunder as MINTER_ROLE", async () => {
      const { wunderTokenV3, owner, minter } =
        await loadFixture(deployWunderTokenV3)
      // confirm minter doens't have MINTER_ROLE
      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.false()

      // grant MINTER_ROLE to minter
      await wunderTokenV3
        .connect(owner)
        .grantRole(await wunderTokenV3.MINTER_ROLE(), minter.address)

      // confirm minter has MINTER_ROLE
      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.true()

      // mint 100 Wunder to minter
      await wunderTokenV3.connect(minter).mint(minter.address, 100)

      // confirm minter has 100 Wunder
      expect(await wunderTokenV3.balanceOf(minter.address)).to.equal(100)
    })

    it("Shouldn't be able to `mint` Wunder as not MINTER_ROLE", async () => {
      const { wunderTokenV3, minter } = await loadFixture(deployWunderTokenV3)
      // confirm minter doens't have MINTER_ROLE
      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.false()

      // mint 100 Wunder to minter
      await expect(
        wunderTokenV3.connect(minter).mint(minter.address, 100),
      ).to.be.revertedWithCustomError(
        wunderTokenV3,
        "AccessControlUnauthorizedAccount",
      )
    })
  })
  describe("BatchMint ", () => {
    it("Should be able to `batchMint` Wunder as MINTER_ROLE", async () => {
      const { wunderTokenV3, owner, minter } =
        await loadFixture(deployWunderTokenV3)
      // confirm minter doens't have MINTER_ROLE
      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.false()

      // grant MINTER_ROLE to minter
      await wunderTokenV3
        .connect(owner)
        .grantRole(await wunderTokenV3.MINTER_ROLE(), minter.address)

      // confirm minter has MINTER_ROLE
      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.true()

      // mint 100 Wunder to minter
      await wunderTokenV3.connect(minter).batchMint([minter.address], [100])

      // confirm minter has 100 Wunder
      expect(await wunderTokenV3.balanceOf(minter.address)).to.equal(100)
    })

    it("Shouldn't be able to `mint` Wunder as not MINTER_ROLE", async () => {
      const { wunderTokenV3, minter } = await loadFixture(deployWunderTokenV3)
      // confirm minter doens't have MINTER_ROLE
      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.false()

      // mint 100 Wunder to minter
      await expect(
        wunderTokenV3.connect(minter).batchMint([minter.address], [100]),
      ).to.be.revertedWithCustomError(
        wunderTokenV3,
        "AccessControlUnauthorizedAccount",
      )
    })

    it("Should be able to mint to multiple accounts", async () => {
      const { wunderTokenV3, acc1, acc2, acc3, minter, owner } =
        await loadFixture(deployWunderTokenV3)

      await applyMinterRole(wunderTokenV3, owner, minter)

      // confirm acc1 has 0 Wunder
      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(0)

      // confirm acc2 has 0 Wunder
      expect(await wunderTokenV3.balanceOf(acc2.address)).to.equal(0)

      // confirm acc3 has 0 Wunder
      expect(await wunderTokenV3.balanceOf(acc3.address)).to.equal(0)

      // mint 1000 Wunder to acc1, acc2 and acc3 respectively
      await wunderTokenV3
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address, acc3.address],
          [initialBalance, initialBalance, initialBalance],
        )

      // confirm acc1 has 1000 Wunder
      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(
        initialBalance,
      )

      // confirm acc2 has 1000 Wunder
      expect(await wunderTokenV3.balanceOf(acc2.address)).to.equal(
        initialBalance,
      )

      // confirm acc3 has 1000 Wunder
      expect(await wunderTokenV3.balanceOf(acc3.address)).to.equal(
        initialBalance,
      )
    })

    it("Should revert if length of addresses and amounts are not equal", async () => {
      const { wunderTokenV3, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV3)
      await applyMinterRole(wunderTokenV3, owner, minter)

      // confirm acc1 has 0 Wunder
      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(0)

      // confirm acc2 has 0 Wunder
      expect(await wunderTokenV3.balanceOf(acc2.address)).to.equal(0)

      await expect(
        wunderTokenV3
          .connect(minter)
          .batchMint([acc1.address, acc2.address], [wunderToEth("1000")]),
      ).to.be.revertedWithCustomError(
        wunderTokenV3,
        "WunderTokenArrayLengthMismatch",
      )
    })

    it("Should revert if there is more than 256 addresses", async () => {
      const { wunderTokenV3, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV3)
      await applyMinterRole(wunderTokenV3, owner, minter)

      // confirm acc1 has 0 Wunder
      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(0)

      // confirm acc2 has 0 Wunder
      expect(await wunderTokenV3.balanceOf(acc2.address)).to.equal(0)

      const receipients = Array(257).fill(acc1.address)
      const amounts = Array(257).fill(wunderToEth("1"))
      await expect(
        wunderTokenV3.connect(minter).batchMint(receipients, amounts),
      ).to.be.revertedWithCustomError(
        wunderTokenV3,
        "WunderTokenArrayLengthExceeded",
      )
    })

    it("Should revert if there are 0 addresses and 0 amounts", async () => {
      const { wunderTokenV3, minter, owner } =
        await loadFixture(deployWunderTokenV3)
      await applyMinterRole(wunderTokenV3, owner, minter)
      await expect(
        wunderTokenV3.connect(minter).batchMint([], []),
      ).to.be.revertedWithCustomError(wunderTokenV3, "WunderTokenArrayEmpty")
    })
  })
})
