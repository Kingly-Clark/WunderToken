import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import { Contract, Signer } from "ethers"
import { deployWunderTokenV1 } from "./utils/deployments";

const wunderToEth = (wunder: string) => ethers.utils.parseEther(wunder);

describe("WunderToken", () => {


  describe("Deployment", () => {
    it("Should be able to deploy", async () => {
      const { wunderTokenV1 } = await loadFixture(deployWunderTokenV1);

      expect(await wunderTokenV1.name()).to.equal("Wunder Token");
      expect(await wunderTokenV1.symbol()).to.equal("WUNDER");
    });

    it("Should have granted owner DEFAULT_ADMIN_ROLE to deployer (owner)", async () => {
      const { wunderTokenV1, owner } = await loadFixture(deployWunderTokenV1);

      expect(await wunderTokenV1.hasRole(await wunderTokenV1.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should not have granted owner MINTER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV1, owner } = await loadFixture(deployWunderTokenV1);

      expect(await wunderTokenV1.hasRole(await wunderTokenV1.MINTER_ROLE(), owner.address)).to.be.false;
    })

    it("Should not have granted owner PAUSER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV1, owner } = await loadFixture(deployWunderTokenV1);

      expect(await wunderTokenV1.hasRole(await wunderTokenV1.PAUSER_ROLE(), owner.address)).to.be.false;
    });

    it("Should not have granted owner BURNER_ROLE to deployer (owner)", async () => {
      const { wunderTokenV1, owner } = await loadFixture(deployWunderTokenV1);

      expect(await wunderTokenV1.hasRole(await wunderTokenV1.BURNER_ROLE(), owner.address)).to.be.false;
    });

    it("Should not have granted owner GOVERN_ROLE to deployer (owner)", async () => {
      const { wunderTokenV1, owner } = await loadFixture(deployWunderTokenV1);

      expect(await wunderTokenV1.hasRole(await wunderTokenV1.GOVERN_ROLE(), owner.address)).to.be.false;
    });
  });


});
