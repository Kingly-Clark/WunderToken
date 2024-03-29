import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import { deployWunderTokenV1 } from "../utils/deployments"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect

describe("V1", () => {
  describe("Deployment", () => {
    it("Should be able to deploy", async () => {
      const { wunderTokenV1 } = await loadFixture(deployWunderTokenV1)

      expect(await wunderTokenV1.name()).to.equal("Wunderpar")
      expect(await wunderTokenV1.symbol()).to.equal("WUNDER")
    })

    it("Should have granted owner DEFAULT_ADMIN_ROLE to deployer (owner)", async () => {
      const { wunderTokenV1, owner } = await loadFixture(deployWunderTokenV1)

      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.DEFAULT_ADMIN_ROLE(),
          owner.address,
        ),
      ).to.be.true()
    })

    it("Should not have granted owner MINTER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV1, owner } = await loadFixture(deployWunderTokenV1)

      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.MINTER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner PAUSER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV1, owner } = await loadFixture(deployWunderTokenV1)

      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.PAUSER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner BURNER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV1, owner } = await loadFixture(deployWunderTokenV1)

      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.BURNER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner GOVERN_ROLE to deployer (owner)", async () => {
      const { wunderTokenV1, owner } = await loadFixture(deployWunderTokenV1)

      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.GOVERN_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })

    it("Should not have granted owner UPGRADER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV1, owner } = await loadFixture(deployWunderTokenV1)

      expect(
        await wunderTokenV1.hasRole(
          await wunderTokenV1.UPGRADER_ROLE(),
          owner.address,
        ),
      ).to.be.false()
    })
  })
})
