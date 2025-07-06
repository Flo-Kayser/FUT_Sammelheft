import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter({
      pages: 'docs',
      assets: 'docs',
      fallback: 'index.html'  // 🔥 wichtig!
    }),
    paths: {
      base: '/FUT_Sammelheft'
    }
  }
};

export default config;
