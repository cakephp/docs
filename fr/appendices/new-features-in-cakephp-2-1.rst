Nouvelles caractéristiques dans CakePHP 2.1
###########################################

Models
======

Model::saveAll(), Model::saveAssociated(), Model::validateAssociated()
----------------------------------------------------------------------
``Model::saveAll()`` et ses amis supportent maintenant le passement de 
`fieldList` pour de multiples modèles. Exemple::

    $this->SomeModel->saveAll($data, array(
        'fieldList' => array(
            'SomeModel' => array('field_1'),
            'AssociatedModel' => array('field_2', 'field_3')
        )
    ));

``Model::saveAll()`` et ses amis peuvent maintenant sauvegarder sur des niveaux 
de profondeur illimités. Exemple::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array('body' => 'Save a new user as well', 'User' => array('first' => 'mad', 'last' => 'coder'))
        ),
    );
    $this->SomeModel->saveAll($data, array('deep' => true));

View
====

View Blocks (Blocks de Vue)
---------------------------

View Blocks sont un mécanisme permettant l'inclusion de slots de contenu, 
en autorisant les classes enfants de vue ou les éléments à fournir le contenu 
personnalisé pour ce block.

Les blocks sont sortis en appelant la méthode ``fetch`` sur :php:class:`View`. 
Par exemple, ce qui suit peut être placé dans votre fichier 
``View/Layouts/default.ctp``::

    <?php echo $this->fetch('my_block'); ?>

Cela affichera le contenu du block si disponible, ou ue chaîne de caractère 
vide si elle n'est pas définie.

Définir le contenu d'un block peut être fait de plusieurs façons. Une simple 
attribution de donnée peut être faite en utilisant `assign`::

    <?php $this->assign('my_block', 'Hello Block'); ?>

Ou vous pouvez l'utiliser pour capturer une section de contenu plus complexe::

    <?php $this->start('my_block'); ?>
        <h1>Hello Block!</h1>
        <p>Ceci est block de contenu</p>
        <p>Page title: <?php echo $title_for_layout; ?></p>
    <?php $this->end(); ?>

Le Block capturant aussi le support d'imbrication::

    <?php $this->start('my_block'); ?>
        <h1>Hello Block!</h1>
        <p>This is a block of content</p>
        <?php $this->start('second_block'); ?>
            <p>Page title: <?php echo $title_for_layout; ?></p>
        <?php $this->end(); ?>
    <?php $this->end(); ?>

ThemeView
---------

Dans 2.1, l'utilisation de ``ThemeView`` est dépréciée en faveur de 
l'utilisation de la classe ``View`` elle-même. ``ThemeView`` est maintenant 
une classe stub.

All custom pathing code has been moved into the ``View`` class, meaning that it is now possible for classes extending the ``View`` class to automatically support themes. Whereas before we might set the ``$viewClass`` Controller property to ``Theme``, it is now possible to enable themes by simply setting the ``$theme`` property. Example::

    App::uses('Controller', 'Controller');

    class AppController extends Controller {
        public $theme = 'Exemple';
    }

Toutes les classe View qui étendent ``ThemeView`` dans 2.0 doivent maintenant 
simplement étendre ``View``.

JsonView
--------

Une nouvelle classe qui facilite la sortie de contenu JSON.

Précédemment, il était nécessaire de créer un layout JSON 
(``APP/View/Layouts/json/default.ctp``) et une vue correspondante pour 
chaque action qui sortirait le JSON. Ceci n'est plus requis avec 
:php:class:`JsonView`.

:php:class:`JsonView` est utilisée comme tout autre classe de vue, en 
la définissant sur le controller. Exemple::

    App::uses('Controller', 'Controller');

    class AppController extends Controller {
        public $viewClass = 'Json';
    }

Une fois que vous avez configuré le controller, vous avez besoin d'identifier 
quel contenu devrait être sérialisé en JSON, en paramètrant la variable vue 
``_serialize``. Exemple::

    $this->set(compact('users', 'posts', 'tags'));
    $this->set('_serialize', array('users', 'posts'));

L'exemple ci-dessus résulterait seulement dans les variables ``users`` et 
``posts``, étant sérialisé pour la sortie JSON, comme ceci::

    {"users": [...], "posts": [...]}

