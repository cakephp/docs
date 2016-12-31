Inflector
#########

.. php:class:: Inflector

La classe Inflector prend une chaîne de caractères et peut la manipuler
pour gérer les variations de mot comme les mises au pluriel ou les mises
en Camel et est normalement accessible statiquement. Exemple:
``Inflector::pluralize('example')`` retourne "examples".

Vous pouvez essayer les inflections enligne sur
`inflector.cakephp.org <https://inflector.cakephp.org/>`_.

.. php:staticmethod:: pluralize($singular)

    * **Input:** Apple, Orange, Person, Man
    * **Output:** Apples, Oranges, People, Men

.. note::

    ``pluralize()`` ne convertit pas toujours correctement un nom qui est déjà
    au pluriel.

.. php:staticmethod:: singularize($plural)

    * **Input:** Apples, Oranges, People, Men
    * **Output:** Apple, Orange, Person, Man

.. note::

    ``singularize()`` ne convertit pas toujours correctement un nom qui est déjà
    au singulier.

.. php:staticmethod:: camelize($underscored)

    * **Input:** Apple\_pie, some\_thing, people\_person
    * **Output:** ApplePie, SomeThing, PeoplePerson

.. php:staticmethod:: underscore($camelCase)

    Il doit être noté que les underscores vont seulement convertir les mots
    formatés en camelCase. Les mots qui contiennent des espaces seront en
    minuscules, mais ne contiendront pas d'underscore.

    * **Input:** applePie, someThing
    * **Output:** apple\_pie, some\_thing

.. php:staticmethod:: humanize($underscored)

    * **Input:** apple\_pie, some\_thing, people\_person
    * **Output:** Apple Pie, Some Thing, People Person

.. php:staticmethod:: tableize($camelCase)

    * **Input:** Apple, UserProfileSetting, Person
    * **Output:** apples, user\_profile\_settings, people

.. php:staticmethod:: classify($underscored)

    * **Input:** apples, user\_profile\_settings, people
    * **Output:** Apple, UserProfileSetting, Person

.. php:staticmethod:: variable($underscored)

    * **Input:** apples, user\_result, people\_people
    * **Output:** apples, userResult, peoplePeople

.. php:staticmethod:: slug($word, $replacement = '_')

    Slug convertit les caractères spéciaux en version latins et convertit
    les caractères ne correspondant pas et les espaces aux underscores. La
    méthode slug s'attend à un encodage UTF-8.

    * **Input:** apple purée
    * **Output:** apple\_puree

.. php:staticmethod:: reset()

    Remet l'Inflector à son état initial, utile pour les tests.

.. php:staticmethod:: rules($type, $rules, $reset = false)

    Définit de nouvelles règles d'inflection et de translitération à utiliser
    pour Inflector.
    Regardez :ref:`inflection-configuration` pour plus d'informations.

.. meta::
    :title lang=fr: Inflector
    :keywords lang=fr: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore
