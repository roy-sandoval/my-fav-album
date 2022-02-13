// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract FavAlbum {
    uint256 totalSubmissions;

    //Using this to help generate a random number
    uint256 private seed;

    //Lets you log. Logging is keeping a record of all data input, processes, output and final result. Like console.log but the logs are save in the Ethereum blockchain
    event NewSubmission(address indexed from, uint256 timestamp, string url);

    //A struct is a custom datatype where we can customize what we want to hold inside it.
    struct Submission {
        address user; //The address of who sumbitted an album
        string url;
        uint256 timestamp; //The timestamp when the user submitted
    }

    //We declare this variable "albums" to store an array of structs. This is what holds all the submissions
    Submission[] submissions;

    //This is an address => uint mapping, meaning that we can associate a number with an address. We'll be storing the address with the last user that submitted an album
    mapping(address => uint256) public lastSubmittedAt;

    constructor() payable {
        console.log("We have been constructed!");

        //Set the initial seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function submitAlbum(string memory _url) public {
        //Check if the current timestamp is 15 minutes bigger than the last timestamp we stored
        require(
            lastSubmittedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15 minutes"
        );

        //Update the current timestamp we have for the user
        lastSubmittedAt[msg.sender] = block.timestamp;

        totalSubmissions += 1;
        console.log("%s has submitted their favorite album!", msg.sender);

        //This is where we store the album data in the array
        submissions.push(Submission(msg.sender, _url, block.timestamp));

        //Generate a new seed for the next user that submits an album
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        //Give a 2% chance that the user wins the prize
        if (seed == 6 || seed == 10) {
            console.log("%s won!", msg.sender);

            //Send 0.001 ether
            uint256 prizeAmount = 0.0005 ether;

            //checks if some condition is true. Like an if statement
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );

            //This is the line that sends the money
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from smart contract.");
        }

        //Show it on the client side.
        emit NewSubmission(msg.sender, block.timestamp, _url);
    }

    function getAllSubmissions() public view returns (Submission[] memory) {
        return submissions;
    }

    function getTotalSubmissions() public view returns (uint256) {
        console.log("We have %d total submissions!", totalSubmissions);
        return totalSubmissions;
    }
}
