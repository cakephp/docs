# Getting Started

## About This Fork {#about-this-fork}

This book documents [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp),
a community-maintained fork of CakePHP 2.x. The fork is based on
CakePHP 2.10.24 and runs on PHP 8.0 and newer. It is maintenance-only: it
focuses on PHP compatibility, bug fixes and security fixes, and does not add new
features.

The CakePHP project ended support for CakePHP 2.x in
[June 2021](https://bakery.cakephp.org/2021/10/02/cakephp_2_eol.html).

::: warning
CakePHP 2 is for maintaining existing applications. If you are starting a new
project, use [CakePHP 5](https://book.cakephp.org/5/en/).
:::

This cookbook describes CakePHP 2 as it works on the fork: installation with
Composer, PHP 8, and the modern directory layout used by
[pieceofcake2/app](https://github.com/pieceofcake2/app).
[Changes from the Original Book](/appendices/changes-from-the-original-book)
lists how it differs from the original CakePHP 2.x documentation. The
[Piece of Cake 2 website](https://pieceofcake2.github.io/) links to the
fork's other projects and resources.

## Introduction

The CakePHP framework provides a robust base for your application.
It can handle every aspect, from the user's initial request all the
way to the final rendering of a web page. And since the framework
follows the principles of MVC, it allows you to easily customize
and extend most aspects of your application.

The framework also provides a basic organizational structure, from
filenames to database table names, keeping your entire application
consistent and logical. This concept is simple but powerful. Follow
the conventions and you'll always know exactly where things are and
how they're organized.

The best way to experience and learn CakePHP is to sit down and build something.
To start off we'll build a simple blog application.

<!--@include: tutorials-and-examples/blog/blog.md-->

<!--@include: tutorials-and-examples/blog/part-two.md-->

## Additional Reading

- [A Typical CakePHP Request](getting-started/a-typical-cakephp-request)
- [CakePHP Conventions](getting-started/cakephp-conventions)
- [CakePHP Folder Structure](getting-started/cakephp-folder-structure)
- [CakePHP Structure](getting-started/cakephp-structure)
