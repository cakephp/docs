Guide de Compatibilité Rétroactive
##################################

Nous assurer que la mise à jour de vos applications se fasse facilement
et en douceur est important à nos yeux. C'est pour cela que nous ne cassons
la compatibilité que pour les versions majeures.
Vous connaissez peut-être le `versioning sémantique <http://semver.org/>`_, ce
qui est la règle générale que nous utilisons pour tous les projets CakePHP.
En résumé, le versioning sémantique signifie que seules les versions majeures
(comme 2.0, 3.0, 4.0) peuvent casser la compatibilité rétroactive. Les versions
mineures (comme 2.1, 3.1, 3.2) peuvent introduire de nouvelles fonctionnalités,
mais ne permettent pas de casser la compatibilité. Les versions de fix de
Bug (comme 2.1.2, 3.0.1) n'ajoutent pas de nouvelles fonctionnalités, mais
règle seulement des bugs ou améliore la performance.

.. note::

    CakePHP a commencé à utiliser le versioning sémantique à partir de la
    version 2.0.0. Ces règles ne s'appliquent pas pour la version 1.x.

Pour clarifier les changements que vous pouvez attendre dans chaque version
en entier, nous avons plus d'informations détaillées pour les développeurs
utilisant CakePHP et pour les développeurs travaillant sur CakePHP qui aident
à définir les attentes de ce qui peut être fait dans des versions mineures.
Les versions majeures peuvent avoir autant de changements que nécessaires.

Guides de Migration
===================

Pour chaque version majeure et mineure, l'équipe de CakePHP va fournir un guide
de migration. Ces guides expliquent les nouvelles fonctionnalités et tout
changement entraînant des modifications de chaque version. Ils peuvent être
trouvés dans la section :doc:`/appendices` du cookbook.

Utiliser CakePHP
================

Si vous construisez votre application avec CakePHP, les conventions suivantes
expliquent la stabilité que vous attendez.

Interfaces
----------

En-dehors des versions majeures, les interfaces fournies par CakePHP **ne**
vont **pas** avoir de méthodes existantes changées et les nouvelles méthodes
**ne** seront pas ajoutées aux interfaces existantes.

Classes
-------

Les classes fournies par CakePHP peuvent être construites et ont leurs méthodes
public et les propriétés utilisées par le code l'application et en-dehors de
versions majeures, la compatibilité rétroactive est assurée.

.. note::

    Certaines classes dans CakePHP sont marquées avec la balise de doc
    ``@internal`` de l'API. Ces classes **ne** sont **pas** stables et
    n'assurent pas forcément de compatibilité rétroactive.

Dans les versions mineures (3.x.0), les nouvelles méthodes peuvent être
ajoutées aux classes, et les méthodes existantes peuvent avoir de nouveaux
arguments ajoutés. Tout argument nouveau aura des valeurs par défaut, mais si
vous surchargez des méthodes avec une signature différente, vous verrez
peut-être des erreurs fatales. Les méthodes qui ont des nouveaux arguments
ajoutés seront documentés dans le guide de migration pour cette version.

La table suivante souligne plusieurs cas d'utilisations et la compatibilité
que vous pouvez attendre de CakePHP:

+-------------------------------+--------------------------+
| Si vous...                    | Compatibilité            |
|                               | rétroactive?             |
+===============================+==========================+
| Typehint sur une classe       | Oui                      |
+-------------------------------+--------------------------+
| Créé une nouvelle instance    | Oui                      |
+-------------------------------+--------------------------+
| Etendre la classe             | Oui                      |
+-------------------------------+--------------------------+
| Accès à une propriété publique| Oui                      |
+-------------------------------+--------------------------+
| Appel d'une méthode publique  | Oui                      |
+-------------------------------+--------------------------+
| **Etendre une classe et...**                             |
+-------------------------------+--------------------------+
| Appel d'une méthode protégée  | Non [1]_                 |
+-------------------------------+--------------------------+
| Surcharger une propriété      | Non [1]_                 |
| protégée                      |                          |
+-------------------------------+--------------------------+
| Surcharger une méthode        | Non [1]_                 |
| protégée                      |                          |
+-------------------------------+--------------------------+
| Accéder à une propriété       | Non [1]_                 |
| protégée                      |                          |
+-------------------------------+--------------------------+
| Appel d'une méthode publique  | Oui                      |
+-------------------------------+--------------------------+
| Surcharger une méthode        | Oui [1]_                 |
| publique                      |                          |
+-------------------------------+--------------------------+
| Surcharger une propriété      | Oui                      |
| publique                      |                          |
+-------------------------------+--------------------------+
| Ajouter une propriété publique| Non                      |
+-------------------------------+--------------------------+
| Ajouter une méthode publique  | Non                      |
+-------------------------------+--------------------------+
| Ajouter un argument à une     | Non [1]_                 |
| méthode surchargée            |                          |
+-------------------------------+--------------------------+
| Ajouter un argument par défaut| Oui                      |
| à une méthode existante       |                          |
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
| Déplacer un membre vers la    | Oui                      |
| classe parente                |                          |
+-------------------------------+--------------------------+
| Retirer une méthode protégée  | Oui [3]_                 |
+-------------------------------+--------------------------+
| Réduire la visibilité         | Non                      |
+-------------------------------+--------------------------+
| Changer le nom de méthode     | Oui [2]_                 |
+-------------------------------+--------------------------+
| Ajouter une valeur par défaut | Non                      |
| à un argument existant        |                          |
+-------------------------------+--------------------------+
| Ajouter un argument avec la   | Oui                      |
| valeur par défaut             |                          |
+-------------------------------+--------------------------+
| Ajouter une argument          | Non                      |
| nécessaire                    |                          |
+-------------------------------+--------------------------+


.. [1] Votre code *peut* être cassé par des versions mineures. Vérifiez le
       guide de migration pour plus de détails.
.. [2] Vous pouvez changer des noms de classe/méthode tant que le vieux nom
       reste disponible.
       C'est généralement évité à moins que le renommage apporte un vrai bénéfice.
.. [3] Nous essayons d'éviter ceci à tout prix. Tout retrait doit être documenté
       dans le guide de migration.
