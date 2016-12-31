Containable
###########

Uma nova adição ao core do CakePHP 1.2 core é o ContainableBehavior.
Este behavior permite filtrar e limitar operações de pesquisa dos
Models. Usar o Containable irá ajudá-lo a reduzir o desgaste
desnecessário em seu banco de dados, aumentando a velocidade e o
desempenho global do seu aplicativo. A classe também irá ajudá-lo a
pesquisar e filtrar os dados para os usuários de uma forma limpa e
consistente.

O Containable permite racionalizar e simplificar as operações com
associações de seus Models. Ele pode funcionar temporariamente ou
permanentemente alterando as associações de seus modelos. Ele faz isso
usando uma série de chamadas ``bindModel`` e ``unbindModel`` para
alterar essas as associações.

Para usar o novo behavior, você pode adicioná-lo à propriedade
``$actsAs`` do seu Model:

::

    class Post extends AppModel {
        var $actsAs = array('Containable');
    }

Você pode também adicionar o behavior em tempo de execução:

::

    $this->Post->Behaviors->attach('Containable');

Usando o Containable
====================

Para ver como o Containable funciona, vamos ver alguns exemplos.
Primeiramente vamos começar com uma chamada find() em um model chamado
Post. Digamos que nosso Post possa ter vários comentários (Post hasMany
Comment) e que possa ter e pertence a muitas tgs (Post
hasAndBelongsToMany Tag). A quantidade de dados recuperados em uma
chamada find() normal poderá ser bem extensa:

::

    debug($this->Post->find('all'));

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => Primeiro post
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => Daniel
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => Primeiro comentário
                                [created] => 2008-05-18 00:00:00
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [post_id] => 1
                                [author] => Sam
                                [email] => sam@example.net
                                [website] => http://example.net
                                [comment] => Segundo comentário
                                [created] => 2008-05-18 00:00:00
                            )
                    )
                [Tag] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [name] => Incrível
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [name] => Fermento
                            )
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (...

Para algumas telas de sua aplicação, você pode não precisar de tanta
informação a partir do model Post. Uma das coisas que o
``ContainableBehavior`` faz é ajudar você a enxugar o retorno de uma
chamada find().

Por exemplo, para obter apenas as informações referentes ao Post em si,
você pode fazer o seguinte:

::

    $this->Post->contain();
    $this->Post->find('all');

Você também pode invocar a mágica do Containable de dentro de uma
chamada ao find():

::

    $this->Post->find('all', array('contain' => false));

Feito isto, você obtem um resultado bem mais conciso:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => Primeiro post
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => Segundo post
                        [content] => bbb
                        [created] => 2008-05-19 00:00:00
                    )
            )

Este tipo de ajuda não é algo novo: na verdade, você já poderia fazer
isso mesmo sem o ``ContainableBehavior`` com algo assim:

::

    $this->Post->recursive = -1;
    $this->Post->find('all');

O Containable realmente vai mostrar sua importância quando você tiver
associações compleas e quiser filtrar as coisas que estiverem num mesmo
nível. A propriedade ``$recursive`` do model é útil se você quiser
remover um nível completo de recursão, mas não vai adiantar se você
quser selecionar e escolhar o que manter em cada nível. Vejamos como as
coisas funcionam ao se usar o método ``contain()``.

O primeiro argumento do métod contain aceita o nome ou um array de nomes
do models que queremos manter na operação de busca. Se quisermos
recuperar todos os posts e suas respectivas tags (sem as informações de
comentários), poderíamos fazer algo como:

::

    $this->Post->contain('Tag');
    $this->Post->find('all');

Novamente, podemos também usar o índice contain dentro de uma chamada
find():

::

    $this->Post->find('all', array('contain' => 'Tag'));

Sem o Containable, você acabaria precisaria usar o método
``unbindModel()`` do model várias vezes para remover diversos models do
resultado. O Containable cria uma maneira simples e clara de se obter o
mesmo resultado.

Contendo associações mais complexas
===================================

Containable também vai a uma etapa mais profunda: é possível filtrar os
dados dos modelos associados. Se você olhar para os resultados do
original ``find()``, observe o campo autor do Model comentário. Se você
está interessado nos posts e nos nomes dos autores dos comentários - e
nada mais - você poderia fazer algo como o seguinte:

