Paginator
#########

.. php:namespace:: Cake\View\Helper

.. php:class:: PaginatorHelper(View $view, array $config = [])

PaginatorHelper は、ページ番号や次ページへ／前ページへのリンクといった、
ページ制御関連の出力をするために使用されます。これは :php:class:`PaginatorComponent`
と連携して機能します。

ページ制御を組み込んだデータセットの作成や、ページ制御関連のクエリーについての詳細は
:doc:`/controllers/components/pagination` を参照してください。

.. _paginator-templates:

PaginatorHelper テンプレート
============================

内部的に PaginatorHelper は一連のシンプルな HTML テンプレートを使用して
マークアップを生成します。これらのテンプレートを変更して、PaginatorHelper
によって生成された HTML をカスタマイズすることができます。

テンプレートは ``{{var}}`` スタイルのプレースホルダを使います。 ``{{}}``
のまわりに空白を入れないことが重要です。そうしないと置き換えが機能しません。

ファイルからテンプレートをロードする
------------------------------------

コントローラーに PaginatorHelper を追加するとき、'templates'
設定を定義して読み込むテンプレートファイルを定義することができます。
これにより、複数のテンプレートをカスタマイズし、コードを DRY に保つことができます。 ::

    // AppView.php の中で
    public function initialize()
    {
        ...
        $this->loadHelper('Paginator', ['templates' => 'paginator-templates']);
    }

これは **config/paginator-templates.php** にあるファイルをロードします。
ファイルの外観は以下の例を参照してください。 :term:`プラグイン記法`
を使ってプラグインからテンプレートをロードすることもできます。 ::

    // AppView.php の中で
    public function initialize()
    {
        ...
        $this->loadHelper('Paginator', ['templates' => 'MyPlugin.paginator-templates']);
    }

テンプレートが、主となるアプリケーションのものでもプラグインのものでも、
テンプレートファイルは次のようになります。 ::

    return [
        'number' => '<a href="{{url}}">{{text}}</a>',
    ];

実行時にテンプレートを変更する
------------------------------

.. php:method:: setTemplates($templates)

このメソッドを使用すると、実行時に PaginatorHelper で使用されるテンプレートを変更できます。
これは、特定のメソッド呼び出しのテンプレートをカスタマイズする場合に便利です。 ::

    // 現在のテンプレート値を読み込みます
    $result = $this->Paginator->getTemplates('number');
    // 3.4 より前
    $result = $this->Paginator->templates('number');

    // テンプレートを変更します
    $this->Paginator->setTemplates([
        'number' => '<em><a href="{{url}}">{{text}}</a></em>'
    ]);

.. warning::

    パーセント記号 (``%``) を含むテンプレート文字列には特別な注意が必要です。
    この文字の前に ``%%`` のように別のパーセンテージを付ける必要があります。
    なぜなら、内部的なテンプレートは ``sprintf()`` で使われるように変換されているからです。
    例: '<div style="width:{{size}}%%">{{content}}</div>'

テンプレート名
--------------

PaginatorHelper は次のテンプレートを使用します。

- ``nextActive`` next() によって生成されたリンクの有効な状態。
- ``nextDisabled`` next() の無効な状態。
- ``prevActive`` prev() によって生成されたリンクの有効な状態。
- ``prevDisabled`` prev() の無効な状態。
- ``counterRange`` counter() で format == range の場合のテンプレート。
- ``counterPages`` counter() で format == pages の場合のテンプレート。
- ``first`` first() によって生成されたリンクに使用されるテンプレート。
- ``last`` last() によって生成されたリンクに使用されるテンプレート。
- ``number`` numbers() によって生成されたリンクに使用されるテンプレート。
- ``current`` 現在のページで使用されているテンプレート。
- ``ellipsis`` numbers() によって生成された省略記号に使用されるテンプレート。
- ``sort`` 方向のないソートリンクのテンプレート。
- ``sortAsc`` 昇順のソートリンクのテンプレート。
- ``sortDesc`` 降順のソートリンクのテンプレート。


ソートリンクの作成
==================

.. php:method:: sort($key, $title = null, $options = [])

    :param string $key: ソートしたい結果セットのキーの名前。
    :param string $title: リンクのタイトル。$title が null の場合、
         $key の変化 (inflection) したものがタイトル用として使われます。
    :param array $options: ソートリンク用のオプション。

