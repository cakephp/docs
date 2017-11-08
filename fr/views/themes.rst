Themes
######

Les themes dans CakePHP sont simplement des plugins qui se ne fournissent que
des fichiers de template. Consultez la section :ref:`plugin-create-your-own`.
Vous pouvez profiter des themes, ce qui facilite le changement du visuel et
du ressenti de votre page rapidement. En plus des fichiers de template, ils
peuvent fournir des helpers et des cells si votre theme le nécessite. Quand
vous utilisez des cells et des helpers à partir de votre theme, vous devrez
continuer à utiliser la :term:`syntaxe de plugin`.

Pour utiliser les themes, définissez le nom du theme dans votre controller ou
dans votre callback ``beforeRender()``::

    class ExamplesController extends AppController
    {
        // Pour CakePHP avant 3.1
        public $theme = 'Modern';

        public function beforeRender(\Cake\Event\Event $event)
        {
            $this->viewBuilder()->setTheme('Modern');

            // Pour les versions antérieures à CakePHP 3.5
            $this->viewBuilder()->theme('Modern');
        }
    }

Les fichiers de template du theme doivent être dans un plugin avec le même nom.
Par exemple, le theme ci-dessus se trouvera dans
**plugins/Modern/src/Template**. Il est important de se rappeler que
CakePHP s'attend à trouver des noms de plugin/theme en CamelCase. En plus de
cela, la structure de dossier dans le dossier
**plugins/Modern/src/Template** est exactement la même que
**src/Template/**.

Par exemple, le fichier de vue pour une action edit d'un controller Posts se
trouvera dans **plugins/Modern/src/Template/Posts/edit.ctp**. Les fichiers
de layout se trouveront dans **plugins/Modern/src/Template/Layout/**. Vous
pouvez aussi fournir des templates personnalisés pour les plugins avec un theme.
Si vous aviez un plugin s'appelant 'Cms', qui contient un TagsController, le
theme Modern pourrait fournir
**plugins/Modern/src/Template/Plugin/Cms/Tags/edit.ctp** pour remplacer le
template edit dans le plugin.

Si un fichier de template ne peut pas être trouvé dans le theme, CakePHP va
essayer de le trouver dans le dossier **src/Template/**. De cette façon, vous
pouvez créer les fichiers de template principaux et simplement les surcharger au
cas par cas dans votre dossier theme.

Assets du theme
---------------

Puisque les themes sont des plugins CakePHP standards, ils peuvent inclure
tout asset nécessaire dans leur répertoire webroot. Cela permet de packager et
distribuer les themes. En développement, les requêtes pour les assets de theme
seront gérées par :php:class:`Cake\\Routing\\Dispatcher`. Pour améliorer les
performances pour les environnements de production, il est recommandé
d':ref:`améliorer les performances de votre application.
<symlink-assets>`.

Tous les helpers intégrés à CakePHP connaissent les themes et seront créés
avec les bons chemins automatiquement. Comme les fichiers de template, si un
fichier n'est pas dans le dossier du theme, il va chercher par défaut dans le
dossier webroot principal::

    //Quand un theme avec le nom de 'purple_cupcake'
    $this->Html->css('main.css');

    //Crée un chemin comme
    /purple_cupcake/css/main.css

    // et les liens vers
    plugins/PurpleCupcake/webroot/css/main.css

.. meta::
    :title lang=fr: Themes
    :keywords lang=fr: environnements de production,dossier du theme,fichiers layout,requêtes de développement,fonctions de callback,structure de dossier,vue par défaut,dispatcher,lien symbolique,cas de base,layouts,assets,cakephp,themes,avantage
