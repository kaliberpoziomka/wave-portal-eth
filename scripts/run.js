// Testing our contract
const { ethers } = require("hardhat");
const main = async () => {
    const [owner, randomPerson] = await ethers.getSigners();
    const waveContractFactory = await ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();

    console.log("Cotract deployed to:", waveContract.address);
    console.log("Cotract deployed by:", owner.address);

    let contractBalance = await ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ",
                ethers.utils.formatEther(contractBalance));    

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    // console.log(waveCount.toNumber());

    let waveTxn = await waveContract.wave("A message!");
    await waveTxn.wait();

    waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait();

    contractBalance = await ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ",
                ethers.utils.formatEther(contractBalance)); 

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);

};

main()
    .then(() => {
        process.exit(0)
    }) // exit Node process without error
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })