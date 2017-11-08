Guide de Compatibilité Rétroactive
##################################

Nous assurer que la mise à jour de vos applications se fasse facilement
et en douceur est important à nos yeux. C'est pour cela que nous ne cassons
la compatibilité que pour les versions majeures.
Vous connaissez peut-être le `versioning sémantique <http://semver.org/>`_
qui est la règle générale que nous utilisons pour tous les projets CakePHP.
En résumé, le versioning sémantique signifie que seules les versions majeures
(comme 2.0, 3.0, 4.0) peuvent casser la compatibilité rétroactive. Les versions
mineures (comme 2.1, 3.1, 3.2) peuvent introduire de nouvelles fonctionnalités,
mais ne cassent pas la compatibilité. Les versions de fix de Bug (comme 2.1.2,
3.0.1) n'ajoutent pas de nouvelles fonctionnalités, mais règlent seulement des
bugs ou améliorent la performance.

.. note::

    CakePHP a commencé à utiliser le versioning sémantique à partir de la
    version 2.0.0. Ces règles ne s'appliquent pas pour la version 1.x.

Pour clarifier les changements que vous pouvez attendre dans chaque version
en entier, nous avons plus d'informations détaillées pour les développeurs
utilisant CakePHP et pour les développeurs travaillant sur CakePHP qui
définissent les attentes de ce qui peut être fait dans des versions mineures.
Les versions majeures peuvent avoir autant de changements que nécessaires.

Guides de Migration
===================

Pour chaque version majeure et mineure, l'équipe de CakePHP va fournir un guide
de migration. Ces guides expliquent les nouvelles fonctionnalités et tout
changement entraînant des modifications de chaque version. Ils se trouvent dans
la section :doc:`/appendices` du cookbook.

Utiliser CakePHP
================

Si vous construisez votre application avec CakePHP, les conventions suivantes
expliquent la stabilité que vous pouvez attendre.

Interfaces
----------

En-dehors des versions majeures, les interfaces fournies par CakePHP **ne**
vont **pas** connaître de modification des méthodes existantes. De nouvelles
méthodes peuvent être ajoutées, mais aucune méthode existante ne sera changée.

Classes
-------

Les classes fournies par CakePHP peuvent être construites et ont leurs méthodes
public et les propriétés utilisées par le code de l'application et en-dehors des
versions majeures, la compatibilité rétroactive est assurée.

.. note::

    Certaines classes dans CakePHP sont marquées avec la balise de doc
    ``@internal`` de l'API. Ces classes **ne** sont **pas** stables et
    n'assurent pas forcément de compatibilité rétroactive.

Dans les versions mineures, les nouvelles méthodes peuvent être ajoutées aux
classes, et les méthodes existantes peuvent avoir de nouveaux arguments
ajoutés. Tout argument nouveau aura des valeurs par défaut, mais si vous
surchargez des méthodes avec une signature différente, vous verrez peut-être
des erreurs fatales. Les méthodes qui ont de nouveaux arguments ajoutés seront
documentées dans le guide de migration pour cette version.

La table suivante souligne plusieurs cas d'utilisations et la compatibilité
que vous pouvez attendre de CakePHP:

+-------------------------------+--------------------------+
| Si vous...                    | Backwards compatibility? |
+===============================+==========================+
| Typehint against the class    | Oui                      |
+-------------------------------+--------------------------+
| Crée une nouvelle instance    | Oui                      |
+-------------------------------+--------------------------+
| Etendre la classe             | Oui                      |
+-------------------------------+--------------------------+
| Access a public property      | Oui                      |
+-------------------------------+--------------------------+
| Appel d'une méthode publique  | Oui                      |
+-------------------------------+--------------------------+
| **Etendre une classe et...**                             |
+-------------------------------+--------------------------+
| Surcharger une propriété      | Oui                      |
| publique                      |                          |
+-------------------------------+--------------------------+
| Accéder à une propriété       | Non [1]_                 |
| protégée                      |                          |
+-------------------------------+--------------------------+
| Surcharger une propriété      | Non [1]_                 |
| protégée                      |                          |
+-------------------------------+--------------------------+
| Surcharger une méthode        | Non [1]_                 |
| protégée                      |                          |
+-------------------------------+--------------------------+
| Apple d'une méthode protégée  | Non [1]_                 |
+-------------------------------+--------------------------+
| Ajouter une propriété publique| Non                      |
+-------------------------------+--------------------------+
| Ajouter une méthode publique  | Non                      |
+-------------------------------+--------------------------+
| Ajouter un argument           | Non [1]_                 |
| pour une méthode qui surcharge|                          |
+-------------------------------+--------------------------+
| Ajouter une valeur d'argument | Oui                      |
| par défaut pour une méthode   |                          |
| existante                     |                          |
+-------------------------------+--------------------------+

