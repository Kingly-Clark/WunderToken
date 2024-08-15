import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import { applyMinterRole, deployWunderTokenV2 } from "../utils/deployments"
// eslint-disable-next-line node/no-missing-import
import { initialBalance } from "../utils/constants"
// eslint-disable-next-line node/no-missing-import
import { wunderToEth } from "../utils/conversions"
import { generateGUID, guidToBytes16, bytes16ToHex } from "../utils/guid"
import { ethers } from "hardhat"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect
describe("V2", () => {
  describe("Mint ", () => {
    it("Should be able to `mint` Wunder as MINTER_ROLE", async () => {
      const { wunderTokenV2, owner, minter } =
        await loadFixture(deployWunderTokenV2)
      // confirm minter doens't have MINTER_ROLE
      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.false()

      // grant MINTER_ROLE to minter
      await wunderTokenV2
        .connect(owner)
        .grantRole(await wunderTokenV2.MINTER_ROLE(), minter.address)

      // confirm minter has MINTER_ROLE
      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.true()

      // mint 100 Wunder to minter
      await wunderTokenV2.connect(minter).mint(minter.address, 100)

      // confirm minter has 100 Wunder
      expect(await wunderTokenV2.balanceOf(minter.address)).to.equal(100)
    })

    it("Shouldn't be able to `mint` Wunder as not MINTER_ROLE", async () => {
      const { wunderTokenV2, minter } = await loadFixture(deployWunderTokenV2)
      // confirm minter doens't have MINTER_ROLE
      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.false()

      // mint 100 Wunder to minter
      await expect(
        wunderTokenV2.connect(minter).mint(minter.address, 100),
      ).to.be.revertedWithCustomError(
        wunderTokenV2,
        "AccessControlUnauthorizedAccount",
      )
    })
  })
  describe("BatchMint ", () => {
    it("Should be able to `batchMint` Wunder as MINTER_ROLE", async () => {
      const { wunderTokenV2, owner, minter } =
        await loadFixture(deployWunderTokenV2)
      // confirm minter doens't have MINTER_ROLE
      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.false()

      // grant MINTER_ROLE to minter
      await wunderTokenV2
        .connect(owner)
        .grantRole(await wunderTokenV2.MINTER_ROLE(), minter.address)

      // confirm minter has MINTER_ROLE
      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.true()

      // mint 100 Wunder to minter
      await wunderTokenV2.connect(minter).batchMint([minter.address], [100])

      // confirm minter has 100 Wunder
      expect(await wunderTokenV2.balanceOf(minter.address)).to.equal(100)
    })

    it("Shouldn't be able to `mint` Wunder as not MINTER_ROLE", async () => {
      const { wunderTokenV2, minter } = await loadFixture(deployWunderTokenV2)
      // confirm minter doens't have MINTER_ROLE
      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.MINTER_ROLE(),
          minter.address,
        ),
      ).to.be.false()

      // mint 100 Wunder to minter
      await expect(
        wunderTokenV2.connect(minter).batchMint([minter.address], [100]),
      ).to.be.revertedWithCustomError(
        wunderTokenV2,
        "AccessControlUnauthorizedAccount",
      )
    })

    it("Should be able to mint to multiple accounts", async () => {
      const { wunderTokenV2, acc1, acc2, acc3, minter, owner } =
        await loadFixture(deployWunderTokenV2)

      await applyMinterRole(wunderTokenV2, owner, minter)

      // confirm acc1 has 0 Wunder
      expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(0)

      // confirm acc2 has 0 Wunder
      expect(await wunderTokenV2.balanceOf(acc2.address)).to.equal(0)

      // confirm acc3 has 0 Wunder
      expect(await wunderTokenV2.balanceOf(acc3.address)).to.equal(0)

      // mint 1000 Wunder to acc1, acc2 and acc3 respectively
      await wunderTokenV2
        .connect(minter)
        .batchMint(
          [acc1.address, acc2.address, acc3.address],
          [initialBalance, initialBalance, initialBalance],
        )

      // confirm acc1 has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(
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
    })

    it("Should revert if length of addresses and amounts are not equal", async () => {
      const { wunderTokenV2, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV2)
      await applyMinterRole(wunderTokenV2, owner, minter)

      // confirm acc1 has 0 Wunder
      expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(0)

      // confirm acc2 has 0 Wunder
      expect(await wunderTokenV2.balanceOf(acc2.address)).to.equal(0)

      await expect(
        wunderTokenV2
          .connect(minter)
          .batchMint([acc1.address, acc2.address], [wunderToEth("1000")]),
      ).to.be.revertedWithCustomError(
        wunderTokenV2,
        "WunderTokenArrayLengthMismatch",
      )
    })

    it("Should revert if there is more than 256 addresses", async () => {
      const { wunderTokenV2, acc1, acc2, minter, owner } =
        await loadFixture(deployWunderTokenV2)
      await applyMinterRole(wunderTokenV2, owner, minter)

      // confirm acc1 has 0 Wunder
      expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(0)

      // confirm acc2 has 0 Wunder
      expect(await wunderTokenV2.balanceOf(acc2.address)).to.equal(0)

      const receipients = Array(257).fill(acc1.address)
      const amounts = Array(257).fill(wunderToEth("1"))
      await expect(
        wunderTokenV2.connect(minter).batchMint(receipients, amounts),
      ).to.be.revertedWithCustomError(
        wunderTokenV2,
        "WunderTokenArrayLengthExceeded",
      )
    })

    it("Should revert if there are 0 addresses and 0 amounts", async () => {
      const { wunderTokenV2, minter, owner } =
        await loadFixture(deployWunderTokenV2)
      await applyMinterRole(wunderTokenV2, owner, minter)
      await expect(
        wunderTokenV2.connect(minter).batchMint([], []),
      ).to.be.revertedWithCustomError(wunderTokenV2, "WunderTokenArrayEmpty")
    })

    it("Should emit a BatchMintWithId for the batchMintWithId method", async () => {
      const { wunderTokenV2, acc1, acc2, acc3, minter, owner } =
        await loadFixture(deployWunderTokenV2)
      await applyMinterRole(wunderTokenV2, owner, minter)

      const initialBalance = wunderToEth("100")

      // confirm acc1 has 0 Wunder
      expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(0)

      // confirm acc2 has 0 Wunder
      expect(await wunderTokenV2.balanceOf(acc2.address)).to.equal(0)

      // confirm acc3 has 0 Wunder
      expect(await wunderTokenV2.balanceOf(acc3.address)).to.equal(0)

      // Generate GUIDs
      const guids = Array(3)
        .fill(null)
        .map(() => generateGUID())
      const guidsBytes16 = guids
        .map((guid) => guidToBytes16(guid))
        .map((bytes) => bytes16ToHex(bytes))
      const recipients = [acc1.address, acc2.address, acc3.address]
      const amounts = Array(3).fill(initialBalance)

      await expect(
        await wunderTokenV2
          .connect(minter)
          .batchMintWithId(recipients, amounts, guidsBytes16),
      )
        .to.emit(wunderTokenV2, "BatchMintWithId")
        .withArgs(minter.address, recipients, amounts, guidsBytes16)

      // confirm acc1 has 1000 Wunder
      expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(
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
    })

    it("Should emit a BatchMintWithId event for 256 entries", async () => {
      const { wunderTokenV2, minter, owner } =
        await loadFixture(deployWunderTokenV2)
      await applyMinterRole(wunderTokenV2, owner, minter)

      const initialBalance = wunderToEth("100")

      // Generate 256 GUIDs, recipients, and amounts
      const recipients = Array(256)
        .fill(null)
        .map(() => ethers.Wallet.createRandom().address)
      const amounts = Array(256).fill(initialBalance)
      const guidsBytes16 = Array(256)
        .fill(null)
        .map(() => bytes16ToHex(guidToBytes16(generateGUID())))

      await expect(
        wunderTokenV2
          .connect(minter)
          .batchMintWithId(recipients, amounts, guidsBytes16),
      )
        .to.emit(wunderTokenV2, "BatchMintWithId")
        .withArgs(minter.address, recipients, amounts, guidsBytes16)

      // Confirm balances
      for (let i = 0; i < 256; i++) {
        expect(await wunderTokenV2.balanceOf(recipients[i])).to.equal(
          initialBalance,
        )
      }
    })
  })
})
