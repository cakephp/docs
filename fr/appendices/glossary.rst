Glossaire
#########

.. glossary::

    tableau de routing
        Un tableau des attributs qui sont passés au :php:meth:`Router::url()`.
        Typiquement, il ressemble à cela::

            array('controller' => 'posts', 'action' => 'view', 5)

        Ou un exemple plus complexe::

            array(
                'subdomain' => 'dev',
                'plugin' => 'account',
                'prefix' => 'admin',
                'controller' => 'profiles',
                'action' => 'edit',
                10257
                '#' => 'email',
                '?' => array(
                    'reset' => true,
                ),
                'full_base' => true,
            )

    attributs HTML
        Un tableau de clé => valeurs qui sont composées dans les attributs
        HTML. Par exemple::

            // Par exemple
            array('class' => 'ma-classe', '_target' => 'blank')

            // générerait
            class="ma-classe" _target="blank"

        Si une option peut être minimisée ou a le même nom que sa valeur, alors
        ``true`` peut être utilisée::

            // Par exemple
            array('checked' => true)

            // Générerait
            checked="checked"

    syntaxe de plugin
        La syntaxe de Plugin fait référence au nom de la classe avec un point
        en séparation indiquant que les classes sont une partie d'un plugin.
        Par ex: ``DebugKit.Toolbar``, le plugin est DebugKit,
        et le nom de classe est Toolbar.

    notation avec points
        La notation avec points définit un chemin de tableau, en séparant les
        niveaux imbriqués avec ``.``
        Par exemple::

            Asset.filtre.css

        Pointerait vers la valeur suivante::

            array(
                'Asset' => array(
                    'filtre' => array(
                        'css' => 'vous m avez eu'
                    )
                )
            )

    CSRF
        Les Requêtes de site croisées de Contrefaçon. Empêche les attaques de
        replay, les soumissions doubles et les requêtes contrefaîtes provenant
        d'autres domaines.

    routes.php
        Un fichier dans APP/Config qui contient la configuration de routing.
        Ce fichier est inclus avant que chaque requête soit traitée.
        Il devrait connecter toutes les routes dont votre application a besoin
        afin que les requêtes puissent être routées aux contrôleurs + actions
        correctes.

    DRY
        Ne vous répétez pas vous-même. Est un principe de développement de
        logiciel qui a pour objectif de réduire les répétitions d'information
        de tout type. Dans CakePHP, DRY est utilisé pout vous permettre de
        coder des choses et de les ré-utiliser à travers votre application.


.. meta::
    :title lang=fr: Glossaire
    :keywords lang=fr: attributs html,classe de tableau,tableau controller,glossaire,cible blank,notation point,configuration du routing,contrefaçon,replay,routeur,syntaxe,config,soumissions
