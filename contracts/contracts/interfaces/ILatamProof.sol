//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILatAmProof{
    function isUserVerifiedForCountry(address user, string memory country) external view returns (bool);
}