import { ethers, upgrades } from "hardhat"
import * as chai from "chai"
import "@nomicfoundation/hardhat-chai-matchers"
// eslint-disable-next-line node/no-missing-import
// eslint-disable-next-line node/no-missing-import
import { wunderToEth } from "../utils/conversions"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import {
  WunderTokenV1,
  WunderTokenV2,
  // eslint-disable-next-line node/no-missing-import
} from "../../typechain-types"
// eslint-disable-next-line node/no-missing-import
import {
  applyBurnerRole,
  applyGovernRole,
  applyMinterRole,
  applyUpgaraderRole,
  revokeUpgaraderRole,
  // eslint-disable-next-line node/no-missing-import
} from "../utils/deployments"
const dirtyChai = require("dirty-chai")

chai.use(dirtyChai)
const expect = chai.expect
describe("Critical Path ", () => {
  it("Should persists state variables through upgrades", async () => {
    // 1. Deploy WunderTokenV1
    // 2. Grant MINTER_ROLE, GOVERN_ROLE, BURNER_ROLE to minter, governor, burner respectively
    // 3. Mint
    //     - 100 tokens to acc1
    //     - 200 tokens to acc2
    //     - 300 tokens to acc3
    // 4. Freeze acc1 and acc2
    // 5. Seize funds in acc1
    // 6. Mint 50 tokens to acc1
    // 7. BurnFrom 50 tokens from acc3
    // 8. Send 50 tokens to acc1 from acc3 (from an unfrozen account to a frozen account)
    // 9. Fail when acc1 tries to transfer 50 tokens to acc3 (from a frozen account to an unfrozen account)
    // 10. Check state befor upgrade
    // 11. Upgrade to WunderTokenV2
    // 12. Check state after upgrade

    const [owner, minter, burner, governor, acc1, acc2, acc3] =
      (await ethers.getSigners()) as HardhatEthersSigner[]

    // 1. Deploy WunderTokenV1
    const WunderTokenV1 = await ethers.getContractFactory("WunderTokenV1")
    const wunderTokenV1Proxy = await upgrades.deployProxy(
      WunderTokenV1,
      [owner.address],
      { initializer: "initialize" },
    )
    await wunderTokenV1Proxy.waitForDeployment()
    const wunderTokenV1ProxyAddress = await wunderTokenV1Proxy.getAddress()
    const wunderTokenV1: WunderTokenV1 = await ethers.getContractAt(
      "WunderTokenV1",
      wunderTokenV1ProxyAddress,
    )

    // 2. Grant MINTER_ROLE, GOVERN_ROLE, BURNER_ROLE to minter, governor, burner respectively
    await applyMinterRole(wunderTokenV1, owner, minter)
    await applyGovernRole(wunderTokenV1, owner, governor)
    await applyBurnerRole(wunderTokenV1, owner, burner)

    // 3. Mint
    await wunderTokenV1
      .connect(minter)
      .batchMint(
        [acc1.address, acc2.address, acc3.address],
        [wunderToEth("100"), wunderToEth("200"), wunderToEth("300")],
      )
    // acc1: 100
    // acc2: 200
    // acc3: 300
    // wund: 0

    // 4. Freeze acc1 and acc2
    await wunderTokenV1.connect(governor).freeze(acc1.address)
    await wunderTokenV1.connect(governor).freeze(acc2.address)

    // 5. Seize funds in acc1
    await wunderTokenV1.connect(governor).seize(acc1.address)
    // acc1: 0
    // acc2: 200
    // acc3: 300
    // wund: 100
    // total: 600

    // 6. Mint 50 tokens to acc1 - testing that we can mint to a frozen account
    await wunderTokenV1.connect(minter).mint(acc1.address, wunderToEth("50"))
    // acc1: 50
    // acc2: 200
    // acc3: 300
    // wund: 100
    // total: 650

    // 7. BurnFrom 50 tokens from acc3 - testing that the total supply decreases if we burn
    await wunderTokenV1.connect(acc3).approve(burner.address, wunderToEth("50"))
    await wunderTokenV1
      .connect(burner)
      .burnFrom(acc3.address, wunderToEth("50"))
    // acc1: 50
    // acc2: 200
    // acc3: 250
    // wund: 100
    // total: 600

    // 8. Send 50 tokens to acc1 from acc3 (from an unfrozen account to a frozen account)
    await wunderTokenV1.connect(acc3).transfer(acc1.address, wunderToEth("50"))
    // acc1: 100
    // acc2: 200
    // acc3: 200
    // wund: 100
    // total: 600

    // 9. Fail when acc1 tries to transfer 50 tokens to acc3 (from a frozen account to an unfrozen account)
    await expect(
      wunderTokenV1.connect(acc1).transfer(acc3.address, wunderToEth("50")),
    ).to.be.revertedWithCustomError(wunderTokenV1, "WunderTokenAccountFrozen")

    // 10. Check state befor upgrade
    expect(await wunderTokenV1.name()).to.equal("Wunder Token")
    expect(await wunderTokenV1.symbol()).to.equal("WUNDER")
    expect(await wunderTokenV1.totalSupply()).to.equal(wunderToEth("600"))

    expect(await wunderTokenV1.balanceOf(acc1.address)).to.equal(
      wunderToEth("100"),
    )
    expect(await wunderTokenV1.balanceOf(acc2.address)).to.equal(
      wunderToEth("200"),
    )
    expect(await wunderTokenV1.balanceOf(acc3.address)).to.equal(
      wunderToEth("200"),
    )
    expect(
      await wunderTokenV1.balanceOf(await wunderTokenV1.getAddress()),
    ).to.equal(wunderToEth("100"))

    expect(await wunderTokenV1.isFrozen(acc1.address)).to.equal(true)
    expect(await wunderTokenV1.isFrozen(acc2.address)).to.equal(true)
    expect(await wunderTokenV1.isFrozen(acc3.address)).to.equal(false)

    expect(
      await wunderTokenV1.hasRole(
        await wunderTokenV1.MINTER_ROLE(),
        minter.address,
      ),
    ).to.equal(true)
    expect(
      await wunderTokenV1.hasRole(
        await wunderTokenV1.GOVERN_ROLE(),
        governor.address,
      ),
    ).to.equal(true)
    expect(
      await wunderTokenV1.hasRole(
        await wunderTokenV1.BURNER_ROLE(),
        burner.address,
      ),
    ).to.equal(true)

    // 11. Upgrade to WunderTokenV2
    const WunderTokenV2 = await ethers.getContractFactory("WunderTokenV2")
    await applyUpgaraderRole(wunderTokenV1, owner, owner)
    const wunderTokenV2Proxy = await upgrades.upgradeProxy(
      wunderTokenV1ProxyAddress,
      WunderTokenV2,
    )
    await revokeUpgaraderRole(wunderTokenV1, owner, owner)
    const wunderTokenV2ProxyAddress = await wunderTokenV2Proxy.getAddress()
    const wunderTokenV2: WunderTokenV2 = await ethers.getContractAt(
      "WunderTokenV2",
      wunderTokenV2ProxyAddress,
    )

    // 12. Check state after upgrade
    expect(await wunderTokenV2.name()).to.equal("Wunder Token")
    expect(await wunderTokenV2.symbol()).to.equal("WUNDER")
    expect(await wunderTokenV2.totalSupply()).to.equal(wunderToEth("600"))

    expect(await wunderTokenV2.balanceOf(acc1.address)).to.equal(
      wunderToEth("100"),
    )
    expect(await wunderTokenV2.balanceOf(acc2.address)).to.equal(
      wunderToEth("200"),
    )
    expect(await wunderTokenV2.balanceOf(acc3.address)).to.equal(
      wunderToEth("200"),
    )
    expect(
      await wunderTokenV2.balanceOf(await wunderTokenV2.getAddress()),
    ).to.equal(wunderToEth("100"))
    expect(await wunderTokenV2.isFrozen(acc1.address)).to.equal(true)
    expect(await wunderTokenV2.isFrozen(acc2.address)).to.equal(true)
    expect(await wunderTokenV2.isFrozen(acc3.address)).to.equal(false)

    expect(
      await wunderTokenV2.hasRole(
        await wunderTokenV2.MINTER_ROLE(),
        minter.address,
      ),
    ).to.equal(true)

    expect(
      await wunderTokenV2.hasRole(
        await wunderTokenV2.GOVERN_ROLE(),
        governor.address,
      ),
    ).to.equal(true)

    expect(
      await wunderTokenV2.hasRole(
        await wunderTokenV2.BURNER_ROLE(),
        burner.address,
      ),
    ).to.equal(true)

    // Sending 50 tokens to acc1 from acc3 (from an unfrozen account to a frozen account) should now fail with v2
    await expect(
      wunderTokenV1.connect(acc3).transfer(acc1.address, wunderToEth("50")),
    ).to.be.revertedWithCustomError(wunderTokenV1, "WunderTokenAccountFrozen")

    // Fail when acc1 tries to transfer 50 tokens to acc3 (from a frozen account to an unfrozen account)
    await expect(
      wunderTokenV1.connect(acc1).transfer(acc3.address, wunderToEth("50")),
    ).to.be.revertedWithCustomError(wunderTokenV1, "WunderTokenAccountFrozen")
  })
})
