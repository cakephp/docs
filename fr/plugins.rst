Plugins
#######

CakePHP vous permet de mettre en place une combinaison de contrôleurs, 
models et vues et de les distribuer comme un plugin d'application 
packagé que d'autres peuvent utiliser dans leurs applications CakePHP. 
Vous avez un module de gestion des utilisateurs sympa, un simple blog, 
ou un module de service web dans une de vos applications ? Packagez le 
en plugin CakePHP afin de pouvoir la mettre dans d'autres applications.

Le principal lien entre un plugin et l'application dans laquelle il a été 
installé, est la configuration de l'application (connexion à la base de 
données, etc.). Autrement, il fonctionne dans son propre espace, se comportant 
comme il l'aurait fait si il était une application à part entière.

Installer un Plugin
===================

Pour installer un plugin, commencez par simplement déplacer le dossier du 
du plugin dans votre dossier app/Plugin. Si vous installez un plugin nommé 
'ContactManager' alors vous devez avoir un dossier dans app/Plugin
appelé 'ContactManager' dans lequel vous aurez les Vues, les Models, les 
Controllers, webroot et tout autre répertoire du Plugin.

Nouveau dans CakePHP 2.0, les plugins ont besoin d'être chargés manuellement 
dans app/Config/bootstrap.php.

Vous pouvez soit les charger un par un, soit tous d'un coup dans un seul appel::

    CakePlugin::loadAll(); // Charge tous les plugins d'un coup
    CakePlugin::load('ContactManager'); //Charge un seul plugin


loadAll charge tous les plugins disponibles, bien que vous autorisant à 
configurer certains paramètres pour des plugins spécifiques. ``load()``
fonctionne de la même manière, mais charge seulement les plugins que vous avez 
explicitement spécifiés.

Configuration du Plugin
=======================

Vous pouvez faire beaucoup de choses avec les méthodes load et loadAll pour 
vous aider avec la configuration et le routing d'un plugin. Peut-être 
souhaiterez vous charger tous les plugins automatiquement, en spécifiant 
des routes et des fichiers de bootstrap pour certains plugins.

Pas de problèmes::

    CakePlugin::loadAll(array(
        'Blog' => array('routes' => true),
        'ContactManager' => array('bootstrap' => true),
        'WebmasterTools' => array('bootstrap' => true, 'routes' => true),
    ));

Avec ce type de configuration, vous n'avez plus besoin d'include() ou de 
require() manuellement une configuration de plugin ou un fichier de 
routes--Cela arrive automatiquement au bon moment et à la bonne place. Un 
paramètre totalement identique peut avoir été fourni à la méthode load(), 
ce qui aurait chargé seulement ces trois plugins, et pas le reste.

Au final, vous pouvez aussi spécifier un ensemble de valeurs dans defaults pour 
loadAll qui s'applique à chaque plugin qui n'a pas de configuration spécifique.

Chargez le fichier bootstrap à partir de tous les plugins, et les routes à 
partir du plugin Blog::
    
    CakePlugin::loadAll(array(
        array('bootstrap' => true),
        'Blog' => array('routes' => true)
    ));


Notez que tous les fichiers spécifiés doivent réellement exister dans le(s) 
plugin(s) configurés ou PHP vous donnera des avertissements pour chaque 
fichier qu'il ne peut pas charger. C'est particulèrement important à 
retenir quand on spécifie defaults pour tous les plugins.

Certains plugins ont besoin en supplément de créer une ou plusieurs tables 
dans votre base de données. Dans ces cas, ils incluent souvent un fichier 
de schéma que vous appelez à partir du shell de cake comme ceci::

    user@host$ cake schema create --plugin ContactManager

La plupart des plugins indiqueront dans leur documentation leur propre 
procédure pour les configurer et configurer la base de données. Certains 
plugins nécessiteront plus de configuration que d'autres.

Aller plus loin avec le bootstrapping
=====================================

Si vous souhaitez charger plus d'un fichier bootstrap pour un plugin. Vous
pouvez spécifier un tableau de fichiers avec la clé de configuration
bootstrap::

    CakePlugin::loadAll(array(
        'Blog' => array(
            'bootstrap' => array(
                'config1',
                'config2'
            )
        )
    ));

Vous pouvez aussi spécifier une fonction qui pourra être appelée quand le
plugin est chargé::


    function aCallableFunction($pluginName, $config) {
        
    }

    CakePlugin::loadAll(array(
        'Blog' => array(
            'bootstrap' => 'aCallableFunction'
        )
    ));

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

Merci de noter que le processus de création de plugins peut être méchamment 
simplifié en utilisant le shell de Cake.

Pour cuisiner un plugin, merci d'utiliser la commande suivante::

    user@host$ cake bake plugin ContactManager

Maintenant vous pouvez cuisiner en utilisant les mêmes conventions qui 
s'appliquent au reste de votre app. Par exemple - baking controllers::

    user@host$ cake bake controller Contacts --plugin ContactManager

Merci de vous référer au chapitre
:doc:`/console-and-shells/code-generation-with-bake` si vous avez le moindre 
problème avec l'utilisation de la ligne de commande.


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
/contact_manager/contacts. Vous devriez obtenir une erreur “Missing Model” 
parce que nous n'avons pas un model Contact déjà défini.

.. _plugin-models:

Models du Plugin
================

Les Models pour le plugin sont stockés dans /app/Plugin/ContactManager/Model.
Nous avons déjà défini un ContactsController pour ce plugin, donc créons le 
models pour ce controller, appelé Contact::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
    }

