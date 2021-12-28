Conventions de CakePHP
######################

Nous sommes de grands fans des conventions plutôt que de la configuration. Bien
que cela réclame un peu de temps pour apprendre les conventions de CakePHP, à
terme vous gagnerez du temps. En suivant les conventions, vous aurez des
fonctionnalités automatiques et vous vous libérerez du cauchemar de la
maintenance du suivi des fichiers de configuration. Les conventions créent un
environnement de développement uniforme, permettant à d'autres développeurs de
s'investir d'avantage et d'aider.

Les Conventions des Controllers
===============================

Les noms des classes de controller sont au pluriel, en CamelCase et se terminent
par ``Controller``. ``UsersController`` et ``MenuLinksController`` sont
des exemples respectant cette convention.

Les méthodes publiques des controllers sont souvent exposées comme des 'actions'
accessibles via un navigateur web. Par exemple ``/users/view-me`` correspond à
la méthode ``viewMe()`` de ``UsersController`` sans rien modifier (si l'on utilise
l'inflexion dashed par défaut dans le routage. Les méthodes privées ou
protégées ne sont pas accessibles avec le routing.

Considérations concernant les URLs et les Noms des Controllers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Comme vous venez de voir, un controller dont le nom est constitué d'un seul mot
renvoie vers un chemin URL en minuscules. Par exemple, ``UsersController``
(qui serait défini dans le fichier nommé **UsersController.php**) est accessible
à l'adresse http://exemple.com/users.

Alors que vous pouvez router des controllers dont le nom est formé de plusieurs
mots de la façon que vous souhaitez, la convention est que vos URLs soient en
minuscules avec des tirets en utilisant la classe ``DashedRoute``, donc
``/menu-links/view-all`` est la bonne forme pour accéder à l'action
``MenuLinksController::viewAll()``.

Quand vous créez des liens en utilisant ``this->Html->link()``, vous pouvez
utiliser les conventions suivantes pour le tableau d'url::

    $this->Html->link('link-title', [
        'prefix' => 'MyPrefix' // CamelCased
        'plugin' => 'MyPlugin', // CamelCased
        'controller' => 'ControllerName', // CamelCased
        'action' => 'actionName' // camelBacked
    ]

Pour plus d'informations sur les URLs de CakePHP et la gestion des paramètres,
allez voir :ref:`routes-configuration`.

.. _file-and-classname-conventions:

Conventions des Fichiers et des Noms de Classe
==============================================

En général, les noms de fichiers correspondent aux noms des classes et suivent
les standards PSR-4 pour l'autoloading (chargement automatique). Voici
quelques exemples de noms de classes et de fichiers:

-  La classe controller ``LatestArticlesController`` devra se trouver dans un
   fichier nommé **LatestArticlesController.php**.
-  La classe Component (Composant) ``MyHandyComponent`` devra se trouver dans
   un fichier nommé **MyHandyComponent.php**.
-  La classe Table ``OptionValuesTable`` devra se trouver dans un fichier
   nommé **OptionValuesTable.php**.
-  La classe Entity ``OptionValue`` devra se trouver dans un fichier
   nommé **OptionValue.php**.
-  La classe Behavior (Comportement) ``EspeciallyFunkableBehavior`` devra
   se trouver dans un fichier nommé **EspeciallyFunkableBehavior.php**.
-  La classe View (Vue) ``SuperSimpleView`` devra se trouver dans un fichier
   nommé **SuperSimpleView.php**.
-  La classe Helper (Assistant) ``BestEverHelper`` devra se trouver
   dans un fichier nommé **BestEverHelper.php**.

Chaque fichier sera situé dans le répertoire/namespace approprié dans le dossier
de votre application.

.. _model-and-database-conventions:

Conventions pour les Models et les Bases de Données
===================================================

Les noms de tables correspondant aux models CakePHP sont au pluriel et utilisent
le caractère souligné (underscore). Les tables correspondantes aux models
mentionnés ci-dessus seront donc respectivement : ``users``,
``menu_links`` et ``user_favorite_pages``. Si le nom de table contient plusieurs
mots, seul le dernier doit être au pluriel, par exemple ``menu_links``.

Les noms des champs avec deux mots ou plus doivent être avec des underscores
comme ici : ``first_name``.

Les clés étrangères des relations hasMany, belongsTo ou hasOne sont reconnues
par défaut grâce au nom (singulier) de la table associée, suivi de ``_id``.
Donc, si Users hasMany Articles, la table ``articles`` se référera à la table
``users`` via une clé étrangère ``user_id``. Pour une table avec un nom de
plusieurs mots comme ``menu_links``, la clé étrangère sera
``menu_link_id``.

Les tables de jointure sont utilisées dans les relations BelongsToMany entre
models. Elles doivent être nommées d'après le nom des tables qu'elles unissent.
Les noms doivent être au pluriel et dans l'ordre alphabétique :
``articles_tags`` plutôt que ``tags_articles`` ou `àrticle_tags``.
*Si vous ne respectez pas ces conventions, la commande bake ne fonctionnera
pas.* Si la table de jointure contient d'autres colonnes que les clés
étrangères qui servent à l'association, vous devriez créer une une entité/table
réelle pour cette table.

En plus de l'utilisation des clés auto-incrémentées en tant que clés primaires,
vous pouvez aussi utiliser des colonnes UUID. CakePHP va créer un
UUID unique de 36 caractères (:php:meth:`Cake\Utility\Text::uuid()`) à chaque
fois que vous sauvegarderez un nouvel enregistrement en utlisant la méthode
``Table::save()``.

Model Conventions
=================

Les noms de classe de modèle (model) sont au pluriel, en CamelCase et finissent
par ``Table``. ``UsersTable``, ``MenuLinksTable`` et ``UserFavoritePagesTable``
sont des exemples de nom de classes de table correspondant respectivement aux
tables ``users``, ``menu_links`` and ``user_favorite_pages``.

Les noms de classe d'entités (entity) sont au singulier, en CamelCase et
ne possèdent pas de suffixe. ``User``, ``MenuLink`` et ``UserFavoritePage``
sont des exemples de noms d'entités correspondant respectivement aux tables
``users``, ``menu_links`` and ``user_favorite_pages``.

Conventions des Views
=====================

Les fichiers de template de view sont nommés d'après les fonctions du controller
qu'elles affichent, sous une forme avec underscores. La fonction ``viewAll()``
de la classe ``ArticlesController`` cherchera un gabarit de view dans
**templates/Articles/view_all.php**.

Le schéma classique est
**templates/Controller/nom_de_fonction_avec_underscore.php**.

.. note::

    Par défaut, CakePHP utilise des inflexions anglaises. Si vous avez une base
    de données tables/colonnes qui utilisent une autre langue, vous devrez
    ajouter une règle d'inflexion (du singulier au pluriel et vice-versa).
    Vous pouvez utiliser :php:class:`Cake\\Utility\\Inflector` pour définir
    vos règles d'inflexion personnalisées. Voir la documentation sur:
    :doc:`/core-libraries/inflector` pour plus d'informations.

Conventions des Plugins
=======================

Il est utile de préfixer un plugin CakePHP avec "cakephp-" dans le nom du paquet.
Cela rend le nom sémantiquement lié au framework dont il dépend.

N'utilisez **pas** l'espace de noms CakePHP (cakephp) comme nom de fournisseur
car c'est réservé aux plugins appartenant à CakePHP. La convention est d'utiliser
des lettres minuscules et des tirets comme séparateur::

    // Mauvais
    cakephp/foo-bar

    // Bon
    votre-nom/cakephp-foo-bar

Voir `awesome list recommendations
<https://github.com/FriendsOfCake/awesome-cakephp/blob/master/CONTRIBUTING.md#tips-for-creating-cakephp-plugins>`__
pour plus de détails.

En résumé
==========

En utilisant les conventions CakePHP dans le nommage des différentes parties
de votre application, vous gagnerez des fonctionnalités sans les tracas et les
affres de la configuration. Voici un exemple récapitulant les conventions
abordées:

-  Nom de la table de la base de données: "articles", "menu_links"
-  Classe Table: ``ArticlesTable`` se trouvant dans **src/Model/Table/ArticlesTable.php**
-  Classe Entity: ``Article`` se trouvant dans **src/Model/Entity/Article.php**
-  Classe Controller: ``ArticlesController`` se trouvant dans **src/Controller/ArticlesController.php**
-  Template de View se trouvant dans **templates/Articles/index.php**

En utilisant ces conventions, CakePHP sait qu'une requête de type
http://exemple.com/articles/ sera liée à un appel à la fonction ``index()`` du
Controller ``ArticlesController``, dans lequel le model ``Articles`` est
automatiquement disponible. Aucune de ces relations n'a été
configurée par rien d'autre que la création des classes et des fichiers dont
vous aviez besoin de toute façon.

+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Exemple    | articles                    | menu_links              |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Table en   | articles                    | menu_links              | Les noms de tables correspondant au modèles de       |
| base de    |                             |                         | CakePHP sont au pluriel et utilisent                 |
| données    |                             |                         | le caractère souligné (underscore)                   |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Fichier    | ArticlesController.php      | MenuLinksController.php |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Table      | ArticlesTable.php           | MenuLinksTable.php      | Les noms de classes sont au pluriel,                 |
|            |                             |                         | CamelCased et se terminent par Table                 |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Entity     | Article.php                 | MenuLink.php            | Les nom des classes d'entités (Entity) sont au       |
|            |                             |                         | singulier, CamelCased: Article et MenuLink           |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Class      | ArticlesController          | MenuLinksController     |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Controller | ArticlesController          | MenuLinksController     | Pluriel, CamelCased, se termine par Controller       |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Behavior   | ArticlesBehavior.php        | MenuLinksBehavior.php   |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| View       | ArticlesView.php            | MenuLinksView.php       | Les fichiers de template de view sont nommés d'après |
|            |                             |                         | les fonctions du controller qu'elles affichent,      |
|            |                             |                         | sous une forme avec underscores                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Helper     | ArticlesHelper.php          | MenuLinksHelper.php     |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Component  | ArticlesComponent.php       | MenuLinksComponent.php  |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Plugin     | Mauvais: cakephp/articles   | cakephp/menu-links      | Il est utile de préfixer un plugin CakePHP avec      |
|            | Bon: you/cakephp-articles   | vous/cakephp-menu-links | "cakephp-" dans le nom du paquet. N'utilisez pas     |
|            |                             |                         | l'espace de noms CakePHP (cakephp) comme nom de      |
|            |                             |                         | fournisseur car c'est réservé aux plugins appartenant|
|            |                             |                         | à CakePHP. La convention est d'utiliser des lettres  |
|            |                             |                         | minuscules et des tirets comme séparateur            |
|            |                             |                         |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Chaque fichier sera situé dans le dossier/espace de noms approprié dans le dossier de votre application.                  |
+------------+-----------------------------+-------------------------+------------------------------------------------------+


Résumé des conventions de Base de Données
==========================================

+-----------------+--------------------------------------------------------------+
| Clés étrangères | Les relations sont reconnues par défaut comme le nom (au     |
|                 | singulier) de la table associée suivi par ``_id``.           |
| hasMany         | Users hasMany Articles, la table ``articles`` fera référence |
| belongsTo/      | à la table ``users`` via la clé étrangère ``user_id``.       |
| hasOne          |                                                              |
| BelongsToMany   |                                                              |
|                 |                                                              |
+-----------------+--------------------------------------------------------------+
| Plusieurs mots  | Pour ``menu_links`` dont le nom contient plusieurs mots,     |
|                 | la clé étrangère serait ``menu_link_id``.                    |
+-----------------+--------------------------------------------------------------+
| Auto Increment  | En plus d'utiliser un entier auto-incrémenté comme clés      |
|                 | primaires, vous pouvez également utiliser des colonnes UUID. |
|                 | CakePHP créera automatiquement les valeurs UUID en           |
|                 | utilisant (:php:meth:`Cake\\Utility\\Text::uuid()`)          |
|                 | à chaque fois que vous sauvegarderez un nouvel               |
|                 | enregistrement en utlisant la méthode ``Table::save()``.     |
+-----------------+--------------------------------------------------------------+
| Tables jointes  | Doivent être nommées d'après les tables du modèle qu'elles   |
|                 | joindront dans l'ordre alphabétique (``articles_tags`` plutôt|
|                 | que ``tags_articles``) sinon la commande bake ne fonctionnera|
|                 | pas. En cas de besoin de colonne supplémentaire dans la table|
|                 | intermédiaire, vous devez créer une entité/table séparée     |
|                 | pour cette table.                                            |
+-----------------+--------------------------------------------------------------+

Maintenant que vous avez été initié aux fondamentaux de CakePHP, vous devriez
essayer de dérouler
:doc:`le tutoriel du Blog CakePHP </tutorials-and-examples/cms/installation>`
pour voir comment les choses s'articulent.

.. meta::
    :title lang=fr: Conventions de CakePHP
    :keywords lang=fr: expérience de développement web,maintenance cauchemard,méthode index,systèmes légaux,noms de méthode,classe php,système uniforme,fichiers de config,tenets,articles,conventions,controller conventionel,bonnes pratiques,maps,visibilité,nouveaux articles,fonctionnalité,logique,cakephp,développeurs
