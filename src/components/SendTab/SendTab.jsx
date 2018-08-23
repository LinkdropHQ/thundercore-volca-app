import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';
import Promise from 'bluebird';
const Wallet = require('ethereumjs-wallet');
const erc20abi = require('human-standard-token-abi');

import { SpinnerOrError, Loader } from './../common/Spinner';
import web3Service from './../../services/web3Service';
import { getEtherscanLink } from './../Transfer/components';
import { signAddress } from '../../services/eth2phone/utils';
import { BYTECODE, ABI } from './abi';
import TokenDetailsBlock from './TokenDetailsBlock';
import styles from './styles';


class AirdropForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            errorMessage: "",
            buttonDisabled: false,
	    tokenAddress: '',
	    linksGenerated: false,
	    links: [],
	    masterPK: null,
	    masterAddress: null,
	    contractAddress: null,
	    creationTxHash: null,
	    step: 0,
	    claimAmount: '',
	    tokenDecimals: '',
	    linksNumber: 100,
	    claimAmountEth: 0
        };
    }

    _onSubmit() {
	this._createContract();
    }
    
    async _createContract() {
	const web3 = web3Service.getWeb3();
	
    	const gasEstimate = await web3.eth.estimateGasPromise({data: BYTECODE});
    	const AirdropContract = web3.eth.contract(ABI);

	// contract params HARDCODE
	const claimAmount = web3.toBigNumber(this.state.claimAmount).shift(this.state.tokenDecimals);
	const claimAmountEthInWei = web3.toBigNumber(this.state.claimAmountEth).shift(18);
	const ethCost = claimAmountEthInWei * this.state.linksNumber;
	
	
	const { privateKey: masterPK, address: masterAddress } = this._generateAccount();
	this.setState({
	    masterPK,
	    masterAddress
	});

	console.log({
	    tokenAddress: this.state.tokenAddress,
	    claimAmount,
	    claimAmountEthInWei,
	    masterAddress	    
	});
	
    	AirdropContract.new(this.state.tokenAddress, claimAmount, claimAmountEthInWei, masterAddress, {
    	    from: web3.eth.accounts[0],
    	    data:BYTECODE,
	    value: ethCost,
    	    gas:
	    (gasEstimate+100000)}, (err, airdropContract) => {
    		if(!err) {
    		    // NOTE: The callback will fire twice!
    		    // Once the contract has the transactionHash property set and once its deployed on an address.

    		    // e.g. check tx hash on the first call (transaction send)
    		    if(!airdropContract.address) {
    			console.log(airdropContract.transactionHash); // The hash of the transaction, which deploys the contract
			
			this.setState({
			    creationTxHash: airdropContract.transactionHash
			});
			
    			// check address on the second call (contract deployed)
    		    } else {
    			console.log(airdropContract.address); // the contract address
			this.setState({
			    contractAddress: airdropContract.address
			});
		    }
    		}
    	    });
    }


    _generateLinks() {
	const dt = Date.now();
	const n = this.state.linksNumber;
	let i = 0;
	const links = [];
	while (i < n) {	    
	    const link = this._constructLink();
	    console.log(i + " -- " + link);
	    links.push([link]);
	    i++;
	}
	const now = Date.now();
	const diff = now - dt;
	console.log({dt, diff, now});
	this.setState({
	    buttonDisabled: true,
	    linksGenerated: true,
	    links
	});
    };

    _constructLink() {
	const { address, privateKey } = this._generateAccount();
	const { v, r, s }  = signAddress({address, privateKey: this.state.masterPK});
	
	let link = `https://eth2air.io/#/r?v=${v}&r=${r}&s=${s}&pk=${privateKey.toString('hex')}&c=${this.state.contractAddress}`;
	return link;
    }
    
    _generateAccount() {
	const wallet = Wallet.generate();
	const address = wallet.getChecksumAddressString();
	const privateKey = wallet.getPrivateKey();
	return { address, privateKey };
    }


    _renderCreationTxStep() {
	if (!this.state.creationTxHash) { return null; }
	const etherscanLink = getEtherscanLink({txHash: this.state.creationTxHash, networkId: this.props.networkId});
	
	return (
	    <div> 1. Setup Tx: <a href={etherscanLink} className="link" target="_blank">{this.state.creationTxHash}</a> </div>
	);
    }


    _renderContractAddressLink() {
	if (!this.state.contractAddress) { return null; }
	const etherscanLink = getEtherscanLink({address: this.state.contractAddress, networkId: this.props.networkId});
	
	return (
	    <div>
	      <div> 2. Smart Contract created at: <a href={etherscanLink} className="link" target="_blank">{this.state.contractAddress}</a> </div>

	      <div style={{marginTop:50 }}>	      
		<div style={styles.button}>
		  <button
		     className="btn btn-default"
		     onClick={this._approveContract.bind(this)}
		     disabled={this.state.links.length > 0}
		    >
		    2. Approve Contract
		  </button>
		</div>
	      </div>
	      <hr/>
	    </div>
	);
    }
    
    
    _renderLinksGenerationStep() {
	if (!this.state.contractAddress) { return null; }
	if (!this.state.links.length > 0) {
	//     return (
	// <div> 3. Generating links... </div>
	    //     );
	    return null;
	}

	return (
	    <div> 3. Links generated:
	      <br/>
	      <div>
		<CSVLink data={this.state.links} filename="airdrop-links.csv" className="btn btn-primary">
		  3. Download Links (CSV)
		</CSVLink>
	      </div>
	    </div>
	);
    }

    _getToken(tokenAddress) {
	const web3 = web3Service.getWeb3();
        const instance = web3.eth.contract(erc20abi).at(tokenAddress);
	Promise.promisifyAll(instance, { suffix: 'Promise' });
	return instance;
    }

    _approveContract() {
	//
	const web3 = web3Service.getWeb3();
	const token = this._getToken(this.state.tokenAddress);
	token.approve(this.state.contractAddress, 10e30, { from: web3.eth.accounts[0] }, (err, txHash) => {
	    if (err) console.error(err);

	    if (txHash) {
		console.log('Approve Transaction sent');
		console.dir(txHash);

		this._generateLinks();
	    }
	});
    }
    
 
    _renderForm() {
	const component = this;
        return (
            <Row>
	      <Col sm={8} smOffset={2}>
		<div style={styles.formContainer}>

		  <TokenDetailsBlock {...this.state}
				     updateForm={(props) => component.setState({...props})}		    
		     />
		  
		    <div style={styles.button}>
		      <button
			 className="btn btn-default"
			 onClick={this._onSubmit.bind(this)}
			 disabled={this.state.creationTxHash}		   
			 >
			
		    1. Deploy AirDrop Contract
		  </button>
		</div>
		<hr/>		
		<div style={{marginTop:50 }}>
		  { this._renderCreationTxStep() }
		  { this._renderContractAddressLink() }
		  { this._renderLinksGenerationStep() }
		</div>


		<SpinnerOrError fetching={this.state.fetching} error={this.state.errorMessage}/>		    
		</div>		
	      </Col>
            </Row>

        );
    }

    render() {
	return (
	    <div style={{paddingBottom: 100}}>
	      { this._renderForm() }
	    </div>
	);
    }
}


export default connect(state => ({
    networkId: state.web3Data.networkId,
    balanceUnformatted: state.web3Data.balance
}))(AirdropForm);
