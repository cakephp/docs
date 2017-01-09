Comment Créer des Plugins
#########################

En exemple de travail à partir de la section :doc:`/plugins/how-to-use-plugins`,
commençons par créer le plugin ContactManager
référencé ci-dessus. Pour commencer, nous allons définir la structure basique
du répertoire. Cela devrait ressembler à ceci::

    /app
        /Plugin
            /ContactManager
                /Controller
                    /Component
                /Model
                    /Behavior
                /View
                    /Helper
                    /Layouts

Notez que le nom du dossier du plugin, '**ContactManager**'. Il est important
que ce dossier ait le même nom que le plugin.

Dans le dossier plugin, vous remarquerez qu'il ressemble beaucoup à une
application CakePHP, et c'est au fond ce que c'est. Vous n'avez à inclure
aucun de vos dossiers si vous ne les utilisez pas. Certains plugins peuvent
ne contenir qu'un Component ou un Behavior, et dans certains cas, ils peuvent
carrément ne pas avoir de répertoire 'View'.

Un plugin peut aussi avoir tous les autres répertoires que votre application a,
comme Config, Console, Lib, webroot, etc...

.. note::

    Si vous voulez être capable d'accéder à votre plugin avec une URL, vous
    devrez définir un AppController et un AppModel pour le plugin. Ces deux
    classes spéciales sont nommées d'après le plugin, et étendent les
    AppController et AppModel de notre application parente. Voilà à quoi cela
    devrait ressembler pour notre exemple de ContactManager:

::

    // /app/Plugin/ContactManager/Controller/ContactManagerAppController.php:
    class ContactManagerAppController extends AppController {
    }

::

    // /app/Plugin/ContactManager/Model/ContactManagerAppModel.php:
    class ContactManagerAppModel extends AppModel {
    }

Si vous oubliez de définir ces classes spéciales, CakePHP vous donnera
des erreurs "Missing Controller" jusqu'à ce que ce soit fait.

Notez que le processus de création de plugins peut être
simplifié en utilisant le shell de CakePHP.

Pour cuisiner un plugin, utilisez la commande suivante::

    user@host$ cake bake plugin ContactManager

Maintenant vous pouvez cuisiner en utilisant les mêmes conventions qui
s'appliquent au reste de votre app. Par exemple - baking controllers::

    user@host$ cake bake controller Contacts --plugin ContactManager

Consultez le chapitre
:doc:`/console-and-shells/code-generation-with-bake` si vous avez le moindre
problème avec l'utilisation de la ligne de commande.

.. warning::

    Les Plugins ne fonctionnent pas en namespace pour séparer le code.
    A cause du manque de namespaces de PHP dans les versions plus vieilles, vous
    ne pouvez pas avoir la même classe ou le même nom de fichier dans vos
    plugins. Même si il s'agit de deux plugins différents. Donc utilisez des
    classes et des noms de fichier uniques, en préfixant si possible la classe
    et le nom de fichier par le nom du plugin.


Controllers du Plugin
=====================

Les controllers pour notre plugin ContactManager seront stockés dans
/app/Plugin/ContactManager/Controller/. Puisque la principale chose que
nous souhaitons faire est la gestion des contacts, nous aurons besoin de créer
un ContactsController pour ce plugin.

Ainsi, nous mettons notre nouveau ContactsController dans
/app/Plugin/ContactManager/Controller et il ressemblerait à cela::

    // app/Plugin/ContactManager/Controller/ContactsController.php
    class ContactsController extends ContactManagerAppController {
        public $uses = array('ContactManager.Contact');

        public function index() {
            //...
        }
    }

.. note::

    Ce controller étend AppController du plugin (appelé
    ContactManagerAppController) plutôt que l'AppController de l'application
    parente.

    Notez aussi comment le nom du model est préfixé avec le nom du plugin.
    C'est nécessaire pour faire la différence entre les models dans les
    plugins et les models dans l'application principale.

    Dans ce cas, le tableau $uses ne serait pas nécessaire comme dans
    ContactManager. Contact sera le model par défaut pour ce controller,
    cependant, il est inclu pour démontrer comment faire préceder proprement
    le nom du plugin.

Si vous souhaitez accéder à ce que nous avons obtenu jusqu'à présent, visitez
/contact_manager/contacts. Vous devriez obtenir une erreur "Missing Model"
parce que nous n'avons pas un model Contact déjà défini.

.. _plugin-models:

Models du Plugin
================

Les Models pour le plugin sont stockés dans /app/Plugin/ContactManager/Model.
Nous avons déjà défini un ContactsController pour ce plugin, donc créons le
model pour ce controller, appelé Contact::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
    }

Visiter /contact_manager/contacts maintenant (Etant donné, que vous avez une
table dans votre base de données appelée 'contacts') devrait nous donner une
erreur "Missing View".
Créons la ensuite.

.. note::

    Si vous avez besoin de réferencer un model dans votre plugin, vous avez
    besoin d'inclure le nom du plugin avec le nom du model, séparé d'un
    point.

Par exemple::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
        public $hasMany = array('ContactManager.AltName');
    }

Si vous préférez que les clés du tableau pour l'association n'aient pas
le préfixe du plugin sur eux, utilisez la syntaxe alternative::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
        public $hasMany = array(
            'AltName' => array(
                'className' => 'ContactManager.AltName'
            )
        );
    }

Vues du Plugin
==============

Les Vues se comportent exactement comme elles le font dans les applications
normales. Placez-les juste dans le bon dossier à l'intérieur du dossier
/app/Plugin/[PluginName]/View/. Pour notre plugin ContactManager, nous aurons
besoin d'une vue pour notre action ContactsController::index(), ainsi incluons
ceci aussi::

    // /app/Plugin/ContactManager/View/Contacts/index.ctp:
    <h1>Contacts</h1>
    <p>Ce qui suit est une liste triable de vos contacts</p>
    <!-- Une liste triable de contacts irait ici....-->

.. note::

    Pour des informations sur la façon d'utiliser les elements à partir d'un
    plugin, regardez :ref:`view-elements`.

Redéfinition des vues de plugin à partir de l'intérieur de votre application
----------------------------------------------------------------------------

Vous pouvez redéfinir toutes les vues du plugin à partir de l'intérieur de
votre app en utilisant des chemins spéciaux. Si vous avez un plugin appelé
'ContactManager', vous pouvez redéfinir les fichiers de vue du plugin avec
une logique de vue de l'application plus spécifique, en créant des fichiers en
utilisant le template suivant
"app/View/Plugin/[Plugin]/[Controller]/[view].ctp". Pour le controller
Contacts, vous pouvez faire le fichier suivant::

    /app/View/Plugin/ContactManager/Contacts/index.ctp

Créer ce fichier vous permettra de redéfinir
"/app/Plugin/ContactManager/View/Contacts/index.ctp".

.. _plugin-assets:


Assets du Plugin
================

Les assets web du plugin (mais pas les fichiers de PHP) peuvent être servis
à travers le répertoire 'webroot' du plugin, tout comme les assets de
l'application principale::

    app/Plugin/ContactManager/webroot/
                                        css/
                                        js/
                                        img/
                                        flash/
                                        pdf/

Vous pouvez mettre tout type de fichier dans tout répertoire, juste comme
un webroot habituel.

Mais garder à l'esprit que la gestion des assets statiques, comme les images,
le Javascript et les fichiers CSS des plugins à travers le Dispatcher est
incroyablement inefficace. Il est grandement recommandé de les symlinker pour
la production.
Par exemple comme ceci::

    ln -s app/Plugin/YourPlugin/webroot/css/yourplugin.css app/webroot/css/yourplugin.css

Lier aux plugins
----------------

Faîtes précéder simplement /nom_plugin/ pour le début d'une requête pour
un asset dans ce plugin, et cela fonctionnera comme si l'asset était dans le
webroot de votre application.

Par exemple, lier le '/contact_manager/js/some_file.js'
servira l'asset
'app/Plugin/ContactManager/webroot/js/some_file.js'.

.. note::

    Il est important de noter le préfixe **/votre_plugin/** avant le
    chemin de l'asset. Et la magie opére!

.. versionchanged:: 2.1

    Utilisez la :term:`syntaxe de plugin` pour accéder aux assets. Par exemple
    dans votre View::

        <?php echo $this->Html->css("ContactManager.style"); ?>


Components, Helpers et Behaviors
================================

Un plugin peut avoir des Components, Helpers et Behaviors tout comme
une application CakePHP classique. Vous pouvez soit créer des plugins
qui sont composés seulement de Components, Helpers ou Behaviors ce qui
peut être une bonne façon de construire des Components réutilisables
qui peuvent être facilement déplacés dans tout projet.

Construire ces components est exactement la même chose que de les construire
à l'intérieur d'une application habituelle, avec aucune convention spéciale
de nommage.

Faire référence avec votre component, depuis l'intérieur ou l'extérieur de
votre plugin nécessite seulement que vous préfixiez le nom du plugin avant le
nom du component. Par exemple::

    // Component défini dans le plugin 'ContactManager'
    class ExampleComponent extends Component {
    }

    // dans vos controllers:
    public $components = array('ContactManager.Example');

La même technique s'applique aux Helpers et aux Behaviors.

.. note::

    À la création de Helpers, vous verrez que AppHelper n'est pas
    automatiquement disponible. Vous pouvez déclarer les ressources dont vous
    avez besoin avec les uses::

        // Déclarez le use de AppHelper pour le Helper de votre Plugin
        App::uses('AppHelper', 'View/Helper');

Etendez votre Plugin
====================

Cet exemple est un bon début pour un plugin, mais il y a beaucoup plus
à faire. En règle général, tout ce que vous pouvez faire avec votre
application, vous pouvez le faire à l'intérieur d'un plugin à la place.

Continuez, incluez certaines librairies tierces dans 'Vendor', ajoutez
de nouveaux shells à la console de cake, et n'oubliez pas de créer des cas
de test ainsi les utilisateurs de votre plugin peuvent automatiquement tester
les fonctionnalités de votre plugin!

Dans notre exemple ContactManager, nous pourrions créer des actions
add/remove/edit/delete dans le ContactsController, intégrer la validation
dans le model Contact, et intégrer la fonctionnalité à laquelle on
pourrait s'attendre quand on gère ses contacts. A vous de décider ce qu'il
faut intégrer dans vos plugins. N'oubliez juste pas de partager votre code
avec la communauté afin que tout le monde puisse bénéficier de votre
component génial et réutilisable!

Astuces pour les Plugins
========================

Une fois qu'un plugin a été installé dans /app/Plugin/, vous pouvez y accéder
à l'URL /nom_plugin/nom_controller/action. Dans notre exemple de plugin
ContactManager, nous accédons à notre ContactsController à l'adresse
/contact_manager/contacts.

Quelques astuces de fin lorsque vous travaillez avec les plugins dans vos
applications CakePHP:

-  Si vous n'avez pas un [Plugin]AppController et
   [Plugin]AppModel, vous aurez des erreurs de type get missing Controller
   lorsque vous essayez d'accéder à un controller d'un plugin.
-  Vous pouvez définir vos propres layouts pour les plugins, dans le dossier
   app/Plugin/[Plugin]/View/Layouts. Sinon, les plugins utiliseront les
   layouts du dossier /app/View/Layouts par défaut.
-  Vous pouvez établir une communication inter-plugin en utilisant
   ``$this->requestAction('/plugin_name/controller_name/action');`` dans vos
   controllers.
-  Si vous utilisez requestAction, assurez-vous que les noms des controllers
   et des models sont aussi uniques que possibles. Sinon, vous aurez des
   erreurs PHP de type "redefined class ...".
-  Quand vous ajoutez des routes avec des extensions à votre plugin,
   assurez-vous d'utilisez ``Router::setExtensions()`` pour ne pas devoir
   surcharger le routing de l'application.

Publiez votre Plugin
====================

Vous pouvez ajouter votre plugin sur
`plugins.cakephp.org <https://plugins.cakephp.org>`_ ou le proposer à la
`liste awesome-cakephp <https://github.com/FriendsOfCake/awesome-cakephp>`_.

Aussi, vous pouvez créer un fichier composer.json et publier votre plugin
sur `packagist.org <https://packagist.org/>`_.
De cette façon, il peut être facilement utilisé avec Composer.

Choisissez un nom de package avec une sémantique qui a du sens. Il devra
idéalement être préfixé avec la dépendance, dans ce cas "cakephp" comme le
framework.
Le nom de vendor sera habituellement votre nom d'utilisateur sous GitHub.
**N'utilisez pas** le namespace CakePHP (cakephp) puisqu'il est reservé
aux plugins appartenant à CakePHP.
La convention est d'utiliser les lettres en minuscule et les tirets en
séparateur.

Donc si vous créez un plugin "Logging" avec votre compte GitHub "FooBar", un
bon nom serait `foo-bar/cakephp-logging`.
Et le plugin "Localized" appartenant à  CakePHP peut être trouvé dans
`cakephp/localized`.

.. meta::
    :title lang=fr: Comment Créer des Plugins
    :keywords lang=fr: dossier plugin,configuration base de données,management module,peu d'espace,webroot,contactmanager,tableau,config,cakephp,models,php,répertoires,blog,plugins,applications
