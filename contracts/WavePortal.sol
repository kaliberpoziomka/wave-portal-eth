// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    address private owner_;

    uint256 totalWaves;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    mapping(address => uint256) lastWavedAt;

    constructor() payable {
        owner_ = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner_, "You are not the owner");
        _;
    }

    modifier notSoFast() {
        require(lastWavedAt[msg.sender] + 1 minutes < block.timestamp, "Wait 1 minute!");
        _;
    }

    function wave(string memory message_) public notSoFast {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender, message_);

        waves.push(Wave(msg.sender, message_, block.timestamp));

        lastWavedAt[msg.sender] = block.timestamp;

        emit NewWave(msg.sender, block.timestamp, message_);
    }

    function payRandomAddress(address addr_) public onlyOwner {
        // Give everyone who waves some ETH
        uint256 prizeAmount = 0.0001 ether;

        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has!"
        );
        (bool success, ) = (addr_).call{value: prizeAmount}("");
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
