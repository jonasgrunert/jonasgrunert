---
layout: "blog-list.njk"
override:tags: []
pagination:
  data: collections.blog
  size: 10
permalink: "/blog/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber }}/{% endif %}index.html"
---

## Blog

Going forward I try to publish each week a short little article consisting of things I learned this week or built.