Visiter /contact_manager/contacts maintenant (Etant donné, que vous avez une 
table dans votre base de données appelée ‘contacts’) devrait nous donner une 
erreur “Missing View”.
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
normales. Placez les juste dans le bon dossier à l'intérieur du dossier 
/app/Plugin/[PluginName]/View/. Pour notre plugin ContactManager, nous aurons 
besoin d'une vue pour notre action ContactsController::index(), ainsi incluons 
ceci aussi::

    // /app/Plugin/ContactManager/View/Contacts/index.ctp:
    <h1>Contacts</h1>
    <p>Ce qui suit est une liste triable de vos contacts</p>
    <!-- Une liste triable de contacts irait ici....-->

.. note::

    Pour des informations sur la façon d'utiliser les éléments à partir d'un 
    plugin, regardez :ref:`view-elements`

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


Plugin assets
=============

Les assets web du plugin (mais pas les fichiers de PHP) peuvent être servis 
à travers le répertoire 'webroot' du plugin, juste comme les assets de 
l'application principale::

    app/Plugin/ContactManager/webroot/
                                        css/
                                        js/
                                        img/
                                        flash/
                                        pdf/

Vous pouvez mettre tout type de fichier dans tout répertoire, juste comme 
un webroot habituel. La seule restriction est que ``MediaView`` a besoin de 
connaître le mime-type de cet asset.

Mais garder à l'esprit que la gestion des assets statiques, comme les images, 
le Javascript et les fichiers CSS des plugins à travers le Dispatcher est 
incroyablement innéficace. Il est grandement recommandé de les symlinker pour 
la production.
Par exemple comme ceci:: 

    ln -s app/Plugin/YourPlugin/webroot/css/yourplugin.css app/webroot/css/yourplugin.css

Lier aux plugins
----------------

Faîtes précéder simplement /nom_plugin/ pour le début d'une requête pour 
un asset dans ce plugin, et cela fonctionnera si l'asset était dans le 
webroot de votre application.

Par exemple, lier le '/contact_manager/js/some_file.js'
servirait l'asset 
'app/Plugin/ContactManager/webroot/js/some_file.js'.

.. note::

    Il est important de noter que le préfixe de **/votre_plugin/** avant le 
    chemin de asset. Et la magie opére!

.. versionchanged:: 2.1
    Utilisez :term:`plugin syntax` pour accéder aux assets. Par exemple dasn
    votre View:
    <?php echo $this->Html->css("ContactManager.style"); ?>


Components, Helpers et Behaviors
================================

Un plugin peut avoir des Components, Helpers et Behaviors tout comme un 
une appplication CakePHP classique. Vous pouvez soit créer des plugins 
qui sont composés seulement de Components, Helpers ou Behaviors qui 
peuvent être une bonne façon de construire des Components réutilisables 
qui peuvent être facilement déplacés dans tout projet.

Construire ces components est exactement le même chose que de les construire 
à l'intérieur d'une application habituelle, avec aucune convention spéciale 
de nommage.

Faire référence avec votre component, depuis l'intérieur ou l'extérieur de votre 
plugin nécessite seulement que le préfixe du nom du plugin avant le nom du 
component. Par exemple::

    // Component défini dans le plugin 'ContactManager'
    class ExampleComponent extends Component {
    }
    
    // dans vos controllers:
    public $components = array('ContactManager.Exemple'); 

La même technique s'applique aux Helpers et aux Behaviors.

.. note::

    A la création de Helpers, vous verrez que AppHelper n'est pas 
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
des nouveaux shells à la console de cake, et n'oubliez pas de créez des cas 
de test ainsi les utilisateurs de votre plugin peuvent automatiquement tester 
les fonctionnalités de votre plugin!

Dans notre exemple ContactManager, nous pourrions créer des actions 
add/remove/edit/delete dans le ContactsController, intégrez la validation 
dans le model Contact, et intégrez la fonctionnalité à laquelle on 
pourrait s'attendre quand on gère ses contacts. A vous de décider ce qu'il 
fait intégrer dans vos plugins. N'oubliez juste pas de partager votre code 
avec la communauté afin que tout le monde puisse bénéficier de votre 
component génial et réutilisable!

Astuces pour les Plugins
========================

Une fois qu'un plugin a été installé dans /app/Plugin, vous pouvez y accéder 
à l'URL /nom_plugin/nom_controller/action. Dans notre exemple de plugin 
ContactManager, nous accédons à notre ContactsController à l'adresse 
/contact_manager/contacts.

Quelques astuces de fin lorque l'on travaille avec les plugins dans vos 
applications CakePHP:

-  Si vous n'avez pas un [Plugin]AppController et
   [Plugin]AppModel, vous aurez des erreurs de type get missing Controller 
   lorsque vous essayez d'accéder à un controller d'un plugin.
-  Vous pouvez définir vos propres layouts pour les plugins, dans le dossier 
   de app/Plugin/[Plugin]/View/Layouts. Sinon, les plugins utiliseront les 
   layouts du dossier /app/View/Layouts par défaut.
-  Vous pouvez établir une communication inter-plugin en utilisant 
   ``$this->requestAction('/plugin_name/controller_name/action');`` dans vos 
   controllers.
-  Si vous utilisez requestAction, assurez-vous que les noms des controllers 
   et des models sont aussi uniques que possibles. Sinon, vous aurez des 
   erreurs PHP de type "redefined class ...".



.. meta::
    :title lang=fr: Plugins
    :keywords lang=fr: dossier plugin,configuration de la base de données,bootstrap,module de gestion,peu d'espace,connection base de données,webroot,gestion d'utilisateur,contactmanager,tableau,config,cakephp,models,php,répertoires,blog,plugins,applications
