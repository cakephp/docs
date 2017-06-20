Conventions de CakePHP
######################

Nous sommes de grands fans des conventions plutôt que de la configuration. Bien
que cela réclame un peu de temps pour apprendre les conventions de CakePHP, à
terme vous gagnerez du temps. En suivant les conventions, vous aurez des
fonctionnalités automatiques et vous vous libérerez du cauchemar de la
maintenance du suivi des fichiers de configuration. Les conventions créent un
environnement de développement uniforme, permettant à d'autres développeurs de
s'investir dans le code plus.

Les Conventions des Controllers
===============================

Les noms des classes de controller sont au pluriel, en CamelCase et se terminent
par ``Controller``. ``UsersController`` et ``ArticleCategoriesController`` sont
des exemples respectant cette convention.

les méthodes publiques des controllers sont souvent exposées comme des 'actions'
accessibles via un navigateur web. Par exemple ``/users/view`` correspond à
la méthode ``view()`` de ``UsersController`` sans rien modifier. Les méthodes
privées ou protégées ne sont pas accessibles avec le routing.

Considérations concernant les URLs et les Noms des Controllers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Comme vous venez de voir, un controller à mot unique renvoie vers un chemin URL
en minuscules. Par exemple, ``UsersController`` (qui serait défini dans le nom
de fichier **UsersController.php**) est accessible à l'adresse
http://exemple.com/users.

Alors que vous pouvez router des controllers qui ont plusieurs mots de la façon
que vous souhaitez, la convention est que vos URLs soient en minuscules avec
des tirets en utilisant la classe ``DashedRoute``, donc
``/article-categories/view-all`` est la bonne forme pour accéder à l'action
``ArticleCategoriesController::viewAll()``.

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
les standards PSR-0 et PSR-4 pour l'autoloading (chargement automatique). Voici
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
   nommé **SuperSimpleView.ctp**.
-  La classe Helper (Assistant) ``BestEverHelper`` devra se trouver
   dans un fichier nommé **BestEverHelper.php**.

Chaque fichier sera situé dans le répertoire/namespace approprié dans le dossier
de votre application.

.. _model-and-database-conventions:

Conventions pour les Models et les Bases de Données
===================================================

Les noms de classe de model sont au pluriel, en CamelCase et finissent par
``Table``. ``UsersTable``, ``ArticleCategoriesTable`` et
``UserFavoritePagesTable`` en sont des exemples.

Les noms de tables correspondant aux models CakePHP sont au pluriel et utilisent
le caractère souligné (underscore). Les tables correspondantes aux models
mentionnés ci-dessus seront donc respectivement : ``users``,
``article_categories`` et ``user_favorite_pages``.

La convention est d'utiliser des mots anglais pour les noms de colonne et de
table. Si vous utilisez des mots dans une autre langue, CakePHP ne va pas
pouvoir convertir correctement les bonnes inflections (du singulier vers le
pluriel et vice-versa).
Dans certains cas, si vous souhaitez ajouter vos propres règles pour des mots
d'une autre langue, vous pouvez utiliser la classe utilitaire
:php:class:`Cake\\Utility\\Inflector`. En plus de définir ces règles
d'inflections personnalisées, cette classe va aussi vous permettre de vérifier
que CakePHP comprend votre syntaxe personnalisée pour les mots pluriels et
singuliers. Vous pouvez consulter la documentation sur
:doc:`/core-libraries/inflector` pour plus d'informations.

Les noms des champs avec deux mots ou plus doivent être avec des underscores
comme ici : ``first_name``.

Les clés étrangères des relations hasMany, belongsTo ou hasOne sont reconnues
par défaut grâce au nom (singulier) de la table associée, suivi de ``_id``.
Donc, si Users hasMany Articles, la table ``articles`` se référera à la table
``users`` via une clé étrangère ``user_id``. Pour une table avec un nom de
plusieurs mots comme ``article_categories``, la clé étrangère sera
``article_category_id``.

Les tables de jointure utilisées dans les relations BelongsToMany entre models
doivent être nommées d'après le nom des tables qu'elles unissent, dans l'ordre
alphabétique (``articles_tags`` plutôt que ``tags_articles``).

En plus de l'utilisation des clés auto-incrémentées en tant que clés primaires,
vous voudrez peut-être aussi utiliser des colonnes UUID. CakePHP va créer un
UUID unique de 36 caractères (:php:meth:`Cake\Utility\Text::uuid()`) à chaque
fois que vous sauvegarderez un nouvel enregistrement en utlisant la méthode
``Table::save()``.

Conventions des Views
=====================

Les fichiers de template de view sont nommés d'après les fonctions du controller
qu'elles affichent, sous une forme avec underscores. La fonction ``viewAll()``
de la classe ``ArticlesController`` cherchera un gabarit de view dans
**src/Template/Articles/view_all.ctp**.

Le schéma classique est
**src/Template/Controller/nom_de_fonction_avec_underscore.ctp**.

En utilisant les conventions CakePHP dans le nommage des différentes parties
de votre application, vous gagnerez des fonctionnalités sans les tracas et les
affres de la configuration. Voici un exemple récapitulant les conventions
abordées :

-  Nom de la table de la base de données: "articles"
-  Classe Table: ``ArticlesTable`` se trouvant dans
   **src/Model/Table/ArticlesTable.php**
-  Classe Entity: ``Article`` se trouvant dans **src/Model/Entity/Article.php**
-  Classe Controller: ``ArticlesController`` se trouvant dans
   **src/Controller/ArticlesController.php**
-  Template de View se trouvant dans **src/Template/Articles/index.ctp**

En utilisant ces conventions, CakePHP sait qu'une requête de type
http://exemple.com/articles/ sera liée à un appel à la fonction ``index()`` du
Controller ArticlesController, dans lequel le model Articles est
automatiquement disponible (et automatiquement lié à la table 'articles'
dans la base) et rendue dans un fichier. Aucune de ces relations n'a été
configurée par rien d'autre que la création des classes et des fichiers dont
vous aviez besoin de toute façon.

Maintenant que vous avez été initié aux fondamentaux de CakePHP, vous devriez
essayer de dérouler
:doc:`le tutoriel du Blog CakePHP </tutorials-and-examples/bookmarks/intro>`
pour voir comment les choses s'articulent.

.. meta::
    :title lang=fr: Conventions de CakePHP
    :keywords lang=fr: expérience de développement web,maintenance cauchemard,méthode index,systèmes légaux,noms de méthode,classe php,système uniforme,fichiers de config,tenets,articles,conventions,controller conventionel,bonnes pratiques,maps,visibilité,nouveaux articles,fonctionnalité,logique,cakephp,développeurs
