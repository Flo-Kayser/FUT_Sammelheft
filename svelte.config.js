import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter({
      pages: 'docs',
      assets: 'docs',
      fallback: 'index.html'  
    }),
  
  }
};

export default config;
