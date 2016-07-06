DataSources (Sources de Données)
################################

Les Sources de données (DataSources) sont les liens entre les models et la
source de données qu'ils représentent. Dans de nombreux cas, les données
sont récupérées depuis une base de données relationnelle telle MySQL,
PostgreSQL ou Microsoft SQL Server. CakePHP est distribué avec de nombreuses sources de
données spécifiques d'une base de données (voir les fichiers de classe
dans ``lib/Cake/Model/Datasource/Database``), un résumé de ceux-ci est listé
ici pour votre confort :

- Mysql
- Postgres
- Sqlite
- Sqlserver

.. note::

    Vous pouvez trouver des sources de données contributives de la communauté
    supplémentaires dans le
    `Dépôt de Sources de Données CakePHP sur GitHub <https://github.com/cakephp/datasources/tree/2.0>`_.

Quand vous spécifiez une configuration de connexion à une base de données
dans ``app/Config/database.php``, CakePHP utilise de manière transparente la
source de données correspondant à la base de données pour toutes les
opérations de model. Donc, même si vous pensiez ne rien connaître aux
sources de données, vous les utilisez tout le temps.

Toutes les sources ci-dessus dérivent d'une classe de base ``DboSource``,
qui agrège de la logique commune à la plupart des bases de données
relationnelles. Si vous décidez d'écrire une source de donnée RDBMS,
travailler à partir de l'une d'entre elles (par ex MySQL ou
SQLite) est plus sûr.

La plupart des gens cependant, sont intéressés par l'écriture de sources
de données pour des sources externes, telles les APIs REST distantes ou
même un serveur LDAP. C'est donc ce que nous allons voir maintenant.

API basique pour les Sources de Données
=======================================

Une source de données peut et *devrait* implémenter au moins l'une des méthodes
suivantes : ``create``, ``read``, ``update`` et/ou ``delete`` (les signatures
exactes de méthode et les détails d'implémentation ne sont pas importants
pour le moment, ils seront décrits plus tard). Vous n'êtes pas obligé
d'implémenter plus que nécessaire, parmi les méthodes listées ci-dessus -
si vous avez besoin d'une source de données en lecture seule, il n'y a
aucune raison d'implémenter ``create``, ``update`` et ``delete``.

Méthodes qui doivent être implémentées pour toutes les méthodes CRUD:

-  ``describe($model)``
-  ``listSources($data = null)``
-  ``calculate($model, $func, $params)``
-  Au moins une des suivantes:
   
   -  ``create(Model $model, $fields = null, $values = null)``
   -  ``read(Model $model, $queryData = array(), $recursive = null)``
   -  ``update(Model $model, $fields = null, $values = null, $conditions = null)``
   -  ``delete(Model $model, $id = null)``

Il est possible également (et souvent très pratique), de définir
l'attribut de classe ``$_schema`` au sein de la source de données
elle-même, plutôt que dans le model.

Et c'est à peu près tout ce qu'il y a dire ici. En couplant cette
source de données à un model, vous êtes alors en mesure d'utiliser
``Model::find()/save()/delete()``, comme vous le feriez normalement ;
les données et/ou paramètres appropriés, utilisés pour appeler ces
méthodes, seront passés à la source de données elle-même, dans laquelle
vous pouvez décider d'implémenter toutes les fonctionnalités dont vous
avez besoin (par exemple les options de Model::find comme le parsing
``'conditions'``, ``'limit'`` ou même vos paramètres personnalisés).

Un Exemple
==========

