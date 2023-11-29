import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import { deployWunderTokenV2 } from "../utils/deployments"
import * as chai from "chai"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect
describe("V2", () => {
  describe("Roles", () => {
    describe("Granting", () => {
      it("Should be able to grant MINTER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
        // confirm owner has DEFAULT_ADMIN_ROLE
        const { wunderTokenV2, owner, notOwner } =
          await loadFixture(deployWunderTokenV2)
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.DEFAULT_ADMIN_ROLE(),
            owner.address,
          ),
        ).to.be.true()

        // confirm notOwner doens't have MINTER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.MINTER_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()

        // grant MINTER_ROLE to notOwner
        await wunderTokenV2.grantRole(
          await wunderTokenV2.MINTER_ROLE(),
          notOwner.address,
        )

        // confirm notOwner has MINTER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.MINTER_ROLE(),
            notOwner.address,
          ),
        ).to.be.true()
      })

      it("Should be able to grant BURNER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
        // confirm owner has DEFAULT_ADMIN_ROLE
        const { wunderTokenV2, owner, notOwner } =
          await loadFixture(deployWunderTokenV2)
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.DEFAULT_ADMIN_ROLE(),
            owner.address,
          ),
        ).to.be.true()

        // confirm notOwner doens't have BURNER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.BURNER_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()

        // grant BURNER_ROLE to notOwner
        await wunderTokenV2.grantRole(
          await wunderTokenV2.BURNER_ROLE(),
          notOwner.address,
        )

        // confirm notOwner has BURNER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.BURNER_ROLE(),
            notOwner.address,
          ),
        ).to.be.true()
      })

      it("Should be able to grant GOVERN_ROLE as DEFAULT_ADMIN_ROLE", async () => {
        // confirm owner has DEFAULT_ADMIN_ROLE
        const { wunderTokenV2, owner, notOwner } =
          await loadFixture(deployWunderTokenV2)
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.DEFAULT_ADMIN_ROLE(),
            owner.address,
          ),
        ).to.be.true()

        // confirm notOwner doens't have GOVERN_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.GOVERN_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()

        // grant GOVERN_ROLE to notOwner
        await wunderTokenV2.grantRole(
          await wunderTokenV2.GOVERN_ROLE(),
          notOwner.address,
        )

        // confirm notOwner has GOVERN_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.GOVERN_ROLE(),
            notOwner.address,
          ),
        ).to.be.true()
      })

      it("Should be able to grant PAUSER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
        // confirm owner has DEFAULT_ADMIN_ROLE
        const { wunderTokenV2, owner, notOwner } =
          await loadFixture(deployWunderTokenV2)
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.DEFAULT_ADMIN_ROLE(),
            owner.address,
          ),
        ).to.be.true()

        // confirm notOwner doens't have PAUSER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.PAUSER_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()

        // grant PAUSER_ROLE to notOwner
        await wunderTokenV2.grantRole(
          await wunderTokenV2.PAUSER_ROLE(),
          notOwner.address,
        )

        // confirm notOwner has PAUSER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.PAUSER_ROLE(),
            notOwner.address,
          ),
        ).to.be.true()
      })
    })

    describe("Revoking", () => {
      it("Should be able to revoke MINTER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
        // confirm owner has DEFAULT_ADMIN_ROLE
        const { wunderTokenV2, owner, notOwner } =
          await loadFixture(deployWunderTokenV2)
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.DEFAULT_ADMIN_ROLE(),
            owner.address,
          ),
        ).to.be.true()

        // confirm notOwner doens't have MINTER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.MINTER_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()

        // grant MINTER_ROLE to notOwner
        await wunderTokenV2.grantRole(
          await wunderTokenV2.MINTER_ROLE(),
          notOwner.address,
        )

        // confirm notOwner has MINTER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.MINTER_ROLE(),
            notOwner.address,
          ),
        ).to.be.true()

        // revoke MINTER_ROLE from notOwner
        await wunderTokenV2.revokeRole(
          await wunderTokenV2.MINTER_ROLE(),
          notOwner.address,
        )

        // confirm notOwner doesn't have MINTER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.MINTER_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()
      })

      it("Should be able to revoke BURNER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
        // confirm owner has DEFAULT_ADMIN_ROLE
        const { wunderTokenV2, owner, notOwner } =
          await loadFixture(deployWunderTokenV2)
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.DEFAULT_ADMIN_ROLE(),
            owner.address,
          ),
        ).to.be.true()

        // confirm notOwner doens't have BURNER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.BURNER_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()

        // grant BURNER_ROLE to notOwner
        await wunderTokenV2.grantRole(
          await wunderTokenV2.BURNER_ROLE(),
          notOwner.address,
        )

        // confirm notOwner has BURNER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.BURNER_ROLE(),
            notOwner.address,
          ),
        ).to.be.true()

        // revoke BURNER_ROLE from notOwner
        await wunderTokenV2.revokeRole(
          await wunderTokenV2.BURNER_ROLE(),
          notOwner.address,
        )

        // confirm notOwner doesn't have BURNER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.BURNER_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()
      })

      it("Should be able to revoke GOVERN_ROLE as DEFAULT_ADMIN_ROLE", async () => {
        // confirm owner has DEFAULT_ADMIN_ROLE
        const { wunderTokenV2, owner, notOwner } =
          await loadFixture(deployWunderTokenV2)
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.DEFAULT_ADMIN_ROLE(),
            owner.address,
          ),
        ).to.be.true()

        // confirm notOwner doens't have GOVERN_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.GOVERN_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()

        // grant GOVERN_ROLE to notOwner
        await wunderTokenV2.grantRole(
          await wunderTokenV2.GOVERN_ROLE(),
          notOwner.address,
        )

        // confirm notOwner has GOVERN_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.GOVERN_ROLE(),
            notOwner.address,
          ),
        ).to.be.true()

        // revoke GOVERN_ROLE from notOwner
        await wunderTokenV2.revokeRole(
          await wunderTokenV2.GOVERN_ROLE(),
          notOwner.address,
        )

        // confirm notOwner doesn't have GOVERN_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.GOVERN_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()
      })

      it("Should be able to revoke PAUSER_ROLE as DEFAULT_ADMIN_ROLE", async () => {
        // confirm owner has DEFAULT_ADMIN_ROLE
        const { wunderTokenV2, owner, notOwner } =
          await loadFixture(deployWunderTokenV2)
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.DEFAULT_ADMIN_ROLE(),
            owner.address,
          ),
        ).to.be.true()

        // confirm notOwner doens't have PAUSER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.PAUSER_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()

        // grant PAUSER_ROLE to notOwner
        await wunderTokenV2.grantRole(
          await wunderTokenV2.PAUSER_ROLE(),
          notOwner.address,
        )

        // confirm notOwner has PAUSER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.PAUSER_ROLE(),
            notOwner.address,
          ),
        ).to.be.true()

        // revoke PAUSER_ROLE from notOwner
        await wunderTokenV2.revokeRole(
          await wunderTokenV2.PAUSER_ROLE(),
          notOwner.address,
        )

        // confirm notOwner doesn't have PAUSER_ROLE
        expect(
          await wunderTokenV2.hasRole(
            await wunderTokenV2.PAUSER_ROLE(),
            notOwner.address,
          ),
        ).to.be.false()
      })
    })

    describe("Methods", () => {
      describe("GOVERN_ROLE", () => {
        // function freeze(address account)
        it("Should be able to `freeze` an account as GOVERN_ROLE", async () => {
          const { wunderTokenV2, owner, governor, acc1 } =
            await loadFixture(deployWunderTokenV2)
          // confirm governor doens't have GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.false()

          // grant GOVERN_ROLE to governor
          await wunderTokenV2
            .connect(owner)
            .grantRole(await wunderTokenV2.GOVERN_ROLE(), governor.address)

          // confirm governor has GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.true()

          // confirm acc1 is not frozen
          expect(await wunderTokenV2.isFrozen(acc1.address)).to.be.false()

          // freeze acc1
          await wunderTokenV2.connect(governor).freeze(acc1.address)

          // confirm acc1 is frozen
          expect(await wunderTokenV2.isFrozen(acc1.address)).to.be.true()
        })

        it("Shouldn't be able to `freeze` an account as not GOVERN_ROLE", async () => {
          const { wunderTokenV2, governor, acc1 } =
            await loadFixture(deployWunderTokenV2)
          // confirm governor doens't have GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.false()

          // freeze acc1
          await expect(
            wunderTokenV2.connect(governor).freeze(acc1.address),
          ).to.be.revertedWithCustomError(
            wunderTokenV2,
            "AccessControlUnauthorizedAccount",
          )
        })

        // function unfreeze(address account)
        it("Should be able to `unfreeze` an account as GOVERN_ROLE", async () => {
          const { wunderTokenV2, owner, governor, acc1 } =
            await loadFixture(deployWunderTokenV2)
          // confirm governor doens't have GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.false()

          // grant GOVERN_ROLE to governor
          await wunderTokenV2
            .connect(owner)
            .grantRole(await wunderTokenV2.GOVERN_ROLE(), governor.address)

          // confirm governor has GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.true()

          // confirm acc1 is not frozen
          expect(await wunderTokenV2.isFrozen(acc1.address)).to.be.false()

          // freeze acc1
          await wunderTokenV2.connect(governor).freeze(acc1.address)

          // confirm acc1 is frozen
          expect(await wunderTokenV2.isFrozen(acc1.address)).to.be.true()

          // unfreeze acc1
          await wunderTokenV2.connect(governor).unfreeze(acc1.address)

          // confirm acc1 is not frozen
          expect(await wunderTokenV2.isFrozen(acc1.address)).to.be.false()
        })

        it("Shouldn't be able to `unfreeze` an account as not GOVERN_ROLE", async () => {
          const { wunderTokenV2, governor, acc1 } =
            await loadFixture(deployWunderTokenV2)
          // confirm governor doens't have GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.false()

          // unfreeze acc1
          await expect(
            wunderTokenV2.connect(governor).unfreeze(acc1.address),
          ).to.be.revertedWithCustomError(
            wunderTokenV2,
            "AccessControlUnauthorizedAccount",
          )
        })

        // function seize(address account)
        it("Should be able to `seize` an account as GOVERN_ROLE", async () => {
          const { wunderTokenV2, owner, governor, minter, acc1 } =
            await loadFixture(deployWunderTokenV2)
          // confirm governor doens't have GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.false()
          // grant GOVERN_ROLE to governor
          await wunderTokenV2
            .connect(owner)
            .grantRole(await wunderTokenV2.GOVERN_ROLE(), governor.address)
          // confirm governor has GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.true()

          // grant MINTER_ROLE to minter
          await wunderTokenV2
            .connect(owner)
            .grantRole(await wunderTokenV2.MINTER_ROLE(), minter.address)

          // mint 100 Wunder to acc1
          await wunderTokenV2.connect(minter).mint(acc1.address, 100)

          // confirm acc1 has 100 Wunder
          expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(100)

          // confirm wunderTokenV2 contract has 0 Wunder
          expect(
            await wunderTokenV2.balanceOf(await wunderTokenV2.getAddress()),
          ).to.equal(0)

          // freeze acc1 (acc1 is not frozen)
          await wunderTokenV2.connect(governor).freeze(acc1.address)

          // seize acc1
          await wunderTokenV2.connect(governor).seize(acc1.address)

          // // confirm acc1 has 0 Wunder
          // expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(0);

          // // confirm wunderTokenV2 contract has 100 Wunder
          // expect(await wunderTokenV2.balanceOf(await wunderTokenV2.getAddress())).to.equal(100);
        })

        it("Shouldn't be able to `seize` an account as not GOVERN_ROLE", async () => {
          const { wunderTokenV2, governor, acc1 } =
            await loadFixture(deployWunderTokenV2)
          // confirm governor doens't have GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.false()

          // seize acc1
          await expect(
            wunderTokenV2.connect(governor).seize(acc1.address),
          ).to.be.revertedWithCustomError(
            wunderTokenV2,
            "AccessControlUnauthorizedAccount",
          )
        })

        // function withdraw(uint256 amount)
        it("Should be able to `withdraw` Wunder as GOVERN_ROLE", async () => {
          const { wunderTokenV2, owner, governor, minter, acc1 } =
            await loadFixture(deployWunderTokenV2)
          // confirm governor doens't have GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.false()
          // grant GOVERN_ROLE to governor
          await wunderTokenV2
            .connect(owner)
            .grantRole(await wunderTokenV2.GOVERN_ROLE(), governor.address)
          // confirm governor has GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.true()

          // grant MINTER_ROLE to minter
          await wunderTokenV2
            .connect(owner)
            .grantRole(await wunderTokenV2.MINTER_ROLE(), minter.address)

          // mint 100 Wunder to acc1
          await wunderTokenV2.connect(minter).mint(acc1.address, 100)

          // confirm acc1 has 100 Wunder
          expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(100)

          // confirm wunderTokenV2 contract has 0 Wunder
          expect(
            await wunderTokenV2.balanceOf(await wunderTokenV2.getAddress()),
          ).to.equal(0)

          // freeze acc1 (acc1 is not frozen)
          await wunderTokenV2.connect(governor).freeze(acc1.address)

          // seize acc1
          await wunderTokenV2.connect(governor).seize(acc1.address)

          // confirm acc1 has 0 Wunder
          expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(0)

          // confirm wunderTokenV2 contract has 100 Wunder
          expect(
            await wunderTokenV2.balanceOf(await wunderTokenV2.getAddress()),
          ).to.equal(100)

          // withdraw 100 Wunder
          await wunderTokenV2.connect(governor).withdraw(100)

          // confirm acc1 has 0 Wunder
          expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(0)

          // confirm wunderTokenV2 contract has 0 Wunder
          expect(
            await wunderTokenV2.balanceOf(await wunderTokenV2.getAddress()),
          ).to.equal(0)

          // confirm governor has 100 Wunder
          expect(await wunderTokenV2.balanceOf(governor.address)).to.equal(100)
        })

        it("Shouldn't be able to `withdraw` Wunder as not GOVERN_ROLE", async () => {
          const { wunderTokenV2, governor } =
            await loadFixture(deployWunderTokenV2)
          // confirm governor doens't have GOVERN_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.GOVERN_ROLE(),
              governor.address,
            ),
          ).to.be.false()

          // withdraw 100 Wunder
          await expect(
            wunderTokenV2.connect(governor).withdraw(100),
          ).to.be.revertedWithCustomError(
            wunderTokenV2,
            "AccessControlUnauthorizedAccount",
          )
        })
      })

      describe("PAUSER_ROLE", () => {
        // function pause() public onlyRole(PAUSER_ROLE)
        it("Should be able to `pause` as PAUSER_ROLE", async () => {
          const { wunderTokenV2, owner, pauser } =
            await loadFixture(deployWunderTokenV2)
          // confirm pauser doens't have PAUSER_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.PAUSER_ROLE(),
              pauser.address,
            ),
          ).to.be.false()

          // grant PAUSER_ROLE to pauser
          await wunderTokenV2
            .connect(owner)
            .grantRole(await wunderTokenV2.PAUSER_ROLE(), pauser.address)

          // confirm pauser has PAUSER_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.PAUSER_ROLE(),
              pauser.address,
            ),
          ).to.be.true()

          // confirm wunderTokenV2 is not paused
          expect(await wunderTokenV2.paused()).to.be.false()

          // pause wunderTokenV2
          await wunderTokenV2.connect(pauser).pause()

          // confirm wunderTokenV2 is paused
          expect(await wunderTokenV2.paused()).to.be.true()
        })

        it("Shouldn't be able to `pause` as not PAUSER_ROLE", async () => {
          const { wunderTokenV2, pauser } =
            await loadFixture(deployWunderTokenV2)
          // confirm pauser doens't have PAUSER_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.PAUSER_ROLE(),
              pauser.address,
            ),
          ).to.be.false()

          // confirm wunderTokenV2 is not paused
          expect(await wunderTokenV2.paused()).to.be.false()

          // pause wunderTokenV2
          await expect(
            wunderTokenV2.connect(pauser).pause(),
          ).to.be.revertedWithCustomError(
            wunderTokenV2,
            "AccessControlUnauthorizedAccount",
          )
        })

        // function unpause() public onlyRole(PAUSER_ROLE)
        it("Should be able to `unpause` as PAUSER_ROLE", async () => {
          const { wunderTokenV2, owner, pauser } =
            await loadFixture(deployWunderTokenV2)
          // confirm pauser doens't have PAUSER_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.PAUSER_ROLE(),
              pauser.address,
            ),
          ).to.be.false()

          // grant PAUSER_ROLE to pauser
          await wunderTokenV2
            .connect(owner)
            .grantRole(await wunderTokenV2.PAUSER_ROLE(), pauser.address)

          // confirm pauser has PAUSER_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.PAUSER_ROLE(),
              pauser.address,
            ),
          ).to.be.true()

          // confirm wunderTokenV2 is not paused
          expect(await wunderTokenV2.paused()).to.be.false()

          // pause wunderTokenV2
          await wunderTokenV2.connect(pauser).pause()

          // confirm wunderTokenV2 is paused
          expect(await wunderTokenV2.paused()).to.be.true()

          // unpause wunderTokenV2
          await wunderTokenV2.connect(pauser).unpause()

          // confirm wunderTokenV2 is not paused
          expect(await wunderTokenV2.paused()).to.be.false()
        })

        it("Shouldn't be able to `unpause` as not PAUSER_ROLE", async () => {
          const { wunderTokenV2, pauser } =
            await loadFixture(deployWunderTokenV2)
          // confirm pauser doens't have PAUSER_ROLE
          expect(
            await wunderTokenV2.hasRole(
              await wunderTokenV2.PAUSER_ROLE(),
              pauser.address,
            ),
          ).to.be.false()

          // confirm wunderTokenV2 is not paused
          expect(await wunderTokenV2.paused()).to.be.false()

          // unpause wunderTokenV2
          await expect(
            wunderTokenV2.connect(pauser).unpause(),
          ).to.be.revertedWithCustomError(
            wunderTokenV2,
            "AccessControlUnauthorizedAccount",
          )
        })
      })
    })
  })
})
