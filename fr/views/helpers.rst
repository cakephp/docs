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

.. include:: /core-libraries/toc-helpers.rst
    :start-line: 11

.. _configuring-helpers:

Configurer les Helpers
======================

Vous activez les helpers dans CakePHP, en faisant "prendre conscience" à un
controller qu'ils existent. Chaque controller a une propriété
:php:attr:`~Cake\\Controller\\Controller::$helpers`, qui liste les helpers
disponibles dans la vue. Pour activer un helper dans votre vue, ajoutez son nom
au tableau ``$helpers`` du controller::

    class BakeriesController extends AppController {
        public $helpers = ['Form', 'Html', 'Js', 'Time'];
    }

L'ajout des helpers depuis les plugins utilise la :term:`syntaxe de plugin`
utilisée partout ailleurs dans CakePHP::

    class BakeriesController extends AppController {
        public $helpers = ['Blog.Comment'];
    }

Vous pouvez aussi ajouter les helpers depuis une action, dans ce cas,
ils seront uniquement accessibles pour cette action et dans aucune autre action
du controller. Ceci économise de la puissance de calcul pour les autres actions
qui n'utilisent pas le helper, tout en permettant de conserver le controller
mieux organisé::

    class BakeriesController extends AppController {
        public function bake() {
            $this->helpers[] = 'Time';
        }
        public function mix() {
            // Le Helper Time n'est pas chargé ici et n'est par conséquent
            // pas disponible
        }
    }

Si vous avez besoin d'activer un helper pour tous les controllers, ajoutez
son nom dans le tableau ``$helpers`` du fichier
``/app/Controller/AppController.php`` (à créer si pas présent). N'oubliez pas
d'inclure les helpers par défaut Html et Form::

    class AppController extends Controller {
        public $helpers = ['Form', 'Html', 'Js', 'Time'];
    }

Options de Configuration
------------------------

Vous pouvez passer des options de configuration dans les helpers. Ces options
peuvent être utilisées pour définir les valeurs d'attributs ou modifier le
comportement du helper::

    class AwesomeHelper extends AppHelper {
        public function __construct(View $view, $config = []) {
            parent::__construct($view, $config);
            debug($config);
        }
    }

    class AwesomeController extends AppController {
        public $helpers = ['Awesome' => ['option1' => 'value1']];
    }

Par défaut, les options de configuration sont fusionnées avec la propriété
``$_defaultConfig``. Cette propriété doit définir les valeurs par défaut de
toute configuration dont votre helper a besoin. Par exemple::

    namespace App\View\Helper;

    use Cake\View\StringTemplateTrait;

    class AwesomeHelper extends AppHelper {

        use StringTemplateTrait;

        protected $_defaultConfig = [
            'errorClass' => 'error',
            'templates' => [
                'label' => '<label for="{{for}}">{{content}}</label>',
            ],
        ];

        public function __construct(View $view, $config = []) {
            parent::__construct($view, $config);
            $this->initStringTemplates();
        }
    }

Any configuration provided to your helper's constructor will be merged with the
default values during construction and the merged data will be set to
``_config``. You can use the ``config()`` method to read runtime configuration::

    // Read the errorClass config option.
    $class = $this->Awesome->config('errorClass');

Using helper configuration allows you to declaratively configure your helpers and
keep configuration logic out of your controller actions. If you have
configuration options that cannot be included as part of a class declaration,
you can set those in your controller's beforeRender callback::

    class PostsController extends AppController {
        public function beforeRender() {
            parent::beforeRender();
            $this->helpers['CustomStuff'] = $this->_getCustomStuffConfig();
        }
    }


Aliasing Helpers
----------------

One common setting to use is the ``className`` option, which allows you to
create aliased helpers in your views. This feature is useful when you want to
replace ``$this->Html`` or another common Helper reference with a custom
implementation::

    // App/Controller/PostsController.php
    class PostsController extends AppController {
        public $helpers = [
            'Html' => [
                'className' => 'MyHtml'
            ]
        ];
    }

    // App/View/Helper/MyHtmlHelper.php
    use Cake\View\Helper\HtmlHelper;

    class MyHtmlHelper extends HtmlHelper {
        // Add your code to override the core HtmlHelper
    }

The above would *alias* ``MyHtmlHelper`` to ``$this->Html`` in your views.

.. note::

    Aliasing a helper replaces that instance anywhere that helper is used,
    including inside other Helpers.

Utiliser les Helpers
====================

Une fois que vous avez configuré les helpers que vous souhaitiez utiliser, dans
votre controller, chaque helper est exposé en propriété publique dans la vue.
Par exemple, si vous utilisiez :php:class:`HtmlHelper`, vous serez capable
d'y accéder en faisant ce qui suit::

    echo $this->Html->css('styles');

Ce qui est au-dessus appelera la méthode ``css`` du HtmlHelper. Vous pouvez
accéder à n'importe quel helper chargé en utilisant ``$this->{$helperName}``.

Charger les Helpers à la volée
------------------------------

Il peut venir un temps où vous aurez besoin de charger dynamiquement un helper
à partir d'une vue. Vous pouvez utiliser la vue du
:php:class:`Cake\\View\\HelperRegistry` pour le faire::

    $mediaHelper = $this->Helpers->load('Media', $mediaSettings);

