<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export function load({ error, status }) {
		return {
			props: {
				status
			}
		};
	}
</script>

<script>
	export let status;
</script>

{#if status === 404}
	<p>404</p>
{/if}
