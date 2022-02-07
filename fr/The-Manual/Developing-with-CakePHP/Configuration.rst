Configuration
#############

Configurer une application CakePHP c'est du gâteau. Après que vous ayez
installé CakePHP, créer une application web basique nécessite seulement
que vous définissiez une configuration à la base de données.

Il y a, toutefois, d'autres étapes optionnelles de configuration que
vous pouvez suivre afin de tirer avantage de l'architecture flexible de
CakePHP. Vous pouvez facilement ajouter des fonctionnalités héritant du
cœur de CakePHP, configurer des URLs additionnelles/différentes (routes)
et définir des inflexions additionnelles/différentes.

Configuration de la base de données
===================================

CakePHP s'attend à trouver les détails de configuration de la base de
données dans le fichier "app/config/database.php"

Un exemple de fichier de configuration de base de données peut être
trouvé dans "app/config/database.php.default". Une configuration basique
complète devrait ressembler à quelque chose comme cela :

::

    var $default = array('driver'      => 'mysql',
                         'persistent'  => false,
                         'host'          => 'localhost',
                         'login'         => 'cakephputilisateur',
                         'password'   => 'c4k3roxx!',
                         'database'   => 'ma_base_cakephp',
                         'prefix'        => '');

Le tableau de connexion $default est utilisé tant qu'aucune autre
connexion n'est spécifiée dans un modèle, par la propriété $useDbConfig.
Par exemple, si mon application a une base de données pré-existante,
outre celle par défaut, je pourrais l'utiliser dans mes modèles, en
créant un nouveau tableau de connexion à la base de données, intitulé
$ancienne, identique au tableau $default, puis en initialisant la
propriété $useDbConfig = 'ancienne' dans les modèles appropriés.

Complétez les couples clé/valeur du tableau de configuration pour
répondre au mieux à vos besoins.

+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Clé                  | Valeur                                                                                                                                                                                                                                                                                                                         |
+======================+================================================================================================================================================================================================================================================================================================================================+
| driver               | Le nom du pilote de base de données pour lequel ce tableau est destiné. Exemples : mysql, postgres, sqlite, pear-drivername, adodb-drivername, mssql, oracle, or odbc.                                                                                                                                                         |
+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| persistent           | Indique si l'on doit ou non utiliser une connexion persistante à la base.                                                                                                                                                                                                                                                      |
+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| host                 | Le nom du serveur de base de données (ou son adresse IP)                                                                                                                                                                                                                                                                       |
+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| login                | Le nom d'utilisateur pour ce compte.                                                                                                                                                                                                                                                                                           |
+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| password             | Le mot de passe pour ce compte.                                                                                                                                                                                                                                                                                                |
+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| database             | Le nom de la base de données à utiliser pour cette connexion.                                                                                                                                                                                                                                                                  |
+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| prefix (optionnel)   | La chaîne qui préfixe le nom de chaque table dans la base de données. Si vos tables n'ont pas de préfixe, laissez une chaîne vide pour cette valeur.                                                                                                                                                                           |
+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| port (optionnel)     | Le port TCP ou le socket Unix utilisé pour se connecter au serveur.                                                                                                                                                                                                                                                            |
+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| encoding             | Indique quel jeu de caractères utiliser pour envoyer les instructions SQL au serveur. Ces valeurs pour l'encodage par défaut de la base de données sont valables pour toutes les bases autres que DB2. Si vous souhaitez utiliser l'encodage UTF-8 avec des connexions mysql/mysqli, vous devez écrire 'utf8' sans le tiret.   |
+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| schema               | Utilisé dans les paramètres d'une base PostgreSQL pour indiquer quel schéma utiliser.                                                                                                                                                                                                                                          |
+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| datasource           | Source de données Non-DBO à utiliser, ex: 'ldap', 'twitter'                                                                                                                                                                                                                                                                    |
+----------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

Le paramétrage du préfixe est valable pour les tables, **pas** pour les
modèles. Par exemple, si vous créez une table de liaison entre vos
modèles Pomme et Saveur, vous la nommerez "prefixe\_pommes\_saveurs" (et
non pas "prefixe\_pommes\_prefixe\_saveurs") et vous paramétrerez votre
propriété "prefix" sur "prefixe\_".

A présent, vous aurez peut-être envie de jeter un œil aux `Conventions
CakePHP </fr/view/901/conventions-cakephp>`_. Le nommage correct de vos
tables (et de quelques colonnes en plus) peut vous rapporter quelques
fonctionnalités supplémentaires et vous éviter trop de configuration.
Par exemple, si vous nommer votre table grosse\_boites, votre modèle
GrosseBoite, votre contrôleur GrosseBoitesController, tout marchera
ensemble automatiquement. Par convention, utilisez les *underscores*,
les minuscules et les formes plurielles pour les noms de vos tables -
par exemple : cuisiniers, magasin\_de\_pates et bon\_biscuits.

Configuration du coeur de Cake
==============================

