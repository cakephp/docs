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
