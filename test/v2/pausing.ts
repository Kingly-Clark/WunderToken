import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import {
  applyBurnerRole,
  applyGovernRole,
  applyMinterRole,
  applyPauserRole,
  deployWunderTokenV2,
  // eslint-disable-next-line node/no-missing-import
} from "../utils/deployments"
// eslint-disable-next-line node/no-missing-import
import { wunderToEth } from "../utils/conversions"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect
// des
describe("V2", () => {
  describe("Pausing", () => {
    describe("When Paused", () => {
      it("Should not be able to batchMint when paused", async () => {
        const { wunderTokenV2, owner, minter, pauser } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyPauserRole(wunderTokenV2, owner, pauser)

        await wunderTokenV2.connect(pauser).pause()

        await expect(
          wunderTokenV2
            .connect(minter)
            .batchMint(
              [minter.address, minter.address, minter.address],
              [wunderToEth("100"), wunderToEth("100"), wunderToEth("100")],
            ),
        ).to.be.revertedWithCustomError(wunderTokenV2, "EnforcedPause")
      })
      it("Should not be able to batchTransfer when paused", async () => {
        const { wunderTokenV2, owner, minter, pauser, acc1, acc2 } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyPauserRole(wunderTokenV2, owner, pauser)

        await wunderTokenV2
          .connect(minter)
          .batchMint([acc1.address], [wunderToEth("300")])

        await wunderTokenV2.connect(pauser).pause()

        await expect(
          wunderTokenV2
            .connect(acc1)
            .batchTransfer(
              [acc2.address, acc2.address, acc2.address],
              [wunderToEth("100"), wunderToEth("100"), wunderToEth("100")],
            ),
        ).to.be.revertedWithCustomError(wunderTokenV2, "EnforcedPause")
      })

      it("Should not be able to burn when paused", async () => {
        const { wunderTokenV2, owner, minter, burner, pauser, acc1 } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyPauserRole(wunderTokenV2, owner, pauser)
        await applyBurnerRole(wunderTokenV2, owner, burner)

        await wunderTokenV2
          .connect(minter)
          .batchMint([acc1.address], [wunderToEth("300")])

        await wunderTokenV2.connect(pauser).pause()

        await expect(
          wunderTokenV2.connect(burner).burn(wunderToEth("100")),
        ).to.be.revertedWithCustomError(wunderTokenV2, "EnforcedPause")
      })

      it("Should not be able to burnFrom when paused", async () => {
        const { wunderTokenV2, owner, minter, burner, pauser, acc1 } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyPauserRole(wunderTokenV2, owner, pauser)
        await applyBurnerRole(wunderTokenV2, owner, burner)

        await wunderTokenV2
          .connect(minter)
          .batchMint([acc1.address], [wunderToEth("300")])

        await wunderTokenV2
          .connect(acc1)
          .approve(burner.address, wunderToEth("100"))

        await wunderTokenV2.connect(pauser).pause()

        await expect(
          wunderTokenV2
            .connect(burner)
            .burnFrom(acc1.address, wunderToEth("100")),
        ).to.be.revertedWithCustomError(wunderTokenV2, "EnforcedPause")
      })
      it("Should not be able to mint when paused", async () => {
        const { wunderTokenV2, owner, minter, pauser } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyPauserRole(wunderTokenV2, owner, pauser)

        await wunderTokenV2.connect(pauser).pause()

        await expect(
          wunderTokenV2
            .connect(minter)
            .mint(minter.address, wunderToEth("100")),
        ).to.be.revertedWithCustomError(wunderTokenV2, "EnforcedPause")
      })

      it("Should not be able to seize when paused", async () => {
        const { wunderTokenV2, owner, minter, pauser, governor, acc1 } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyPauserRole(wunderTokenV2, owner, pauser)
        await applyGovernRole(wunderTokenV2, owner, governor)

        await wunderTokenV2
          .connect(minter)
          .batchMint([acc1.address], [wunderToEth("300")])

        await wunderTokenV2.connect(governor).freeze(acc1.address)

        await wunderTokenV2.connect(pauser).pause()

        await expect(
          wunderTokenV2.connect(governor).seize(acc1.address),
        ).to.be.revertedWithCustomError(wunderTokenV2, "EnforcedPause")
      })
      it("Should not be able to transfer when paused", async () => {
        const { wunderTokenV2, owner, minter, pauser, acc1, acc2 } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyPauserRole(wunderTokenV2, owner, pauser)

        await wunderTokenV2
          .connect(minter)
          .batchMint([acc1.address], [wunderToEth("300")])

        await wunderTokenV2.connect(pauser).pause()

        await expect(
          wunderTokenV2
            .connect(acc1)
            .transfer(acc2.address, wunderToEth("100")),
        ).to.be.revertedWithCustomError(wunderTokenV2, "EnforcedPause")
      })

      it("Should not be able to transferFrom when paused", async () => {
        const { wunderTokenV2, owner, minter, pauser, acc1, acc2 } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyPauserRole(wunderTokenV2, owner, pauser)

        await wunderTokenV2
          .connect(minter)
          .batchMint([acc1.address], [wunderToEth("300")])

        await wunderTokenV2
          .connect(acc1)
          .approve(acc2.address, wunderToEth("100"))

        await wunderTokenV2.connect(pauser).pause()

        await expect(
          wunderTokenV2
            .connect(acc2)
            .transferFrom(acc1.address, acc2.address, wunderToEth("100")),
        ).to.be.revertedWithCustomError(wunderTokenV2, "EnforcedPause")
      })

      it("Should not be able to withdraw when paused", async () => {
        const { wunderTokenV2, owner, minter, pauser, governor, acc1 } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyPauserRole(wunderTokenV2, owner, pauser)
        await applyGovernRole(wunderTokenV2, owner, governor)

        await wunderTokenV2
          .connect(minter)
          .batchMint([acc1.address], [wunderToEth("300")])

        await wunderTokenV2.connect(governor).freeze(acc1.address)

        await wunderTokenV2.connect(governor).seize(acc1.address)
        await wunderTokenV2.connect(pauser).pause()

        await expect(
          wunderTokenV2.connect(governor).withdraw(wunderToEth("300")),
        ).to.be.revertedWithCustomError(wunderTokenV2, "EnforcedPause")
      })

      it("Should be able to unpause when paused", async () => {
        const { wunderTokenV2, owner, pauser } =
          await loadFixture(deployWunderTokenV2)

        await applyPauserRole(wunderTokenV2, owner, pauser)

        // confirm wunderTokenV2 is unpaused
        expect(await wunderTokenV2.paused()).to.be.false()
        await wunderTokenV2.connect(pauser).pause()
        // confirm wunderTokenV2 is paused
        expect(await wunderTokenV2.paused()).to.be.true()
        await wunderTokenV2.connect(pauser).unpause()
        // confirm wunderTokenV2 is unpaused
        expect(await wunderTokenV2.paused()).to.be.false()
      })
    })

    describe("When Unpaused", () => {
      it("Should be able to approve when paused", async () => {
        const { wunderTokenV2, owner, minter, pauser, acc1, acc2 } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyPauserRole(wunderTokenV2, owner, pauser)

        await wunderTokenV2.connect(pauser).pause()

        await wunderTokenV2
          .connect(acc1)
          .approve(acc2.address, wunderToEth("100"))

        expect(await wunderTokenV2.allowance(acc1.address, acc2.address)).to.eq(
          wunderToEth("100"),
        )
      })

      it("Should be able to freeze when paused", async () => {
        const { wunderTokenV2, owner, minter, pauser, governor, acc1 } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyGovernRole(wunderTokenV2, owner, governor)
        await applyPauserRole(wunderTokenV2, owner, pauser)

        await wunderTokenV2
          .connect(minter)
          .batchMint([acc1.address], [wunderToEth("300")])

        await wunderTokenV2.connect(pauser).pause()

        expect(await wunderTokenV2.isFrozen(acc1.address)).to.be.false()
        await wunderTokenV2.connect(governor).freeze(acc1.address)

        expect(await wunderTokenV2.isFrozen(acc1.address)).to.be.true()
      })

      it("Should be able to grantRole when paused", async () => {
        const { wunderTokenV2, owner, pauser, acc1 } =
          await loadFixture(deployWunderTokenV2)

        await applyPauserRole(wunderTokenV2, owner, pauser)

        await wunderTokenV2.connect(pauser).pause()

        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.GOVERN_ROLE(),
            acc1.address,
          ),
        ).to.be.false()

        await wunderTokenV2
          .connect(owner)
          .grantRole(await wunderTokenV2.GOVERN_ROLE(), acc1.address)

        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.GOVERN_ROLE(),
            acc1.address,
          ),
        ).to.be.true()
      })
      it("Should be able to renounceRole when paused", async () => {
        const { wunderTokenV2, owner, pauser, minter } =
          await loadFixture(deployWunderTokenV2)

        await applyPauserRole(wunderTokenV2, owner, pauser)
        await applyMinterRole(wunderTokenV2, owner, minter)
        await wunderTokenV2.connect(pauser).pause()

        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.MINTER_ROLE(),
            minter.address,
          ),
        ).to.be.true()

        await wunderTokenV2
          .connect(minter)
          .renounceRole(await wunderTokenV2.MINTER_ROLE(), minter.address)

        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.MINTER_ROLE(),
            minter.address,
          ),
        ).to.be.false()
      })
      it("Should be able to revokeRole when paused", async () => {
        const { wunderTokenV2, owner, pauser, minter } =
          await loadFixture(deployWunderTokenV2)

        await applyPauserRole(wunderTokenV2, owner, pauser)
        await applyMinterRole(wunderTokenV2, owner, minter)
        await wunderTokenV2.connect(pauser).pause()

        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.MINTER_ROLE(),
            minter.address,
          ),
        ).to.be.true()

        await wunderTokenV2
          .connect(owner)
          .revokeRole(await wunderTokenV2.MINTER_ROLE(), minter.address)

        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.MINTER_ROLE(),
            minter.address,
          ),
        ).to.be.false()
      })
      it("Should be able to pause when unpaused", async () => {
        const { wunderTokenV2, owner, pauser } =
          await loadFixture(deployWunderTokenV2)

        await applyPauserRole(wunderTokenV2, owner, pauser)

        // confirm wunderTokenV2 is unpaused
        expect(await wunderTokenV2.paused()).to.be.false()
        await wunderTokenV2.connect(pauser).pause()
        // confirm wunderTokenV2 is paused
        expect(await wunderTokenV2.paused()).to.be.true()
      })
      it("Should be able to unfreeze when paused", async () => {
        const { wunderTokenV2, owner, minter, pauser, governor, acc1 } =
          await loadFixture(deployWunderTokenV2)

        await applyMinterRole(wunderTokenV2, owner, minter)
        await applyGovernRole(wunderTokenV2, owner, governor)
        await applyPauserRole(wunderTokenV2, owner, pauser)

        await wunderTokenV2
          .connect(minter)
          .batchMint([acc1.address], [wunderToEth("300")])

        await wunderTokenV2.connect(governor).freeze(acc1.address)
        await wunderTokenV2.connect(pauser).pause()

        expect(await wunderTokenV2.isFrozen(acc1.address)).to.be.true()

        await wunderTokenV2.connect(governor).unfreeze(acc1.address)

        expect(await wunderTokenV2.isFrozen(acc1.address)).to.be.false()
      })
    })
  })
})
