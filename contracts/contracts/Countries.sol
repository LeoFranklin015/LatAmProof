// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {StringUtils} from "@ensdomains/ens-contracts/contracts/utils/StringUtils.sol";

import {IL2Registry} from "./interfaces/IL2Registry.sol";
/**
 * @title TestSelfVerificationRoot
 * @notice Test implementation of SelfVerificationRoot for testing purposes
 * @dev This contract provides a concrete implementation of the abstract SelfVerificationRoot
 */
contract LatAmProof is SelfVerificationRoot {
     using StringUtils for string;



    // Storage for testing purposes
    bool public verificationSuccessful;
    ISelfVerificationRoot.GenericDiscloseOutputV2 public lastOutput;
    string  public lastUserData;
    SelfStructs.VerificationConfigV2 public verificationConfig;
    bytes32 public verificationConfigId;
    address public lastUserAddress;


    // Storage for registrar

    /// @notice Reference to the target registry contract
    IL2Registry public immutable registry;
      IL2Registry public immutable registry2;

    /// @notice The chainId for the current chain
    uint256 public chainId;

    /// @notice The coinType for the current chain (ENSIP-11)
    uint256 public immutable coinType;



    // Events for testing
    event VerificationCompleted(
        ISelfVerificationRoot.GenericDiscloseOutputV2 output,
        string userData,
        string country,
        uint256 coinType
    );

    /**
     * @notice Constructor for the test contract
     * @param identityVerificationHubV2Address The address of the Identity Verification Hub V2
     */
    constructor(
        address identityVerificationHubV2Address,
        uint256 scope,
        bytes32 _verificationConfigId,
        address _registry,
        address _registry2
    ) SelfVerificationRoot(identityVerificationHubV2Address, scope) {
        verificationConfigId = _verificationConfigId;
         assembly {
            sstore(chainId.slot, chainid())
        }

        // Calculate the coinType for the current chain according to ENSIP-11
        coinType = (0x80000000 | chainId) >> 0;

        // Save the registry address
        registry = IL2Registry(_registry);
        registry2 = IL2Registry(_registry2);
    }
    /**
     * @notice Implementation of customVerificationHook for testing
     * @dev This function is called by onVerificationSuccess after hub address validation
     * @param output The verification output from the hub
     * @param userData The user data passed through verification
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        verificationSuccessful = true;
        lastOutput = output;
        lastUserData = string(userData);
        lastUserAddress = address(uint160(output.userIdentifier));
        string memory country = output.nationality;


        
        bytes memory addr = abi.encodePacked(lastUserAddress); // Convert address to bytes

        // Set the forward address for the current chain. This is needed for reverse resolution.
        // E.g. if this contract is deployed to Base, set an address for chainId 8453 which is
        // coinType 2147492101 according to ENSIP-11.

if (keccak256(abi.encodePacked(country)) == keccak256(abi.encodePacked("ARG"))) {
    bytes32 node = _labelToNode(lastUserData, registry);
     registry.setAddr(node, coinType, addr);

        // Set the forward address for mainnet ETH (coinType 60) for easier debugging.
        registry.setAddr(node, 60, addr);

        
        // Register the name in the L2 registry
        registry.createSubnode(
            registry.baseNode(),
            lastUserData,
            lastUserAddress,
            new bytes[](0)
        );
} else if (keccak256(abi.encodePacked(country)) == keccak256(abi.encodePacked("BLZ"))) {
    bytes32 node = _labelToNode(lastUserData, registry2);
  registry2.setAddr(node, coinType, addr);

        // Set the forward address for mainnet ETH (coinType 60) for easier debugging.
        registry2.setAddr(node, 60, addr);

        
        // Register the name in the L2 registry
        registry2.createSubnode(
            registry.baseNode(),
            lastUserData,
            lastUserAddress,
            new bytes[](0)
        );
}

       

        

        emit VerificationCompleted(output, string(userData),country,coinType);
    }

    /**
     * @notice Reset the test state
     */
    function resetTestState() external {
        verificationSuccessful = false;
        lastOutput = ISelfVerificationRoot.GenericDiscloseOutputV2({
            attestationId: bytes32(0),
            userIdentifier: 0,
            nullifier: 0,
            forbiddenCountriesListPacked: [
                uint256(0),
                uint256(0),
                uint256(0),
                uint256(0)
            ],
            issuingState: "",
            name: new string[](3),
            idNumber: "",
            nationality: "",
            dateOfBirth: "",
            gender: "",
            expiryDate: "",
            olderThan: 0,
            ofac: [false, false, false]
        });
        lastUserData = "";
        lastUserAddress = address(0);
    }

    /**
     * @notice Expose the internal _setScope function for testing
     * @param newScope The new scope value to set
     */
    function setScope(uint256 newScope) external {
        _setScope(newScope);
    }

    function setVerificationConfig(
        SelfStructs.VerificationConfigV2 memory config
    ) external {
        verificationConfig = config;
        _identityVerificationHubV2.setVerificationConfigV2(verificationConfig);
    }

    function setVerificationConfigNoHub(
        SelfStructs.VerificationConfigV2 memory config
    ) external {
        verificationConfig = config;
    }

    function setConfigId(bytes32 configId) external {
        verificationConfigId = configId;
    }

    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier,
        bytes memory userDefinedData
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }

    /**
     * @notice Test function to simulate calling onVerificationSuccess from hub
     * @dev This function is only for testing purposes to verify access control
     * @param output The verification output
     * @param userData The user data
     */
    function testOnVerificationSuccess(
        bytes memory output,
        bytes memory userData
    ) external {
        // This should fail if called by anyone other than the hub
        onVerificationSuccess(output, userData);
    }


    /// @notice Checks if a given label is available for registration
    /// @dev Uses try-catch to handle the ERC721NonexistentToken error
    /// @param label The label to check availability for
    /// @return available True if the label can be registered, false if already taken
    function available(string calldata label , IL2Registry _registry) external view returns (bool) {
        bytes32 node = _labelToNode(label, _registry);
        uint256 tokenId = uint256(node);

        try registry.ownerOf(tokenId) {
            return false;
        } catch {
            if (label.strlen() >= 3) {
                return true;
            }
            return false;
        }
    }

    function _labelToNode(
        string memory label,
        IL2Registry _registry
    ) private view returns (bytes32) {
        return _registry.makeNode(_registry.baseNode(), label);
    }

    /// @notice Convert an address to a reverse node
/// @param addr The address to convert
/// @return The reverse node for the address
function addressToReverseNode(address addr) public pure returns (bytes32) {
    // Reverse resolution format: addr.reverse
    // This creates a node for reverse resolution
    return keccak256(abi.encodePacked(
        keccak256(abi.encodePacked(bytes32(0), keccak256("addr.reverse"))),
        keccak256(abi.encodePacked(addr))
    ));
}

/// @notice Get the node for a given address using the reverse registrar
/// @param addr The address to get the node for
/// @return The node bytes32 value
function getAddressNode(address addr) external view returns (bytes32) {
    // This would typically query the reverse registrar
    // You might need to implement this based on your specific ENS setup
    return addressToReverseNode(addr);
}


}