ソート用のリンクを作成します。並べ替えと方向のクエリー文字列パラメーターをセットします。
リンクはデフォルトでは昇順にソートされます。 ``sort()`` で生成されたリンクは
最初のクリックの後、 自動的に方向を切り替えます。
結果セットが指定されたキーにより ‘asc’ にソートされている場合、返されたリンクは
‘desc’ でソートします。

``$options`` で使えるキー:

* ``escape`` コンテンツ内の HTML エンティティーをエンコードするかどうか。 デフォルトは
  ``true`` 。
* ``model`` 使用するモデル。デフォルトは :php:meth:`PaginatorHelper::defaultModel()` 。
* ``direction`` リンクが非アクティブの時に適用するデフォルトのソート順。
* ``lock`` ソート順をロック (固定) するかどうか。 デフォルトのソート順にのみ適用されます。
  デフォルトは ``false`` 。

ここで複数の投稿 (*post*) をページ制御していて、今１ページ目にいるとすると::

    echo $this->Paginator->sort('user_id');

出力結果:

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=asc">User Id</a>

title パラメーターを使って、リンクに付けるカスタムテキストを作ることもできます。 ::

    echo $this->Paginator->sort('user_id', 'User account');

出力結果:

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=asc">User account</a>

リンクに対して HTML のような画像を使っている場合は、エスケープを off にする必要があります。 ::

    echo $this->Paginator->sort(
      'user_id',
      '<em>User account</em>',
      ['escape' => false]
    );

出力結果:

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=asc"><em>User account</em></a>

direction オプションでリンクのデフォルトのソート順を設定できます。
一度リンクがアクティブになると、通常のように自動的にソート順が切り替わります。 ::

    echo $this->Paginator->sort('user_id', null, ['direction' => 'desc']);

出力結果:

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=desc">User Id</a>

lock オプションでソート順を指定された順に固定できます。 ::

    echo $this->Paginator->sort('user_id', null, ['direction' => 'asc', 'lock' => true]);

.. php:method:: sortDir(string $model = null, mixed $options = [])

    ソートされている結果セットのソート順を取得します。

.. php:method:: sortKey(string $model = null, mixed $options = [])

    ソートされている結果セットのソートキーを取得します。

ページ番号リンクの作成
======================

.. php:method:: numbers($options = [])

ページ番号の並びを返します。モジュールを使って、
現在のページの前後 何ページまでを表示するのかを決めます。
デフォルトでは、 現在のページのいずれかの側で最大８個までのリンクが作られます。
ただし存在しないページは作られません。現在のページもリンクにはなりません。

サポートされているオプションは以下の通りです。

* ``before`` 数字の前に挿入されるコンテンツ
* ``after`` 数字の後に挿入されるコンテンツ
* ``model`` その番号を作る元になるモデル。デフォルトは
  :php:meth:`PaginatorHelper::defaultModel()`
* ``modulus`` 現在のページの両側に含める数字の数。
  デフォルトは 8。
* ``first`` 先頭ページへのリンクを生成したい場合、先頭から何ページ分を生成するかを整数で指定します。
  デフォルトは ``false`` です。文字列を指定すると、その文字列をタイトルの値として先頭ページへのリンクを生成します。 ::

      echo $this->Paginator->numbers(['first' => 'First page']);

* ``last`` 最終ページヘのリンクを生成したい場合、最後から何ページ分を生成するかを整数で定義します。
  デフォルトは ``false`` です。 ``first`` オプションと 同じロジックに従います。
  :php:meth:`~PaginatorHelper::last()` メソッドを使って別々に定義することも可能です。

このメソッドを使えば出力の多くをカスタマイズできますが、
一切パラメーターを指定せずにコールしても問題ありません。 ::

    echo $this->Paginator->numbers();

first と last オプションを使って先頭ページと最終ページへのリンクを作れます。
以下の例ではページ制御された結果セットの中の、
先頭から２ページと末尾から２ページのリンクを含むページリンクの並びを生成します。 ::

    echo $this->Paginator->numbers(['first' => 2, 'last' => 2]);

ジャンプ用リンクの作成
======================

