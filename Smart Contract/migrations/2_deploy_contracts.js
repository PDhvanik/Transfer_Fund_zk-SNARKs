const Groth16Verifier = artifacts.require("Groth16Verifier");
const FundTransfer = artifacts.require("FundTransfer");

module.exports = async function (deployer) {
   await deployer.deploy(Groth16Verifier);
   const verifierInstance = await Groth16Verifier.deployed();

   await deployer.deploy(FundTransfer, verifierInstance.address);
};
