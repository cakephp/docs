コンテイナブル
##############

ContainableBehavior は CakePHP のコアの新機能です。このビヘイビアは find
を実行するときに関連したモデルを選別したり限定したりするために使用します。コンテイナブル(\ *Containable*)は、データベース中の不要なものを削減し、アプリケーションの速度やパフォーマンスを改善します。このクラスを使うと、ユーザに対するデータの検索とフィルタを、美しく一貫した方法で行うこともできます。

新しいビヘイビアを使用する場合は、モデルの $actsAs
にビヘイビアの指定を追加します。

::

    class Post extends AppModel {
        var $actsAs = array('Containable');
    }

動的にビヘイビアを追加することもできます。

::

    $this->Post->Behaviors->attach('Containable');

コンテイナブルがどのように動作するか、いくつかの例を見てみましょう。まずは
Post というモデルで find() を実行した場合の例からはじめます。なお、 Post
は Comment と hasMany 、 Tag と hasAndBelongsToMany
のアソシエーションを持つものとします。普通に find()
を実行した場合に取得できるデータ全体は、かなり大きな規模になります。

::

    debug($this->Post->find('all'));

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => 最初の記事
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => ダニエル
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => 最初のコメント
                                [created] => 2008-05-18 00:00:00
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [post_id] => 1
                                [author] => サム
                                [email] => sam@example.net
                                [website] => http://example.net
                                [comment] => 二番目のコメント
                                [created] => 2008-05-18 00:00:00
                            )
                    )
                [Tag] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [name] => A
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [name] => B
                            )
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (...

アプリケーションのインターフェースによっては、この Post
モデルから得られた情報が多すぎるかもしれません。ContainableBehavior
が行うことの一つは、 find() によって返されるデータを削減することです。

例えば、 Post に関連した情報だけを取得するには、次のようにします。

::

    $this->Post->contain();
    $this->Post->find('all');

find() の呼び出し中にコンテイナブルの機能の起動を含めることも出来ます。

::

    $this->Post->find('all', array('contain' => false));

この実行結果として、より簡潔なデータを取得できます。

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => 最初の記事
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => 二番目の記事
                        [content] => bbb
                        [created] => 2008-05-19 00:00:00
                    )
            )

この類の呼び出しの補助機能は特に目新しいものではありません。実際のところ、これは
ContainableBehavior を使わずとも次のようにすることで行うことができます。

::

    $this->Post->recursive = -1;
    $this->Post->find('all');

コンテイナブルが真価を発揮するのは、複雑なアソシエーションを持ち、同じレベルに存在する情報を切り詰める場合です。モデルの
$recursive プロパティはある recursive
レベル全体を取得する場合に便利ですが、各レベルで特定のモデルのデータを選び出す時には使えません。contain()
メソッドを使用した場合にどのように動作するのかを見てみましょう。contain()
メソッドの最初の引数には、 find()
を行うにあたりデータを取得するモデルの名前を渡します。複数のモデルを指定する場合は、配列で渡します。全ての
Post とそれに関連する Tag だけを取得し、 Comment
の情報は取得しない場合、次のように行います。

::

    $this->Post->contain('Tag');
    $this->Post->find('all');

find() の呼び出しの中に contain キーを含める場合の記述を見てみましょう。

::

    $this->Post->find('all', array('contain' => 'Tag'));

コンテイナブルを使わないならモデルの unbindModel()
を使用することになります。複数のモデルを切り離すなら、 unbindModel()
を何度も実行しなければなりません。コンテイナブルによって同じことをより簡潔に行えます。

さらに進んだ使い方があります。コンテイナブルには、\ *アソシエーション*\ で関連付いたモデルのデータをフィルタリングするというさらに進んだ使い方もあります。最初の例で
find() を呼び出した結果のうち、 Comment モデルの author
フィールドに注目してください。投稿(\ *post*)のうち、コメントをした人の名前(\ *author*)を取得し、他は取得したくない場合、次のようにします。

::

    $this->Post->contain('Comment.author');
    $this->Post->find('all');

    //or..

    $this->Post->find('all', array('contain' => 'Comment.author'));

