Views (Vues)
############

Les Views (Vues) sont le **V** dans MVC. Les vues sont chargées de générer la
sortie spécifique requise par la requête. Souvent, cela est fait sous forme
HTML, XML ou JSON, mais le streaming de fichiers et la création de PDFs que les
utilisateurs peuvent télécharger sont aussi de la responsabilité de la
couche View.

CakePHP a quelques classes de vue déjà construites pour gérer les scénarios de
rendu les plus communs:

- Pour créer des services web XML ou JSON, vous pouvez utiliser
  :doc:`views/json-and-xml-views`.
- Pour servir des fichiers protégés, ou générer des fichiers dynamiquement,
  vous pouvez utiliser :ref:`cake-response-file`.
- Pour créer plusieurs vues pour un thème, vous pouvez utiliser
  :doc:`views/themes`.

Templates de Views
==================

La couche view de CakePHP c'est la façon dont vous parlez à vos utilisateurs.
La plupart du temps, vos vues afficheront des documents (X)HTML pour les
navigateurs, mais vous pourriez aussi avoir besoin de fournir des données AMF
à un objet Flash, répondre à une application distante via SOAP ou produire un
fichier CSV pour un utilisateur.

Les fichiers de vues de CakePHP sont écrits en pur PHP et ont comme extension
par défaut .ctp (Cakephp TemPlate). Ces fichiers contiennent toute la logique
de présentation nécessaire à l'organisation des données reçues du controller,
dans un format qui satisfasse l'audience que vous recherchez. Si vous préférez
utiliser un langage de template comme Twig, ou Smarty, une sous-classe de View
fera le pont entre votre language de template et CakePHP.

Les fichiers de vues sont stockées dans ``/app/View/``, dans un dossier portant
le nom du controller qui utilise ces fichiers et le nom de la vue
correspondante. Par exemple, l'action "view()" du controller Produits devrait
normalement se trouver dans ``/app/View/Products/view.ctp``.

La couche vue de CakePHP peut être constituée d'un certain nombre de parties
différentes. Chaque partie a différent usages qui seront présentés dans ce
chapitre :

- **views**: Les Views sont la partie de la page qui est unique pour l'action
  lancée. Elles sont la substance de la réponse de votre application.
- **elements** : morceaux de code de view plus petits, réutilisables. Les
  éléments sont habituellement rendus dans les vues.
- **layouts** : fichiers de vue contenant le code de présentation qui se
  retrouve dans plusieurs interfaces de votre application. La plupart des
  vues sont rendues à l'intérieur d'un layout.
- **helpers** : ces classes encapsulent la logique de vue qui est requise
  à de nombreux endroits de la couche view. Parmi d'autres choses, les helpers
  de CakePHP peuvent vous aider à créer des formulaires, des fonctionnalités
  AJAX, à paginer les données du model ou à délivrer des flux RSS.


.. _extending-views:

Views étendues
--------------

.. versionadded:: 2.1

Une vue étendue vous permet d'enrouler une vue dans une autre. En combinant
cela avec :ref:`view blocks <view-blocks>`, cela vous donne une façon puissante
pour garder vos vues :term:`DRY`. Par exemple, votre application a une sidebar
qui a besoin de changer selon la vue spécifique en train d'être rendue. En
étendant un fichier de vue commun, vous pouvez éviter de répeter la balise
commune pour votre sidebar, et seulement définir les parties qui changent::

    // app/View/Common/view.ctp
    <h1><?php echo $this->fetch('title'); ?></h1>
    <?php echo $this->fetch('content'); ?>

    <div class="actions">
        <h3>Related actions</h3>
        <ul>
        <?php echo $this->fetch('sidebar'); ?>
        </ul>
    </div>

Le fichier de vue ci-dessus peut être utilisé comme une vue parente. Il
s'attend à ce que la vue l'étendant définisse des blocks ``sidebar``
et ``title``. Le block ``content`` est un block spécial que CakePHP
crée. Il contiendra tous les contenus non capturés de la vue étendue.
En admettant que notre fichier de vue a une variable ``$post`` avec les
données sur notre post. Notre vue pourrait ressembler à ceci::

    <?php
    // app/View/Posts/view.ctp
    $this->extend('/Common/view');

    $this->assign('title', $post);

    $this->start('sidebar');
    ?>
    <li>
    <?php
    echo $this->Html->link('edit', array(
        'action' => 'edit',
        $post['Post']['id']
    )); ?>
    </li>
    <?php $this->end(); ?>

    // Le contenu restant sera disponible en tant que block 'content'
    // dans la vue parente.
    echo h($post['Post']['body']);

