<script>
	import { onMount } from 'svelte';

	export let width = document.body.clientWidth - 100;
	export let transitionDuration = 0.1;

	let date = new Date();
	let clockTick;
	let stopwatchTick;
	let paused = false;
	let mode = 'clock';
	let timerSeconds = 0;

	$: seconds = mode === 'clock' ? date.getSeconds() : timerSeconds;
	$: minutes = mode === 'clock' ? date.getMinutes() : timerSeconds / 60;
	$: hours   = mode === 'clock' ? date.getHours() : timerSeconds / (60 * 60);

	onMount(() => {
		clockTick = setInterval(() => {
			date = new Date();

			// Hack for second hand to continue moving clockwise
			if (mode === 'clock' && date.getSeconds() === 0 || mode === 'timer' && timerSeconds > 0 && timerSeconds % 59 === 0) {
				transitionDuration = 0;
			} else if (transitionDuration === 0) {
				transitionDuration = 0.1;
			}
		}, 1000);

		window.addEventListener('resize', () => width = document.body.clientWidth - 100);
	});

	function resetStopwatch() {
		clearInterval(stopwatchTick);
		timerSeconds = 0;
		stopwatchTick = null;
		paused = false;
	}

	function pauseStopwatch() {
		clearInterval(stopwatchTick);
		paused = true;
	}

	function startStopwatch() {
		mode = 'timer';

		if (stopwatchTick && !paused) {
			resetStopwatch();
			startStopwatch();
		} else {
			stopwatchTick = setInterval(() => timerSeconds += 1, 1000);
			paused = false;
		}
	}

	function switchMode() {
		mode = mode === 'timer' ? 'clock' : 'timer';
	}
</script>

<style>
	#clock {
		border: #0A5551 solid 10px;
		border-radius: 50%;
		height: var(--diameter);
		width: var(--diameter);
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	#clock-container {
		height: 100vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	#stopwatch-controls {
		position: relative;
		z-index: 100;
		top: 60px;
	}
	span {
		cursor: pointer;
		font-size: 1.8em;
		margin: 0 2px;
	}
	.hand {
		height: var(--diameter);
		transform: translateX(var(--radius)) translateY(0px) rotate(var(--rotate-var));
		transition: all var(--transition-duration) ease-out;
		position: absolute;
	}
	#second {
		background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0) 8%,  #CF007F 5%, #CF007F 50%, rgba(0,0,0,0) 50%);
		width: 4px;
		left: -2px;
	}
	#minute {
		background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0) 15%, #0A5551 15%, #0A5551 50%, rgba(0,0,0,0) 50%);
		width: 6px;
		left: -3px;
	}
	#hour {
		background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0) 35%, #003026 35%, #003026 50%, rgba(0,0,0,0) 50%);
		width: 8px;
		left: -4px;
	}
	#center {
		content: ' ';
		display: block;
		background: #003026;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		z-index: 10;
	}
	.tick {
		background: linear-gradient(to bottom, #0A5551, #0A5551 var(--inner-radius), rgba(0,0,0,0) var(--inner-radius), rgba(0,0,0,0) var(--outer-radius), #0A5551 var(--outer-radius));
		height: calc(var(--diameter) + 40px);
		transform: translateX(var(--radius)) translateY(0px) rotate(var(--rotate-var));
		position: absolute;
		width: 4px;
		left: -2px;
	}
	footer {
		position: absolute;
		bottom: 0;
		padding: 4px;
		font-family: Arial, Helvetica, sans-serif;
		right: 30px;
		overflow: hidden;
	}
	a {
		color: #209077;
		text-decoration: none
	}
	a:visited, a:hover {
		color: #209077;
		text-decoration: none;
	}
</style>

<div id="clock-container" style="--diameter: {width / 2}px; --radius: {width / 4}px; --transition-duration: {transitionDuration}s">
	<div id="stopwatch-controls">
		<span on:click={startStopwatch}>▶️</span>
		<span on:click={pauseStopwatch}>⏸</span>
		<span on:click={resetStopwatch}>🔄</span>
		<span on:click={switchMode}>🔀</span>
	</div>
	<div id="clock">
		<div id="second" class="hand" style="--rotate-var: {(seconds % 60) * 6}deg" />
		<div id="minute" class="hand" style="--rotate-var: {(minutes + seconds / 60) * 6}deg" />
		<div id="hour" class="hand" style="--rotate-var: {(hours + minutes / 60) * 30}deg" />
		<div id="center" />
		{#each [...Array(60).keys()] as tick, i}
			<div class="tick" style="--rotate-var: {tick * 6}deg; --outer-radius: {i % 5 === 0 ? 98 : 96}%; --inner-radius: {i % 5 === 0 ? 6 : 2}%" />
		{/each}
	</div>
</div>
<footer>
	<p>
		Created with 💚 by <a href="https://bryce.io">bryce</a> in <a href="https://svelte.dev/">Svelte</a>. View <a href="https://github.com/brycedorn/svelte-clock">source</a>.
	</p>
</footer>
