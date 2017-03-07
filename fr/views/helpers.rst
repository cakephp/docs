Helpers (Assistants)
####################

Les Helpers (Assistants) sont des classes comme les components, pour la couche
de présentation de votre application. Ils contiennent la logique de
présentation qui est partagée entre plusieurs vues, elements ou layouts. Ce
chapitre vous montrera comment créer vos propres helpers et soulignera les
tâches basiques que les helpers du cœur de CakePHP peuvent vous aider à
accomplir.

CakePHP dispose d'un certain nombre de helpers qui aident à la création des
vues. Ils aident à la création de balises bien-formatées (y compris les
formulaires), aident à la mise en forme du texte, les durées et les nombres,
et peuvent même accélérer la fonctionnalité AJAX. Pour plus d'informations sur
les helpers inclus dans CakePHP, regardez le chapitre pour chaque helper:

.. toctree::
    :maxdepth: 1

    /views/helpers/breadcrumbs
    /views/helpers/flash
    /views/helpers/form
    /views/helpers/html
    /views/helpers/number
    /views/helpers/paginator
    /views/helpers/rss
    /views/helpers/session
    /views/helpers/text
    /views/helpers/time
    /views/helpers/url

.. _configuring-helpers:

Configurer les Helpers
======================

Dans CakePHP, vous chargez les helpers en les déclarant dans une classe view.
Une classe ``AppView`` est fournie avec chaque application CakePHP et est le
lieu idéal pour charger les helpers::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadHelper('Html');
            $this->loadHelper('Form');
            $this->loadHelper('Flash');
        }
    }

Le chargement des helpers depuis les plugins utilise la
:term:`syntaxe de plugin` utilisée partout ailleurs dans CakePHP::

    $this->loadHelper('Blog.Comment');

Vous n'avez pas à charger explicitement les helpers fournis par CakePHP ou de
votre application. Ces helpers seront chargés paresseusement (lazily) au moment
de la première utilisation. Par exemple::

    // Charge le FormHelper s'il n'a pas été chargé précédemment.
    $this->Form->create($article);

A partir d'une vue de plugin, les helpers de plugin peuvent également être
chargés paresseusement. Par exemple, les templates de vues dans le plugin
'Blog', peuvent charger paresseusement les helpers provenant du même plugin.

Chargement Conditionnel des Helpers
-----------------------------------

Vous pouvez utiliser le nom de l'action courante pour charger
conditionnellement des helpers::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            if ($this->request->getParam('action') === 'index') {
                $this->loadHelper('ListPage');
            }
        }
    }

Vous pouvez également utiliser la méthode ``beforeRender()`` de vos controllers
pour charger des helpers::

    class ArticlesController extends AppController
    {
        public function beforeRender(Event $event)
        {
            parent::beforeRender($event);
            $this->viewBuilder()->helpers(['MyHelper']);
        }
    }

Options de Configuration
------------------------

Vous pouvez passer des options de configuration dans les helpers. Ces options
peuvent être utilisées pour définir les valeurs d'attributs ou modifier le
comportement du helper::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\View;

    class AwesomeHelper extends Helper
    {

        // Le hook initialize() est disponible depuis 3.2. Pour les versions
        // précédentes, vous pouvez surcharger le constructeur si nécessaire.
        public function initialize(array $config)
        {
            debug($config);
        }
    }

    class AwesomeController extends AppController
    {
        public $helpers = ['Awesome' => ['option1' => 'value1']];
    }

Les options peuvent être spécifiées lors de la déclaration des helpers dans le
controller comme montré ci-dessous::

    namespace App\Controller;

    use App\Controller\AppController;

    class AwesomeController extends AppController
    {
        public $helpers = ['Awesome' => ['option1' => 'value1']];
    }

Par défaut, toutes les options de configuration sont fusionnées avec la
propriété ``$_defaultConfig``. Cette propriété doit définir les valeurs par
défaut de toute configuration dont votre helper a besoin. Par exemple::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\StringTemplateTrait;

    class AwesomeHelper extends Helper
    {

        use StringTemplateTrait;

        protected $_defaultConfig = [
            'errorClass' => 'error',
            'templates' => [
                'label' => '<label for="{{for}}">{{content}}</label>',
            ],
        ];
    }

