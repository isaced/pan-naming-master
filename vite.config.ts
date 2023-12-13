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
        name: "夸克/阿里网盘批量重命名",
        description: "夸克/阿里网盘中文件、文件夹批量重命名",
        author: "isaced",
        license: "MIT",
        icon:
          "https://raw.githubusercontent.com/isaced/pan-naming-master/main/logo.svg",
        homepageURL: "https://github.com/isaced/pan-naming-master",
        namespace: "https://github.com/isaced",
        match: [
          "https://pan.quark.cn/*",
          "https://www.aliyundrive.com/drive/file/*",
          "https://www.alipan.com/drive/file/*",
        ],
        grant: [
          "unsafeWindow",
        ],
        "run-at": "document-body",
      },
    }),
  ],
});