特定のページ番号に直接行けるリンクを作れるだけでなく、現在の直前や直後、
および先頭や末尾へのリンクを作りたくなる場合もあるでしょう。

.. php:method:: prev($title = '<< Previous', $options = [])

    :param string $title: リンクのタイトル
    :param mixed $options: ページ制御用リンクのオプション

    ページ制御されたレコードセットの中で、１つ前のページへのリンクを作ります。

    ``$options`` 以下のキーをサポートしています。

    * ``escape`` コンテンツの HTML エンティティーをエンコードするかどうか。
      デフォルトは ``true`` です。
    * ``model`` 使用するモデル。デフォルトは :php:meth:`PaginatorHelper::defaultModel()` 。
    * ``disabledTitle`` リンクが無効な場合に使う文字列。デフォルトは ``$title`` パラメーター。

    単純な例を以下に示します。 ::

        echo $this->Paginator->prev(' << ' . __('previous'));

    もし投稿の２ページ目にいる場合は、以下のような出力になります。

    .. code-block:: html

        <li class="prev">
            <a rel="prev" href="/posts/index?page=1&amp;sort=title&amp;order=desc">
                &lt;&lt; previous
            </a>
        </li>

    これより前のページがない場合は、以下のようになります。

    .. code-block:: html

        <li class="prev disabled"><span>&lt;&lt; previous</span></li>

    このメソッドで使用するテンプレートを変更するには、 :ref:`paginator-templates` を参照してください。

.. php:method:: next($title = 'Next >>', $options = [])

    このメソッドは :php:meth:`~PagintorHelper::prev()` と全く同じですが、
    いくつか例外があります。これは直前のページではなく直後のページヘの
    リンクを作ります。また rel 属性には ``prev`` の代わりに ``next``
    を使います。

.. php:method:: first($first = '<< first', $options = [])

    先頭ページまたは先頭ページまでの一連の数字を返します。文字列が渡されると、
    その文字列をラベルとする先頭ページへのリンクのみが生成されます。 ::

        echo $this->Paginator->first('< first');

    上記の例は先頭ページヘの単一のリンクを作成します。最初のページにいる場合は
    何も出力しません。先頭から何ページ分の並びを生成したいかを、
    整数で指定することもできます。 ::

        echo $this->Paginator->first(3);

    上記の例では、３ページ目またはそれより先にいる場合、先頭から３ページ目までの
    リンクを生成します。それ以降の分は生成されません。

    options パラメーターには以下の設定が可能です。

    - ``model`` 使用するモデル。デフォルトは :php:meth:`PaginatorHelper::defaultModel()` 。
    - ``escape`` テキストをエスケープするかどうか。
      コンテンツに HTML が含まれている場合は ``false`` に設定します。

.. php:method:: last($last = 'last >>', $options = [])

    このメソッドはちょうど :php:meth:`~PaginatorHelper::first()` メソッドのような
    動きをしますが、少し異なるところがあります。もし ``$last`` の文字列値が表す
    最終ページにいる場合は何も生成しません。 ``$last`` が整数値の場合、ユーザーが
    最後から last ページ以内に範囲内に入った場合はリンクを生成しません。

ヘッダーリンクタグの作成
========================

PaginatorHelper を使用すると、ページの ``<head>`` 要素に改行タグを作成できます。 ::

    // 現在のモデルの次ページと前ページのリンクを作成する。
    echo $this->Paginator->meta();

    // 現在のモデルの次ページと前ページ、先頭ページと最終ページのリンクを作成する。
    echo $this->Paginator->meta(['first' => true, 'last' => true]);

.. versionadded:: 3.4.0

    ``first`` と ``last`` オプションは 3.4.0 で追加されました

ページ制御状態の確認
====================

.. php:method:: current(string $model = null)

    与えられたモデルについて、レコードセットの現在ページを返します。 ::

        // 現在の場所: http://example.com/comments/view/page:3
        echo $this->Paginator->current('Comment');
        // 出力は 3

.. php:method:: hasNext(string $model = null)

    与えられた結果セットが最終ページでない場合に ``true`` を返します。

.. php:method:: hasPrev(string $model = null)

    与えられた結果セットが先頭ページでない場合に ``true`` を返します。

.. php:method:: hasPage(string $model = null, integer $page = 1)

    与えられた結果セットが ``$page`` が示すページ番号を含む場合に ``true`` を返します。

