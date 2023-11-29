import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect

describe.skip("V1", () => {
  describe("Proxy", () => {
    it("Should be able to deploy a proxy for V1", async () => {
      expect(true).to.be.false()
    })

    it("Should be able to upgrade the proxy to V2", async () => {
      expect(true).to.be.false()
    })
  })
})