Toute configuration fournie au constructeur de votre helper sera fusionnée avec
les valeurs par défaut pendant la construction et les données fusionnées seront
définies à ``_config``. Vous pouvez utiliser la méthode ``config()`` pour lire
la configuration actuelle::

    // Lit l'option de config errorClass.
    $class = $this->Awesome->config('errorClass');

L'utilisation de la configuration du helper vous permet de configurer de manière
déclarative vos helpers et de garder la logique de configuration en dehors des
actions de votre controller. Si vous avez des options de configuration qui ne
peuvent pas être inclues comme une partie de la classe de déclaration, vous
pouvez les définir dans le callback ``beforeRender()`` de votre controller::

    class PostsController extends AppController
    {
        public function beforeRender(Event $event)
        {
            parent::beforeRender($event);
            $builder = $this->viewBuilder();
            $builder->helpers([
                'CustomStuff' => $this->_getCustomStuffConfig()
            ]);
        }
    }

.. _aliasing-helpers:

Faire des Alias de Helpers
--------------------------

Une configuration habituelle à utiliser est l'option ``className``, qui vous
permet de créer des alias de helpers dans vos vues. Cette fonctionnalité est
utile quand vous voulez remplacer ``$this->Html`` ou une autre référence du
Helper habituel avec une implémentation personnalisée::

    // src/View/AppView.php
    class AppView extends View
    {
        public function initialize()
        {
            $this->loadHelper('Html', [
                'className' => 'MyHtml'
            ]);
        }
    }

    // src/View/Helper/MyHtmlHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper\HtmlHelper;

    class MyHtmlHelper extends HtmlHelper
    {
        // Ajout de code pour surcharger le HtmlHelper du cœur
    }

Ce qui est au-dessus va faire un *alias* de ``MyHtmlHelper`` vers
``$this->Html`` dans vos vues.

.. note::

    Faire un alias remplace cette instance partout où le helper est utilisé,
    ainsi que dans les autres Helpers.

Utiliser les Helpers
====================

Une fois que vous avez configuré les helpers que vous souhaitiez utiliser, dans
votre controller, chaque helper est exposé en propriété publique dans la vue.
Par exemple, si vous utilisiez :php:class:`HtmlHelper`, vous serez capable
d'y accéder en faisant ce qui suit::

    echo $this->Html->css('styles');

Ce qui est au-dessus appellera la méthode ``css`` du HtmlHelper. Vous pouvez
accéder à n'importe quel helper chargé en utilisant ``$this->{$helperName}``.

Charger les Helpers à la Volée
------------------------------

Il peut y avoir des cas où vous aurez besoin de charger dynamiquement un helper
depuis l'intérieur d'une vue. Pour cela, vous pouvez utiliser le
:php:class:`Cake\\View\\HelperRegistry`::

    // Les deux solutions fonctionnent.
    $mediaHelper = $this->loadHelper('Media', $mediaConfig);
    $mediaHelper = $this->helpers()->load('Media', $mediaConfig);

Le HelperCollection est une :doc:`registry </core-libraries/registry-objects>`
et supporte l'API collection utilisée partout ailleurs dans CakePHP.

Méthodes de Callback
====================

Les Helpers disposent de plusieurs callbacks qui vous permettent d'augmenter
le processus de rendu de vue. Allez voir la documentation de :ref:`helper-api`
et :doc:`/core-libraries/events` pour plus d'informations.

Créer des Helpers
=================

Vous pouvez créer des classes de helper personnalisées pour les utiliser dans
votre application ou dans vos plugins.
Comme la plupart des components de CakePHP, les classes de helper ont quelques
conventions:

* Les fichiers de classe Helper doivent être placés dans **src/View/Helper**.
  Par exemple: **src/View/Helper/LinkHelper.php**
* Les classes Helper doivent être suffixées avec ``Helper``. Par exemple:
  ``LinkHelper``.
* Quand vous référencez les noms de classe helper, vous devez omettre le suffixe
  ``Helper``. Par exemple: ``$this->loadHelper('Link');``.

Vous devrez étendre ``Helper`` pour vous assurer que les choses fonctionnent
correctement::

    /* src/View/Helper/LinkHelper.php */
    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        public function makeEdit($title, $url)
        {
            // La logique pour créer le lien spécialement formaté se place ici
        }
    }

Inclure d'autres Helpers
------------------------

