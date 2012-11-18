Plugins
#######

CakePHP vous permet de mettre en place une combinaison de contrôleurs,
modèles et vues et de les distribuer comme un plugin d'application
packagé que d'autres peuvent utiliser dans leurs applications CakePHP.
Vous avez un module de gestion des utilisateurs sympa, un simple blog,
ou un module de service web dans une de vos applications ? Packagez le
en plugin CakePHP afin de pouvoir la mettre dans d'autres applications.

Le principal lien entre un plugin et l'application dans laquelle il a
été installé, est la configuration de l'application (connexion à la base
de données, etc.). Autrement, il fonctionne dans son propre espace, se
comportant comme il l'aurait fait si il était une application à part
entière.

Créer un Plugin
===============

Comme exemple de travail, créons un nouveau plugin qui commande des
pizzas pour vous. Pour commencer, nous aurons besoin de placer les
fichiers de notre plugin dans le dossier /app/plugins. Le nom du dossier
parent pour tous les fichiers de plugin est important, et sera utilisé
dans plusieurs endroits, alors choisissez-le judicieusement. Pour ce
plugin, utilisons le nom '**pizza**\ '. Voici comme votre installation
devrait éventuellement se présenter :

::

    /app
         /plugins
             /pizza
                 /controllers                <- les contrôleurs du plugin vont ici
                 /models                     <- les modèles du plugin vont ici
                 /views                      <- les vues du plugin vont ici
                 /pizza_app_controller.php   <- AppController du plugin
                 /pizza_app_model.php        <- AppModel du plugin 

Si vous voulez pouvoir accéder à votre plugin par une URL, il est
obligatoire de définir AppController et AppModel pour ce plugin. Ces
deux classes spéciales se nomment de la même manière que le plugin et
étendent du AppController et AppModel de l'application parente. Voici ce
à quoi ils devraient ressembler dans notre exemple de pizza :

::

    // /app/plugins/pizza/pizza_app_controller.php:
    <?php
    class PizzaAppController extends AppController {
         //...
    }
    ?>

::

    // /app/plugins/pizza/pizza_app_model.php:
    <?php
    class PizzaAppModel extends AppModel {
           //...
    }
    ?>

Si vous oubliez de définir ces classes spéciales, CakePHP vous délivrera
une erreur "Contrôleur manquant" ("*Missing Controller*\ ") jusqu'à ce
que vous l'ayez fait.

Contrôleurs du Plugin
=====================

Les contrôleurs de notre plugin de pizza seront stockés dans
/app/plugins/pizza/controllers/. Comme la principale chose que nous
allons pister sont des commandes de pizza, nous aurons besoin d'un
contrôleur CommandesController pour ce plugin.

Bien que cela ne soit pas obligatoire, il est recommandé de nommer les
contrôleurs de vos Plugins d'une manière relativement unique afin
d'éviter des conflits d'espaces de noms avec les applications parentes.
Il n'est pas idiot de penser qu'une application parente peut avoir un
contrôleur UtilisateursController, CommandesController, ou
ProduitsController : c'est pour cela qu'il vous faudra être créatif avec
les noms de vos contrôleurs, ou bien ajouter le nom du plugin au nom de
la classe (PizzaCommandesController dans ce cas).

Donc, nous plaçons notre nouveau PizzaCommandesController dans
/app/plugins/pizza/controllers et il ressemble à ceci :

::

    // /app/plugins/pizza/controllers/pizza_commandes_controller.php
    class PizzaCommandesController extends PizzaAppController {
        var $name = 'PizzaCommandes';
        var $uses = array('Pizza.PizzaCommande');
        function index() {
            //...
        }
    }

Ce contrôleur hérite du AppController du plugin (appelé
PizzaAppController) plutôt que du AppController de l'application
parente.

Notons également que le nom du modèle est préfixé avec le nom du plugin.
Cette ligne de code est ajoutée pour être plus clair mais n'est pas
nécessaire pour cet exemple.

Si vous voulez accéder à ce que nous avons fait jusqu'à présent, visitez
/pizza/pizza\_commandes. Vous devriez obtenir une erreur "Modèle
manquant" ("Missing Model") car nous n'avons pas encore de modèle
PizzaCommande défini.

Modèles du Plugin
=================

Les modèles de notre plugin de pizza seront stockés dans
/app/plugins/pizza/models/. Nous avons déjà défini un contrôleur
PizzaCommandesController pour ce plugin, alors créons le modèle de ce
contrôleur, nommé PizzaCommande. PizzaCommande est cohérent avec notre
schéma de nommage précédemment défini, à savoir préfixer toutes nos
classes de plugin avec Pizza.

::

    // /app/plugins/pizza/models/pizza_commande.php:
    class PizzaCommande extends PizzaAppModel {
        var $name = 'PizzaCommande';
    }
    ?>

Visiter /pizza/pizzaCommandes maintenant (en supposant que vous ayez une
table nommée "pizza\_commandes" dans votre base de données) devrait vous
donner une erreur "Vue manquante" ("*Missing View*\ "). Nous la créerons
après.

Si vous avez besoin de référencer un modèle dans votre plugin, vous
devrez inclure le nom du plugin avec le nom du modèle, séparés par un
point.

Par exemple :

::

    // /app/plugins/pizza/models/pizza_commande.php:
    class ModeleExemple extends PizzaAppModel {
        var $name = 'ModeleExemple';
            var $hasMany = array('Pizza.PizzaCommande');
    }
    ?>

Si vous préférez que les clés du tableau de l'association n'aient pas le
préfixe du plugin avec elles, utilisez la syntaxe alternative :

