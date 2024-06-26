import Vue from 'vue'
import App from './App'
import Config from './config'
import router from './router'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import { ChatRoom } from './models/ChatRoom'
import { DeedRepository } from './models/DeedRepository'
import { AuctionRepository } from './models/AuctionRepository'

// rename to avoid conflict between metamask
// will be used for whisper v5/6
var Web3_1 = require('web3')

Vue.use(VueResource)
Vue.use(Vuetify)
Vue.config.productionTip = false

// state management
var store = {
    debug: true,
    state: {
        // metamask state variable
        metamask: {
            web3DefaultAccount: '',
            metamaskInstalled: false,
            networkId: '',
        },

        // local web3 instance(not metamask)
        web3 : null,

    },
    networkReady() {
        return this.getNetworkId() != '' && this.getMetamaskInstalled() && this.getWeb3DefaultAccount() != ''
    },
    setNetworkId(networkId) {
        this.state.metamask.networkId = networkId
    },
    getNetworkId() {
        return this.state.metamask.networkId
    },

    setWeb3DefaultAccount(account) {
        this.state.metamask.web3DefaultAccount = account
    },
    getWeb3DefaultAccount() {
        return this.state.metamask.web3DefaultAccount
    },

    setMetamaskInstalled(){
        this.state.metamask.metamaskInstalled = true
    },
    getMetamaskInstalled(){
        return this.state.metamask.metamaskInstalled
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}


Vue.mixin({
    created: async function () {
        // Inject the models to components
        //this.$chatroomInstance = new ChatRoom()
        this.$deedRepoInstance = new DeedRepository()
        this.$auctionRepoInstance = new AuctionRepository()
        
        //this.$chatroomInstance.setWeb3(new Web3_1(Config.SHH_ENDPOINT))

        // one instance of web3 available to all components
        if (typeof web3 !== 'undefined') {
            web3 = new Web3_1(window.ethereum)
            this.$auctionRepoInstance.setWeb3(web3)
            this.$deedRepoInstance.setWeb3(web3)

            store.setMetamaskInstalled()
            web3.eth.net.getId((err, netId) => {
                store.setNetworkId(netId)
            })
            // Corrected account polling to web3 1.0
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
			if(accounts.length > 0){
				const account = accounts[0]
				store.setWeb3DefaultAccount(account)
			}
			window.ethereum.on('accountsChanged', (accounts) => {
				if(accounts.length > 0){
					store.setWeb3DefaultAccount(accounts[0])
				}
			})
        }
        // inject config to components
        this.$config = Config
    }
})


new Vue({
    el: '#app',
    data: {
        globalState: store,
    },
    router,
    template: '<App/>',
    components: { App },
    mounted() {

    }
})