La configuration de l'application dans CakePHP se trouve dans
/app/config/core.php. Le fichier est une collection de définitions de
variables de la classe Configure et de définitions de constantes qui
déterminent comment votre application se comporte. Avant de nous plonger
dans l'étude de ces variables particulières, vous devrez vous
familiariser avec "Configure", la classe de configuration centrale de
CakePHP.

La classe Configuration
=======================

Malgré quelques trucs nécessitant d'être configurés dans CakePHP, c'est
souvent utile d'avoir vos propres règles de configuration pour votre
application. Auparavant, vous deviez définir des valeurs de
configuration personnalisées en déclarant des variables ou des
constantes dans quelques fichiers. Cela vous obligeait à inclure ces
fichiers de configuration chaque fois que vous aviez besoin d'utiliser
ces valeurs.

La nouvelle classe Configure de CakePHP peut être utilisée pour stocker
et récupérer des valeurs spécifiques à votre application ou à
l'exécution. Attention, cette classe permet de stocker n'importe quoi en
son sein, pour l'utiliser dans tout autre partie du code : c'est une
tentation évidente de casser le motif MVC pour lequel CakePHP est
architecturé. L'objectif principal de la classe Configure est de
conserver des variables centralisées, qui peuvent être partagées entre
plusieurs objets. Souvenez-vous d'essayer de fonctionner sur le mode
"convention plutôt que configuration" et vous ne risquerez pas de casser
la structure MVC que nous avons mise en place.

Cette classe agit comme un singleton et ses méthodes peuvent être
appelées n'importe où dans votre application, dans un contexte statique.

::

    <?php Configure::read('debug'); ?>

Méthodes de la classe Configure
-------------------------------

 
-

write
~~~~~

::

    write(string $key, mixed $value)

Utilisez write() pour stocker une donnée dans la configuration de
l'application.

::

    Configure::write('Societe.nom','Pizza');
    Configure::write('Societe.slogan','Pizza pour votre corps et votre âme');

Remarquez l'utilisation de la notation avec point pour le paramètre
``$key``. Vous pouvez utiliser cette notation pour organiser votre
configuration en groupes logiques.

L'exemple ci-dessus aurait pu s'écrire aussi en un simple appel :

::

    Configure::write(
        'Societe',array('nom'=>'Pizza','slogan'=>'Pizza pour votre corps et votre âme')
    );

Vous pouvez utiliser ``Configure::write(‘debug’, $int)`` pour passer du
mode débug au mode production à la volée. Ceci est particulièrement
pratique pour les interactions AMF ou SOAP dans lesquelles les
informations de débug peuvent poser des problèmes de *parsing*.

read
~~~~

``read(string $key = 'debug')``

Utilisé pour lire les données de configuration de l'application. Mis par
défaut à la valeur importante 'debug' de CakePHP. Si une clé est passée,
la données correspondante est retournée. En reprenant notre exemple de
la fonction write() ci-dessus, nous pouvons lire cette donnée en retour
:

::

    Configure::read('Societe.nom');    // retourne : 'Pizza'
    Configure::read('Societe.slogan'); // retourne : 'Pizza pour votre corps et votre âme'
     
    Configure::read('Societe');

    // retourne : 
    array('nom' => 'Pizza', 'slogan' => 'Pizza pour votre corps et votre âme');

delete
~~~~~~

``delete(string $key)``

Utilisez cette méthode pour supprimer des informations de configuration.

::

    Configure::delete('Societe.nom');

load
~~~~

``load(string $path)``

Utilisez cette méthode pour charger des informations de configuration
depuis un fichier spécifique.

::

    // /app/config/messages.php:
    <?php
    $config['Societe']['nom'] = 'Pizza';
    $config['Societe']['slogan'] = 'Pizza votre corps et votre âme';
    $config['Societe']['telephone'] = '01-02-03-04-05';
    ?>
     
    <?php
    Configure::load('messages');
    Configure::read('Societe.nom');
    ?>

Chaque paire clé-valeur est représentée dans le fichier par le tableau
``$config``. Toute autre variable dans le fichier sera ignorée par la
méthode ``load()``.

version
~~~~~~~

``version()``

Retourne la version de CakePHP utilisée par l'application courante.

Variables de configuration du cœur de CakePHP
---------------------------------------------

La classe Configure est utilisée pour gérer un ensemble de variables de
configuration du cœur de CakePHP. Ces variables peuvent être trouvées
dans app/config/core.php. Ci-dessous se trouve une description de chaque
variable et des effets que leur utilisation entraîne pour votre
application CakePHP.

Variable de Configure

Description

debug

Modifie la sortie de debug CakePHP.
 0 = Mode production. Pas de sortie.
 1 = Montre les erreurs et les alertes.
 2 = Montre les erreurs, les alertes et le SQL.

App.baseUrl

Décommentez cette définition si vous **ne prévoyez pas** d'utiliser le
mod\_rewrite d'Apache avec CakePHP. N'oubliez pas de supprimer également
vos fichiers .htaccess.

