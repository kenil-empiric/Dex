// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSwap {
    address public owner; // Address of the contract owner
    

    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    mapping(address => IERC20) public supportedTokens;

    constructor() {
        owner = msg.sender;
    }

    function addSupportedToken(address _tokenAddress) public {
        supportedTokens[_tokenAddress] = IERC20(_tokenAddress);
    }

    // Buy tokens with ETH
    function Tokensswap(address tokenowner,address _tokenfrom,address _tokento,uint256 _tokenAmountfrom,uint256 _tokenAmountto) external payable {
        require(msg.value > 0, "Amount sent must be greater than 0");
        uint256 ethAmount = msg.value;
        uint256 rate = 100; // Replace with the exchange rate (e.g., 1 ETH = 100 tokens)
        uint256 tokenAmount = ethAmount * rate;
        IERC20(_tokenfrom).transferFrom(msg.sender,address(this), _tokenAmountfrom);
        IERC20(_tokento).transferFrom(tokenowner,msg.sender, _tokenAmountto); // Transfer tokens to the buyer
        payable(owner).transfer(ethAmount); // Send ETH to the contract owner
        emit TokensPurchased(msg.sender, ethAmount, tokenAmount);
    }

    function buyTokens(address tokenowner,address _token,uint256 _tokenAmount) external payable {
        require(msg.value > 0, "Amount sent must be greater than 0");
        uint256 ethAmount = msg.value;
        uint256 rate = 100; // Replace with the exchange rate (e.g., 1 ETH = 100 tokens)
        uint256 tokenAmount = ethAmount * rate;
        IERC20(_token).transferFrom(tokenowner,msg.sender, _tokenAmount); // Transfer tokens to the buyer
        payable(owner).transfer(ethAmount); // Send ETH to the contract owner
        emit TokensPurchased(msg.sender, ethAmount, tokenAmount);
    }

    // Only the owner can withdraw ETH from the contract
    function withdrawETH() external {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}