Documentation formatting guide
##############################

The new CakePHP documentation is written with ReST formatted text.  ReST 
(Re Structured Text) is a plain text markup syntax similar to markdown, or textile.
To maintain consistency it is recommended that when adding to the CakePHP documentation
you follow the guidelines here on how to format and structure your text.

Headings and Sections
=====================

Section headers are created by underlining the title with punctuation characters at 
least the length of the text.

- ``#`` Is used to denote page titles.
- ``=`` Is used for sections in a page.
- ``-`` Is used for subsections.
- ``~`` Is used for sub-subsections
- ``^`` Is used for sub-sub-sections.

Headings should not be nested more than 5 levels deep. Headings should be preceded and followed
by a blank line.

Paragraphs
==========

Paragraphs are simply blocks of text, with all the lines at the same level of indentation.
Paragraphs should be separated by more than one empty line.

Inline markup
=============

* one asterisk: *text* for emphasis (italics),
* two asterisks: **text** for strong emphasis (boldface), and
* backquotes: ``text`` for code samples.

If asterisks or backquotes appear in running text and could be confused with inline markup 
delimiters, they have to be escaped with a backslash.

Inline markup has a few restrictions:

* It **may not** be nested.
* Content may not start or end with whitespace: ``* text*`` is wrong.
* Content must be separated from surrounding text by non-word characters. Use a backslash escaped space to work around that: ``onelong\ *bolded*\ word``.

Lists
=====

List markup is very similar to markdown.  Unordered lists are indicated by starting a line with a single asterisk and a space.  Numbered lists can be created with either numerals, or ``#`` for auto numbering::

    * This is a bullet
    * So is this.  But this line
      has two lines.
      
    1. First line
    2. Second line
    
    #. Automatic numbering
    #. Will save you some time.

Indented lists can also be created, by indenting sections and separating them with an empty line::

    * First line
    * Second line
    
        * Going deeper
        * Whoah
    
    * Back to the first level.

Definition lists can be created by doing the following::

    term
        definition
    CakePHP
        An MVC framework for PHP

Terms cannot be more than one line, but definitions can be multi-line and all lines should be indented consistently.

Links
=====

There are several kinds of links, each with their own uses.

External links
--------------

..

Links to other pages
--------------------

...

Cross referencing links
-----------------------

...


Source code
===========

Literal code blocks are created by ending a paragraph with ``::``. The literal block must be indented, and like
all paragraphs be separated by single lines::

    This is a paragraph
        
        while ($i--) {
            doStuff()
        }
    
    This is regular text again.

Literal text is not modified or formatted, save that one level of indentation is removed.


Notes and warnings
==================