Routing.prefixes

Décommentez cette définition si vous aimeriez tirer profit des routes
préfixées de CakePHP comme admin. Définissez cette variable comme un
tableau des noms des préfixes de routes que vous souhaiteriez utiliser.
Plus d'informations sur celà ultérieurement.

Cache.disable

Quand il est réglé à true, le cache est désactivé pour l'ensemble du
site.

Cache.check

Si réglé à true, active le cache de vue. L'activation est encore requise
dans les contrôleurs, mais cette variable permet la détection de ces
paramètres.

Session.save

Indique à CakePHP quel mécanisme de stockage des sessions utiliser.


utile en conjonction avec Memcache (dans une configuration comportant
plusieurs serveurs) afin de stocker à la fois les données et sessions du
cache.


données. Assurez-vous de configurer correctement la table en utilisant
le fichier SQL situé dans /app/config/sql/sessions.sql.

Session.table

Le nom de la table (sans inclure aucun préfixe) qui enregistre les
informations de session.

Session.database

Le nom de la base de données qui enregistre les informations de session.

Session.cookie

Le nom du cookie utilisé pour tracer les sessions.

Session.timeout

Base du temps de déconnexion de la session, en secondes. La valeur
réelle dépend du paramètre Security.level.

Session.start

Démarre automatiquement les sessions quand réglé à true.

Session.checkAgent

Quand réglé à false, les sessions CakePHP n'effectueront pas d'analyse
pour s'assurer que l'agent utilisateur ne change pas entre les requêtes.

Security.level

Le niveau de sécurité CakePHP. Le temps de déconnexion de la session,
défini par le paramètre 'Session.timeout', est multiplié par le
paramètre indiqué ici.

 'high' = x 10
 'medium' = x 100
 'low' = x 300
 'high' et 'medium' active également
 `session.referer\_check <https://www.php.net/manual/fr/session.configuration.php#ini.session.referer-check>`_

'Security.level' est défini à 'high'.

Security.salt

Une chaîne aléatoire utilisée par le hash de sécurité.

Asset.timestamp

Ajoute le timestamp de la dernière modification du fichier à la fin des
urls fichiers ressources (CSS, JavaScript, Image) quand les bons helpers
sont utilisés.

Valeurs possibles:
 (bool) false - Rien n'est fait (par défaut)
 (bool) true - Ajoute le timestamp quand debug > 0
 (string) 'force' - Ajoute le timestamps quand debug >= 0

Acl.classname, Acl.database

Constantes utilisées par les fonctionnalités de Listes de Contrôle
d'Accès (*Access Control List - ACL*) de CakePHP. Voyez le chapitre sur
les ACL pour plus d'informations.

La configuration du cache se trouve aussi dans le fichier core.php —
Nous le couvrirons plus tard, donc restez à l'écoute.

La classe Configure peut être utilisée pour lire et écrire des
paramètres de configuration du cœur à la volée. Ceci est
particulièrement pratique si vous voulez, par exemple, activer des
paramètres de debug pour une section limitée de votre logique
applicative.

Constantes de configuration
---------------------------

Alors que la plupart des options de configuration sont prises en charge
par Configure, il y a quelques constantes que CakePHP utilise à
l'exécution.

+--------------+-------------------------------------------------------------------------------------------------------------------------------------------------------+
| Constante    | Description                                                                                                                                           |
+==============+=======================================================================================================================================================+
| LOG\_ERROR   | Constante d'erreur. Utilisée pour différencier les erreurs enregistrées et les erreurs de débug. Actuellement PHP supporte la constante LOG\_DEBUG.   |
+--------------+-------------------------------------------------------------------------------------------------------------------------------------------------------+

La classe App
=============

Le chargement de classes additionnelles est devenu plus simple dans
CakePHP. Dans les versions précédentes, il y avait plusieurs fonctions
pour charger une classe nécessaire, basées sur les type de classe que
vous souhaitiez charger. Ces fonctions sont devenues obsolètes, toute
classe ou librairie devrait maintenant pouvoir être chargée normalement
avec App::import(). App::import() s'assure qu'une classe n'est chargée
qu'une fois, que la classe parente appropriée a été chargée et résout
automatiquement les chemins dans la plupart des cas.

Utiliser App::import()
----------------------

``App::import($type, $name, $parent, $search, $file, $return)``

A première vue, ``App::import`` semble complexe, pourtant, dans la
plupart des cas d'utilisation, seuls 2 arguments sont requis.

Importer les librairies du cœur
-------------------------------

Les librairies du cœur de Cake, comme Sanitize et Xml peuvent être
chargées via :

::

    <?php App::import('Core', 'Sanitize') ?>

Ceci rendra la classe Sanitize disponible.

Importer des Contrôleurs, des Modèles, des Composants, des Comportements et des Assistants
------------------------------------------------------------------------------------------

Toute classe relative à l'application devrait aussi être chargée avec
App::import(). Les exemples suivants illustrent comment s'y prendre.

