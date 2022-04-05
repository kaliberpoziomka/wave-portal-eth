const {ethers} = require("hardhat");
const main = async () => {
    const [deployer] = await ethers.getSigners() ;
    const accountBalance = await deployer.getBalance();

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());

    const waveContractFactory = await ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: ethers.utils.parseEther("0.01"),
    });
    await waveContract.deployed();

    console.log("WavePortal address: ", waveContract.address);
};

main()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })

// WavePortal address deployed: 0x636F4361108478dF1682408dAE20De6ce1F46ea5