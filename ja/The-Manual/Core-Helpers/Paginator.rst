Paginator
#########

Pagination
ヘルパーは、ページ数や次へ/前へリンクのようなページ制御を出力するために使用されます。

詳細は `CakePHPによる作業の定石 —
ページ付け(Pagination) </ja/view/164/pagination>`_ を見てください。

メソッド
========

options($options = array())

-  ページ付けリンクのデフォルトのオプションです。文字列を指定した場合、更新する
   DOM の id 要素として扱われます。キーのリストは #options
   を見てください。

options() は Paginator Helper
のすべてのオプションを設定します。サポートしているオプションは以下になります:

**format**

カウンターの書式。サポートされている書式は、'range' や 'pages'
でデフォルトは custom
です。デフォルトのモードでは、サポートされている文字列がパースされ、トークンは実際の値に置換されます。有効なトークンは以下になります:

-  %page% - 現在表示しているページ
-  %pages% - ページ総数
-  %current% - 表示している現在のレコード数
-  %count% - 結果セットのレコード総数
-  %start% - 表示している最初のレコードの数
-  %end% - 表示している最後のレコードの数

有効なトークンがわかったので、counter()
を使用して返された結果に関するあらゆる情報を表示することができます。たとえば:

::


    echo $paginator->counter(array(
            'format' => 'Page %page% of %pages%, 
                         showing %current% records out of %count% total, 
                         starting on record %start%, ending on %end%'
    )); 

**separator**

実際のページとページ数の間の区切り。デフォルトは、 ' of ' です。これは
format = 'pages' と共に使用されます。

**url**

ページ付けアクションの URL。URL
は同様にいくつかの補助オプションがあります。

-  sort - レコードをソートするためのキー
-  direction - ソートの方向。デフォルトは 'ASC' です。
-  page - 表示するページ数

**model**

ページ付けするモデル名

**escape**

リンク用のタイトルフィールドを HTML
エスケープするかどうか指定する。デフォルトは true です。

**update**

AJAX ページ付け呼び出しの結果で更新する要素の DOM
id。指定しない場合は、通常のリンクが生成されます。

**indicator**

AJAX リクエスト実行中に読み込み中、あるいは動作中として表示される要素の
DOM id。

link($title, $url = array(), $options = array())

-  string $title - リンクのタイトル
-  mixed $url - アクション用の URL。Router::url() を見てください。
-  array $options - リンク用のオプション。キーのリストは options()
   を見てください。

ページ付けのパラメータを使用して通常の、あるいは AJAX
リンクを生成します。

::

    echo $paginator->link('Sort by title on page 5', 
            array('sort' => 'title', 'page' => 5, 'direction' => 'desc'));

``/posts/index``
のビューを作成した場合、'/posts/index/page:5/sort:title/direction:desc'
というリンクの指定を生成するでしょう。
