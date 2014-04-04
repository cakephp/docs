Tutoriel d'un Blog
##################

Bienvenue sur CakePHP. Vous consultez probablement ce tutoriel parce que vous
voulez en apprendre plus à propos du fonctionnement de CakePHP.
C'est notre but d'améliorer la productivité et de rendre le développement
plus agréable : nous espérons que vous le découvrirez au fur et à mesure que
vous plongerez dans le code.

Ce tutoriel vous accompagnera à travers la création d'une simple application
de blog. Nous récupérerons et installerons CakePHP, créerons et configurerons
une base de données et ajouterons suffisamment de logique applicative pour
lister, ajouter, éditer et supprimer des posts.

Voici ce dont vous aurez besoin :

#. Un serveur web fonctionnel. Nous supposerons que vous utilisez Apache,
   bien que les instructions pour utiliser d'autres serveurs doivent
   être assez semblables. Nous aurons peut-être besoin de jouer un peu sur la
   configuration du serveur, mais la plupart des personnes peuvent faire
   fonctionner CakePHP sans aucune configuration préalable. Assurez-vous
   d'avoir PHP 5.4.19 ou supérieur et que les extensions ``mbstring`` et
   ``mcrypt`` sont activées dans PHP.
#. Un serveur de base de données. Dans ce tutoriel, nous utiliserons MySQL.
   Vous aurez besoin d'un minimum de connaissance en SQL afin de créer une
   base de données : CakePHP prendra les rênes à partir de là. Puisque nous
   utilisons MySQL, assurez-vous aussi que vous avez ``pdo_mysql`` activé
   dans PHP.
#. Des connaissances de base en PHP. Plus vous aurez d'expérience en
   programmation orienté objet, mieux ce sera ; mais n'ayez crainte, même
   si vous êtes adepte de la programmation procédurale.
#. Enfin, vous aurez besoin de connaissances de base à propos du motif de
   conception MVC. Un bref aperçu de ce motif dans le chapitre
   :doc:`/cakephp-overview/understanding-model-view-controller`.
   Ne vous inquiétez pas : il n'y a qu'une demi-page de lecture.

Maintenant, lançons-nous !

Obtenir CakePHP
===============

Le manière la plus simple pour le récupérer et le lancer est de télécharger ou
de cloner une copie récente à partir de Github. Pour ce faire, allez simplement
sur le projet CakePHP sur Github:
`http://github.com/cakephp/cakephp/releases <http://github.com/cakephp/cakephp/releases>`_
et télécharger la dernière version de CakePHP 3.0.

Vous pouvez aussi installer CakePHP en utilisant ``Composer``.
``Composer`` est une manière simple d'installer CakePHP à partir de votre
terminal ou de l'invité de ligne de commande. Tapez simplement les deux lignes
suivantes dans votre terminal à partir de votre répertoire webroot::

    curl -s https://getcomposer.org/installer | php
    php composer.phar create-project -s dev cakephp/app

Ceci va télécharger Composer et installer le squelette de l'application
de CakePHP. Par défaut Composer va sauvegarder votre nouveau projet dans un
répertoire appelé ``app``. N'hésitez pas à renommer ce répertoire pour quelque
chose qui est lié à votre projet, par ex: ``blog``.

L'avantage d'utiliser Composer est qu'il va automatiquement réaliser certaines
tâches de configurations importantes, comme configurer les bonnes permissions
de fichier et créer votre fichier app/Config/app.php à votre place.

Il y a d'autres moyens d'installer CakePHP si vous n'êtes pas à l'aise avec
``Composer``. Pour plus d'informations: regardez la section
:doc:`/installation`.

Peu importe la façon dont vous l'avez téléchargé, placez le code à l'intérieur
du "DocumentRoot" de votre serveur. Une fois terminé, votre répertoire
d'installation devrait ressembler à quelque chose comme cela::

    /chemin_du_document_root
        /App
        /Plugin
        /Test
        /tmp
        /vendor
        /webroot
        .gitignore
        .htaccess
        .travis.yml
        README.md
        composer.json
        index.php
        phpunit.xml.dist

A présent, il est peut-être temps de voir un peu comment fonctionne la
structure de fichiers de CakePHP : lisez le chapitre
:doc:`/getting-started/cakephp-folder-structure`.

Les Permissions du Répertoire tmp
=================================

Ensuite vous devrez mettre le répertoire ``/tmp`` en écriture pour le serveur
web. La meilleur façon de le faire est de trouver sous quel utilisateur votre
serveur web tourne en faisant (``<?= `whoami`; ?>``) et en changeant le
possesseur du répertoire ``App/tmp`` pour cet utilisateur. La commande finale
que vous pouvez lancer (dans \*nix) pourrait ressembler à ceci::

    $ chown -R www-data App/tmp

Si pour une raison ou une autre, CakePHP ne peut écrire dans ce répertoire, vous
verrez des avertissements et des exceptions attrapées vous disant que les
données de cache n’ont pas pu être écrites quand vous n'êtes pas en mode
production.

Bien que non recommandé, si vous ne pouvez pas configurer les permissions de la
même façon que pour votre serveur web, vous pouvez simplement définir les
permissions sur le dossier en lançant une commande comme celle-ci::

    $ chmod 777 -R tmp

Créer la base de données du blog
================================

