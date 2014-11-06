Comment Utiliser des Plugins
############################

Avant d'utiliser un plugin, vous devez avant tout l'installer et l'activer.
Voir :doc:`/plugins/how-to-install-plugins`.

Configuration du Plugin
=======================

Vous pouvez faire beaucoup de choses avec les méthodes load et loadAll pour
vous aider avec la configuration et le routing d'un plugin. Peut-être
souhaiterez vous charger tous les plugins automatiquement, en spécifiant
des routes et des fichiers de bootstrap pour certains plugins.

Pas de problème::

    CakePlugin::loadAll(array(
        'Blog' => array('routes' => true),
        'ContactManager' => array('bootstrap' => true),
        'WebmasterTools' => array('bootstrap' => true, 'routes' => true),
    ));

Avec ce type de configuration, vous n'avez plus besoin de faire manuellement un
include() ou un require() d'une configuration de plugin ou d'un fichier de
routes--Cela arrive automatiquement au bon moment et à la bonne place. Un
paramètre totalement identique peut avoir été fourni à la méthode load(),
ce qui aurait chargé seulement ces trois plugins, et pas le reste.

Au final, vous pouvez aussi spécifier un ensemble de valeurs dans defaults pour
loadAll qui s'applique à chaque plugin qui n'a pas de configuration spécifique.

Chargez le fichier bootstrap à partir de tous les plugins, et aussi les routes
du plugin Blog::

    CakePlugin::loadAll(array(
        array('bootstrap' => true),
        'Blog' => array('routes' => true)
    ));


Notez que tous les fichiers spécifiés doivent réellement exister dans le(s)
plugin(s) configurés ou PHP vous donnera des avertissements pour chaque
fichier qu'il ne peut pas charger. C'est particulèrement important à
retenir quand on spécifie defaults pour tous les plugins.

CakePHP 2.3.0 ajoute une option ``ignoreMissing```, qui vous permet d'ignorer
toute route manquante et les fichiers de bootstrap quand vous chargez les
plugins. Vous pouvez raccourcir le code en chargeant tous les plugins en
utilisant ceci::

    // Charge tous les plugins y compris les possibles routes et les fichiers de bootstrap
    CakePlugin::loadAll(array(
        array('routes' => true, 'bootstrap' => true, 'ignoreMissing' => true)
    ));

Certains plugins ont besoin en supplément de créer une ou plusieurs tables
dans votre base de données. Dans ces cas, ils incluent souvent un fichier
de schéma que vous appelez à partir du shell de cake comme ceci::

    user@host$ cake schema create --plugin ContactManager

La plupart des plugins indiqueront dans leur documentation leur propre
procédure pour les configurer et configurer la base de données. Certains
plugins nécessiteront plus de configuration que d'autres.

Aller plus loin avec le bootstrapping
=====================================

Si vous souhaitez charger plus d'un fichier bootstrap pour un plugin, vous
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

.. meta::
    :title lang=fr: Comment Utiliser les Plugins
    :keywords lang=fr: dossier plugin,configuration base de données,bootstrap,management module,webroot,user management,contactmanager,tableau,config,cakephp,models,php,répertoires,blog,plugins,applications