// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FundTransfer {
    struct Transaction {
        uint256 id;
        address sender;
        address receiver; // Added receiver
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
        address indexed receiver,
        uint256 senderBalance,
        uint256 amount,
        string transactionId,
        string details
    );

    function transferFund(
        uint256 _id,
        address payable _receiver, // Added receiver as function parameter
        uint256 _amount,
        string memory _transactionId,
        string memory _details
    ) public payable {
        require(_amount > 0, "Amount must be greater than zero");
        require(msg.value == _amount, "Sent value must match amount");
        require(_receiver != address(0), "Invalid receiver address");

        uint256 senderBalance = address(msg.sender).balance;

        // Transfer funds to the receiver
        _receiver.transfer(_amount);

        // Store transaction details
        transactions[transactionCount] = Transaction(
            _id,
            msg.sender,
            _receiver,
            senderBalance,
            _amount,
            _transactionId,
            _details
        );

        emit TransferFund(_id, msg.sender, _receiver, senderBalance, _amount, _transactionId, _details);
        transactionCount++;
    }

    function getTransaction(uint256 _id) public view returns (Transaction memory) {
        return transactions[_id];
    }
}
