// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    address public owner;
    uint256 public tokenPrice; // Price in wei (the smallest unit of ether)

    constructor(string memory name, string memory symbol,uint256 initialSupply, uint256 initialPrice ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10**18); // Supply is given in MTK, convert to wei (18 decimals)
        owner = msg.sender;
        tokenPrice = initialPrice;
    }

    function mint(address _address,uint256 _amount) public {
        _mint(_address, _amount);
    }

    function changeTokenPrice(uint256 newPrice) public {
        require(msg.sender == owner, "Only the owner can change the token's price");
        tokenPrice = newPrice;
    }
}