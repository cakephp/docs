##################
Tutoriel d'un Blog
##################

Bienvenue sur CakePHP. Vous consultez probablement ce tutoriel parce que vous 
voulez en apprendre plus à propos du fonctionnement de CakePHP.
C'est notre but d'améliorer la productivité et de rendre le développement 
plus agréable : nous espérons que vous le découvrirez au fur et à mesure que 
vous plongerez dans le code.

Ce tutoriel vous accompagnera à travers la création d'une simple application 
de blog. Nous récupérerons et installerons Cake, créerons et configurerons une 
base de données et ajouterons suffisamment de logique applicative pour lister, 
ajouter, éditer et supprimer des posts.

Voici ce dont vous aurez besoin :


#. Un serveur web fonctionnel. Nous supposerons que vous utilisez Apache,
   bien que les instructions pour utiliser d'autres serveurs devraient
   être très semblables. Nous aurons peut-être besoin de jouer un peu sur la
   configuration du serveur, mais la plupart des personnes peuvent faire 
   fonctionner Cake sans aucune configuration préalable.
#. Un serveur de base de données. Dans ce tutoriel, nous utiliserons MySQL. 
   Vous aurez besoin d'un minimum de connaissance en SQL afin de créer une 
   base de données : Cake prendra les rênes à partir de là.
#. Des connaissances de base en PHP. Plus vous aurez d'expérience en 
   programmation orienté objet, mieux ce sera ; mais n'ayez crainte, même 
   si vous êtes adepte de la programmation procédurale.
#. Enfin, vous aurez besoin de connaissances de base à propos du motif de 
   conception MVC. Un bref aperçu de ce motif dans le chapitre 
   :doc:`/cakephp-overview/understanding-model-view-controller`.
   Ne vous inquiétez pas : il n'y a qu'une demi-page de lecture.

Maintenant, lançons-nous !

Obtenir Cake
============

Tout d'abord, récupérons une copie récente de Cake.

Pour obtenir la dernière version, allez sur le site GitHub du projet CakePHP :
`https://github.com/cakephp/cakephp/tags <https://github.com/cakephp/cakephp/tags>`_
et téléchargez la dernière version de la 2.0

Vous pouvez aussi cloner le dépôt en utilisant
`git <http://git-scm.com/>`_.
``git clone git://github.com/cakephp/cakephp.git``

Peu importe comment vous l'avez téléchargé, placez le code à l'intérieur du 
"DocumentRoot" de votre serveur. Une fois terminé, votre répertoire 
d'installation devrait ressembler à quelque chose comme ça :

::

    /chemin_du_document_root
        /app
        /lib
        /plugins
        /vendors
        .htaccess
        index.php
        README

A présent, il est peut-être temps de voir un peu comment fonctionne la 
structure de fichiers de Cake : lisez le chapitre 
:doc:`/getting-started/cakephp-folder-structure`.

Créer la base de données du blog
================================

Maintenant, mettons en place la base de données pour notre blog. Si vous 
ne l'avez pas déjà fait, créez une base de données vide avec le nom de votre 
choix pour l'utiliser dans ce tutoriel. Pour le moment, nous allons juste créer 
une simple table pour stocker nos posts. Nous allons également insérer quelques 
posts à des fins de tests. Exécutez les requêtes SQL suivantes dans votre base 
de données :

::

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

Le choix des noms pour les tables et les colonnes ne sont pas arbitraires. 
Si vous respectez les conventions de nommage Cake pour les bases de données 
et les classes (toutes deux expliquées le chapitre 
:doc:`/getting-started/cakephp-conventions`), vous tirerez avantage d'un 
grand nombre de fonctionnalités automatiques et vous éviterez des étapes 
de configurations. Cake est suffisamment souple pour implémenter les pires 
schémas de bases de données, mais respecter les conventions vous fera gagner 
du temps.

Consultez le chapitre :doc:`/getting-started/cakephp-conventions` pour plus 
d'informations, mais il suffit de comprendre que nommer notre table 'posts' 
permet de la relier automatiquement à notre modèle Post, et qu'avoir des 
champs 'modified' et 'created' permet de les avoir gérés automagiquement par 
Cake.

Configurer la base de données Cake
==================================

En avant : indiquons à Cake où se trouve notre base de données et comment s'y 
connecter. Pour la plupart d'entre vous, c'est la première et dernière fois que 
vous configurerez quelque chose.

Une copie du fichier de configuration Cake pour la base de données se trouve 
dans ``/app/Config/database.php.default``. Faites une copie de ce fichier dans 
le même répertoire mais nommez le ``database.php``.

Le fichier de configuration devrait être assez simple : remplacez simplement 
les valeurs du tableau ``$default`` par celles qui correspondent à votre 
installation. Un exemple de tableau de configuration complet pourrait 
ressembler à ce qui suit :

::

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => ''
    );

Une fois votre nouveau fichier ``database.php`` sauvegardé, vous devriez
être en mesure d'ouvrir votre navigateur internet et de voir la page d'accueil 
de Cake. Elle devrait également vous indiquer votre fichier de connexion a été 
trouvé, et que Cake peut s'y connecter avec succès.

Configuration facultative
=========================

Il y a trois autres élements qui peuvent être configurés. La plupart des 
développeurs configurent les éléments de cette petite liste, mais ils ne 
sont obligatoires pour ce tutoriel. Le premier consiste à définir une chaîne 
de caractères personnalisée (ou "grain de sel") afin de sécuriser les hashs. 
Le second consiste à définir un nombre personnalisé (ou "graine") à utiliser 
pour le chiffrage. Le troisième est de permettre l'accès en écriture à CakePHP 
pour son dossier ``tmp``.

Le "grain" est utilisé pour générer des hashes. Changez sa valeur par défaut 
en modifiant ``/app/Config/core.php`` à la ligne 187.
La nouvelle valeur n'a pas beaucoup d'importance du moment qu'elle est 
difficile à deviner.

::

    /**
     * Une chaîne aléatoire utilisée dans les méthodes de hachage sécurisées.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');

La "graine" est utilisée pour le chiffrage/déchiffrage des chaînes de 
caractères. Changez sa valeur par défaut en modifiant 
``/app/Config/core.php`` à la ligne 192. La nouvelle valeur n'a pas beaucoup 
d'importance du moment qu'elle est difficile à deviner.

::

    /**
     * Une chaîne aléatoire de chiffre utilisée pour le chiffrage/déchiffrage 
     * des chaînes de caractères.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');

La dernière étape consiste à rendre le dossier ``/app/tmp`` accessible en 
écriture. Le meilleur moyen de faire cela est trouver sous quel utilisateur 
votre serveur web s'exécute (``<?php echo `quisuisje`; ?>``) et de modifier le 
propriétaire du dossier ``/app/tmp`` pour cet utilisateur. La commande à 
exécuter (sous \*nix) devrait resembler à quelque chose comme ça ::

    $ chown -R www-data app/tmp

Si pour une raison quelconque CakePHP ne peut pas écrire dans ce répertoire, 
vous en serez informé par un message d'avertissement tant que vous n'êtes pas 
en mode production.

Une note sur mod\_rewrite
=========================

Occasionnellement, un nouvel utilisateur peut avoir des problèmes de  
mod\_rewrite. par exemple si la page d'accueil de CakePHP a l'air marrante 
(pas d'images ou de styles css), cela signifie probablement que 
mod\_rewrite ne fonctionne pas sur votre système. Merci de vous référer 
à l'une des sections suivantes sur l'url rewriting pour que votre serveur 
web fonctionne:

.. toctree::

    /installation/url-rewriting

Maintenant continuez sur :doc:`/tutorials-and-examples/blog/part-two` pour commencer à 
construire votre première application CakePHP.


.. meta::
    :title lang=fr: Tutoriel d'un Blog
    :keywords lang=fr: modèle vue contrôleur,model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
