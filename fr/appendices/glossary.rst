Glossaire
#########

.. glossary::

    attributs HTML
        Un tableau de clé => valeurs qui sont composées dans les attributs
        HTML. Par exemple::

            // Par exemple
            ['class' => 'ma-classe', '_target' => 'blank']

            // générerait
            class="ma-classe" _target="blank"

        Si une option peut être minimisée ou a le même nom que sa valeur, alors
        ``true`` peut être utilisée::

            // Par exemple
            ['checked' => true]

            // Générerait
            checked="checked"

    CDN
        Content Delivery Network. Une librairie tierce que vous pouvez payer
        pour vous aider à distribuer votre contenu vers des centres de données
        dans le monde entier. Cela aide à rapprocher géographiquement vos
        assets static pour les utilisateurs.

    champ(s)
        Terme générique utilisé à la fois pour décrire des propriétés
        d'entity ou des colonnes de base de données ; souvent utilisé avec
        tout ce qui est lié au FormHelper.

    colonnes
        Utilisé dans l'ORM lorsqu'il est question de colonne de tables dans une
        base de données.

    CSRF
        Les Requêtes de site croisées de Contrefaçon. Empêche les attaques de
        replay, les soumissions doubles et les requêtes contrefaites provenant
        d'autres domaines.

    DSN
        Nom de Source de Données (Data Source Name). Un format de chaîne de
        connexion qui est formé comme un URI. CakePHP supporte les DSN pour
        les connections Cache, base de données, Log et Email.

    DRY
        Ne vous répétez pas vous-même. C'est un principe de développement de
        logiciel qui a pour objectif de réduire les répétitions d'information
        de tout type. Dans CakePHP, DRY est utilisé pour vous permettre de
        coder des choses et de les réutiliser à travers votre application.

    notation avec points
        La notation avec points (ou *dot notation*) définit un chemin de tableau,
        en séparant les niveaux imbriqués avec le caractère ``.``.
        Par exemple::

            Cache.default.engine

        Pointerait vers la valeur suivante::

            [
                'Cache' => [
                    'default' => [
                        'engine' => 'File'
                    ]
                ]
            ]

    PaaS
        Plate-forme en tant que service (Platform as a Service). Les fournisseurs
        de plate-forme en tant que service fournissent des hébergements, des
        bases de données et des ressources de caching basés sur le Cloud. Quelques
        fournisseurs populaires sont Heroku, EngineYard et PagodaBox

    propriétés
        Utilisé pour parler de colonnes mappées à des objets ``Entity`` de l'ORM

    routes.php
        Un fichier dans APP/Config qui contient la configuration de routing.
        Ce fichier est inclus avant que chaque requête soit traitée.
        Il doit connecter toutes les routes dont votre application a besoin
        afin que les requêtes puissent être routées aux controllers + actions
        correctes.

    syntaxe de plugin
        La syntaxe de Plugin fait référence au nom de la classe avec un point
        en séparation indiquant que les classes sont une partie d'un plugin.
        Par ex: ``DebugKit.Toolbar``, le plugin est DebugKit,
        et le nom de classe est Toolbar.

    tableau de routing
        Un tableau des attributs qui sont passés au :php:meth:`Router::url()`.
        Typiquement, il ressemble à cela::
        
            ['controller' => 'Posts', 'action' => 'view', 5]

.. meta::
    :title lang=fr: Glossaire
    :keywords lang=fr: attributs html,classe de tableau,tableau controller,glossaire,cible blank,notation point,configuration du routing,contrefaçon,replay,routeur,syntaxe,config,soumissions