Charger des Contrôleurs
~~~~~~~~~~~~~~~~~~~~~~~

``App::import('Controller', 'MonController');``

Appeler App::import est équivalent à l'inclusion, par require, du
fichier. Il est important de comprendre que la classe nécessite, par la
suite, d'être initialisée.

::

    <?php
    // Identique à : require('controllers/utilisateurs_controller.php');
    App::import('Controller', 'Utilisateurs');

    // Nous avons besoin de charger la classe
    $Users = new UsersController;

    // Si nous voulons que les associations de modèle, les components, etc. soient chargés
    $Users->constructClasses();
    ?>

Charger des Modèles
~~~~~~~~~~~~~~~~~~~

``App::import('Model', 'MonModel');``

Charger des Composants
~~~~~~~~~~~~~~~~~~~~~~

``App::import('Component', 'Auth');``

Charger des Comportements
~~~~~~~~~~~~~~~~~~~~~~~~~

``App::import('Behavior', 'Tree');``

Charger des Assistants
~~~~~~~~~~~~~~~~~~~~~~

``App::import('Helper', 'Html');``

Charger des Assistants
~~~~~~~~~~~~~~~~~~~~~~

``App::import('Helper', 'Html');``

Charger depuis les Plugins
--------------------------

Charger des classes de plugins fonctionne à peu près de la même manière
que le chargement des classes du cœur ou de l'application, excepté que
vous devez préciser le plugin depuis lequel vous chargez.

::

    App::import('Model', 'MonPlugin.Pomme');

Pour charger APP/plugins/mon\_plugin/vendors/flickr/flickr.php

::

    App::import('Vendor', 'MonPlugin.flickr/flickr');

Charger les fichiers Vendor
---------------------------

La fonction vendor() a été dépréciée. Les fichiers Vendor devraient
maintenant être chargés via App::import(). La syntaxe et les arguments
additionnels sont légèrement différents, car les structures du fichier
vendor peuvent différer grandement et tous les fichiers vendor ne
contiennent pas de classes.

Les exemples suivants illustrent comment charger les fichiers vendor
depuis divers structures de chemins. Ces fichiers vendor pourraient être
localisés dans n'importe quels dossiers de vendor.

Exemples Vendor
~~~~~~~~~~~~~~~

Pour charger **vendors/geshi.php**

::

    App::import('Vendor', 'geshi');

Pour charger **vendors/flickr/flickr.php**

::

    App::import('Vendor', 'flickr/flickr');

Pour charger **vendors/un.nom.php**

::

    App::import('Vendor', 'UnNom', array('file' => 'un.nom.php'));

Pour charger **vendors/services/bien.dit.php**

::

    App::import('Vendor', 'BienDit', array('file' => 'services'.DS.'bien.dit.php'));

Cela ne fera aucune différence si vos fichiers vendor sont dans votre
répertoire /app/vendors. Cake les trouvera automatiquement.

Pour charger **app/vendors/nomVendeur/libFichier.php**

::

    App::import('Vendor', 'unIdentifiantUnique', array('file' =>;'nomVendeur'.DS.'libFichier.php'));

Configuration des Routes
========================

Le routage est une fonctionnalité qui fait correspondre les URLs aux
actions du contrôleur. Elle a été ajoutée à CakePHP pour rendre les
"jolies" URLs plus configurables et flexibles. L'utilisation du
*mod\_rewrite* d'Apache n'est pas nécessaire pour utiliser les routes,
mais il donnera un aspect plus élégant à votre barre d'adresses.

Routage par défaut
------------------

Avant d'apprendre comment configurer vos propres routes, vous devriez
savoir que CakePHP arrive configuré avec un ensemble de routes par
défaut. Le routage par défaut de CakePHP vous emmènera assez loin dans
toute application. Vous pouvez accéder à une action directement via
l'URL en insérant son nom dans la requête. Vous pouvez aussi passer des
paramètres aux action de votre contrôleur en utilisant l'URL.

::

        URL motif de routes par défaut :
        http://exemple.com/controleur/action/param1/param2/param3

L'URL /posts/voir correspond à l'action voir() du contrôleur
PostsController et /produits/voir\_autorisation correspond à l'action
voir\_autorisation() du contrôleur ProduitsController. Si aucune action
n'est spécifiée dans l'URL, la méthode index() est sous-entendue.

La configuration du routage par défaut vous permet également de passer
des paramètres aux actions en utilisant l'URL. Par exemple, une requête
pour /posts/voir/25 serait équivalente à l'appel de voir(25) dans le
contrôleur PostsController.

Arguments passés
----------------

Les arguments passés sont des arguments additionnels ou des segments du
chemin qui sont utilisés lors d'une requête. Ils sont souvent utilisés
pour transmettre des paramètres aux méthodes de vos contrôleurs.

::

    http://localhost/calendriers/voir/recents/mark

