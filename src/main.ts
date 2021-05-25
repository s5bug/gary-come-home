import App from './App.svelte';
import garyData from './song/gary_come_home';

const app = new App({
	target: document.body,
	props: {
		data: garyData
	}
});

export default app;