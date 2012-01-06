New Features in CakePHP 2.1
###########################

Models
======

Model::saveAll(), Model::saveAssociated(), Model::validateAssociated()
----------------------------------------------------------------------
``Model::saveAll()`` and friends now support passing the `fieldList` for multiple models. Example::

    <?php
    $this->SomeModel->saveAll($data, array(
        'fieldList' => array(
            'SomeModel' => array('field_1'),
            'AssociatedModel' => array('field_2', 'field_3')
        )
    ));

View
====

View Blocks
-----------

View Blocks are a mechanism to allow the inclusion of slots of content, whilst allowing child view classes or elements to provide custom content for that block.

Blocks are output by calling the ``fetch`` method on the :php:class:`View`. For example, the following can be placed in your ``View/Layouts/defualt.ctp`` file::

    <?php echo $this->fetch('my_block'); ?>

This will echo the content of the block if available, or an empty string if it is undefined.

Setting the content of a block can be done in a number of ways. A simple assignment of data can be done using `assign`::

    <?php $this->assign('my_block', 'Hello Block'); ?>

Or you can use it to capture a seciton of more complex content::

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

JsonView
--------

A new view class that eases the output of JSON content.

Previously, it was necessary to create a JSON layout (``APP/View/Layouts/json/default.ctp``) and a corresponding view for each action that would output JSON. This is no longer required with :php:class:`JsonView`.

The :php:class:`JsonView` is used like any other view class, by defining it on the controller. Example::

    <?php
    App::uses('Controller', 'Controller');

    class AppController extends Controller {
        public $viewClass = 'Json';
    }

Once you have setup the controller, you need to identify what content should be serialized as JSON, by setting the view variable ``_serialize``. Example::

    <?php
    $this->set(comapct('users', 'posts', 'tags'));
    $this->set('_serialize', array('users', 'posts'));

The above example would result in only the ``users`` and ``posts`` variables being serialized for the JSON output, like so::

    {"users": [...], "posts": [...]}

There is no longer any need to create view ``ctp`` files in order to display Json content.

Further customization of the output can be achieved by extending the :php:class:`JsonView` class with your own custom view class if required.

The following example wraps the result with ``{results: ... }``::

    <?php
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

Much like the :php:class:`JsonView`, the :php:class:`XmlView` requires you to set the ``_serialize`` view variable in order to indicate what information should be serialized into XML for output.

    <?php
    $this->set(comapct('users', 'posts', 'tags'));
    $this->set('_serialize', array('users', 'posts'));

The above example would result in only the ``users`` and ``posts`` variables being serialized for the XML output, like so::

    <response><users>...</users><posts>...</posts></response>

Note that the XmlView adds a ``response`` node to wrap all serialized content.


