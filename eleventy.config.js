import { readFileSync, cpSync, constants } from "node:fs";
import { dirname, join, isAbsolute } from "node:path";
import { parse } from "ini";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { EleventyRenderPlugin, IdAttributePlugin } from "@11ty/eleventy";
import { DateTime } from "luxon";
import { optimize } from "svgo";
import CleanCSS from "clean-css";
import EleventyPluginOgImage from "eleventy-plugin-og-image";

export default async function (eleventyConfig) {
  eleventyConfig.htmlTransformer.addPosthtmlPlugin("html", (ctx) => (tree) => {
    if (ctx.inputPath.startsWith("./blog")) {
      tree.match({ tag: "pre" }, (node) => {
        const lang = /language-(\w+)/.exec(node.attrs.class);
        if (lang === null || node._ignore) return node;
        node._ignore = true;
        return {
          tag: "div",
          attrs: { class: "code" },
          content: [
            {
              tag: "p",
              attrs: { class: "language" },
              content: [lang[1]],
            },
            node,
          ],
        };
      });
    }
    tree.match(
      { tag: "img" },
      (node) => {
        if (!node.attrs.src.endsWith(".svg")) {
          return node;
        }
        const path = join(
          isAbsolute(node.attrs.src) ? process.cwd() : dirname(ctx.inputPath),
          node.attrs.src,
        );
        const svgString = readFileSync(path, { encoding: "utf-8" });
        const optimized = optimize(svgString, {
          path,
          plugins: [
            {
              name: "preset-default",
            },
            {
              name: "convertColors",
              params: {
                currentColor: true,
              },
            },
          ],
        });
        return { content: [optimized.data] };
      },
      { order: -2 },
    );
  });
  eleventyConfig.addPlugin(IdAttributePlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(EleventyPluginOgImage, {
    satoriOptions: {
      fonts: [
        {
          name: "Segoe UI",
          data: await fetch(
            "https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff",
          ).then((res) => res.arrayBuffer()),
          weight: 700,
          style: "normal",
        },
      ],
    },
  });
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
  });
  eleventyConfig.addFilter("year", (value) => {
    return value.getFullYear();
  });
  eleventyConfig.addFilter("htmlDate", (value, format) => {
    return DateTime.fromJSDate(value).toFormat(format ?? "dd. MMMM yyyy HH:mm");
  });
  eleventyConfig.addFilter("excerpt", (value) => {
    if (typeof value !== "string") return value;
    return value.replaceAll(/\n+#+/g, " -").replaceAll(/\n{2,}/g, "\n");
  });
  eleventyConfig.addFilter("copy", function (value) {
    const path = join(
      isAbsolute(value)
        ? this.eleventy.directories.input
        : dirname(this.page.inputPath),
      value,
    );
    const target = join(
      isAbsolute(value)
        ? this.eleventy.directories.output
        : dirname(this.page.outputPath),
      value,
    );
    cpSync(path, target, { recursive: true });
    return value;
  });
  eleventyConfig.addPreprocessor("drafts", "njk,md,liquid", (data, content) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
    return content;
  });
  let { addExtension, addPassthroughCopy } = eleventyConfig;
  addExtension = addExtension.bind(eleventyConfig);
  addPassthroughCopy = addPassthroughCopy.bind(eleventyConfig);

  const modules = parse(readFileSync(".gitmodules", { encoding: "utf-8" }));
  const aoc = Object.entries(
    Object.groupBy(Object.values(modules), (k) => k.parent ?? k.key),
  )
    .toSorted(([, a], [_, b]) => a.length - b.length)
    .map(([k, v]) => [k, v.toSorted((a, b) => a.key.localeCompare(b.key))]);
  eleventyConfig.addGlobalData("navigation", [["Blog"], ...aoc]);
  eleventyConfig.addGlobalData("aoc", aoc[0][1]);
  eleventyConfig.addGlobalData("host", "https://jonas.grunert.berlin");
  eleventyConfig.addTransform("cssmin", function (content) {
    if ((this.page.url || "").endsWith(".css")) {
      return new CleanCSS({}).minify(content).styles;
    }
    return content;
  });
  const endings = {};
  for (const [_, { path }] of Object.entries(modules)) {
    try {
      const config = await import("./" + path + "/eleventy.config.js");
      eleventyConfig.addExtension = (ending, options) => {
        const opts = endings[ending] ?? {};
        opts[path] = options;
        endings[ending] = opts;
      };
      eleventyConfig.addPassthroughCopy = (filename) => {
        addPassthroughCopy(
          typeof filename === "string"
            ? path + "/" + filename
            : Object.fromEntries(
                Object.entries(filename).map(([key, value]) => [
                  path + "/" + key,
                  value,
                ]),
              ),
        );
      };
      await config.default(eleventyConfig);
    } catch (e) {
      console.error(`Unable to read 11ty config in ${path}`);
      console.log(e);
    }
  }
  for (const [ending, paths] of Object.entries(endings)) {
    eleventyConfig.addTemplateFormats(ending);
    addExtension(ending, {
      compile: (content, path) => {
        const match = Object.keys(paths).find((k) => path.startsWith("./" + k));
        if (match) return paths[match].compile(content, path);
      },
      getData: (path) => {
        const match = Object.keys(paths).find((k) => path.startsWith("./" + k));
        if (match) return paths[match].getData(path);
      },
      compileOptions: {
        permalink: (content, path) => {
          const match = Object.keys(paths).find((k) =>
            path.startsWith("./" + k),
          );
          if (match)
            return paths[match].compileOptions.permalink(content, path);
        },
      },
    });
  }
}
