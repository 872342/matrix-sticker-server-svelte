<script>
	// based on suggestions from:
	// Inclusive Components by Heydon Pickering https://inclusive-components.design/toggle-button/
	// On Designing and Building Toggle Switches by Sara Soueidan https://www.sarasoueidan.com/blog/toggle-switch-design/
	// and this example by Scott O'hara https://codepen.io/scottohara/pen/zLZwNv

	export let fontSize = 16;
	export let value;
	export let id;
	export let handleToggle = () => {};

	//let checked = true;

	function handleClick(event) {
		const target = event.target;
		const state = target.getAttribute('aria-checked');

		handleToggle(id);
		// checked = state === 'true' ? false : true;

		// value = checked === true ? 'on' : 'off';
	}
</script>

<div class="s s--slider" style="font-size:{fontSize}px">
	<button role="switch" aria-checked={value} on:click={handleClick} />
</div>

<style>
	:root {
		--accent-color: #6fd842;
		--gray: #ccc;
	}

	.s--slider {
		display: flex;
		align-items: center;
	}

	.s--slider button {
		width: 3em;
		height: 1.6em;
		position: relative;
		margin: 0 0 0 0.4em;
		background: #d65656;
		border: none;
	}

	.s--slider button::before {
		content: '';
		position: absolute;
		width: 1.3em;
		height: 1.3em;
		background: #fff;
		top: 0.13em;
		right: 1.5em;
		transition: transform 0.3s;
	}

	.s--slider button[aria-checked='true'] {
		background-color: var(--accent-color);
	}

	.s--slider button[aria-checked='true']::before {
		transform: translateX(1.3em);
		transition: transform 0.3s;
	}

	.s--slider button:focus {
		box-shadow: 0 0px 0px 1px var(--accent-color);
	}

	/* Slider Design Option */
	.s--slider button {
		border-radius: 1.5em;
		margin-right: 3px;
	}

	.s--slider button::before {
		border-radius: 100%;
	}

	.s--slider button:focus {
		box-shadow: 0 0px 8px var(--accent-color);
		border-radius: 1.5em;
	}
</style>
