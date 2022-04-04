// hre - Hardhat Runtime Environment
// hre is built on the fly when using npx hardhat
// it is specified in hardhat.config.js
const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();
    console.log("Cotract deployed to:", waveContract.address);
};

main()
    .then(() => {
        process.exit(0)
    }) // exit Node process without error
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })