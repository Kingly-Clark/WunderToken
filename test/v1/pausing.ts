import "@nomicfoundation/hardhat-chai-matchers"
import * as chai from "chai"

const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect
describe.skip("V1", () => {
  describe("Pausing/Unpausing", () => {
    describe("Methods when paused", () => {
      it("Should not be able to transfer when paused", async () => {
        expect(true).to.be.false()
      })
    })

    describe("Methods when unpaused", () => {
      it("Should be able to transfer when unpaused", async () => {
        expect(true).to.be.false()
      })
    })
  })
})