Dans l'exemple ci-dessus, ``recents`` et ``mark``\ sont tous deux des
arguments passés à ``CalendriersController::voir()``. Les arguments
passés sont transmis aux contrôleurs de deux manières. D'abord comme
arguments de la méthode de l'action appelée, mais aussi en étant
accessibles dans ``$this->params['pass']`` sous la forme d'un tableau
indexé numériquement. Lorsque vous utilisez des routes personnalisées il
est possible de forcer des paramètres particuliers comme étant des
paramètres passés égalements. Voir `passer des paramètres à une
action </fr/view/945/Routes-Configuration#Passer-des-paramètres-à-une-action-949>`_
pour plus d'informations.

Paramètres nommés
-----------------

Vous pouvez nommer les paramètres et envoyer leurs valeurs en utilisant
l'URL. Une requête pour
"/posts/voir/titre:premier+post/categorie:general" résultera en un appel
à l'action "voir()" du contrôleur PostsController. Dans cette action,
vous trouverez les valeurs des paramètres "titre" et "categorie"
respectivement dans $this->passedArgs[‘titre’] et
$this->passedArgs[‘categorie’]. Vous pouvez également accéder aux
paramètres nommés depuis ``$this->params['named']``.
``$this->params['named']`` contient un tableau de paramètres nommés
indexés par leurs nom.

Quelques exemples de routes par défaut seront plus parlants.

::

    URL correspondant à une action de contrôleur en utilisant les routes par défaut :  
        
    URL : /singes/saute
    Correspond à : SingesController->saute();
     
    URL : /produits
    Correspond à : ProduitsController->index();
     
    URL: /taches/voir/45
    Correspond à : TachesController->voir(45);
     
    URL: /donations/voir/recentes/2001
    Correspond à : DonationsController->voir('recentes', '2001');

    URL: /contenus/voir/chapitre:modeles/rubrique:associations
    Correspond à : ContenusController->voir();
    $this->passedArgs['chapitre'] = 'modeles';
    $this->passedArgs['rubrique'] = 'associations';
    $this->params['named']['chapitre'] = 'modeles';
    $this->params['named']['rubrique'] = 'associations';

Lorsque l'on fait des routes personnalisées, un piège classique est
d'utiliser des paramètres nommés qui casseront vos routes. Pour résoudre
celà vous devez informer le Router des paramètres qui sont censés être
des paramètres nommés. Sans cette information le Router est incapable de
déterminer si les paramètres nommés doivent en effet être des paramètres
nommés ou des paramètres à router, et supposera par défaut que ce sont
des paramètres à router. Pour connecter des paramètres nommés dans le
routeur utilisez ``Router::connectNamed()``.

Définir des Routes
------------------

Définir vos propres routes vous permet de déterminer comment votre
application répondra à une URL donnée. Définissez vos propres routes
dans le fichier /app/config/routes.php en utilisant la méthode
``Router::connect()``.

La méthode ``connect()`` prend jusqu'à trois paramètres : l'URL que vous
souhaitez détecter, les valeurs par défaut pour les éléments
personnalisés de la route et des règles à base d'expression régulière
pour aider le routeur à trouver les éléments dans l'URL.

Le format de base pour la définition d'une route est :

::

    Router::connect(
        'URL',
        array('nomParametre' => 'valeur_par_defaut'),
        array('nomParametre' => 'expression_a_detecter')
    )

Le premier paramètre est utilisé pour indiquer au routeur quelle sorte
d'URL vous essayez de contrôler. L'URL est une chaîne normale délimitée
par des *slash*, mais elle peut aussi contenir un joker (\*) ou des
éléments de route personnalisés (noms de variables préfixés par deux
points). L'utilisation d'un joker indique au routeur quels types d'URLs
vous voulez détecter et en spécifiant des éléments de route cela vous
permet de rassembler les paramètres pour les actions de vos contrôleurs.

Une fois que vous avez spécifié une URL, vous utilisez les deux derniers
paramètres de ``connect()`` pour indiquer à CakePHP que faire avec une
requête une fois qu'elle a été détectée. Le second paramètre est un
tableau associatif. Les clés du tableau devraient être nommées d'après
les éléments de route dans l'URL ou d'après les éléments par défauts
":controller", ":action" et ":plugin". Les valeurs du tableau sont les
valeurs par défaut pour ces clés. Regardons quelques exemples simples
avant de commencer à utiliser le troisième paramètre de ``connect()``.

::

    Router::connect(
        '/pages/*',
        array('controller' => 'pages', 'action' => 'display')
    );

Cette route se trouve dans le fichier routes.php distribué avec CakePHP
(ligne 40). Cette route intercepte toute URL commençant par /pages/ et
la transmet à la méthode ``display()`` du contrôleur
``PagesController();``. La requéte /pages/produits devrait correspondre
à ``PagesController->display('produits')``, par exemple.

::

    Router::connect(
        '/gouvernement',
        array('controller' => 'produits', 'action' => 'display', 5)
    );

