import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "夸克网盘批量重命名",
        description: "夸克网盘中文件、文件夹批量重命名，后续会支持阿里云盘",
        author: "isaced",
        icon: "data:image/svg+xml;charset=UTF-8,%3c?xml version='1.0' standalone='no'?%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg class='icon' width='200px' height='200.00px' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M770.4 64H253.6C148.8 64 64 148.8 64 253.6v516.8C64 875.2 148.8 960 253.6 960h516.8c104.8 0 189.6-84.8 189.6-189.6V253.6c0-104.8-84.8-189.6-189.6-189.6zM353.8 401.8v112.6c0 54-43.8 97.8-97.8 97.8V303.8c0-26.4 21.4-47.8 47.8-47.8h308.4c0 54-43.8 97.8-97.8 97.8h-112.6c-24.6-1.2-49.2 23.2-48 48z m352.6 144h-112.6c-24.6-1.2-49.2 23.2-48 48v112.6c0 54-43.8 97.8-97.8 97.8V495.8c0-26.4 21.4-47.8 47.8-47.8h308.4c0 54-43.8 97.8-97.8 97.8z' fill='%231aaba8' /%3e%3c/svg%3e",
        homepageURL: "https://github.com/isaced/pan-naming-master",
        namespace: "https://github.com/isaced",
        match: ["https://pan.quark.cn/*"],
      },
    }),
  ],
});
