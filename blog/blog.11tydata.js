export default {
  layout: "blog.njk",
  tags: ["blog"],
  eleventyComputed: {
    headings: async (data) => {
      return data.page.rawInput
        .matchAll(/^(#+) (.+)$/gm)
        .map(([_, level, heading]) => ({
          level: level.length,
          heading,
          sub: [],
        }))
        .reduce((prev, curr) => {
          if (prev.length === 0) return [curr];
          if (curr.level > prev.at(-1).level) {
            prev.at(-1).sub.push(curr);
            return prev;
          }
          return [...prev, curr];
        }, []);
    },
  },
};