Ce second exemple montre comment vous pouvez utiliser le deuxième
paramètre de ``connect()`` pour définir des paramètres par défaut. Si
vous construisez un site qui propose des produits pour différentes
catégories de consommateurs, vous pourriez envisager de créer une route.
Cela vous permet d'avoir un lien vers /gouvernement plutôt que vers
/produits/display/5.

Une autre utilisation courante du routeur est de définir un "alias" pour
un contrôleur. Disons qu'au lieu d'accéder à notre URL régulière
/utilisateurs/une\_action/5, nous aimerions être en mesure d'y accéder
par /cuisiniers/une\_action/5. La route suivante s'occupe facilement de
cela :

::

    Router::connect(
        '/cuisiniers/:action/*', array('controller' => 'utilisateurs', 'action' => 'index')
    );

Ceci indique au routeur que toute URL commençant par /cuisiniers/ devra
être envoyée au contrôleur "utilisateurs".

Quand on génère des urls, les routes sont utilisées aussi. Utiliser
``array('controller' => 'utilisateurs', 'action' => 'uneAction', 5)``
comme une url affichera /cuisiniers/uneAction/5 si la route ci-dessus
est la première trouvée.

Si nous comptons utiliser des paramètres personnalisés dans notre route,
il faut le spécifier au routeur en utilisant la fonction
``Router::connectNamed``. Donc si vous voulez la route spécifiée plus
haut de reconnaître des URL comme\ ``/cuisiniers/uneAction/type:chef``,
nous devons:

::

    Router::connectNamed(array('type'));
    Router::connect(
        '/cuisiniers/:action/*', array('controller' => 'utilisateurs', 'action' => 'index')
    );

Pour plus de flexibilité, vous pouvez spécifier des éléments
personnalisés de route. Faire cela vous donne le pouvoir de définir les
positions des paramètres dans l'URL pour qu'ils correspondent à ceux des
actions du contrôleur. Quand une requête est faite, les valeurs pour ces
éléments de route personnalisés se trouvent dans la variable
$this->params du contrôleur. Ceci est différent de la façon dont sont
traités les paramètres nommés, notez la distinction : les paramètres
nommés (/controller/action/nom:valeur) se trouve dans $this->passedArgs,
alors que les données des éléments personnalisés de route se trouve dans
$this->params. Quand vous définissez un élément personnalisé de route,
vous devez aussi spécifier une expression régulière - cela indique à
CakePHP comment savoir si l'URL est correctement formée ou pas.

::

    Router::connect(
        '/:controller/:id',
        array('action' => 'voir'),
        array('id' => '[0-9]+')
    );

Ce simple exemple illustre comment créer une voie rapide pour voir les
modèles depuis tout contrôleur, en façonnant une URL qui ressemble à
/nom\_controleur/id. L'URL fournie à connect() spécifie deux éléments de
route : ":controller" et ":id". L'élément ":controller" est un élément
de route par défaut de CakePHP, donc le routeur sait comment intercepter
et identifier les noms de contrôleur dans les URLs. L'élément ":id" est
élément de route personnalisé et doit être davantage clarifier en
spécifiant une expression régulière détectable dans le troisième
paramètre de connect(). Cela indique à CakePHP comment reconnaître l'ID
dans l'URL par opposition à tout autre chose, comme par exemple le nom
d'une action.

Une fois que cette route a été définie, requêter /pommes/5 est la même
chose que /pommes/voir/5. Les deux appelleront la méthode voir() du
contrôleur PommesController. A l'intérieur de la méthode voir(), vous
aurez besoin d'accéder à l'ID passé par $this->params['id'].

Encore un exemple et vous serez un pro du routage.

::

    Router::connect(
        '/:controller/:annee/:mois/:jour',
        array('action' => 'index', 'jour' => null),
        array(
            'annee' => '[12][0-9]{3}',
            'mois' => '0[1-9]|1[012]',
            'jour' => '0[1-9]|[12][0-9]|3[01]'
        )
    );

Ceci est plutôt compliqué, mais montre comment les routes peuvent
vraiment devenir puissantes. L'URL soumise a 4 éléments de route. Le
premier nous est familier : c'est un élément de route par défaut qui
indique à CakePHP d'attendre un nom de contrôleur.

