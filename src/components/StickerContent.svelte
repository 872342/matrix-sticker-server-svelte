<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	export let stickers = [];
	export let isActive = false;

	export let canDrag = false;

	const HOMESERVER_URL = 'https://matrix-client.matrix.org';
	const makeThumbnailURL = (mxc) =>
		`${HOMESERVER_URL}/_matrix/media/r0/thumbnail/${mxc.substr(
			6
		)}?height=128&width=128&method=scale`;
	const makeURL = (mxc) => `${HOMESERVER_URL}/_matrix/media/r0/download/${mxc.substr(6)}`;
	const makeImage = (content) => {
		let x = content.info.mimetype.split('/')[1];
		if (x === 'gif') return makeURL(content.url);
		else return makeThumbnailURL(content.url);
	};

	const postNewOrder = async (order) => {
		await fetch('/api/packs/order', {
			method: 'POST',
			body: JSON.stringify({ id: stickers[0].packid, order: order })
		});
	};

	const flipDurationMs = 100;
	function handleDndConsider(e) {
		stickers = e.detail.items;
	}
	function handleDndFinalize(e) {
		stickers = e.detail.items;
		let newOrder = [];
		for (let sticker of stickers) {
			newOrder.push(sticker.position);
		}
		postNewOrder(newOrder);
	}
</script>

<style>
	.container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 5px;
	}
	.imgcontainer {
		margin: 0.5rem;
		width: 150px;
		height: 150px;
		border: 2px solid;
		display: inline-block;
		box-shadow: 5px 5px 0 0 rgb(0 0 0 / 44%);
		transition: 1s;
		overflow: hidden;
		background-color: #707070;
		background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
			linear-gradient(-45deg, #808080 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #808080 75%),
			linear-gradient(-45deg, transparent 75%, #808080 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
	}
	.imgcontainer img {
		object-fit: cover;
		width: 150px;
		height: 150px;
	}
	.imgcontainer img:hover {
		object-fit: contain;
	}

	/* if mobile */
	@media only screen and (max-width: 600px) {
		.imgcontainer img {
			width: 64px;
			height: 64px;
		}
		.imgcontainer {
			margin: 0.1rem;
			width: 64px;
			height: 64px;
		}
		.container {
			grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
			gap: 2px;
		}
	}
</style>

{#if stickers}
	{#if isActive}
		<div
			class="container"
			use:dndzone={{ items: stickers, flipDurationMs, dragDisabled: canDrag }}
			on:consider={handleDndConsider}
			on:finalize={handleDndFinalize}>

			{#each stickers as item (item.id)}
				<div class="imgcontainer" animate:flip={{ duration: flipDurationMs }}>
					<img src={makeImage(item)} alt="" />
				</div>
			{/each}
		</div>
	{:else}
		<div class="container">
			{#each stickers as item (item.id)}
				<div class="imgcontainer">
					<img src={makeImage(item)} alt="" />
				</div>
			{/each}
		</div>
	{/if}
{/if}
