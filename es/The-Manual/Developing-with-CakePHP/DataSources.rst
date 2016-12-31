DataSources (fuentes de datos)
##############################

DataSources son el enlace entre los modelos y la fuente de datos que
cada modelo representa. En muchos caos, los datos son recuperados de una
base de datos relacional, como MySQL, PostgreSQL o MSSQL. CakePHP se
distribuye con varias datasources específicas para varias bases de datos
(consulta los archivos de clases dbo\_\* class files en
cake/libs/model/datasources/dbo/), aquí se lista un resumen de los
mismos para tu comodidad:

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

Cuando se especifica una configuración de conexión a base de datos en
app/config/database.php, CakePHP usa de forma transparente la datasource
correspondiente a la base de datos para todas las operaciones con
modelos. Por eso, aunque creas que no sabes nada de datasources, ya las
has estado usando desde siempre.

Todas las fuentes de datos indicadas arriba derivan de una clase base
``DboSource`` la cual añade alguna lógica común a la mayoría de bases de
datos relaciones. Si decides crear una datasource RDBMS, tu mejor
apuesta es trabajar a paritr de una de ellas (por ejemeplo:
dbo\_mysql.php o dbo\_mssql.php) La mayor parte de la gente, sin
embargo, está interesada en escribir datasources para fuentes de datos
externas, como APIs REST remotas o incluso servidores LDAP. Así que eso
es lo que vamos a examinar en adelante.

API básica para DataSources
===========================

Una datasource puede, y debería implementar al menos uno de los
siguientes métodos: ``create``, ``read``, ``update`` y/o ``delete`` (la
signatura y detalles de implementación no son importantes en este
momento, y serán descritos más tarde). No necesitas implementar más
métodos de los necesarios de los descritos arriba - si estás escribiendo
una datasource de sólo-lectura, no hay razón para implementar ``create``
y ``update``.

Métodos que deben ser implementados

-  ``describe($model)``
-  ``listSources()``
-  Al menos uno de:

   -  ``create($model, $fields = array(), $values = array())``
   -  ``read($model, $queryData = array())``
   -  ``update($model, $fields = array(), $values = array())``
   -  ``delete($model, $id = null)``

Es posible también (y muchas veces bastante útil) definir el atributo de
clase ``$_schema`` dentro la datasource misma, en lugar de en el modelo.
Y esto es casi todo lo que hay. Emparejando una datasource a un modelo
podrás utilizar ``Model::find()/save/()`` como harías normalmentem y los
datos y/o parámetros adecuados serán usados para llamar a esos métodos
serán pasados a la propia datasource, donde puedes decidir implementar
cualquier prestación que necesites (por ejemplo: opciones para
Model::find como procesasr ``'conditions'``, ``'limit'`` o incluso tus
propios parámetros a medida).

Un ejemplo
==========

Lo que sigue es un ejemplo simple de como usar dataSources y
``HttpSocket`` para implementar una fuente muy básica de
`Twitter <http://twitter.com>`_ que nos permita utilizar la API de
twitter y enviar nuestras actualizaciones.

**Este ejemplo sólo funcionará sobre PHP 5.2 o superior**, debido al uso
de ``json_decode`` para procesar los datos en formato JSON.

Tendrás que colocar la datasource para Twitter en tu
app/models/datasources/twitter\_source.php:

::

    <?php
    /**
     * Twitter DataSource
     *
     * Utilizada para leer y escribir en Twitter usando modelos.
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

La implementación de tu modelo puede ser tan simple como:

::

    <?php
    class Tweet extends AppModel {
        public $useDbConfig = 'twitter';
    }
    ?>

Si no hemos definido nuestro esquema en la propia datasource, nos dará
un mensaje de error al efecto aquí.

Y los ajustes de configuración en tu ``app/config/database.php`` se
parecerán a estos:

::

    <?php
        var $twitter = array(
            'datasource' => 'twitter',
            'login' => 'username',
            'password' => 'password',
        );
    ?>

Usando los familiares métodos de modelo desde un controlador:

::

    <?php
    // Usará el nombre de usuario definido en $twitter como se mostró arriba:
    $tweets = $this->Tweet->find('all');

    // Encontrar tweets de otros usuario
    $conditions= array('username' => 'caketest');
    $otherTweets = $this->Tweet->find('all', compact('conditions'));
    ?>

De forma similar, guardando una actualización del estatus:

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
