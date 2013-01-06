Containable
###########

A new addition to the CakePHP 1.2 core is the ``ContainableBehavior``.
This model behavior allows you to filter and limit model find
operations. Using Containable will help you cut down on needless wear
and tear on your database, increasing the speed and overall performance
of your application. The class will also help you search and filter your
data for your users in a clean and consistent way.

Containable allows you to streamline and simplify operations on your
model bindings. It works by temporarily or permanently altering the
associations of your models. It does this by using the supplied
containments to generate a series of ``bindModel`` and ``unbindModel``
calls.

To use the new behavior, you can add it to the $actsAs property of your
model:

::

    class Post extends AppModel {
        var $actsAs = array('Containable');
    }

You can also attach the behavior on the fly:

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

Containing deeper associations
==============================

Containable also goes a step deeper: you can filter the data of the
*associated* models. If you look at the results of the original find()
call, notice the author field in the Comment model. If you are
interested in the posts and the names of the comment authors — and
nothing else — you could do something like the following:

::

    $this->Post->contain('Comment.author');
    $this->Post->find('all');

    //or..

    $this->Post->find('all', array('contain' => 'Comment.author'));

Here, we've told Containable to give us our post information, and just
the author field of the associated Comment model. The output of the find
call might look something like this:

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

As you can see, the Comment arrays only contain the author field (plus
the post\_id which is needed by CakePHP to map the results).

You can also filter the associated Comment data by specifying a
condition:

::

    $this->Post->contain('Comment.author = "Daniel"');
    $this->Post->find('all');

    //or...

    $this->Post->find('all', array('contain' => 'Comment.author = "Daniel"'));

This gives us a result that gives us posts with comments authored by
Daniel:

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

Additional filtering can be performed by supplying the standard
``Model->find()`` options:

::

    $this->Post->find('all', array('contain' => array(
        'Comment' => array(
            'conditions' => array('Comment.author =' => "Daniel"),
            'order' => 'Comment.created DESC'
        )
    )));

Here's an example of using the ``ContainableBehavior`` when you've got
deep and complex model relationships.

Let's consider the following model associations:

::

    User->Profile
    User->Account->AccountSummary
    User->Post->PostAttachment->PostAttachmentHistory->HistoryNotes
    User->Post->Tag

This is how we retrieve the above associations with Containable:

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

Keep in mind that ``contain`` key is only used once in the main model,
you don't need to use 'contain' again for related models

When using 'fields' and 'contain' options - be careful to include all
foreign keys that your query directly or indirectly requires. Please
also note that because Containable must be attached to all models used
in containment, you may consider attaching it to your AppModel.

Using Containable with pagination
=================================

Here's an example of how to contain associations when paginating.

::

    $this->paginate['User'] = array(
        'contain' => array('Profile', 'Account'),
        'order' => 'User.username'
    );

    $users = $this->paginate('User');

By including the 'contain' parameter in the ``$paginate`` property it
will apply to both the find('count') and the find('all') done on the
model

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
the behavior as seen in `Using behaviors </pt/view/90/Using-Behaviors>`_

ContainableBehavior can sometimes cause issues with other behaviors or
queries that use aggregate functions and/or GROUP BY statements. If you
get invalid SQL errors due to mixing of aggregate and non-aggregate
fields, try disabling the ``autoFields`` setting.

::

    $this->Post->Behaviors->attach('Containable', array('autoFields' => false));

