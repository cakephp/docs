Sources de Données
##################

Les Sources de données (*DataSources*) sont les liens entre les modèles
et la source de données qu'ils représentent. Dans de nombreux cas, les
données sont récupérées depuis une base de données relationnelle telle
MySQL, PostgreSQL ou MSSQL. CakePHP est distribué avec de nombreuses
sources de données spécifiques d'une base de données (voir les fichiers
de classe dbo\_\* dans cake/libs/model/datasources/dbo/), un résumé de
ceux-ci est listé ici pour votre confort :

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

Quand vous spécifiez une configuration de connexion à une base de
données dans app/config/database.php, CakePHP utilise de manière
transparente la source de données correspondant à la base de données
pour toutes les opérations de modèle. Donc, même si vous pensiez ne rien
connaître aux sources de données, vous les utilisez tout le temps.

Toutes les sources ci-dessus dérivent d'une classe de base
``DboSource``, qui agrège de la logique commune à la plupart des bases
de données relationnelles. Si vous décidez d'écrire une source de donnée
RDBMS, travailler à partir de l'une d'entre elles (par ex dbo\_mysql.php
ou dbo\_mssql.php) est plus sûr.

La plupart des gens cependant, sont intéressés par l'écriture de sources
de données pour des sources externes, telles les APIs REST distantes ou
même un serveur LDAP. C'est donc ce que nous allons voir maintenant.

API basique pour les Sources de Données
=======================================

Une source de données peut et *devrait* implémenter au moins l'une des
méthodes suivantes : ``create``, ``read``, ``update`` et/ou ``delete``
(les signatures exactes de méthode et les détails d'implémentation ne
sont pas importants pour le moment, ils seront décrits plus tard). Vous
n'êtes pas obligé d'implémenter plus que nécessaire, parmi les méthodes
listées ci-dessus - si vous avez besoin d'une source de données en
lecture seule, il n'y a aucune raison d'implémenter ``create`` et
``update``.

Méthodes qui doivent être implémentées :

-  ``describe($model)``
-  ``listSources()``
-  et au moins l'une de celles-ci :

   -  ``create($model, $fields = array(), $values = array())``
   -  ``read($model, $queryData = array())``
   -  ``update($model, $fields = array(), $values = array())``
   -  ``delete($model, $id = null)``

Il est possible également (et souvent très pratique), de définir
l'attribut de classe ``$_schema`` au sein de la source de données
elle-même, plutôt que dans le modèle.

Et c'est à peu près tout ce qu'il y a dire ici. En couplant cette source
de données à un modèle, vous êtes alors en mesure d'utiliser
``Model::find()/save()``, comme vous le feriez normalement ; les données
et/ou paramètres appropriés, utilisés pour appeler ces méthodes, seront
passés à la source de données elle-même, dans laquelle vous pouvez
décider d'implémenter toutes les fonctionnalités dont vous avez besoin
(par exemple les options de Model::find comme ``'conditions'``,
``'limit'`` ou même vos paramètres personnalisés).

Un Exemple
==========

Voici un exemple simple sur la manière d'utiliser les *Datasources* et
``HttpSocket``, pour implémenter une source
`Twitter <http://twitter.com>`_ vraiment basique, qui permet de requêter
l'API Twitter et de poster les nouvelles mises à jour du statut vers un
compte configuré.

**Cet exemple ne fonctionnera qu'avec PHP 5.2 et supérieur**, à cause de
l'usage de ``json_decode`` pour l'analyse des données au format JSON.

Vous pourriez placez la source de données Twitter dans
app/models/datasources/twitter\_source.php :

::

    <?php
     * DataSource Twitter
     *
     * Utilisée pour lire et écrire sur Twitter, à travers les modèles.
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

Votre implémentation de modèle pourrait être aussi simple que :

::

    <?php
    class Tweet extends AppModel {
        public $useDbConfig = 'twitter';
    }
    ?>

Si nous n'avions pas défini notre schéma dans la source de données
elle-même, vous obtiendriez ici un message d'erreur.

Et les paramètres de configuration dans votre
``app/config/database.php`` devraient ressembler à quelque chose comme
çà :

::

    <?php
        var $twitter = array(
            'datasource' => 'twitter',
            'login' => 'username',
            'password' => 'password',
        );
    ?>

Utilisation des méthodes de modèle familières depuis un contrôleur :

::

    <?php
    // Utilisera le nom d'utilisateur défini dans $twitter, comme montré ci-dessus :
    $tweets = $this->Tweet->find('all');

    // Trouve les tweets par un autre nom d'utilisateur
    $conditions= array('username' => 'caketest');
    $autresTweets = $this->Tweet->find('all', compact('conditions'));
    ?>

De la même façon, une nouvelle mise à jour du statut :

::

    <?php
    $this->Tweet->save(array('status' => 'Ceci est une mise à jour'));
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
