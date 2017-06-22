Salvando dados
##############

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

Depois que você :doc:`carregou seus dados</orm/retrieving-data-and-resultsets>`
provavelmente vai querer atualizar e salvar as alterações.

Visão geral sobre Salvando Dados
=========================

Aplicações geralmente terá algumas maneiras de como os dados são salvos. A
primeira é, obviamente, atravéz de formulários web e a outra é por geração direta
ou alterando dados no código para enviar ao banco de dados.

Inserindo dados
--------------

A maneira mais fácil de inserir dados no banco de dados é criando uma nova entidade
e passando ela pro método ``save()`` na class ``Table`` class::

    use Cake\ORM\TableRegistry;

    $articlesTable = TableRegistry::get('Articles');
    $article = $articlesTable->newEntity();

    $article->title = 'A New Article';
    $article->body = 'This is the body of the article';

    if ($articlesTable->save($article)) {
        // The $article entity contains the id now
        $id = $article->id;
    }
Atualizando dados
-------------

Atualizar seus dados é igualmente fácil, e o método ``save()`` também é usado para
esse propósito::

    use Cake\ORM\TableRegistry;

    $articlesTable = TableRegistry::get('Articles');
    $article = $articlesTable->get(12); // Return article with id 12

    $article->title = 'CakePHP is THE best PHP framework!';
    $articlesTable->save($article);

CakePHP saberá quando deve realizar uma inserção ou atualização com base no valor
de retorno do método ``isNew()``. Entidades que foram obtidas com ``get()`` ou
``find()`` sempre retornará ``false`` quando ``isNew()`` é chamado nelas.

Salvando com associações
------------------------

Por padrão o método ``save()`` também salvará associações de um nível::

    $articlesTable = TableRegistry::get('Articles');
    $author = $articlesTable->Authors->findByUserName('mark')->first();

    $article = $articlesTable->newEntity();
    $article->title = 'An article by mark';
    $article->author = $author;

    if ($articlesTable->save($article)) {
        // A chave estrangeira foi atribuída automaticamente
        echo $article->author_id;
    }

O método ``save()`` também é capaz de criar novos registros para associações::

    $firstComment = $articlesTable->Comments->newEntity();
    $firstComment->body = 'The CakePHP features are outstanding';

    $secondComment = $articlesTable->Comments->newEntity();
    $secondComment->body = 'CakePHP performance is terrific!';

    $tag1 = $articlesTable->Tags->findByName('cakephp')->first();
    $tag2 = $articlesTable->Tags->newEntity();
    $tag2->name = 'awesome';

    $article = $articlesTable->get(12);
    $article->comments = [$firstComment, $secondComment];
    $article->tags = [$tag1, $tag2];

    $articlesTable->save($article);

Associe Muitos para Muitos (N para N) registros
------------------------------

O exemplo anterior demonstra como associar algumas tags a um artigo.
Outra maneira de realizar a mesma coisa é usando o método ``link()``
na associação::

    $tag1 = $articlesTable->Tags->findByName('cakephp')->first();
    $tag2 = $articlesTable->Tags->newEntity();
    $tag2->name = 'awesome';

    $articlesTable->Tags->link($article, [$tag1, $tag2]);
 
Salvando dados da tabela de ligação
-----------------------------
Salvar dados na tabela de ligação é realizado usando a propriedade especial
``_joinData``. Esta propriedade deve ser um instância de ``Entity`` da classe
Table de ligação::

    // Link records for the first time.
    $tag1 = $articlesTable->Tags->findByName('cakephp')->first();
    $tag1->_joinData = $articlesTable->ArticlesTags->newEntity();
    $tag1->_joinData->tagComment = 'The CakePHP ORM is so powerful!';

    $articlesTable->Tags->link($article, [$tag1]);

    // Update an existing association.
    $article = $articlesTable->get(1, ['contain' => ['Tags']]);
    $article->tags[0]->_joinData->tagComment = 'Fresh comment.'

    // Necessary because we are changing a property directly
    $article->dirty('tags', true);

    $articlesTable->save($article, ['associated' => ['Tags']]);

Você também pode criar / atualizar informações na tabela de ligação utilizando
``newEntity()`` ou ``patchEntity()``. Os seus dados de POST devem parecer::

    $data = [
        'title' => 'My great blog post',
        'body' => 'Some content that goes on for a bit.',
        'tags' => [
            [
                'id' => 10,
                '_joinData' => [
                    'tagComment' => 'Great article!',
                ]
            ],
        ]
    ];
    $articlesTable->newEntity($data, ['associated' => ['Tags']]);

