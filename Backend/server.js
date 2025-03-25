import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import * as snarkjs from "snarkjs";
import Web3 from "web3";
dotenv.config();

// Set up Web3 with Ganache RPC
const web3 = new Web3("http://127.0.0.1:8545");

// Load compiled contract ABI and address
const contractJSON = JSON.parse(
   fs.readFileSync("../Smart Contract/build/contracts/FundTransfer.json")
);
const contractABI = contractJSON.abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI, contractAddress);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get available accounts
let accounts;
web3.eth.getAccounts().then((acc) => (accounts = acc));

/**
 * Generate proof using snarkjs
 * @param {Object} input - Circuit input
 * @returns {Promise<Object>} - Proof and public signals
 */
async function generateProof(input) {
   const circuitWasmPath = "../Circom/transfer_js/transfer.wasm";
   const provingKeyPath = "../Circom/zkey/phase2_circuit_prover_groth16.zkey";

   try {
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
         input,
         circuitWasmPath,
         provingKeyPath
      );
      console.log(proof, publicSignals);
      return {
         proof: {
            pA: [proof.pi_a[0], proof.pi_a[1]],
            pB: [
               [proof.pi_b[0][0], proof.pi_b[0][1]],
               [proof.pi_b[1][0], proof.pi_b[1][1]],
            ],
            pC: [proof.pi_c[0], proof.pi_c[1]],
         },
         pubSignals: publicSignals.map((sig) => sig.toString()),
      };
   } catch (error) {
      console.error("Proof generation failed:", error);
      throw new Error("Proof generation failed");
   }
}

// API: Transfer Funds with ZK Proof
app.post("/transfer", async (req, res) => {
   try {
      const { id, amount, transactionId, details, fromAccount } = req.body;

      if (!id || !amount || !transactionId || !details || !fromAccount) {
         return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      const sender = fromAccount;

      // Generate proof
      const proofData = await generateProof({
         sender: sender,
         receiver: fromAccount,
         amount: amount,
         transactionHash: transactionId
      });

      // Send transaction with proof
      await contract.methods
         .transferFund(
            id,
            amount,
            transactionId,
            details,
            proofData.proof.pA,
            proofData.proof.pB,
            proofData.proof.pC,
            proofData.pubSignals
         )
         .send({
            from: sender,
            gas: 7000000,
         }).on("error", (error) => {
            console.error("Smart contract execution error:", error);
         });;

      res.status(200).json({ success: true, message: "Transaction successful" });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
});

// Get all accounts address
app.get("/accounts", async (req, res) => {
   try {
      const accs = await web3.eth.getAccounts();
      res.status(200).json({ success: true, accounts: accs });
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
});

// API: Get Transaction Details
app.get("/transaction/:id", async (req, res) => {
   try {
      const transaction = await contract.methods.getTransaction(req.params.id).call();

      if (!transaction.sender) {
         return res.status(404).json({ success: false, error: "Transaction not found" });
      }

      // Convert BigInt values to string
      const formattedTransaction = {
         id: transaction.id.toString(),
         sender: transaction.sender,
         senderBalance: transaction.senderBalance.toString(),
         amount: transaction.amount.toString(),
         transactionId: transaction.transactionId,
         details: transaction.details,
      };

      res.status(200).json(formattedTransaction);
   } catch (error) {
      res.status(500).json({ success: false, error: error.message });
   }
});

// Start Express server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
