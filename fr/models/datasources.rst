DataSources
###########

DataSources are the link between models and the source of data that
models represent. In many cases, the data is retrieved from a
relational database such as MySQL, PostgreSQL or MSSQL. CakePHP is
distributed with several database-specific datasources (see the
class files in ``lib/Cake/Model/Datasource/Database``), a summary
of which is listed here for your convenience:


- MySql
- Postgres
- Sqlite
- Sqlserver
- Oracle

.. note::

    You can find additional community contributed datasources in the 
    `CakePHP DataSources repository at github <https://github.com/cakephp/datasources/tree/2.0>`_.

When specifying a database connection configuration in
``app/Config/database.php``, CakePHP transparently uses the corresponding
database datasource for all model operations. So, even though you might not have
known about datasources, you've been using them all along.

All of the above sources derive from a base ``DboSource`` class, which
aggregates some logic that is common to most relational databases. If you decide
to write a RDBMS datasource, working from one of these (e.g. Mysql, or Sqlite is
your best bet.)

Most people, however, are interested in writing datasources for external sources
of data, such as remote REST APIs or even an LDAP server. So that's what we're
going to look at now.

Basic API For DataSources
=========================

A datasource can, and *should* implement at least one of the
following methods: ``create``, ``read``, ``update`` and/or
``delete`` (the actual method signatures & implementation details
are not important for the moment, and will be described later). You
need not implement more of the methods listed above than necessary
- if you need a read-only datasource, there's no reason to
implement ``create``, ``update``, and ``delete``.

Methods that must be implemented for all CRUD methods:

-  ``describe($Model)``
-  ``listSources()``
-  ``calculate($Model, $func, $params)``
-  At least one of:
   
   -  ``create($Model, $fields = array(), $values = array())``
   -  ``read($Model, $queryData = array())``
   -  ``update($Model, $fields = array(), $values = array())``
   -  ``delete($Model, $conditions = null)``

It is also possible (and sometimes quite useful) to define the
``$_schema`` class attribute inside the datasource itself, instead
of in the model.

And that's pretty much all there is to it. By coupling this
datasource to a model, you are then able to use
``Model::find()/save()/delete()`` as you would normally, and the appropriate
data and/or parameters used to call those methods will be passed on
to the datasource itself, where you can decide to implement
whichever features you need (e.g. Model::find options such as
``'conditions'`` parsing, ``'limit'`` or even your own custom
parameters).

An Example
==========

