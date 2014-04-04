Plugins
#######

CakePHP vous permet de mettre en place une combinaison de controllers,
models et vues et de les distribuer comme un plugin d'application
packagé que d'autres peuvent utiliser dans leurs applications CakePHP.
Vous avez un module de gestion des utilisateurs sympa, un simple blog,
ou un module de service web dans une de vos applications ? Packagez le
en plugin CakePHP afin de pouvoir la mettre dans d'autres applications.

Le principal lien entre un plugin et l'application dans laquelle il a été
installé, est la configuration de l'application (connexion à la base de
données, etc.). Autrement, il fonctionne dans son propre espace, se comportant
comme il l'aurait fait si il était une application à part entière.

Dans CakePHP 3.0 chaque plugin définit son namespace de top-niveau. Par exemple
``DebugKit``.

Installer un Plugin
===================

Plusieurs plugins sont disponibles sur `packagist <http://packagist.org>`_
et peuvent être installés avec ``composer``. Pour installer DebugKit, vous
feriez ce qui suit::

    php composer.phar require cakephp/debug_kit

Ceci installerait la dernière version de DebugKit et mettrait à jour vos
fichiers ``composer.json``, ``composer.lock``, et mettrait à jour votre
autoloader. Si le plugin que vous voulez installer n'est pas disponible sur
packagist.org. Vous pouvez cloner ou copier le code du plugin dans votre
répertoire ``/Plugin``. En supposant que vous voulez installer un plugin
appelé 'ContactManager', vous auriez un dossier dans ``/Plugin``
appelé 'ContactManager'. Dans ce répertoire se trouvent les View, Model,
Controller, webroot, et tous les autres répertoires du plugin.

Charger un Plugin
=================

Après avoir installé un plugin et mis à jour l'autoloader, vous aurez besoin
de charger le plugin. Vous pouvez charger les plugins un par un, ou tous d'un
coup avec une méthode unique::

    // Charge un Plugin unique
    Plugin::load('ContactManager');

    // Charge tous les plugins en une fois
    Plugin::loadAll();

``loadAll()`` charge tous les plugins disponibles, vous permettant de définir
certaines configurations pour des plugins spécifiques. ``load()`` fonctionne
de la même manière, mais charge seulement les plugins que vous avez spécifié
explicitement.

.. note::

    Vous *n'avez pas* besoin de charger un plugin pour accéder aux components,
    behaviors ou helpers dans un plugin. Vous *n'avez pas* besoin de charger un
    plugin si vous avez besoin d'accéder à ses controllers, webroot assets ou
    ses commandes de console.

Configuration du Plugin
=======================

Vous pouvez faire beaucoup de choses avec les méthodes ``load`` et ``loadAll``
pour vous aider avec la configuration et le routing d'un plugin. Peut-être
souhaiterez vous charger tous les plugins automatiquement, en spécifiant
des routes et des fichiers de bootstrap pour certains plugins::

    Plugin::loadAll([
        'Blog' => ['routes' => true],
        'ContactManager' => ['bootstrap' => true],
        'WebmasterTools' => ['bootstrap' => true, 'routes' => true],
    ]);

Avec ce type de configuration, vous n'avez plus besoin de faire manuellement un
include() ou un require() d'une configuration de plugin ou d'un fichier de
routes--Cela arrive automatiquement au bon moment et à la bonne place. Un
paramètre totalement identique peut avoir été fourni à la méthode load(),
ce qui aurait chargé seulement ces trois plugins, et pas le reste.

Au final, vous pouvez aussi spécifier un ensemble de valeurs dans defaults pour
``loadAll`` qui s'applique à chaque plugin qui n'a pas de configuration
spécifique.

Chargez le fichier bootstrap à partir de tous les plugins, et les routes à
partir du plugin Blog::
    
    Plugin::loadAll([
        ['bootstrap' => true],
        'Blog' => ['routes' => true]
    ]);


Notez que tous les fichiers spécifiés doivent réellement exister dans le(s)
plugin(s) configurés ou PHP vous donnera des avertissements pour chaque
fichier qu'il ne peut pas charger. Vous pouvez éviter les avertissements
potentiels en utilisantt l'option ``ignoreMissing``::

    Plugin::loadAll([
        ['ignoreMissing' => true, 'bootstrap' => true],
        'Blog' => ['routes' => true]
    ]);

Par défaut le namespace du Plugin doit correspondre au nom du plugin. Si ce
n'est pas le cas, vous pouvez utiliser l'option ``namespace`` pour fournir un
namespace différent. Par exemple vous avez un plugin Users qui utilise
en fait ``Jose\\Users`` pour namespace::

    Plugin::load('Users', ['namespace' => 'Jose\Users']);

Cela va assurer que les noms de classe sont résolus correctement lors de
l'utilisation de la :term:`plugin syntax`.

La plupart des plugins va indiquer la procédure correcte pour les configurer et
configurer la base de données dans leur documentation. Certains plugins
nécessitent plus de configuration que les autres.

Utiliser un Plugin
==================

Vous pouvez référencer les controllers, models, components, behaviors et
helpers du plugin en préfixant le nom du plugin avant le nom de classe.

Par exemple, disons que vous voulez utiliser le ContactInfoHelper du plugin
ContactManager pour sortir de bonnes informations de contact dans une de
vos vues. Dans votre controller, le tableau $helpers pourrait ressembler
à ceci::

    public $helpers = array('ContactManager.ContactInfo');

Vous serez ensuite capable d'accéder à ContactInfoHelper comme tout autre
helper dans votre vue, comme ceci::

    echo $this->ContactInfo->address($contact);


Créer Vos Propres Plugins
=========================

En exemple de travail, commençons par créer le plugin ContactManager
référencé ci-dessus. Pour commencer, nous allons configurer votre structure
de répertoire basique. Cela devrait ressembler à ceci::

    /App
    /Plugin
        /ContactManager
            /Controller
                /Component
            /Model
                /Behavior
            /View
                /Helper
                /Layout
                    
Notez que le nom du dossier du plugin, '**ContactManager**'. Il est important
que ce dossier ait le même nom que le plugin.

Dans le dossier plugin, vous remarquerez qu'il ressemble beaucoup à une
application CakePHP, et c'est au fond ce que c'est. Vous n'avez à inclure
aucun de vos dossiers si vous ne les utilisez pas. Certains plugins peuvent
ne contenir qu'un Component ou un Behavior, et dans certains cas, ils peuvent
carrément ne pas avoir de répertoire 'View'.

Un plugin peut aussi avoir tous les autres répertoires que votre application a,
comme Config, Console, Lib, webroot, etc...

Si vous souhaitez être capable d'accéder à votre plugin avec une URL,
définir un AppController et AppModel pour le plugin est nécessaire. Ces deux
classes spéciales sont nommées d'après le plugin, et étendent les parents de
l'application AppController et AppModel. Voilà à quoi ils devraient ressembler
pour notre exemple ContactManager::

    // /Plugin/ContactManager/Controller/ContactManagerAppController.php:
    namespace ContactManager\Controller;

    use App\Controller\Controller;

    class ContactManagerAppController extends AppController {
    }

    // /Plugin/ContactManager/Model/ContactManagerAppModel.php:
    namespace ContactManager\Model;

    use App\Model\AppModel;

    class ContactManagerAppModel extends AppModel {
    }

Si vous oubliez de définir ces classes spéciales, CakePHP vous donnera
des erreurs "Missing Controller" jusqu'à ce que ce soit fait.

Merci de noter que le processus de création de plugins peut être méchamment
simplifié en utilisant le shell de CakePHP.

Pour cuisiner un plugin, merci d'utiliser la commande suivante::

    user@host$ cake bake plugin ContactManager

Maintenant vous pouvez cuisiner en utilisant les mêmes conventions qui
s'appliquent au reste de votre app. Par exemple - baking controllers::

    user@host$ cake bake controller Contacts --plugin ContactManager

Merci de vous référer au chapitre
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
``/Plugin/ContactManager/Controller/``. Puisque la principale chose que
nous souhaitons faire est la gestion des contacts, nous aurons besoin de créer
un ContactsController pour ce plugin.

