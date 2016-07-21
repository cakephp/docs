PaginatorHelper
###############

.. php:class:: PaginatorHelper(View $view, array $settings = array())

ページ制御ヘルパーは、ページ番号や次ページへ／前ページへのリンクといった、
ページ制御関連の出力を行なうもので、:php:class:`PaginatorComponent`
と組合せて使います。

ページ制御を組み込んだデータセットの作成や、ページ制御関連のクエリーについての詳細は
:doc:`/core-libraries/components/pagination` を参照してください。

ソートリンクの作成
==================

.. php:method:: sort($key, $title = null, $options = array())

    :param string $key: ソートしたいレコードセットのキーの名前。
    :param string $title: リンクのタイトル。$title が null の場合は $key
        の語尾変化 (inflection) したものがタイトル用として使われます。
    :param array $options: ソートリンク用のオプション。

ソート用のリンクを作成します。ソートと方向のための、名前付きまたはクエリー
文字列パラメーターをセットします。リンクはデフォルトでは昇順にソートされます。
``sort()`` によって生成されたリンクは最初にクリックされた後、クリック
のたびに自動的に方向を転換します。リンクのソート順のデフォルトは 'asc' です。
結果セットが指定されたキーにより 'asc' ソートされている場合、返されたリンクは
'desc' でソートします。

``$options`` で使えるキー:

* ``escape`` コンテンツ内の HTML エンティティをエンコードするかどうか。
  デフォルトは true。
* ``model`` 使用するモデル。デフォルトは :php:meth:`PaginatorHelper::defaultModel()`
* ``direction`` リンクが非アクティブの時に適用するデフォルトのソート順
* ``lock`` ソート順をロック（固定）するかどうか。
  デフォルトのソート順にのみ適用されます。デフォルトは false 。

  .. versionadded:: 2.5
    lock オプションを true にすることで、
    ソート順を指定されたものに固定できるようになりました。

ここで複数の投稿 (*post*) をページ制御していて、今１ページ目にいるとすると::

    echo $this->Paginator->sort('user_id');

出力結果:

.. code-block:: html

    <a href="/posts/index/page:1/sort:user_id/direction:asc/">User Id</a>

title パラーメーターを使って、リンクに付けるカスタムテキストを作ることもできます。 ::

    echo $this->Paginator->sort('user_id', 'User account');

出力結果:

.. code-block:: html

    <a href="/posts/index/page:1/sort:user_id/direction:asc/">User account</a>

リンクに対して HTML のような画像を使っている場合は、エスケープを off にする必要があります。 ::

    echo $this->Paginator->sort(
      'user_id',
      '<em>User account</em>',
      array('escape' => false)
    );

出力結果:

.. code-block:: html

    <a href="/posts/index/page:1/sort:user_id/direction:asc/">
      <em>User account</em>
    </a>

direction オプションでリンクのデフォルトのソート順を設定できます。
一度リンクがアクティブになると、自動的にソート順は通常に戻ります。 ::

    echo $this->Paginator->sort('user_id', null, array('direction' => 'desc'));

出力結果:

.. code-block:: html

    <a href="/posts/index/page:1/sort:user_id/direction:desc/">User Id</a>

lock オプションでソート順を指定された順に固定できます。 ::

    echo $this->Paginator->sort('user_id', null, array('direction' => 'asc', 'lock' => true));

.. php:method:: sortDir(string $model = null, mixed $options = array())

    ソートされているレコードセットのソート順を取得します。

.. php:method:: sortKey(string $model = null, mixed $options = array())

    ソートされているレコードセットのソートキーを取得します。

ページ番号のリンクを作成する
============================

.. php:method:: numbers($options = array())

ページ番号の並びを返します。モジュールを使って、現在のページの前後
何ページまでを表示するのかを決めます。デフォルトでは、
現在のページのいずれかの側で最大８個までのリンクが作られます。
ただし存在しないページは作られません。現在のページもリンクにはなりません。

サポートされているオプションは以下の通りです。

* ``before`` 数字の前に挿入されるコンテンツ
* ``after`` 数字の後に挿入されるコンテンツ
* ``model`` その番号を作る元になるモデル。デフォルトは
  :php:meth:`PaginatorHelper::defaultModel()`
* ``modulus`` 現在のページの左右いずれかで何個インクルードするか。
* デフォルトは 8。
* ``separator`` コンテンツの区切り。デフォルトは `` | ``
* ``tag`` リンクを囲むタグ。デフォルトは 'span'。
* ``first`` 先頭ページヘのリンクは無条件に作られますが、先頭から何ページ
  分を作るかを整数で指定します。デフォルトは false です。文字列を指定すると、
  その文字列をタイトルの値として先頭ページへのリンクを生成します。 ::

      echo $this->Paginator->numbers(array('first' => 'First page'));

* ``last`` 最終ページヘのリンクを生成したい場合、最後から何ページ分を
  作るかを整数で定義します。デフォルトは false です。'first' オプションと
  同じロジックに従います。 :php:meth:`~PaginatorHelper::last()``
  を使って別々に定義することも可能です。
* ``ellipsis`` 省略されていることを表す文字列。デフォルトは '...' です。
* ``class`` タグをラッピングするのに使うクラス名。
* ``currentClass`` 現在の／アクティブのリンクに使うクラス名。
  デフォルトは *current* です。
* ``currentTag`` 現在のページ番号として使うタグ。デフォルトは null です。
  これを使うと、現在のページ番号に対して追加の 'a' または 'span'
  でタグ付けされた、たとえばツイッターの Bootstrap ライクなリンクを
  生成できます。

このメソッドを使えば出力の多くをカスタマイズできますが、
一切パラメーターを指定せずにコールしても問題ありません。 ::

    echo $this->Paginator->numbers();

first と last オプションを使って先頭ページと最終ページへのリンクを作れます。
以下の例ではページ制御された結果セットの中の、先頭から２ページと末尾から
２ページのリンクを含むページリンクの並びを生成します。 ::

    echo $this->Paginator->numbers(array('first' => 2, 'last' => 2));

.. versionadded:: 2.1
    ``currentClass`` オプションは 2.1 で追加されました。

.. versionadded:: 2.3
    ``currentTag`` オプションは 2.3 で追加されました。

ジャンプ用リンクを作成する
==========================

特定のページ番号に直接行けるリンクを作れるだけでなく、現在の直前や直後、
および先頭や末尾へのリンクを作りたくなる場合もあるでしょう。

.. php:method:: prev($title = '<?= __('<< previous') ?>', $options = array(), $disabledTitle = null, $disabledOptions = array())

    :param string $title: リンクのタイトル
    :param mixed $options: ページ制御用リンクのオプション
    :param string $disabledTitle: リンクが無効になっている場合のタイトル
        たとえばすでに先頭ページにいて、その前のページがないなど。
    :param mixed $disabledOptions: 無効状態のページ制御用リンクのオプション

    ページ制御されたレコードセットの中で、１つ前のページへのリンクを作ります。

    ``$options`` と ``$disabledOptions`` は以下のキーをサポートしています。

    * ``tag`` タグをラッピングするタグ。デフォルトは 'span' 。
      これを ``false`` にすると、このオプションを無効にします。
    * ``escape`` コンテンツの HTML エンティティをエンコードするかどうか。
      デフォルトは true です。
    * ``model`` 使用するモデル。デフォルトは :php:meth:`PaginatorHelper::defaultModel()` 。
    * ``disabledTag`` １つ前のページがない場合にタグの代わりに使うタグ。

    単純な例を以下に示します。 ::

        echo $this->Paginator->prev(
          ' << ' . __('previous'),
          array(),
          null,
          array('class' => 'prev disabled')
        );

    もし投稿の２ページ目にいる場合は、以下のような出力になります。

    .. code-block:: html

        <span class="prev">
          <a rel="prev" href="/posts/index/page:1/sort:title/order:desc">
            <?= __('<< previous') ?>
          </a>
        </span>

    これより前のページがない場合は、以下のようになります。

    .. code-block:: html

        <span class="prev disabled"><?= __('<< previous') ?></span>

    ``tag`` オプションによりラッピング用のタグを変更できます。 ::

        echo $this->Paginator->prev(__('previous'), array('tag' => 'li'));

    出力結果:

    .. code-block:: html

        <li class="prev">
          <a rel="prev" href="/posts/index/page:1/sort:title/order:desc">
            previous
          </a>
        </li>

    ラッピングタグを付けないようにもできます。 ::

        echo $this->Paginator->prev(__('previous'), array('tag' => false));

    出力結果:

    .. code-block:: html

        <a class="prev" rel="prev"
          href="/posts/index/page:1/sort:title/order:desc">
          previous
        </a>

.. versionchanged:: 2.3
    :php:meth:`PaginatorHelper::prev()` と :php:meth:`PaginatorHelper::next()`
    メソッドについて、 ``tag`` オプションを ``false`` にすることで
    ラッパーを無効にすることができますが、2.3 から新しい ``disabledTag`` が
    追加されました。

    ``$disabledOptions`` が無指定の場合 ``$options`` パラメーターが使われます。
    これで、どちらも同じ値を指定する場合のタイピング量が減らせます。

.. php:method:: next($title = 'Next >>', $options = array(), $disabledTitle = null, $disabledOptions = array())

    このメソッドは :php:meth:`~PagintorHelper::prev()` と全く同じですが、
    いくつか例外があります。これは直前のページではなく直後のページヘの
    リンクを作ります。また rel 属性には ``prev`` の代わりに ``next``
    を使います。

.. php:method:: first($first = '<< first', $options = array())

    先頭ページまたは先頭ページまでの一連の数字を返します。文字列が渡されると、
    その文字列をラベルとする先頭ページへのリンクのみが生成されます。 ::

        echo $this->Paginator->first('< first');

    この例は先頭ページヘの単一のリンクを作成します。最初のページにいる場合は
    何も出力しません。先頭から何ページ分の並びを生成したいかを、
    整数で指定することもできます。 ::

        echo $this->Paginator->first(3);

    この例では、３ページ目またはそれより先にいる場合、先頭から３ページ目までの
    リンクを生成します。それ以降の分は生成されません。

    options パラメーターには以下の設定が可能です。

    - ``tag`` タグをラッピングするのに使うタグ。デフォルトは 'span' 。
    - ``after`` リンクやタグの後に挿入するテキスト
    - ``model`` 使用するモデル。デフォルトは :php:meth:`PaginatorHelper::defaultModel()` 。
    - ``separator`` 生成されたリンクの間に置くテキスト。デフォルトは ' | ' 。
    - ``ellipsis`` 省略を表すテキスト。デフォルトは '...' 。

.. php:method:: last($last = 'last >>', $options = array())

    このメソッドはちょうど :php:meth:`~PaginatorHelper::first()` メソッドのような
    動きをしますが、少し異なるところがあります。もし ``$last`` の文字列値が表す
    最終ページにいる場合は何も生成しません。 ``$last`` が整数値の場合、ユーザが
    最後から last ページ以内に範囲内に入った場合はリンクを生成しません。

.. php:method:: current(string $model = null)

    与えられたモデルについて、レコードセットの現在ページを返します。 ::

        // 現在の場所: http://example.com/comments/view/page:3
        echo $this->Paginator->current('Comment');
        // 出力は 3

.. php:method:: hasNext(string $model = null)

    与えられた結果セットが最終ページでない場合に真を返します。

.. php:method:: hasPrev(string $model = null)

    与えられた結果セットが先頭ページでない場合に真を返します。

.. php:method:: hasPage(string $model = null, integer $page = 1)

    与えられた結果セットが ``$page`` が示すページ番号を含む場合に真を返します。

ページカウンターの生成
======================

.. php:method:: counter($options = array())

ページ制御された結果セットのためのカウンター文字列を返します。
与えられた書式文字列と多くのオプションを使って、ページ制御された
結果セットの中の位置を表す、ローカライズされたアプリケーション固有の
文字列を生成します。

``counter()`` には多くのオプションがあります。
サポートされているのは以下のものです。

* ``format`` カウンターの書式。サポートされている書式は 'range', 'pages'
  およびカスタムです。pages のデフォルトは '1 of 10' のような出力です。
  カスタムモードでは与えられた文字列がパースされ、トークンが実際の値に
  置き換えられます。利用できるトークンは以下の通りです。

  -  ``{:page}`` - 表示された現在のページ
  -  ``{:pages}`` - 総ページ数
  -  ``{:current}`` - 表示されようとしている現在のレコード数
  -  ``{:count}`` - 結果セットの中の全レコード数
  -  ``{:start}`` - 表示されようとしている先頭のレコード数
  -  ``{:end}`` - 表示されようとしている最終のレコード数
  -  ``{:model}`` - モデル名を複数名にして読みやすい書式にしたもの。
     あなたのモデルが 'RecipePage' であれば、 ``{:model}`` は
     'recipe pages' になります。このオプションは 2.0 で追加されました。

  counter メソッドに対して利用できるトークンを使って、単なる文字列を
  与えることもできます。たとえば以下のような感じです。 ::

      echo $this->Paginator->counter(
          '{:page} / {:pages} ページ, {:current} 件目 / 全 {:count} 件,
           開始レコード番号 {:start}, 終了レコード番号 {:end}'
      );

  range に対して 'format' を設定すると '1 - 3 of 13' のように出力します。 ::

      echo $this->Paginator->counter(array(
          'format' => 'range'
      ));

* ``separator`` 実際のページとページ数の間の区切り文字。デフォルトは
  ' of ' です。これは 'format' = 'pages' と組み合わせて使われます。
  これは 'format' のデフォルト値です。 ::

      echo $this->Paginator->counter(array(
          'separator' => ' of a total of '
      ));

* ``model`` ページ制御する対象のモデル。デフォルトは
  :php:meth:`PaginatorHelper::defaultModel()` 。これは 'format'
  オプションのカスタム文字列と組み合わせて使われます。

PaginatorHelper が使うオプションを変更する
==========================================

.. php:method:: options($options = array())

    :param mixed $options: ページ制御リンクのデフォルトオプション。
       文字列が与えられた場合、更新対象 DOM id の要素として使われます。

Paginatorヘルパーのすべてのオプションを設定します。
サポートされているオプションは以下の通りです。

* ``url`` ページ制御アクションの URL 。 
  'url' にはサブオプションがいくつかあります。

  -  ``sort`` レコードをソートする際のキー。
  -  ``direction`` ソート順。デフォルトは 'ASC' です。
  -  ``page`` 表示するページ番号。

  上記の例で出てきたオプションは、特定のページやソート順を強制するのに
  使えます。このヘルパーで生成された URL に対して、追加的な URL
  コンテンツを追加できます。 ::

      $this->Paginator->options(array(
          'url' => array(
              'sort' => 'email', 'direction' => 'desc', 'page' => 6,
              'lang' => 'en'
          )
      ));

  この例では、ヘルパーが生成するリンク全てに経路パラメーター 'en'
  を追加します。また指定されたソートキー、ソート順、ページ番号で
  リンクを生成します。デフォルトでは、 PaginatorHelper は現在の
  パスと名前のついたパラメーターすべてをマージします。そのため、
  ビューファイル内でこれらのことを行なう必要がなくなります。

* ``escape`` リンクの title フィールドを HTML エスケープするかどうかを
  指定します。デフォルトは true です。

* ``update`` AJAX の pagination 呼び出しの結果を使って更新する、要素の
  CSS セレクター。指定されない場合は通常のリンクが作成されます。 ::

    $this->Paginator->options(array('update' => '#content'));

  これは :ref:`ajax-pagination` する場合に便利です。update の値は CSS
  セレクターであればどんなものでも構いませんが、id セレクターが最もよく
  使われ、かつシンプルです。

* ``model`` ページ制御対象のモデル。デフォルトは
  :php:meth:`PaginatorHelper::defaultModel()` です。

ページ制御に GET パラメーターを使う
-----------------------------------

CakePHP のページ制御では通常 :ref:`named-parameters` を使いますが、代わりに
GET パラメーターを使いたいケースもあります。この機能に関する主な設定
オプションは :php:class:`PaginatorComponent` にありますが、ビューの中で
追加の制御を行うことが可能です。 ``options()`` を使って変換したい名前付き
パラメーターを指定できます。 ::

    $this->Paginator->options(array(
      'convertKeys' => array('your', 'keys', 'here')
    ));

PaginatorHelper を設定して JavaScript ヘルパーを使う
----------------------------------------------------

デフォルトでは ``PaginatorHelper`` は :php:class:`JsHelper` を使って AJAX
機能を実現します。しかし、これを使わずに AJAX リンクに対してカスタムヘルパー
を使いたい場合は、コントローラーにある ``$helpers`` 配列を変更します。
``paginate()`` が動いた後、以下の処理を行います。 ::

    // コントローラーの中で
    $this->set('posts', $this->paginate());
    $this->helpers['Paginator'] = array('ajax' => 'CustomJs');

これにより AJAX 操作を行なう ``PaginatorHelper`` が ``CustomJs`` を使うように
変更されます。なお 'ajax' キーにはどんなヘルパーを指定しても構いませんが、
そのクラスは :php:meth:`HtmlHelper::link()` のような振る舞いを行なう ``link()``
メソッドを実装していなければなりません。

ビューにおけるページ制御
========================

ユーザーに対してどのようにレコードを表示するのかは自由に決められますが、
一般には HTML テーブルにより行われます。以下の例ではテーブルレイアウトを
前提にしていますが、ビューの中で利用可能な PaginatorHelper が、そのように
機能を制限されているわけではありません。

詳細は API の中の
`PaginatorHelper <http://api.cakephp.org/2.8/class-PaginatorHelper.html>`_
を参照してください。なお前述のように PaginatorHelper ではソート機能を提供
してますので、これをテーブルの見出しの中に簡単に組み込めるようになっています。

