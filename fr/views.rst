Views (Vues)
############

Les "Vues" sont le **V** dans MVC. Les vues sont chargées de générer la sortie 
spécifique requise par la requête. Souvent, cela est fait sous forme HTML, 
XML ou JSON, mais le streaming de fichiers et la création de PDFs que les 
utilisateurs peuvent télécharger sont aussi de la responsabilité de la 
couche View.

CakePHP a quelques classes de vue déjà construites pour gérer les scénarios de 
rendu les plus communs:

- Pour créer des services web XML ou JSON, vous pouvez utiliser 
  :doc:`views/json-and-xml-views`.
- Pour servir des fichiers protégés, ou générer des fichiers dynamiquement, 
  vous pouvez utiliser :doc:`views/media-view`
- Pour créer des vues multiples par thème, vous pouvez utliser 
  :doc:`views/themes`

Templates de Views
==================

La couche view de CakePHP c'est la façon dont vous parlez à vos utilisateurs. 
La plupart du temps, vos vues afficheront des documents (X)HTML pour les 
navigateurs, mais vous pourriez aussi avoir besoin de fournir des données AMF 
à un objet Flash, répondre à une application distante via SOAP ou produire un 
fichier CSV pour un utilisateur.

Les fichiers de vues de CakePHP sont écrits en pur PHP et ont comme extension 
par défaut .ctp (Cakephp TemPlate). Ces fichiers contiennent toute la logique 
de présentation nécessaire à l'organisation des données reçues du contrôleur, 
dans un format qui satisfasse l'audience que vous recherchez. Si vous préfèrez 
utiliser un langage de template comme Twig, ou Smarty, une sous-classe de View 
fera le pont entre votre language de template et CakePHP.

Les fichiers de vues sont stockées dans ``/app/View/``, dans un dossier portant 
le nom du contrôleur qui utilise ces fichiers et le nom de la vue 
correspondante. Par exemple, l'action "view()" du contrôleur Produits devrait 
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
  à de nombreux endroits de la couche vue. Parmi d'autres choses, les helpers 
  (assistants) de CakePHP peuvent vous aider à créer des formulaires, des 
  fonctionnalités AJAX, de paginer les données du modèle ou à délivrer des 
  flux RSS.


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
s'attend à ce que la vue étendue, il va définir des blocks ``sidebar`` 
et ``title``. Le block ``content`` est un block spécial que CakePHP 
crée. Il contiendra tous les contenus non capturés de la vue étendue. 
En admettant que notre fichier de vue a une variable ``$posts`` avec les 
données sur notre post. Notre vue pourrait ressembler à ceci::

    // app/View/Posts/view.ctp
    $this->extend('/Common/view');

    $this->assign('titre', $post)

    $this->start('sidebar');
    ?>
    <li>    echo $this->Html->link('edit', array(
        'action' => 'edit',
        $post['Post']['id']
    )); ?>
    </li>
    <?php $this->end(); ?>

    // The remaining content will be available as the 'content' block
    // in the parent view.
    echo h($post['Post']['body']);

L'exemmple ci-dessus vous montre comment vous pouvez étendre une vue, et
remplir un ensemble de bloc. Tout contenu qui ne serait pas déjà dans un bloc
défini, sera capturé et placé dans un bloc spécial appellé ``content``. Quand
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

    Vous devriez éviter d'utiliser ``content`` comme nom de bloc dans votre 
    application. CakePHP l'utilise pour définir le contenu non-capturé pour 
    les vues étendues.

.. _view-blocks:

Utiliser les bloc dans les vues
===============================

.. versionadded:: 2.1

Les blocs de vue remplacent les ``$scripts_for_layout`` et fournissent une
API flexible qui vous permet de définir des slots (emplacements), ou blocs,
dans vos vues / gabarits qui peuvent être définies ailleurs. Par exemple, les
blocs pour implémenter des choses telles que les sidebars, ou des régions pour
charger des ressources dans l'en-tête / pied de page du gabarit. Un bloc peut
être définit de deux manières. Soit en tant que bloc capturant, soit en le
déclarant explicitement. Les méthodes ``start()``, ``append()`` et ``end()``
vous permettent de travailler avec les blocs capturant.

    // Creer le bloc sidebar.
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();


    // Le rattacher a la sidebar plus tard.
    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

