# Documentation

Contributing to the documentation is simple. The files are hosted on
<https://github.com/cakephp/docs>. Feel free to fork the repo, add your
changes/improvements/translations and give back by issuing a pull request.
You can even edit the docs online with GitHub, without ever downloading the
files -- the "Improve this Doc" button on any given page will direct you to
GitHub's online editor for that page.

CakePHP documentation is
[continuously integrated](https://en.wikipedia.org/wiki/Continuous_integration),
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

- index.rst
- intro.rst
- quickstart.rst
- installation.rst
- /intro folder
- /tutorials-and-examples folder

### Reminder for Docs Administrators

The structure of all language folders should mirror the English folder
structure. If the structure changes for the English version, we should apply
those changes in the other languages.

For example, if a new English file is created in **en/file.rst**, we should:

- Add the file in all other languages : **fr/file.rst**, **zh/file.rst**, ...

- Delete the content, but keeping the `title`, `meta` information and
  eventual `toc-tree` elements. The following note will be added while nobody
  has translated the file:

  ``` text
  File Title
  ##########

  .. note::
      The documentation is not currently supported in XX language for this
      page.

      Please feel free to send us a pull request on
      `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
      button to directly propose your changes.

      You can refer to the English version in the select top menu to have
      information about this page's topic.

  // If toc-tree elements are in the English version
  .. toctree::
      :maxdepth: 1

      one-toc-file
      other-toc-file

  .. meta::
      :title lang=xx: File Title
      :keywords lang=xx: title, description,...
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
- If you need to write an English term, wrap it in `<em>` tags.
  For example, "asdf asdf *Controller* asdf" or "asdf asdf Kontroller
  (*Controller*) asfd".
- Do not submit partial translations.
- Do not edit a section with a pending change.
- Do not use
  [HTML entities](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references)
  for accented characters, the book uses UTF-8.
- Do not significantly change the markup (HTML) or add new content.
- If the original content is missing some info, submit an edit for
  that first.

## Documentation Formatting Guide

The new CakePHP documentation is written with
[ReST formatted text](https://en.wikipedia.org/wiki/ReStructuredText). ReST
(Re Structured Text) is a plain text markup syntax similar to markdown, or
textile. To maintain consistency it is recommended that when adding to the
CakePHP documentation you follow the guidelines here on how to format and
structure your text.

### Line Length

Lines of text should be wrapped at 80 columns. The only exception should be
long URLs, and code snippets.

### Headings and Sections

Section headers are created by underlining the title with punctuation characters
at least the length of the text.

- `#` Is used to denote page titles.
- `=` Is used for sections in a page.
- `-` Is used for subsections.
- `~` Is used for sub-subsections.
- `^` Is used for sub-sub-subsections.

Headings should not be nested more than 5 levels deep. Headings should be
preceded and followed by a blank line.

### Paragraphs

Paragraphs are simply blocks of text, with all the lines at the same level of
indentation. Paragraphs should be separated by one blank line.

### Inline Markup

- One asterisk: *text* for emphasis (italics)
  We'll use it for general highlighting/emphasis.
  - `*text*`.
- Two asterisks: **text** for strong emphasis (boldface)
  We'll use it for working directories, bullet list subject, table names and
  excluding the following word "table".
  - `**/config/Migrations**`, `**articles**`, etc.
- Two backquotes: `text` for code samples
  We'll use it for names of method options, names of table columns, object
  names, excluding the following word "object" and for method/function
  names -- include "()".
  - ``cascadeCallbacks``, ``true``, ``id``,
    ``PagesController``, ``config()``, etc.

If asterisks or backquotes appear in running text and could be confused with
inline markup delimiters, they have to be escaped with a backslash.

Inline markup has a few restrictions:

- It **may not** be nested.
- Content may not start or end with whitespace: `* text*` is wrong.
- Content must be separated from surrounding text by non-word characters. Use a
  backslash escaped space to work around that: `onelong\ *bolded*\ word`.

### Lists

List markup is very similar to markdown. Unordered lists are indicated by
starting a line with a single asterisk and a space. Numbered lists can be
created with either numerals, or `#` for auto numbering:

    * This is a bullet
    * So is this. But this line
      has two lines.

    1. First line
    2. Second line

    #. Automatic numbering
    #. Will save you some time.

Indented lists can also be created, by indenting sections and separating them
with an empty line:

    * First line
    * Second line

        * Going deeper
        * Whoah

    * Back to the first level.

Definition lists can be created by doing the following:

    term
        definition
    CakePHP
        An MVC framework for PHP

Terms cannot be more than one line, but definitions can be multi-line and all
lines should be indented consistently.

### Links

There are several kinds of links, each with their own uses.

#### External Links

Links to external documents can be done with the following:

``` text
`External Link to php.net <https://php.net>`_
```

The resulting link would look like this: [External Link to php.net](https://php.net)

#### Links to Other Pages

> Other pages in the documentation can be linked to using the `:doc:` role.
> You can link to the specified document using either an absolute or relative
> path reference. You should omit the `.rst` extension. For example, if
> the reference `` :doc:`form ``<span class="title-ref"> appears in the document </span><span class="title-ref">core-helpers/html</span><span class="title-ref">,
> then the link references </span><span class="title-ref">core-helpers/form</span><span class="title-ref">. If the reference was
> </span><span class="title-ref">:doc:</span>/core-helpers`` `, it would always reference ``/core-helpers\`\`
> regardless of where it was used.

#### Cross Referencing Links

> You can cross reference any arbitrary title in any document using the
> `:ref:` role. Link label targets must be unique across the entire
> documentation. When creating labels for class methods, it's best to use
> `class-method` as the format for your link label.
>
> The most common use of labels is above a title. Example:
>
>     .. _label-name:
>
>     Section heading
>     ---------------
>
>     More content here.
>
> Elsewhere you could reference the above section using `` :ref:`label-name ``<span class="title-ref">.
> The link's text would be the title that the link preceded. You can also
> provide custom link text using </span><span class="title-ref">:ref:\`Link text \<label-name\></span>\`\`.

#### Prevent Sphinx to Output Warnings

Sphinx will output warnings if a file is not referenced in a toc-tree. It's
a great way to ensure that all files have a link directed to them, but
sometimes, you don't need to insert a link for a file, eg. for our
<span class="title-ref">epub-contents</span> and <span class="title-ref">pdf-contents</span> files. In those cases, you can add
`:orphan:` at the top of the file, to suppress warnings that the file is not
in the toc-tree.

### Describing Classes and their Contents

The CakePHP documentation uses the [phpdomain](https://pypi.org/project/sphinxcontrib-phpdomain/) to provide custom
directives for describing PHP objects and constructs. Using these directives
and roles is required to give proper indexing and cross referencing features.

### Describing Classes and Constructs

Each directive populates the index, and or the namespace index.

> This directive declares a new PHP global variable.

> Defines a new global function outside of a class.

> This directive declares a new PHP constant, you can also use it nested
> inside a class directive to create class constants.

> This directive declares a new Exception in the current namespace. The
> signature can include constructor arguments.

> Describes a class. Methods, attributes, and constants belonging to the class
> should be inside this directive's body:
>
> ``` text
> .. php:class:: MyClass
>
>     Class description
>
>    .. php:method:: method($argument)
>
>    Method description
> ```
>
> Attributes, methods and constants don't need to be nested. They can also just
> follow the class declaration:
>
> ``` text
> .. php:class:: MyClass
>
>     Text about the class
>
> .. php:method:: methodName()
>
>     Text about the method
> ```
>
> <div class="seealso">
>
> `php:method`, `php:attr`, `php:const`
>
> </div>

> Describe a class method, its arguments, return value, and exceptions:
>
> ``` text
> .. php:method:: instanceMethod($one, $two)
>
>     :param string $one: The first parameter.
>     :param string $two: The second parameter.
>     :returns: An array of stuff.
>     :throws: InvalidArgumentException
>
>    This is an instance method.
> ```

> Describe a static method, its arguments, return value and exceptions,
> see `php:method` for options.

> Describe an property/attribute on a class.

#### Prevent Sphinx to Output Warnings

Sphinx will output warnings if a function is referenced in multiple files. It's
a great way to ensure that you did not add a function two times, but
sometimes, you actually want to write a function in two or more files, eg.
<span class="title-ref">debug object</span> is referenced in <span class="title-ref">/development/debugging</span> and in
<span class="title-ref">/core-libraries/global-constants-and-functions</span>. In this case, you can add
`:noindex:` under the function debug to suppress warnings. Keep only
one reference **without** `:no-index:` to still have the function referenced:

``` php
.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
    :noindex:
```

#### Cross Referencing

The following roles refer to PHP objects and links are generated if a
matching directive is found:

> Reference a PHP function.

> Reference a global variable whose name has `$` prefix.

> Reference either a global constant, or a class constant. Class constants
> should be preceded by the owning class:
>
>     DateTime has an :php:const:`DateTime::ATOM` constant.

> Reference a class by name:
>
>     :php:class:`ClassName`

> Reference a method of a class. This role supports both kinds of methods:
>
> ``` php
> :php:meth:`DateTime::setDate`
> :php:meth:`Classname::staticMethod`
> ```

> Reference a property on an object:
>
> ``` text
> :php:attr:`ClassName::$propertyName`
> ```

> Reference an exception.

### Source Code

Literal code blocks are created by ending a paragraph with `::`. The literal
block must be indented, and like all paragraphs be separated by single lines:

    This is a paragraph::

        while ($i--) {
            doStuff()
        }

    This is regular text again.

Literal text is not modified or formatted, save that one level of indentation
is removed.

### Notes and Warnings

There are often times when you want to inform the reader of an important tip,
special note or a potential hazard. Admonitions in sphinx are used for just
that. There are fives kinds of admonitions.

- `.. tip::` Tips are used to document or re-iterate interesting or important
  information. The content of the directive should be written in complete
  sentences and include all appropriate punctuation.
- `.. note::` Notes are used to document an especially important piece of
  information. The content of the directive should be written in complete
  sentences and include all appropriate punctuation.
- `.. warning::` Warnings are used to document potential stumbling blocks, or
  information pertaining to security. The content of the directive should be
  written in complete sentences and include all appropriate punctuation.
- `.. versionadded:: X.Y.Z` "Version added" admonitions are used to display notes
  specific to new features added at a specific version, `X.Y.Z` being the version on
  which the said feature was added.
- `.. deprecated:: X.Y.Z` As opposed to "version added" admonitions, "deprecated"
  admonition are used to notify of a deprecated feature, `X.Y.Z` being the version on
  which the said feature was deprecated.

All admonitions are made the same:

``` text
.. note::

    Indented and preceded and followed by a blank line. Just like a
    paragraph.

This text is not part of the note.
```

#### Samples

> [!TIP]
> This is a helpful tid-bit you probably forgot.

> [!NOTE]
> You should pay attention here.

> [!WARNING]
> It could be dangerous.

::: info Added in version 4.0.0
This awesome feature was added in version 4.0.0
:::

::: info Deprecated in version 4.0.1
This old feature was deprecated on version 4.0.1
:::
