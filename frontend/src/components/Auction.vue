<template>
    <div>
        <v-layout style="background: linear-gradient(to right, rgb(29, 52, 70), rgb(25, 28, 31)); padding:0px;" justify-center align-center row wrap>
            <div  style=" text-align:center; width:100%;">
                <v-layout justify-center align-center row wrap>
                    <v-flex class="pl-intro" style="height:100%;" xs12 sm12 md6>
                        <h1 class="custom-header" style="font-size: 3em; font-weight: 400;"> Auction Details</h1>
                        <!-- <h3 class="custom-header" style="font-size: 1.6em; font-weight: 100;"></h3> -->
                        <br />
                    </v-flex>
                </v-layout>
            </div>
        </v-layout>
        <v-layout wrap row v-for="auc in auction" :key="auc.id">
            <v-flex d-flex xs12 sm12 md8 style="">
                <div style="text-align:left; color:#fff; padding:20px; box-shadow: 0px 0px 13px -3px #888888; background-color: #26313d;">
                <h2><v-icon dark >receipt</v-icon> {{auc.title}} </h2>
                <v-flex d-flex xs12 sm12 md12 style="text-align:left; margin-top:7px;">
                    <h3><v-icon dark >account_circle</v-icon> <b>Auction creator: </b> {{auc.owner}}</h3>
                </v-flex>
                <v-flex d-flex xs12 sm12 md12 style="text-align:left; margin-top:7px;">
                    <h3><v-icon dark >account_balance_wallet</v-icon> <b>Starting price: </b> {{auc.startingPrice}} ETH</h3>
                </v-flex>
				<v-flex d-flex xs12 sm12 md12 style="text-align:left; margin-top:7px;">
                    <h3><v-icon dark >account_balance_wallet</v-icon> <b>Buyout price: </b> {{auc.buyoutPrice}} ETH</h3>
                </v-flex>
                <v-flex d-flex xs12 sm12 md12 style="text-align:left; margin-top:7px;">
                    <h3><v-icon dark >account_balance_wallet</v-icon> <b>Current bid: </b> {{auc.lastBidAmount}} ETH</h3>
					<h4><v-btn @click="bidHistoryModal = true" style="margin:0;">Show Bid History</v-btn></h4>
                </v-flex>
                <v-flex d-flex xs12 sm12 md12 style="text-align:left; margin-top:7px;">
                    <h3><v-icon dark >perm_identity</v-icon> <b>{{auc.bids}}</b> bids</h3>
                </v-flex>
                <v-flex d-flex xs12 sm12 md12 style="text-align:left; margin-top:7px;">
                    <h3><v-icon dark >account_circle</v-icon> Last bidder: <b>{{auc.lastBidAccount}}</b></h3>
                </v-flex>
                <v-flex d-flex xs12 sm12 md12 style="text-align:left; margin-top:7px;">
                    <h3><v-icon dark >date_range</v-icon> Expires on: <b>{{auc.expirationDate}}, {{auc.timeLeft}} remaining</b></h3>
                </v-flex>
                <v-flex d-flex xs12 sm12 md12 style="text-align:left; margin-top:7px;">
                    <h3><v-icon dark >info</v-icon>Auction status: <b>{{auctionStatus(auc)}}</b></h3>
                </v-flex>

                <!-- <v-progress-linear :value="20" height="15" color="teal"></v-progress-linear> -->
                    
                <div style="margin-top:13px;">
                    <v-btn :disabled="isAuctionOwner(auc) || !auc.active" @click="bidModal = true" style=" margin:0; width:100%;" color="teal" dark> Bid now </v-btn>
                    <span style="color:red;" v-show="isAuctionOwner(auc)">You can't bid on your own auctions!</span>
					<span style="color:red;" v-show="bidTooLow">Bid must exceed starting price or current bid!</span>
                </div>
				<div style="margin-top:13px;">
                    <v-btn :disabled="isAuctionOwner(auc) || !auc.active" @click="buyout" style=" margin:0; width:100%;" color="teal" dark> Buyout now </v-btn>
                    <span style="color:red;" v-show="isAuctionOwner(auc)">You can't buyout your own auctions!</span>
                </div>
                <div style="margin-top:13px;">
                    <v-btn @click="cancelAuction(auc.id)" :disabled="!isAuctionOwner(auc) || !auc.active" style=" margin:0; width:100%;" color="teal" dark> Cancel Auction </v-btn>
                </div>
                <div style="margin-top:13px;">
                    <v-btn @click="finalizeAuction(auc.id)" :disabled="(!isAuctionOwner(auc) && !isLastBidder(auc)) || !auc.active" style=" margin:0; width:100%;" color="teal" dark> Finalize Auction </v-btn>
                </div>
                </div>
            </v-flex>
            <v-flex d-flex xs12 sm12 md4 style="">
                <v-carousel>
                    <v-carousel-item v-bind:src="auc.image"></v-carousel-item>
                </v-carousel>
            </v-flex>

        </v-layout>
        <v-layout  style=" color: white; padding: 25px; text-align: center;     background-color: rgb(3, 46, 66);"  align-center row wrap>
            <v-flex style="height:100%; padding-bottom:20px;" xs12 sm12 md12>
                
                <h1 style="margin-bottom: 20px; line-height: 32px;">Chatroom</h1>
                <div v-show="!joined" style="width: 60%; margin: 0 auto;">
                    <v-text-field
                        v-model="identity"
                        label="Username"
                        dark
                    ></v-text-field>
                    <v-btn @click="joinRoom()" :disabled="loading" outline color="white"> <v-progress-circular v-show="loading" indeterminate v-bind:size="20" color="teal"></v-progress-circular> Join</v-btn>
                </div>
            </v-flex>
        </v-layout>
        <v-layout v-show="connected" wrap row>
            <v-flex xs12 sm3 md3>
            <v-card>
                <v-list subheader>
                <v-subheader>Users</v-subheader>
                    <v-list-tile avatar v-for="item in users" v-bind:key="item.identity">
                    <v-list-tile-avatar>
                        <v-badge  overlap color="teal">
                            <span style="background-color:#4fca21 !important;" slot="badge"></span>
                            <v-avatar
                                class=" smaller-avatar"
                            >
                                <img src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-256.png"/>
                            </v-avatar>
                        </v-badge>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="item.identity"></v-list-tile-title>
                    </v-list-tile-content>
                    </v-list-tile>
                </v-list>
                <v-divider></v-divider>
            </v-card>
            </v-flex>
            <v-flex xs12 sm9 md9>
            <v-card>
                <v-list three-line>
                    <v-subheader >Conversations</v-subheader>
                    <template v-for="(item, i) in messages">
                        <v-divider :key="i"></v-divider>
                        <v-list-tile avatar v-bind:key="item.data">
                        <v-list-tile-avatar>
                        <img src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-256.png"/>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title style="font-size:14px; color:gray;" v-html="item.identity"></v-list-tile-title>
                            <v-list-tile-sub-title style="font-size:17px; color:black;" v-html="item.data"></v-list-tile-sub-title>
                        </v-list-tile-content>
                        </v-list-tile>
                    </template>
                    <v-list-tile avatar >
                        <v-list-tile-avatar>
                            <img src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-256.png"/>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-sub-title >
                                <v-text-field
                                    id="compose"
                                    v-model="myMessage"
                                    label="Click here to type a message"
                                    @keyup.enter="sendMessage()"
                                ></v-text-field>
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
    <v-dialog v-model="loadingModal" persistent max-width="290">
        <v-card>
            <v-card-title class="headline">Please wait...</v-card-title>
            <v-card-text style="text-align: center;">
                <v-progress-circular indeterminate v-bind:size="50" color="teal"></v-progress-circular>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="bidModal" max-width="290">
        <v-card>
            <v-card-title class="headline">Bid amount</v-card-title>
            <v-card-text style="text-align: center;">
                 <v-flex  style="height:100%; padding-bottom:5px;" xs12 sm12 md12>
                    <v-text-field
                        v-model="bidPrice"
                        placeholder="e.g. 0.6"
                        label="Bid amount"
                        persistent-hint
                    ></v-text-field>
                </v-flex>
                 <v-flex  style="height:100%; padding-bottom:5px;" xs12 sm12 md12>
                    <v-btn @click="bid()" outline color="teal">Bid Now</v-btn>
                </v-flex>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
	<v-dialog v-model="bidHistoryModal" max-width="290">
        <v-card>
            <v-card-title class="headline">Bid History</v-card-title>
			<v-divider></v-divider>
			<v-list style="overflow-y: scroll">
				<v-list-tile v-for=((bid, i) in bids"
				:key="i"
				:value="bid"
				>
					<v-divider :key="i"></v-divider>
					<v-list-tile-title v-text="bid.from"></v-list-tile-title>
					<v-list-tile-sub-title v-text="bid.amount"></v-list-tile-sub-title>
				</v-list-tile>
			</v-list>
			<v-flex style="height:100%; padding-bottom:5px;" xs12 sm12 md12>
				<v-btn icon @click.native="bidHistoryModal = false" dark>
					<v-icon>close</v-icon>
					Close History
				</v-btn>
			</v-flex>
            <v-card-actions>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>

</div>
</template>
<script>
    import { AuctionRepository } from '../models/AuctionRepository'
    import moment from 'moment'
    export default {
        data: () => ({
            auction: [],
			bids: [],
            roomHex: '',
            bidPrice: null,
			buyoutPrice: null,
            bidModal: false,
			bidHistoryModal: false,
            loadingModal: true,
			bidTooLow: false,
            loading: false,
            connected: true,
            joined: false,
            identity: '',
            myMessage: '',
            messages: [],
            users: [],
        }),
        computed: {

        },
        methods: {
            convertAuctionIDtoPaddedHex(auctionId) {
                return `0x${("00000000" + auctionId.toString(16)).substr(-8)}`
            },
            isAuctionOwner(auction){
                return auction.owner.toLowerCase() == this.$root.$data.globalState.getWeb3DefaultAccount()
            },
            isLastBidder(auction){
                return auction.lastBidAccount.toLowerCase() == this.$root.$data.globalState.getWeb3DefaultAccount()
            },
            auctionStatus(auction) {
                if(auction.finalized && !auction.active) return 'Ended'
                return auction.active ? 'Active' : 'Canceled'
            },
            async bid() {
				try {
					this.bidModal = false
					this.loadingModal = true
					/*if(lastBidAmount){
						this.bidTooLow = Number(bidPrice) < Number(auction[0].lastBidAmount)
					}else{
						this.bidTooLow = Number(bidPrice) < Number(auction[0].startingPrice)
					}
					if(this.bidTooLow){
						return
					}*/
						
					this.$auctionRepoInstance.setAccount(this.$root.$data.globalState.getWeb3DefaultAccount())
					const result = await this.$auctionRepoInstance.bid(this.auction[0].id, this.bidPrice)
					this.$auctionRepoInstance.watchIfBidSuccess((error, result) => {
						 this.getAuction(this.$route.params.id)

						 this.loadingModal = false
						 this.bidTooLow = false
					})
				} catch(e){
					this.loadingModal = false
				}
            },
			async buyout(){
				try {
					this.loadingModal = true
					this.$auctionRepoInstance.setAccount(this.$root.$data.globalState.getWeb3DefaultAccount())
					const result = await this.$auctionRepoInstance.buyout(this.auction[0].id, this.auction[0].buyoutPrice)
					this.$auctionRepoInstance.watchIfBuyoutSuccess((error, result) => {
						this.getAuction(this.$route.params.id)
						this.loadingModal = false
					})
				} catch(e){
					this.loadingModal = false
				}
			},
            async cancelAuction(auctionId) {
                this.loadingModal = true
                this.$auctionRepoInstance.setAccount(this.$root.$data.globalState.getWeb3DefaultAccount())
                const result = await this.$auctionRepoInstance.cancel(auctionId)
                this.$auctionRepoInstance.watchIfCanceled((error, result) => {
                    this.loadingModal = false
                    this.getAuction(this.$route.params.id) 
                })
            },
            async finalizeAuction(auctionId) {
                this.loadingModal = true
                this.$auctionRepoInstance.setAccount(this.$root.$data.globalState.getWeb3DefaultAccount())
                const result = await this.$auctionRepoInstance.finalize(auctionId)
                this.$auctionRepoInstance.watchIfFinalized((error, result) => {
                    this.loadingModal = false
                    this.getAuction(this.$route.params.id) 
                })
            },
            async sendMessage() {
                const result = await this.$chatroomInstance.sendMessageEvent(this.identity, this.roomHex, this.myMessage)
                this.myMessage = ''

            },
            joinRoom() {
                try {
    
                    if(this.identity== '') {
                        alert('Please enter a username')
                        return
                    }
                    this.joined = true
                    this.loading = true
                    //this.$root.$data.globalState.joinChatRoom('test', this.identity) //0xffaadd11
                    
                    this.$chatroomInstance.sendJoinEvent(this.identity, this.roomHex, '')
                    this.$chatroomInstance.subscribeToTopic(this.roomHex, (data) => {
                        const payload = JSON.parse(this.$chatroomInstance.getWeb3().utils.hexToString(data.payload))
                        // check if already in users..(handle delay)
                        if (payload.type == 'join') {
                            this.users.push(payload)
                            this.connected = true
                        }
                        if (payload.type == 'msg') {
                            this.messages.push(payload)
                            this.$nextTick(function(){
                                document.getElementById("compose").scrollIntoView()
                            })
                        }
                    })
                } catch (e) {
                    this.error = e.message

                } finally {
                    this.loading = false
                }

            },
            async getAuction(auctionId) {
                    this.$auctionRepoInstance.setAccount('')
                    let bidCount = await this.$auctionRepoInstance.getBidCount(auctionId)
                    let lastBidAmount = 0, lastBidAccount = 'N/A'
                    if(bidCount > 0) {
                        const res = await this.$auctionRepoInstance.getCurrentBid(auctionId)
                        lastBidAmount = this.$auctionRepoInstance.getWeb3().utils.fromWei(web3.utils.BN(res[0]).toString(), 'ether')
                        lastBidAccount = res[1]
                    }
                    let auction = await this.$auctionRepoInstance.findById(auctionId)
                    // get metadata
                    /*const swarmResult = await this.$http.get(`${this.$config.BZZ_ENDPOINT}/bzz-list:/${auction[3]}`)
                    let imageUrl = ''
                    swarmResult.body.entries.map((entry) => {
                        if('contentType' in entry) imageUrl = `${this.$config.BZZ_ENDPOINT}/bzz-raw:/${auction[3]}/${entry.path}`
                    })*/
                    
                    let expires = new Date(Number(auction[1]) * 1000 ), now = new Date()
                    const expirationInHuman = moment.duration(moment(now).diff(expires)).humanize()

            
                    let compactAuction = [{
                        id: auctionId,
                        bids: parseInt(bidCount),
                        lastBidAmount: lastBidAmount,
                        lastBidAccount: lastBidAccount,
                        title: auction[0],
                        timeLeft: expirationInHuman,
                        expirationDate: moment(new Date(Number(auction[1]) * 1000)).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                        startingPrice: this.$auctionRepoInstance.getWeb3().utils.fromWei(web3.utils.BN(auction[2]).toString(), 'ether'),
						buyoutPrice: this.$auctionRepoInstance.getWeb3().utils.fromWei(web3.utils.BN(auction[3]).toString(), 'ether'),
                        metadata: auction[4],
                        deedId: Number(auction[5]),
                        deedRepositoryAddress: auction[6],
                        owner: auction[7],
                        active: auction[8],
                        finalized: auction[9]
                    }]
                    this.$set(this, 'auction', compactAuction)
                    this.loadingModal = false
            },
			
			/*async getBids(auctionId) {
				this.$auctionRepoInstance.setAccount('')
				let theBids = await this.$auctionRepoInstance.getBidsOnAuction(auctionId)
				this.$set(this, 'bids', theBids)
			}*/
        },
        async mounted() {
            this.roomHex = this.convertAuctionIDtoPaddedHex(parseInt(this.$route.params.id))
			//this.getAllBids(this.$route.params.id)
            this.getAuction(this.$route.params.id)
        }
    };
</script>
<style>
    .smaller-avatar {
        min-width: 0px !important;
        width: 40px !important;
        height: 40px !important;
    }
</style>