L'exemple ci-dessus vous montre comment vous pouvez étendre une vue, et
remplir un ensemble de bloc. Tout contenu qui ne serait pas déjà dans un bloc
défini, sera capturé et placé dans un block spécial appellé ``content``. Quand
une vue contient un appel vers un ``extend()``, l'éxécution continue jusqu'à la
fin de la vue actuelle. Une fois terminé, la vue étendue va être générée. En
appellant ``extend()`` plus d'une fois dans un fichier de vue, le dernier appel
va outrepasser les précédents::

    $this->extend('/Common/view');
    $this->extend('/Common/index');

Le code précédent va définir ``/Common/index.ctp`` comme étant la vue parente
de la vue actuelle.

Vous pouvez imbriquer les vues autant que vous le voulez et que cela vous est
nécessaire. Chaque vue peut étendre une autre vue si vous le souhaitez. Chaque
vue parente va récupérer le contenu de la vue précédente en tant que bloc
``content``.

.. note::

    Vous devriez éviter d'utiliser ``content`` comme nom de block dans votre
    application. CakePHP l'utilise pour définir le contenu non-capturé pour
    les vues étendues.

.. _view-blocks:

Utiliser les blocs de vues
==========================

.. versionadded:: 2.1

Les blocs de vue remplacent les ``$scripts_for_layout`` et fournissent une
API flexible qui vous permet de définir des slots (emplacements), ou blocs,
dans vos vues / layouts qui peuvent être définies ailleurs. Par exemple, les
blocs pour implémenter des choses telles que les sidebars, ou des régions pour
charger des ressources dans l'en-tête / pied de page du layout. Un block peut
être défini de deux manières. Soit en tant que block capturant, soit en le
déclarant explicitement. Les méthodes ``start()``, ``append()`` et ``end()``
vous permettent de travailler avec les blocs capturant::

    // Creer le block sidebar.
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();


    // Le rattacher a la sidebar plus tard.
    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

Vous pouvez aussi le rattacher à l'intérieur d'un block en utilisant ``start()``
pluieurs fois. La méthode ``assign()`` peut être utilisée pour nettoyer ou
outrepasser un block à n'importe quel moment::

    // Nettoyer le contenu précedent de la sidebar.
    $this->assign('sidebar', '');


Dans 2.3, certaines nouvelles méthodes ont été ajoutées pour travailler avec
les blocs. Le ``prepend()`` pour ajouter du contenu avant un block existant::

    // Ajoutez avant la sidebar
    $this->prepend('sidebar', 'ce contenu va au-dessus de la sidebar');

La méthode ``startIfEmpty()`` peut être utilisée pour commencer un bloc
**seulement** si il est vide ou non défini. Si le block existe déjà, le contenu
capturé va être écarté. C'est utile quand vous voulez définir le contenu par
défaut de façon conditionnel pour un bloc, qui ne doit pas déjà exister:

.. code-block:: php

    // Dans un fichier de vue.
    // Crée un block de navbar
    $this->startIfEmpty('navbar');
    echo $this->element('navbar');
    echo $this->element('notifications');
    $this->end();

.. code-block:: php

    // Dans une vue/layout parente
    <?php $this->startIfEmpty('navbar'); ?>
    <p>Si le block n est pas défini pour l instant - montrer ceci à la place</p>
    <?php $this->end(); ?>

    // Quelque part plus loin dans la vue/layout parent
    echo $this->fetch('navbar');

Dans l'exemple ci-dessus, le block ``navbar`` va seulement contenir le contenu
ajouté dans la première section. Puisque le block a été défini dans la vue
enfant, le contenu par défaut avec la balise ``<p>`` sera écarté.

.. versionadded: 2.3
    ``startIfEmpty()`` et ``prepend()`` ont été ajoutées dans 2.3.

.. note::

    Vous devriez éviter d'utiliser ``content`` comme nom de bloc. Celui-ci est 
    utilisé par CakePHP en interne pour étendre les vues, et le contenu des
    vues dans le layout.

Afficher les blocs
------------------

.. versionadded:: 2.1

