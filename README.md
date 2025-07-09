# Transfer_Fund_zk-SNARKs

**Brief Summary:**
This project enables privacy-preserving fund transfers using zk-SNARKs. Users initiate transfers via a web interface; the backend generates a zero-knowledge proof for the transaction using Circom and snarkjs, then submits the proof and transaction data to an Ethereum smart contract. The contract verifies the proof and, if valid, records the transaction securely and privately on-chain.

---

## File & Directory Details

### Backend/

- **server.js**: Node.js/Express server. Handles API requests for fund transfers, generates zk-SNARK proofs using snarkjs, and interacts with the Ethereum smart contract via web3. Exposes endpoints for transferring funds and listing accounts.
- **package.json**: Lists backend dependencies (express, snarkjs, web3, etc.) and scripts.

### Frontend/

- **index.html**: User interface for initiating fund transfers. Contains a form for entering transfer details and selecting accounts. Loads accounts from the backend and submits transfer requests.
- **script.js**: Handles frontend logic. Fetches available accounts, sends transfer requests to the backend, and displays results to the user.

### Smart Contract/

- **contracts/FundTransfer.sol**: Main contract for recording fund transfers. Verifies zk-SNARK proofs using the Groth16 verifier before recording a transaction. Stores transaction details and emits events.
- **contracts/Groth16Verifier.sol**: Solidity contract implementing the Groth16 zk-SNARK proof verification logic.
- **migrations/2_deploy_contracts.js**: Truffle migration script to deploy the verifier and fund transfer contracts.
- **truffle-config.js**: Truffle configuration for local/testnet deployment.

### Circom/

- **transfer.circom**: Circom circuit defining the logic for a valid fund transfer. Takes sender, receiver, amount, and transaction hash as inputs and outputs a validity signal.
- **input.json**: Example input for the circuit (sender, receiver, amount, transactionHash).
- **transfer_js/**: Contains WASM and JS files for witness generation (used by snarkjs and backend).
  - **generate_witness.js**: Script for generating circuit witnesses.
  - **transfer.wasm**: Compiled WASM version of the circuit.
  - **witness_calculator.js**: JS utility for witness calculation.
- **zkey/**, **powersoftau/**, **phase2/**: Trusted setup and proving/verification key files for Groth16 (used in proof generation and verification).
- **transfer_proof_groth16.json**: Example proof output.
- **verification_key_groth16.json**: Verification key for on-chain proof verification.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Directory Structure](#directory-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Smart Contract](#smart-contract)
- [zk-SNARKs & Circom](#zk-snarks--circom)
- [Usage](#usage)
- [Acknowledgements](#acknowledgements)

---

## Project Overview

This project implements a privacy-focused fund transfer system using zk-SNARKs. It consists of a backend server, a frontend interface, and Ethereum smart contracts. The zero-knowledge proofs are generated using Circom circuits and verified on-chain.

---

## Directory Structure

```
Transfer_Fund_zk-SNARKs/
├── Backend/                # Node.js backend server
├── Circom/                 # Circom circuits, proofs, and trusted setup files
├── Frontend/               # Frontend web interface
└── Smart Contract/         # Ethereum smart contracts (Truffle)
```

### Details

- **Backend/**: Express server for API endpoints and proof management.
- **Circom/**: Contains `.circom` files, trusted setup artifacts, witness/proof generation scripts, and output files.
- **Frontend/**: Simple HTML/JS frontend for user interaction.
- **Smart Contract/**: Solidity contracts, Truffle migrations, and config.

---

## Setup Instructions

### Prerequisites

- Node.js (v14+ recommended)
- npm
- Truffle
- Ganache (or another local Ethereum node)
- Circom & snarkjs (for proof generation)

### 1. Backend

```
cd Backend
npm install
node server.js
```

### 2. Frontend

Open `Frontend/index.html` in your browser. (You may need to serve it via a local server for some features.)

### 3. Smart Contract

```
cd "Smart Contract"
npm install
truffle compile
truffle migrate --network development
```

Configure `truffle-config.js` as needed for your local or testnet environment.

### 4. Circom & zk-SNARKs

- Circuits and trusted setup are in `Circom/`.
- To generate witnesses/proofs, use scripts in `Circom/transfer_js/` and follow the workflow in the comments or documentation.
- Example input: `Circom/input.json`

---

## zk-SNARKs & Circom

- **transfer.circom**: Main circuit for fund transfer logic.
- **transfer_js/**: Contains WASM and JS for witness generation.
- **.zkey/.ptau**: Trusted setup files for Groth16.
- **transfer_proof_groth16.json**: Example proof output.
- **verification_key_groth16.json**: Verification key for on-chain verification.

For more on Circom and snarkjs, see [https://docs.circom.io/](https://docs.circom.io/).

---

## Usage

1. Generate a witness and proof using Circom and snarkjs.
2. Deploy contracts with Truffle.
3. Use the frontend to initiate a transfer, which will:
   - Generate a proof
   - Send the proof to the backend
   - Backend relays the proof to the smart contract for verification
4. If the proof is valid, the transfer is executed on-chain.

---

## Acknowledgements

- [Circom](https://github.com/iden3/circom)
- [snarkjs](https://github.com/iden3/snarkjs)
- [Truffle Suite](https://www.trufflesuite.com/)

---

Feel free to contribute or open issues for improvements!
