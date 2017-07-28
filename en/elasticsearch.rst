ElasticSearch
#############

The ElasticSearch plugin provides an ORM-like abstraction on top of
`elasticsearch <https://www.elastic.co/products/elasticsearch>`_. The plugin
provides features that make testing, indexing documents and searching your
indexes easier.

Installation
============

To install the ElasticSearch plugin, you can use ``composer``. From your
application's ROOT directory (where composer.json file is located) run the
following::

    php composer.phar require cakephp/elastic-search "@stable"

You will need to add the following line to your application's
**config/bootstrap.php** file::

    Plugin::load('Cake/ElasticSearch', ['bootstrap' => true]);

Additionally, you will need to configure the 'elastic' datasource connection in
your **config/app.php** file. An example configuration would be::

    // in config/app.php
    'Datasources' => [
        // other datasources
        'elastic' => [
            'className' => 'Cake\ElasticSearch\Datasource\Connection',
            'driver' => 'Cake\ElasticSearch\Datasource\Connection',
            'host' => '127.0.0.1',
            'port' => 9200,
            'index' => 'my_apps_index',
        ],
    ]

Overview
========

The ElasticSearch plugin makes it easier to interact with an elasticsearch index
and provides an interface similar to the :doc:`/orm`. To get started you should
create a ``Type`` object. ``Type`` objects are the "Repository" or table-like
class in elasticsearch::

    // in src/Model/Type/ArticlesType.php
    namespace App\Model\Type;

    use Cake\ElasticSearch\Type;

    class ArticlesType extends Type
    {
    }

You can then use your type class in your controllers::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        // Load the Type using the 'Elastic' provider.
        $this->loadModel('Articles', 'Elastic');
    }

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success('It saved');
            }
        }
        $this->set(compact('article'));
    }

We would also need to create a basic view for our indexed articles::

    // in src/Template/Articles/add.ctp
    <?= $this->Form->create($article) ?>
    <?= $this->Form->control('title') ?>
    <?= $this->Form->control('body') ?>
    <?= $this->Form->button('Save') ?>
    <?= $this->Form->end() ?>

You should now be able to submit the form and have a new document added to
elasticsearch.

Document Objects
================

Like the ORM, the Elasticsearch ODM uses :doc:`/orm/entities`-like classes. The
base class you should inherit from is ``Cake\ElasticSearch\Document``. Document
classes are found in the ``Model\Document`` namespace in your application or
plugin::

    namespace App\Model\Document;

    use Cake\ElasticSearch\Type;

    class Article extends Document
    {
    }

Outside of constructor logic that makes Documents work with data from
elasticsearch, the interface and functionality provided by ``Document`` are the
same as those in :doc:`/orm/entities`

Searching Indexed Documents
===========================

After you've indexed some documents you will want to search through them. The
ElasticSearch plugin provides a query builder that allows you to build search
queries::

    $query = $this->Articles->find()
        ->where([
            'title' => 'special',
            'or' => [
                'tags in' => ['cake', 'php'],
                'tags not in' => ['c#', 'java']
            ]
        ]);

    foreach ($query as $article) {
        echo $article->title;
    }

You can use the ``FilterBuilder`` to add filtering conditions::

    $query->where(function ($builder) {
        return $builder->and(
            $builder->gt('views', 99),
            $builder->term('author.name', 'sally')
        );
    });

The `FilterBuilder source
<https://github.com/cakephp/elastic-search/blob/master/src/FilterBuilder.php>`_
has the complete list of methods with examples for many commonly used methods.

Validating Data & Using Application Rules
=========================================

Like the ORM, the ElasticSearch plugin lets you validate data when marshalling
documents. Validating request data, and applying application rules works the
same as it does with the relational ORM. See the :ref:`validating-request-data`
and :ref:`application-rules` sections for more information.

.. Need information on nested validators.

Saving New Documents
====================

When you're ready to index some data into elasticsearch, you'll first need to
convert your data into a ``Document`` that can be indexed::

    $article = $this->Articles->newEntity($data);
    if ($this->Articles->save($article)) {
        // Document was indexed
    }