Ensuite, nous spécifions quelques valeurs par défaut. Sans tenir compte
du contrôleur, nous voulons appeler l'action index(). Nous définissons
le paramètre jour à null (le quatrième élément dans l'URL) pour signaler
qu'il est optionnel.

Finalement, nous spécifions quelques expressions régulières qui
correspondront aux années, mois et jours sous forme numérique. Notez que
les parenthèses (groupements) ne sont pas supportées dans les
expressions régulières. Vous pouvez quand même en spécifier d'autres,
comme ci-dessus, mais ne les groupez pas avec des parenthèses.

Une fois définie, cette route détectera /articles/2007/02/01,
/posts/2004/11/16 et /produits/2001/05 (tel que défini, le paramètre
jour est optionnel car il a une valeur par défaut), transmettant les
requêtes aux actions index() de leurs contrôleurs respectifs, avec les
paramètres personnalisés de date dans $this->params.

Passer des paramètres à une action
----------------------------------

Considérons que votre action a été définie comme ceci et que vous voulez
accéder aux arguments en utilisant ``$articleID`` plutôt que
``$this->params['id']``, ajoutez simplement un tableau supplémentaire
dans le 3eme paramètre de ``Router::connect()``.

::

    // un_controller.php
    function voir($articleID = null, $slug = null) {
        // un peu de code ici...
    }

    // routes.php
    Router::connect(
        // Exemple /blog/3-CakePHP_Rocks
        '/blog/:id-:slug',
        array('controller' => 'blog', 'action' => 'voir'),
        array(
            // rien de compliqué, puisque ceci fera simplement correspondre ":id" à $articleID dans votre action
            'pass' => array('id', 'slug'),
            'id' => '[0-9]+'
        )
    )

Et maintenant, merci aux capacités de routage inverse, vous pouvez
passer dans le tableau d'url comme ci-dessous et Cake saura comment
formé l'URL telle que définie dans les routes.

::

    // voir.ctp
    // ceci retourne un lien vers /blog/3-CakePHP_Rocks
    <?= $html->link('CakePHP Rocks', array(
        'controller' => 'blog',
        'action' => 'voir',
        'id' => 3,
        'slug' => Inflector::slug('CakePHP Rocks')
    )) ?>

Préfixe de routage
------------------

De nombreuses applications nécessitent une section d'administration dans
laquelle les utilisateurs privilégiés peuvent faire des modifications.
Ceci est souvent réalisé grâce à une URL spéciale telle que
/admin/utilisateurs/editer/5. Dans CakePHP, le routage admin peut être
activé depuis le fichier de configuration du cœur en réglant le chemin
d'admin via Routing.admin.

::

    Configure::write('Routing.admin', 'admin');

Dans votre contrôleur, toute action avec le préfixe ``admin_`` sera
appelée. En utilisant notre exemple des utilisateurs, accéder à l'url
/admin/utilisateurs/editer/5 devrait appeler la méthode ``admin_editer``
de notre ``UtilisateursController`` en passant 5 comme premier
paramètre. Le fichier de vue correspondant devra être
app/views/utilisateurs/admin\_editer.ctp

Vous pouvez faire correspondre l'url /admin à votre action
``admin_index`` du contrôleur Pages en utilisant la route suivante :

::

    Router::connect('/admin', array('controller' => 'pages', 'action' => 'index', 'admin' => true)); 

Vous pouvez aussi vous servir du Router pour utiliser des préfixes à
destination d'autres choses que du routage d'admin.

::

    Router::connect('/profils/:controller/:action/*', array('prefix' => 'profils', 'profils' => true)); 

Tout appel à la section "profils" devrait entraîner la recherche du
préfixe ``profils_`` dans les appels de méthode. Notre exemple
d'utilisateurs aurait une structure d'url qui ressemble à
/profils/utilisateurs/editer/5 qui appelerait la méthode
``profils_editer`` du ``UtilisateursController``. Une autre chose
importante à retenir, l'utilisation du helper HTML pour construire vos
liens aidera à maintenir les appels de préfixe. Voici construire ce lien
en utilisant le *helper* HTML :

::

    echo $html->link('Editer votre profil', array('profils' => true, 'controller' => 'utilisateurs', 'action' => 'editer', 'id' => 5)); 

Vous pouvez définir plusieurs routes préfixées en utilisant cette
approche afin de créer une structure d'URL flexible pour votre
application.

Routage des Plugins
-------------------

Le routage des Plugins utilise la clé **plugin**. Vous pouvez créer des
liens qui pointent vers un plugin, mais en ajoutant la clé plugin à
votre tableau d'url.

::

    echo $html->link('Nouveau todo', array('plugin' => 'todo', 'controller' => 'todo_items', 'action' => 'creer'));

Inversement, si la requête active est une requête de plugin et que vous
voulez créer un lien qui ne pointe pas vers un plugin, vous pouvez faire
ce qui suit.

::

    echo $html->link('Nouveau todo', array('plugin' => null, 'controller' => 'utilisateurs', 'action' => 'profil'));

En définissant ``plugin => null``, vous indiquez au Routeur que vous
souhaitez créer un lien qui n'est pas une partie d'un plugin.

Extensions de fichier
---------------------

Pour manipuler différentes extensions de fichier avec vos routes, vous
avez besoin d'une ligne supplémentaire dans votre fichier de config des
routes :

::

    Router::parseExtensions('html', 'rss');

Ceci indiquera au routeur de supprimer toutes extensions de fichiers
correspondantes et ensuite d'analyser ce qui reste.

Si vous voulez créer une URL comme /page/titre-de-page.html, vous
devriez créer votre route comme illustré ci-dessous :

::

        Router::connect(
            '/page/:titre',
            array('controller' => 'pages', 'action' => 'voir'),
            array(
                'pass' => array('titre')
            )
        );  

Ensuite pour créer des liens qui s'adapteront aux routes utilisez
simplement :

::

    $html->link('Titre du lien', array('controller' => 'pages', 'action' => 'voir', 'titre' => Inflector::slug('texte à transformer', '-'), 'ext' => 'html'))

Classes de route personnalisés
------------------------------

Les classes de route personnalisés vous permettent d'étendre et de
modifier la façon dont certaines routes demandes d'analyser et de
traiter des routes inversés. Une classe de la route devrait hériter de
la classe ``CakeRoute`` et mettre en œuvre un ou des deux
``match()`` et ``parse()``. Parse est utilisée pour analyser les
demandes et correspondance et il est utilisée pour traiter les routes
inversés.

Vous pouvez utiliser une classe de route personnalisée lors d'un
création d'une route à l'aide des options de la classe ``routeClass``,
et en chargeant le fichier contenant votre routes avant d'essayer de
l'utiliser.

::

    Router::connect(
         '/:slug', 
         array('controller' => 'posts', 'action' => 'view'),
         array('routeClass' => 'SlugRoute')
    );

Cette route créerait une instance de la classe `` SlugRoute `` et vous
permettent de mettre en œuvre la gestion des paramètres personnalisés

Inflexions personnalisées
=========================

Les conventions de nommage de Cake peuvent être vraiment sympas. Vous
pouvez nommer votre table de base de données *big\_boxes*, votre modèle
*BigBox*, votre controleur *BigBoxesController* et tout fonctionne
ensemble automatiquement. La manière dont CakePHP s'y prend pour savoir
comment relier les choses ensemble, consiste à infléchir les mots entre
leurs formes singulier et pluriel.

Dans certaines occasions (spécialement pour nos amis qui ne parlent pas
anglais), vous pouvez rencontrer des situations où "l'inflecteur" de
CakePHP (la classe qui "pluralise", "singularise", *camelCase*, et
"sous\_ligne") ne fonctionnera pas comme vous le souhaiteriez. Si
CakePHP ne veut pas reconnaître votre *Foci* (Ndt : masculin pluriel,
des foyers, en mathématique/physique) ou votre *Fish*, éditer le fichier
de configuration des inflexions est la chose à faire, pour lui expliquer
vos cas particuliers. Ce fichier se trouve dans
/app/config/inflections.php.

Dans ce fichier vous trouverez six variables. Chacune vous permet de
définir finement le comportement d'inflexion de CakePHP.

+-----------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Variable du fichier "inflections.php"   | Description                                                                                                                                                                                                                               |
+=========================================+===========================================================================================================================================================================================================================================+
| $pluralRules                            | Ce tableau contient les expression régulières pour les cas particuliers de mise au pluriel. Les clés du tableaux sont les motifs et les valeurs les correspondances.                                                                      |
+-----------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $uninflectedPlural                      | Un tableau contenant des mots qui ne nécessitent pas d'être modifiés pour passer au pluriel.                                                                                                                                              |
+-----------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $irregularPlural                        | Un tableau contenant des mots et leur pluriel. Les clés contiennent la forme singulier, les valeurs la forme plurielle. Ce tableau devrait être utilisé pour stocker des mots qui ne suivent pas les règles définies dans $pluralRules.   |
+-----------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $singularRules                          | Identique à $pluralRules, ce tableau regroupe les règles qui "singularisent" les mots.                                                                                                                                                    |
+-----------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $uninflectedSingular                    | Identique à $uninflectedPlural, ce tableau regroupe les mots qui n'ont pas de singulier. Il est égal à $uninflectedPlural par défaut.                                                                                                     |
+-----------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $irregularSingular                      | Identique à $irregularPlural, pour les mots au singulier.                                                                                                                                                                                 |
+-----------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

L'amorçage de CakePHP
=====================

Si vous avez des besoins additionnels de configuration, utilisez le
fichier d'amorçage de CakePHP, qui se trouve dans
/app/config/bootstrap.php. Ce fichier est exécuté juste après le
processus d'amorçage du cœur de Cake.

Ce fichier est idéal pour un certain nombre de tâches courantes à lancer
au démarrage :

-  Définir des fonctions de confort
-  Enregistrer des constantes globales
-  Définir des chemins additionnels de modèles, vues et contrôleurs

Assurez-vous de maintenir le motif de conception logiciel MVC quand vous
ajoutez des choses dans le fichier d'amorçage : il peut être tentant de
placer ici des fonctions de formattages au lieu de les utiliser dans vos
contrôleurs.

Résistez à la tentation. Plus tard, vous ne regrettez pas de l'avoir
fait.

Vous pouvez aussi envisager de déposer des choses dans la classe
AppController. Cette classe est la classe parente de tous les
contrôleurs de votre application. AppController est un endroit pratique
pour utiliser les méthodes de rappel (*callbacks*) et définir des
méthodes utilisables par tous vos contrôleurs.
