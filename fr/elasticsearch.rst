ElasticSearch
#############

Le plugin ElasticSearch fournit une abstraction de type ORM au-dessus de
`elasticsearch <https://www.elastic.co/products/elasticsearch>`_. Le plugin
fournit des fonctionnalités qui facilitent les tests, l'indexation des
documents et la recherche de vos index.

Installation
============

Pour installer le plugin elasticsearch, vous pouvez utiliser ``composer``.
A partir du répertoire ROOT de votre application (où se trouve le fichier
composer.json), lancez ce qui suit::

    php composer.phar require cakephp/elastic-search "@stable"

Vous devrez ajouter la ligne suivante au fichier **config/bootstrap.php** de
votre application::

    Plugin::load('Cake/ElasticSearch', ['bootstrap' => true]);

De plus, vous devrez configurer la connection à la source de donnée 'elastic'
dans votre fichier **config/app.php**. Un exemple de configuration serait::

    // Dans config/app.php
    'Datasources' => [
        // Autres sources de données
        'elastic' => [
            'className' => 'Cake\ElasticSearch\Datasource\Connection',
            'driver' => 'Cake\ElasticSearch\Datasource\Connection',
            'host' => '127.0.0.1',
            'port' => 9200,
            'index' => 'my_apps_index',
        ],
    ]

Vue d'Ensemble
==============

Le plugin elasticsearch facilite l'interaction avec un index elasticsearch
et fournit une interface similaire à celle de l':doc:`/orm`. Pour commencer,
vous devrez créer un objet ``Type``. Les objets ``Type`` sont le "Repository"
ou la classe de type table dans elasticsearch::

    // Dans src/Model/Type/ArticlesType.php
    namespace App\Model\Type;

    use Cake\ElasticSearch\Type;

    class ArticlesType extends Type
    {
    }

Vous pouvez utiliser votre classe type dans vos controllers::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        // Charge le Type en utilisant le provider 'Elastic'.
        $this->loadModel('Articles', 'Elastic');
    }

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success('It saved');
            }
        }
        $this->set(compact('article'));
    }

Nous devrons aussi créer une vue basique pour nos articles indexés::

    // Dans src/Template/Articles/add.ctp
    <?= $this->Form->create($article) ?>
    <?= $this->Form->control('title') ?>
    <?= $this->Form->control('body') ?>
    <?= $this->Form->button('Save') ?>
    <?= $this->Form->end() ?>

Vous devriez maintenant pouvoir soumettre le formulaire et avoir un nouveau
document ajouté à elasticsearch.

Objets Document
===============

Comme l'ORM, l'ODM Elasticsearch utilise les classes de type
:doc:`/orm/entities`. La classe de base que vous devrez hériter est
``Cake\ElasticSearch\Document``. Les classes de Document se trouvent
dans le namespace ``Model\Document`` dans votre application ou votre
plugin::

    namespace App\Model\Document;

    use Cake\ElasticSearch\Document;

    class Article extends Document
    {
    }

En dehors de la logique de constructeur qui fait fonctionner les Documents avec
les données de elasticsearch, l'interface et les fonctionnalités fournies par
``Document`` sont les mêmes que celles des :doc:`/orm/entities`

Recherche des Documents Indexés
===============================

Après avoir indexé quelques documents, vous voudrez chercher parmi ceux-ci. Le
plugin elasticsearch fournit un constructeur de requête qui vous permet de
construire les requêtes de recherche::

    $query = $this->Articles->find()
        ->where([
            'title' => 'special',
            'or' => [
                'tags in' => ['cake', 'php'],
                'tags not in' => ['c#', 'java']
            ]
        ]);

    foreach ($query as $article) {
        echo $article->title;
    }

Vous pouvez utiliser le ``FilterBuilder`` pour ajouter des conditions de
filtrage::

    $query->where(function ($builder) {
        return $builder->and(
            $builder->gt('views', 99),
            $builder->term('author.name', 'sally')
        );
    });

La `source de FilterBuilder
<https://github.com/cakephp/elastic-search/blob/master/src/FilterBuilder.php>`_
a la liste complète des méthodes avec des exemples pour beaucoup de méthodes
couramment utilisées.

Validation des Données & Utilisation des Règles d'Application
=============================================================

Comme pour l'ORM, le plugin ElasticSearch vous laisse valider les données
lors de la prise en compte des documents. Valider les données requêtées, et
appliquer les règles d'application fonctionne de la même façon que pour
l'ORM relationnel. Regardez les sections :ref:`validating-request-data`
et :ref:`application-rules` pour plus d'informations.

Sauvegarder les Nouveaux Documents
==================================

Quand vous êtes prêt à indexer quelques données dans elasticsearch, vous
devrez d'abord convertir vos données dans un ``Document`` qui peut être
indexé::

    $article = $this->Articles->newEntity($data);
    if ($this->Articles->save($article)) {
        // Document a été indexé
    }