Vous pouvez afficher les blocs en utilisant la méthode ``fetch()``. Cette
dernière va, de manière sécurisée, générer un bloc, en retournant '' si le bloc
n'existe pas::

    echo $this->fetch('sidebar');

Vous pouvez également utiliser fetch pour afficher du contenu, sous conditions,
qui va entourer un block existant. Ceci est très utile dans les layouts, ou
dans les vues étendues lorsque vous voulez, sous conditions, afficher des
en-têtes ou autres balises::

    // dans app/View/Layouts/default.ctp
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Menu options</h3>
        <?php echo $this->fetch('menu'); ?>
    </div>
    <?php endif; ?>

Depuis 2.3.0, vous pouvez aussi fournir une valeur par défaut pour un bloc
qui ne devrait pas avoir de contenu. Cela vous permet d'ajouter facilement
du contenu placeholder, pour des déclarations vides. Vous pouvez fournir
une valeur par défaut en utilisant le 2ème argument::

    <div class="shopping-cart">
        <h3>Your Cart</h3>
        <?php echo $this->fetch('cart', 'Votre cart est vide'); ?>
    </div>

.. versionchanged:: 2.3
    L'argument ``$default`` a été ajouté dans 2.3.

Utiliser des blocks pour les fichiers de script et les CSS
----------------------------------------------------------

.. versionadded:: 2.1

Les Blocks remplacent la variable de layout ``$scripts_for_layout`` qui est
dépréciée. A la place, vous devrez utiliser les blocks.
:php:class:`HtmlHelper` lie dans les blocks de vues avec les méthodes
:php:meth:`~HtmlHelper::script()`, :php:meth:`~HtmlHelper::css()`, et
:php:meth:`~HtmlHelper::meta()` qui chacune met à jour un block avec
le même nom quand l'option ``inline = false`` est utilisée::

    <?php
    // dans votre fichier de vue
    $this->Html->script('carousel', array('inline' => false));
    $this->Html->css('carousel', null, array('inline' => false));
    ?>

    // dans votre fichier de layout.
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?php echo $this->fetch('title'); ?></title>
        <?php echo $this->fetch('script'); ?>
        <?php echo $this->fetch('css'); ?>
        </head>
        // rest du layout suit

Le :php:meth:`HtmlHelper` vous permet aussi de contrôler vers quels blocks vont
les scripts::

    // dans votre vue
    $this->Html->script('carousel', array('block' => 'scriptBottom'));

    // dans votre layout
    echo $this->fetch('scriptBottom');

.. _view-layouts:

Layouts
=======

Un layout contient le code de présentation qui entoure une vue.
Tout ce que vous voulez voir dans toutes vos vues devra être placé dans un
layout.

Le fichier de layout par défaut de CakePHP est placé dans
``/app/View/Layouts``. Si vous voulez changer entièrement le look de votre
application, alors c'est le bon endroit pour commencer, parce que le code de
vue de rendu du controller est placé à l'intérieur du layout par défaut quand
la page est rendue.

Les autres fichiers de layout devront être placés dans ``/app/View/Layouts``.
Quand vous créez un layout, vous devez dire à CakePHP où placer
la sortie pour vos vues. Pour ce faire, assurez-vous que votre layout contienne
``$this->fetch('content')``. Voici un exemple de ce à quoi un layout pourrait
ressembler::

   <!DOCTYPE html>
   <html lang="en">
   <head>
   <title><?php echo $this->fetch('title'); ?></title>
   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
   <!-- Include external files and scripts here (See HTML helper for more info.) -->
   echo $this->fetch('meta');
   echo $this->fetch('css');
   echo $this->fetch('script');
   ?>
   </head>
   <body>

   <!-- Si vous voulez afficher une sorte de menu pour toutes vos vues, mettez
   le ici -->
   <div id="header">
       <div id="menu">...</div>
   </div>

   <!-- Voilà l'endroit ou je souhaite que mes vues soient affichées -->
   <?php echo $this->fetch('content'); ?>

   <!-- Ajoute un footer sur chaque page affichée -->
   <div id="footer">...</div>

   </body>
   </html>

.. note::

    Avant la version 2.1, la méthode fetch() n'était pas disponible,
    ``fetch('content')`` remplace ``$content_for_layout`` et les lignes
    ``fetch('meta')``, ``fetch('css')`` et ``fetch('script')`` étaient
    contenues dans la variable ``$scripts_for_layout`` dans la version 2.0.

