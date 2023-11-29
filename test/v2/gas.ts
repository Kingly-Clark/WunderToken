import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
import { deployFullWunderTokenV2 } from "../utils/deployments"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect

describe("V2", () => {
  describe("GAS Usage", () => {
    it("Evaluate GAS costs for 10 transactions of different sizes between acc1, acc2 and acc3", async () => {
      const { wunderTokenV2, acc1, acc2, acc3 } = await loadFixture(
        deployFullWunderTokenV2,
      )

      // confirm acc1 and acc2 aren't frozen
      expect(await wunderTokenV2.isFrozen(acc1.address)).to.be.false()
      expect(await wunderTokenV2.isFrozen(acc2.address)).to.be.false()
      expect(await wunderTokenV2.isFrozen(acc3.address)).to.be.false()
      for (let i = 0; i < 10; i++) {
        const amount = Math.floor(Math.random() * 1000)
        await wunderTokenV2.connect(acc1).transfer(acc2.address, amount)
        await wunderTokenV2.connect(acc2).transfer(acc3.address, amount)
        await wunderTokenV2.connect(acc3).transfer(acc1.address, amount)
      }
    })
  })
})