Lors de la prise en compte d'un document, vous pouvez spécifier les documents
intégrés que vous souhaitez prendre en compte en utilisant la clé
``associated``::

    $article = $this->Articles->newEntity($data, ['associated' => ['Comments']]);

Sauvegarder un document va récupérer les events suivants:

* ``Model.beforeSave`` - Lancé avant que le document ne soit sauvegardé. En
  stoppant cet event, vous pouvez empêcher l'opération de sauvegarde de se
  produire.
* ``Model.buildRules`` - Lancé quand les vérificateurs de règles sont
  construits pour la première fois.
* ``Model.afterSave`` - Lancé après que le document est sauvegardé.

.. note::
    Il n'y a pas d'events pour les documents intégrés, puisque le document
    parent et tous ses documents intégrés sont sauvegardés en une opération.


Mettre à Jour les Documents Existants
=====================================

Quand vous devez réindexer les données, vous pouvez patch les entities
existantes et les re-sauvegarder::

    $query = $this->Articles->find()->where(['user.name' => 'jill']);
    foreach ($query as $doc) {
        $doc->set($newProperties);
        $this->Articles->save($doc);
    }

Supprimer les Documents
=======================

Après la récupération d'un document, vous pouvez le supprimer::

    $doc = $this->Articles->get($id);
    $this->Articles->delete($doc);

Vous pouvez aussi supprimer les documents qui matchent des conditions
spécifiques::

    $this->Articles->deleteAll(['user.name' => 'bob']);

Documents Intégrés
==================

En définissant les documents intégrés, vous pouvez attacher des classes entity
à des chemins de propriété spécifique dans vos documents. Ceci vous permet
de fournir un comportement personnalisé pour les documents dans un document
parent. Par exemple, vous pouvez vouloir les commentaires intégrés à un
article pour avoir des méthodes spécifiques selon l'application. Vous pouvez
utiliser ``embedOne`` et ``embedMany`` pour définir les documents intégrés::

    // Dans src/Model/Type/ArticlesType.php
    namespace App\Model\Type;

    use Cake\ElasticSearch\Type;

    class ArticlesType extends Type
    {
        public function initialize()
        {
            $this->embedOne('User');
            $this->embedMany('Comments', [
                'entityClass' => 'MyComment'
            ]);
        }
    }

Ce qui au-dessus va créer deux documents intégrés sur le document ``Article``.
L'``User`` intégré va convertir la propriété ``user`` en instances de
``App\Model\Document\User``. Pour récupérer les Commentaires intégrés et
utiliser un nom de classe qui ne correspond pas au nom de la propriété, nous
pouvons utiliser l'option ``entityClass`` pour configurer un nom de classe
personnalisé.

Une fois que vous avez configuré nos documents intégrés, les résultats de
``find()`` et ``get()`` vont retourner les objets avec les bonnes classes
de document intégré::

    $article = $this->Articles->get($id);
    // Instance de App\Model\Document\User
    $article->user;

    // Array des instances App\Model\Document\Comment
    $article->comments;

Récupérer les Instances Type
============================

Comme pour l'ORM, le plugin elasticsearch fournit un factory/registre pour
récupérer les instances ``Type``::

    use Cake\ElasticSearch\TypeRegistry;

    $articles = TypeRegistry::get('Articles');

Nettoyer le Registre
--------------------

Pendant les cas de test, vous voudrez nettoyer le registre. Faire cela est
souvent utile quand vous utilisez les objets de mock, ou quand vous modifiez
les dépendances d'un type::

    TypeRegistry::flush();

Fixtures de Test
================

Le plugin elasticsearch fournit seamless test suite integration. Un peu comme
les fixtures de base de données, vous pouvez créer des fixtures de test pour
elasticsearch. Nous pourrions définir une fixture de test pour notre type
Articles avec ce qui suit::

    namespace App\Test\Fixture;

    use Cake\ElasticSearch\TestSuite\TestFixture;

    /**
     * Articles fixture
     */
    class ArticlesFixture extends TestFixture
    {
        /**
         * La table/type pour cette fixture.
         *
         * @var string
         */
        public $table = 'articles';

        /**
         * The mapping data.
         *
         * @var array
         */
        public $schema = [
            'id' => ['type' => 'integer'],
            'user' => [
                'type' => 'nested',
                'properties' => [
                    'username' => ['type' => 'string'],
                ]
            ]
            'title' => ['type' => 'string'],
            'body' => ['type' => 'string'],
        ];

        public $records = [
            [
                'user' => [
                    'username' => 'billy'
                ],
                'title' => 'First Post',
                'body' => 'Some content'
            ]
        ];
    }

La propriété ``schema`` utilise le format de mapping `natif d'elasticsearch
<https://www.elastic.co/guide/en/elasticsearch/reference/1.5/mapping.html>`_.
Vous pouvez sans problème ne pas mettre le nom du type et la clé de niveau
supérieur ``properties``. Une fois que vos fixtures sont créées, vous pouvez les
utiliser dans vos cas de test en les incluant dans vos propriétés de test
``fixtures``::

    public $fixtures = ['app.articles'];

