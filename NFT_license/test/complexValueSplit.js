const {ethers} = require("hardhat")

const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {solidity} = require('ethereum-waffle')
const chai = require('chai')
chai.use(solidity)
const { expect } = require("chai")

describe("complex value splitter", function () {
    async function deployContract() {

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount1, otherAccount2] = await ethers.getSigners();
        // owner.estimateGas(3500000);

        const License = await ethers.getContractFactory("Complex_Splittable_Contract");
        const license = await License.deploy();

        return {license, owner, otherAccount1, otherAccount2};
    }
    describe("deploying", function () {
        it("should deploy", async function () {
            const {license} = await loadFixture(deployContract);
            expect(await license.owner()).to.not.equal(0);
        });
    });
    describe("minting", function () {
        it("should mint a token", async function () {
            const {license, owner} = await loadFixture(deployContract);
            await license.mint(owner.address, "https://ipfs.io/");
            expect(await license.balanceOf(owner.address)).to.equal(1);
        });
    });

    describe("splitting", function () {
        it("should split a token", async function () {
            const {license, owner, otherAccount1, otherAccount2} = await loadFixture(deployContract);
            await license.mint(owner.address, "https://ipfs.io/");
            await license.connect(owner).split(1,[1,2]);
            expect(await license.ownerOf(1)).to.equal(license.address);
            expect(await license.ownerOf(2)).to.equal(owner.address);
            expect(await license.ownerOf(3)).to.equal(owner.address);
        })

        it("Should split a token and merge percentages", async function () {
            const {license, owner, otherAccount1, otherAccount2} = await loadFixture(deployContract);
            await license.mint(owner.address, "https://ipfs.io/");
            await license.connect(owner).split(1,[1,2]);
            await license.connect(owner).split(2,[1,2]);
            await license.connect(owner).split(3,[1,2]);

            await license.connect(owner).mergePercentage([4,6])

            const des = await license.getAllDescendants(1);
            console.log(des);
        })
    })
})