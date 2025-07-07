// svelte.config.js
import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

export default {
  kit: {
    adapter: vercel(),
  },
  preprocess: preprocess()
};
