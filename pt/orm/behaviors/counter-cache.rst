CounterCache
############

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: CounterCacheBehavior

Muitas vezes, os aplicativos da web precisam exibir contagens de objetos relacionados. 
Por exemplo, ao mostrar uma lista de artigos, você pode exibir quantos comentários ela 
possui. Ou, ao mostrar a um usuário, você pode mostrar quantos amigos/seguidores ele tem. 
O comportamento do CounterCache é destinado a essas situações. O CounterCache atualizará 
um campo nos modelos associados atribuídos nas opções quando for chamado. Os campos devem 
existir no banco de dados e ser do tipo INT.

Uso Básico
==========

Você ativa o comportamento do CounterCache como qualquer outro comportamento, 
mas ele não fará nada até você configurar algumas relações e as contagens de 
campos que devem ser armazenadas em cada uma delas. Usando nosso exemplo abaixo, 
poderíamos armazenar em cache a contagem de comentários para cada artigo com o 
seguinte::

    class CommentsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('CounterCache', [
                'Articles' => ['comment_count']
            ]);
        }
    }

A configuração do CounterCache deve ser um mapa dos nomes das relações 
e a configuração específica para essa relação.

O valor do contador será atualizado sempre que uma entidade for salva 
ou excluída. O contador **não** será atualizado quando você usar ``updateAll()`` 
ou ``deleteAll()``, ou executar o SQL que você escreveu.

Uso Avançado
============

Se você precisar manter um contador em cache por menos que todos os registros 
relacionados, poderá fornecer condições adicionais ou métodos localizadores 
para gerar um valor de contador::

    // Use um método específico de localização.
    // Nesse caso, usando o finder (published)
    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'finder' => 'published'
            ]
        ]
    ]);

Se você não tiver um método localizador personalizado, poderá fornecer uma 
variedade de condições para localizar registros::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'conditions' => ['Comments.spam' => false]
            ]
        ]
    ]);

Se você deseja que o CounterCache atualize vários campos, por exemplo, 
mostrando uma contagem condicional e uma contagem básica, você pode 
adicionar esses campos na matriz::

    $this->addBehavior('CounterCache', [
        'Articles' => ['comment_count',
            'published_comment_count' => [
                'finder' => 'published'
            ]
        ]
    ]);

Se você deseja calcular o valor do campo CounterCache por conta própria, 
pode definir a opção ``ignoreDirty`` como ``true``.

Isso impedirá que o campo seja recalculado se você o tiver definido
antes::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'ignoreDirty' => true
            ]
        ]
    ]);

Por fim, se um localizador personalizado e as condições não forem adequadas, 
você poderá fornecer uma função de retorno de chamada. Sua função deve retornar 
o valor da contagem a ser armazenada::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'rating_avg' => function ($event, $entity, $table, $original) {
                return 4.5;
            }
        ]
    ]);

Sua função pode retornar ``false`` para pular a atualização da coluna do contador 
ou um objeto ``Query`` que produziu o valor da contagem. Se você retornar um 
objeto ``Query``, sua consulta será usada como uma subconsulta na instrução 
de atualização. O parâmetro ``$table`` refere-se ao objeto de tabela que mantém 
o comportamento (não a relação de destino) por conveniência. O retorno de chamada 
é chamado pelo menos uma vez com ``$original`` definido como ``false``. Se a atualização 
da entidade alterar a associação, o retorno de chamada será invocado uma *segunda* vez 
com ``true``, o valor de retorno atualizará o contador do item associado *anteriormente*.

.. note::

    O comportamento do CounterCache funciona apenas para associações ``belongsTo``. 
    Por exemplo, para "Comentários pertence a artigos", é necessário adicionar o 
    comportamento do CounterCache ao ``CommentsTable`` para gerar ``comment_count`` 
    para a tabela Articles.
    
    É possível, no entanto, fazer isso funcionar para associações ``belongsToMany``. 
    Você precisa habilitar o comportamento do CounterCache em uma tabela personalizada 
    ``through`` configurada nas opções de associação e definir a opção de configuração 
    ``cascadeCallbacks`` como true. Veja como configurar uma tabela de junção 
    personalizada :ref:`using-the-through-option`.

.. versionchanged:: 3.6.0
    Retornando ``false`` para pular as atualizações foi adicionado.
