// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("HI, I'm Wave!");
    }

    function wave(string memory message_) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender, message_);

        waves.push(Wave(msg.sender, message_, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, message_);

        // Give everyone who waves some ETH
        uint256 prizeAmount = 0.00001 ether;

        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has!"
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw moeny from contract.");
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    receive() external payable {}
}