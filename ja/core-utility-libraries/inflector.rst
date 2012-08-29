Inflector
#########

.. php:class:: Inflector

Inflectorは文字列の複数形や大文字への変換を取り扱うクラスです。

Example:
``Inflector::pluralize('example')`` returns "examples".

.. php:staticmethod:: pluralize($singular)

    * **入力:** Apple, Orange, Person, Man
    * **出力:** Apples, Oranges, People, Men

.. php:staticmethod:: singularize($plural)

    * **入力:** Apples, Oranges, People, Men
    * **出力:** Apple, Orange, Person, Man

.. php:staticmethod:: camelize($underscored)

    * **入力:** Apple\_pie, some\_thing, people\_person
    * **出力:** ApplePie, SomeThing, PeoplePerson

.. php:staticmethod:: underscore($camelCase)

    underscoreはキャメルケースの文字列をアンダースコア(_)に変換します。
    
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

    slugは特殊文字をラテン文字に変換したり、スペースをアンダースコアに変換します。slugはUTF-8を前提とします。
    
    * **入力:** apple purée
    * **出力:** apple\_puree

.. php:staticmethod:: reset()

    resetは文字列を変更前の状態に戻します。テストでの利用を想定しています。
    
.. php:staticmethod:: rules($type, $rules, $reset = false)

    rulesはInflectorに対して新しい変換ルールを定義します。
    :ref:`inflection-configuration` により詳細な情報があります。


.. meta::
    :title lang=en: Inflector
    :keywords lang=en: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore