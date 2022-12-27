<script>
	import { session } from '$app/stores';
	import '../global.css';
</script>

<svelte:head>
	<title>stickerssss</title>
</svelte:head>

<!-- <nav>

	{#if !$session.user}
		<a href="/auth/login">Login</a>
		<a href="/auth/register">Register</a>
	{/if}

	{#if $session.user}
		<a href="/protected">Admin</a>
		<a href="/auth/logout">Log out</a>
	{/if}
</nav> -->

<slot />
