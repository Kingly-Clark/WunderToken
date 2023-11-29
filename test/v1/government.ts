import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import { deployFullWunderTokenV1 } from "../utils/deployments"
import * as chai from "chai"
// eslint-disable-next-line node/no-missing-import
import { wunderToEth } from "../utils/conversions"
// eslint-disable-next-line node/no-missing-import
import { initialBalance } from "../utils/constants"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect
describe("V1", () => {
  describe("Government", () => {
    describe("Freezing ", () => {
      it("Should be able to transfer between 2 accounts that aren't frozen", async () => {
        const { wunderTokenV1, acc1, acc2 } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // confirm acc1 and acc2 aren't frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()
        expect(await wunderTokenV1.isFrozen(acc2.address)).to.be.false()

        // confirm acc1 has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(
          wunderToEth("1000"),
        )

        // confirm acc2 has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(acc2.address)).to.equal(
          wunderToEth("1000"),
        )

        // transfer 100 Wunder from acc1 to acc2
        await wunderTokenV1
          .connect(acc1)
          .transfer(acc2.address, wunderToEth("100"))

        // confirm acc1 has 900 Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(
          wunderToEth("900"),
        )

        // confirm acc2 has 1100 Wunder
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

        // confirm src has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
          wunderToEth("1000"),
        )

        // confirm dst has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
          wunderToEth("1000"),
        )

        // freeze src
        await wunderTokenV1.connect(governor).freeze(src.address)

        // confirm src is frozen
        expect(await wunderTokenV1.isFrozen(src.address)).to.be.true()

        // confirm dst is not frozen
        expect(await wunderTokenV1.isFrozen(dst.address)).to.be.false()

        // confirm src has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
          wunderToEth("1000"),
        )

        // confirm dst has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
          wunderToEth("1000"),
        )

        // transfer 100 Wunder from src to dst
        await expect(
          wunderTokenV1.connect(src).transfer(dst.address, wunderToEth("100")),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "WunderTokenAccountFrozen",
        )

        // confirm src has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
          wunderToEth("1000"),
        )

        // confirm dst has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
          wunderToEth("1000"),
        )
      })

      it("Should be able to transfer if destination account is frozen", async () => {
        const { wunderTokenV1, governor, acc1, acc2 } = await loadFixture(
          deployFullWunderTokenV1,
        )

        const src = acc1
        const dst = acc2

        // confirm src and dst aren't frozen
        expect(await wunderTokenV1.isFrozen(src.address)).to.be.false()
        expect(await wunderTokenV1.isFrozen(dst.address)).to.be.false()

        // confirm src has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
          wunderToEth("1000"),
        )

        // confirm dst has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
          wunderToEth("1000"),
        )

        // freeze dst
        await wunderTokenV1.connect(governor).freeze(dst.address)

        // confirm src is not frozen
        expect(await wunderTokenV1.isFrozen(src.address)).to.be.false()

        // confirm dst is frozen
        expect(await wunderTokenV1.isFrozen(dst.address)).to.be.true()

        // confirm src has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
          wunderToEth("1000"),
        )

        // confirm dst has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
          wunderToEth("1000"),
        )

        // transfer 100 Wunder from src to dst
        await wunderTokenV1
          .connect(src)
          .transfer(dst.address, wunderToEth("100"))

        // confirm src has 900 Wunder
        expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
          wunderToEth("900"),
        )

        // confirm dst has 1100 Wunder
        expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
          wunderToEth("1100"),
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

        // confirm src has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
          wunderToEth("1000"),
        )

        // confirm dst has 1000 Wunder
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

        // confirm src has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
          wunderToEth("1000"),
        )

        // confirm dst has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(dst.address)).to.equal(
          wunderToEth("1000"),
        )

        // transfer 100 Wunder from src to dst
        await expect(
          wunderTokenV1.connect(src).transfer(dst.address, wunderToEth("100")),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "WunderTokenAccountFrozen",
        )

        // confirm src has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(src.address)).to.equal(
          wunderToEth("1000"),
        )

        // confirm dst has 1000 Wunder
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
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "WunderTokenAccountFrozen",
        )

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

      it("Should be able to mint to a frozen account", async () => {
        const { wunderTokenV1, governor, minter, acc1 } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // confirm acc1 isn't frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()

        // freeze acc1
        await wunderTokenV1.connect(governor).freeze(acc1.address)

        // confirm acc1 is frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.true()

        // confirm acc1 has 1000 Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(
          wunderToEth("1000"),
        )

        // mint 100 Wunder to acc1
        await wunderTokenV1
          .connect(minter)
          .mint(acc1.address, wunderToEth("100"))

        // confirm acc1 now has 1100 Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(
          wunderToEth("1100"),
        )
      })

      it("Can send tokens from an unfrozen account to another unfrozen account", async () => {
        const { wunderTokenV1, acc1, acc2 } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // confirm acc1 and acc2 aren't frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()
        expect(await wunderTokenV1.isFrozen(acc2.address)).to.be.false()

        // confirm acc1 and acc2 have the initial balance
        const acc1BalanceBefore = await wunderTokenV1.balanceOf(acc1.address)
        const acc2BalanceBefore = await wunderTokenV1.balanceOf(acc2.address)
        expect(acc1BalanceBefore).to.equal(initialBalance)
        expect(acc2BalanceBefore).to.equal(initialBalance)

        // send tokens from acc1 to acc2
        const amount = wunderToEth("100")
        await wunderTokenV1.connect(acc1).transfer(acc2.address, amount)

        // confirm acc1 and acc2 have the correct balance after the transfer
        const acc1BalanceAfter = await wunderTokenV1.balanceOf(acc1.address)
        const acc2BalanceAfter = await wunderTokenV1.balanceOf(acc2.address)
        expect(acc1BalanceAfter).to.equal(acc1BalanceBefore - amount)
        expect(acc2BalanceAfter).to.equal(acc2BalanceBefore + amount)
      })

      it("Can send tokens from an unfrozen account to a frozen account", async () => {
        const { wunderTokenV1, acc1, acc2, governor } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // confirm acc1 and acc2 aren't frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()
        expect(await wunderTokenV1.isFrozen(acc2.address)).to.be.false()

        // confirm acc1 and acc2 have the initial balance
        const acc1BalanceBefore = await wunderTokenV1.balanceOf(acc1.address)
        const acc2BalanceBefore = await wunderTokenV1.balanceOf(acc2.address)
        expect(acc1BalanceBefore).to.equal(initialBalance)
        expect(acc2BalanceBefore).to.equal(initialBalance)

        // freeze acc2
        await wunderTokenV1.connect(governor).freeze(acc2.address)

        // confirm acc2 is frozen
        expect(await wunderTokenV1.isFrozen(acc2.address)).to.be.true()

        // send tokens from acc1 to acc2
        const amount = wunderToEth("100")
        await wunderTokenV1.connect(acc1).transfer(acc2.address, amount)

        // confirm acc1 and acc2 have the correct balance after the transfer
        const acc1BalanceAfter = await wunderTokenV1.balanceOf(acc1.address)
        const acc2BalanceAfter = await wunderTokenV1.balanceOf(acc2.address)
        expect(acc1BalanceAfter).to.equal(acc1BalanceBefore - amount)
        expect(acc2BalanceAfter).to.equal(acc2BalanceBefore + amount)
      })

      it("Can't send tokens from a frozen account to an unfrozen account", async () => {
        const { wunderTokenV1, acc1, acc2, governor } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // confirm acc1 and acc2 aren't frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()
        expect(await wunderTokenV1.isFrozen(acc2.address)).to.be.false()

        // confirm acc1 and acc2 have the initial balance
        const acc1BalanceBefore = await wunderTokenV1.balanceOf(acc1.address)
        const acc2BalanceBefore = await wunderTokenV1.balanceOf(acc2.address)
        expect(acc1BalanceBefore).to.equal(initialBalance)
        expect(acc2BalanceBefore).to.equal(initialBalance)

        // freeze acc1
        await wunderTokenV1.connect(governor).freeze(acc1.address)

        // confirm acc1 is frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.true()

        // send tokens from acc1 to acc2
        const amount = wunderToEth("100")
        await expect(
          wunderTokenV1.connect(acc1).transfer(acc2.address, amount),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "WunderTokenAccountFrozen",
        )

        // confirm acc1 and acc2 have the correct balance after the transfer
        const acc1BalanceAfter = await wunderTokenV1.balanceOf(acc1.address)
        const acc2BalanceAfter = await wunderTokenV1.balanceOf(acc2.address)
        expect(acc1BalanceAfter).to.equal(acc1BalanceBefore)
        expect(acc2BalanceAfter).to.equal(acc2BalanceBefore)
      })

      it("Can't send tokens from a frozen account to a frozen account", async () => {
        const { wunderTokenV1, acc1, acc2, governor } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // confirm acc1 and acc2 aren't frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()
        expect(await wunderTokenV1.isFrozen(acc2.address)).to.be.false()

        // confirm acc1 and acc2 have the initial balance
        const acc1BalanceBefore = await wunderTokenV1.balanceOf(acc1.address)
        const acc2BalanceBefore = await wunderTokenV1.balanceOf(acc2.address)
        expect(acc1BalanceBefore).to.equal(initialBalance)
        expect(acc2BalanceBefore).to.equal(initialBalance)

        // freeze acc1 and acc2
        await wunderTokenV1.connect(governor).freeze(acc1.address)
        await wunderTokenV1.connect(governor).freeze(acc2.address)

        // confirm acc1 and acc2 are frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.true()
        expect(await wunderTokenV1.isFrozen(acc2.address)).to.be.true()

        // send tokens from acc1 to acc2
        const amount = wunderToEth("100")
        await expect(
          wunderTokenV1.connect(acc1).transfer(acc2.address, amount),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "WunderTokenAccountFrozen",
        )

        // confirm acc1 and acc2 have the correct balance after the transfer
        const acc1BalanceAfter = await wunderTokenV1.balanceOf(acc1.address)
        const acc2BalanceAfter = await wunderTokenV1.balanceOf(acc2.address)
        expect(acc1BalanceAfter).to.equal(acc1BalanceBefore)
        expect(acc2BalanceAfter).to.equal(acc2BalanceBefore)
      })

      it("Shouldn't be able to freeze the wunderToken contract", async () => {
        const { wunderTokenV1, governor } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // seize from wunderToken
        await expect(
          wunderTokenV1.connect(governor).freeze(wunderTokenV1.getAddress()),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "WunderTokenAccountNotAllowed",
        )
      })
    })

    describe("Seizing", () => {
      it("Shouldn't be able to seize from a unfrozen account", async () => {
        const { wunderTokenV1, acc1, governor } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // confirm acc1 isn't frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()

        await expect(
          wunderTokenV1.connect(governor).seize(acc1.address),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "WunderTokenAccountNotFrozen",
        )
      })

      it("Shouldn't be able to seize from a frozen account if not GOVERN_ROLE", async () => {
        const { wunderTokenV1, acc1, acc2, governor } = await loadFixture(
          deployFullWunderTokenV1,
        )

        await wunderTokenV1.connect(governor).freeze(acc1.address)
        // confirm acc1 is frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.true()

        // confirm acc2 doens't have GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            acc2.address,
          ),
        ).to.be.false()

        await expect(
          wunderTokenV1.connect(acc2).seize(acc1.address),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "AccessControlUnauthorizedAccount",
        )
      })

      it("Should be able to seize from a frozen account if GOVERN_ROLE", async () => {
        const { wunderTokenV1, acc1, governor } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // freeze acc1
        await wunderTokenV1.connect(governor).freeze(acc1.address)
        // confirm acc1 is frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.true()

        const balance = await wunderTokenV1.balanceOf(acc1.address)

        // confirm acc1 has initialBalance Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(
          initialBalance,
        )

        // confirm wunderTokenhas no Wunder
        expect(
          await wunderTokenV1.balanceOf(wunderTokenV1.getAddress()),
        ).to.equal(0)

        // seize from acc1
        await wunderTokenV1.connect(governor).seize(acc1.address)

        // confirm acc1 has no Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(0)

        // confirm wunderTokenhas balance Wunder
        expect(
          await wunderTokenV1.balanceOf(wunderTokenV1.getAddress()),
        ).to.equal(balance)
      })

      it("Shouldn't be able to seize from a frozen account if GOVERN_ROLE and acc1 has no Wunder", async () => {
        const { wunderTokenV1, acc1, acc2, governor } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // transfer all Wunder from acc1 to acc2
        await wunderTokenV1.connect(acc1).transfer(acc2.address, initialBalance)

        // confirm acc1 has no Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(0)

        // freeze acc1
        await wunderTokenV1.connect(governor).freeze(acc1.address)
        // confirm acc1 is frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.true()

        // seize from acc1
        await expect(
          wunderTokenV1.connect(governor).seize(acc1.address),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "WunderTokenAccountZeroBalance",
        )
      })
    })

    describe("Withdrawing", () => {
      it("Should be able to withdraw if there are funds available", async () => {
        const { wunderTokenV1, acc1, governor } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // confirm acc1 has initialBalance Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(
          initialBalance,
        )

        // confirm wunderTokenhas no Wunder
        expect(
          await wunderTokenV1.balanceOf(wunderTokenV1.getAddress()),
        ).to.equal(0)

        // confirm wunderTokenhas no Wunder
        expect(
          await wunderTokenV1.balanceOf(wunderTokenV1.getAddress()),
        ).to.equal(0)

        // freeze acc1
        await wunderTokenV1.connect(governor).freeze(acc1.address)

        // seize from acc1
        await wunderTokenV1.connect(governor).seize(acc1.address)

        // confirm wunderTokenhas no Wunder
        expect(
          await wunderTokenV1.balanceOf(wunderTokenV1.getAddress()),
        ).to.equal(initialBalance)

        // confirm governor has no Wunder
        expect(await wunderTokenV1.balanceOf(governor.address)).to.equal(0)

        // withdraw from wunderToken
        await wunderTokenV1.connect(governor).withdraw(initialBalance)

        // confirm wunderTokenhas no Wunder
        expect(
          await wunderTokenV1.balanceOf(wunderTokenV1.getAddress()),
        ).to.equal(0)

        // confirm governor has Wunder
        expect(await wunderTokenV1.balanceOf(governor.address)).to.equal(
          initialBalance,
        )
      })

      it("Shouldn't be able to withdraw if there are no funds available", async () => {
        const { wunderTokenV1, governor } = await loadFixture(
          deployFullWunderTokenV1,
        )

        // confirm wunderTokenhas no Wunder
        expect(
          await wunderTokenV1.balanceOf(wunderTokenV1.getAddress()),
        ).to.equal(0)

        await expect(
          wunderTokenV1.connect(governor).withdraw(initialBalance),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "WunderTokenInsufficientBalance",
        )
      })
    })
  })
})