::

    $this->Post->contain('Comment.author');
    $this->Post->find('all');

    //or..

    $this->Post->find('all', array('contain' => 'Comment.author'));

Aqui, nós informamos ao Containable para nos dar as informações dos
posts, e apenas o campo autor do Model comentário. A saída desta chamada
pode ser algo parecido com isto:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [author] => Daniel
                                [post_id] => 1
                            )
                        [1] => Array
                            (
                                [author] => Sam
                                [post_id] => 1
                            )
                    )
            )
    [1] => Array
            (...

Como você pode ver, o array dos comentários contém apenas o campo autor
(mais o post\_id que é necessário para CakePHP mapear os resultados).

Você também pode filtrar os dados dos comentário associados,
especificando uma condição:

::

    $this->Post->contain('Comment.author = "Daniel"');
    $this->Post->find('all');

    //or...

    $this->Post->find('all', array('contain' => 'Comment.author = "Daniel"'));

Isso nos dá um resultado que nos retorna posts com comentários feitos
por Daniel:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => Daniel
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => First comment
                                [created] => 2008-05-18 00:00:00
                            )
                    )
            )

A filtragem adicional pode ser realizada com as opções do método
``Model->find()``:

::

    $this->Post->find('all', array('contain' => array(
        'Comment' => array(
            'conditions' => array('Comment.author =' => "Daniel"),
            'order' => 'Comment.created DESC'
        )
    )));

Aqui está um exemplo de uso do ContainableBehavior quando você tem
associações profundas e complexas entre Models.

Vamos considerar as associações seguintes:

::

    User->Profile
    User->Account->AccountSummary
    User->Post->PostAttachment->PostAttachmentHistory->HistoryNotes
    User->Post->Tag

Aqui está como podemos recuperar estas associações usando o Containable:

::

    $this->User->find('all', array(
        'contain'=>array(
            'Profile',
            'Account' => array(
                'AccountSummary'
            ),
            'Post' => array(
                'PostAttachment' => array(
                    'fields' => array('id', 'name'),
                    'PostAttachmentHistory' => array(
                        'HistoryNotes' => array(
                            'fields' => array('id', 'note')
                        )
                    )
                ),
                'Tag' => array(
                    'conditions' => array('Tag.name LIKE' => '%happy%')
                )
            )
        )
    ));

Tenha em mente que a chave ``'contain'`` é usada apenas uma vez no Model
principal, você não precisa utilizá-lo novamente nos Models
relacionados.

Quando usar as opções 'fields' e 'contain' - lembrar de incluir todas as
chaves estrangeiras que sua consulta necessita direta ou indiretamente.
Observe também que, devido ao Containable ter que ser ligado a todos os
Models usados na operação, você pode considerar colocá-lo no seu
AppModel.

Using Containable with pagination
=================================

By including the 'contain' parameter in the ``$paginate`` property it
will apply to both the find('count') and the find('all') done on the
model

See the section `Using
Containable <https://book.cakephp.org/view/1324/Using-Containable>`_ for
further details.

Here's an example of how to contain associations when paginating.

::

    $this->paginate['User'] = array(
        'contain' => array('Profile', 'Account'),
        'order' => 'User.username'
    );

    $users = $this->paginate('User');

ContainableBehavior options
===========================

The ``ContainableBehavior`` has a number of options that can be set when
the Behavior is attached to a model. The settings allow you to fine tune
the behavior of Containable and work with other behaviors more easily.

-  **recursive** (boolean, optional) set to true to allow containable to
   automatically determine the recursiveness level needed to fetch
   specified models, and set the model recursiveness to this level.
   setting it to false disables this feature. The default value is
   ``true``.
-  **notices** (boolean, optional) issues E\_NOTICES for bindings
   referenced in a containable call that are not valid. The default
   value is ``true``.
-  **autoFields**: (boolean, optional) auto-add needed fields to fetch
   requested bindings. The default value is ``true``.

You can change ContainableBehavior settings at run time by reattaching
the behavior as seen in `Using
behaviors </pt/view/1072/Using-Behaviors>`_

ContainableBehavior can sometimes cause issues with other behaviors or
queries that use aggregate functions and/or GROUP BY statements. If you
get invalid SQL errors due to mixing of aggregate and non-aggregate
fields, try disabling the ``autoFields`` setting.

::

    $this->Post->Behaviors->attach('Containable', array('autoFields' => false));

