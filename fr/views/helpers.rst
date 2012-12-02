Helpers (Assistants)
####################

Les Helpers (Assistants) sont des classes comme les composants, pour la couche 
de présentation de votre application. Ils contiennent la logique de 
présentation qui est partagée entre plusieurs vues, éléments ou layouts. Ce 
chapitre vous montrera comment créer vos propres helpers et soulignera les 
tâches basiques que les helpers du cœur de CakePHP peuvent vous aider à 
accomplir. 

CakePHP dispose d'un nombre de helpers qui aident à la création des vues.
Ils aident à la création de balises bien-formées (y compris les formulaires), 
aident à la mise en forme du texte, les durées et les numéros, et peuvent même 
accélérer la fonctionnalité Ajax. Pour plus d'informations sur les helpers 
inclus dans CakePHP, allez voir :ref:`core-helpers`.

.. _configuring-helpers:

Utiliser et configurer les Helpers
==================================

Vous activez les helpers (assistants) dans CakePHP, en faisant 
"prendre conscience" à un controller qu'ils existent. Chaque controller a une 
propriété :php:attr:`~Controller::$helpers`, qui liste les helpers 
disponibles dans la vue. Pour activer un helper dans votre vue, ajoutez 
son nom au tableau ``$helpers`` du controller::

    class BakeriesController extends AppController {
        public $helpers = array('Form', 'Html', 'Js', 'Time');
    }

L'ajout des helpers depuis les plugins utilise la :term:`syntaxe de plugin`
utilisée partout ailleurs dans CakePHP::

    class BakeriesController extends AppController {
        public $helpers = array('Blog.Comment');
    }
    
Vous pouvez aussi ajoutez les helpers depuis une action, dans ce cas, 
ils seront uniquement accessibles pour cette action et aucune autre dans le 
controller. Ceci économise de la puissance de calcul pour les autres actions 
qui n'utilisent pas le helper, tout en permettant de conserver le controller 
mieux organisé::

    class BakeriesController extends AppController {
        public function bake {
            $this->helpers[] = 'Time';
        }
        public function mix {
            // Le Helper Time n'est pas chargé ici et n'est par conséquent 
            pas disponible
        }
    }

Si vous avez besoin d'activer un helper pour tous les controllers, ajoutez 
son nom dans le tableau ``$helpers`` du fichier 
``/app/Controller/AppController.php`` (à créer si pas présent). N'oubliez pas 
d'inclure les helpers par défaut Html et Form::

    class AppController extends Controller {
        public $helpers = array('Form', 'Html', 'Js', 'Time');
    }

Vous pouvez passer des options dans les helpers. Ces options peuvent être 
utilisées pour définir les valeurs d'attributs ou modifier le behavior du
helper::

    class AwesomeHelper extends AppHelper {
        public function __construct(View $view, $settings = array()) {
            parent::__construct($view, $settings);
            debug($options);
        }
    }

    class AwesomeController extends AppController {
        public $helpers = array('Awesome' => array('option1' => 'valeur1'));
    }

Une configuration courante est d'utilisez l'option ``className``, qui vous 
permet de créer des helpers alias dans vos vues. Cette fonctionnalité est 
utile quand vous voulez remplacer ``$this->Html`` ou tout autre Helper de
référence avec une mise en oeuvre personnalisée::

    // app/Controller/PostsController.php
    class PostsController extends AppController {
        public $helpers = array(
            'Html' => array(
                'className' => 'MyHtml'
            )
        );
    }

    // app/View/Helper/MyHtmlHelper.php
    App::uses('HtmlHelper', 'View/Helper');
    class MyHtmlHelper extends HtmlHelper {
        // Ajouter votre code pour écraser le HtmlHelper du coeur
    }

Ce qui est au-dessus ferait un *alias* de ``MyHtmlHelper`` vers ``$this->Html`` 
dans vos vues.

.. note::

    Faire un alias d'un helper remplace cette instance partout où le helper 
    est utilisé, y compris dans les autres Helpers.

.. tip::

    Faire un alias des Helpers Html ou Session pendant que vous utilisez le 
    coeur de PagesController  ne fonctionnera pas. Il est préférable de copier
    ``lib/Cake/Controller/PagesController.php`` dans le dossier 
    ``app/Controller/``.

L'utilisation des configurations du helper vous permet de configurer de manière
déclarative vos helpers et de garder la logique de configuration de vos actions
des controllers. Si vous avez des options de configuration qui ne peuvent pas 
être inclues comme des parties de déclaration de classe, vous pouvez les définir
dans le callback beforeRender de votre controller::

    class PostsController extends AppController {
        public function beforeRender() {
            parent::beforeRender();
            $this->helpers['CustomStuff'] = $this->_getCustomStuffSettings();
        }
    }

Utiliser les Helpers
====================

Une fois que vous avez configuré les helpers que vous souhaitiez utiliser, dans 
votre controller, chaque helper est exposé en propriété publique dans la vue. 
Par exemple, si vous utilisiez :php:class:`HtmlHelper`, vous seriez capable 
d'y accéder en faisant ce qui suit::

    echo $this->Html->css('styles');

Ce qui est au-dessus appelerait la méthode ``css`` du HtmlHelper.  Vous pouvez
accéder à n'importe quel helper chargé en utilisant ``$this->{$helperName}``. 
Il peut venir un temps où vous aurez besoin de charger dynamiquement un helper 
à partir d'une vue. Vous pouvez utiliser la vue du :php:class:`HelperCollection`
pour le faire::

    $mediaHelper = $this->Helpers->load('Media', $mediaSettings);

Le HelperCollection est une :doc:`collection </core-libraries/collections>` et 
supporte l'API collection utilisée partout ailleurs dans CakePHP.

Méthodes de Callback
====================

Les Helpers disposent de plusieurs callbacks qui vous permettent d'augmenter 
le processus de rendu de vue. Allez voir la documentation de :ref:`helper-api` 
et :doc:`/core-libraries/collections` pour plus d'informations.

Créer des Helpers
=================

Si un helper du coeur (ou l'un présenté sur github ou dans la Boulangerie)
ne correspond pas à vos besoins, les helpers sont faciles à créer.

Mettons que nous voulions créer un assistant, qui pourrait être utilisé pour 
produire un lien CSS, façonné spécialement selon vos besoins, à différents 
endroits de votre application. Afin de trouver une place à votre logique dans 
la structure d'assistant existante dans CakePHP, vous devrez créer une nouvelle 
classe dans ``/app/View/Helper``. Appelons notre assistant LienHelper. Le 
fichier de la classe PHP devrait ressembler à quelque chose comme ceci::

    /* /app/View/Helper/LienHelper.php */
    App::uses('AppHelper', 'View/Helper');
    
    class LienHelper extends AppHelper {
        public function lancerEdition($titre, $url) {
            // La logique pour créer le lien spécialement formaté se place 
            ici...
        }
    }

.. note::

    Les Helpers doivent étendre soit ``AppHelper`` soit :php:class:`Helper` ou
    implémenter tous les callbacks dans :ref:`helper-api`.

Inclure d'autres Helpers
------------------------

Vous souhaitez peut-être utiliser quelques fonctionnalités déjà existantes dans 
un autre helper. Pour faire cela, vous pouvez spécifier les helpers que 
vous souhaitez utiliser avec un tableau ``$helpers``, formaté comme vous le 
feriez dans un controller::

    /* /app/View/Helper/LienHelper.php (Utilisant d'autres helpers) */
    App::uses('AppHelper', 'View/Helper');
    
    class LienHelper extends AppHelper {
        public $helpers = array('Html');
    
        public function lancerEdition($titre, $url) {
            // Utilisation du helper HTML pour sortir une donnée formatée
    
            $link = $this->Html->link($title, $url, array('class' => 'edit'));
    
            return '<div class="editOuter">' . $link . '</div>';
        }
    }


.. _using-helpers:

Utiliser votre Helper
---------------------

Une fois que vous avez créez votre helper et l'avez placé dans 
``/app/View/Helper/``, vous serez capable de l'inclure dans vos controllers 
en utilisant la variable spéciale :php:attr:`~Controller::$helpers`::

    class PostsController extends AppController {
        public $helpers = array('Lien');
    }

Une fois que votre controller est au courant de cette nouvelle classe, vous
pouvez l'utiliser dans vos vues en accédant un objet nommé après le helper::

    <!-- fait un lien en utilisant le nouveau helper -->
    <?php echo $this->Link->lancerEdition('Changer cette recette', '/recipes/edit/5'); ?>


Créer des fonctionnalités à vos Helpers
=======================================

Tous les helpers étendent une classe spéciale, AppHelper (comme les modèles 
étendent AppModel et les controllers étendent AppController). Pour créer une 
fonctionnalité disponible pour tous les helpers, créez
``/app/View/Helper/AppHelper.php``::

    App::uses('Helper', 'View');
    
    class AppHelper extends Helper {
        public function customMethod () {
        }
    }


.. _helper-api:

Helper API
==========

.. php:class:: Helper

    La classe de base pour les Helpers. Elle fournit un nombre de méthodes 
    utiles et des fonctionnalités pour le chargement d'autres helpers.

.. php:method:: webroot($file)

    Décide du nom de fichier du webroot de l'application. Si un thème est actif 
    et que le fichier existe dans le webroot du thème courant, le chemin du
    fichier du thème sera retourné.
    
.. php:method:: url($url, $full = false)

    Génère une HTML escaped URL, qui délégue à :php:meth:`Router::url()`.

.. php:method:: value($options = array(), $field = null, $key = 'value')

    Récupère la valeur pour un nom d'input donné.

.. php:method:: domId($options = null, $id = 'id')

    Génère une valeur id en CamelCase pour le champ sélectionné courant. 
    Ecraser cette méthode dans votre AppHelper vous permettra de changer la 
    façon dont CakePHP génére les attributs ID.

Callbacks
---------

.. php:method:: beforeRenderFile($viewFile)

    Est appelé avant que tout fichier de vue soit rendu. Cela inclut les 
    eléments, le vues, les vues parentes et les layouts.

.. php:method:: afterRenderFile($viewFile, $content)

    Est appelé après que tout fichier de vue est rendu. Cela inclut les 
    eléments, le vues, les vues parentes et les layouts. Un callback
    peut modifier et retourner ``$content`` pour changer la manière dont
    le contenu rendu est affiché dans le navigateur.

.. php:method:: beforeRender($viewFile)

    La méthode beforeRender est appelé après la méthode beforeRender du 
    controller, mais avant les rendus du contôleur de la vue et du layout
    Reçoit le fichier à rendre en argument.

.. php:method:: afterRender($viewFile)

    Est appelé après que la vue est rendu, mais avant que le rendu du 
    layout ait commencé.

.. php:method:: beforeLayout($layoutFile)

    Est appelé avant que le rendu du layout commence. Reçoit le nom du fichier 
    layout en argument.

.. php:method:: afterLayout($layoutFile)

    Est appelé après que le rendu du layout est fini. Reçoit le nom du fichier
    layout en argument.

Helpers du coeur
================

:doc:`/core-libraries/helpers/cache`
    Utilisé par le coeur pour mettre en cache le contenu de la vue.
:doc:`/core-libraries/helpers/form`
    Créé les formulaires HTML et les éléments du formulaire qui gèrent
    eux-mêmes les problèmes de validation.
:doc:`/core-libraries/helpers/html`
    Méthodes bien pratiques pour des balises bien formatées. Les images, 
    les liens, les tables, les balises d'en-tête etc ....
:doc:`/core-libraries/helpers/js`
    Utilisé pour créer du Javascript compatible avec de nombreuses librairies 
    Javascript.
:doc:`/core-libraries/helpers/number`
    Formate les nombres et les monnaies.
:doc:`/core-libraries/helpers/paginator`
    Pagination à partir des données de Modèles et tri.
:doc:`/core-libraries/helpers/rss`
    Méthodes bien pratiques pour la sortie de contenu RSS et de données XML.
:doc:`/core-libraries/helpers/session`
    Accès pour la lecture des valeurs de session dans les vues.
:doc:`/core-libraries/helpers/text`
    Mise en lien intelligente, Misse en évidence, truchement intelligent des 
    mots.
:doc:`/core-libraries/helpers/time`
    Détection de proximité (Est-ce l'année prochaine?), formatage sympa des 
    chaînes de caractère (Today, 10:30 am) et conversion entre les zones de 
    temps.



.. meta::
    :title lang=fr: Helpers (Assistants)
    :keywords lang=fr: classe php,fonction time,couche de présentation,puissance du processeur,ajax,balise,tableau,fonctionnalité,logique,syntaxe,élements,cakephp,plugins
