import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
import {
  applyBurnerRole,
  applyMinterRole,
  deployWunderTokenV3,
  // eslint-disable-next-line node/no-missing-import
} from "../utils/deployments"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect
describe("V3 ", () => {
  describe("Burn ", () => {
    it("Should be able to `burn` Wunder as BURNER_ROLE", async () => {
      const { wunderTokenV3, owner, burner } =
        await loadFixture(deployWunderTokenV3)

      // confirm burner doens't have BURNER_ROLE
      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.BURNER_ROLE(),
          burner.address,
        ),
      ).to.be.false()

      // grant BURNER_ROLE to burner
      await wunderTokenV3
        .connect(owner)
        .grantRole(await wunderTokenV3.BURNER_ROLE(), burner.address)

      // confirm burner has BURNER_ROLE
      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.BURNER_ROLE(),
          burner.address,
        ),
      ).to.be.true()

      await wunderTokenV3
        .connect(owner)
        .grantRole(await wunderTokenV3.MINTER_ROLE(), burner.address)

      // mint 100 Wunder to burner
      await wunderTokenV3.connect(burner).mint(burner.address, 100)

      // confirm burner has 100 Wunder
      expect(await wunderTokenV3.balanceOf(burner.address)).to.equal(100)

      // burn 100 Wunder from burner
      await wunderTokenV3.connect(burner).burn(100)

      // confirm burner has 0 Wunder
      expect(await wunderTokenV3.balanceOf(burner.address)).to.equal(0)
    })

    it("Shouldn't be able to `burn` Wunder as not BURNER_ROLE", async () => {
      const { wunderTokenV3, burner } = await loadFixture(deployWunderTokenV3)

      // confirm burner doens't have BURNER_ROLE
      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.BURNER_ROLE(),
          burner.address,
        ),
      ).to.be.false()

      // burn 100 Wunder from burner
      await expect(
        wunderTokenV3.connect(burner).burn(100),
      ).to.be.revertedWithCustomError(
        wunderTokenV3,
        "AccessControlUnauthorizedAccount",
      )
    })
  })
  describe("BurnFrom ", () => {
    it("Shouldn't be able to `burnFrom` Wunder if not BURNER_ROLE ", async () => {
      const { wunderTokenV3, owner, burner, minter, acc1 } =
        await loadFixture(deployWunderTokenV3)
      await applyMinterRole(wunderTokenV3, owner, minter)

      // mint 100 Wunder to burner
      await wunderTokenV3.connect(minter).mint(acc1.address, 100)

      // confirm burner has 100 Wunder
      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(100)

      // grant burner 100 Wunder allowance from acc1
      await wunderTokenV3.connect(acc1).approve(burner.address, 100)

      // burn 100 Wunder from burner
      await expect(
        wunderTokenV3.connect(burner).burnFrom(acc1.address, 100),
      ).to.be.revertedWithCustomError(
        wunderTokenV3,
        "AccessControlUnauthorizedAccount",
      )

      // confirm burner has 0 Wunder
      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(100)
    })
    it("Should be able to `burnFrom` Wunder as BURNER_ROLE if allowance has been granted", async () => {
      const { wunderTokenV3, owner, burner, minter, acc1 } =
        await loadFixture(deployWunderTokenV3)
      await applyBurnerRole(wunderTokenV3, owner, burner)
      await applyMinterRole(wunderTokenV3, owner, minter)

      // mint 100 Wunder to burner
      await wunderTokenV3.connect(minter).mint(acc1.address, 100)

      // confirm burner has 100 Wunder
      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(100)

      // grant burner 100 Wunder allowance from acc1
      await wunderTokenV3.connect(acc1).approve(burner.address, 100)

      // burn 100 Wunder from burner
      await wunderTokenV3.connect(burner).burnFrom(acc1.address, 100)

      // confirm burner has 0 Wunder
      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(0)
    })
    it("Shouldn't be able to `burnFrom` Wunder as BURNER_ROLE if allowance has not been granted", async () => {
      const { wunderTokenV3, owner, burner, minter, acc1 } =
        await loadFixture(deployWunderTokenV3)
      await applyBurnerRole(wunderTokenV3, owner, burner)
      await applyMinterRole(wunderTokenV3, owner, minter)

      // mint 100 Wunder to burner
      await wunderTokenV3.connect(minter).mint(acc1.address, 100)

      // confirm burner has 100 Wunder
      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(100)

      // burn 100 Wunder from burner
      await expect(
        wunderTokenV3.connect(burner).burnFrom(acc1.address, 100),
      ).to.be.revertedWithCustomError(
        wunderTokenV3,
        "ERC20InsufficientAllowance",
      )

      // confirm burner has 0 Wunder
      expect(await wunderTokenV3.balanceOf(acc1.address)).to.equal(100)
    })
  })
})
