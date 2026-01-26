# Containable

`class` **ContainableBehavior**

`ContainableBehavior` は、CakePHP 1.2 コアに新規に追加されました。
このモデルビヘイビアは、 find を実行するときにモデルの find 操作をフィルタリングしたり
制限することができます。 Containable を使うと、データベース上の不要なものを削減し、
アプリケーションの速度やパフォーマンスを改善します。また、このクラスは、ユーザーのための
データの検索とフィルタリングを、美しく一貫した方法で行うことができます。

Containable は、モデル結合の操作を効率化し単純化できます。それは、モデルの
アソシエーションを変更するために、一時的または永続的に動作します。これを使用することによって、
一連の `bindModel` と `unbindModel` の呼び出しの発生を抑えることができます。
Containable が、存在しているリレーションを更新するだけの場合、遠いアソシエーションによって
結果を制限することはできません。代わりに、 [Joining Tables](../../models/associations-linking-models-together#joining-tables) を参照してください。

新しいビヘイビアを使用する場合は、モデルの \$actsAs プロパティにビヘイビアの指定を
追加します。 :

``` php
class Post extends AppModel {
    public $actsAs = array('Containable');
}
```

動的にビヘイビアを追加することもできます。 :

``` php
$this->Post->Behaviors->load('Containable');
```

## Containable の使用

Containable がどのように動作するか、いくつかの例を見てみましょう。まずは
Post というモデルで `find()` を実行した場合の例からはじめます。なお、 Post は
Comment と hasMany 、 Tag と hasAndBelongsToMany のアソシエーションを
持つものとします。普通に `find()` を実行した場合に取得できるデータ全体は、
かなり大きな規模になります。 :

``` php
debug($this->Post->find('all'));

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
```

アプリケーションのインターフェースによっては、この Post
モデルから得られた情報が多すぎるかもしれません。 `ContainableBehavior`
が行うことの一つは、 find() によって返されるデータを削減することです。

例えば、 Post に関連した情報だけを取得するには、次のようにします。 :

``` php
$this->Post->contain();
$this->Post->find('all');
```

find() の呼び出し中に Containable の機能の起動を含めることも出来ます。 :

``` php
$this->Post->find('all', array('contain' => false));
```

この実行結果として、より簡潔なデータを取得できます。 :

``` text
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
```

この類の呼び出しの補助機能は特に目新しいものではありません。実際のところ、これは
`ContainableBehavior` を使わずとも次のようにすることで行うことができます。 :

``` php
$this->Post->recursive = -1;
$this->Post->find('all');
```

Containable が真価を発揮するのは、複雑なアソシエーションを持ち、
同じレベルに存在する情報を切り詰める場合です。モデルの `$recursive`
プロパティは、ある recursive レベル全体を取得する場合に便利ですが、
各レベルで特定のモデルのデータを選び出す時には使えません。 `contain()`
メソッドを使用した場合にどのように動作するのかを見てみましょう。

contain メソッドの最初の引数には、 find() を行うにあたりデータを取得する
モデルの名前を渡します。複数のモデルを指定する場合は、配列で渡します。全ての
Post とそれに関連する Tag だけを取得し、 Comment の情報は取得しない場合、
次のように行います。 :

``` php
$this->Post->contain('Tag');
$this->Post->find('all');
```

find() の呼び出しの中に contain キーを含める場合の記述を見てみましょう。 :

``` php
$this->Post->find('all', array('contain' => 'Tag'));
```

Containable を使わないならモデルの `unbindModel()` を使用することになります。
複数のモデルを切り離すなら、 unbindModel() を何度も実行しなければなりません。
Containable によって同じことをより簡潔に行えます。

## 深いアソシエーションを含む

さらに進んだ使い方があります。Containable には、 *アソシエーション* で関連付いた
モデルのデータをフィルタリングするというさらに進んだ使い方もあります。最初の例で
find() を呼び出した結果のうち、 Comment モデルの author フィールドに
注目してください。投稿 (*post*) のうち、コメントをした人の名前 (*author*)
を取得し、他は取得したくない場合、次のようにします。 :

``` php
$this->Post->contain('Comment.author');
$this->Post->find('all');

// or..

$this->Post->find('all', array('contain' => 'Comment.author'));
```

ここまでで、Containable で投稿 (*post*) の情報を取得し、アソシエーションで
関連付いた Comment モデルのうち author フィールドだけを取得する方法を説明しました。
find() による出力は、次のようになるでしょう。 :

``` text
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
```

Comment 配列に author フィールドだけが含まれていることが確認できると思います。
ただし、 CakePHP が結果をマップするために必要な post_id は含まれます。

条件 (*condition*) を定義して、アソシエーションで関連付いた Comment
のデータにフィルタをかけることもできます。 :

``` php
$this->Post->contain('Comment.author = "Daniel"');
$this->Post->find('all');

//or...

$this->Post->find('all', array('contain' => 'Comment.author = "Daniel"'));
```

これにより、投稿 (*post*) とダニエルによるコメントを取得できます。 :

``` text
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
```

深いアソシエーションのフィルタリングでの Containable の使用には重要な注意があります。
前の例で、データベース中に３つの投稿があり、ダニエルがこれらの投稿の２つにコメントした
と仮定します。
\$this-\>Post-\>find('all', array('contain' =\> 'Comment.author = "Daniel"'));
は、ダニエルがコメントした２つの投稿ではなく、全部で３つの投稿を返します。
ダニエルによるコメントを返して欲しいのあって、全ての投稿を返したくはありません。 :

``` text
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
[1] => Array
        (
            [Post] => Array
                (
                    [id] => 2
                    [title] => Second article
                    [content] => bbb
                    [created] => 2008-05-18 00:00:00
                )
            [Comment] => Array
                (
                )
        )
[2] => Array
        (
            [Post] => Array
                (
                    [id] => 3
                    [title] => Third article
                    [content] => ccc
                    [created] => 2008-05-18 00:00:00
                )
            [Comment] => Array
                (
                    [0] => Array
                        (
                            [id] => 22
                            [post_id] => 3
                            [author] => Daniel
                            [email] => dan@example.com
                            [website] => http://example.com
                            [comment] => Another comment
                            [created] => 2008-05-18 00:00:00
                        )
                )
        )
```

コメントによって投稿をフィルタリングしたい場合、例えばダニエルによってコメントされた
投稿のみを取得したいなら、最も簡単な方法は、ダニエルによってコメントされた全ての
コメントとそれに含まれる投稿を検索することです。 :

``` php
$this->Comment->find('all', array(
    'conditions' => 'Comment.author = "Daniel"',
    'contain' => 'Post'
));
```

標準の [Model Find](../../models/retrieving-your-data#model-find) オプションを指定することで、追加のフィルタリングは
動作します。 :

``` php
$this->Post->find('all', array('contain' => array(
    'Comment' => array(
        'conditions' => array('Comment.author =' => "Daniel"),
        'order' => 'Comment.created DESC'
    )
)));
```

深く複雑なモデルのリレーションがある時に `ContainableBehavior` を使用する例は
以下のようになります。

モデル間のアソシエーションは次のようになっているとします。 :

``` text
User->Profile
User->Account->AccountSummary
User->Post->PostAttachment->PostAttachmentHistory->HistoryNotes
User->Post->Tag
```

上記のアソシエーションにおいて Containable を使った検索は次のように行います。 :

``` php
$this->User->find('all', array(
    'contain' => array(
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
```

メインのモデルで `contain` キーは一度しか使わないことに留意してください。
関連したモデルで再度「contain」を使う必要はありません。

> [!NOTE]
> 'fields' と 'contain' オプションを使う場合は、クエリが直接的あるいは
> 間接的に使う外部キーを含めるよう注意してください。また、Containable
> ビヘイビアは、この機能を使って出力を抑制するモデルの全てに付与しなければ
> なりません。そのため、AppModel で Containable ビヘイビアを付与することを
> 検討すべきかもしれないということも留意してください。

## ContainableBehavior オプション

`ContainableBehavior` は、モデルにビヘイビアを追加する際にセットする
いつかのオプションを持っています。この設定は、Containable の振る舞いを
微調整し、他のビヘイビアとの動作を容易にします。

- **recursive** (boolean, optional) true を設定することで、
  指定したモデルを取得するために必要な再帰的レベルを自動的に判定して含めることが
  できます。この機能を無効にする場合は、 false を設定してください。
  デフォルトの値は `true` です。
- **notices** (boolean, optional)
  不正な Containable の呼び出しがあった場合、E_NOTICES を発生させます。
  デフォルトの値は `true` です。
- **autoFields**: (boolean, optional) 要求されたテーブル結合を
  取得するために必要なフィールドを自動的に追加します。
  デフォルトの値は `true` です。
- **order**: (string, optional) 含まれる要素をソートするための並び順。

以下は、投稿を最終更新日で並び替える例です。 :

``` php
$this->User->find('all', array(
    'contain' => array(
        'Profile',
        'Post' => array(
            'order' => 'Post.updated DESC'
        )
    )
));
```

[ビヘイビア](../../models/behaviors) (ビヘイビアの使用) にある通り、
ContainableBehavior の設定は、ビヘイビアの再割り当てによって
実行時に変更することができます。

ContainableBehavior は、他のビヘイビアや GROUP BY 構文などの集計機能を
使用した問い合わせが元で問題を起こすことがあります。集計されたフィールドと
そうでないフィールドが混在して不正な SQL エラーが起こった場合、
`autoFields` 設定を無効化してみてください。 :

``` php
$this->Post->Behaviors->load('Containable', array('autoFields' => false));
```

### ページネーションでの Containable 使用

`$paginate` プロパティに 'contain' パラメータを追加することによって、
モデルに対して find('count') と find('all') の両方が適用されます。

詳しくは、 [Using Containable](#using-containable) セクションをご覧ください。

以下は、ページネーション時にアソシエーションを行う方法の例です。 :

``` php
$this->paginate['User'] = array(
    'contain' => array('Profile', 'Account'),
    'order' => 'User.username'
);

$users = $this->paginate('User');
```

> [!NOTE]
> モデルを通してアソシエーションを含んでいた場合、Containable の
> [recursive オプション](#containablebehavior-options) は効きません。
> 例えば、モデルの recursive に -1 をセットした場合、ビヘイビアは働きません。 :
>
> ``` bash
> $this->User->recursive = -1;
> $this->User->contain(array('Profile', 'Account'));
>
> $users = $this->paginate('User');
> ```
