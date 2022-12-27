<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import Switch from '../components/Switch.svelte';
	import { currentPack, currentPackList } from '../store';
	export let handleToggle = () => {};
	export let handleShowPack = () => {};
	export let allPacks;
	export let enabledPacks;

	export let canDrag = false;

	$: newEnabled = enabledPacks.map((v) => {
		return { ...v, isActive: true };
	});
	let newAll;
	$: {
		newAll = allPacks.filter((el) => !enabledPacks.some((e) => e.id === el.id));
		newAll = newAll.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
	}

	const postNewOrder = async (order) => {
		if ($currentPackList.toString() === order.toString()) return;

		await fetch('/api/packs/packorder', {
			method: 'POST',
			body: JSON.stringify({ order: order })
		});
	};

	//css class to highlight current pack in list
	let selected = '';

	const flipDurationMs = 100;
	function handleDndConsider(e) {
		newEnabled = e.detail.items;
	}
	function handleDndFinalize(e) {
		newEnabled = e.detail.items;
		let newOrder = [];
		for (let enabled of newEnabled) {
			newOrder.push(enabled.id);
		}
		postNewOrder(newOrder);
		$currentPackList = newOrder;
	}
</script>

<style>
	.entry {
		border: 2px solid #515151;
		border-radius: 5px;
		margin-top: 5px;
		margin-left: 5px;
		margin-right: 3px;
		background: #d8d8d8;
		height: 2em;
		align-items: center;
		overflow: hidden;
		max-width: 190px;
		font-size: small;
		display: grid;
		/* grid-template-columns: 175px; */
		justify-content: space-between;
		grid-template-columns: 1fr;
		gap: 0px 0px;
		grid-template-areas: 'text switch';
	}
	.entry span {
		user-select: none;
	}
	.text {
		padding-left: 0.4em;
		overflow: hidden;
		/* align-items: center;
		display: flex; */
		cursor: pointer;
		width: 100%;
	}
	.selected {
		background: white;
	}
</style>

{#if newEnabled && newAll}
	<div
		class="container"
		use:dndzone={{ items: newEnabled, flipDurationMs, dragDisabled: canDrag }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}>
		{#each newEnabled as e (e.id)}
			<div
				class="entry"
				class:selected={selected === e.id}
				animate:flip={{ duration: flipDurationMs }}>
				<div
					class="text"
					on:click={() => {
						selected = e.id;
						handleShowPack(e.id);
						$currentPack = e.id;
					}}>
					<span>{e.name}</span>
				</div>
				<Switch bind:value={e.isActive} {handleToggle} id={e.id} />
			</div>
		{/each}
	</div>

	<div class="other">
		{#each newAll as e (e.id)}
			<div class="entry" class:selected={selected === e.id}>
				<div
					class="text"
					on:click={() => {
						selected = e.id;
						handleShowPack(e.id);
						$currentPack = e.id;
					}}>
					<span>{e.name}</span>
				</div>
				<Switch bind:value={e.isActive} {handleToggle} id={e.id} />
			</div>
		{/each}
	</div>
{/if}
