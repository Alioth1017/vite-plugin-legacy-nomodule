/* eslint-disable node/no-extraneous-import */
import type { Plugin } from "vite";
import { replaceAll } from "./util";
import type { Options } from "./types";

function viteLegacyPatchPlugin(options: Options = {}): Plugin[] {
  let nomodule: Options["nomodule"];

  const legacyPatchPostPlugin: Plugin = {
    name: "vite:legacy-patch-post-process",
    enforce: "post",
    apply: "build",
    transformIndexHtml(html) {
      if (nomodule === false) {
        return html;
      }
      const deleteValues: Array<string | RegExp> = [
        ` type="module" crossorigin`,
        ` rel="modulepreload" crossorigin`,
        ` nomodule crossorigin`,
        `<script type="module">try{import.meta.url;import("_").catch(()=>1);}catch(e){}window.__vite_is_modern_browser=true;</script>`,
        `<script type="module">!function(){if(window.__vite_is_modern_browser)return;console.warn("vite: loading legacy build because dynamic import or import.meta.url is unsupported, syntax error above should be ignored");var e=document.getElementById("vite-legacy-polyfill"),n=document.createElement("script");n.src=e.src,n.onload=function(){System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))},document.body.appendChild(n)}();</script>`,
        `<script nomodule>!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",(function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()}),!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();</script>`,
        `System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))`,
        /<script src="\.\/assets\/index\..+\.js"><\/script>/,
      ];
      return (
        deleteValues.reduce(
          (str, searchValue) => replaceAll(str as string, searchValue, ""),
          html
        ) as string
      ).replace(`data-src`, "src");
    },
  };
  return [legacyPatchPostPlugin];
}

export default viteLegacyPatchPlugin;
