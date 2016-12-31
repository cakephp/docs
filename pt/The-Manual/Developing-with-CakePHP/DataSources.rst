DataSources
###########

DataSources são o link entre modelos e a fonte de dados que os modelos
representam. Em muitos casos, os dados são obtidos de um banco de dados
relacional como MySQL, PostgreSQL ou MSSQL. CakePHP é distribuido com
diversos datasources específcios de banco de dados (veja o arquivo da
classe dbo\_\* em cake/libs/model/datasources/dbo/), um resumo de cada
está listado aqui por conveniência:

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

Ao especificar uma configuração de conexão com o banco de dados, em
app/config/database.php, CakePHP usa o datasource de banco de dados
correspondente para uma operação de modelo. Então, mesmo que você não
soubia sobre datasource, você tem os usado o tempo todo.

Todas as fontes acima derivam de uma base, a classe ``DboSource`` , a
qual agrega alguma lógica que é comum para a maiorida dos bancos de
dados relacionais. Se você decidir escrever uma data source RDBMS,
trabalhando com um destes (e.g. dbo\_mysql.php ou dbo\_mssql.php) é sua
melhor aposta.

Muitas pessoas, contudo, estão interessadas em escrever datasources para
fontes externas de dados, como uma REST API remota ou até mesmo um
servidor LDAP. Então é isso que veremos agora.

API Básica para DataSources
===========================

Um datasource pode e *deve* implementar ao menos os seguintes métodos:
``create``, ``read``, ``update`` e/ou ``delete`` (as assinaturas destes
métodos e seus detalhes de implementaçāo nāo sāo importantes neste
momento, e iremos descrevê-los mais adiante). Nāo é necessário
implementar métodos além destes - aliás, se você precisar de um
datasource somente-leitura, nāo precisa nem implementar os métodos
``create`` e ``update``.

Métodos que devem ser implementados:

-  ``describe($model)``
-  ``listSources()``
-  Ao menos um destes:

   -  ``create($model, $fields = array(), $values = array())``
   -  ``read($model, $queryData = array())``
   -  ``update($model, $fields = array(), $values = array())``
   -  ``delete($model, $id = null)``

Também é possível (e algumas vezes, útil) definir a variável de classe
``$_schema`` dentro do próprio datasource, ao invés de no model.

E essencialmente é isso. Acoplando este datasource a um model, você
passa a poder usar ``Model::find()/save()`` como faria normalmente, e os
dados e/ou parâmetros apropriados usados para chamar estes métodos serāo
passados para o datasource em si, onde você pode decidir implementar
quaisquer recursos que você precise (p.ex, processamento de opções como
``'conditions'`` ou ``'limit'`` para o Model::find, ou mesmo seus
próprios parâmetros personalizados).

Um Exemplo
==========

Aqui está um exemplo simples de como usar DataSources e o ``HttpSocket``
para implementar um datasource muito básico para o
`Twitter <https://twitter.com>`_, que lhe permita consultar a Twitter API
bem como submeter novas atualizações de status para uma conta
configurada.

**Este exemplo só irá funcionar nas versões de PHP 5.2 e superior**, em
virtude do uso de ``json_decode`` para processamento dos dados no
formato JSON.

Você deve salvar o datasource do Twitter em
app/models/datasources/twitter\_source.php:

::

    <?php
    /**
     * Twitter DataSource
     *
     * Usado para ler e escrever no Twitter, atravé dos models.
     *
     * PHP Version 5.x
     *
     * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
     * Copyright 2005-2009, Cake Software Foundation, Inc. (http://www.cakefoundation.org)
     *
     * Disponibilizado sob licença MIT.
     * Redistribuições dos arquivos devem manter a nota de copyright acima.
     *
     * @filesource
     * @copyright     Copyright 2009, Cake Software Foundation, Inc. (http://www.cakefoundation.org)
     * @link          https://cakephp.org Projeto CakePHP(tm)
     * @license       http://www.opensource.org/licenses/mit-license.php A licença MIT
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

A implementaçāo de seu model pode ser tāo simples quanto isto:

::

    <?php
    class Tweet extends AppModel {
        public $useDbConfig = 'twitter';
    }
    ?>

Se o esquema nāo tiver sido definido no próprio datasource, você vai
receber uma mensagem de erro neste ponto.

E as opções de configuraçāo em seu arquivo ``app/config/database.php``
devem ser algo parecido com:

::

    <?php
        var $twitter = array(
            'datasource' => 'twitter',
            'login' => 'username',
            'password' => 'password',
        );
    ?>

Usando os conhecidos métodos de model a partir do controller:

::

    <?php
    // Isto irá usar o usuário definido na configuraçāo $twitter como mostrado acima:
    $tweets = $this->Tweet->find('all');

    // Encontra os tweets de outro usuário
    $conditions= array('username' => 'caketest');
    $otherTweets = $this->Tweet->find('all', compact('conditions'));
    ?>

De forma semelhante, pode-se salvar um novo registro de status:

::

    <?php
    $this->Tweet->save(array('status' => 'Esta é uma atualzaçāo'));
    ?>