Une des raisons pour laquelle vous voudriez écrire votre propre source de
données pourrait être la volonté d'accéder à l'API d'une librairie tierce en
utilisant les méthodes habituelles ``Model::find()/save()/delete()``. Ecrivons
une source de données qui va accéder à une API JSON distante et fictive. Nous
allons l'appeler ``FarAwaySource`` et nous allons la placer dans
``app/Model/Datasource/FarAwaySource.php``::

    App::uses('HttpSocket', 'Network/Http');

    class FarAwaySource extends DataSource {

    /**
     * Une description optionnelle de votre source de données
     */
        public $description = 'A far away datasource';

    /**
     * Nos options de config par défaut. Ces options seront personnalisées dans notre
     * ``app/Config/database.php`` et seront fusionnées dans le ``__construct()``.
     */
        public $config = array(
            'apiKey' => '',
        );

    /**
     * Si nous voulons create() ou update(), nous avons besoin de spécifier la
     * disponibilité des champs. Nous utilisons le même tableau indicé comme nous le faisions avec CakeSchema, par exemple
     * fixtures et schema de migrations.
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
     * Créons notre HttpSocket et gérons any config tweaks.
     */
        public function __construct($config) {
            parent::__construct($config);
            $this->Http = new HttpSocket();
        }

    /**
     * Puisque les sources de données se connectent normalement à une base de données
     * il y a quelques modifications à faire pour les faire marcher sans base de données.
     */

    /**
     * listSources() est pour la mise en cache. Vous voulez implémenter la mise en cache
     * de votre façon avec une source de données personnalisée. Donc juste ``return null``.
     */
        public function listSources() {
            return null;
        }

    /**
     * describe() dit au model votre schema pour ``Model::save()``.
     *
     * Vous voulez peut-être un schema différent pour chaque model mais utiliser
     * toujours une unique source de données. Si c'est votre cas, alors
     * définissez une propriété ``schema`` dans vos models et retournez
     * simplement ``$Model->schema`` ici à la place.
     */
        public function describe(Model $Model) {
            return $this->_schema;
        }

    /**
     * calculate() est pour déterminer la façon dont nous allons compter
     * les enregistrements et est requis pour faire fonctionner ``update()``
     * et ``delete()``.
     *
     * Nous ne comptons pas les enregistrements ici mais retournons une chaîne
     * à passer à 
     * ``read()`` qui va effectivement faire le comptage. La façon la plus
     * facile est de juste retourner la chaîne 'COUNT' et de la vérifier
     * dans ``read()`` où ``$data['fields'] === 'COUNT'``.
     */
        public function calculate(Model $model, $func, $params = array()) {
            return 'COUNT';
        }

    /**
     * Implémente le R dans CRUD. Appel à ``Model::find()`` se trouve ici.
     */
        public function read(Model $model, $queryData = array(), $recursive = null) {
            /**
             * Ici nous faisons réellement le comptage comme demandé par notre
             * méthode calculate() ci-dessus. Nous pouvons soit vérifier la
             * source du dépôt, soit une autre façon pour récupérer le compte
             * de l\'enregistrement. Ici nous allons simplement retourner 1
             * ainsi ``update()`` et ``delete()`` vont estimer que l\'enregistrement
             * existe.
             */
            if ($queryData['fields'] === 'COUNT') {
                return array(array(array('count' => 1)));
            }
            /**
             * Maintenant nous récupérons, décodons et retournons les données du dépôt.
             */
            $queryData['conditions']['apiKey'] = $this->config['apiKey'];
            $json = $this->Http->get('http://example.com/api/list.json', $queryData['conditions']);
            $res = json_decode($json, true);
            if (is_null($res)) {
                $error = json_last_error();
                throw new CakeException($error);
            }
            return array($Model->alias => $res);
        }

    /**
     * Implémente le C dans CRUD. Appel à ``Model::save()`` sans $model->id
     * défini se trouve ici.
     */
        public function create(Model $model, $fields = null, $values = null) {
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
     * Implémente le U dans CRUD. Appel à ``Model::save()`` avec $Model->id
     * défini se trouve ici. Selon la source du dépôt, vous pouvez juste appeler
     * ``$this->create()``.
     */
        public function update(Model $model, $fields = null, $values = null, $conditions = null) {
            return $this->create($model, $fields, $values);
        }

    /**
     * Implémente le D de CRUD. Appel à ``Model::delete()`` se trouve ici.
     */
        public function delete(Model $model, $id = null) {
            $json = $this->Http->get('http://example.com/api/remove.json', array(
                'id' => $id[$model->alias . '.id'],
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

Nous pouvons à présent configurer la source de données dans notre fichier
``app/Config/database.php`` en y ajoutant quelque chose comme ceci::

    public $faraway = array(
        'datasource' => 'FarAwaySource',
        'apiKey'     => '1234abcd',
    );

Et ensuite utiliser la configuration de notre source de données dans
nos models comme ceci::

    class MyModel extends AppModel {
        public $useDbConfig = 'faraway';
    }

Nous pouvons à présent récupérer les données depuis notre source distante
en utilisant les méthodes familières dans notre model::

    // Récupère tous les messages de 'Some Person'
    $messages = $this->MyModel->find('all', array(
        'conditions' => array('name' => 'Some Person'),
    ));

.. tip::

    L'utilisation d'autres types de find que ``'all'`` peut avoir des résultats
    inattendus si le résultat de votre méthode ``read`` n'est pas un tableau
    indexé numériquement.

De la même façon, nous pouvons sauvegarder un nouveau message::

    $this->MyModel->save(array(
        'name' => 'Some Person',
        'message' => 'New Message',
    ));

Mettre à jour le précédent message::

    $this->MyModel->id = 42;
    $this->MyModel->save(array(
        'message' => 'Updated message',
    ));

Et supprimer le message::

    $this->MyModel->delete(42);

Plugin de source de données
===========================

Vous pouvez également empaqueter vos sources de données dans des plugins.

Placez simplement votre fichier de source de données à l'intérieur de
``Plugin/[YourPlugin]/Model/Datasource/[YourSource].php`` et faites
y référence en utilisant la syntaxe pour les plugins::

    public $faraway = array(
        'datasource' => 'MyPlugin.FarAwaySource',
        'apiKey'     => 'abcd1234',
    );

Se connecter à un serveur SQL
=============================

La source de données Sqlserver dépend de l'extension PHP de Microsoft appelée
pdo_sqlsrv. Cette extension PHP n'est pas inclue dans l'installation de base
de PHP et doit être installée séparément.

Le Client Native du Serveur SQL doit aussi être installé pour que l'extension
fonctionne. Puisque le Client Native est disponible seulement pour Windows,
vous ne serez pas capable de l'installer sur Linux, Mac OS X ou FreeBSD.

Donc si les erreurs de la source de données Sqlserver sortent::

    Error: Database connection "Sqlserver" is missing, or could not be created.

Vérifiez d'abord l'extension PHP du Serveur SQL pdo_sqlsrv et le Client Native
du Serveur SQL.

.. meta::
    :title lang=fr: DataSources (Sources de Données)
    :keywords lang=fr: array values,model fields,connection configuration,implementation details,relational databases,best bet,mysql postgresql,sqlite,external sources,ldap server,database connection,rdbms,sqlserver,postgres,relational database,microsoft sql server,aggregates,apis,repository,signatures