Il n'y a plus aucun besoin de créer des fichiers de vue ``ctp`` afin d'afficher 
le contenu Json.

La personnalisation future de la sortie peut être atteinte en étendant la 
classe :php:class:`JsonView` avec votre propre classe de vue personnalisée si 
requise.

Les exemples suivants entourent le résultat avec ``{results: ... }``::

    App::uses('JsonView', 'View');
    class ResultsJsonView extends JsonView {
        public function render($view = null, $layout = null) {
            $result = parent::render($view, $layout);
            if (isset($this->viewVars['_serialize'])) {
                return json_encode(array('results' => json_decode($result)));
            }
            return $result;
        }
    }

XmlView
-------

Un peu comme :php:class:`JsonView`, :php:class:`XmlView` requièrt que vous 
configuriez la variable de vue ``_serialize`` afin d'indiquer quelle 
information serait sérialisée en XML pour la sortie.

    $this->set(compact('users', 'posts', 'tags'));
    $this->set('_serialize', array('users', 'posts'));

L'exemple ci-dessus résulterait dans seulement les variables ``users`` et 
``posts`` étant sérialisées pour la sortie XML, comme ceci::

    <response><users>...</users><posts>...</posts></response>

Notez que XmlView ajoute un noeud de ``response`` pour entourer tout 
contenu sérialisé.


Rendu de Vue conditionnel
-------------------------

Plusieurs nouvelles méthodes ont été ajoutées à :php:class:`CakeRequest` 
pour faciliter la tâche de paramètrer les headers HTTP corrects en mettant 
le HTTP en cache. Vous pouvez maintenant définir notre stratégie de mise 
en cache en utilisant l'expiration ou la validation HTTP du cache du model, 
ou de combiner les deux. Maintenant, il y a des méthodes spécifiques dans 
:php:class:`CakeRequest` to fine-tune Cache-Control directives, set the 
entity tag (Etag), set the Last-Modified time and much more.

Quand ces méthodes sont combinés avec le :php:class:`RequestHandlerComponent`
activé dans votre controller, le component décidera automatiquement si la 
réponse est déjà mise en cache dans le client et enverra un code de statut 
`304 Not Modified` avant le rendu de la vue. Sauter le processus de rendu de 
vue sauvegarde les cycles CPU et la mémoire.::

    class ArticlesController extends AppController {
        public $components = array('RequestHandler');

        public function view($id) {
            $article = $this->Article->read(null, $id);
            $this->response->modified($article['Article']['modified']);
            $this->set(compact('article'));
        }
    }

Dans l'exemple ci-dessus, la vue ne sera pas rendu si le client envoie le 
header `If-Modified-Since`, et la réponse aura un statut 304.

Helpers
=======

Pour faciliter l'utilisation en dehors de la couche ``View``, les méthodes des 
helpers :php:class:`TimeHelper`, :php:class:`TextHelper`, et 
:php:class:`NumberHelper` ont été extraites respectivement des classes 
:php:class:`CakeTime`, :php:class:`String`, et :php:class:`CakeNumber`.

Pour utiliser les nouvelles classes utilitaires::

    class AppController extends Controller {

        public function log($msg) {
            $msg .= String::truncate($msg, 100);
            parent::log($msg);
        }
    }

Vous pouvez écraser la classe par défaut à utiliser en créant une nouvelle 
classe dans votre dossier ``APP/Utility``, par exemple: 
``Utility/MyAwesomeStringClass.php``, et le spécifier dans la clé ``engine``::

    // Utility/MyAwesomeStringClass.php
    class MyAwesomeStringClass extends String {
        // mon truchement est meilleur que les votres
        public function static truncate($text, $length = 100, $options = array()) {
            return null;
        }
    }

    // Controller/AppController.php
    class AppController extends Controller {
        public $helpers = array(
            'Text' => array(
                'engine' => 'MyAwesomeStringClass',
                ),
            );
    }

HtmlHelper
-----------
Une nouvelle fonction :php:meth:`HtmlHelper::media()` a été ajoutée pour la 
génération d'éléments HTML audio/video.

