Inflector
#########

.. php:namespace:: Cake\Utility

.. php:class:: Inflector

La classe Inflector prend une chaîne de caractères et peut la manipuler pour
gérer les variations de mot comme les mises au pluriel ou les mises en Camel et
est normalement accessible statiquement. Exemple:
``Inflector::pluralize('example')`` retourne "examples".

Vous pouvez essayer les inflexions en ligne sur
`inflector.cakephp.org <http://inflector.cakephp.org/>`_.

.. _inflector-methods-summary:

Résumé des Méthodes d'Inflector et de leurs Sorties
===================================================

Petit résumé des méthodes intégrées à l'Inflector et des résultats produits
lorsque vous passez plusieurs mots en argument:

+-------------------+---------------+---------------+
| Method            | Argument      | Output        |
+===================+===============+===============+
| ``pluralize()``   | BigApple      | BigApples     |
+                   +---------------+---------------+
|                   | big_apple     | big_apples    |
+-------------------+---------------+---------------+
| ``singularize()`` | BigApples     | BigApple      |
+                   +---------------+---------------+
|                   | big_apples    | big_apple     |
+-------------------+---------------+---------------+
| ``camelize()``    | big_apples    | BigApples     |
+                   +---------------+---------------+
|                   | big apple     | BigApple      |
+-------------------+---------------+---------------+
| ``underscore()``  | BigApples     | big_apples    |
+                   +---------------+---------------+
|                   | Big Apples    | big apples    |
+-------------------+---------------+---------------+
| ``humanize()``    | big_apples    | Big Apples    |
+                   +---------------+---------------+
|                   | bigApple      | BigApple      |
+-------------------+---------------+---------------+
| ``classify()``    | big_apples    | BigApple      |
+                   +---------------+---------------+
|                   | big apple     | BigApple      |
+-------------------+---------------+---------------+
| ``dasherize()``   | BigApples     | big-apples    |
+                   +---------------+---------------+
|                   | big apple     | big apple     |
+-------------------+---------------+---------------+
| ``tableize()``    | BigApple      | big_apples    |
+                   +---------------+---------------+
|                   | Big Apple     | big apples    |
+-------------------+---------------+---------------+
| ``variable()``    | big_apple     | bigApple      |
+                   +---------------+---------------+
|                   | big apples    | bigApples     |
+-------------------+---------------+---------------+
| ``slug()``        | Big Apple     | big-apple     |
+                   +---------------+---------------+
|                   | BigApples     | BigApples     |
+-------------------+---------------+---------------+

Créer des Formes Pluriel et Singulier
=====================================

.. php:staticmethod:: singularize($singular)
.. php:staticmethod:: pluralize($singular)

``pluralize`` et ``singularize()`` fonctionnent pour la plupart des noms
Anglais. Si vous devez supporter d'autres langues, vous pouvez utiliser la
:ref:`inflection-configuration` pour personnaliser les règles utilisées::

    // Apples
    echo Inflector::pluralize('Apple');

.. note::

    ``pluralize()`` peut ne pas toujours convertir correctement un nom qui est
    déjà sous sa forme plurielle.

.. code-block:: php

    // Person
    echo Inflector::singularize('People');

.. note::

    ``singularize()`` peut ne pas toujours convertir correctement un nom qui est
    déjà sous sa forme singulière.

Créer des Formes en CamelCase et en Underscore
==============================================

.. php:staticmethod:: camelize($underscored)
.. php:staticmethod:: underscore($camelCase)

Ces méthodes sont utiles lors de la création de noms de classes ou de
propriétés::

    // ApplePie
    Inflector::camelize('Apple_pie')

    // apple_pie
    Inflector::underscore('ApplePie');

Il doit être noté que les underscores vont seulement convertir les mots formatés
en camelCase. Les mots qui contiennent des espaces seront en minuscules, mais ne
contiendront pas d'underscore.

Créer des Formes Lisibles par l'Homme
=====================================

Cette méthode est utile pour convertir des formes avec underscore en forme
"Title Case" pour être lisible par l'homme::

    // Apple Pie
    Inflector::humanize('apple_pie');

Créer des Formes pour les Tables et les Noms de Classe
======================================================

.. php:staticmethod:: classify($underscored)
.. php:staticmethod:: dasherize($dashed)
.. php:staticmethod:: tableize($camelCase)

Quand vous générez du code ou quand vous utilisez les conventions de CakePHP,
vous pouvez infléchir les noms de table ou les noms de classe::

    // UserProfileSettings
    Inflector::classify('user_profile_settings');

    // user-profile-setting
    Inflector::dasherize('UserProfileSetting');

    // user_profile_settings
    Inflector::tableize('UserProfileSetting');

Créer des Noms de Variable
==========================

.. php:staticmethod:: variable($underscored)

Les noms de variable sont souvent utiles quand vous faîtes des tâches
meta-programming qui impliquent la génération de code ou des opérations basées sur les conventions::

    // applePie
    Inflector::variable('apple_pie');

Créer des Chaînes d'URL Safe
============================

.. php:staticmethod:: slug($word, $replacement = '-')

Slug convertit les caractères spéciaux en version latins et convertit les
caractères ne correspondant pas et les espaces en tirets. La méthode slug
s'attend à un encodage UTF-8::

    // apple-puree
    Inflector::slug('apple purée');

.. note::
    ``Inflector::slug()`` est dépréciée depuis la version 3.2.7. Utilisez
    ``Text::slug()`` à la place.

.. _inflection-configuration:

Configuration d'Inflexion
=========================

Les conventions de nommage de CakePHP peuvent être très sympas - vous pouvez
nommer votre table de base de données ``big\_boxes``, votre model ``BigBoxes``,
votre controller ``BigBoxesController``, et tout fonctionnera automatiquement.
CakePHP connaît la façon dont les choses sont liées grâce à l'*inflexion* des
mots entre leurs formes singulière et plurielle.

Il existe des cas (spécialement pour nos amis non-anglais) où l'inflector de
CakePHP (la classe qui pluralise, singularise, met en camelCase et en
underscore) ne fonctionnera pas comme vous le souhaitez. Si CakePHP ne
reconnaîtra pas votre Foci ou Fish, vous pouvez dire à CakePHP vos cas
spécifiques.

Charger les Inflexions Personnalisées
-------------------------------------

.. php:staticmethod:: rules($type, $rules, $reset = false)

Définit une nouvelle inflexion et des règles de transliteration que Inflector va
utiliser. Souvent, cette méthode est utilisée dans votre
**config/bootstrap.php**::

    Inflector::rules('singular', ['/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta']);
    Inflector::rules('uninflected', ['singulars']);
    Inflector::rules('irregular', ['phylum' => 'phyla']); // The key is singular form, value is plural form

Les règles fournies vont être fusionnées dans l'ensemble d'inflexion défini dans
``Cake/Utility/Inflector``, avec les règles ajoutées qui supplantent les règles
du coeur. Vous pouvez utiliser ``Inflector::reset()`` pour nettoyer les règles
et restaurer l'état d'Inflector originel.

.. meta::
    :title lang=fr: Inflector
    :keywords lang=fr: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore
