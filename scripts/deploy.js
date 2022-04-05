const {ethers} = require("hardhat");
const main = async () => {
    const [deployer] = await ethers.getSigners() ;
    const accountBalance = await deployer.getBalance();

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());

    const waveContractFactory = await ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: ethers.utils.parseEther("0.001"),
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

// WavePortal address deployed: 0x8E78c63B9da82Fa158a4D12E66daa789A3F75EC0