Inflector
#########

.. php:class:: Inflector

Inflector は文字列の複数形や大文字への変換を取り扱うクラスです。
Inflector のメソッドは通常では静的にアクセスします。
例: ``Inflector::pluralize('example')`` は "examples" を返します。

`inflector.cakephp.org <https://inflector.cakephp.org/>`_
にてオンライン上で変換を試すことができます。

.. php:staticmethod:: pluralize($singular)

    * **入力:** Apple, Orange, Person, Man
    * **出力:** Apples, Oranges, People, Men

.. note::

    ``pluralize()`` は、すでに複数形の名詞をいつも正しく変換できるわけではありません。

.. php:staticmethod:: singularize($plural)

    * **入力:** Apples, Oranges, People, Men
    * **出力:** Apple, Orange, Person, Man

.. note::

    ``singularize()`` は、すでに単数形の名詞をいつも正しく変換できるわけではありません。

.. php:staticmethod:: camelize($underscored)

    * **入力:** Apple\_pie, some\_thing, people\_person
    * **出力:** ApplePie, SomeThing, PeoplePerson

.. php:staticmethod:: underscore($camelCase)

    underscore はキャメルケースの文字列をアンダースコア (_) に変換します。
    スペースを含む文字列は小文字になりますがアンダースコアは含まれません。

    * **入力:** applePie, someThing
    * **出力:** apple\_pie, some\_thing

.. php:staticmethod:: humanize($underscored)

    * **入力:** apple\_pie, some\_thing, people\_person
    * **出力:** Apple Pie, Some Thing, People Person

.. php:staticmethod:: tableize($camelCase)

    * **入力:** Apple, UserProfileSetting, Person
    * **出力:** apples, user\_profile\_settings, people

.. php:staticmethod:: classify($underscored)

    * **入力:** apples, user\_profile\_settings, people
    * **出力:** Apple, UserProfileSetting, Person

.. php:staticmethod:: variable($underscored)

    * **入力:** apples, user\_result, people\_people
    * **出力:** apples, userResult, peoplePeople

.. php:staticmethod:: slug($word, $replacement = '_')

    slug は特殊文字をラテン文字に変換したり、スペースをアンダースコアに変換します。
    slug は UTF-8 を前提とします。

    * **入力:** apple purée
    * **出力:** apple\_puree

.. php:staticmethod:: reset()

    reset は文字列を変更前の状態に戻します。テストでの利用を想定しています。

.. php:staticmethod:: rules($type, $rules, $reset = false)

    rules は Inflector に対して新しい変換ルールを定義します。
    :ref:`inflection-configuration` により詳細な情報があります。


.. meta::
    :title lang=ja: Inflector
    :keywords lang=ja: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore
