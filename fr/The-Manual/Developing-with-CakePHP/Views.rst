Vues
####

Vues

Les "Vues" sont le **V** dans MVC. Les vues sont chargées de générer la
sortie spécifique requise par la requête. Souvent, cela est fait sous
forme HTML, XML ou JSON, mais le streaming de fichiers et la création de
PDFs que les utilisateurs peuvent télécharger sont aussi de la
responsabilité de la couche Vues.

Templates de Vue
================

La couche vue de CakePHP c'est la façon dont vous parlez à vos
utilisateurs. La plupart du temps, vos vues afficheront des documents
(X)HTML pour les navigateurs, mais vous pourriez aussi avoir besoin de
fournir des données AMF à un objet Flash, répondre à une application
distante via SOAP ou produire un fichier CSV pour un utilisateur.

Les fichiers de vues de CakePHP sont écrits en pur PHP et ont comme
extension par défaut .ctp (*Cakephp TemPlate*). Ces fichiers contiennent
toute la logique de présentation nécessaire à l'organisation des données
reçues du contrôleur, dans un format qui satisfasse l'audience que vous
recherchez.

Les fichiers de vues sont stockées dans /app/views/, dans un dossier
portant le nom du contrôleur qui utilise ces fichiers et le nom de la
vue correspondante. Par exemple, l'action voir() du contrôleur Produits
devrait normalement se trouver dans /app/views/produits/voir.ctp

La couche vue de CakePHP peut être constituée d'un certain nombre de
parties différentes. Chaque partie a différent usages qui seront
présentés dans ce chapitre :

-  **layouts** : fichiers de vue contenant le code de présentation qui
   se retrouve dans plusieurs interfaces de votre application. La
   plupart des vues sont rendues à l'intérieur d'un layout.
-  **elements** : morceaux de code de vue plus petits, réutilisables.
   Les éléments sont habituellement rendus dans les vues.
-  **helpers** : ces classes encapsulent la logique de vue qui est
   requise à de nombreux endroits de la couche vue. Parmi d'autres
   choses, les *helpers* (assistants) de CakePHP peuvent vous aider à
   créer des formulaires, des fonctionnalités AJAX, de paginer les
   données du modèle ou à délivrer des flux RSS.

Mises en page (layouts)
=======================

Un *layout* (mise en page) contient le code de présentation enveloppe
une vue. Tout ce que vous voulez voir dans toutes vos vues doit être
placé dans un layout.

Les fichiers de mises en page (layout) doivent être placés dans
/app/views/layouts. La mise en page par défaut peut être surchargée en
créant une nouvelle mise en page par défaut dans
/app/views/layouts/default.ctp. Une fois qu'une nouvelle mise en page
par défaut a été créée, le code de la vue affichée par le contrôleur est
placé dans celle-ci lorsque la page est affichée.

Lorsque vous créez une mise en page, vous devez dire à CakePHP où placer
le code de vos vues. Pour ce faire, assurez vous que votre mise en page
contient la variable $content\_for\_layout (et optionnellement,
$title\_for\_layout). Voici un exemple de ce à quoi doit ressembler une
mise en page par défaut :

::

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title><?php echo $title_for_layout?></title><!-- Inclue les fichiers et scripts externes ici (Voir le HTML Helper pour plus d'informations) -->
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">

    <?php echo $scripts_for_layout ?>
    </head>
    <body><!-- Si vous voulez qu'une sorte de menu s'affiche sur toutes vos vues, incluez le ici -->


    <div id="header">
        <div id="menu">...</div>
    </div><!-- C'est ici que je veux que mes vues soient affichées -->


    <?php echo $content_for_layout ?>

    <!-- On ajoute un pied de page à chaque page affichée -->
    <div id="footer">...</div>

    </body>
    </html>

``$scripts_for_layout`` contient tous les fichiers externes et scripts
inclus avec le Helper HTML livré avec Cake. Ceci est utile pour inclure
des fichiers javascript et CSS depuis les vues.

Lorsque vous utilisez ``$html->css()`` ou ``$javascript->link()`` dans
les fichiers de vues, spécifiez 'false' pour l'argument 'in-line' afin
de placer le code source HTML dans ``$scripts_for_layout``. (Voir l'API
pour plus de détails sur l'usage).

``$content_for_layout`` contient la vue. C'est ici que le code de la vue
sera placé.

``$title_for_layout`` contient le titre de la page.

Pour fixer le titre pour la mise en page, c'est encore plus simple
depuis le contrôleur, en utilisant l'attribut $pageTitle du contrôleur.

::

    <?php

    class UtilisateursController extends AppController {
        function vueActive() {
            $this->pageTitle = 'Voir les utilisateurs actifs';
        }
    }
    ?>

Vous pouvez créer autant de mises en pages que vous le souhaitez :
placez les simplement dans le dossier app/views/layouts, et basculez de
l'une à l'autre depuis l'intérieur des actions de vos contrôleurs en
utilisant la variable du contrôleur $layout, ou la fonction setLayout().

Par exemple, si une section de mon site incluait un plus petit espace
pour les bannières publicitaires, je pourrais créer une nouvelle mise en
page avec un plus petit espace pour les annonceurs et la spécifier
commemise en page pour toutes les actions des contrôleurs en utilisant
quelquechose comme :

var $layout = 'petite\_pub\_defaut';

::

    <?php

    class UtilisateursController extends AppController {
        function vueActive() {
            $this->pageTitle = 'Voir les utilisateurs actifs';
            $this->layout = 'petite_pub_defaut';
        }

        function voirImage() {
            $this->layout = 'image';
            // affiche l'image de l'utilisateur
        }
    }
    ?>

CakePHP contient également deux mises en pages essentielles (après la
mise en page par défaut de CakePHP) que vous pouvez utiliser dans vos
propres applications : 'ajax' et 'flash'. La mise en page Ajax est
pratique pour faire à la main des réponses Ajax - c'est une mise en page
vide (la plupart des appels ajax ne requièrent que peu de marquage en
retour, et non une interface d'affichage entière). La mise en page Flash
est utilisée pour l'affichage des messages affichés par la méthode
flash() du contrôleur.

Trois autres mises en pages - xml, js et rss - existent dans le coeur
afin de générer de manière simple et rapide du contenu qui n'est pas du
text/html.

Eléments
========

De nombreuses applications disposent de petits blocs de présentation qui
doivent se répéter de page en page, parfois à des endroits différent du
layout. CakePHP peut vous aider à répéter ces parties de votre site web
qui ont besoin d'être réutilisées. Ces parties sont appelées Eléments.
Avertissements, boîtes d'aide, contrôles de navigation, extra menus,
formulaires de login et infos-bulles sont souvent implémentés comme des
éléments dans CakePHP. Un élément est simplement une mini-vue qui peut
être incluse dans d'autres vues, dans des layouts et même dans d'autres
éléments. Les Eléments peuvent être utilisés pour rendre une vue plus
lisible, en plaçant les éléments répétitifs dans leur propre fichier.
Ils peuvent aussi vous aider à réutiliser des fragments de contenu dans
votre application.

Les éléments sont dans le dossier /app/views/elements/ et ont
l'extension de fichier .ctp. Ils sont affichés en utilisant la méthode
*element* de la vue.

::

    <?php echo $this->element('boite_dialogue'); ?>

Transmettre des variables à un élément
--------------------------------------

Vous pouvez faire passer des données à un élément *via* le second
argument :

::

    <?php echo
    $this->element('aide', 
        array("texteaide" => "Oh, ce texte est vraiment utile."));
    ?>

Dans le fichier correspondant à l'élément, toutes les variables passées
sont accessibles dans le tableau *parameter* (de la même manière que,
dans le contrôleur, ``set()`` envoie les variables aux vues). Dans
l'exemple ci-dessus, vous pouvez utiliser la variable ``$texteaide``
dans le fichier /app/views/elements/helpbox.ctp.

::

    <?php
    echo $texteaide; //affichera "Oh, ce texte est vraiment utile."
    ?>

Dans la fonction ``element()`` sont regroupées les options de l'élément
avec les données à transmettre. Les deux options sont 'cache' et
'plugin'. Par exemple :

::

    <?php echo
    $this->element('aide', 
        array(
            "texteaide" => "Transmis à l'élément dans la variable $texteaide",
            "toto" => "Transmis à l'élément dans la variable $toto",
            "cache" => "+2 days", // mettra l'élément en cache pour 2 jours.
            "plugin" => "" // pour fournir une partie d'un plugin
        )
    );
    ?>

Pour mettre en cache plusieurs versions du même élément dans
l'application, vous pouvez attribuer une clé unique de cache de la
manière suivante :

::

    <?php
    $this->element('aide',
        array(
            "cache" => array('time'=> "+7 days", 
                             'key'=>'valeur unique')
        )
    );
    ?>

Vous pouvez profiter pleinement des élements en utilisant
``requestAction()``. Cette fonction retourne dans un tableau les
variables de vue à partir d'une action d'un contrôleur. Cela permet à
vos éléments de fonctionner en respectant la logique MVC. Créez une
action dans un contrôleur qui prépare les variables de vue pour votre
élément, et appelez ``requestAction()`` dans le second paramètre de
votre fonction ``element()`` pour directement passer à l'élément les
variables issues du contrôleur.

Pour cela, ajoutez dans votre contrôleur un code similaire au suivant :

::

    <?php
    class MessagesController extends AppController {
        ...
        function index() {
            $messages = $this->paginate();
            if (isset($this->params['requested'])) {
                return $messages;
            } else {
                $this->set('messages',$messages);
            }
        }
    }
    ?>

Puis, dans la vue, nous pouvons accéder aux messages triés par pages.
Pour avoir les cinq derniers messages triés, nous pouvons faire quelque
chose de ce style :

::

    <h2>Derniers messages</h2>
    <?php $messages= $this->requestAction('messages/index/sort:created/direction:asc/limit:5'); ?>
    <?php foreach($messages as $message): ?>
    <ol>
        <li><?php echo $message['Message']['titre']; ?></li>
    </ol>
    <?php endforeach; ?>

Mettre en cache les Éléments
----------------------------

Vous pouvez tirer avantage du cache de vue CakePHP si vous fournissez un
paramètre de cache. S'il est défini à true, la mise en cache sera d'un
jour. Sinon, vous pouvez définir d'autres délais d'expiration du cache.
Voir `Mettre en cache </fr/view/156/caching>`_ pour plus d'information
sur les réglages d'expiration.

::

    <?php echo $this->element('boite_dialogue', array('cache' => true)); ?>

Si vous utilisez le même élément plus d'une fois dans une vue et que
vous avez activé la mise en cache, assurez-vous de définir le paramètre
'key' avec un nom différent chaque fois. Cela empêchera chaque appel
successif d'écraser le résultat mis en cache lors du précédent appel à
element(). Par exemple :

::

    <?php
    echo $this->element('boite_dialogue', array('cache' => array('key' => 'premier_usage', 'time' => '+1 day'), 'var' => $variable));

    echo $this->element('boite_dialogue', array('cache' => array('key' => 'second_usage', 'time' => '+1 day'), 'var' => $variableDifferente));
    ?>

De cette façon, on s'assure que chacun des éléments possède sa propre
mise en cache, séparée de l'autre.

Appeler des Eléments depuis un Plugin
-------------------------------------

Si vous utilisez un plugin et que vous souhaitez utiliser des éléments
avec lui, spécifiez simplement le paramètre plugin. Si la vue doit être
rendue pour une action de contrôleur de plugin, elle pointera
automatiquement vers l'élément destiné au plugin. Si l'élément n'existe
pas dans le plugin, elle regardera dans le dossier APP prinicpal.

::

    <?php echo $this->element('boite_dialogue', array('plugin' => 'nom_plugin')); ?>

Méthodes de Vue
===============

Les méthodes de Vue sont accessibles dans tous les fichiers vue, élément
et layout. Pour appeler toute méthode de vue utiliser
``$this->methode()``

set()
-----

``set(string $var, mixed $value)``

Les vues ont une méthode ``set()`` analogue au ``set()`` trouvé dans les
objects Contrôleur. Elle vous permet d'ajouter des variables à
`viewVars <#>`_. Utiliser set() depuis votre fichier de vue ajoutera les
variables au layout et aux éléments qui seront rendus ultérieurement.
Voyez `Controller::set() </fr/view/57/Controller-Methods#set-427>`_ pour
plus d'information sur l'utilisation de set().

Dans votre fichier de vue vous pouvez faire

::

        $this->set('activeMenuBouton', 'posts');

Ensuite dans votre layout la variable ``$activeMenuBouton`` sera
disponible et contiendra la valeur 'posts'.

getVar()
--------

``getVar(string $var)``

Retourne la valeur de viewVar dont le nom est $var

getVars()
---------

``getVars()``

Retourne une liste de toutes les variables de vue disponibles dans le
champ de rendu courant. Retourne un tableau des noms de variable.

error()
-------

``error(int $code, string $name, string $message)``

Affiche une page d'erreur à l'utilisateur. Utilise layouts/error.ctp
pour rendre la page.

::

        $this->error(404, 'Non trouvée', 'Cette page n\'a pas été trouvée, désolé');

Ceci rendra une page d'erreur avec le titre et le message spécifiés. Il
est important de noter que l'exécution du script n'est pas arrêtée par
``View::error()``. Donc vous devrez stopper l'exécution du code vous
même, si vous voulez interrompre le script.

element()
---------

``element(string $elementPath, array $data, bool $loadHelpers)``

Rends un élément ou une vue partielle. Voyez la section sur `View
Elements </fr/view/97/Elements>`_ pour plus d'informations et
d'exemples.

uuid
----

``uuid(string $object, mixed $url)``

Génère un ID DOM unique non-aléatoire pour un objet, basé sur le type
d'objet et l'url. Cette méthode est souvent utilisée par les assistants,
tels que AjaxHelper, qui ont besoin de générer des ID DOM uniques pour
les éléments.

::

        $uuid = $this->uuid('form', array('controller' => 'posts', 'action' => 'index'));
        //$uuid contient 'form0425fe3bad'

addScript()
-----------

``addScript(string $name, string $content)``

Ajoute du contenu au tampon (*buffer*) de scripts interne. Ce buffer est
rendu disponible dans le layout par ``$scripts_for_layout``. Cette
méthode est pratique pour la création d'assistants qui nécessitent
d'ajouter du javascript ou des css directement dans le layout. Gardez à
l'esprit que les scripts ajoutés depuis le layout ou depuis les éléments
dans le layout ne seront pas ajoutés à ``$scripts_for_layout``. Cette
méthode est plus souvent utilisée à l'intérieur des assistants, comme
dans les *Helpers* `Javascript </fr/view/207/Javascript>`_ et
`Html </fr/view/205/HTML>`_.

Thèmes
======

Vous pouvez tirer avantage des thèmes pour rendre le changement de look
et de design de vos pages plus rapide et plus aisé.

Pour utiliser les thèmes, vous devez spécifier à votre contrôleur
d'utiliser la classe *ThemeView* plutôt que la classe par défaut *View*.

::

    class ExemplesController extends AppController {
        var $view = 'Theme';
    }

Pour déclarer quel thème utiliser par défaut, spécifiez le nom de ce
thème dans votre contrôleur :

::

    class ExemplesController extends AppController {
        var $view = 'Theme';
        var $theme = 'exemple_theme';
    }

Vous pouvez également choisir ou changer le thème dans une action, ou
dans les fonctions de rappel ``beforeFilter`` ou ``beforeRender``.

::

    $this->theme = 'autre_exemple_theme';

Les vues de votre thème doivent être situées dans le dossier
/app/views/themed/. Dans ce dossier, créez un nouveau dossier du même
nom que votre thème, par exemple /app/views/themed/exemple\_theme/.
Ensuite, sa structure sera exactement la même que celle de /app/views/.

Par exemple, la vue de votre fonction ``editer()`` d'un contrôleur
Messages se situerait à
/app/views/themed/exemple\_theme/messages/editer.ctp. Les fichiers de
mise en page (*Layout*) seraient quant à eux dans le dossier
/app/views/themed/exemple\_theme/layouts/.

Si CakePHP ne peut trouver la vue dans le dossier du thème, il la
cherchera dans le dossier /app/views/. De cette manière, vous pouvez
créer des vues générales, et simplement les adapter à votre thème, au
cas-par-cas, dans le dossier adapté.

Si vous avez des fichiers CSS ou JavaScript qui sont spécifiques à votre
thème, vous pouvez les stocker dans un dossier de thème à l'intérieur de
webroot. Vos feuilles de style seront par exemple situées dans
/app/webroot/themed/exemple\_theme/css/, et vos fichiers JavaScript
seront dans /app/webroot/themed/exemple\_theme/js/.

Tous les Helpers natifs de CakePHP savent gérer les thèmes, et créeront
les bons chemins d'accès de façon automatique. De même qu'avec les vues,
si un fichier n'est pas dans le dossier du thème, l'utilisateur sera
renvoyé par défaut à la racine.

Vues Media
==========

Les vues de media vous permettent d'envoyer des fichiers binaires à
l'utilisateur. Par exemple, vous pouvez souhaiter avoir un dossier de
fichiers extérieur à votre webroot afin d'empêcher les utilisateurs
d'avoir un lien direct vers eux. Vous pouvez utiliser la vue de Media
pour récupérer le fichier depuis un dossier spécial de /app/, ce qui
vous permet d'effectuer une authentification avant de délivrer le
fichier à l'utilisateur.

Pour utiliser la vue Media, vous devez dire à vôtre contrôleur
d'utiliser la classe MediaView au lieu de la classe par défaut View.
Après ça, passez simplement des paramètres additionnels pour spécifier
l'emplacement de votre fichier.

::

    class ExempleController extends AppController {
        function telecharger () {
            $this->view = 'Media';
            $params = array(
                  'id' => 'exemple.zip',
                  'name' => 'exemple',
                  'download' => true,
                  'extension' => 'zip',
                  'path' => 'fichiers' . DS
           );
           $this->set($params);
        }
    }

Voici un exemple de rendu d'un fichier qui n'a pas son type mime inclut
dans le tableau ``$mimeType``.

::

    function telecharger(){
        $this->view = 'Media';
        $params = array(
            'id' => 'exemple.docx',
            'name' => 'exemple',
            'extension' => 'docx',
            'mimeType' => array('docx' => 'application/vnd.openxmlformats-officedocument.wordprecessingml.document'),
            'path' => APP.'fichiers'.DS
        );
        $this->set($params);
    }

+--------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Paramètres   | Description                                                                                                                                                                                                                                 |
+==============+=============================================================================================================================================================================================================================================+
| id           | L'ID est le nom du fichier tel qu'il est sur le serveur de fichiers, extension incluse.                                                                                                                                                     |
+--------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| name         | Le nom vous permet de spécifier un nom de fichier alternatif qui sera envoyé à l'utilisateur. Spécifiez le nom sans l'extension du fichier.                                                                                                 |
+--------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| download     | Une valeur booléenne indiquant si les en-têtes doivent être définis pour forcer le téléchargement. Notez que l'option autoRender de votre contrôleur doit être définie à ``false`` pour que ceci fonctionne correctement.                   |
+--------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| extension    | L'extension du fichier. Ceci est comparé avec une liste interne de types mime acceptables. Si le type mime spécifié n'est pas dans la liste, le fichier ne sera pas téléchargé.                                                             |
+--------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| path         | Le nom du dossier, incluant le séparateur de dossiers final. Le chemin devrait être absolu, mais il peut être relatif au dossier APP/webroot.                                                                                               |
+--------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| mimeType     | Un tableau avec des types mime additionnels qui seront fusionnés avec la liste interne des types mime acceptables présent dans la classe MediaView.                                                                                         |
+--------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| cache        | Une valeur booléenne ou entière - Si définie à *true*, autorise les navigateurs à mettre le fichier en cache (si non définie, défaut à *false*) ; autrement, définissez-la à un nombre de secondes à partir duquel le cache doit expirer.   |
+--------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

