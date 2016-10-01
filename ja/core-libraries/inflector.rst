Inflector
#########

.. php:class:: Inflector

Inflector は文字列の複数形やキャメルケースへの変換を取り扱うクラスです。
Inflector のメソッドは通常では静的にアクセスします。
例: ``Inflector::pluralize('example')`` は "examples" を返します。

`inflector.cakephp.org <http://inflector.cakephp.org/>`_
にてオンライン上で変換を試すことができます。

複数形と単数形の作成
====================

.. php:staticmethod:: singularize($plural)
.. php:staticmethod:: pluralize($singular)

``pluralize`` や ``singularize()`` の両方は、多くの英語名詞に作用します。
もし、他の言語の対応が必要な場合、 使用するルールをカスタマイズするために
:ref:`inflection-configuration` を使用することができます。 ::

    // Apples
    echo Inflector::pluralize('Apple');

.. note::

    ``pluralize()`` は、すでに複数形の名詞をいつも正しく変換できるわけではありません。

.. code-block:: php

    // Person
    echo Inflector::singularize('People');
    
.. note::

   ``singularize()`` は、すでに単数形の名詞をいつも正しく変換できるわけではありません。

キャメルケースやアンダースコアの作成
====================================

.. php:staticmethod:: camelize($underscored)
.. php:staticmethod:: underscore($camelCase)

これらのメソッドは、クラス名やプロパティ名を作成する時便利です。 ::

    // ApplePie
    Inflector::camelize('Apple_pie')

    // apple_pie
    Inflector::underscore('ApplePie');

underscore メソッドは、 キャメルケース形式の単語のみ変換することに注意してください。
スペースを含む単語は、小文字になりますが、アンダースコアは含まれません。

人間が読みやすい形式の作成
=============================

.. php:staticmethod:: humanize($underscored)

このメソッドは、アンダースコア形式を人間が読みやすい値
「タイトルケース」形式に変換する時に便利です。 ::

    // Apple Pie
    Inflector::humanize('apple_pie');

テーブル名やクラス名の作成
==========================

.. php:staticmethod:: classify($underscored)
.. php:staticmethod:: dasherize($dashed)
.. php:staticmethod:: tableize($camelCase)

コードの生成や CakePHP の規約を使用する時、テーブル名やクラス名に加工するために
必要になります。 ::

    // UserProfileSetting
    Inflector::classify('user_profile_settings');

    // user-profile-setting
    Inflector::dasherize('UserProfileSetting');

    // user_profile_settings
    Inflector::tableize('UserProfileSetting');

変数名の作成
============

.. php:staticmethod:: variable($underscored)

規約をもとにしたコード生成や仕事をするのに必要なメタプログログラミングの作業を行う時に、
変数名はしばしば役に立ちます。 ::

    // applePie
    Inflector::variable('apple_pie');

URL セーフな文字列
=========================

.. php:staticmethod:: slug($word, $replacement = '_')

slug は特殊文字をラテン文字に変換したり、スペースをアンダースコアに変換します。
slug は UTF-8 を前提とします。 ::

    // apple-puree
    Inflector::slug('apple purée');

.. _inflection-configuration:

Inflection の設定
=================

CakePHP の命名規則は、本当に良くなります。あなたはデータベーステーブル ``big_boxes`` と
名付け、モデルを ``BigBoxes`` 、コントローラを ``BigBoxesController`` 、
そして、すべては、ただ自動的に一緒に動作します。CakePHP は、
単数形と複数形の間で単語を加工することにより、お互いを紐付ける方法を知っています。

(特に英語を話さない友人にとって) CakePHP の inflector (複数形、単数形、
キャメルケース、アンダースコアに変換するクラス) があなたの希望通りの動作をしないような、
状況に陥るかもしれません。もし、CakePHP に Foci や Fish を認識させたくない場合、
CakePHP に特別なケースを伝えることができます。

カスタム Inflection のロード
----------------------------

.. php:staticmethod:: rules($type, $rules, $reset = false)

Inflector で使用する新しい変換・翻訳の規則を定義します。しばしば、
このメソッドは、 **config/bootstrap.php** 内で使用されます。 ::

    Inflector::rules('singular', ['/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta']);
    Inflector::rules('uninflected', ['singulars']);
    Inflector::rules('irregular', ['phylum' => 'phyla']); // キーは単数形、値は複数形

与えられたルールは、 ``Cake/Utility/Inflector`` で定義された各変換セットの中に
マージされます。コアのルールよりも追加されたルールが優先されます。ルールをクリアして
Inflector の元の状態に戻すために ``Inflector::reset()`` が使用できます。

.. meta::
    :title lang=ja: Inflector
    :keywords lang=ja: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore
