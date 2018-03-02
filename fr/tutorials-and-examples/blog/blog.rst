Tutoriel d'un Blog
##################

Ce tutoriel vous accompagnera à travers la création d'une simple application
de blog. Nous récupérerons et installerons CakePHP, créerons et configurerons
une base de données et ajouterons suffisamment de logique applicative pour
lister, ajouter, éditer et supprimer des articles.

Voici ce dont vous aurez besoin :

#. Un serveur web fonctionnel. Nous supposerons que vous utilisez Apache,
   bien que les instructions pour utiliser d'autres serveurs doivent
   être assez semblables. Nous aurons peut-être besoin de jouer un peu sur la
   configuration du serveur, mais la plupart des personnes peuvent faire
   fonctionner CakePHP sans aucune configuration préalable. Assurez-vous
   d'avoir PHP |minphpversion| ou supérieur et que les extensions ``mbstring`` et
   ``intl`` sont activées dans PHP.
#. Un serveur de base de données. Dans ce tutoriel, nous utiliserons MySQL.
   Vous aurez besoin d'un minimum de connaissance en SQL afin de créer une
   base de données : CakePHP prendra les rênes à partir de là. Puisque nous
   utilisons MySQL, assurez-vous aussi que vous avez ``pdo_mysql`` activé
   dans PHP.
#. Des connaissances de base en PHP.

Maintenant, lançons-nous !

Obtenir CakePHP
===============

Le manière la plus simple pour l'installer est d'utiliser Composer.
Composer est une manière simple d'installer CakePHP à partir de votre
terminal ou de l'invité de ligne de commande. Tapez simplement les deux lignes
suivantes dans votre terminal à partir de votre répertoire webroot::

    curl -s https://getcomposer.org/installer | php

Ou vous pouvez télécharger ``composer.phar`` du
`site de Composer <https://getcomposer.org/download/>`_.

Ensuite tapez simplement la ligne suivante dans votre terminal depuis votre
répertoire d'installation pour installer le squelette d'application de CakePHP
dans le répertoire que vous souhaitez utiliser. Pour l'exemple nous utiliserons
"blog", mais vous pouvez utiliser le nom que vous souhaitez::

    php composer.phar create-project --prefer-dist cakephp/app blog

Dans le cas où vous avez déjà composer installé globalement, vous devrez plutôt
taper::

    composer self-update && composer create-project --prefer-dist cakephp/app blog

L'avantage d'utiliser Composer est qu'il va automatiquement réaliser certaines
tâches de configurations importantes, comme configurer les bonnes permissions
de fichier et créer votre fichier config/app.php à votre place.

Il y a d'autres moyens d'installer CakePHP. Si vous ne pouvez ou ne voulez pas
utiliser ``Composer``, regardez la section :doc:`/installation`.

Peu importe la façon dont vous l'avez téléchargé, placez le code à l'intérieur
du "DocumentRoot" de votre serveur. Une fois terminé, votre répertoire
d'installation devrait ressembler à quelque chose comme cela::

    /cake_install
        /bin
        /config
        /logs
        /plugins
        /src
        /tests
        /tmp
        /vendor
        /webroot
        .editorconfig
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

A présent, il est peut-être temps de voir un peu comment fonctionne la
structure de fichiers de CakePHP : lisez le chapitre
:doc:`/intro/cakephp-folder-structure`.

Les Permissions des Répertoires tmp et logs
===========================================

Les répertoires ``tmp`` and ``logs`` doivent être en écriture pour le serveur
web. Si vous avez utilisé Composer pour l'installation, ceci a du être fait pour
vous et confirmé par un message "Permissions set on <folder>". Si vous avez
plutôt un message d'erreur ou voulez le faire manuellement, la meilleur façon
de le faire est de trouver sous quel utilisateur votre serveur web tourne en
faisant (``<?= `whoami`; ?>``) et en changeant le possesseur du répertoire
**src/tmp** pour cet utilisateur. La commande finale que vous pouvez lancer
(dans \*nix) pourrait ressembler à ceci::

    chown -R www-data tmp
    chown -R www-data logs

Si pour une raison ou une autre, CakePHP ne peut écrire dans ce répertoire, vous
serez informé par un avertissement quand vous n'êtes pas en mode production.

