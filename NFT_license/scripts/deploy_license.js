const hre = require("hardhat");

async function main() {
    const License = await hre.ethers.getContractFactory("License_Contract");
    const license = await License.deploy();

    await license.deployed();

    const Fractionalize = await hre.ethers.getContractFactory("FractionalizeNFT");
    const fractionalize = await Fractionalize.deploy(license.address);
    await fractionalize.deployed();

    console.log(
        `License deployed to ${license.address} and its fractionalization to ${fractionalize.address}`
    );
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});