Ainsi, nous mettons notre nouveau ContactsController dans
``/Plugin/ContactManager/Controller`` et il ressemblerait à cela::

    // /Plugin/ContactManager/Controller/ContactsController.php
    namespace ContactManager\Controller;

    use ContactManager\Controller\ContactManagerAppController;

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

Les Models pour le plugin sont stockés dans ``/Plugin/ContactManager/Model``.
Nous avons déjà défini un ContactsController pour ce plugin, donc créons le
model pour ce controller, appelé Contact::

    // /Plugin/ContactManager/Model/Contact.php:
    namespace ContactManager;

    use ContactManager\Model\ContactManagerAppModel;

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

    // /Plugin/ContactManager/Model/Contact.php:
    namespace ContactManager;

    use ContactManager\Model\ContactManagerAppModel;

    class Contact extends ContactManagerAppModel {
        public $hasMany = array('ContactManager.AltName');
    }

Si vous préférez que les clés du tableau pour l'association n'aient pas
le préfixe du plugin sur eux, utilisez la syntaxe alternative::

    // /Plugin/ContactManager/Model/Contact.php:
    namespace ContactManager;

    use ContactManager\Model\ContactManagerAppModel;

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

    // /Plugin/ContactManager/View/Contacts/index.ctp:
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

    /App/View/Plugin/ContactManager/Contacts/index.ctp

Créer ce fichier vous permettra de redéfinir
``/Plugin/ContactManager/View/Contacts/index.ctp``.

.. _plugin-assets:


Plugin assets
=============

Les assets web du plugin (mais pas les fichiers de PHP) peuvent être servis
à travers le répertoire 'webroot' du plugin, juste comme les assets de
l'application principale::

    /Plugin/ContactManager/webroot/
                                   css/
                                   js/
                                   img/
                                   flash/
                                   pdf/

Vous pouvez mettre tout type de fichier dans tout répertoire, juste comme
un webroot habituel.

.. warning::

    La gestion des assets static, comme les fichiers images, Javascript et CSS,
    à travers le Dispatcher est très inéfficace. Regardez :ref:`symlink-assets`
    pour plus d'informations.

Lier aux plugins
----------------

Vous pouvez utiliser la :term:`plugin syntax` pour lier les assets de plugin
en utilisant les méthodes script :php:class:`Cake\\View\\Helper\\HtmlHelper`,
image, ou css::

    // Génére une url de /contact_manager/css/styles.css
    echo $this->Html->css('ContactManager.styles');

    // Génére une url de /contact_manager/js/widget.js
    echo $this->Html->script('ContactManager.widget');

    // Génére une url de /contact_manager/img/logo.js
    echo $this->Html->image('ContactManager.logo');

Les assets de Plugin sont servis en utilisant ``AssetDispatcher`` middleware par
défaut. C'est seulement recommandé pour le développement. En production vous
devrez :ref:`symlink-assets <symlink plugin assets>` pour améliorer la
performance.

Si vous n'utilisez pas les helpers, vous pouvez préfixer /plugin_name/ au
début de l'URL pour servir un asset du plugin . Lier avec
'/contact_manager/js/some_file.js' servirait l'asset
``Plugin/ContactManager/webroot/js/some_file.js``.

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
votre plugin nécessite seulement que vous préfixiez le nom du plugin avant le nom
du component. Par exemple::

    // Component défini dans le plugin 'ContactManager'
    namespace ContactManager\Controller\Component;

    use Cake\Controller\Component;

    class ExampleComponent extends Component {
    }

    // dans vos controllers:
    public $components = array('ContactManager.Exemple');

La même technique s'applique aux Helpers et aux Behaviors.

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

Une fois qu'un plugin a été installé dans /Plugin, vous pouvez y accéder
à l'URL /nom_plugin/nom_controller/action. Dans notre exemple de plugin
ContactManager, nous accédons à notre ContactsController à l'adresse
/contact_manager/contacts.

Quelques astuces de fin lorque vous travaillez avec les plugins dans vos
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



.. meta::
    :title lang=fr: Plugins
    :keywords lang=fr: dossier plugin,configuration de la base de données,bootstrap,module de gestion,peu d'espace,connexion base de données,webroot,gestion d'utilisateur,contactmanager,tableau,config,cakephp,models,php,répertoires,blog,plugins,applications
