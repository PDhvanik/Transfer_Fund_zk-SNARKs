// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FundTransfer {
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

    function transferFund(
        uint256 _id,
        uint256 _amount,
        string memory _transactionId,
        string memory _details
    ) public {
        require(_amount > 0, "Amount must be greater than zero");

        uint256 senderBalance = address(msg.sender).balance;
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
