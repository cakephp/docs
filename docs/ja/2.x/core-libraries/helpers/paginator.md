# PaginatorHelper

`class` **PaginatorHelper**(View $view, array $settings = array())

ページ制御ヘルパーは、ページ番号や次ページへ／前ページへのリンクといった、
ページ制御関連の出力を行なうもので、`PaginatorComponent`
と組合せて使います。

ページ制御を組み込んだデータセットの作成や、ページ制御関連のクエリーについての詳細は
[ページ制御](../../core-libraries/components/pagination) を参照してください。

## ソートリンクの作成

`method` PaginatorHelper::**sort**($key, $title = null, $options = array())

ソート用のリンクを作成します。ソートと方向のための、名前付きまたはクエリー
文字列パラメーターをセットします。リンクはデフォルトでは昇順にソートされます。
`sort()` によって生成されたリンクは最初にクリックされた後、クリック
のたびに自動的に方向を転換します。リンクのソート順のデフォルトは 'asc' です。
結果セットが指定されたキーにより 'asc' ソートされている場合、返されたリンクは
'desc' でソートします。

`$options` で使えるキー:

- `escape` コンテンツ内の HTML エンティティをエンコードするかどうか。
  デフォルトは true。

- `model` 使用するモデル。デフォルトは `PaginatorHelper::defaultModel()`

- `direction` リンクが非アクティブの時に適用するデフォルトのソート順

- `lock` ソート順をロック（固定）するかどうか。
  デフォルトのソート順にのみ適用されます。デフォルトは false 。

  ::: info Added in version 2.5
  lock オプションを true にすることで、ソート順を指定されたものに固定できるようになりました。
  :::

ここで複数の投稿 (*post*) をページ制御していて、今１ページ目にいるとすると:

``` php
echo $this->Paginator->sort('user_id');
```

出力結果:

``` html
<a href="/posts/index/page:1/sort:user_id/direction:asc/">User Id</a>
```

title パラーメーターを使って、リンクに付けるカスタムテキストを作ることもできます。 :

``` php
echo $this->Paginator->sort('user_id', 'User account');
```

出力結果:

``` html
<a href="/posts/index/page:1/sort:user_id/direction:asc/">User account</a>
```

リンクに対して HTML のような画像を使っている場合は、エスケープを off にする必要があります。 :

``` php
echo $this->Paginator->sort(
  'user_id',
  '<em>User account</em>',
  array('escape' => false)
);
```

出力結果:

``` html
<a href="/posts/index/page:1/sort:user_id/direction:asc/">
  <em>User account</em>
</a>
```

direction オプションでリンクのデフォルトのソート順を設定できます。
一度リンクがアクティブになると、自動的にソート順は通常に戻ります。 :

``` php
echo $this->Paginator->sort('user_id', null, array('direction' => 'desc'));
```

出力結果:

``` html
<a href="/posts/index/page:1/sort:user_id/direction:desc/">User Id</a>
```

lock オプションでソート順を指定された順に固定できます。 :

``` php
echo $this->Paginator->sort('user_id', null, array('direction' => 'asc', 'lock' => true));
```

`method` PaginatorHelper::**sortDir**(string $model = null, mixed $options = array())

`method` PaginatorHelper::**sortKey**(string $model = null, mixed $options = array())

## ページ番号のリンクを作成する

`method` PaginatorHelper::**numbers**($options = array())

ページ番号の並びを返します。モジュールを使って、現在のページの前後
何ページまでを表示するのかを決めます。デフォルトでは、
現在のページのいずれかの側で最大８個までのリンクが作られます。
ただし存在しないページは作られません。現在のページもリンクにはなりません。

サポートされているオプションは以下の通りです。

- `before` 数字の前に挿入されるコンテンツ

- `after` 数字の後に挿入されるコンテンツ

- `model` その番号を作る元になるモデル。デフォルトは
  `PaginatorHelper::defaultModel()`

- `modulus` 現在のページの左右いずれかで何個インクルードするか。

- デフォルトは 8。

- `separator` コンテンツの区切り。デフォルトは `|`