Vous pouvez aussi le rattacher à l'intérieur d'un bloc en utilisant ``start()``
pluieurs fois. La méthode ``assign()`` peut être utilisée pour nettoyer ou
outrepasser un bloc à n'importe quel moment::

    // Nettoyer le contenu précedent de la sidebar.
    $this->assign('sidebar', '');

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

    <?php echo $this->fetch('sidebar'); ?>

Vous pouvez également utiliser fetch pour afficher du contenu, sous conditions,
qui va entourer un bloc existant. Ceci est très utile dans les gabarits, ou
dans les vues étendues où vous voulez, sous conditions, afficher des en-têtes
ou autres marquages::

    // dans app/View/Layouts/default.ctp
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Menu options</h3>
        <?php echo $this->fetch('menu'); ?>
    </div>
    <?php endif; ?>

Utiliser des blocks pour les fichiers de script et les css
----------------------------------------------------------

.. versionadded:: 2.1

Les Blocks remplacent la variable de layout ``$scripts_for_layout`` qui est
dépréciée. A la place, vous devrez utiliser les blocks.
:php:class:`HtmlHelper` lie dans les blocks de vues avec les méthodes 
:php:meth:`~HtmlHelper::script()`, :php:meth:`~HtmlHelper::css()`, et
:php:meth:`~HtmlHelper::meta()` qui chacune met à jour un block avec
le même nom quand l'option ``inline = false`` est utilisée::

    // dans votre fichier de vue
    $this->Html->script('carousel', array('inline' => false));
    $this->Html->css('carousel', null, array('inline' => false));
    ?>

    // dnas votre fichier de layout.
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?php echo $this->fetch('title'); ?></title>
        <?php echo $this->fetch('script'); ?>
        <?php echo $this->fetch('css'); ?>
        </head>
        // rest of the layout follows

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

Les fichiers de layout doivent être placés dans ``/app/View/Layouts``. Le
layout de CakePHP par défaut peut être surchargé en créant un nouveau layout
par défaut dans ``/app/View/Layouts/default.ctp``. Une fois qu'un nouveau
layout default a été crée, le code de la vue rendu par le controller est placé
à l'intérieur du layout default quand la page est affichée.

Quand vous créez un layout, vous devez dire à CakePHP où placer
le code pour vos vues. Pour ce faire, assurez-vous que votre layout contienne
``$this->fetch('content')``. Voici un exemple auquel un layout pourrait
ressembler::

   <!DOCTYPE html>
   <html lang="en">
   <head>
   <title><?php echo $title_for_layout?></title>
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

    Avant la version 2.1, la méthode fetch() n'était pas disponible, ``fetch('content')``
    remplace ``$content_for_layout`` et les lignes ``fetch('meta')``,
    ``fetch('css')`` et ``fetch('script')`` étaient contenues dans la variable
    ``$scripts_for_layout`` dans la version 2.0

Les blocks ``script``, ``css`` et ``meta`` contiennent tout contenu défini
dans les vues en utilisant le helper HTML intégré. Il est utile pour inclure
les fichiers javascript et les CSS à partir des vues.

.. note::

    Quand vous utilisez :php:meth:`HtmlHelper::css()` ou :php:meth:`HtmlHelper::script()`
    dans les fichiers de vues, spécifiez 'false' dans l'option 'inline' option
    pour placer la source html dans un block avec le même nom. (Regardez l'API
    pour plus de détails sur leur utilisation).

Le block ``content`` contient les contenus de la vue rendue.

``$title_for_layout`` contient le titre de la page. Cette variable est générée
automatiquement, mais vous pouvez la surcharger en la configurant dans votre
controller/view.

Pour définir le titre pour le layout, il est plus facile de le faire dans le
controller, en configurant la variable ``$title_for_layout``::

   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'View Active Users');
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
           $this->set('title_for_layout', 'View Active Users');
           $this->layout = 'default_small_ad';
       }

       public function view_image() {
           $this->layout = 'image';
           //output user image
       }
   }

CakePHP dispose de deux fonctionnalités de layout dans le coeur (en plus
du layout default de CakePHP) vous pouvez utiliser dans votre propre
application: 'ajax' et 'flash'.
Le layout Ajax est pratique pour élaborer des réponses Ajax - c'est un layout
vide (la plupart des appels ajax ne nécessitent qu'un peu de balise en retour,
et pas une interface de rendu complète). Le layout flash est utilisé
pour les messages montrés par la méthode :php:meth:`Controller::flash()`.

Trois autres layouts, xml, js, et rss, existent dans le coeur pour une façon
rapide et facile pour servir du contenu qui n'est pas du text/hmtl.

Utiliser les layouts à partir de plugins
----------------------------------------

