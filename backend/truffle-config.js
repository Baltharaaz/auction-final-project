const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
//const mnemonic = fs.readFileSync("mnemonic.secret").toString().trim();
//const api = fs.readFileSync("api.skey").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 3000000
    },
	
	sepolia: {
		provider: () => new HDWalletProvider(mnemonic, "https://sepolia.infura.io/v3/" + api),
		network_id: 11155111, // Sepolia's network ID
		skipDryRun: true,
		networkCheckTimeout: 120000,
		timeoutBlocks: 20000,
		disableConfirmationListener: true,
	 },
	 
	 goerli: {
		 provider: () => new HDWalletProvider(mnemonic, "https://goerli.infura.io/v3/" + api),
		network_id: 5, // Goerli network ID
		skipDryRun: true,
		networkCheckTimeout: 120000,
		timeoutBlocks: 20000,
		disableConfirmationListener: true,
	 },
	 
	 mainnet: {
		 provider: () => new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/" + api),
		network_id: 1, // ETH mainnet id
		skipDryRun: true,
		networkCheckTimeout: 120000,
		timeoutBlocks: 20000,
		disableConfirmationListener: true,
	 },
  },
  
  
};
