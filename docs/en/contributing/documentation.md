# Documentation

Contributing to the documentation is simple. The files are hosted on
<https://github.com/cakephp/docs>. Feel free to fork the repo, add your
changes/improvements/translations and give back by issuing a pull request.
You can even edit the docs online with GitHub, without ever downloading the
files -- the "Edit this page" link on any given page will direct you to
GitHub's online editor for that page.

The CakePHP documentation is built with [VitePress](https://vitepress.dev), a static site
generator powered by Vue and Vite. The documentation is
[continuously integrated](https://en.wikipedia.org/wiki/Continuous_integration)
and deployed after each pull request is merged.

## Translations

Email the docs team (docs at cakephp dot org) or hop on IRC
(#cakephp on freenode) to discuss any translation efforts you would
like to participate in.

### New Translation Language

We want to provide translations that are as complete as possible. However, there
may be times where a translation file is not up-to-date. You should always
consider the English version as the authoritative version.

If your language is not in the current languages, please contact us through
Github and we will consider creating a skeleton folder for it. The following
sections are the first one you should consider translating as these
files don't change often:

- index.md
- intro.md
- quickstart.md
- installation.md
- /intro folder
- /tutorials-and-examples folder

### Reminder for Docs Administrators

The structure of all language folders should mirror the English folder
structure. If the structure changes for the English version, we should apply
those changes in the other languages.

For example, if a new English file is created in **en/file.md**, we should:

- Add the file in all other languages : **fr/file.md**, **zh/file.md**, ...

- Delete the content, but keep the frontmatter and add a translation notice.
  The following note will be added while nobody has translated the file:

  ```markdown
  ---
  title: File Title
  description: Brief description of the page
  ---

  # File Title

  ::: warning Translation Needed
  The documentation is not currently supported in XX language for this page.

  Please feel free to send us a pull request on
  [Github](https://github.com/cakephp/docs) or use the **Edit this page**
  link to directly propose your changes.

  You can refer to the English version in the language selector to have
  information about this page's topic.
  :::
  ```

### Translator tips

- Browse and edit in the language you want the content to be
  translated to - otherwise you won't see what has already been
  translated.
- Feel free to dive right in if your chosen language already
  exists on the book.
- Use [Informal Form](https://en.wikipedia.org/wiki/Register#Linguistics).
- Translate both the content and the title at the same time.
- Do compare to the English content before submitting a correction
  (if you correct something, but don't integrate an 'upstream' change
  your submission won't be accepted).
- If you need to write an English term, wrap it in `*asterisks*` for emphasis.
  For example, "asdf asdf *Controller* asdf" or "asdf asdf Kontroller
  (*Controller*) asfd".
- Do not submit partial translations.
- Do not edit a section with a pending change.
- Do not use
  [HTML entities](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references)
  for accented characters, the documentation uses UTF-8.
- Do not significantly change the markup or add new content.
- If the original content is missing some info, submit an edit for
  that first.

## Documentation Formatting Guide

The CakePHP documentation is written in [Markdown](https://en.wikipedia.org/wiki/Markdown)
and built with [VitePress](https://vitepress.dev). Markdown is a lightweight
markup language that's easy to read and write. To maintain consistency, please
follow these guidelines when contributing to the CakePHP documentation.

For comprehensive information about VitePress features and configuration,
refer to the [VitePress Guide](https://vitepress.dev/guide). For detailed
information about Markdown features and VitePress-specific extensions, see the
[VitePress Markdown Guide](https://vitepress.dev/guide/markdown).

### Line Length

Lines of text should be wrapped at 80 columns. The only exception should be
long URLs, and code snippets.

### Headings and Sections

Headings are created using hash symbols (`#`) at the start of a line:

- `#` Page title (H1) - Use only once per page
- `##` Major sections (H2)
- `###` Subsections (H3)
- `####` Sub-subsections (H4)
- `#####` Sub-sub-subsections (H5)
- `######` Lowest level heading (H6)

Headings should not be nested more than 4 levels deep for readability.
Always add a blank line before and after headings.

Example:
```markdown
## Major Section

Paragraph text here.

### Subsection

More content.
```

### Paragraphs

Paragraphs are simply blocks of text, with all the lines at the same level of
indentation. Paragraphs should be separated by one blank line.

### Inline Markup

- *Italics*: Use single asterisks or underscores: `*text*` or `_text_`
  - Use for general emphasis and highlighting
  - Example: *Controller*, *important note*

- **Bold**: Use double asterisks or underscores: `**text**` or `__text__`
  - Use for strong emphasis, directory paths, and key terms
  - Example: **config/Migrations**, **articles table**

- `Inline Code`: Use single backticks: `` `text` ``
  - Use for method names, variable names, class names, and code snippets
  - Example: `cascadeCallbacks`, `PagesController`, `config()`, `true`

**Tips:**
- Ensure proper spacing around inline markup for it to render correctly
- Inline code doesn't require escaping special characters
- You can escape special characters with backslash if needed: `\*not italic\*`

### Lists

**Unordered Lists**: Start lines with `-`, `*`, or `+` followed by a space:

```markdown
- First item
- Second item
- Third item with
  multiple lines
```

**Ordered Lists**: Use numbers followed by a period:

```markdown
1. First item
2. Second item
3. Third item
```

**Nested Lists**: Indent with 2 or 4 spaces:

```markdown
- First level
  - Second level
    - Third level
  - Back to second level
- Back to first level
```

**Mixed Lists**:

```markdown
1. Ordered item
   - Unordered sub-item
   - Another sub-item
2. Another ordered item
```

### Links

#### External Links

Use standard Markdown link syntax:

```markdown
[Link Text](https://example.com)
```

Example: [CakePHP Website](https://cakephp.org)

#### Internal Links

Link to other pages in the documentation using relative paths:

```markdown
[Link Text](../path/to/page.md)
```

Examples:
- Same directory: `[Installation](./installation.md)`
- Parent directory: `[Controllers](../controllers.md)`
- Subdirectory: `[Components](./controllers/components.md)`

**Note**: VitePress automatically converts `.md` extensions in links to appropriate
URL paths in the built site.

#### Anchor Links

Link to specific sections within a page using heading anchors:

```markdown
[Link to section](#heading-text)
```

VitePress automatically generates anchor IDs from headings in kebab-case.
For example, `## My Section Title` becomes `#my-section-title`.

Link to a section in another page:
```markdown
[Link text](./other-page.md#section-anchor)
```

### Frontmatter

Each documentation page should start with YAML frontmatter containing metadata:

```markdown
---
title: Page Title
description: A brief description of the page content
---
```

Optional frontmatter fields:
- `title`: Page title (used in browser tab and navigation)
- `description`: Page description for SEO
- `head`: Additional head tags
- `layout`: Custom layout (default is 'doc')

Example:
```markdown
---
title: Controllers
description: Learn about CakePHP controllers and request handling
---

# Controllers

Your content here...
```

### Code Blocks

Code blocks are created using triple backticks with an optional language identifier:

````markdown
```php
class MyController extends Controller
{
    public function index()
    {
        // Your code here
    }
}
```
````

Common language identifiers:
- `php` - PHP code
- `bash` or `shell` - Shell commands
- `javascript` or `js` - JavaScript
- `json` - JSON data
- `yaml` - YAML configuration
- `html` - HTML markup
- `css` - CSS styles

**Line Highlighting**: Highlight specific lines in code blocks:

````markdown
```php{2,4-6}
class Example
{
    public function highlighted() // This line is highlighted
    {
        // These lines are
        // also highlighted
    }
}
```
````

**Line Numbers**: Add line numbers to code blocks:

````markdown
```php:line-numbers
class Example
{
    public function withLineNumbers()
    {
        return true;
    }
}
```
````

### Admonitions

VitePress provides custom containers for tips, warnings, and other callouts.

**Available Container Types:**

```markdown
::: tip
This is a tip. Use for helpful information or best practices.
:::

::: info
This is an info box. Use for additional context or explanations.
:::

::: warning
This is a warning. Use for important caveats or potential issues.
:::

::: danger
This is a danger notice. Use for critical information or security concerns.
:::

::: details Click to expand
This is a collapsible details block. Content is hidden by default.
:::
```

**Custom Titles:**

```markdown
::: tip Custom Tip Title
You can customize the title of any container.
:::

::: warning Important Security Note
Always validate user input before processing.
:::
```

**Version Notices:**

For version-specific information:

```markdown
::: info New in 5.0.0
This feature was added in CakePHP 5.0.0.
:::

::: warning Deprecated in 5.1.0
This method is deprecated as of CakePHP 5.1.0. Use `newMethod()` instead.
:::
```

**Examples:**

::: tip Performance Tip
Caching query results can significantly improve performance.
:::

::: warning Security Warning
Never store passwords in plain text. Always use proper hashing.
:::

::: info New in 5.0.0
The new ORM improvements provide better type safety.
:::