Le HelperCollection est une :doc:`registry </core-libraries/registry-objects>`
et supporte l'API collection utilisée partout ailleurs dans CakePHP.

Méthodes de Callback
====================

Les Helpers disposent de plusieurs callbacks qui vous permettent d'augmenter
le processus de rendu de vue. Allez voir la documentation de :ref:`helper-api`
et :doc:`/core-libraries/events` pour plus d'informations.

Créer des Helpers
=================

Si un helper du coeur (ou l'un présenté sur github ou dans la Boulangerie)
ne correspond pas à vos besoins, les helpers sont faciles à créer.

Mettons que nous voulions créer un helper, qui pourra être utilisé pour
produire un lien CSS, façonné spécialement selon vos besoins, à différents
endroits de votre application. Afin de trouver une place à votre logique dans
la structure de helper existante dans CakePHP, vous devrez créer une nouvelle
classe dans ``/App/View/Helper``. Appelons notre helper LinkHelper. Le
fichier de la classe PHP ressemblera à quelque chose comme ceci::

    /* /App/View/Helper/LinkHelper.php */
    use Cake\View\Helper;

    class LinkHelper extends AppHelper {
        public function makeEdit($title, $url) {
            // La logique pour créer le lien spécialement formaté se place ici
        }
    }

.. note::

    Les Helpers doivent étendre soit ``AppHelper`` soit :php:class:`Helper`.

Inclure d'autres Helpers
------------------------

Vous souhaitez peut-être utiliser quelques fonctionnalités déjà existantes dans
un autre helper. Pour faire cela, vous pouvez spécifier les helpers que
vous souhaitez utiliser avec un tableau ``$helpers``, formaté comme vous le
feriez dans un controller::

    /* /App/View/Helper/LinkHelper.php (utilisant d'autres helpers) */
    use App\View\Helper\AppHelper;

    class LinkHelper extends AppHelper {
        public $helpers = ['Html'];

        public function makeEdit($title, $url) {
            // utilise le helper HTML pour sortir des données formatées

            $link = $this->Html->link($title, $url, ['class' => 'edit']);

            return '<div class="editOuter">' . $link . '</div>';
        }
    }


.. _using-helpers:

Utiliser votre Helper
---------------------

Une fois que vous avez créez votre helper et l'avez placé dans
``/App/View/Helper/``, vous serez capable de l'inclure dans vos controllers
en utilisant la variable spéciale :php:attr:`~Controller::$helpers`::

    class PostsController extends AppController {
        public $helpers = ['Link'];
    }

Une fois que votre controller est au courant de cette nouvelle classe, vous
pouvez l'utiliser dans vos vues en accédant à un objet nommé d'après le
helper::

    <!-- fait un lien en utilisant le nouveau helper -->
   <?php echo $this->Link->makeEdit('Changez cette Recette', '/recipes/edit/5'); ?>


Créer des fonctionnalités pour Tous les Helpers
===============================================

Tous les helpers étendent une classe spéciale, AppHelper (comme les models
étendent AppModel et les controllers étendent AppController). Pour créer une
fonctionnalité disponible pour tous les helpers, créez
``/App/View/Helper/AppHelper.php``::

    use App\View\Helper\AppHelper;

    class AppHelper extends Helper {
        public function customMethod() {
        }
    }


.. _helper-api:

API de Helper
=============

.. php:class:: Helper

    La classe de base pour les Helpers. Elle fournit un nombre de méthodes
    utiles et des fonctionnalités pour le chargement d'autres helpers.

.. php:method:: webroot($file)

    Décide du nom de fichier du webroot de l'application. Si un thème est actif
    et que le fichier existe dans le webroot du thème courant, le chemin du
    fichier du thème sera retourné.

.. php:method:: url($url, $full = false)

    Génère une URL échappée de HTML, qui délégue à
    :php:meth:`Cake\\Routing\\Router::url()`.

Callbacks
---------

En implémentant une méthode de callback dans un helper, CakePHP va
automatiquement inscrire votre helper à l'évenement correspondant. A la
différence des versions précédentes de CakePHP, vous *ne* devriez pas appeler
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

    La méthode beforeRender est appelé après la méthode beforeRender du
    controller, mais avant les rendus du controller de la vue et du layout
    Reçoit le fichier à rendre en argument.

.. php:method:: afterRender(Event $event, $viewFile)

    Est appelé après que la vue est rendu, mais avant que le rendu du
    layout ait commencé.

.. php:method:: beforeLayout(Event $event, $layoutFile)

    Est appelé avant que le rendu du layout commence. Reçoit le nom du fichier
    layout en argument.

.. php:method:: afterLayout(Event $event, $layoutFile)

    Est appelé après que le rendu du layout est fini. Reçoit le nom du fichier
    layout en argument.

.. meta::
    :title lang=fr: Helpers (Assistants)
    :keywords lang=fr: classe php,fonction time,couche de présentation,puissance du processeur,ajax,balise,tableau,fonctionnalité,logique,syntaxe,élements,cakephp,plugins