Les blocks ``script``, ``css`` et ``meta`` contiennent tout contenu défini
dans les vues en utilisant le helper HTML intégré. Il est utile pour inclure
les fichiers JavaScript et les CSS à partir des vues.

.. note::

    Quand vous utilisez :php:meth:`HtmlHelper::css()` ou
    :php:meth:`HtmlHelper::script()` dans les fichiers de vues, spécifiez
    'false' dans l'option 'inline' option pour placer la source html dans un
    block avec le même nom. (Regardez l'API pour plus de détails sur leur
    utilisation).

Le block ``content`` contient les contenus de la vue rendue.

``$title_for_layout`` contient le titre de la page. Cette variable est générée
automatiquement, mais vous pouvez la surcharger en la configurant dans votre
controller/view.

Pour définir le titre pour le layout, il est plus facile de le faire dans le
controller, en configurant la variable ``$title_for_layout``::

   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'Voir les Utilisateurs actifs');
       }
   }

Vous pouvez aussi définir la variable title_for_layout depuis l'intérieur
d'un fichier de vue::

    $this->set('title_for_layout', $titleContent);

Vous pouvez créer autant de layouts que vous souhaitez: placez les juste dans
le répertoire ``app/View/Layouts``, et passez de l'un à l'autre depuis les
actions de votre controller en utilisant la propriété
:php:attr:`~View::$layout` de votre controller ou de votre vue::

    // A partir d'un controller
    public function admin_view() {
        // stuff
        $this->layout = 'admin';
    }

    // A partir d'un fichier de vue
    $this->layout = 'loggedin';

Par exemple, si une section de mon site incorpore un plus petit espace pour
une bannière publicitaire, je peux créer un nouveau layout avec le plus
petit espace de publicité et le spécifier comme un layout pour toutes les
actions du controller en utilisant quelque chose comme::

   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'Voir les Utilisateurs actifs');
           $this->layout = 'default_small_ad';
       }

       public function view_image() {
           $this->layout = 'image';
           //sort une image de l\'utilisateur
       }
   }

CakePHP dispose de deux fonctionnalités de layout dans le coeur (en plus
du layout default de CakePHP) que vous pouvez utiliser dans votre propre
application: 'ajax' et 'flash'.
Le layout AJAX est pratique pour élaborer des réponses AJAX - c'est un layout
vide (la plupart des appels ajax ne nécessitent qu'un peu de balise en retour,
et pas une interface de rendu complète). Le layout flash est utilisé
pour les messages montrés par la méthode :php:meth:`Controller::flash()`.

Trois autres layouts, xml, js, et rss, existent dans le coeur permettant
de servir rapidement et facilement du contenu qui n'est pas du text/html.

Utiliser les layouts à partir de plugins
----------------------------------------

.. versionadded:: 2.1

Si vous souhaitez utiliser un layout qui existe dans un plugin, vous pouvez
utiliser la :term:`syntaxe de plugin`. Par exemple pour utiliser le layout de
contact à partir du plugin Contacts::

    class UsersController extends AppController {
        public function view_active() {
            $this->layout = 'Contacts.contact';
        }
    }


.. _view-elements:

Elements
========

Beaucoup d'applications ont des petits blocks de code de présentation qui
doivent être répliqués d'une page à une autre, parfois à des endroits
différents dans le layout. CakePHP peut vous aider à répéter des parties
de votre site web qui doivent être réutilisées. Ces parties réutilisables
sont appelées des Elements. Les publicités, les boites d'aides, les contrôles
de navigation, les menus supplémentaires, les formulaires de connexion et de
sortie sont souvent intégrés dans CakePHP en elements. Un element est tout
bêtement une mini-vue qui peut être inclue dans d'autres vues, dans les
layouts, et même dans d'autres elements. Les elements peuvent être utilisés
pour rendre une vue plus lisible, en plaçant le rendu d'éléments répétitifs
dans ses propres fichiers. Ils peuvent aussi vous aider à réutiliser des
fragments de contenu dans votre application.

Les elements se trouvent dans le dossier ``/app/View/Elements/``, et ont une
extension .ctp. Ils sont affichés en utilisant la méthode element de la vue::

    echo $this->element('helpbox');

Passer des Variables à l'intérieur d'un Element
-----------------------------------------------

Vous pouvez passer des données dans un element grâce au deuxième argument
de element::

    echo $this->element('helpbox', array(
        "helptext" => "Oh, this text is very helpful."
    ));

Dans le fichier element, toutes les variables passés sont disponibles comme
des membres du paramètre du tableau (de la même manière que
:php:meth:`Controller::set()` fonctionne dans le controller avec les fichiers
de vues). Dans l'exemple ci-dessus, le fichier
``/app/View/Elements/helpbox.ctp`` peut utiliser la variable ``$helptext``::

    // A l'intérieur de app/View/Elements/helpbox.ctp
    echo $helptext; //outputs "Oh, this text is very helpful."

La méthode :php:meth:`View::element()` supporte aussi les options pour
l'element. Les options supoortés sont 'cache' et 'callbacks'. Un exemple::

    echo $this->element('helpbox', array(
            "helptext" => "Ceci est passé à l'element comme $helptext",
            "foobar" => "Ceci est passé à l'element via $foobar",
        ),
        array(
            // utilise la configuration de cache "long_view"
            "cache" => "long_view",
            // défini à true pour avoir before/afterRender appelé pour l'element
            "callbacks" => true
        )
    );

La mise en cache d'element est facilitée par la classe :php:class:`Cache`. Vous
pouvez configurer les elements devant être stockés dans toute configuration de
Cache que vous avez défini. Cela vous donne une grande flexibilité pour
choisir où et combien de temps les elements sont stockés. Pour mettre en cache
les différentes versions du même element dans une application,
fournissez une valeur unique de la clé cache en utilisant le format suivant::

    $this->element('helpbox', array(), array(
            "cache" => array('config' => 'short', 'key' => 'unique value')
        )
    );

Vous pouvez tirer profit des elements en utilisant ``requestAction()``. La
fonction ``requestAction()`` récupère les variables de vues à partir
d'une action d'un controller et les retourne en tableau. Cela permet à vos
elements de fonctionner dans un style MVC pur. Créez une action du controller
qui prépare les variables de la vue pour vos elements, ensuite appelez
``requestAction()`` depuis l'intérieur du deuxième paramètre de ``element()``
pour alimenter en variables de vues l'element depuis votre controller.

Pour ce faire, ajoutez quelque chose comme ce qui suit dans votre controller,
en reprenant l'exemple du Post::

    class PostsController extends AppController {
        // ...
        public function index() {
            $posts = $this->paginate();
            if ($this->request->is('requested')) {
                return $posts;
            } else {
                $this->set('posts', $posts);
            }
        }
    }

Et ensuite dans l'element, nous pouvons accéder au model des posts paginés.
Pour obtenir les cinq derniers posts dans une liste ordonnée, nous ferions
ce qui suit:

.. code-block:: php

    <h2>Derniers Posts</h2>
    <?php
      $posts = $this->requestAction(
        'posts/index/sort:created/direction:asc/limit:5'
      );
    ?>
    <ol>
    <?php foreach ($posts as $post): ?>
          <li><?php echo $post['Post']['title']; ?></li>
    <?php endforeach; ?>
    </ol>

Mise en cache des Elements
--------------------------

Vous pouvez tirer profit de la mise en cache de vue de CakePHP si vous
fournissez un paramètre cache. Si défini à true, cela va mettre en cache
l'element dans la configuration 'default' de Cache. Sinon, vous pouvez définir
la configuration de cache devant être utilisée. Regardez
:doc:`/core-libraries/caching` pour plus d'informations sur la façon de
configurer :php:class:`Cache`. Un exemple simple de mise en cache d'un element
serait par exemple::

    echo $this->element('helpbox', array(), array('cache' => true));

