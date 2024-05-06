module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 3000000
    }
  },
  
  solc: {
	  version: "0.4.21",
	  optimizer: {
		  enabled: true,
		  runs: 200
	  }
  }
};