ここまでで、コンテイナブルで投稿(post)の情報を取得し、アソシエーションで関連付いた
Comment モデルのうち author
フィールドだけを取得する方法を説明しました。find()
による出力は、次のようになるでしょう。

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => 最初の記事
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [author] => ダニエル
                                [post_id] => 1
                            )
                        [1] => Array
                            (
                                [author] => サム
                                [post_id] => 1
                            )
                    )
            )
    [1] => Array
            (...

Comment 配列に author
フィールドだけが含まれていることが確認できると思います。ただし、 CakePHP
が結果をマップするために必要な post\_id は含まれます。

条件(\ *condition*)を定義して、アソシエーションで関連付いた Comment
のデータにフィルタをかけることもできます。

::

    $this->Post->contain('Comment.author = "ダニエル"');
    $this->Post->find('all');

    // または

    $this->Post->find('all', array('contain' => 'Comment.author = "ダニエル"'));

これにより、投稿(\ *post*)とダニエルによるコメントを取得できます。

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => 最初の記事
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => ダニエル
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => 最初のコメント
                                [created] => 2008-05-18 00:00:00
                            )
                    )
            )

フィルタを追加するには、標準的な ``Model->find()``
のオプションを与えます。

::

    $this->Post->find('all', array('contain' => array(
        'Comment' => array(
            'conditions' => array('Comment.author =' => "ダニエル"),
            'order' => 'Comment.created DESC'
        )
    )));

より深い recursive
と複雑なモデルの関連の時にコンテイナブルビヘイビアを使う方法の例は次のようになります。

モデル間のアソシエーションは次のようになっているとします。

::

    User->Profile
    User->Account->AccountSummary
    User->Post->PostAttachment->PostAttachmentHistory->HistoryNotes
    User->Post->Tag

上述のアソシエーションにおいてコンテイナブルを使った検索は次のように行います。

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

メインのモデルで「contain」キーは一度しか使わないことに留意してください。関連したモデルにでもう一度「contain」は使いません。

'fields' と 'contain'
オプションを使う場合は、クエリが直接的あるいは間接的に使う外部キーを含めるよう注意してください。また、Containable
ビヘイビアは、この機能を使って出力を抑制するモデルの全てに付与しなければなりません。そのため、AppModel
で Containable
ビヘイビアを付与することを検討すべきかもしれないということも留意してください。

次のものは、ページ付けを行う際のアソシエーションの抑制を行うという例です。

::

    $this->paginate['User'] = array(
        'contain' => array('Profile', 'Account'),
        'order' => 'User.username'
    );

    $users = $this->paginate('User');

Using Containable
=================

To see how Containable works, let's look at a few examples. First, we'll
start off with a find() call on a model named Post. Let's say that Post
hasMany Comment, and Post hasAndBelongsToMany Tag. The amount of data
fetched in a normal find() call is rather extensive:

::

    debug($this->Post->find('all'));

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
                        [1] => Array
                            (
                                [id] => 2
                                [post_id] => 1
                                [author] => Sam
                                [email] => sam@example.net
                                [website] => http://example.net
                                [comment] => Second comment
                                [created] => 2008-05-18 00:00:00
                            )
                    )
                [Tag] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [name] => Awesome
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [name] => Baking
                            )
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (...

For some interfaces in your application, you may not need that much
information from the Post model. One thing the ``ContainableBehavior``
does is help you cut down on what find() returns.

For example, to get only the post-related information, you can do the
following:

::

    $this->Post->contain();
    $this->Post->find('all');

You can also invoke Containable's magic from inside the find() call:

::

    $this->Post->find('all', array('contain' => false));

Having done that, you end up with something a lot more concise:

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
            )
    [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => Second article
                        [content] => bbb
                        [created] => 2008-05-19 00:00:00
                    )
            )

This sort of help isn't new: in fact, you can do that without the
``ContainableBehavior`` doing something like this:

::

    $this->Post->recursive = -1;
    $this->Post->find('all');

Containable really shines when you have complex associations, and you
want to pare down things that sit at the same level. The model's
``$recursive`` property is helpful if you want to hack off an entire
level of recursion, but not when you want to pick and choose what to
keep at each level. Let's see how it works by using the ``contain()``
method.

The contain method's first argument accepts the name, or an array of
names, of the models to keep in the find operation. If we wanted to
fetch all posts and their related tags (without any comment
information), we'd try something like this:

::

    $this->Post->contain('Tag');
    $this->Post->find('all');

Again, we can use the contain key inside a find() call:

::

    $this->Post->find('all', array('contain' => 'Tag'));

Without Containable, you'd end up needing to use the ``unbindModel()``
method of the model, multiple times if you're paring off multiple
models. Containable creates a cleaner way to accomplish this same task.

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
also note that because Containable must to be attached to all models
used in containment, you may consider attaching it to your AppModel.

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
behaviors </ja/view/1072/Using-Behaviors>`_

ContainableBehavior can sometimes cause issues with other behaviors or
queries that use aggregate functions and/or GROUP BY statements. If you
get invalid SQL errors due to mixing of aggregate and non-aggregate
fields, try disabling the ``autoFields`` setting.

::

    $this->Post->Behaviors->attach('Containable', array('autoFields' => false));