.. versionadded:: 2.1

Si vous souhaitez utiliser un layout qui existe dans un plugin, vous pouvez
utiliser :term:`syntaxe de plugin`. Par exemple pour utiliser le layout de
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
différents des le layout. CakePHP peut vous aider à répéter des parties
de votre site web qui doivent être réutilisées. Ces parties réutilisables
sont appelées des Elements. Les Publicités, les boites d'aides, les contrôles
de navigation, les menus supplémentaires, les formulaires de connexion et de
sortie sont souvent intégrés dans CakePHP en elements. Un element est tout
bêtement une mini-vue qui peut être inclue dans d'autres vues, dans les
layouts, et même dans d'autres elements. Les elements peuvent être utilisés
pour rendre une vue plus lisible, en plaçant le rendu d'éléments répétitifs
dans ses propres fichiers. Ils peuvent aussi vous aider à réutiliser des
fragments de contenu dans votre application.

Les elements se trouvent dans le dossier ``/app/View/Elements/``, et ont une
extension .ctp. Ils sont affichés en utilisant la méthode element de la vue::

    <?php echo $this->element('helpbox'); ?>

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
            "cache" => "long_view", // utilise la configuration de cache "long_view"
            "callbacks" => true // défini à true pour avoir before/afterRender appelé pour l'element
        )
    );

La mise en cache d'element est facilitée par la classe :php:class:`Cache`. Vous
pouvez configurer les elements pour être stockés dans toute configuration de
Cache que vous avez défini. Cecla vous donne une grande flexibilité pour
choisir où et combien de temps les elements sont stockés. Pour mettre en cache
les différentes versions du même element dans une application,
fournissez une valeur de clé cache unique en utilisant le format suivant::

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
ce qui suit::

    <h2>Derniers Posts</h2>
    <?php $posts = $this->requestAction('posts/index/sort:created/direction:asc/limit:5'); ?>
    <?php foreach ($posts as $post): ?>
    <ol>
        <li><?php echo $post['Post']['title']; ?></li>
    </ol>
    <?php endforeach; ?>

Mise en cache des Elements
--------------------------

Vous pouvez tirer profit de la mise en cache de vue de CakePHP si vous
fournissez un paramètre cache. Si défini à true, cela va mettre en cache
l'element dans la configuration 'default' de Cache. Sinon, vous pouvez définir
quelle configuration de cache doit être utilisée. Regardez 
:doc:`/core-libraries/caching` pour plus d'informations sur la façon de
configurer :php:class:`Cache`. Un exemple simple de mise en cache d'un element
serait par exemple::

    <?php echo $this->element('helpbox', array(), array('cache' => true)); ?>

Si vous rendez le même element plus d'une fois dans une vue et que vous avez
activer la mise en cache, assurez-vous de définir le paramètre 'key' avec
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

Ce qui st au-dessus va s'enquérir que les deux résultats d'element sont
mis en cache séparément. Si vous voulez que tous les elements mis en cache
utilisent la même configuration du cache, vous pouvez sauvegarder quelques
répétitions, en configurant :php:attr:`View::$elementCache` à la configuration
de Cache que vous souhaitez utiliser. CakePHP va utiliser cette configuration,
quand aucune n'est donnée.

Requêter les Elements à partir d'un Plugin
------------------------------------------

2.0
---

