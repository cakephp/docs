# Piece of Cake 2

[Piece of Cake 2](https://github.com/pieceofcake2) is a community project that
keeps CakePHP 2 applications running on current PHP versions. It maintains
[pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp), a fork of
CakePHP 2.x that runs on PHP 8.0 and newer, together with an application
skeleton, the Bake plugin and forks of popular CakePHP 2 plugins.

The CakePHP project ended support for CakePHP 2.x in
[June 2021](https://bakery.cakephp.org/2021/10/02/cakephp_2_eol.html).
The fork is based on CakePHP 2.10.24 and focuses on PHP compatibility, bug
fixes and security fixes. It does not add new features.

::: warning
CakePHP 2 is for maintaining existing applications. If you are starting a new
project, use [CakePHP 5](https://book.cakephp.org/5/en/).
:::

## About this book

This book is the CakePHP 2 Cookbook, updated to describe CakePHP 2 as it works
on the fork today: installation with Composer, PHP 8, and the modern directory
layout used by [pieceofcake2/app](https://github.com/pieceofcake2/app).
[Changes from the Original Book](/pieceofcake2/changes) lists the pages that
differ from the original CakePHP 2.x documentation.

## Where to start

- [Installation](/installation) - create a new application or switch an
  existing one to pieceofcake2/cakephp.
- [Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10) -
  upgrade an application from the original CakePHP 2.10.24 and review the
  breaking changes.
- [Migrating to the Modern Layout](/appendices/migrating-to-the-modern-layout) -
  move from the `app/` layout to the CakePHP 5 style layout, step by step.
- [Security Fixes](/appendices/security-fixes) - vulnerabilities fixed in the
  fork and what you need to do.
- [Maintained Plugins](/plugins/maintained-plugins) - plugins maintained for
  PHP 8.

## Resources

- [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) -
  [CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md),
  [UPGRADE](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md)
- [pieceofcake2/app](https://github.com/pieceofcake2/app) - application skeleton
- [pieceofcake2/docs](https://github.com/pieceofcake2/docs) - the source of this book
