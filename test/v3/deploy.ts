import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import { deployWunderTokenV3 } from "../utils/deployments"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect

describe("V3", () => {
  describe("Deployment", () => {
    it("Should be able to deploy", async () => {
      const { wunderTokenV3 } = await loadFixture(deployWunderTokenV3)

      expect(await wunderTokenV3.name()).to.equal("Wunderpar")
      expect(await wunderTokenV3.symbol()).to.equal("WUNDER")
    })

    it("Should have granted owner DEFAULT_ADMIN_ROLE to deployer (owner)", async () => {
      const { wunderTokenV3, owner } = await loadFixture(deployWunderTokenV3)

      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.DEFAULT_ADMIN_ROLE(),
          owner.address,
        ),
      ).to.be.true()
    })

    it("Should not have granted owner MINTER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV3, owner } = await loadFixture(deployWunderTokenV3)

      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.MINTER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner PAUSER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV3, owner } = await loadFixture(deployWunderTokenV3)

      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.PAUSER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner BURNER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV3, owner } = await loadFixture(deployWunderTokenV3)

      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.BURNER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner GOVERN_ROLE to deployer (owner)", async () => {
      const { wunderTokenV3, owner } = await loadFixture(deployWunderTokenV3)

      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.GOVERN_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner UPGRADER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV3, owner } = await loadFixture(deployWunderTokenV3)

      expect(
        await wunderTokenV3.hasRole(
          await wunderTokenV3.UPGRADER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })
  })
})
