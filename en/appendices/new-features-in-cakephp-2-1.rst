New Features in CakePHP 2.1
###########################

Models
======

Model::saveAll(), Model::saveAssociated(), Model::validateAssociated()
----------------------------------------------------------------------
``Model::saveAll()`` and friends now support passing the `fieldList` for multiple models. Example::

    $this->SomeModel->saveAll($data, array(
        'fieldList' => array(
            'SomeModel' => array('field_1'),
            'AssociatedModel' => array('field_2', 'field_3')
        )
    ));

``Model::saveAll()`` and friends now can save unlimited levels deep. Example::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array(
                'body' => 'Save a new user as well',
                'User' => array('first' => 'mad', 'last' => 'coder')
            )
        ),
    );
    $this->SomeModel->saveAll($data, array('deep' => true));

View
====

View Blocks
-----------

View Blocks are a mechanism to allow the inclusion of slots of content, whilst allowing child view classes or elements to provide custom content for that block.

Blocks are output by calling the ``fetch`` method on the :php:class:`View`. For example, the following can be placed in your ``View/Layouts/default.ctp`` file::

    <?php echo $this->fetch('my_block'); ?>

This will echo the content of the block if available, or an empty string if it is undefined.

Setting the content of a block can be done in a number of ways. A simple assignment of data can be done using `assign`::

    <?php $this->assign('my_block', 'Hello Block'); ?>

Or you can use it to capture a section of more complex content::

    <?php $this->start('my_block'); ?>
        <h1>Hello Block!</h1>
        <p>This is a block of content</p>
        <p>Page title: <?php echo $title_for_layout; ?></p>
    <?php $this->end(); ?>

Block capturing also supports nesting::

    <?php $this->start('my_block'); ?>
        <h1>Hello Block!</h1>
        <p>This is a block of content</p>
        <?php $this->start('second_block'); ?>
            <p>Page title: <?php echo $title_for_layout; ?></p>
        <?php $this->end(); ?>
    <?php $this->end(); ?>

ThemeView
---------

In 2.1, the use of ``ThemeView`` is deprecated in favor of using the ``View`` class itself. ``ThemeView`` is now a stub class.

All custom pathing code has been moved into the ``View`` class, meaning that it is now possible for classes extending the ``View`` class to automatically support themes. Whereas before we might set the ``$viewClass`` Controller property to ``Theme``, it is now possible to enable themes by simply setting the ``$theme`` property. Example::

    App::uses('Controller', 'Controller');

    class AppController extends Controller {
        public $theme = 'Example';
    }

All View classes which extended ``ThemeView`` in 2.0 should now simply extend ``View``.

JsonView
--------

A new view class that eases the output of JSON content.

Previously, it was necessary to create a JSON layout (``APP/View/Layouts/json/default.ctp``) and a corresponding view for each action that would output JSON. This is no longer required with :php:class:`JsonView`.

The :php:class:`JsonView` is used like any other view class, by defining it on the controller. Example::

    App::uses('Controller', 'Controller');

    class AppController extends Controller {
        public $viewClass = 'Json';
    }

Once you have setup the controller, you need to identify what content should be serialized as JSON, by setting the view variable ``_serialize``. Example::

    $this->set(compact('users', 'posts', 'tags'));
    $this->set('_serialize', array('users', 'posts'));

The above example would result in only the ``users`` and ``posts`` variables being serialized for the JSON output, like so::

    {"users": [...], "posts": [...]}

There is no longer any need to create view ``ctp`` files in order to display Json content.

Further customization of the output can be achieved by extending the :php:class:`JsonView` class with your own custom view class if required.

The following example wraps the result with ``{results: ... }``::

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

Much like the :php:class:`JsonView`, the :php:class:`XmlView` requires you to
set the ``_serialize`` view variable in order to indicate what information
should be serialized into XML for output::

    $this->set(compact('users', 'posts', 'tags'));
    $this->set('_serialize', array('users', 'posts'));

The above example would result in only the ``users`` and ``posts`` variables
being serialized for the XML output, like so::

    <response><users>...</users><posts>...</posts></response>

Note that the XmlView adds a ``response`` node to wrap all serialized content.


Conditional View Rendering
--------------------------

Several new methods were added to :php:class:`CakeRequest` to ease the task of
setting correct HTTP headers to foster HTTP caching. You can now define our
caching strategy using the expiration or validation HTTP cache model, or combine
both. Now there are specific methods in :php:class:`CakeRequest` to fine-tune
Cache-Control directives, set the entity tag (Etag), set the Last-Modified time
and much more.

When those methods are combined with having the :php:class:`RequestHandlerComponent`
enabled in your controller, the component will automatically decide if the
response is already cached in the client and will send a `304 Not Modified`
status code before rendering the view. Skipping the view rendering process saves
CPU cycles and memory.::

    class ArticlesController extends AppController {
        public $components = array('RequestHandler');

        public function view($id) {
            $article = $this->Article->read(null, $id);
            $this->response->modified($article['Article']['modified']);
            $this->set(compact('article'));
        }
    }

In the above example the view will not be rendered if the client sent the
header `If-Modified-Since`, and the response will have a 304 status.

Helpers
=======

To allow easier use outside of the ``View`` layer, methods from
:php:class:`TimeHelper`, :php:class:`TextHelper`, and :php:class:`NumberHelper`
helpers have been extracted to :php:class:`CakeTime`, :php:class:`String`,
and :php:class:`CakeNumber` classes respectively.

To use the new utility classes::

    class AppController extends Controller {

        public function log($msg) {
            $msg .= String::truncate($msg, 100);
            parent::log($msg);
        }
    }

You can override the default class to use by creating a new class in your
``APP/Utility`` folder, e.g.: ``Utility/MyAwesomeStringClass.php``, and specify
it in ``engine`` key::

    // Utility/MyAwesomeStringClass.php
    class MyAwesomeStringClass extends String {
        // my truncate is better than yours
        public static function truncate($text, $length = 100, $options = array()) {
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
A new function :php:meth:`HtmlHelper::media()` has been added for HTML5's audio/video element generation.