.. code-block:: php

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

``PaginatorHelper`` の ``sort()`` メソッドから出力されるリンクにより、
ユーザーはテーブルの見出しをクリックしてその項目によるデータのソートを
切り替えることができます。

アソシエーションをベースにしてカラムをソートすることもできます。

.. code-block:: html

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

ビューにおけるページ制御の表示に関する最後のネタは、これも
PaginationHelper で提供されるページナビゲーションの追加です。 ::

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

counter() メソッドによる説明文の表示についても、
特殊なマーカーによりカスタマイズできます。 ::

    echo $this->Paginator->counter(array(
        'format' => 'ページ {:page} / {:pages}, 全 {:count} レコード中の
        {:current} レコードを表示中, 先頭レコード {:start}, 末尾 {:end}'
    ));

その他のメソッド
================

.. php:method:: link($title, $url = array(), $options = array())

    :param string $title: リンクのタイトル
    :param mixed $url: アクションの URL。Router::url() を参照。
    :param array $options: リンクのオプション。キーの一覧は options() を参照。

    ``$options`` で使えるキー:

    * ``update`` 更新したい DOM 要素の ID。AJAX で使えるリンクを生成します。
    * ``escape`` コンテンツの HTML エンティティをエンコードしたいかどうか。
      デフォルトは true。
    * ``model`` 利用するモデル。デフォルトは
      :php:meth:`PaginatorHelper::defaultModel()` 。

    ページ制御パラメーターを使って通常もしくは AJAX リンクを作成します。 ::

        echo $this->Paginator->link('５ページ目、タイトルでソート',
                array('sort' => 'title', 'page' => 5, 'direction' => 'desc'));

    たとえば ``/posts/index`` のビューで生成されるリンクは
    '/posts/index/page:5/sort:title/direction:desc' を指します。