A common reason you would want to write your own datasource is when you would
like to access a 3rd party API using the usual ``Model::find()/save()/delete()``
methods. Let's write a datasource that will access a fictitious remote JSON
based API. We'll call it ``FarAwaySource`` and we'll put it in
``app/Model/Datasource/FarAwaySource.php``::

    <?php
    App::uses('HttpSocket', 'Network/Http');

    class FarAwaySource extends DataSource {

    /**
     * An optional description of your datasource
     */
        public $description = 'A far away datasource';

    /**
     * Our default config options. These options will be customized in our
     * ``app/Config/database.php`` and will be merged in the ``__construct()``.
     */
        public $config = array(
            'apiKey' => '',
        );

    /**
     * If we want to create() or update() we need to specify the fields
     * available. We use the same array keys as we do with CakeSchema, eg.
     * fixtures and schema migrations.
     */
        protected $_schema = array(
            'id' => array(
                'type' => 'integer',
                'null' => false,
                'key' => 'primary',
                'length' => 11,
            ),
            'name' => array(
                'type' => 'string',
                'null' => true,
                'length' => 255,
            ),
            'message' => array(
                'type' => 'text',
                'null' => true,
            ),
        );

    /**
     * Create our HttpSocket and handle any config tweaks.
     */
        public function __construct($config) {
            parent::__construct($config);
            $this->Http = new HttpSocket();
        }

    /**
     * Since datasources normally connect to a database there are a few things
     * we must change to get them to work without a database.
     */

    /**
     * listSources() is for caching. You'll likely want to implement caching in
     * your own way with a custom datasource. So just ``return null``.
     */
        public function listSources() {
            return null;
        }

    /**
     * describe() tells the model your schema for ``Model::save()``.
     *
     * You may want a different schema for each model but still use a single
     * datasource. If this is your case then set a ``schema`` property on your
     * models and simply return ``$Model->schema`` here instead.
     */
        public function describe(Model $Model) {
            return $this->_schema;
        }

    /**
     * calculate() is for determining how we will count the records and is
     * required to get ``update()`` and ``delete()`` to work.
     *
     * We don't count the records here but return a string to be passed to
     * ``read()`` which will do the actual counting. The easiest way is to just
     * return the string 'COUNT' and check for it in ``read()`` where
     * ``$data['fields'] == 'COUNT'``.
     */
        public function calculate(Model $Model, $func, $params = array()) {
            return 'COUNT';
        }

    /**
     * Implement the R in CRUD. Calls to ``Model::find()`` arrive here.
     */
        public function read(Model $Model, $data = array()) {
            /**
             * Here we do the actual count as instructed by our calculate()
             * method above. We could either check the remote source or some
             * other way to get the record count. Here we'll simply return 1 so
             * ``update()`` and ``delete()`` will assume the record exists.
             */
            if ($data['fields'] == 'COUNT') {
                return array(array(array('count' => 1)));
            }
            /**
             * Now we get, decode and return the remote data.
             */
            $data['conditions']['apiKey'] = $this->config['apiKey'];
            $json = $this->Http->get('http://example.com/api/list.json', $data['conditions']);
            $res = json_decode($json, true);
            if (is_null($res)) {
                $error = json_last_error();
                throw new CakeException($error);
            }
            return array($Model->alias => $res);
        }

    /**
     * Implement the C in CRUD. Calls to ``Model::save()`` without $Model->id
     * set arrive here.
     */
        public function create(Model $Model, $fields = array(), $values = array()) {
            $data = array_combine($fields, $values);
            $data['apiKey'] = $this->config['apiKey'];
            $json = $this->Http->post('http://example.com/api/set.json', $data);
            $res = json_decode($json, true);
            if (is_null($res)) {
                $error = json_last_error();
                throw new CakeException($error);
            }
            return true;
        }

    /**
     * Implement the U in CRUD. Calls to ``Model::save()`` with $Model->id
     * set arrive here. Depending on the remote source you can just call
     * ``$this->create()``.
     */
        public function update(Model $Model, $fields = array(), $values = array()) {
            return $this->create($Model, $fields, $values);
        }

    /**
     * Implement the D in CRUD. Calls to ``Model::delete()`` arrive here.
     */
        public function delete(Model $Model, $conditions = null) {
            $id = $conditions[$Model->alias . '.id'];
            $json = $this->Http->get('http://example.com/api/remove.json', array(
                'id' => $id,
                'apiKey' => $this->config['apiKey'],
            ));
            $res = json_decode($json, true);
            if (is_null($res)) {
                $error = json_last_error();
                throw new CakeException($error);
            }
            return true;
        }

    }

We can then configure the datasource in our ``app/Config/database.php`` file
by adding something like this::

    <?php
    public $faraway = array(
        'datasource' => 'FarAwaySource',
        'apiKey'     => '1234abcd',
    );

Then use the database config in our models like this::

    <?php
    class MyModel extends AppModel {
        public $useDbConfig = 'faraway';
    }

We can retrieve data from our remote source using the familiar model methods::

    <?php
    // Get all messages from 'Some Person'
    $messages = $this->MyModel->find('all', array(
        'conditions' => array('name' => 'Some Person'),
    ));

Similarly we can save a new message::

    <?php
    $this->MyModel->save(array(
        'name' => 'Some Person',
        'message' => 'New Message',
    ));

Update the previous message::

    <?php
    $this->MyModel->id = 42;
    $this->MyModel->save(array(
        'message' => 'Updated message',
    ));

And delete the message::

    <?php
    $this->MyModel->delete(42);

Plugin DataSources
==================

You can also package Datasources into plugins.

Simply place your datasource file into
``Plugin/[YourPlugin]/Model/Datasource/[YourSource].php``
and refer to it using the plugin notation::

    <?php
    public $faraway = array(
        'datasource' => 'MyPlugin.FarAwaySource',
        'apiKey'     => 'abcd1234',
    );

.. meta::
    :title lang=en: DataSources
    :keywords lang=en: array values,model fields,connection configuration,implementation details,relational databases,best bet,mysql postgresql,sqlite,external sources,ldap server,database connection,rdbms,sqlserver,postgres,relational database,mssql,aggregates,apis,repository,signatures