Vous souhaitez peut-être utiliser quelques fonctionnalités déjà existantes dans
un autre helper. Pour faire cela, vous pouvez spécifier les helpers que
vous souhaitez utiliser avec un tableau ``$helpers``, formaté comme vous le
feriez dans un controller::

    /* src/View/Helper/LinkHelper.php (utilisant d'autres helpers) */

    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        public $helpers = ['Html'];

        public function makeEdit($title, $url)
        {
            // Utilise le Helper Html pour afficher la sortie
            // des données formatées:

            $link = $this->Html->link($title, $url, ['class' => 'edit']);

            return '<div class="editOuter">' . $link . '</div>';
        }
    }


.. _using-helpers:

Utiliser votre Helper
---------------------

Une fois que vous avez créé votre helper et l'avez placé dans
**src/View/Helper/**, vous pouvez le charger dans vos vues::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadHelper('Link');
        }
    }

Une fois que votre helper est chargé, vous pouvez l'utiliser dans vos vues en
accédant à l'attribut de vue correspondant::

    <!-- fait un lien en utilisant le nouveau helper -->
    <?= $this->Link->makeEdit('Changez cette Recette', '/recipes/edit/5') ?>

.. note::

    ``HelperRegistry`` va tenter de charger automatiquement les helpers qui ne
    sont pas spécifiquement identifiés dans votre ``Controller``.

Accéder aux variables de la View dans votre Helper
--------------------------------------------------

Si vous voulez accéder à une variable de la View dans votre helper, vous pouvez
utiliser ``$this->_View->viewVars``, comme illustré ci-dessous::

    class AwesomeHelper extends Helper
    {

        public $helpers = ['Html'];

        public someMethod()
        {
            // Définit la meta description
            echo $this->Html->meta(
                'description', $this->_View->viewVars['metaDescription'], ['block' => 'meta']
            );
        }
    }

Rendre un Element de Vue dans votre Helper
------------------------------------------

Si vous souhaiter rendre un Element dans votre Helper, vous pouvez utiliser
**$this->_View->element()** comme ceci::

    class AwesomeHelper extends Helper
    {
        public someFunction()
        {
            // Affiche directement dans votre helper
            echo $this->_View->element('/path/to/element',['foo'=>'bar','bar'=>'foo']);

            // ou le retourne dans votre vue
            return $this->_View->element('/path/to/element',['foo'=>'bar','bar'=>'foo']);
        }
    }

.. _helper-api:

Classe Helper
=============

.. php:class:: Helper

Callbacks
---------

En implémentant une méthode de callback dans un helper, CakePHP va
automatiquement inscrire votre helper à l'évènement correspondant. A la
différence des versions précédentes de CakePHP, vous *ne* devriez *pas* appeler
``parent`` dans vos callbacks, puisque la classe Helper de base n'implémente
aucune des méthodes de callback.

.. php:method:: beforeRenderFile(Event $event, $viewFile)

    Est appelé avant que tout fichier de vue soit rendu. Cela inclut les
    elements, les vues, les vues parentes et les layouts.

.. php:method:: afterRenderFile(Event $event, $viewFile, $content)

    Est appelé après que tout fichier de vue est rendu. Cela inclut les
    elements, les vues, les vues parentes et les layouts. Un callback
    peut modifier et retourner ``$content`` pour changer la manière dont
    le contenu rendu est affiché dans le navigateur.

.. php:method:: beforeRender(Event $event, $viewFile)

    La méthode ``beforeRender()`` est appelée après la méthode
    ``beforeRender()`` du controller, mais avant les rendus du controller de la
    vue et du layout. Reçoit le fichier à rendre en argument.

.. php:method:: afterRender(Event $event, $viewFile)

    Est appelé après que la vue est rendu, mais avant que le rendu du
    layout ait commencé.

.. php:method:: beforeLayout(Event $event, $layoutFile)

    Est appelé avant que le rendu du layout commence. Reçoit le nom du fichier
    layout en argument.

.. php:method:: afterLayout(Event $event, $layoutFile)

    Est appelée après que le rendu du layout est fini. Reçoit le nom du fichier
    layout en argument.

.. meta::
    :title lang=fr: Helpers (Assistants)
    :keywords lang=fr: classe php,fonction time,couche de présentation,puissance du processeur,ajax,balise,tableau,fonctionnalité,logique,syntaxe,éléments,cakephp,plugins
