<script context="module">
	export const load = async ({ fetch, session }) => {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
			};
		}
		const res = await fetch('api/stickers');
		if (res.ok) {
			return {
				status: res.status,
				props: {
					user: session.user,
					data: await res.json()
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Could not load url`)
		};
	};
</script>

<script>
	import StickerList from '../../components/StickerList.svelte';
	import StickerContent from '../../components/StickerContent.svelte';
	import Overlay from '../../components/Overlay.svelte';
	import { currentPack, overlayOpen } from '../../store';

	export let data;
	export let user;
	$: enabledPacks = data.enabledpacks;
	$: allPacks = data.allpacks;

	let content;
	let isActive = false;

	export let mobileDragDisabledCheckbox = false;

	//enable/disable pack button
	const handleToggle = async (id) => {
		const res = await fetch('/api/stickers', {
			method: 'POST',
			body: JSON.stringify({ id: id })
		});
		if (res.ok) {
			if (content && content.id === id) isActive = !isActive;
			data = await res.json();
		}
	};

	//fetch requested pack's stickers
	const handleShowPack = async (id) => {
		if ($currentPack === id) return;
		const res = await fetch(`/api/packs/${id}`);
		if (res.ok) {
			if (enabledPacks.some((e) => e.id === id)) {
				isActive = true;
			} else isActive = false;
			content = await res.json();
		}
	};
</script>

<style>
	.container {
		display: grid;
		grid-template-columns: 190px 1fr;
		/* grid-template-rows: 60px 1fr; */
		gap: 0px 0px;
		grid-template-areas: 'header-container header-container' 'list-container content-container';
		height: 100vh;
	}
	.list-container {
		grid-area: list-container;
		overflow-y: scroll;
		background-color: rgb(248, 156, 156);
	}
	.content-container {
		grid-area: content-container;
		overflow-y: scroll;
		background-color: rgb(87, 109, 207);
	}

	.header-container {
		grid-area: header-container;
		font-size: small;
	}
	/* .outerbox {
		background: #ccffcc;
		border: 1px outset grey;
		padding: 7px;
		max-height: 60px;
	}
	.innerbox {
		text-align: center;
		border: 1px inset grey;
		padding: 0px 1em 6px 0em;
		display: grid;
		grid-template-columns: 150px 1fr 150px;
		align-items: center;
	} */
	.tempheader {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		align-items: center;
		justify-items: center;
	}

	.mobilecheckbox {
		display: none;
	}
	/* if mobile */
	@media only screen and (max-width: 600px) {
		.mobilecheckbox {
			display: inline;
		}
	}
</style>

{#if $overlayOpen}
	<Overlay id={user.id} />
{/if}

<div class="container">
	<header class="header-container">
		<div class="tempheader">
			<div class="home-container">
				<a href="/">Home</a>
			</div>
			<div class="title">
				<p on:click={() => ($overlayOpen = true)}>widget instructions</p>
				<input
					class="mobilecheckbox"
					type="checkbox"
					bind:checked={mobileDragDisabledCheckbox}
					id="disabledrag"
					name="disable drag" />
				<label for="disabledrag" class="mobilecheckbox">disable dragging</label>

			</div>
			<div class="user-container">
				{user.username}
				<br />
				<a href="/logout">Logout</a>
			</div>
		</div>

		<!-- <div class="outerbox">
			<div class="innerbox">
				<div class="home-container">
					<a href="/">Home</a>
				</div>
				<div class="title">
					<a href="" on:click={() => ($overlayOpen = true)}>widget enable instructions</a>
					（ ・∀・ ）
				</div>
				<div class="user-container">
					{user.username}
					<br />
					<a href="/logout">Logout</a>
				</div>
			</div>
		</div> -->
	</header>
	<div class="list-container">
		{#if enabledPacks && allPacks}
			<StickerList
				{allPacks}
				{enabledPacks}
				{handleToggle}
				{handleShowPack}
				canDrag={mobileDragDisabledCheckbox} />
		{/if}
	</div>

	<div class="content-container">
		{#if content}
			{#if isActive}
				<StickerContent
					stickers={content.stickers}
					isActive={true}
					canDrag={mobileDragDisabledCheckbox} />
			{:else}
				<StickerContent
					stickers={content.stickers}
					isActive={false}
					canDrag={mobileDragDisabledCheckbox} />
			{/if}
		{:else}
			<StickerContent />
		{/if}
	</div>
</div>
