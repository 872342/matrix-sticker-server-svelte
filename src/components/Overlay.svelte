<script>
	import { page } from '$app/stores';
	export let id;
	import Highlight from 'svelte-highlight';
	import json from 'svelte-highlight/languages/json';
	import agate from 'svelte-highlight/styles/atelier-forest';
	import { overlayOpen } from '../store';

	const code = `{
  "stickerpicker": {
    "content": {
      "type": "m.stickerpicker",
      "url": "https://${$page.url.host}/sticker-widget/?user=${id}&theme=$theme",
      "name": "Stickerpicker",
      "data": {}
    },
    "sender": "@you:matrix.server.name",
    "state_key": "stickerpicker",
    "type": "m.widget",
    "id": "stickerpicker"
  }
}`;
	let copied = '';
</script>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		height: 100vh;
		width: 100vw;
		z-index: 100;
		background: #0000008c;
	}
	.content {
		background-color: #c1d1d1;
		border-radius: 26px;
		text-align: left;
		padding: 1em 25px;
		position: relative;
		max-width: 85vw;
	}
	.content h3 {
		text-align: center;
		text-decoration-line: underline;
	}
	.content ol {
		margin-top: 1em;
	}
	.content ol,
	.content ol li,
	.content p {
		margin-top: 1em;
	}
	.content p {
		text-align: right;
	}
	.content .copy {
		margin-top: 0.5em;
	}
	.content .copy-text {
		display: inline;
	}
	.content .close {
		border-radius: 25px;
		width: 25px;
		height: 25px;
		position: absolute;
		top: 1em;
		right: 1.5em;
		color: inherit;
		cursor: pointer;
		border: 1px solid #0000009c;
	}
</style>

<svelte:head>
	{@html agate}
</svelte:head>

<div class="container">
	<div class="content">
		<button
			class="close"
			on:click={() => {
				$overlayOpen = false;
			}}>
			&times;
		</button>
		<h3>How to enable the sticker widget</h3>
		<ol>
			<li>
				Send:
				<strong>/devtools</strong>
				in the chat
			</li>
			<li>
				Click
				<strong>Explore Account Data</strong>
			</li>
			<li>Click m.widgets</li>
			<li>Click Edit and paste the following into Event Content</li>
			<div class="code">

				<Highlight language={json} {code} />
			</div>
			<button
				class="copy"
				on:click={() => {
					navigator.clipboard.writeText(code).then( function () {
							copied = 'code copied to clipboard';
						}, function () {
							copied = 'failed to copy';
						} );
				}}>
				copy code
			</button>
			<p class="copy-text">{copied}</p>
			<li>Restart Element/Schildi</li>
		</ol>
		<p>Not so difficult is it?</p>
	</div>
</div>
