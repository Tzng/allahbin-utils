import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'allahbin-utils',
    footer: 'MIT Licensed | © Tzng',
    socialLinks: {
      github: 'https://github.com/Tzng/allahbin-utils',
    },
  },
  base: '/',
  publicPath: '/',
  locales: [{ id: 'zh-CN', name: '中文' }],
  favicons: ['https://avatars.githubusercontent.com/u/000000?v=4'],
});
