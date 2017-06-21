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