.. php:method:: total(string $model = null)

    与えられたモデルの総ページ数を返します。

    .. versionadded:: 3.4.0

ページカウンターの生成
======================

.. php:method:: counter($options = [])

ページ制御された結果セットのためのカウンター文字列を返します。
与えられた書式文字列と多くのオプションを使って、ページ制御された 結果セットの中の位置を表す、
ローカライズされたアプリケーション固有の文字列を生成することができます。

``counter()`` には多くのオプションがあります。 サポートされているのは以下のものです。

* ``format`` カウンターの書式。サポートされている書式は 'range', 'pages' およびカスタムです。
  pages のデフォルトは '1 of 10' のような出力です。
  カスタムモードでは与えられた文字列がパースされ、トークンが実際の値に置き換えられます。
  利用できるトークンは以下の通りです。

  -  ``{{page}}`` - 表示された現在のページ
  -  ``{{pages}}`` - 総ページ数
  -  ``{{current}}`` - 表示されようとしている現在のレコード数
  -  ``{{count}}`` - 結果セットの中の全レコード数
  -  ``{{start}}`` - 表示されようとしている先頭のレコード数
  -  ``{{end}}`` - 表示されようとしている最終のレコード数
  -  ``{{model}}`` - モデル名を複数系にして読みやすい書式にしたもの。
     あなたのモデルが 'RecipePage' であれば、 ``{{model}}`` は 'recipe pages' になります。

  counter メソッドに対して利用できるトークンを使って、文字列だけを与えることもできます。
  たとえば以下のようにできます。 ::

      echo $this->Paginator->counter(
          '{{page}} / {{pages}} ページ, {{current}} 件目 / 全 {{count}} 件,
          開始レコード番号 {{start}}, 終了レコード番号 {{end}}'
      );

  'format' を range に設定すると '1 - 3 of 13' のように出力します。 ::

      echo $this->Paginator->counter([
          'format' => 'range'
      ]);

* ``model`` ページ制御する対象のモデル。デフォルトは
  :php:meth:`PaginatorHelper::defaultModel()` 。
  これは 'format' オプションのカスタム文字列と組み合わせて使われます。

ページ制御 URL の生成
==========================

.. php:method:: generateUrl(array $options = [], $model = null, $full = false)

デフォルトでは、非標準的なコンテキスト（JavaScript など）で使用する
完全なページ制御 URL 文字列を返します。 ::

    echo $this->Paginator->generateUrl(['sort' => 'title']);

制限セレクトボックスコントロールの作成
======================================

.. php:method:: limitControl(array $limits = [], $default = null, array $options = [])

``limit`` クエリーパラメーターを変更するドロップダウンコントロールを作成します。 ::

    // デフォルトを使用
    echo $this->Paginator->limitControl();

    // 必要な limit オプションを定義
    echo $this->Paginator->limitControl([25 => 25, 50 => 50]);

    // カスタム制限と選択されたオプションの設定
    echo $this->Paginator->limitControl([25 => 25, 50 => 50], $user->perPage);

生成されたフォームやコントロールは、変更時に自動的に送信されます。

.. versionadded:: 3.5.0
    ``limitControl()`` メソッドは、3.5.0 で追加されました。

ページ制御オプションの設定
==========================

.. php:method:: options($options = [])

PaginatorHelperのすべてのオプションを設定します。サポートされているオプションは以下の通りです。:

* ``url`` ページ制御アクションの URL 。 ‘url’ にはサブオプションがいくつかあります。:

  -  ``sort`` レコードをソートする際のキー。
  -  ``direction`` ソート順。デフォルトは ‘ASC’ です。
  -  ``page`` 表示するページ番号。

  上記の例で出てきたオプションは、特定のページやソート順を強制するのに使用できます。
  このヘルパーで生成された URL に対して、追加的な URL コンテンツを追加できます。 ::

      $this->Paginator->options([
          'url' => [
              'sort' => 'email',
              'direction' => 'desc',
              'page' => 6,
              'lang' => 'en'
          ]
      ]);

  上記の例では、ヘルパーが生成するリンク全てに経路パラメーター ``en`` を追加します。
  また、指定されたソートキー、ソート順、ページ番号で リンクを生成します。
  デフォルトでは、 PaginatorHelper は現在のパスとクエリーパラメーターすべてをマージします。

