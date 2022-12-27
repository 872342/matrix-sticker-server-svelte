<script context="module">
	export const load = ({ session, props }) => {
		if (session.user) {
			return {
				status: 302,
				redirect: '/toggle'
			};
		}

		return { props };
	};
</script>

<script>
	import { session } from '$app/stores';
	import { send } from '$lib/api';

	export let error;

	async function login(event) {
		const formEl = event.target;
		const response = await send(formEl);

		if (response.error) {
			error = response.error;
		}
		$session.user = response.user;
		$session.id = response.id;

		formEl.reset();
	}
</script>

<style>
	.container {
		display: grid;
		justify-content: center;
		align-items: center;
		height: 100vh;
		text-align: center;
	}
	.error {
		color: tomato;
	}
	button[type='submit'] {
		margin-top: 1em;
	}
</style>

<div class="container">
	<form on:submit|preventDefault={login} method="post">
		<div>
			<!-- <label for="username">Username</label> -->
			<input id="username" name="username" type="text" required placeholder="Username" />
		</div>

		<div>
			<!-- <label for="password">Password</label> -->
			<input id="password" name="password" type="password" required placeholder="Password" />
		</div>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<button type="submit">Sign In</button>
	</form>
</div>
