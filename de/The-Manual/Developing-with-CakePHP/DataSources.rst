DataSources
###########

DataSources are the link between models and the source of data that
models represent. In many cases, the data is retrieved from a relational
database such as MySQL, PostgreSQL or MSSQL. CakePHP is distributed with
several database-specific datasources (see the dbo\_\* class files in
cake/libs/model/datasources/dbo/), a summary of which is listed here for
your convenience:

-  dbo\_mssql.php
-  dbo\_mysql.php
-  dbo\_mysqli.php
-  dbo\_oracle.php
-  dbo\_postgres.php
-  dbo\_sqlite.php

Additional DataSources and those that were removed from the core in 1.3
can be found in the community-maintained `CakePHP DataSources repository
at github <https://github.com/cakephp/datasources>`_.

When specifying a database connection configuration in
app/config/database.php, CakePHP transparently uses the corresponding
database datasource for all model operations. So, even though you might
not have known about datasources, you've been using them all along.

All of the above sources derive from a base ``DboSource`` class, which
aggregates some logic that is common to most relational databases. If
you decide to write a RDBMS datasource, working from one of these (e.g.
dbo\_mysql.php or dbo\_mssql.php is your best bet.

Most people, however, are interested in writing datasources for external
sources of data, such as remote REST APIs or even an LDAP server. So
that's what we're going to look at now.

Basic API For DataSources
=========================

A datasource can, and *should* implement at least one of the following
methods: ``create``, ``read``, ``update`` and/or ``delete`` (the actual
method signatures & implementation details are not important for the
moment, and will be described later). You need not implement more of the
methods listed above than necessary - if you need a read-only
datasource, there's no reason to implement ``create``, ``update``, and
``delete``.

Methods that must be implemented

-  ``describe($model)``
-  ``listSources()``
-  At least one of:

   -  ``create($model, $fields = array(), $values = array())``
   -  ``read($model, $queryData = array())``
   -  ``update($model, $fields = array(), $values = array())``
   -  ``delete($model, $id = null)``

It is also possible (and sometimes quite useful) to define the
``$_schema`` class attribute inside the datasource itself, instead of in
the model.

And that's pretty much all there is to it. By coupling this datasource
to a model, you are then able to use ``Model::find()/save()`` as you
would normally, and the appropriate data and/or parameters used to call
those methods will be passed on to the datasource itself, where you can
decide to implement whichever features you need (e.g. Model::find
options such as ``'conditions'`` parsing, ``'limit'`` or even your own
custom parameters).

An Example
==========

Here is a simple example of how to use Datasources and ``HttpSocket`` to
implement a very basic `Twitter <http://twitter.com>`_ source that
allows querying the Twitter API as well as posting new status updates to
a configured account.

**This example will only work in PHP 5.2 and above**, due to the use of
``json_decode`` for the parsing of JSON formatted data.

You would place the Twitter datasource in
app/models/datasources/twitter\_source.php:

::

    <?php
    /**
     * Twitter DataSource
     *
     * Used for reading and writing to Twitter, through models.
     *
     * PHP Version 5.x
     *
     * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
     * Copyright 2005-2009, Cake Software Foundation, Inc. (http://www.cakefoundation.org)
     *
     * Licensed under The MIT License
     * Redistributions of files must retain the above copyright notice.
     *
     * @filesource
     * @copyright     Copyright 2009, Cake Software Foundation, Inc. (http://www.cakefoundation.org)
     * @link          https://cakephp.org CakePHP(tm) Project
     * @license       http://www.opensource.org/licenses/mit-license.php The MIT License
     */
    App::import('Core', 'HttpSocket');
    class TwitterSource extends DataSource {
        protected $_schema = array(
            'tweets' => array(
                'id' => array(
                    'type' => 'integer',
                    'null' => true,
                    'key' => 'primary',
                    'length' => 11,
                ),
                'text' => array(
                    'type' => 'string',
                    'null' => true,
                    'key' => 'primary',
                    'length' => 140
                ),
                'status' => array(
                    'type' => 'string',
                    'null' => true,
                    'key' => 'primary',
                    'length' => 140
                ),
            )
        );
        public function __construct($config) {
            $auth = "{$config['login']}:{$config['password']}";
            $this->connection = new HttpSocket(
                "http://{$auth}@twitter.com/"
            );
            parent::__construct($config);
        }
        public function listSources() {
            return array('tweets');
        }
        public function read($model, $queryData = array()) {
            if (!isset($queryData['conditions']['username'])) {
                $queryData['conditions']['username'] = $this->config['login'];
            }
            $url = "/statuses/user_timeline/";
            $url .= "{$queryData['conditions']['username']}.json";
     
            $response = json_decode($this->connection->get($url), true);
            $results = array();
     
            foreach ($response as $record) {
                $record = array('Tweet' => $record);
                $record['User'] = $record['Tweet']['user'];
                unset($record['Tweet']['user']);
                $results[] = $record;
            }
            return $results;
        }
        public function create($model, $fields = array(), $values = array()) {
            $data = array_combine($fields, $values);
            $result = $this->connection->post('/statuses/update.json', $data);
            $result = json_decode($result, true);
            if (isset($result['id']) && is_numeric($result['id'])) {
                $model->setInsertId($result['id']);
                return true;
            }
            return false;
        }
        public function describe($model) {
            return $this->_schema['tweets'];
        }
    }
    ?>

Your model implementation could be as simple as:

::

    <?php
    class Tweet extends AppModel {
        public $useDbConfig = 'twitter';
    }
    ?>

If we had not defined our schema in the datasource itself, you would get
an error message to that effect here.

And the configuration settings in your ``app/config/database.php`` would
resemble something like this:

::

    <?php
        var $twitter = array(
            'datasource' => 'twitter',
            'login' => 'username',
            'password' => 'password',
        );
    ?>

Using the familiar model methods from a controller:

::

    <?php
    // Will use the username defined in the $twitter as shown above:
    $tweets = $this->Tweet->find('all');

    // Finds tweets by another username
    $conditions= array('username' => 'caketest');
    $otherTweets = $this->Tweet->find('all', compact('conditions'));
    ?>

Similarly, saving a new status update:

::

    <?php
    $this->Tweet->save(array('status' => 'This is an update'));
    ?>

Plugin DataSources and Datasource Drivers
=========================================

Plugin Datasources
------------------

You can also package Datasources into plugins.

Simply place your datasource file into
``plugins/[your_plugin]/models/datasources/[your_datasource]_source.php``
and refer to it using the plugin notation:

::

    var $twitter = array(
        'datasource' => 'Twitter.Twitter',
        'username' => 'test@example.com',
        'password' => 'hi_mom',
    );

Plugin DBO Drivers
------------------

In addition, you can also add to the current selection of CakePHP's dbo
drivers in plugin form.

Simply add your drivers to
``plugins/[your_plugin]/models/datasources/dbo/[your_driver].php`` and
again use plugin notation:

::

    var $twitter = array(
        'driver' => 'Twitter.Twitter',
        ...
    );

Combining the Two
-----------------

Finally, you're also able to bundle together your own DataSource and
respective drivers so that they can share functionality. First create
your main class you plan to extend:

::

    plugins/[social_network]/models/datasources/[social_network]_source.php : 
    <?php
    class SocialNetworkSource extends DataSource {
        // general functionality here
    }
    ?>

And now create your drivers in a sub folder:

::

    plugins/[social_network]/models/datasources/[social_network]/[twitter].php
    <?php
    class Twitter extends SocialNetworkSource {
        // Unique functionality here
    }
    ?>

And finally setup your ``database.php`` settings accordingly:

::

    var $twitter = array(
        'driver' => 'SocialNetwork.Twitter',
        'datasource' => 'SocialNetwork.SocialNetwork',
    );
    var $facebook = array(
        'driver' => 'SocialNetwork.Facebook',
        'datasource' => 'SocialNetwork.SocialNetwork',
    );

Just like that, all your files are included **Automagically!** No need
to place ``App::import()`` at the top of all your files.
