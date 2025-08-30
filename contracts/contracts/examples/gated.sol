
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ILatAmProof} from "../interfaces/ILatamProof.sol";
contract MyGatedContract {
    ILatAmProof public latAmProof;
    uint256 public argCount;
    
    constructor(address _latAmProof) {
        latAmProof = ILatAmProof(_latAmProof);
        argCount=0;
    }

    
    modifier onlyFromCountry(string memory country) {
        require(
            latAmProof.isUserVerifiedForCountry(msg.sender, country),
            "Not verified for this country"
        );
        _;
    }
    
    function argentinaOnly() external onlyFromCountry("ARG") {
        // Only Argentinian users can call this
        argCount++;
    }
    
    function belizeOnly() external onlyFromCountry("BLZ") {
        // Only Belize users can call this
    }
}