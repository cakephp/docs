Thèmes
######

Vous pouvez profiter des thèmes, ce qui facilite le changement du visuel et 
du ressenti de votre page rapidement et facilement.

Pour utiliser les thèmes, spécifiez le nom du thème dans votre controller::

    class ExempleController extends AppController {
        public $theme = 'Exemple';
    }

    .. versionchanged:: 2.1
        Les versions antérieures à 2.1 ont besoin de définir 
        ``$this->viewClass = 'Theme'``.
        2.1 enlève cette condition puisque la classe normale ``View``  
        supporte les thèmes.

Vous pouvez également définir ou modifier le nom du thème dans une action ou 
dans les fonctions de callback``beforeFilter`` ou ``beforeRender``::

    $this->theme = 'AutreExemple';

Les fichiers de vue du thème ont besoin d'être dans le dossier 
``/app/View/Themed/``. Dans le dossier du thème, créez un dossier utilisant 
le même nom que le nom de votre thème. Au-delà de ça, la structure de dossier 
dans le dossier ``/app/View/Themed/Exemple/`` est exactement le même que 
``/app/View/``.

Par exemple, le fichier de vue pour une action edit d'un contôleur Posts 
residera dans ``/app/View/Themed/Exemple/Posts/edit.ctp``. Les fichiers de 
Layout résideront dans ``/app/View/Themed/Exemple/Layouts/``.

Si un fichier de vue ne peut pas être trouvé dans le thème, CakePHP va 
essayer de localiser le fichier de vue dans le dossier ``/app/View/``.
De cette façon, vous pouvez créer des fichiers de vue master et simplement 
les remplacer au cas par cas au sein de votre dossier de thème.

Assets du thème
---------------

Les thèmes peuvent contenir des assets statiques ainsi que des fichiers de vue.
Un thème peut inclure tout asset nécessaire dans son répertoire webroot. Cela 
permet un packaging facile et une distribution des thèmes. Pendant le 
développement, les requêtes pour les assets du thème seront gérés par
:php:class:`Dispatcher`. Pour améliorer la performance des environnements de 
production, il est recommandé soit que vous fassiez un lien symbolique soit 
que vous copiez les assets du thème dans le webroot de application. Voir 
ci-dessous pour plus d'informations.

Pour utiliser le nouveau thème, créez des répertoires de type
``app/View/Themed/<nomDuTheme>/webroot<chemin_vers_fichier>`` dans votre thème.
Le Dispatcher se chargera de trouver les assets du thème corrects dans vos 
chemins de vue.

Tous les helpers integrés dans CakePHP ont intégrés l'existence des thèmes 
et vont créer des chemins d'accès corrects automatiquement. Comme pour les 
fichiers de vue, si un fichier n'est pas dans le dossier du thème, il sera 
par défaut dans le dossier principal webroot ::

    //Quand dans un thème avec un nom de 'purple_cupcake'
    $this->Html->css('main.css');
     
    //crée un chemin comme
    /theme/purple_cupcake/css/main.css
     
    //et fait un lien vers
    app/View/Themed/PurpleCupcake/webroot/css/main.css 

Augmenter la performance des assets du plug-in et du thème
----------------------------------------------------------

C'est un fait bien connu que de servir les assets par le biais de PHP est 
assuré d'être plus lent que de servir ces assets sans invoquer PHP. Et 
tandis que l'équipe du coeur a pris des mesures pour rendre le plugin et 
l'asset du thème servis aussi vite que possible, il peut y avoir des 
situations où plus de performance est requis. Dans ces situations, il 
est recommandé soit que vous fassiez un lien symbolique soit que vous 
fassiez une copie sur les assets du plug-in/thème à des répertoires 
dans ``app/webroot`` avec des chemins correspondant à ceux utilisés par cakephp.

-  ``app/Plugin/DebugKit/webroot/js/my_file.js`` devient
   ``app/webroot/DebugKit/js/my_file.js``
-  ``app/View/Themed/Navy/webroot/css/navy.css`` devient
   ``app/webroot/theme/Navy/css/navy.css``


.. meta::
    :title lang=fr: Thèmes
    :keywords lang=fr: environnements de production,dossier du thème,fichiers layout,requêtes de développement,fonctions de callback,structure de dossier,vue par défaut,dispatcher,lien symbolique,cas de base,layouts,assets,cakephp,thèmes,avantage
