// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./verifier.sol"; // ⬅️ Make sure to upload ZoKrates' verifier.sol here

contract ZKIdentityVerifier {
    Verifier private verifier;

    // Mapping of user to proof IPFS hashes
    mapping(address => string) public proofRecords;

    event Verified(address indexed user, string cid);

    constructor(address _verifierAddress) {
        verifier = Verifier(_verifierAddress);
    }

    function verifyAndRecord(
        Verifier.Proof memory proof,
        uint[1] memory input,
        string memory cid
    ) public returns (bool) {
        require(verifier.verifyTx(proof, input), "❌ Invalid proof");

        // Store the CID
        proofRecords[msg.sender] = cid;

        emit Verified(msg.sender, cid);
        return true;
    }
}