When marshalling a document, you can specify which embedded documents you wish
to marshall using the ``associated`` key::

    $article = $this->Articles->newEntity($data, ['associated' => ['Comments']]);

Saving a document will trigger the following events:

* ``Model.beforeSave`` - Fired before the document is saved. You can prevent the
  save operation from happening by stopping this event.
* ``Model.buildRules`` - Fired when the rules checker is built for the first
  time.
* ``Model.afterSave`` - Fired after the document is saved.

.. note::
    There are no events for embedded documents, as the parent document and all
    of its embedded documents are saved as one operation.


Updating Existing Documents
===========================

When you need to re-index data, you can patch existing entities and re-save
them::

    $query = $this->Articles->find()->where(['user.name' => 'jill']);
    foreach ($query as $doc) {
        $doc->set($newProperties);
        $this->Articles->save($doc);
    }

Deleting Documents
==================

After retrieving a document you can delete it::

    $doc = $this->Articles->get($id);
    $this->Articles->delete($doc);

You can also delete documents matching specific conditions::

    $this->Articles->deleteAll(['user.name' => 'bob']);

Embedding Documents
===================

By defining embedded documents, you can attach entity classes to specific
property paths in your documents. This allows you to provide custom behavior to
the documents within a parent document. For example, you may want the comments
embedded in an article to have specific application specific methods. You can
use ``embedOne`` and ``embedMany`` to define embedded documents::

    // in src/Model/Type/ArticlesType.php
    namespace App\Model\Type;

    use Cake\ElasticSearch\Type;

    class ArticlesType extends Type
    {
        public function initialize()
        {
            $this->embedOne('User');
            $this->embedMany('Comments', [
                'entityClass' => 'MyComment'
            ]);
        }
    }

The above would create two embedded documents on the ``Article`` document. The
``User`` embed will convert the ``user`` property to instances of
``App\Model\Document\User``. To get the Comments embed to use a class name
that does not match the property name, we can use the ``entityClass`` option to
configure a custom class name.

Once we've setup our embedded documents, the results of ``find()`` and ``get()``
will return objects with the correct embedded document classes::

    $article = $this->Articles->get($id);
    // Instance of App\Model\Document\User
    $article->user;

    // Array of App\Model\Document\Comment instances
    $article->comments;

Getting Type Instances
======================

Like the ORM, the ElasticSearch plugin provides a factory/registry for getting
``Type`` instances::

    use Cake\ElasticSearch\TypeRegistry;

    $articles = TypeRegistry::get('Articles');

Flushing the Registry
---------------------

During test cases you may want to flush the registry. Doing so is often useful
when you are using mock objects, or modifying a type's dependencies::

    TypeRegistry::flush();

Test Fixtures
=============

The ElasticSearch plugin provides seamless test suite integration. Just like
database fixtures, you can create test fixtures for elasticsearch. We could
define a test fixture for our Articles type with the following::

    namespace App\Test\Fixture;

    use Cake\ElasticSearch\TestSuite\TestFixture;

    /**
     * Articles fixture
     */
    class ArticlesFixture extends TestFixture
    {
        /**
         * The table/type for this fixture.
         *
         * @var string
         */
        public $table = 'articles';

        /**
         * The mapping data.
         *
         * @var array
         */
        public $schema = [
            'id' => ['type' => 'integer'],
            'user' => [
                'type' => 'nested',
                'properties' => [
                    'username' => ['type' => 'string'],
                ]
            ]
            'title' => ['type' => 'string'],
            'body' => ['type' => 'string'],
        ];

        public $records = [
            [
                'user' => [
                    'username' => 'billy'
                ],
                'title' => 'First Post',
                'body' => 'Some content'
            ]
        ];
    }

The ``schema`` property uses the `native elasticsearch mapping format
<https://www.elastic.co/guide/en/elasticsearch/reference/1.5/mapping.html>`_.
You can safely omit the type name and top level ``properties`` key. Once your
fixtures are created you can use them in your test cases by including them in
your test's ``fixtures`` properties::

    public $fixtures = ['app.articles'];

