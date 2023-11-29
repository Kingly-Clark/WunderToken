import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
import {
  applyBurnerRole,
  applyMinterRole,
  deployWunderTokenV1,
  // eslint-disable-next-line node/no-missing-import
} from "../utils/deployments"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect
describe("V1 ", () => {
  describe("Burn ", () => {
    it("Should be able to `burn` Wunder as BURNER_ROLE", async () => {
      const { wunderTokenV1, owner, burner } =
        await loadFixture(deployWunderTokenV1)

      // confirm burner doens't have BURNER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.BURNER_ROLE(),
          burner.address,
        ),
      ).to.be.false()

      // grant BURNER_ROLE to burner
      await wunderTokenV1
        .connect(owner)
        .grantRole(await wunderTokenV1.BURNER_ROLE(), burner.address)

      // confirm burner has BURNER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.BURNER_ROLE(),
          burner.address,
        ),
      ).to.be.true()

      await wunderTokenV1
        .connect(owner)
        .grantRole(await wunderTokenV1.MINTER_ROLE(), burner.address)

      // mint 100 Wunder to burner
      await wunderTokenV1.connect(burner).mint(burner.address, 100)

      // confirm burner has 100 Wunder
      expect(await wunderTokenV1.balanceOf(burner.address)).to.equal(100)

      // burn 100 Wunder from burner
      await wunderTokenV1.connect(burner).burn(100)

      // confirm burner has 0 Wunder
      expect(await wunderTokenV1.balanceOf(burner.address)).to.equal(0)
    })

    it("Shouldn't be able to `burn` Wunder as not BURNER_ROLE", async () => {
      const { wunderTokenV1, burner } = await loadFixture(deployWunderTokenV1)

      // confirm burner doens't have BURNER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.BURNER_ROLE(),
          burner.address,
        ),
      ).to.be.false()

      // burn 100 Wunder from burner
      await expect(
        wunderTokenV1.connect(burner).burn(100),
      ).to.be.revertedWithCustomError(
        wunderTokenV1,
        "AccessControlUnauthorizedAccount",
      )
    })
  })
  describe("BurnFrom ", () => {
    it("Shouldn't be able to `burnFrom` Wunder if not BURNER_ROLE ", async () => {
      const { wunderTokenV1, owner, burner, minter, acc1 } =
        await loadFixture(deployWunderTokenV1)
      await applyMinterRole(wunderTokenV1, owner, minter)

      // mint 100 Wunder to burner
      await wunderTokenV1.connect(minter).mint(acc1.address, 100)

      // confirm burner has 100 Wunder
      expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(100)

      // grant burner 100 Wunder allowance from acc1
      await wunderTokenV1.connect(acc1).approve(burner.address, 100)

      // burn 100 Wunder from burner
      await expect(
        wunderTokenV1.connect(burner).burnFrom(acc1.address, 100),
      ).to.be.revertedWithCustomError(
        wunderTokenV1,
        "AccessControlUnauthorizedAccount",
      )

      // confirm burner has 0 Wunder
      expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(100)
    })
    it("Should be able to `burnFrom` Wunder as BURNER_ROLE if allowance has been granted", async () => {
      const { wunderTokenV1, owner, burner, minter, acc1 } =
        await loadFixture(deployWunderTokenV1)
      await applyBurnerRole(wunderTokenV1, owner, burner)
      await applyMinterRole(wunderTokenV1, owner, minter)

      // mint 100 Wunder to burner
      await wunderTokenV1.connect(minter).mint(acc1.address, 100)

      // confirm burner has 100 Wunder
      expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(100)

      // grant burner 100 Wunder allowance from acc1
      await wunderTokenV1.connect(acc1).approve(burner.address, 100)

      // burn 100 Wunder from burner
      await wunderTokenV1.connect(burner).burnFrom(acc1.address, 100)

      // confirm burner has 0 Wunder
      expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(0)
    })
    it("Shouldn't be able to `burnFrom` Wunder as BURNER_ROLE if allowance has not been granted", async () => {
      const { wunderTokenV1, owner, burner, minter, acc1 } =
        await loadFixture(deployWunderTokenV1)
      await applyBurnerRole(wunderTokenV1, owner, burner)
      await applyMinterRole(wunderTokenV1, owner, minter)

      // mint 100 Wunder to burner
      await wunderTokenV1.connect(minter).mint(acc1.address, 100)

      // confirm burner has 100 Wunder
      expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(100)

      // burn 100 Wunder from burner
      await expect(
        wunderTokenV1.connect(burner).burnFrom(acc1.address, 100),
      ).to.be.revertedWithCustomError(
        wunderTokenV1,
        "ERC20InsufficientAllowance",
      )

      // confirm burner has 0 Wunder
      expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(100)
    })
  })
})