.. php:method:: url($options = array(), $asArray = false, $model = null)

    :param array $options: ページ制御/URL オプション配列。
        ``options()`` や ``link()`` メソッドとしても使われます。
    :param boolean $asArray: URL を配列として返すかどうか。
        デフォルトは false （URI 文字列として返す）です。
    :param string $model: ページ制御をどのモデルに対して行なうか。

    デフォルトでは非標準コンテキスト（たとえば JavaScript 用）で使える、
    完全なページ制御用 URL 文字列を返します。 ::

        echo $this->Paginator->url(array('sort' => 'title'), true);

.. php:method:: defaultModel()

    ページ制御された結果セットのデフォルトモデルを取得します。
    これが null の場合は、ページ制御が初期化されていないことを示します。

.. php:method:: params(string $model = null)

    与えられたモデルの結果セットから、現在のページ制御パラメーターを取得します。 ::

        debug($this->Paginator->params());
        /*
        Array
        (
            [page] => 2
            [current] => 2
            [count] => 43
            [prevPage] => 1
            [nextPage] => 3
            [pageCount] => 3
            [order] =>
            [limit] => 20
            [options] => Array
                (
                    [page] => 2
                    [conditions] => Array
                        (
                        )
                )
            [paramType] => named
        )
        */

.. php:method:: param(string $key, string $model = null)

    与えられたモデルの結果セットから、指定したページ制御パラメーターを取得します。 ::

        debug($this->Paginator->param('count'));
        /*
        (int)43
        */

.. versionadded:: 2.4
    ``param()`` メソッドは 2.4 で追加されました。

.. php:method:: meta(array $options = array())

    ページ制御の結果セットのメタリンクを出力します。 ::

        echo $this->Paginator->meta(); // ５ページ目の出力例
        /*
        <link href="/?page=4" rel="prev" /><link href="/?page=6" rel="next" />
        */

    メタ関数の出力を名前付きブロックに付加することもできます。 ::

        $this->Paginator->meta(array('block' => true));

    true を指定すると "meta" ブロックが使われます。

.. versionadded:: 2.6
    ``meta()`` メソッドは 2.6 で追加されました。


.. meta::
    :title lang=ja: PaginatorHelper
    :description lang=ja: The Pagination helper is used to output pagination controls such as page numbers and next/previous links.
    :keywords lang=ja: paginator helper,pagination,sort,page number links,pagination in views,prev link,next link,last link,first link,page counter
