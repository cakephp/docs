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

Vous activez les helpers dans CakePHP, en faisant "prendre conscience" à un
controller qu'ils existent. Chaque controller a une propriété
:php:attr:`~Cake\\Controller\\Controller::$helpers`, qui liste les helpers
disponibles dans la vue. Pour activer un helper dans votre vue, ajoutez son nom
au tableau ``$helpers`` du controller::

    class BakeriesController extends AppController
    {
        public $helpers = ['Form', 'Html', 'Time'];
    }

L'ajout des helpers depuis les plugins utilise la :term:`syntaxe de plugin`
utilisée partout ailleurs dans CakePHP::

    class BakeriesController extends AppController
    {
        public $helpers = ['Blog.Comment'];
    }

Vous pouvez aussi ajouter les helpers depuis une action, dans ce cas,
ils seront uniquement accessibles pour cette action et dans aucune autre action
du controller. Ceci économise de la puissance de calcul pour les autres actions
qui n'utilisent pas le helper, tout en permettant de conserver le controller
mieux organisé::

    class BakeriesController extends AppController
    {
        public function bake()
        {
            $this->helpers[] = 'Time';
        }
        public function mix()
        {
            // Le Helper Time n'est pas chargé ici et n'est par conséquent
            // pas disponible
        }
    }

Si vous avez besoin d'activer un helper pour tous les controllers, ajoutez
son nom dans le tableau ``$helpers`` du fichier
**src/Controller/AppController.php** (à créer si pas présent). N'oubliez pas
d'inclure les helpers par défaut Html et Form::

    class AppController extends Controller
    {
        public $helpers = ['Form', 'Html', 'Time'];
    }

Options de Configuration
------------------------

Vous pouvez passer des options de configuration dans les helpers. Ces options
peuvent être utilisées pour définir les valeurs d'attributs ou modifier le
comportement du helper::

    namespace App\View\Helper;

    use Cake\View\Helper;

    class AwesomeHelper extends Helper
    {
        public function __construct(View $view, $config = [])
        {
            parent::__construct($view, $config);
            debug($config);
        }
    }

    class AwesomeController extends AppController
    {
        public $helpers = ['Awesome' => ['option1' => 'value1']];
    }

Par défaut, toutes les options de configuration sont fusionnées avec la propriété
``$_defaultConfig``. Cette propriété doit définir les valeurs par défaut de
toute configuration dont votre helper a besoin. Par exemple::

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
pouvez les définir dans le callback beforeRender de votre controller::

    class PostsController extends AppController
    {
        public function beforeRender()
        {
            parent::beforeRender();
            $this->helpers['CustomStuff'] = $this->_getCustomStuffConfig();
        }
    }

.. _aliasing-helpers:

Faire des Alias de Helpers
--------------------------

Une configuration habituelle à utiliser est l'option ``className``, qui vous
permet de créer des alias de helpers dans vos vues. Cette fonctionnalité est
utile quand vous voulez remplacer ``$this->Html`` ou une autre référence du
Helper habituel avec une implémentation personnalisée::

    // src/Controller/PostsController.php
    class PostsController extends AppController
    {
        public $helpers = [
            'Html' => [
                'className' => 'MyHtml'
            ]
        ];
    }

    // src/View/Helper/MyHtmlHelper.php
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

Il peut venir un temps où vous aurez besoin de charger dynamiquement un helper
à partir d'une vue. Vous pouvez utiliser la vue du
:php:class:`Cake\\View\\HelperRegistry` pour le faire::

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

Si un helper du cœur (ou l'un présenté sur github ou dans la Boulangerie)
ne correspond pas à vos besoins, les helpers sont faciles à créer.

Mettons que nous voulions créer un helper, qui pourra être utilisé pour
produire un lien CSS, façonné spécialement selon vos besoins, à différents
endroits de votre application. Afin de trouver une place à votre logique dans
la structure de helper existante dans CakePHP, vous devrez créer une nouvelle
classe dans **src/View/Helper**. Appelons notre helper LinkHelper. Le
fichier de la classe PHP ressemblera à quelque chose comme ceci::

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
            // Utilise le Helper Html pour afficher the HTML helper to output
            // les données formatées:

            $link = $this->Html->link($title, $url, ['class' => 'edit']);

            return '<div class="editOuter">' . $link . '</div>';
        }
    }


.. _using-helpers:

Utiliser votre Helper
---------------------

Une fois que vous avez créé votre helper et l'avez placé dans
**src/View/Helper/**, vous serez capable de l'inclure dans vos controllers
en utilisant la variable spéciale :php:attr:`~Controller::$helpers`::

    class PostsController extends AppController
    {
        public $helpers = ['Link'];
    }

Une fois que votre controller est au courant de cette nouvelle classe, vous
pouvez l'utiliser dans vos vues en accédant à un objet nommé d'après le
helper::

    <!-- fait un lien en utilisant le nouveau helper -->
   <?= $this->Link->makeEdit('Changez cette Recette', '/recipes/edit/5'); ?>

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

    La méthode beforeRender est appelée après la méthode beforeRender du
    controller, mais avant les rendus du controller de la vue et du layout
    Reçoit le fichier à rendre en argument.

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
