// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Groth16Verifier.sol";

contract FundTransfer {
    Groth16Verifier private verifier;

    struct Transaction {
        uint256 id;
        address sender;
        uint256 senderBalance;
        uint256 amount;
        string transactionId;
        string details;
    }

    mapping(uint256 => Transaction) public transactions;
    uint256 public transactionCount;

    event TransferFund(
        uint256 indexed id,
        address indexed sender,
        uint256 senderBalance,
        uint256 amount,
        string transactionId,
        string details
    );

    constructor(address _verifierAddress) {
        verifier = Groth16Verifier(_verifierAddress);
    }

    function transferFund(
        uint256 _id,
        uint256 _amount,
        string memory _transactionId,
        string memory _details,
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[1] calldata _pubSignals
    ) public {
        require(
            verifier.verifyProof(_pA, _pB, _pC, _pubSignals),
            "Invalid proof"
        );

        uint256 senderBalance = msg.sender.balance;
        transactions[transactionCount] = Transaction(
            _id,
            msg.sender,
            senderBalance,
            _amount,
            _transactionId,
            _details
        );

        emit TransferFund(_id, msg.sender, senderBalance, _amount, _transactionId, _details);
        transactionCount++;
    }

    function getTransaction(uint256 _id) public view returns (Transaction memory) {
        return transactions[_id];
    }
}
