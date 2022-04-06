const {ethers} = require("hardhat");
const main = async () => {
    const [deployer] = await ethers.getSigners() ;
    // const accountBalance = await deployer.getBalance();

    console.log("Deploying contracts with account: ", deployer.address);
    // console.log("Account balance: ", accountBalance.toString());

    const vrfContractFactory = await ethers.getContractFactory("VRFv2Consumer");
    const vrfContract = await vrfContractFactory.deploy(2446);
    await vrfContract.deployed();

    console.log("VRFv2Consumer Contract address: ", vrfContract.address);
};

main()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })

// WavePortal address deployed: 0xa2E3162f83Ce5063B84e50EA2Bb8D5BaD2f4eff2

// CAHINLINK VRF SUBSCRIPTION ID: 2446
// VRFv2Consumer Contract address:  0xBE94f3c73A663b2adA6Cb6be978fdF15Ce06712E