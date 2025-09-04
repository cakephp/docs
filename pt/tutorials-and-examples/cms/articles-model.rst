CMS Tutorial - Criando nosso primeiro Modelo
############################################

Os modelos são o coração das aplicações CakePHP. Eles nos permitem ler e
modificar nossos dados. Eles nos permitem construir relações entre nossos dados, validar
dados e aplicar regras de aplicação. Os modelos fornecem a base necessária para
criar nossas ações de controller e models.

Os modelos do CakePHP são compostos por objetos ``Table`` e ``Entity``. Os objetos ``Table``
fornecem acesso à coleção de entidades armazenadas em uma tabela específica.
Eles são armazenados em **src/Model/Table**. O arquivo que criaremos será salvo
em **src/Model/Table/ArticlesTable.php**. O arquivo completo deverá
ficar assim::

    <?php
    // src/Model/Table/ArticlesTable.php
    declare(strict_types=1);

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            parent::initialize($config);
            $this->addBehavior('Timestamp');
        }
    }

Anexamos o comportamento :doc:`/orm/behaviors/timestamp`, que irá
preencher automaticamente as colunas ``created`` e ``modified`` da nossa tabela.
Ao nomear nosso objeto Table como ``ArticlesTable``, o CakePHP pode usar convenções de nomenclatura
para saber que nosso modelo usa a tabela ``articles``. O CakePHP também usa
convenções para saber que a coluna ``id`` é a chave primária da nossa tabela.

.. note::

    O CakePHP criará dinamicamente um objeto de modelo para você caso
    não encontre um arquivo correspondente em **src/Model/Table**. Isso também significa
    que, se você acidentalmente nomear seu arquivo incorretamente (por exemplo, articlestable.php ou
    ArticleTable.php), o CakePHP não reconhecerá nenhuma de suas configurações e
    usará o modelo gerado.

Também criaremos uma classe Entity para nossos Artigos. Entidades representam um único
registro no banco de dados e fornecem comportamento em nível de linha para nossos dados. Nossa entidade
será salva em **src/Model/Entity/Article.php**. O arquivo completo deverá
ficar assim::

    <?php
    // src/Model/Entity/Article.php
    declare(strict_types=1);

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected array $_accessible = [
            'user_id' => true,
            'title' => true,
            'slug' => true,
            'body' => true,
            'published' => true,
            'created' => true,
            'modified' => true,
            'user' => true,
            'tags' => true,
        ];
    }

No momento, nossa entidade é bem enxuta; configuramos apenas a propriedade ``_accessible``,
que controla como as propriedades podem ser modificadas por
:ref:`entities-mass-assignment`.

.. tip::
    As classes de entidade ``ArticlesTable`` e ``Article`` podem ser geradas a partir de um
    terminal:

    .. code-block:: console

        bin/cake bake model articles

Ainda não podemos fazer muita coisa com este modelo. Em seguida, criaremos nosso primeiro
:doc:`Controller e Template </tutorials-and-examples/cms/articles-controller>`
para nos permitir interagir com nosso modelo.
