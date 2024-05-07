import Config from '../config'

export class DeedRepository {

    web3 = null
    account = ''
    contractInstance = null
    gas = 4476768

    constructor(){
        this.gas = Config.GAS_AMOUNT
    }
    setWeb3(web3) {
        this.web3 = web3
        this.contractInstance = new this.web3.eth.Contract(Config.DEEDREPOSITORY_ABI, Config.DEEDREPOSITORY_ADDRESS, {transactionConfirmationBlocks: 1})
    }
    
    getWeb3() {
        return this.web3
    }

    setAccount(account){
        this.account = account
    }

    getCurrentBlock() {
        return new Promise((resolve, reject ) => {
            this.web3.eth.getBlockNumber((err, blocknumber) => {
                if(!err) resolve(blocknumber)
                reject(err)
            })
        })
    }

    // getAccounts() {
    //     return new Promise((resolve, reject ) => {
    //         this.web3.eth.getAccounts((err, accounts) => {
    //             if(!err) resolve(accounts)
    //             reject(err)
    //         })
    //     })
    // }

    async watchIfCreated(cb) {
        const currentBlock = await this.getCurrentBlock()
        const eventWatcher = this.contractInstance.events.DeedRegistered({fromBlock: currentBlock - 1}, cb)
        //eventWatcher.watch(cb)
    }

    async watchIfDeedTransfered(cb) {
        const currentBlock = await this.getCurrentBlock()
        const eventWatcher = this.contractInstance.events.Transfer({fromBlock: currentBlock - 1}, cb)
        //eventWatcher.watch(cb)
    }

    exists(deedId) {
        return new Promise(async (resolve, reject) => {
            this.contractInstance.methods.exists(deedId).call( {from: this.account, gas: this.gas } ).then((error, result) => {
                if(!error) resolve(result)
                reject(error)
            })
        })
    }
	
	ownedByContract(deedId){
		return new Promise(async (resolve, reject) => {
			this.contractInstance.ownerOf(deedId).call({from: this.account, gas: this.gas}).then((error, result) => {
				if(!error) resolve(result)
				reject(error)
			})
		})
	}

    transferTo(to, deedId) {
        return new Promise(async (resolve, reject) => {
            this.contractInstance.methods.transferFrom(this.account, to, deedId).send({from: this.account, gas: this.gas }).on('receipt', (receipt) => {resolve(receipt)})
			.on('error', (error, receipt) =>{
                if(!error) resolve(receipt)
                reject(error)
            })
        })
        
    }

    create(deedId, deedURI) {
        console.log('contractinstance', this.contractInstance )
        return new Promise(async (resolve, reject) => {
            this.contractInstance.methods.registerDeed(deedId, deedURI).send({from: this.account, gas: this.gas }).on('receipt', (receipt) => {resolve(receipt)})
			.on('error', (error, receipt) => {
                if(!error) resolve(receipt)
                reject(error)
            })
        })
    }
}