Maintenant, mettons en place la base de données pour notre blog. Si vous
ne l'avez pas déjà fait, créez une base de données vide avec le nom de votre
choix pour l'utiliser dans ce tutoriel. Pour le moment, nous allons juste créer
une simple table pour stocker nos posts. Nous allons également insérer quelques
posts à des fins de tests. Exécutez les requêtes SQL suivantes dans votre base
de données::

    /* D'abord, créons la table des posts : */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Puis insérons quelques posts pour les tests : */
    INSERT INTO posts (title,body,created)
        VALUES ('Le titre', 'Voici le contenu du post.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Encore un titre', 'Et le contenu du post qui suit.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Le retour du titre', 'C\'est très excitant, non ?', NOW());

Les choix des noms pour les tables et les colonnes ne sont pas arbitraires.
Si vous respectez les conventions de nommage de CakePHP pour les bases de
données et les classes (toutes deux expliquées au chapitre
:doc:`/getting-started/cakephp-conventions`), vous tirerez profit d'un
grand nombre de fonctionnalités automatiques et vous éviterez des étapes
de configurations. CakePHP est suffisamment souple pour implémenter les pires
schémas de bases de données, mais respecter les conventions vous fera gagner
du temps.

Consultez le chapitre :doc:`/getting-started/cakephp-conventions` pour plus
d'informations, mais il suffit de comprendre que nommer notre table 'articles'
permet de la relier automatiquement à notre model Articles, et qu'avoir des
champs 'modified' et 'created' permet de les avoir gérés automagiquement par
CakePHP.

Configurer la base de données
=============================

En avant : indiquons à CakePHP où se trouve notre base de données et comment s'y
connecter. Pour la plupart d'entre vous, c'est la première et dernière fois que
vous configurerez quelque chose.

Une copie du fichier de configuration CakePHP pour la base de données se trouve
dans ``App/Config/app.default.php``. Faites une copie de ce fichier dans
le même répertoire mais nommez le ``app.php``.

Le fichier de configuration devrait être assez simple : remplacez simplement
les valeurs du tableau ``Datatsources.default`` par celles qui correspondent à
votre installation. Un exemple de tableau de configuration complet pourrait
ressembler à ce qui suit::

    $config = [
        // Plus de configuration au-dessus.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'login' => 'cake_blog',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_blog',
                'prefix' => false,
                'encoding' => 'utf8',
                'timezone' => 'UTC'
            ],
        ],
        // Plus de configuration en-dessous.
    ];

Une fois votre nouveau fichier ``app.php`` sauvegardé, vous devriez
être en mesure d'ouvrir votre navigateur internet et de voir la page d'accueil
de CakePHP. Elle devrait également vous indiquer que votre fichier de connexion
a été trouvé, et que CakePHP peut s'y connecter avec succès.

.. note::

    Rappelez-vous que vous aurez besoin d'avoir PDO, et pdo_mysql activés dans
    votre php.ini.

Configuration facultative
=========================

Il y a quelques autres élements qui peuvent être configurés. La plupart des
développeurs configurent les éléments de cette petite liste, mais ils ne
sont pas obligatoires pour ce tutoriel. Le premier consiste à définir une
chaîne de caractères personnalisée (ou "grain de sel") afin de sécuriser les
hashs.

Le "grain de sel" est utilisé pour générer des hashes. Changez sa valeur par
défaut en modifiant ``/App/Config/app.php``.
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
mod\_rewrite ne fonctionne pas sur votre système. Merci de vous référer
à la section suivante sur l'URL rewriting pour que votre serveur
web fonctionne:

.. toctree::
    :maxdepth: 1

    /installation/url-rewriting

#. Pour une raison ou une autre, vous avez peut-être obtenu une copie de CakePHP
   sans les fichiers .htaccess souhaités. Ceci arrive parfois parce que
   certains systèmes d'exploitation traitent les fichiers qui commencent par
   '.' comme des fichiers cachés, et ne les copient pas. Assurez-vous que votre
   copie de CakePHP provient de la section downloads du site ou de notre dépôt
   Github.

#. Assurez-vous qu'Apache charge mod\_rewrite correctement! Vous devriez voir
   quelque chose comme::

       LoadModule rewrite_module             libexec/httpd/mod_rewrite.so

   ou (pour Apache 1.3)::

       AddModule             mod_rewrite.c

   dans votre httpd.conf.


Si vous ne voulez pas ou ne pouvez pas obtenir mod\_rewrite (ou d'autres modules
compatibles) et le lancer sur votre serveur, vous aurez besoin d'utiliser les
belles URLs intégrées à CakePHP. Dans ``/App/Config/app.php``, décommentez la
ligne qui ressemble à::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

Retirez aussi ces fichiers .htaccess::

    /.htaccess
    /App/webroot/.htaccess


Ceci va faire que vos URLs ressembleront à
www.example.com/index.php/controllername/actionname/param plutôt que
www.example.com/controllername/actionname/param.

Si vous installez CakePHP sur un serveur web autre que Apache, vous pouvez
trouver des instructions pour obtenir l'URL réécrite fonctionnant pour d'autres
serveurs sous la section :doc:`/installation/url-rewriting`.

Maintenant continuez vers :doc:`/tutorials-and-examples/blog/part-two` pour
commencer la construction de votre première application CakePHP.


.. meta::
    :title lang=fr: Tutoriel d'un Blog
    :keywords lang=fr: modèle vue contrôleur,model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
