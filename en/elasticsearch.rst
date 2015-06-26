ElasticSearch
#############

The ElasticSearch plugin provides an ORM like abstraction on top of
`elasticsearch <https://www.elastic.co/products/elasticsearch>`_. The plugin
provides features that make testing, indexing documents and searching your
indexes easier.

Installation
============

To install the elasticsearch plugin, you can use ``composer``. From your
application's ROOT directory (where composer.json file is located) run the
following::

    php composer.phar require cakephp/elasticsearch "@stable"

You will need to add the following line to your application's bootstrap.php file::

    Plugin::load('ElasticSearch', ['bootstrap' => true]);

Additionally, you will need to configure the 'elastic' datasource connection in
your ``config/app.php`` file. An example configuration would be::

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

The elasticsearch plugin makes it easier to interact with an elasticsearch index
and provides an interface similar to the :doc:`/orm`. To get started you should
create a 'Type' object. Type objects are the 'Repository' or table like class in
elasticsearch::

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
            $article = $this->Articles->patchEntity($article, $this->request->data);
            if ($this->Articles->save($article)) {
                $this->Flash->success('It saved');
            }
        }
        $this->set(compact('article'));
    }

We would also need to create a basic view for our indexed articles::

    // in src/Template/Articles/add.ctp
    <?= $this->Form->create($article) ?>
    <?= $this->Form->input('title') ?>
    <?= $this->Form->input('body') ?>
    <?= $this->Form->button('Save') ?>
    <?= $this->Form->end() ?>

You should now be able to submit the form and have a new document added to
elasticsearch.




.. comment::
    Other sections to add:
    * Document objects
    * Searching an index
    * Validation and Application Rules
    * Saving Documents
    * Deleting Documents
    * Embedded Documents
    * Using the TypeRegistry
    * Test fixtures