::

    // /app/plugins/pizza/models/pizza_commande.php:
    class ModeleExemple extends PizzaAppModel {
        var $name = 'ModeleExemple';
            var $hasMany = array(
                    'PizzaCommande' => array(
                            'className' => 'Pizza.PizzaCommande'
                    )
            );
    }
    ?>

Vues du plugin
==============

Les vues se comportent exactement comme elles le font dans les
applications normales. Placez les simplement dans le bon dossier à
l'intérieur du dossier /app/plugins/[plugin]/views/ Pour notre plugin de
commande de pizza, nous aurons besoin d'une vue pour notre action
PizzaCommandesController::index(), alors ajoutons là également :

::

    // /app/plugins/pizza/views/pizza_commandes/index.ctp:
    <h1>Commander une pizza</h1>
    <p>Rien ne va mieux avec un Gâteau qu'une bonne pizza !</p>
    <!-- Un formulaire de commande devrait être ici ...-->

Pour plus d'information sur l'utilisation d'éléments à partir d'un
plugin, allez voir `Appeler des éléments à partir d'un
plugin </fr/view/97/Elements#Requesting-Elements-from-a-Plugin-562>`_

Overriding plugin views from inside your application
----------------------------------------------------

You can override any plugin views from inside your app using special
paths. If you have a plugin called 'Pizza' you can override the view
files of the plugin with more application specific view logic by
creating files using the following template
"app/views/plugins/$plugin/$controller/$view.ctp". For the pizza
controller you could make the following file:

::

    /app/views/plugins/pizza/pizza_orders/index.ctp

Creating this file, would allow you to override
"/app/plugins/pizza/views/pizza\_orders/index.ctp".

Composants, Assistants et Comportements
=======================================

Un plugin peut avoir des Composants, des Assistants et des Comportements
comme toute application CakePHP normale. Vous pouvez même créer des
plugins qui ne soient que des Composants, Assistants ou Comportements,
ce qui peut être une belle manière de construire des composants
réutilisables, qui pourront être ajoutés facilement à tout projet.

Construire ces composants est exactement la même chose que de les
construire dans une application classique, sans convention particulière
de nommage. Se référer à vos composants à l'intérieur du plugin, n'exige
pas non plus de référence particulière.

::

    // Composant
    class ExempleComponent extends Object {

    }

    // dans le contrôleur de votre Plugin
    var $components = array('Exemple'); 

Pour référencer le Composant à l'extérieur du plugin, il est nécessaire
de référencer le nom du plugin.

::

    var $components = array('PluginNom.Exemple');
    var $components = array('Pizza.Exemple'); // référence ExempleComponent du plugin Pizza.

La même technique est appliquée aux Assistants et Comportements.

Images, CSS et Javascript de Plugin
===================================

Vous pouvez ajouter des fichiers Images, Javascripts ou CSS spécifiques
dans vos plugins. Ces fichiers associés doivent être respectivement
placés dans ``votre_plugin/vendors/img``, ``votre_plugin/vendors/css``
et ``votre_plugin/vendors/js``. Ils peuvent être liés à vos vues tout
comme les helpers du core.

::

    <?php echo $html->image('/votre_plugin/img/mon_image.png'); ?>

    <?php echo $html->css('/votre_plugin/css/mon_css'); ?>

    <?php echo $javascript->link('/votre_plugin/js/super_script');

Les exemples ci-dessus montrent comment lier des fichiers images,
javascript et CSS à votre plugin.

Il est important de noter le préfixe **/votre\_plugin/** devant le
chemin des img, js ou css. C'est ce qui fait que ça marche !

Conseils et astuces
===================

Bien, maintenant que vous avez tout développé, vous êtes prêt à
distribuer votre plugin (nous vous suggérons d'ailleurs d'y joindre
quelques bonus, comme un fichier LisezMoi ou un fichier SQL).

Une fois que le plugin a été installé dans /app/plugins, vous pouvez y
accéder à partir de l'url /nomduplugin/nomducontroleur/action. Dans
notre exemple de commandes de pizzas, nous accéderons à notre
CommandePizzaController par l'url /pizza/commandePizzas.

Encore quelques conseils et astuces pour travailler avec des plugins
dans vos applications CakePHP :

-  Quand vous n'avez pas un [plugin]AppController et un
   [plugin]AppModel, vous aurez un message d'erreur "contrôleur
   manquant" quand vous tenterez d'accéder au contrôleur du plugin.
-  Vous pouvez avoir un contrôleur par défaut avec le nom de votre
   plugin. Si vous faites cela, vous pouvez y accéder par
   /[plugin]/action. Par exemple, un plugin "utilisateurs" avec un
   contrôleur "UtilisateursController" peut être appelé avec
   /utilisateurs/ajout s'il n'y a pas de contrôleur appelé
   AjoutController dans votre dossier [plugin]/controllers.
-  Vous pouvez définir vos propres mises en page pour vos plugins, dans
   le dossier /app/plugins/[plugin]/views/layouts. Si ce n'est pas le
   cas, les plugins utiliseront par défaut les mises en page du dossier
   /app/views/layouts.
-  Vous pouvez faire communiquer vos plugins entre eux en utilisant
   $this->requestAction('/plugin/controller/action') dans vos
   contrôleurs.
-  Si vous utilisez *requestAction*, soyez certain que vos contrôleurs
   et vos modèles aient des noms uniques. Dans le cas contraire, vous
   risquez d'avoir des erreurs PHP "classe redéfinie...".

