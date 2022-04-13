<script>
	import Chat from "./Chat.svelte";
	import { loadContract } from './web3.js';
	import { account } from './consts.js';

	const connectWallet = async () => {
		try {
			if (!ethereum) return;
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
			$account = accounts[0];

			loadContract();

		} catch (error) {
			console.error(error);
		}
	}


</script>

<main>
	{#if !$account}
	<div class="connect-wallet">
		<div>
			<h1>Decentralized Discord</h1>
			<p>Connect your wallet to be able to send messages on DDiscord :)</p>
			<p><b>(use rinkeby network)</b></p>
			<button class="connect-wallet-btn" on:click={connectWallet}>Connect Wallet</button>
		</div>
	</div>
	{:else}
		<Chat />
	{/if}
	
</main>

<style>
	.connect-wallet {
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: 64px;
	}

	.connect-wallet div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 600px;
	}

	.connect-wallet-btn {
		cursor: pointer;
		margin-top: 16px;
		padding: 8px;
		border: 0;
		border-radius: 5px;
		background: #506277;
		color: #FFF;
	}
</style>