Pour charger un element d'un plugin, utilisez l'option `plugin` (enlevé de
l'option `data` dans 1.x)::

    <?php echo $this->element('helpbox', array(), array('plugin' => 'Contacts'));

2.1
---

Si vous utilisez un plugin et souhaitez utiliser les elements à partir de
l'intérieur d'un plugin, utilisez juste la :term:`syntaxe de plugin`
habituelle. Si la vue est rendue pour un controller/action d'un plugin, le nom
du plugin va automatiquement être préfixé pour tous les elements utilisés, à
moins qu'un autre nom de plugin ne soit présent.
Si l'element n'existe pas dans le plugin, il ira voir dans le dossier principal
APP.::

    <?php echo $this->element('Contacts.helpbox'); ?>

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


View API
========

.. php:class:: View

Les méthodes de View sont accessibles dans toutes les vues, element et fichiers
de layout.
Pour appeler toute méthode de view, utilisez ``$this->method()``

.. php:method:: set(string $var, mixed $value)

    Les Views ont une méthode ``set()`` qui est analogue à ``set()`` qui
    se trouvent dans les objets du controller. Utiliser set() à partir
    de votre fichier de vue va ajouter les variables au layout et elements
    qui seront rendus plus tard. Regarder :ref:`controller-methods` pour plus
    d'informations sur l'utilisation de set().

    Dans votre fichier de vue, vous pouvez faire::

        $this->set('activeMenuButton', 'posts');

    Ensuite dans votre fichier de layout la variable ``$activeMenuButton``
    sera disponible et contiendra la valeur 'posts'.

.. php:method:: getVar(string $var)

    Récupère la valeur de viewVar avec le nom $var

.. php:method:: getVars()

    Récupère une liste de toutes les variables de view disponibles
    dans le cadre de rendu courant. Retourne un tableau des noms de variable.

.. php:method:: element(string $elementPath, array $data, array $options = array())

    Rend un element ou une vue partiel. Regardez la section sur
    :ref:`view-elements` pour plus d'informations et d'exemples.

.. php:method:: uuid(string $object, mixed $url)

    Génére un ID de DOM unique pas au hasard pour un objet, basé sur le type
    d'objet et l'url. Cette méthode est souvent utilisée par les helpers qui
    ont besoin de générer un ID de DOM unique pour les elements comme
    le :php:class:`JsHelper`::

        $uuid = $this->uuid('form', array('controller' => 'posts', 'action' => 'index'));
        //$uuid contient 'form0425fe3bad'

.. php:method:: addScript(string $name, string $content)

    Ajoute du contenu au buffer des scripts internes. Ce buffer est rendu
    disponible dans le layout dans ``$scripts_for_layout``. Cette méthode est
    utile quand vous créez des helpers qui ont besoin d'ajouter du javascript
    ou du css directement au layout. Gardez à l'esprit que les scripts ajoutés
    à partir du layout, ou des elements du layout ne seront pas ajoutés à
    ``$scripts_for_layout``. Cette méthode est plus souvent utilisée de
    l'intérieur des helpers, comme pour les helpers
    :doc:`/core-libraries/helpers/js` et :doc:`/core-libraries/helpers/html`.

    .. deprecated:: 2.1
        Utilisez les fonctionnalités :ref:`view-blocks` à la place.

.. php:method:: blocks

    Récupère les noms de tous les blocks définis en tant que tableau.

.. php:method:: start($name)

    Commence un block de capture pour un block de vue. Regardez la section sur
    les :ref:`view-blocks` pour avoir des exemples.

    .. versionadded:: 2.1

.. php:method:: end

    Termine le block de capture ouvert le plus en haut. Regardez la section sur
    les :ref:`view-blocks` pour avoir des exemples.

    .. versionadded:: 2.1

.. php:method:: append($name, $content)

    Ajoute dans le block avec ``$name``. Regardez la section sur les
    :ref:`view-blocks` pour des exemples.

    .. versionadded:: 2.1

.. php:method:: assign($name, $content)

    Assigne la valeur d'un block. Cela va surcharger tout contenu existant.
    Regardez la section sur les :ref:`view-blocks` pour des exemples.

    .. versionadded:: 2.1

.. php:method:: fetch($name)

    Récupère la valeur d'un block. '' Va être retourné pour les blocks qui
    ne sont pas définis. Regardez la section sur les :ref:`view-blocks` pour
    des exemples.

    .. versionadded:: 2.1

.. php:method:: extend($name)

    Etend la view/element/layout courante avec celle dans $name. Regardez la
    section sur les :ref:`extending-views` pour les examples.

    .. versionadded:: 2.1

.. php:attr:: layout

    Définissez le layout qui va entouré la vue courante.

.. php:attr:: elementCache

    La configuration de cache utilisée pour les elements de cache. Définir
    cette propriété va changer la configuration par défaut utilisée pour mettre
    en cache les elements. Celle par défaut peut être surchargée en utilisant
    l'option 'cache' dans la méthode element.

.. php:attr:: request

    Une instance de :php:class:`CakeRequest`. Utilisez cette instance pour
    accéder aux informations qui concernent la requête courante.

.. php:attr:: output

    Contient le dernier contenu rendu d'une view, ou d'un fichier de view , ou
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

    views/themes
    views/media-view
    views/json-and-xml-views
    views/helpers


.. meta::
    :title lang=fr: Views (Vues)
    :keywords lang=fr: logique de vue,fichier csv,élements de réponse,éléments de code,extension par défaut,json,objet flash,remote application,twig,sous-classe,ajax,répondre,soap,fonctionnalité,cakephp,fréquentation,xml,mvc