Remover associação Muitos para Muitos (N para N) registros
---------------------------

A remoção de associação Muitos para Muitos registros é realizada através do método
``unlink()``::

    $tags = $articlesTable
        ->Tags
        ->find()
        ->where(['name IN' => ['cakephp', 'awesome']])
        ->toArray();

    $articlesTable->Tags->unlink($article, $tags);

Quando modificando registros, configurando ou alterando diretamente as propriedades,
nenhuma validação é realizada, que é um problema quando está aceitando dados de 
formulário. As seções seguintes demostrarão como converter eficientemente dados de 
formulário em entidades que podem ser validadas e salva.

.. _converting-request-data:

Convertendo dados de requisição em entidades
=====================================

Antes de editar e salvar os dados de volta no seu banco de dados, você precisará
converter os dados da requisição, de array mantido na requisição em entidades
que o ORM utiliza. A classe Table fornece uma maneira fácil e eficiente de converter
uma ou várias entidades dos dados de requisição. Você pode converter uma entidade
usando::

    //No controller
    $articles = TableRegistry::get('Articles');

    // Valida e converte em um objeto do tipo Entity
    $entity = $articles->newEntity($this->request->getData());

.. note::

    Se você estiver usando newEntity() e as entidades resultantes estão faltando algum
    ou todos os dados passados, verifique se as colunas que deseja definir estão
    listadas na propriedade ``$_accessible`` da sua entidade. Consulte :ref:`entities-mass-assignment`.
 
Os dados da requisição devem seguir a estrutura de suas entidades. Por exemplo, se você
tem um artigo, que pertence a um usuário, e tem muitos comentários, os seus dados de
requisição devem ser semelhante::

    $data = [
        'title' => 'CakePHP For the Win',
        'body' => 'Baking with CakePHP makes web development fun!',
        'user_id' => 1,
        'user' => [
            'username' => 'mark'
        ],
        'comments' => [
            ['body' => 'The CakePHP features are outstanding'],
            ['body' => 'CakePHP performance is terrific!'],
        ]
    ];

Por padrão, o método ``newEntity()`` valida os dados que são passados para
ele, conforme explicado na seção :ref:`validating-request-data`. Se você 
deseja pular a validação de dados, informe a opção ``'validate' => false``::

    $entity = $articles->newEntity($data, ['validate' => false]);

Ao criar formulários que salvam associações aninhadas, você precisa definir
quais associaçes devem ser convertidas:: 

    // No controller
    $articles = TableRegistry::get('Articles');

    // Nova entidade com associações aninhadas
    $entity = $articles->newEntity($this->request->getData(), [
        'associated' => [
            'Tags', 'Comments' => ['associated' => ['Users']]
        ]
    ]);
 
O exemplo acima indica que 'Tags', 'Comments' e 'Users' para os artigos devem
ser convertidos. Alternativamente, você pode usar a notação de ponto 
(dot notation) por brevidade::

    // No controller
    $articles = TableRegistry::get('Articles');

    // Nova entidade com associações aninhada usando notação de ponto
    $entity = $articles->newEntity($this->request->getData(), [
        'associated' => ['Tags', 'Comments.Users']
    ]);
Você  também pode desativar a conversão de possíveis associações aninhadas como::

    $entity = $articles->newEntity($data, ['associated' => []]);
    // ou...
    $entity = $articles->patchEntity($entity, $data, ['associated' => []]);

Os dados associados também são validados por padrão, a menos que seja informado o
contrário. Você também pode alterar o conjunto de validação a ser usada por associação::

    // No controller
    $articles = TableRegistry::get('Articles');

    // Pular validação na associação de Tags e
    // Definino 'signup' como método de validação para Comments.Users
    $entity = $articles->newEntity($this->request->getData(), [
        'associated' => [
            'Tags' => ['validate' => false],
            'Comments.Users' => ['validate' => 'signup']
        ]
    ]);

O capitulo :ref:`using-different-validators-per-association` possui mais informações
sobre como usar diferentes validadores para associações ao transformar em entidades.

O diagrama a seguir fornece uma visão geral do que acontece dentro dos métodos 
``newEntity()`` ou ``patchEntity()``::

.. figure:: /_static/img/validation-cycle.png
   :align: left
   :alt: Flow diagram showing the marshalling/validation process.

Você sempre pode contar de obter uma entidade de volta com ``newEntity()``. Se a validação
falhar, sua entidade conterá erros, e quaisquer campos inválidos não serão preenchidos 
na entidade criada.
