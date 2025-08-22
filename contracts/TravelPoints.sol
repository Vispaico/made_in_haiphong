// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TravelPoints is ERC20, Ownable {
    constructor(address initialOwner) ERC20("TravelPoints", "TRVL") Ownable(initialOwner) {}

    /**
     * @dev Mints `amount` of tokens to `recipient`.
     * Can only be called by the contract owner.
     */
    function awardPoints(address recipient, uint256 amount) public onlyOwner {
        _mint(recipient, amount);
    }
}
