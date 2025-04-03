---
title: A To-Do List with JavaScript in 5 Minutes
tags:
  - web-dev
  - html
  - css
  - js
ogImage: ./screenshot.png
draft: true
---

The five minutes may be an overstretch, but in this post we will write a small browser-based To-Do List application without much fanfare. This is an introductory post into website development.

---

## Preamble

In this blog post I try to explain the way I would write the tiniest possible To-Do List I can imagine.
I will try to cover basic HTML, CSS and JavaScript features as well as put emphasis on some more forgotten aspects of web development.
If you have no idea what any of this means, do not fear I will go through it thorougly.
Nevertheless this is not a complete guide or introduction to web development, but more a kind of appetizer for the broad field of web development.

_TL;DR: [Here is a codesandbox](https://codesandbox.io/s/todo-list-in-5-minutes-itmqx?file=/index.html)_

## Introduction

Web devleopment is a broad term describing the process of developing websites, applications or more general software, which is utilizing browser technologies.
While browser tehnologies is a broad term in this post I will concentrate on HTML, CSS and JavaScript all as tiny as possible to be able to explain everything as detailed as necessary.
Additionally I want to try to cover bordering topics but we will see how this goes.

#### What is a website actually?

Everybody has an understanding of what a website is and if I would ask my grandma she would say "Its that thingy I can open with a browser."
And thats completly right, but to get a browser to properly display a website it might be interesting to understand what a website actually is.

**A website is a specially formatted file, which your browser can understand and visualize.**

This means a website can be a file on your computer, on the computer of a friend or on a sever (a big computer accesible by everyone on the internet).
The file is transfereed using a special protocl called Hypertext Transfer Protocol (**HTTP**), more on that may read later in another blog post.
So the file has to be formatted in a special way.
And this format is called **HTML** (Hypertext Markup Language), and it was first of designed to display raw text.
The internet was first deigned to simply share text documents within a small network of computers, which were mostly owned by research labs and as such most of the things they wanted to exchange were of textual content.

WIth the development of the web and further spread the desire to style and beautify your documents got larger and so some browser vendors started to implemnt styling options.
It was a hot mess and everyone did everything differently but over time a standard emegered **CSS** (Cascading Style Sheets).

We are now at the end of the 20th century and the web is booming, browser need to compete and a small company called [Netscape fights](<https://en.wikipedia.org/wiki/Browser_wars#First_Browser_War_(1995%E2%80%932001)>) against huge-ass and upright monopoly seeking Microsoft.
So they innovate to keep their product, the Netscape Navigator alive and [Brendan Eich](https://en.wikipedia.org/wiki/Brendan_Eich) (_a debatable figure_), designs and introduces JavaScript (**JS**) into the Netscape Navigator, to allow for interactive websites.
This great idea is propelled forward by Sun Microsystems the corporation behind the hugely popular Java language.
The similarity in name is no coincedence as JavaScript should profit from the popularity of Java, but they are quite different apart from the name.

## Writing a website

#### The basic structure of HTML

A HTML document is the basis of every website and follows a specific skeleton, which is always the same.
The document has some blocks, which allow the browser to easily read and understand your document.
Those special blocks are composed using `<` and `>`. One block is called a tag and there two (and a half kind of tags):  
"Normal" tags start with an opening angle bracket, followed by the tagname and then a closing angle bracket, e.g. `<html>`.
Then follows the inner content of the block.
Finally the block has to close using an opening angle bracket followed by a forward slash, the tagname and then again a closing angle bracket, e.g. `</html>`.
Those tags may also self close aka they will just start with an opening angle bracket, followed by the tagname a white space and then a forward slash and a closing angle bracket e.g. `<div />`.
Those elements simply have no content in them.
Then there are automatically self-closing tags. They are similar to "normal" self closing as they do not conatin any content, but you have to omit the forward slash.
One such example is the `<img>` tag, which is used to embed images into the text.
An automatically closing tag does not need or in some places is unable to contain a forward slash.  
Getting that aout of the way we can look to our first code snippet, which starts us of building a website.
If you want to follow along you may create a new file, (you can name it whatever you want, but I recommend `index.html` or atlest using `.html` as a file ending) and paste the following code using you favorite texteditor (On Windows you may use Notepad, on Mac TextEdit etc.).

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- meta information -->
  </head>

  <body>
    <!-- content of your website -->
  </body>
</html>
```

At the beginning of our code we find a special tag `<!DOCTYPE html>`.
It tells the browser, that he should be ready ready to read and parse an HTML document.
Parsing is the step, where the brwoser transforms the file into a structure understandable to him.
Afterwards we find our first tag.
All other tags (except comments) have to be within that tag and that why it is called a root tag.
Programmers love trees and as such they often use them as metaphors.
Within our `html` root tag we find, tow child tags.
One for meta information (`head`) and one for the actual content of our website (`body`).
They both contain comments.
A comment is not displayed in our website and is only used to help a developer guide through the code.
HTML comments alwas start with an angle bracket and a bang.
They are then followed by two dashes and then the content before closing with two dashes and angle bracket, e.g. `<!-- This is a comment. -->`.
This is the skeleton for our website and when we look back to our tree metaphor, we may visualize it as such.
![HTML tree with root node html and two child nodes body and head](./tree-1.svg "Programmers do not now that trees do grow the other way around though.")

#### Adding meta information

To ensure our browser can happily and correctly parse our document we have to tell it some other things execpt our document is HTML.
One of those things is the charset.
A charset instructs a program to know how to parse a single char.
As a computer on the lowest level can only understand zero and one, one character is represented as a standardized sequnce of zero and ones.
One charset is such a standardized way to encode mutliple charachters.
We tell the browser the used charset of our HTML document is "UTF-8" using an automatically self-closing `meta` tag.
As a self-closing tag cannot contain content HTML provides another set to allow us to add information to a tag.
This option are attributes and they are defined in the opening tag of a block.
An attribute is categorized by a name and often is followed by an equal sign and then the attributes value.
For our `meta` tag we define the attribute `charset` as `"UTF-8"`.
The hyphens are needed to tell the browser, that the attribute has to be understood as text and not anything else.

```html
<head>
  <meta charset="UTF-8" />
  <title>To-Do List</title>
</head>
```

The second tag we define is the `title` block, which is able to contain content.
Its textual content is taken as the title of our document like the name suggests.
The browser takes this property to label the tab, with which the website is opened.
If you want to view our progress, you may open the `.html` file, which you are editing, in your browser.
