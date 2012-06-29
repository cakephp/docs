コアライブラリ
##############

CakePHPは沢山の組込関数とクラスを備えています。これらのクラスと関数はwebアプリケーションで必要とされる共通機能をカバーしようと試みています。

汎用
====

汎用ライブラリはCakePHPの様々な場所で使うことができ、再利用されています。

.. toctree::
    :maxdepth: 2

    core-libraries/global-constants-and-functions
    core-libraries/events
    core-libraries/collections

.. _core-components:

コンポーネント
==============

CakePHPはコントローラ内の基本的なタスクをこなすのに役立つコンポーネントを取り揃えています。
コンポーネントの使い方と設定方法については :doc:`/controllers/components` を参照して下さい。

.. toctree::
    :maxdepth: 2

    core-libraries/components/access-control-lists
    core-libraries/components/authentication
    core-libraries/components/cookie
    core-libraries/components/email
    core-libraries/components/request-handling
    core-libraries/components/pagination
    core-libraries/components/security-component
    core-libraries/components/sessions

.. _core-helpers:

ヘルパー
========

CakePHPにはビューを作成を手助けする沢山のヘルパーがあります。それらは整形式でマークアップする手助けをしたり(フォームを含む)、
テキスト、時間、数値の整形に役立ったり、よく使われているjavascriptライブラリを導入することさえできます。
組込みのヘルパーの概要は以下の通りです。

ヘルパーやそのAPI、独自のヘルパーの作成方法や使い方についてさらに学習したい場合は、:doc:`/views/helpers` を読んでください。

.. toctree::
    :maxdepth: 2

    core-libraries/helpers/cache
    core-libraries/helpers/form
    core-libraries/helpers/html
    core-libraries/helpers/js
    core-libraries/helpers/number
    core-libraries/helpers/paginator
    core-libraries/helpers/rss
    core-libraries/helpers/session
    core-libraries/helpers/text
    core-libraries/helpers/time

.. _core-behaviors:

ビヘイビア
==========

ビヘイビアはモデルに拡張機能を追加します。CakePHPは :php:class:`TreeBehavior` や
:php:class:`ContainableBehavior` など、沢山の組込みビヘイビアを備えています。

ビヘイビアの作成方法と使い方については学ぶには :doc:`/models/behaviors` を読んでください。

.. toctree::
    :maxdepth: 2

    core-libraries/behaviors/acl
    core-libraries/behaviors/containable
    core-libraries/behaviors/translate
    core-libraries/behaviors/tree

コアライブラリ
==============

コアMVCコンポーネントに加えてCakePHPはキャッシュやロギング、国際化対応などwebサービスで必要とされるあらゆるユーティリティクラスを備えています。

.. toctree::
    :maxdepth: 2

    core-utility-libraries/app
    core-libraries/caching
    core-utility-libraries/email
    core-utility-libraries/number
    core-utility-libraries/time
    core-utility-libraries/sanitize
    core-utility-libraries/file-folder
    core-utility-libraries/httpsocket
    core-utility-libraries/inflector
    core-libraries/internationalization-and-localization
    core-libraries/logging
    core-utility-libraries/router
    core-utility-libraries/security
    core-utility-libraries/hash
    core-utility-libraries/set
    core-utility-libraries/string
    core-utility-libraries/xml

.. meta::
    :title lang=en: Core Libraries
    :keywords lang=en: core libraries,global constants,cookie,access control lists,number,text,time,security component,core components,general purpose,web applications,markup,authentication,api,cakephp,functionality,sessions,collections,events