- `tag` リンクを囲むタグ。デフォルトは 'span'。

- `first` 先頭ページヘのリンクは無条件に作られますが、先頭から何ページ
  分を作るかを整数で指定します。デフォルトは false です。文字列を指定すると、
  その文字列をタイトルの値として先頭ページへのリンクを生成します。 :

  ``` php
  echo $this->Paginator->numbers(array('first' => 'First page'));
  ```

- `last` 最終ページヘのリンクを生成したい場合、最後から何ページ分を
  作るかを整数で定義します。デフォルトは false です。'first' オプションと
  同じロジックに従います。 `~PaginatorHelper::last()`\`
  を使って別々に定義することも可能です。

- `ellipsis` 省略されていることを表す文字列。デフォルトは '...' です。

- `class` タグをラッピングするのに使うクラス名。

- `currentClass` 現在の／アクティブのリンクに使うクラス名。
  デフォルトは *current* です。

- `currentTag` 現在のページ番号として使うタグ。デフォルトは null です。
  これを使うと、現在のページ番号に対して追加の 'a' または 'span'
  でタグ付けされた、たとえばツイッターの Bootstrap ライクなリンクを
  生成できます。

このメソッドを使えば出力の多くをカスタマイズできますが、
一切パラメーターを指定せずにコールしても問題ありません。 :

``` php
echo $this->Paginator->numbers();
```

first と last オプションを使って先頭ページと最終ページへのリンクを作れます。
以下の例ではページ制御された結果セットの中の、先頭から２ページと末尾から
２ページのリンクを含むページリンクの並びを生成します。 :

``` php
echo $this->Paginator->numbers(array('first' => 2, 'last' => 2));
```

::: info Added in version 2.1
`currentClass` オプションは 2.1 で追加されました。
:::

::: info Added in version 2.3
`currentTag` オプションは 2.3 で追加されました。
:::

## ジャンプ用リンクを作成する

特定のページ番号に直接行けるリンクを作れるだけでなく、現在の直前や直後、
および先頭や末尾へのリンクを作りたくなる場合もあるでしょう。

`method` PaginatorHelper::**prev**($title = '<< Previous', $options = array(), $disabledTitle = null, $disabledOptions = array())

::: info Changed in version 2.3
`PaginatorHelper::prev()` と `PaginatorHelper::next()`メソッドについて、 `tag` オプションを `false` にすることでラッパーを無効にすることができますが、2.3 から新しい `disabledTag` が追加されました。`$disabledOptions` が無指定の場合 `$options` パラメーターが使われます。これで、どちらも同じ値を指定する場合のタイピング量が減らせます。
:::

`method` PaginatorHelper::**next**($title = 'Next >>', $options = array(), $disabledTitle = null, $disabledOptions = array())

`method` PaginatorHelper::**first**($first = '<< first', $options = array())

`method` PaginatorHelper::**last**($last = 'last >>', $options = array())

`method` PaginatorHelper::**current**(string $model = null)

`method` PaginatorHelper::**hasNext**(string $model = null)

`method` PaginatorHelper::**hasPrev**(string $model = null)

`method` PaginatorHelper::**hasPage**(string $model = null, integer $page = 1)

## ページカウンターの生成

`method` PaginatorHelper::**counter**($options = array())

ページ制御された結果セットのためのカウンター文字列を返します。
与えられた書式文字列と多くのオプションを使って、ページ制御された
結果セットの中の位置を表す、ローカライズされたアプリケーション固有の
文字列を生成します。

`counter()` には多くのオプションがあります。
サポートされているのは以下のものです。

- `format` カウンターの書式。サポートされている書式は 'range', 'pages'
  およびカスタムです。pages のデフォルトは '1 of 10' のような出力です。
  カスタムモードでは与えられた文字列がパースされ、トークンが実際の値に
  置き換えられます。利用できるトークンは以下の通りです。

  - `{:page}` - 表示された現在のページ
  - `{:pages}` - 総ページ数
  - `{:current}` - 表示されようとしている現在のレコード数
  - `{:count}` - 結果セットの中の全レコード数
  - `{:start}` - 表示されようとしている先頭のレコード数
  - `{:end}` - 表示されようとしている最終のレコード数
  - `{:model}` - モデル名を複数名にして読みやすい書式にしたもの。
    あなたのモデルが 'RecipePage' であれば、 `{:model}` は
    'recipe pages' になります。このオプションは 2.0 で追加されました。

  counter メソッドに対して利用できるトークンを使って、単なる文字列を
  与えることもできます。たとえば以下のような感じです。 :

  ``` php
  echo $this->Paginator->counter(
      '{:page} / {:pages} ページ, {:current} 件目 / 全 {:count} 件,
       開始レコード番号 {:start}, 終了レコード番号 {:end}'
  );
  ```

  range に対して 'format' を設定すると '1 - 3 of 13' のように出力します。 :

  ``` php
  echo $this->Paginator->counter(array(
      'format' => 'range'
  ));
  ```

- `separator` 実際のページとページ数の間の区切り文字。デフォルトは
  ' of ' です。これは 'format' = 'pages' と組み合わせて使われます。
  これは 'format' のデフォルト値です。 :

  ``` php
  echo $this->Paginator->counter(array(
      'separator' => ' of a total of '
  ));
  ```

- `model` ページ制御する対象のモデル。デフォルトは
  `PaginatorHelper::defaultModel()` 。これは 'format'
  オプションのカスタム文字列と組み合わせて使われます。

## PaginatorHelper が使うオプションを変更する

`method` PaginatorHelper::**options**($options = array())

Paginatorヘルパーのすべてのオプションを設定します。
サポートされているオプションは以下の通りです。

- `url` ページ制御アクションの URL 。
  'url' にはサブオプションがいくつかあります。

  - `sort` レコードをソートする際のキー。
  - `direction` ソート順。デフォルトは 'ASC' です。
  - `page` 表示するページ番号。

  上記の例で出てきたオプションは、特定のページやソート順を強制するのに
  使えます。このヘルパーで生成された URL に対して、追加的な URL
  コンテンツを追加できます。 :

  ``` php
  $this->Paginator->options(array(
      'url' => array(
          'sort' => 'email', 'direction' => 'desc', 'page' => 6,
          'lang' => 'en'
      )
  ));
  ```

  この例では、ヘルパーが生成するリンク全てに経路パラメーター 'en'
  を追加します。また指定されたソートキー、ソート順、ページ番号で
  リンクを生成します。デフォルトでは、 PaginatorHelper は現在の
  パスと名前のついたパラメーターすべてをマージします。そのため、
  ビューファイル内でこれらのことを行なう必要がなくなります。

- `escape` リンクの title フィールドを HTML エスケープするかどうかを
  指定します。デフォルトは true です。

- `update` AJAX の pagination 呼び出しの結果を使って更新する、要素の
  CSS セレクター。指定されない場合は通常のリンクが作成されます。 :

  ``` php
  $this->Paginator->options(array('update' => '#content'));
  ```

  これは [Ajax Pagination](../../core-libraries/helpers/js#ajax-pagination) する場合に便利です。update の値は CSS
  セレクターであればどんなものでも構いませんが、id セレクターが最もよく
  使われ、かつシンプルです。

- `model` ページ制御対象のモデル。デフォルトは
  `PaginatorHelper::defaultModel()` です。

### ページ制御に GET パラメーターを使う

CakePHP のページ制御では通常 [Named Parameters](../../development/routing#named-parameters) を使いますが、代わりに
GET パラメーターを使いたいケースもあります。この機能に関する主な設定
オプションは `PaginatorComponent` にありますが、ビューの中で
追加の制御を行うことが可能です。 `options()` を使って変換したい名前付き
パラメーターを指定できます。 :

``` php
$this->Paginator->options(array(
  'convertKeys' => array('your', 'keys', 'here')
));
```

### PaginatorHelper を設定して JavaScript ヘルパーを使う

デフォルトでは `PaginatorHelper` は `JsHelper` を使って AJAX
機能を実現します。しかし、これを使わずに AJAX リンクに対してカスタムヘルパー
を使いたい場合は、コントローラーにある `$helpers` 配列を変更します。
`paginate()` が動いた後、以下の処理を行います。 :

``` php
// コントローラーの中で
$this->set('posts', $this->paginate());
$this->helpers['Paginator'] = array('ajax' => 'CustomJs');
```

これにより AJAX 操作を行なう `PaginatorHelper` が `CustomJs` を使うように
変更されます。なお 'ajax' キーにはどんなヘルパーを指定しても構いませんが、
そのクラスは `HtmlHelper::link()` のような振る舞いを行なう `link()`
メソッドを実装していなければなりません。

## ビューにおけるページ制御

ユーザーに対してどのようにレコードを表示するのかは自由に決められますが、
一般には HTML テーブルにより行われます。以下の例ではテーブルレイアウトを
前提にしていますが、ビューの中で利用可能な PaginatorHelper が、そのように
機能を制限されているわけではありません。

詳細は API の中の
[PaginatorHelper](https://api.cakephp.org/2.x/class-PaginatorHelper.html)
を参照してください。なお前述のように PaginatorHelper ではソート機能を提供
してますので、これをテーブルの見出しの中に簡単に組み込めるようになっています。

``` php
// app/View/Posts/index.ctp
<table>
    <tr>
        <th><?php echo $this->Paginator->sort('id', 'ID'); ?></th>
        <th><?php echo $this->Paginator->sort('title', 'Title'); ?></th>
    </tr>
       <?php foreach ($data as $recipe): ?>
    <tr>
        <td><?php echo $recipe['Recipe']['id']; ?> </td>
        <td><?php echo h($recipe['Recipe']['title']); ?> </td>
    </tr>
    <?php endforeach; ?>
