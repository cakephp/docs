DataSources
###########

Les Sources de données (DataSources) sont les liens entre les modèles et la 
source de données qu'ils représentent. Dans de nombreux cas, les données 
sont récupérées depuis une base de données relationnelle telle MySQL, 
PostgreSQL ou MSSQL. CakePHP est distribué avec de nombreuses sources de 
données spécifiques d'une base de données (voir les fichiers de classe 
dans ``lib/Cake/Model/Datasource/Database``), un résumé de ceux-ci est listé 
ici pour votre confort :

- MySql
- Postgres
- Sqlite
- Sqlserver
- Oracle

.. note::

    Vous pouvez trouver des sources de données de contribution de la communauté 
    supplémentaites dans le 
    `Dépôt de Sources de Données CakePHP sur github <https://github.com/cakephp/datasources/tree/2.0>`_.

Quand vous spécifiez une configuration de connexion à une base de données 
dans ``app/Config/database.php``, CakePHP utilise de manière transparente la 
source de données correspondant à la base de données pour toutes les 
opérations de modèle. Donc, même si vous pensiez ne rien connaître aux 
sources de données, vous les utilisez tout le temps.

Toutes les sources ci-dessus dérivent d'une classe de base ``DboSource``, 
qui agrège de la logique commune à la plupart des bases de données 
relationnelles. Si vous décidez d'écrire une source de donnée RDBMS, 
travailler à partir de l'une d'entre elles (par ex Mysql ou 
Sqlite) est plus sûr.

La plupart des gens cependant, sont intéressés par l'écriture de sources 
de données pour des sources externes, telles les APIs REST distantes ou 
même un serveur LDAP. C'est donc ce que nous allons voir maintenant.

Basic API For DataSources
=========================

Une source de données peut et *devrait* implémenter au moins l'une des méthodes 
suivantes : ``create``, ``read``, ``update`` et/ou ``delete`` (les signatures 
exactes de méthode et les détails d'implémentation ne sont pas importants 
pour le moment, ils seront décrits plus tard). Vous n'êtes pas obligé 
d'implémenter plus que nécessaire, parmi les méthodes listées ci-dessus - 
si vous avez besoin d'une source de données en lecture seule, il n'y a 
aucune raison d'implémenter ``create``, ``update`` et ``delete``.

Méthodes qui doivent être implémentées pour toutes les méthodes CRUD:

-  ``describe($Model)``
-  ``listSources()``
-  ``calculate($Model, $func, $params)``
-  Au moins une des suivantes:
   
   -  ``create($Model, $fields = array(), $values = array())``
   -  ``read($Model, $queryData = array())``
   -  ``update($Model, $fields = array(), $values = array())``
   -  ``delete($Model, $conditions = null)``

Il est possible également (et souvent très pratique), de définir 
l'attribut de classe ``$_schema`` au sein de la source de données 
elle-même, plutôt que dans le modèle.

Et c'est à peu près tout ce qu'il y a dire ici. En couplant cette 
source de données à un modèle, vous êtes alors en mesure d'utiliser 
``Model::find()/save()/delete()``, comme vous le feriez normalement ;
les données et/ou paramètres appropriés, utilisés pour appeler ces 
méthodes, seront passés à la source de données elle-même, dans laquelle 
vous pouvez décider d'implémenter toutes les fonctionnalités dont vous 
avez besoin (par exemple les options de Model::find comme le parsing 
``'conditions'``, ``'limit'`` ou même vos paramètres personnalisés).

Un Exemple
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
    :title lang=fr: Sources de Données
    :keywords lang=fr: array values,model fields,connection configuration,implementation details,relational databases,best bet,mysql postgresql,sqlite,external sources,ldap server,database connection,rdbms,sqlserver,postgres,relational database,mssql,aggregates,apis,repository,signatures