* ``escape`` リンクの title フィールドを HTML エスケープするかどうかを指定します。
  デフォルトは ``true`` です。

* ``model`` ページ制御対象のモデル名。デフォルトは
  :php:meth:`PaginatorHelper::defaultModel()` です。

使用例
======

ユーザーに対してどのようにレコードを表示するのかは自由に決められますが、一般的には、HTML テーブルにより行われます。
以下の例ではテーブルレイアウトを前提としていますが、ビューの中で利用可能な PaginatorHelper が、
そのように機能を制限されているわけではありません。

詳細は API の中の `PaginatorHelper <https://api.cakephp.org/3.x/class-Cake.View.Helper.PaginatorHelper.html>`_
を参照してください。なお、前述のように、PaginatorHelper には、テーブルの列ヘッダーに統合できるソート機能もあります。

.. code-block:: php

    <!-- src/Template/Posts/index.ctp -->
    <table>
        <tr>
            <th><?= $this->Paginator->sort('id', 'ID') ?></th>
            <th><?= $this->Paginator->sort('title', 'Title') ?></th>
        </tr>
           <?php foreach ($recipes as $recipe): ?>
        <tr>
            <td><?= $recipe->id ?> </td>
            <td><?= h($recipe->title) ?> </td>
        </tr>
        <?php endforeach; ?>
    </table>

``PaginatorHelper`` の ``sort()`` メソッドから出力されたリンクにより、
ユーザーはテーブルのヘッダーをクリックして、指定されたフィールドによるデータのソートを切り替えることができます。

アソシエーションに基づいて列をソートすることもできます。

.. code-block:: php

    <table>
        <tr>
            <th><?= $this->Paginator->sort('title', 'Title') ?></th>
            <th><?= $this->Paginator->sort('Authors.name', 'Author') ?></th>
        </tr>
           <?php foreach ($recipes as $recipe): ?>
        <tr>
            <td><?= h($recipe->title) ?> </td>
            <td><?= h($recipe->name) ?> </td>
        </tr>
        <?php endforeach; ?>
    </table>

ビューにおけるページ制御の表示に関する最後のネタは、
PaginationHelper によって提供されるページナビゲーションの追加です。 ::

    // ページ番号を表示する
    <?= $this->Paginator->numbers() ?>

    // 次ページと前ページのリンクを表示する
    <?= $this->Paginator->prev('« Previous') ?>
    <?= $this->Paginator->next('Next »') ?>

    // 現在のページ番号 / 全ページ数 を表示する
    <?= $this->Paginator->counter() ?>

counter() メソッドによる文章出力は、特殊なマーカーを使用してカスタマイズできます。 ::

    <?= $this->Paginator->counter([
        'format' => 'ページ {{page}} / {{pages}}, 全 {{count}} レコード中の
                 {{current}} レコードを表示中, 先頭レコード {{start}}, 末尾 {{end}}'
    ]) ?>

.. _paginator-helper-multiple:

複数の結果の改ページ
====================

:ref:`複数のクエリーをページ制御する <paginating-multiple-queries>` 場合は、
ページ設定関連要素を生成するときに ``model`` オプションを設定する必要があります。
``PaginatorHelper`` のすべてのメソッド呼び出しで ``model`` オプションを使用するか、
``options()`` を使用してデフォルトモデルを設定することができます。 ::

    // モデルオプションを渡す
    echo $this->Paginator->sort('title', ['model' => 'Articles']);

    // デフォルトモデルを設定する
    $this->Paginator->options(['defaultModel' => 'Articles']);
    echo $this->Paginator->sort('title');

``model`` オプションを使用すると、 ``PaginatorHelper`` はクエリーがページ制御されたときに定義された ``scope`` を自動的に使用します。

.. versionadded:: 3.3.0
    3.3.0で複数のページ制御が追加されました

.. meta::
    :title lang=ja: PaginatorHelper
    :description lang=ja: PaginatorHelperは、ページ番号や次/前のリンクなどの改ページコントロールを出力するために使用されます。
    :keywords lang=ja: paginator helper,pagination,sort,page number links,pagination in views,prev link,next link,last link,first link,page counter
