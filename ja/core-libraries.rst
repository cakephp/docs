コアライブラリ
##############

CakePHPは沢山の組込関数とクラスを備えています。これらのクラスと関数はwebアプリケーションで必要とされる共通機能をカバーしようと試みています。

汎用
====

汎用ライブラリはCakePHPの様々な場所で使うことができ、再利用されています。

.. toctree::
    :maxdepth: 2

    core-libraries/toc-general-purpose

.. _core-behaviors:

ビヘイビア
==========

ビヘイビアはモデルに拡張機能を追加します。CakePHPは :php:class:`TreeBehavior` や
:php:class:`ContainableBehavior` など、沢山の組込みビヘイビアを備えています。

ビヘイビアの作成方法と使い方については学ぶには :doc:`/models/behaviors` を読んでください。

.. toctree::
    :maxdepth: 2

    core-libraries/toc-behaviors

.. _core-components:

コンポーネント
==============

CakePHPはコントローラ内の基本的なタスクをこなすのに役立つコンポーネントを取り揃えています。
コンポーネントの使い方と設定方法については :doc:`/controllers/components` を参照して下さい。

.. toctree::
    :maxdepth: 2

    core-libraries/toc-components

.. _core-helpers:

ヘルパー
========

CakePHPにはビューを作成を手助けする沢山のヘルパーがあります。それらは整形式でマークアップする手助けをしたり(フォームを含む)、
テキスト、時間、数値の整形に役立ったり、よく使われているjavascriptライブラリを導入することさえできます。
組込みのヘルパーの概要は以下の通りです。

ヘルパーやそのAPI、独自のヘルパーの作成方法や使い方についてさらに学習したい場合は、:doc:`/views/helpers` を読んでください。

.. toctree::
    :maxdepth: 2

    core-libraries/toc-helpers


ユーティリティ
==============

コアMVCコンポーネントに加えてCakePHPはキャッシュやロギング、国際化対応などwebサービスで必要とされるあらゆるユーティリティクラスを備えています。

.. toctree::
    :maxdepth: 2

    core-libraries/toc-utilities

