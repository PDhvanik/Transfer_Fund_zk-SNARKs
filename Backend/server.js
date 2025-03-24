import dotenv from 'dotenv';
dotenv.config();
import Web3 from 'web3';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';

// Set up Web3 with Ganache RPC
const web3 = new Web3("http://127.0.0.1:7545");

// Load compiled contract ABI and address
const contractJSON = JSON.parse(fs.readFileSync("../Smart Contract/build/contracts/FundTransfer.json"));
const contractABI = contractJSON.abi;
const contractAddress =process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI, contractAddress);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get available accounts
let accounts;
web3.eth.getAccounts().then((acc) => (accounts = acc));

// API: Transfer Funds
app.post("/transfer", async (req, res) => {
   try {
      const { id, amount, transactionId, details,toAccount } = req.body;
      const sender = toAccount;

      await contract.methods
         .transferFund(id, amount, transactionId, details)
         .send({
            from: sender,
            gas: 5000000, });

      res.status(200).json({ success: true, message: "Transaction successful" });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
});
//Get all accounts address
app.get("/accounts", async (req, res) => {
   try {
      const accs = await web3.eth.getAccounts();
      res.status(200).json({ success: true, accounts: accs });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
})

// API: Get Transaction Details
app.get("/transaction/:id", async (req, res) => {
   try {
      const transaction = await contract.methods.getTransaction(req.params.id).call();
      res.status(200).json(transaction);
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
});

// Start Express server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