</table>
```

`PaginatorHelper` の `sort()` メソッドから出力されるリンクにより、
ユーザーはテーブルの見出しをクリックしてその項目によるデータのソートを
切り替えることができます。

アソシエーションをベースにしてカラムをソートすることもできます。

``` html
<table>
    <tr>
        <th><?php echo $this->Paginator->sort('title', 'Title'); ?></th>
        <th><?php echo $this->Paginator->sort('Author.name', 'Author'); ?></th>
    </tr>
       <?php foreach ($data as $recipe): ?>
    <tr>
        <td><?php echo h($recipe['Recipe']['title']); ?> </td>
        <td><?php echo h($recipe['Author']['name']); ?> </td>
    </tr>
    <?php endforeach; ?>
</table>
```

ビューにおけるページ制御の表示に関する最後のネタは、これも
PaginationHelper で提供されるページナビゲーションの追加です。 :

``` php
// ページ番号を表示する
echo $this->Paginator->numbers();

// 次ページと前ページのリンクを表示する
echo $this->Paginator->prev(
  '< Previous',
  null,
  null,
  array('class' => 'disabled')
);
echo $this->Paginator->next(
  'Next >',
  null,
  null,
  array('class' => 'disabled')
);

// 現在のページ番号 / 全ページ数 を表示する
echo $this->Paginator->counter();
```

counter() メソッドによる説明文の表示についても、
特殊なマーカーによりカスタマイズできます。 :

``` php
echo $this->Paginator->counter(array(
    'format' => 'ページ {:page} / {:pages}, 全 {:count} レコード中の
    {:current} レコードを表示中, 先頭レコード {:start}, 末尾 {:end}'
));
```

## その他のメソッド

`method` PaginatorHelper::**link**($title, $url = array(), $options = array())

`method` PaginatorHelper::**url**($options = array(), $asArray = false, $model = null)

`method` PaginatorHelper::**defaultModel**()

`method` PaginatorHelper::**params**(string $model = null)

`method` PaginatorHelper::**param**(string $key, string $model = null)

::: info Added in version 2.4
`param()` メソッドは 2.4 で追加されました。
:::

`method` PaginatorHelper::**meta**(array $options = array())

::: info Added in version 2.6
`meta()` メソッドは 2.6 で追加されました。
:::
