import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import { remarkCodeHike } from "@code-hike/mdx";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { vercelPreset } from "@vercel/remix/vite";

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        [
          remarkCodeHike,
          {
            theme: "material-palenight",
            showCopyButton: true,
            lineNumbers: false,
            autoLink: true,
          },
        ],
      ],
    }),
    remix({ presets: [vercelPreset()] }),
    tsconfigPaths(),
  ],
  server: {
    fs: {
      // Restrict files that could be served by Vite's dev server.  Accessing
      // files outside this directory list that aren't imported from an allowed
      // file will result in a 403.  Both directories and files can be provided.
      // If you're comfortable with Vite's dev server making any file within the
      // project root available, you can remove this option.  See more:
      // https://vitejs.dev/config/server-options.html#server-fs-allow
      allow: ["app", "node_modules/@code-hike/mdx/dist/index.css"],
    },
  },
});