Travailler avec CakePHP
=======================

Si vous aidez à rendre CakePHP encore meilleur, merci de garder à l'esprit
les conventions suivantes lors des ajouts/changements de fonctionnalités:

Dans une version mineure, vous pouvez:

+-------------------------------+--------------------------+
| Dans une versions mineure, pouvez-vous...                |
+===============================+==========================+
| **Classes**                                              |
+-------------------------------+--------------------------+
| Retirer une classe            | Non                      |
+-------------------------------+--------------------------+
| Retirer une interface         | Non                      |
+-------------------------------+--------------------------+
| Retirer un trait              | Non                      |
+-------------------------------+--------------------------+
| Faire des final               | Non                      |
+-------------------------------+--------------------------+
| Faire des abstract            | Non                      |
+-------------------------------+--------------------------+
| Changer de nom                | Oui [2]_                 |
+-------------------------------+--------------------------+
| **Propriétés**                                           |
+-------------------------------+--------------------------+
| Ajouter une propriété publique| Oui                      |
+-------------------------------+--------------------------+
| Retirer une propriété publique| Non                      |
+-------------------------------+--------------------------+
| Ajouter une propriété protégée| Oui                      |
+-------------------------------+--------------------------+
| Retirer une propriété protégée| Oui [3]_                 |
+-------------------------------+--------------------------+
| **Méthodes**                                             |
+-------------------------------+--------------------------+
| Ajouter une méthode publique  | Oui                      |
+-------------------------------+--------------------------+
| Retirer une méthode publique  | Non                      |
+-------------------------------+--------------------------+
| Ajouter une méthode protégée  | Oui                      |
+-------------------------------+--------------------------+
| Déplacer une classe parente   | Oui                      |
+-------------------------------+--------------------------+
| Retirer une méthode protégée  | Oui [3]_                 |
+-------------------------------+--------------------------+
| Réduire la visibilité         | Non                      |
+-------------------------------+--------------------------+
| Changer le nom de méthode     | Oui [2]_                 |
+-------------------------------+--------------------------+
| Ajouter un nouvel argument    | Oui                      |
| avec la valeur par défaut     |                          |
+-------------------------------+--------------------------+
| Ajouter un nouvel argument    | Non                      |
| requis pour une méthode       |                          |
| existante.                    |                          |
+-------------------------------+--------------------------+
| Retirer une valeur par défaut | Non                      |
| à partir d'un argument        |                          |
| existant                      |                          |
+-------------------------------+--------------------------+


.. [1] Votre code *peut* être cassé par des versions mineures. Vérifiez le
       guide de migration pour plus de détails.
.. [2] Vous pouvez changer des noms de classe/méthode tant que le vieux nom
       reste disponible.
       C'est généralement à éviter à moins que le renommage apporte un vrai
       bénéfice.
.. [3] Nous essayons d'éviter ceci à tout prix. Tout retrait doit être documenté
       dans le guide de migration.

Depréciations
=============

Dans chaque version mineure, les fonctionnalités peuvent être dépréciées. Si les
fonctionnalités sont dépréciées, la documentation de l'API et des avertissements
à l'exécution seront ajoutées. Les erreurs à l'exécution vous aideront à
localiser le code qui doit être mis à jour avant qu'il ne casse. Si vous
souhaitez désactiver les avertissements à l'exécution, vous pouvez le faire en
utilisant la valeur de configuration ``Error.errorLevel``::

   // dans config/app.php
   // ...
   'Error' => [
       'errorLevel' => E_ALL ^ E_USER_DEPRECATED,
   ]
   // ...

Va désactiver les avertissements de dépréciation à l'exécution.
