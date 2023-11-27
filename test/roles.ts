import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import "@nomicfoundation/hardhat-chai-matchers"
import { deployWunderTokenV1 } from "./utils/deployments"
import * as chai from "chai"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect
describe("Roles", () => {
  describe("Granting", () => {
    it("Should be able to grant MINTER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
      // confirm owner has DEFAULT_ADMIN_ROLE
      const { wunderTokenV1, owner, notOwner } =
        await loadFixture(deployWunderTokenV1)
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.DEFAULT_ADMIN_ROLE(),
          owner.address,
        ),
      ).to.be.true()

      // confirm notOwner doens't have MINTER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.MINTER_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()

      // grant MINTER_ROLE to notOwner
      await wunderTokenV1.grantRole(
        await wunderTokenV1.MINTER_ROLE(),
        notOwner.address,
      )

      // confirm notOwner has MINTER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.MINTER_ROLE(),
          notOwner.address,
        ),
      ).to.be.true()
    })

    it("Should be able to grant BURNER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
      // confirm owner has DEFAULT_ADMIN_ROLE
      const { wunderTokenV1, owner, notOwner } =
        await loadFixture(deployWunderTokenV1)
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.DEFAULT_ADMIN_ROLE(),
          owner.address,
        ),
      ).to.be.true()

      // confirm notOwner doens't have BURNER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.BURNER_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()

      // grant BURNER_ROLE to notOwner
      await wunderTokenV1.grantRole(
        await wunderTokenV1.BURNER_ROLE(),
        notOwner.address,
      )

      // confirm notOwner has BURNER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.BURNER_ROLE(),
          notOwner.address,
        ),
      ).to.be.true()
    })

    it("Should be able to grant GOVERN_ROLE as DEFAULT_ADMIN_ROLE", async () => {
      // confirm owner has DEFAULT_ADMIN_ROLE
      const { wunderTokenV1, owner, notOwner } =
        await loadFixture(deployWunderTokenV1)
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.DEFAULT_ADMIN_ROLE(),
          owner.address,
        ),
      ).to.be.true()

      // confirm notOwner doens't have GOVERN_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.GOVERN_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()

      // grant GOVERN_ROLE to notOwner
      await wunderTokenV1.grantRole(
        await wunderTokenV1.GOVERN_ROLE(),
        notOwner.address,
      )

      // confirm notOwner has GOVERN_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.GOVERN_ROLE(),
          notOwner.address,
        ),
      ).to.be.true()
    })

    it("Should be able to grant PAUSER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
      // confirm owner has DEFAULT_ADMIN_ROLE
      const { wunderTokenV1, owner, notOwner } =
        await loadFixture(deployWunderTokenV1)
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.DEFAULT_ADMIN_ROLE(),
          owner.address,
        ),
      ).to.be.true()

      // confirm notOwner doens't have PAUSER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.PAUSER_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()

      // grant PAUSER_ROLE to notOwner
      await wunderTokenV1.grantRole(
        await wunderTokenV1.PAUSER_ROLE(),
        notOwner.address,
      )

      // confirm notOwner has PAUSER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.PAUSER_ROLE(),
          notOwner.address,
        ),
      ).to.be.true()
    })
  })

  describe("Revoking", () => {
    it("Should be able to revoke MINTER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
      // confirm owner has DEFAULT_ADMIN_ROLE
      const { wunderTokenV1, owner, notOwner } =
        await loadFixture(deployWunderTokenV1)
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.DEFAULT_ADMIN_ROLE(),
          owner.address,
        ),
      ).to.be.true()

      // confirm notOwner doens't have MINTER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.MINTER_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()

      // grant MINTER_ROLE to notOwner
      await wunderTokenV1.grantRole(
        await wunderTokenV1.MINTER_ROLE(),
        notOwner.address,
      )

      // confirm notOwner has MINTER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.MINTER_ROLE(),
          notOwner.address,
        ),
      ).to.be.true()

      // revoke MINTER_ROLE from notOwner
      await wunderTokenV1.revokeRole(
        await wunderTokenV1.MINTER_ROLE(),
        notOwner.address,
      )

      // confirm notOwner doesn't have MINTER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.MINTER_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()
    })

    it("Should be able to revoke BURNER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
      // confirm owner has DEFAULT_ADMIN_ROLE
      const { wunderTokenV1, owner, notOwner } =
        await loadFixture(deployWunderTokenV1)
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.DEFAULT_ADMIN_ROLE(),
          owner.address,
        ),
      ).to.be.true()

      // confirm notOwner doens't have BURNER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.BURNER_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()

      // grant BURNER_ROLE to notOwner
      await wunderTokenV1.grantRole(
        await wunderTokenV1.BURNER_ROLE(),
        notOwner.address,
      )

      // confirm notOwner has BURNER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.BURNER_ROLE(),
          notOwner.address,
        ),
      ).to.be.true()

      // revoke BURNER_ROLE from notOwner
      await wunderTokenV1.revokeRole(
        await wunderTokenV1.BURNER_ROLE(),
        notOwner.address,
      )

      // confirm notOwner doesn't have BURNER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.BURNER_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()
    })

    it("Should be able to revoke GOVERN_ROLE as DEFAULT_ADMIN_ROLE", async () => {
      // confirm owner has DEFAULT_ADMIN_ROLE
      const { wunderTokenV1, owner, notOwner } =
        await loadFixture(deployWunderTokenV1)
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.DEFAULT_ADMIN_ROLE(),
          owner.address,
        ),
      ).to.be.true()

      // confirm notOwner doens't have GOVERN_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.GOVERN_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()

      // grant GOVERN_ROLE to notOwner
      await wunderTokenV1.grantRole(
        await wunderTokenV1.GOVERN_ROLE(),
        notOwner.address,
      )

      // confirm notOwner has GOVERN_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.GOVERN_ROLE(),
          notOwner.address,
        ),
      ).to.be.true()

      // revoke GOVERN_ROLE from notOwner
      await wunderTokenV1.revokeRole(
        await wunderTokenV1.GOVERN_ROLE(),
        notOwner.address,
      )

      // confirm notOwner doesn't have GOVERN_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.GOVERN_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()
    })

    it("Should be able to revoke PAUSER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
      // confirm owner has DEFAULT_ADMIN_ROLE
      const { wunderTokenV1, owner, notOwner } =
        await loadFixture(deployWunderTokenV1)
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.DEFAULT_ADMIN_ROLE(),
          owner.address,
        ),
      ).to.be.true()

      // confirm notOwner doens't have PAUSER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.PAUSER_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()

      // grant PAUSER_ROLE to notOwner
      await wunderTokenV1.grantRole(
        await wunderTokenV1.PAUSER_ROLE(),
        notOwner.address,
      )

      // confirm notOwner has PAUSER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.PAUSER_ROLE(),
          notOwner.address,
        ),
      ).to.be.true()

      // revoke PAUSER_ROLE from notOwner
      await wunderTokenV1.revokeRole(
        await wunderTokenV1.PAUSER_ROLE(),
        notOwner.address,
      )

      // confirm notOwner doesn't have PAUSER_ROLE
      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.PAUSER_ROLE(),
          notOwner.address,
        ),
      ).to.be.false()
    })
  })

  describe("Methods", () => {
    describe("MINTER_ROLE", () => {
      it("Should be able to `mint` Wunder as MINTER_ROLE", async () => {
        const { wunderTokenV1, owner, minter } =
          await loadFixture(deployWunderTokenV1)
        // confirm minter doens't have MINTER_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.MINTER_ROLE(),
            minter.address,
          ),
        ).to.be.false()

        // grant MINTER_ROLE to minter
        await wunderTokenV1
          .connect(owner)
          .grantRole(await wunderTokenV1.MINTER_ROLE(), minter.address)

        // confirm minter has MINTER_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.MINTER_ROLE(),
            minter.address,
          ),
        ).to.be.true()

        // mint 100 Wunder to minter
        await wunderTokenV1.connect(minter).mint(minter.address, 100)

        // confirm minter has 100 Wunder
        expect(await wunderTokenV1.balanceOf(minter.address)).to.equal(100)
      })

      it("Shouldn't be able to `mint` Wunder as not MINTER_ROLE", async () => {
        const { wunderTokenV1, minter } = await loadFixture(deployWunderTokenV1)
        // confirm minter doens't have MINTER_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.MINTER_ROLE(),
            minter.address,
          ),
        ).to.be.false()

        // mint 100 Wunder to minter
        await expect(
          wunderTokenV1.connect(minter).mint(minter.address, 100),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "AccessControlUnauthorizedAccount",
        )
      })
    })

    describe("BURNER_ROLE", () => {
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

    describe("GOVERN_ROLE", () => {
      // function freeze(address account)
      it("Should be able to `freeze` an account as GOVERN_ROLE", async () => {
        const { wunderTokenV1, owner, governor, acc1 } =
          await loadFixture(deployWunderTokenV1)
        // confirm governor doens't have GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.false()

        // grant GOVERN_ROLE to governor
        await wunderTokenV1
          .connect(owner)
          .grantRole(await wunderTokenV1.GOVERN_ROLE(), governor.address)

        // confirm governor has GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.true()

        // confirm acc1 is not frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()

        // freeze acc1
        await wunderTokenV1.connect(governor).freeze(acc1.address)

        // confirm acc1 is frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.true()
      })

      it("Shouldn't be able to `freeze` an account as not GOVERN_ROLE", async () => {
        const { wunderTokenV1, governor, acc1 } =
          await loadFixture(deployWunderTokenV1)
        // confirm governor doens't have GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.false()

        // freeze acc1
        await expect(
          wunderTokenV1.connect(governor).freeze(acc1.address),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "AccessControlUnauthorizedAccount",
        )
      })

      // function unfreeze(address account)
      it("Should be able to `unfreeze` an account as GOVERN_ROLE", async () => {
        const { wunderTokenV1, owner, governor, acc1 } =
          await loadFixture(deployWunderTokenV1)
        // confirm governor doens't have GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.false()

        // grant GOVERN_ROLE to governor
        await wunderTokenV1
          .connect(owner)
          .grantRole(await wunderTokenV1.GOVERN_ROLE(), governor.address)

        // confirm governor has GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.true()

        // confirm acc1 is not frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()

        // freeze acc1
        await wunderTokenV1.connect(governor).freeze(acc1.address)

        // confirm acc1 is frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.true()

        // unfreeze acc1
        await wunderTokenV1.connect(governor).unfreeze(acc1.address)

        // confirm acc1 is not frozen
        expect(await wunderTokenV1.isFrozen(acc1.address)).to.be.false()
      })

      it("Shouldn't be able to `unfreeze` an account as not GOVERN_ROLE", async () => {
        const { wunderTokenV1, governor, acc1 } =
          await loadFixture(deployWunderTokenV1)
        // confirm governor doens't have GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.false()

        // unfreeze acc1
        await expect(
          wunderTokenV1.connect(governor).unfreeze(acc1.address),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "AccessControlUnauthorizedAccount",
        )
      })

      // function seize(address account)
      it("Should be able to `seize` an account as GOVERN_ROLE", async () => {
        const { wunderTokenV1, owner, governor, minter, acc1 } =
          await loadFixture(deployWunderTokenV1)
        // confirm governor doens't have GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.false()
        // grant GOVERN_ROLE to governor
        await wunderTokenV1
          .connect(owner)
          .grantRole(await wunderTokenV1.GOVERN_ROLE(), governor.address)
        // confirm governor has GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.true()

        // grant MINTER_ROLE to minter
        await wunderTokenV1
          .connect(owner)
          .grantRole(await wunderTokenV1.MINTER_ROLE(), minter.address)

        // mint 100 Wunder to acc1
        await wunderTokenV1.connect(minter).mint(acc1.address, 100)

        // confirm acc1 has 100 Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(100)

        // confirm wunderTokenV1 contract has 0 Wunder
        expect(
          await wunderTokenV1.balanceOf(await wunderTokenV1.getAddress()),
        ).to.equal(0)

        // freeze acc1 (acc1 is not frozen)
        await wunderTokenV1.connect(governor).freeze(acc1.address)

        // seize acc1
        await wunderTokenV1.connect(governor).seize(acc1.address)

        // // confirm acc1 has 0 Wunder
        // expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(0);

        // // confirm wunderTokenV1 contract has 100 Wunder
        // expect(await wunderTokenV1.balanceOf(await wunderTokenV1.getAddress())).to.equal(100);
      })

      it("Shouldn't be able to `seize` an account as not GOVERN_ROLE", async () => {
        const { wunderTokenV1, governor, acc1 } =
          await loadFixture(deployWunderTokenV1)
        // confirm governor doens't have GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.false()

        // seize acc1
        await expect(
          wunderTokenV1.connect(governor).seize(acc1.address),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "AccessControlUnauthorizedAccount",
        )
      })

      // function withdraw(uint256 amount)
      it("Should be able to `withdraw` Wunder as GOVERN_ROLE", async () => {
        const { wunderTokenV1, owner, governor, minter, acc1 } =
          await loadFixture(deployWunderTokenV1)
        // confirm governor doens't have GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.false()
        // grant GOVERN_ROLE to governor
        await wunderTokenV1
          .connect(owner)
          .grantRole(await wunderTokenV1.GOVERN_ROLE(), governor.address)
        // confirm governor has GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.true()

        // grant MINTER_ROLE to minter
        await wunderTokenV1
          .connect(owner)
          .grantRole(await wunderTokenV1.MINTER_ROLE(), minter.address)

        // mint 100 Wunder to acc1
        await wunderTokenV1.connect(minter).mint(acc1.address, 100)

        // confirm acc1 has 100 Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(100)

        // confirm wunderTokenV1 contract has 0 Wunder
        expect(
          await wunderTokenV1.balanceOf(await wunderTokenV1.getAddress()),
        ).to.equal(0)

        // freeze acc1 (acc1 is not frozen)
        await wunderTokenV1.connect(governor).freeze(acc1.address)

        // seize acc1
        await wunderTokenV1.connect(governor).seize(acc1.address)

        // confirm acc1 has 0 Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(0)

        // confirm wunderTokenV1 contract has 100 Wunder
        expect(
          await wunderTokenV1.balanceOf(await wunderTokenV1.getAddress()),
        ).to.equal(100)

        // withdraw 100 Wunder
        await wunderTokenV1.connect(governor).withdraw(100)

        // confirm acc1 has 0 Wunder
        expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(0)

        // confirm wunderTokenV1 contract has 0 Wunder
        expect(
          await wunderTokenV1.balanceOf(await wunderTokenV1.getAddress()),
        ).to.equal(0)

        // confirm governor has 100 Wunder
        expect(await wunderTokenV1.balanceOf(governor.address)).to.equal(100)
      })

      it("Shouldn't be able to `withdraw` Wunder as not GOVERN_ROLE", async () => {
        const { wunderTokenV1, governor } =
          await loadFixture(deployWunderTokenV1)
        // confirm governor doens't have GOVERN_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.GOVERN_ROLE(),
            governor.address,
          ),
        ).to.be.false()

        // withdraw 100 Wunder
        await expect(
          wunderTokenV1.connect(governor).withdraw(100),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "AccessControlUnauthorizedAccount",
        )
      })
    })

    describe("PAUSER_ROLE", () => {
      // function pause() public onlyRole(PAUSER_ROLE)
      it("Should be able to `pause` as PAUSER_ROLE", async () => {
        const { wunderTokenV1, owner, pauser } =
          await loadFixture(deployWunderTokenV1)
        // confirm pauser doens't have PAUSER_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.PAUSER_ROLE(),
            pauser.address,
          ),
        ).to.be.false()

        // grant PAUSER_ROLE to pauser
        await wunderTokenV1
          .connect(owner)
          .grantRole(await wunderTokenV1.PAUSER_ROLE(), pauser.address)

        // confirm pauser has PAUSER_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.PAUSER_ROLE(),
            pauser.address,
          ),
        ).to.be.true()

        // confirm wunderTokenV1 is not paused
        expect(await wunderTokenV1.paused()).to.be.false()

        // pause wunderTokenV1
        await wunderTokenV1.connect(pauser).pause()

        // confirm wunderTokenV1 is paused
        expect(await wunderTokenV1.paused()).to.be.true()
      })

      it("Shouldn't be able to `pause` as not PAUSER_ROLE", async () => {
        const { wunderTokenV1, pauser } = await loadFixture(deployWunderTokenV1)
        // confirm pauser doens't have PAUSER_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.PAUSER_ROLE(),
            pauser.address,
          ),
        ).to.be.false()

        // confirm wunderTokenV1 is not paused
        expect(await wunderTokenV1.paused()).to.be.false()

        // pause wunderTokenV1
        await expect(
          wunderTokenV1.connect(pauser).pause(),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "AccessControlUnauthorizedAccount",
        )
      })

      // function unpause() public onlyRole(PAUSER_ROLE)
      it("Should be able to `unpause` as PAUSER_ROLE", async () => {
        const { wunderTokenV1, owner, pauser } =
          await loadFixture(deployWunderTokenV1)
        // confirm pauser doens't have PAUSER_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.PAUSER_ROLE(),
            pauser.address,
          ),
        ).to.be.false()

        // grant PAUSER_ROLE to pauser
        await wunderTokenV1
          .connect(owner)
          .grantRole(await wunderTokenV1.PAUSER_ROLE(), pauser.address)

        // confirm pauser has PAUSER_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.PAUSER_ROLE(),
            pauser.address,
          ),
        ).to.be.true()

        // confirm wunderTokenV1 is not paused
        expect(await wunderTokenV1.paused()).to.be.false()

        // pause wunderTokenV1
        await wunderTokenV1.connect(pauser).pause()

        // confirm wunderTokenV1 is paused
        expect(await wunderTokenV1.paused()).to.be.true()

        // unpause wunderTokenV1
        await wunderTokenV1.connect(pauser).unpause()

        // confirm wunderTokenV1 is not paused
        expect(await wunderTokenV1.paused()).to.be.false()
      })

      it("Shouldn't be able to `unpause` as not PAUSER_ROLE", async () => {
        const { wunderTokenV1, pauser } = await loadFixture(deployWunderTokenV1)
        // confirm pauser doens't have PAUSER_ROLE
        expect(
          await wunderTokenV1.hasRole(
            await wunderTokenV1.PAUSER_ROLE(),
            pauser.address,
          ),
        ).to.be.false()

        // confirm wunderTokenV1 is not paused
        expect(await wunderTokenV1.paused()).to.be.false()

        // unpause wunderTokenV1
        await expect(
          wunderTokenV1.connect(pauser).unpause(),
        ).to.be.revertedWithCustomError(
          wunderTokenV1,
          "AccessControlUnauthorizedAccount",
        )
      })
    })
  })
})
