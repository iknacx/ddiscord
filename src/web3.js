import { ethers } from 'ethers';
import { account, contract, contractAddress, contractABI } from './consts.js';

const setupWallet = async () => {
	try {
		const { ethereum } = window;
		if (!ethereum) return;

		const accounts = await ethereum.request({ method: "eth_accounts" });
		if (accounts.length !== 0) {
			account.set(accounts[0]);
			loadContract();
		} else {
			console.log("Authorized account not found!");
		}

	} catch (error) {
		console.log(error);
	}
}

export const loadContract = async () => {
	try {
		if (!ethereum) return;
		
		const provider = new ethers.providers.Web3Provider(ethereum);
		const signer = provider.getSigner();
		contract.set(new ethers.Contract(contractAddress, contractABI, signer));
	} catch (error) {
		console.error(error);
	}
}

window.addEventListener('load', setupWallet);