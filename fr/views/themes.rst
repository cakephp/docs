Themes
######

Vous pouvez profiter des themes, ce qui facilite le changement du visuel et
du ressenti de votre page rapidement et facilement.

Pour utiliser les themes, spécifiez le nom du theme dans votre controller::

    class ExampleController extends AppController {
        public $theme = 'Example';
    }

Vous pouvez également définir ou modifier le nom du theme dans une action ou
dans les fonctions de callback ``beforeFilter`` ou ``beforeRender``::

    $this->theme = 'AutreExemple';

Les fichiers de vue du theme ont besoin d'être dans le dossier
``/App/Template/Themed/``. Dans le dossier du theme, créez un dossier utilisant
le même nom que le nom de votre theme. Par exemple, Le theme ci-dessus serait
trouvé dans ``/App/Template/Themed/AnotherExample``. Il est important de se
souvenir que CakePHP attend des noms de theme en CamelCase. Au-delà de ça, la
structure de dossier dans le dossier ``/App/Template/Themed/Example/`` est
exactement le même que ``/App/Template/``.

Par exemple, le fichier de vue pour une action edit d'un controller Posts
se trouvera dans ``/App/Template/Themed/Example/Posts/edit.ctp``. Les fichiers
de Layout se trouveront dans ``/App/Template/Themed/Example/Layout/``.

Si un fichier de vue ne peut pas être trouvé dans le theme, CakePHP va
essayer de localiser le fichier de vue dans le dossier ``/App/Template/``.
De cette façon, vous pouvez créer des fichiers de vue master et simplement
les remplacer au cas par cas au sein de votre dossier de theme.

Assets du theme
---------------

Les themes peuvent contenir des assets statiques ainsi que des fichiers de vue.
Un theme peut inclure tout asset nécessaire dans son répertoire webroot. Cela
permet un packaging facile et une distribution des themes. Pendant le
développement, les requêtes pour les assets du theme seront gérés par
:php:class:`Dispatcher`. Pour améliorer la performance des environnements de
production, il est recommandé, soit que vous fassiez un lien symbolique, soit
que vous copiez les assets du theme dans le webroot de application. Voir
ci-dessous pour plus d'informations.

Pour utiliser le nouveau theme, créez des répertoires de type
``app/View/Themed/<nomDuTheme>/webroot<chemin_vers_fichier>`` dans votre theme.
Le Dispatcher se chargera de trouver les assets du theme corrects dans vos
chemins de vue.

Tous les helpers integrés dans CakePHP ont intégrés l'existence des themes
et vont créer des chemins d'accès corrects automatiquement. Comme pour les
fichiers de vue, si un fichier n'est pas dans le dossier du theme, il sera
par défaut dans le dossier principal webroot ::

    //Quand dans un theme avec un nom de 'purple_cupcake'
    $this->Html->css('main.css');

    //crée un chemin comme
    /theme/purple_cupcake/css/main.css

    //et fait un lien vers
    app/Template/Themed/PurpleCupcake/webroot/css/main.css

Augmenter la performance des assets du plug-in et du theme
----------------------------------------------------------

C'est un fait bien connu que de servir les assets par le biais de PHP est
assuré d'être plus lent que de servir ces assets sans invoquer PHP. Et
tandis que l'équipe du coeur a pris des mesures pour rendre le plugin et
l'asset du theme servis aussi vite que possible, il peut y avoir des
situations où plus de performance est requis. Dans ces situations, il
est recommandé soit que vous fassiez un lien symbolique soit que vous
fassiez une copie sur les assets du plug-in/theme vers des répertoires
dans ``app/webroot`` avec des chemins correspondant à ceux utilisés par
cakephp.

-  ``app/Plugin/DebugKit/webroot/js/my_file.js`` devient
   ``app/webroot/DebugKit/js/my_file.js``.
-  ``app/View/Themed/Navy/webroot/css/navy.css`` devient
   ``app/webroot/themed/Navy/css/navy.css``.


.. meta::
    :title lang=fr: Themes
    :keywords lang=fr: environnements de production,dossier du theme,fichiers layout,requêtes de développement,fonctions de callback,structure de dossier,vue par défaut,dispatcher,lien symbolique,cas de base,layouts,assets,cakephp,themes,avantage
