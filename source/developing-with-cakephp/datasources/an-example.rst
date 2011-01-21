3.9.2 An Example
----------------

Here is a simple example of how to use Datasources and
``HttpSocket`` to implement a very basic
`Twitter <http://twitter.com>`_ source that allows querying the
Twitter API as well as posting new status updates to a configured
account.

**This example will only work in PHP 5.2 and above**, due to the
use of ``json_decode`` for the parsing of JSON formatted data.

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
     * CakePHP(tm) : Rapid Development Framework (http://www.cakephp.org)
     * Copyright 2005-2009, Cake Software Foundation, Inc. (http://www.cakefoundation.org)
     *
     * Licensed under The MIT License
     * Redistributions of files must retain the above copyright notice.
     *
     * @filesource
     * @copyright     Copyright 2009, Cake Software Foundation, Inc. (http://www.cakefoundation.org)
     * @link          http://cakephp.org CakePHP(tm) Project
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

If we had not defined our schema in the datasource itself, you
would get an error message to that effect here.

And the configuration settings in your ``app/config/database.php``
would resemble something like this:

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

3.9.2 An Example
----------------

Here is a simple example of how to use Datasources and
``HttpSocket`` to implement a very basic
`Twitter <http://twitter.com>`_ source that allows querying the
Twitter API as well as posting new status updates to a configured
account.

**This example will only work in PHP 5.2 and above**, due to the
use of ``json_decode`` for the parsing of JSON formatted data.

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
     * CakePHP(tm) : Rapid Development Framework (http://www.cakephp.org)
     * Copyright 2005-2009, Cake Software Foundation, Inc. (http://www.cakefoundation.org)
     *
     * Licensed under The MIT License
     * Redistributions of files must retain the above copyright notice.
     *
     * @filesource
     * @copyright     Copyright 2009, Cake Software Foundation, Inc. (http://www.cakefoundation.org)
     * @link          http://cakephp.org CakePHP(tm) Project
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

If we had not defined our schema in the datasource itself, you
would get an error message to that effect here.

And the configuration settings in your ``app/config/database.php``
would resemble something like this:

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