Si vous rendez le même element plus d'une fois dans une vue et que vous avez
activé la mise en cache, assurez-vous de définir le paramètre 'key' avec
un nom différent à chaque fois. Cela évitera que chaque appel successif
n'écrase le résultat de la mise en cache du précédent appel de element().
Par exemple::

    echo $this->element(
        'helpbox',
        array('var' => $var),
        array('cache' => array('key' => 'first_use', 'config' => 'view_long')
    );

    echo $this->element(
        'helpbox',
        array('var' => $differenVar),
        array('cache' => array('key' => 'second_use', 'config' => 'view_long')
    );

Ce qui est au-dessus va s'enquérir que les deux résultats d'element sont
mis en cache séparément. Si vous voulez que tous les elements mis en cache
utilisent la même configuration du cache, vous pouvez sauvegarder quelques
répétitions, en configurant :php:attr:`View::$elementCache` dans la
configuration de Cache que vous souhaitez utiliser. CakePHP va utiliser cette
configuration, quand aucune n'est donnée.

Requêter les Elements à partir d'un Plugin
------------------------------------------

2.0
---

Pour charger un element d'un plugin, utilisez l'option `plugin` (retiré de
l'option `data` dans 1.x)::

    echo $this->element('helpbox', array(), array('plugin' => 'Contacts'));

2.1
---

Si vous utilisez un plugin et souhaitez utiliser les elements à partir de
l'intérieur d'un plugin, utilisez juste la :term:`syntaxe de plugin`
habituelle. Si la vue est rendue pour un controller/action d'un plugin, le nom
du plugin va automatiquement être préfixé pour tous les elements utilisés, à
moins qu'un autre nom de plugin ne soit présent.
Si l'element n'existe pas dans le plugin, il ira voir dans le dossier principal
APP.::

    echo $this->element('Contacts.helpbox');

Si votre vue fait parti d'un plugin, vous pouvez ne pas mettre le nom du
plugin. Par exemple, si vous êtes dans le ``ContactsController`` du plugin
Contacts::

    echo $this->element('helpbox');
    // et
    echo $this->element('Contacts.helpbox');

Sont équivalents et résulteront au même element rendu.

.. versionchanged:: 2.1
    L'option ``$options[plugin]`` a été déprécié et le support pour
    ``Plugin.element`` a été ajouté.

Créer vos propres classes de vue
================================

Vous avez peut-être besoin de créer vos propres classes de vue pour activer des
nouveaux types de données de vue, ou ajouter de la logique supplémentaire
de rendu de vue personnalisée. Comme la plupart des components de CakePHP, les
classes de vue ont quelques conventions:

* Les fichiers de classe de View doivent être mis dans ``App/View``. Par
  exemple ``App/View/PdfView.php``.
* Les classes de View doivent être suffixées avec ``View``. Par exemple
  ``PdfView``.
* Quand vous référencez les noms de classe de vue, vous devez omettre le
  suffixe ``View``. Par exemple ``$this->viewClass = 'Pdf';``.

Vous voudrez aussi étendre ``View`` pour vous assurer que les choses
fonctionnent correctement::

    // dans App/View/PdfView.php

    App::uses('View', 'View');
    class PdfView extends View {
        public function render($view = null, $layout = null) {
            // logique personnalisée ici.
        }
    }

Remplacer la méthode render vous laisse le contrôle total sur la façon dont
votre contenu est rendu.

API de View
===========

.. php:class:: View

Les méthodes de View sont accessibles dans toutes les vues, element et fichiers
de layout.
Pour appeler toute méthode de view, utilisez ``$this->method()``

.. php:method:: set(string $var, mixed $value)

    Les Views ont une méthode ``set()`` qui est analogue à ``set()`` qui
    se trouvent dans les objets du controller. Utiliser set() à partir
    de votre fichier de vue va ajouter les variables au layout et aux elements
    qui seront rendus plus tard. Regarder :ref:`controller-methods` pour plus
    d'informations sur l'utilisation de set().

    Dans votre fichier de vue, vous pouvez faire::

        $this->set('activeMenuButton', 'posts');

    Ensuite dans votre fichier de layout la variable ``$activeMenuButton``
    sera disponible et contiendra la valeur 'posts'.

.. php:method:: get(string $var, $default = null)

    Récupère la valeur d'une viewVar avec le nom de ``$var``.

    Depuis 2.5 vous pouvez fournir une valeur par défaut dans le cas où la
    variable n'est pas déjà définie.

    .. versionchanged:: 2.5
        L'argument ``$default`` a été ajouté dans 2.5.

.. php:method:: getVar(string $var)

    Récupère la valeur de viewVar avec le nom $var.

    .. deprecated:: 2.3
        Utilisez :php:meth:`View::get()` à la place.

.. php:method:: getVars()

    Récupère une liste de toutes les variables de view disponibles
    dans le cadre de rendu courant. Retourne un tableau des noms de variable.

.. php:method:: element(string $elementPath, array $data, array $options = array())

    Rend un element ou une vue partielle. Regardez la section sur
    :ref:`view-elements` pour plus d'informations et d'exemples.

.. php:method:: uuid(string $object, mixed $url)

    Génère un ID de DOM unique pour un objet non pris au hasard, basé sur le
    type d'objet et l'URL. Cette méthode est souvent utilisée par les helpers
    qui ont besoin de générer un ID de DOM unique pour les elements comme
    le :php:class:`JsHelper`::

        $uuid = $this->uuid(
          'form',
          array('controller' => 'posts', 'action' => 'index')
        );
        //$uuid contains 'form0425fe3bad'

.. php:method:: addScript(string $name, string $content)

    Ajoute du contenu au buffer des scripts internes. Ce buffer est rendu
    disponible dans le layout dans ``$scripts_for_layout``. Cette méthode est
    utile quand vous créez des helpers qui ont besoin d'ajouter du JavaScript
    ou du CSS directement au layout. Gardez à l'esprit que les scripts ajoutés
    à partir du layout, ou des elements du layout ne seront pas ajoutés à
    ``$scripts_for_layout``. Cette méthode est plus souvent utilisée de
    l'intérieur des helpers, comme pour les helpers
    :doc:`/core-libraries/helpers/js` et :doc:`/core-libraries/helpers/html`.

    .. deprecated:: 2.1
        Utilisez les fonctionnalités :ref:`view-blocks` à la place.

.. php:method:: blocks

    Récupère les noms de tous les blocks définis en tant que tableau.

.. php:method:: start($name)

    Commence un block de capture pour un block de vue. Regardez la section
    :ref:`view-blocks` pour avoir des exemples.

    .. versionadded:: 2.1

.. php:method:: end

    Termine le block de capture ouvert le plus en haut. Regardez la section sur
    les :ref:`view-blocks` pour avoir des exemples.

    .. versionadded:: 2.1

.. php:method:: append($name, $content)

    Ajoute dans le block avec ``$name``. Regardez la section sur les
    :ref:`view-blocks` pour des exemples.

    .. versionadded:: 2.1

.. php:method:: prepend($name, $content)

    Ajoute avant dans le block avec ``$name``. Regardez la section
    :ref:`view-blocks` pour des exemples.

    .. versionadded:: 2.3

.. php:method:: startIfEmpty($name)

    Commence un block sous conditions, seulement si il est vide. Tout le
    contenu dans le block va être capturé et écarté si le block est déjà
    défini.

    .. versionadded:: 2.3

.. php:method:: assign($name, $content)

    Assigne la valeur d'un block. Cela va surcharger tout contenu existant.
    Regardez la section sur les :ref:`view-blocks` pour des exemples.

    .. versionadded:: 2.1

.. php:method:: fetch($name, $default = '')

    Récupère la valeur d'un block. Si un block est vide ou non défini, '' va
    être retourné. Regardez la section sur les :ref:`view-blocks` pour
    des exemples.

    .. versionadded:: 2.1

.. php:method:: extend($name)

    Etend la vue/element/layout courant avec celle contenu dans $name. Regardez
    la section sur les :ref:`extending-views` pour les exemples.

    .. versionadded:: 2.1

.. php:attr:: layout

    Définit le layout qui va entourer la vue courante.

.. php:attr:: elementCache

    La configuration de cache utilisée pour les elements de cache. Définir
    cette propriété va changer la configuration par défaut utilisée pour mettre
    en cache les elements. Celle par défaut peut être surchargée en utilisant
    l'option 'cache' dans la méthode element.

.. php:attr:: request

    Une instance de :php:class:`CakeRequest`. Utilisez cette instance pour
    accéder aux informations qui concernent la requête courante.

.. php:attr:: output

    Contient le dernier contenu rendu d'une view, ou d'un fichier de view, ou
    d'un contenu de layout.

    .. deprecated:: 2.1
        Utilisez ``$view->Blocks->get('content');`` à la place.

.. php:attr:: Blocks

    Une instance de :php:class:`ViewBlock`. Utilisé pour fournir la
    fonctionnalité des blocks de view dans le rendu de view.

    .. versionadded:: 2.1

En savoir plus sur les vues
===========================

.. toctree::
    :maxdepth: 1

    views/themes
    views/json-and-xml-views
    views/helpers


.. meta::
    :title lang=fr: Views (Vues)
    :keywords lang=fr: logique de vue,fichier csv,élements de réponse,éléments de code,extension par défaut,json,objet flash,remote application,twig,sous-classe,ajax,répondre,soap,fonctionnalité,cakephp,fréquentation,xml,mvc
