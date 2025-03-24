pragma circom 2.2.2;

template TransferCircuit() {
    signal input sender;
    signal input receiver;
    signal input amount;
    signal input transactionHash;
    signal output valid;

    signal intermediate1;
    signal intermediate2;

    intermediate1 <== sender * receiver;  
    intermediate2 <== intermediate1 * amount;  
    valid <== intermediate2 * transactionHash;
}

component main = TransferCircuit();
