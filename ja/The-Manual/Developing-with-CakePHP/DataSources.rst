データソース
############

データソース
は、モデルと、モデルが表現しているデータ自体をリンクするものです。通常、データは
MySQL, PostgresSQL もしくは MSSQL
といったリレーショナルデータベースから取得されます。CakePHP
には、あらかじめいくつかの特定のデータベース用のデータソースが用意されています（cake/libs/model/datasources/dbo/
の中にある dbo\_\* class というファイルです ）。以下に列挙します：

-  dbo\_adodb.php
-  dbo\_db2.php
-  dbo\_firebird.php
-  dbo\_mssql.php
-  dbo\_mysql.php
-  dbo\_mysqli.php
-  dbo\_odbc.php
-  dbo\_oracle.php
-  dbo\_postgres.php
-  dbo\_sqlite.php
-  dbo\_sybase.php

app/config/database.php
の中で利用するデータベースを特定することで、CakePHP
はすべてのモデル操作において、自動的にそのデータベースのデータソースを利用します。
したがって、通常は特にデータソースのことを意識しなくても、問題なくモデルを扱うことができます。

上記のソースはすべて、 ``DboSource``
というほとんどのリレーショナルデータベースに共通するロジックが書かれた基底クラスから派生しています。もしあなたが
RDBMS のデータソースを書きたいときは、これら（例えばdbo\_mysql.php や
dbo\_mssql.php）を元に作成するのがよいでしょう。

しかし、多くの方は、リモートの REST API や、 LDAP
サーバといった外部データのデータソース作成に興味があると思います。それでは、これからそのやり方についてみていきましょう。

データソースのための基本的な API
================================

データソースは、
次のメソッドのうち少なくとも一つを実装でき、また\ *そうすべきです*\ ：
それは ``create``, ``read``, ``update`` そして（あるいは）
``delete``\ です（さしあたり、いまの段階ではメソッドの実際の用法と実装の詳細は置いておきます。のちほど説明します）。必要性がなければ、上記のメソッド以上のものを実装しなくてもかまいません
- もし読み込み専用のデータソースが必要な場合は、\ ``create`` や
``update`` といったメソッドを実装しなくてもかまいません。

実装しなければならないメソッド

-  ``describe($model)``
-  ``listSources()``
-  次のうち少なくとも一つ：

   -  ``create($model, $fields = array(), $values = array())``
   -  ``read($model, $queryData = array())``
   -  ``update($model, $fields = array(), $values = array())``
   -  ``delete($model, $id = null)``

モデルの中でなく、データソース自身の中で ``$_schema``
クラス属性を定義することも可能となっています（そしてそれは時に非常に有効です）。

以上ですべてです。このようにしてデータソースをモデルと結びつけることで、いつものように
``Model::find() や save()``
が利用できます。これらのメソッドを呼ぶための適切なデータやパラメータは、データソース自身に投げられます。そこでは、あなたが必要などんな機能（例えば
Model::find オプションの ``'conditions'``
や、\ ``'limit'``\ 、あるいは独自のカスタムパラメータさえ）も定義することができます。

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
