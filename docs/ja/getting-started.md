# 入門

## このフォークについて {#about-this-fork}

このドキュメントは、コミュニティプロジェクト [Piece of Cake 2](https://github.com/pieceofcake2) が
メンテナンスしている CakePHP 2.x のフォーク [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp)
について説明しています。このフォークは CakePHP 2.10.24 をベースにしており、PHP 8.0 以降で動作します。
保守のみを目的としたフォークで、PHP への対応、バグ修正、セキュリティ修正を行います。新しい機能は追加しません。

CakePHP プロジェクトによる CakePHP 2.x のサポートは
[2021年6月に終了](https://bakery.cakephp.org/2021/10/02/cakephp_2_eol.html)しました。

::: warning
CakePHP 2 は既存のアプリケーションを保守するためのものです。新しくプロジェクトを始める場合は
[CakePHP 5](https://book.cakephp.org/5/ja/) を使ってください。
:::

このクックブックは、フォーク上で動く CakePHP 2 に合わせて、Composer でのインストール、PHP 8、
[pieceofcake2/app](https://github.com/pieceofcake2/app) で使っているモダンなディレクトリ構成を前提に説明しています。
本家の CakePHP 2.x のドキュメントとの違いは [本家ドキュメントからの変更点](/ja/appendices/changes-from-the-original-book)
にまとめています。フォークのほかのプロジェクトやリソースは
[Piece of Cake 2 のサイト](https://pieceofcake2.github.io/) から参照できます。

## 概要

CakePHPフレームワークはアプリケーションの堅牢な基礎を提供します。
これは最初のユーザのリクエスト全てから最後のWEBページのレンダリングまで、全面的に取り扱います。
またフレームワークがMVCの原則に従うことから、アプリケーションのほとんどの側面に於いてカスタマイズ・拡張が簡単にできるようになります。

このフレームワークはファイル名からデータベースのテーブル名まで、基礎的な組織構造も提供し、アプリケーション全体を矛盾無く論理的に保ちます。
この概念は単純ですが強力です。
規約に従うことで、どこに何があるのか、それらがどのように組織化されているのかを、いつも確実に把握できるのです。

CakePHPを体験し学ぶ最良の方法は腰を据えて何かを作ることです。
手始めに、単純なブログアプリケーションを構築します。

<!--@include: tutorials-and-examples/blog/blog.md-->

<!--@include: tutorials-and-examples/blog/part-two.md-->

## その他の資料

- [CakePHP の典型的なリクエスト](getting-started/a-typical-cakephp-request)
- [CakePHP の規約](getting-started/cakephp-conventions)
- [CakePHP のフォルダ構造](getting-started/cakephp-folder-structure)
- [CakePHP の構造](getting-started/cakephp-structure)
