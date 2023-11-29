import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import { deployWunderTokenV2 } from "../utils/deployments"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect

describe("V2", () => {
  describe("Deployment", () => {
    it("Should be able to deploy", async () => {
      const { wunderTokenV2 } = await loadFixture(deployWunderTokenV2)

      expect(await wunderTokenV2.name()).to.equal("Wunder Token")
      expect(await wunderTokenV2.symbol()).to.equal("WUNDER")
    })

    it("Should have granted owner DEFAULT_ADMIN_ROLE to deployer (owner)", async () => {
      const { wunderTokenV2, owner } = await loadFixture(deployWunderTokenV2)

      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.DEFAULT_ADMIN_ROLE(),
          owner.address,
        ),
      ).to.be.true()
    })

    it("Should not have granted owner MINTER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV2, owner } = await loadFixture(deployWunderTokenV2)

      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.MINTER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner PAUSER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV2, owner } = await loadFixture(deployWunderTokenV2)

      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.PAUSER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner BURNER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV2, owner } = await loadFixture(deployWunderTokenV2)

      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.BURNER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner GOVERN_ROLE to deployer (owner)", async () => {
      const { wunderTokenV2, owner } = await loadFixture(deployWunderTokenV2)

      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.GOVERN_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner UPGRADER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV2, owner } = await loadFixture(deployWunderTokenV2)

      expect(
        await wunderTokenV2.hasRole(
          await wunderTokenV2.UPGRADER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })
  })
})