Bien que non recommandé, si vous ne pouvez pas configurer les permissions de la
même façon que pour votre serveur web, vous pouvez simplement définir les
permissions sur le dossier en lançant une commande comme celle-ci::

    chmod -R 777 tmp
    chmod -R 777 logs

Créer la Base de Données du Blog
================================

Maintenant, mettons en place la base de données pour notre blog. Si vous
ne l'avez pas déjà fait, créez une base de données vide avec le nom de votre
choix pour l'utiliser dans ce tutoriel, par ex ``cake_blog``.Pour le moment,
nous allons juste créer une simple table pour stocker nos posts. Nous allons
également insérer quelques posts à des fins de tests. Exécutez les requêtes SQL
suivantes dans votre base de données::

    /* D'abord, créons la table des posts : */
    CREATE TABLE articles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Puis insérons quelques posts pour les tests : */
    INSERT INTO articles (title,body,created)
        VALUES ('The title', 'This is the article body.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('A title once again', 'And the article body follows.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

Les choix des noms pour les tables et les colonnes ne sont pas arbitraires.
Si vous respectez les conventions de nommage de CakePHP pour les bases de
données et les classes (toutes deux expliquées au chapitre
:doc:`/intro/conventions`), vous tirerez profit d'un
grand nombre de fonctionnalités automatiques et vous éviterez des étapes
de configurations. CakePHP est suffisamment souple pour implémenter les pires
schémas de bases de données, mais respecter les conventions vous fera gagner
du temps.

Consultez le chapitre :doc:`/intro/conventions` pour plus
d'informations, mais il suffit de comprendre que nommer notre table 'articles'
permet de la relier automatiquement à notre model Articles, et qu'avoir des
champs 'modified' et 'created' permet de les avoir gérés automagiquement par
CakePHP.

Configurer la base de données
=============================

Ensuite, indiquons à CakePHP où se trouve notre base de données et comment s'y
connecter. Pour la plupart d'entre vous, c'est la première et dernière fois que
vous configurerez quelque chose.

Le fichier de configuration devrait être assez simple : remplacez simplement
les valeurs du tableau ``Datatsources.default`` dans le fichier
**config/app.php** avec ceux de votre config. Un exemple de tableau de
configuration complet pourrait ressembler à ce qui suit::

    return [
        // Plus de configuration au-dessus.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cake_blog',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_blog',
                'encoding' => 'utf8',
                'timezone' => 'UTC'
            ],
        ],
        // Plus de configuration ci-dessous.
    ];

Une fois votre fichier **config/app.php** sauvegardé, vous devriez
être en mesure d'ouvrir votre navigateur internet et de voir la page d'accueil
de CakePHP. Elle devrait également vous indiquer que votre fichier de connexion
a été trouvé, et que CakePHP peut s'y connecter avec succès.

.. note::

    Une copie du fichier de configuration par défaut de
    CakePHP se trouve dans **config/app.default.php**.

Configuration facultative
=========================

Il y a quelques autres éléments qui peuvent être configurés. La plupart des
développeurs configurent les éléments de cette petite liste, mais ils ne
sont pas obligatoires pour ce tutoriel. Le premier consiste à définir une
chaîne de caractères personnalisée (ou "grain de sel") afin de sécuriser les
hashs.

Le "grain de sel" est utilisé pour générer des hashes. Changez sa valeur par
défaut en modifiant **config/app.php**.
La nouvelle valeur n'a pas beaucoup d'importance du moment qu'elle est
difficile à deviner::

    'Security' => [
        'salt' => 'something long and containing lots of different values.',
    ],

Une note sur mod\_rewrite
=========================

Occasionnellement, les nouveaux utilisateurs peuvent avoir des problèmes de
mod\_rewrite. Par exemple si la page d'accueil de CakePHP a l'air bizarre
(pas d'images ou de styles CSS), cela signifie probablement que
mod\_rewrite ne fonctionne pas sur votre système. Merci de consulter la section
:ref:`url-rewriting` pour que votre serveur web fonctionne:

Maintenant continuez vers :doc:`/tutorials-and-examples/blog/part-two` pour
commencer à construire votre première application CakePHP.

.. meta::
    :title lang=fr: Tutoriel d'un Blog
    :keywords lang=fr: modèle vue contrôleur,model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
