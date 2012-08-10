Inflector
#########

.. php:class:: Inflector

The Inflector class takes a string and can manipulate it to handle
word variations such as pluralizations or camelizing and is
normally accessed statically. Example:
``Inflector::pluralize('example')`` returns "examples".

.. php:staticmethod:: pluralize($singular)

    * **Input:** Apple, Orange, Person, Man
    * **Output:** Apples, Oranges, People, Men

.. php:staticmethod:: singularize($plural)

    **Input:** Apples, Oranges, People, Men
    **Output:** Apple, Orange, Person, Man

.. php:staticmethod:: camelize($underscored)

    * **Input:** Apple\_pie, some\_thing, people\_person
    * **Output:** ApplePie, SomeThing, PeoplePerson

.. php:staticmethod:: underscore($camelCase)

    It should be noted that underscore will only convert camelCase
    formatted words. Words that contains spaces will be lower-cased,
    but will not contain an underscore.
    
    * **Input:** applePie, someThing
    * **Output:** apple\_pie, some\_thing

.. php:staticmethod:: humanize($underscored)

    * **Input:** apple\_pie, some\_thing, people\_person
    * **Output:** Apple Pie, Some Thing, People Person

.. php:staticmethod:: tableize($camelCase)

    * **Input:** Apple, UserProfileSetting, Person
    * **Output:** apples, user\_profile\_settings, people

.. php:staticmethod: classify($underscored)

    * **Input:** apples, user\_profile\_settings, people
    * **Output:** Apple, UserProfileSetting, Person

.. php:staticmethod:: variable($underscored)

    * **Input:** apples, user\_result, people\_people
    * **Output:** apples, userResult, peoplePeople

.. php:staticmethod:: slug($word, $replacement = '_')

    Slug converts special characters into latin versions and converting
    unmatched characters and spaces to underscores. The slug method
    expects UTF-8 encoding.
    
    * **Input:** apple purée
    * **Output:** apple\_puree

.. php:staticmethod:: reset()

    Resets Inflector back to its initial state, useful in testing.
    
.. php:staticmethod:: rules($type, $rules, $reset = false)

    Define new inflection and transliteration rules for Inflector to use.
    See :ref:`inflection-configuration` for more information.


.. meta::
    :title lang=en: Inflector
    :keywords lang=en: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore