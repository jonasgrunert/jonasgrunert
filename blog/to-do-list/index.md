---
layout: blog-list.njk
override:tags: []
pagination:
  data: collections.to-do-list
  size: 10
permalink: "/blog/to-do-list/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber }}/{% endif %}index.html"
---

## To-Do-List

In this blog series I want to explain different parts of web development using the example of a To Do List.
