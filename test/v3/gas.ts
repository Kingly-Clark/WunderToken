import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import { deployFullWunderTokenV3 } from "../utils/deployments"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect

describe("V3", () => {
  describe("GAS Usage", () => {
    it("Evaluate GAS costs for 10 transactions of different sizes between acc1, acc2 and acc3", async () => {
      const { wunderTokenV3, acc1, acc2, acc3 } = await loadFixture(
        deployFullWunderTokenV3,
      )

      // confirm acc1 and acc2 aren't frozen
      expect(await wunderTokenV3.isFrozen(acc1.address)).to.be.false()
      expect(await wunderTokenV3.isFrozen(acc2.address)).to.be.false()
      expect(await wunderTokenV3.isFrozen(acc3.address)).to.be.false()
      for (let i = 0; i < 10; i++) {
        const amount = Math.floor(Math.random() * 1000)
        await wunderTokenV3.connect(acc1).transfer(acc2.address, amount)
        await wunderTokenV3.connect(acc2).transfer(acc3.address, amount)
        await wunderTokenV3.connect(acc3).transfer(acc1.address, amount)
      }
    })
  })
})
