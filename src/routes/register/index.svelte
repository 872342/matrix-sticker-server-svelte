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
	import { goto } from '$app/navigation';
	import { send } from '$lib/api';

	export let error;
	export let success;
	async function register(event) {
		error = '';

		const formEl = event.target;
		const response = await send(formEl);

		if (response.error) {
			error = response.error;
		}

		if (response.success) {
			await goto('/login');
			success = response.success;
		}

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
	<form on:submit|preventDefault={register} method="post">
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

		<button type="submit">Sign Up</button>
	</form>

</div>
