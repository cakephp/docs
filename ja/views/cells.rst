ビューセル
##########

ビューセルはビュー処理やテンプレート出力を実行できる小さな小さなコントローラーです。
セルのアイディアは `Ruby のセル <https://github.com/apotonick/cells>`_ から拝借したもので、
同様の役割と目的を果たします。

セルを使う時
============

セルは、モデルとの対話、ビュー処理、および出力処理を必要とする、再利用可能なページ部品を
構築するのに理想的です。単純な例はオンライン店舗の買い物かご、あるいは CMS のデータ駆動型の
ナビゲーションメニューなどになるでしょう。

セルの作成
==========

セルを作成するには、 **src/View/Cell** にクラスを、 **src/Template/Cell/** にテンプレートを
定義します。この例では、ユーザーの通知受信トレイにいくつかのメッセージを表示するために
セルを作ることにします。まず、クラスファイルを作ります。中身はこのようになります。 ::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell
    {

        public function display()
        {
        }

    }

このファイルを **src/View/Cell/InboxCell.php** に保存します。ご覧の通り、 CakePHP
の他のクラスと同様に、セルはいくつかの規約を持っています。

* セルは ``App\View\Cell`` 名前空間に置かれます。もしプラグインの中でセルを作るのであれば、
  その名前空間は ``PluginName\View\Cell`` になります。
* クラス名は Cell で終わらなければなりません。
* クラスは ``Cake\View\Cell`` を継承しなければなりません。

私たちのセルには空の ``display()`` メソッドを追加しましたが、これはセルを描画する時の
規約上の既定のメソッドです。この文書の後ろで、他のメソッドの使い方についても扱います。
さて、ファイル **src/Template/Cell/Inbox/display.ctp** を作成しましょう。
これは、私たちの新しいセルのためのテンプレートになります。

``bake`` を使って手早くこのスタブコードを生成することもできます。 ::

    bin/cake bake cell Inbox

これは私たちが打ったコードを生成してくれるでしょう。

セルの実装
----------

ユーザー同士で互いにメッセージを送りあえるアプリケーションを開発しているとしましょう。
私たちは ``Messages`` モデルを持っていて、そして AppController を汚さずに
未読メッセージの数を表示したいとします。これはまさにセルを使用するケースです。
先ほど作ったクラスに、以下を追加します。 ::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell
    {

        public function display()
        {
            $this->loadModel('Messages');
            $unread = $this->Messages->find('unread');
            $this->set('unread_count', $unread->count());
        }

    }

セルは ``ModelAwareTrait`` と ``ViewVarsTrait`` を使用しているため、コントローラーに
とてもよく似たふるまいをします。コントローラー中とまったく同じように、 ``loadModel()``
や ``set()`` メソッドを使うことができます。テンプレートファイルの中に、
以下を追加します。 ::

    <!-- src/Template/Cell/Inbox/display.ctp -->
    <div class="notification-icon">
        未読メッセージが <?= $unread_count ?> 件あります。
    </div>

.. note::

    セルのテンプレートは分離したスコープを持っていて、現在のコントローラーのアクション
    または他のセル用のテンプレートやレイアウトを描画するのに使われたビューのインスタンスを
    共有しません。したがって、アクションのテンプレートやレイアウト中でのヘルパーの呼び出し
    あるいはブロックのセットなどには気付きません。

セルの呼び出し
==============

セルは ``cell()`` メソッドを使ってビューから呼び出すことができて、下のいずれのコンテキストでも
同様に動きます。 ::

    // アプリケーションのセルの呼び出し
    $cell = $this->cell('Inbox');

    // プラグインのセルの呼び出し
    $cell = $this->cell('Messaging.Inbox');

上記は当該の名前のセルを呼び出して、その ``display()`` メソッドを実行します。
以下のようにして、他のメソッドを実行することもできます。 ::

    // Inbox セル上の expanded() メソッドを実行します
    $cell = $this->cell('Inbox::expanded');

もしもリクエスト中でどのセルを呼び出すかを決定するためのコントローラー処理が必要な場合、
コントローラー中で ``cell()`` メソッドを有効にするために ``CellTrait``
を使用することができます。 ::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\View\CellTrait;

    class DashboardsController extends AppController
    {
        use CellTrait;

        // 他のコード。
    }

セルに引数を渡す
----------------

セルをより柔軟にするために、パラメーター付きのセルのメソッドが必要になることも多いでしょう。
添字付きの配列として ``cell()`` の第二、第三引数を使用することで、アクションのパラメーターや、
追加のオプションをセルクラスに渡すことができます。 ::

    $cell = $this->cell('Inbox::recent', ['-3 days']);

上記は以下ような関数の定義になるでしょう。 ::

    public function recent($since)
    {
    }

ビューの描画
============

セルが呼び出されて実行された後は、おそらくそれを描画したいはずです。セルを描画するための
最も簡単な方法はそれエコーすることです。 ::

    <?= $cell ?>

これはアクション名を小文字にしてアンダースコアー区切りにしたものに一致するテンプレートを
描画します。例えば **display.ctp** です。

セルはテンプレートを描画するために ``View`` を使用しますので、もし必要であれば
セルのテンプレートの中で追加のセルを呼び出すこともできます。

.. note::

    セルをエコーすると PHP のマジックメソッド ``__toString()`` を使用するため
    致命的なエラーが発生した際にファイル名や行番号を表示するのを抑制してしまいます。
    意味のあるエラーメッセージを得るためには、例えば ``<?= $cell->render() ?>``
    のようにして、 ``Cell::render()`` メソッドを使用することを推奨します。

別のテンプレートの描画
----------------------

規約ではセルは実行するアクションに一致するテンプレートを描画します。
もし、異なるビューテンプレートを描画する必要があれば、セルを描画する時に
使用するテンプレートを指定することができます。 ::

    // 明示的に render() を呼び出します
    echo $this->cell('Inbox::recent', ['-3 days'])->render('messages');

    // セルをエコーする前にテンプレートを設定します。
    $cell = $this->cell('Inbox');
    $cell->template = 'messages';
    echo $cell;

セルの出力のキャッシュ
----------------------

もしも出力内容が頻繁には変わらない、あるいはアプリケーションのパフォーマンス向上のために、
セルを描画する際にその出力をキャッシュしたいかもしれません。キャッシュを有効にする、あるいは
設定するために、セルを作成する時に ``cache`` オプションを定義することができます。 ::

    // 既定の設定と生成キーを使用してキャッシュします
    $cell = $this->cell('Inbox', [], ['cache' => true]);

    // 特定のキャッシュ設定と生成キーでキャッシュします
    $cell = $this->cell('Inbox', [], ['cache' => ['config' => 'cell_cache']]);

    // 使用するキーと設定を指定します。
    $cell = $this->cell('Inbox', [], [
        'cache' => ['config' => 'cell_cache', 'key' => 'inbox_' . $user->id]
    ]);

キーが生成される場合には、そのクラスとテンプレートの名前をアンダースコアー区切りにしたものが
使用されます。

.. note::

    各セルを描画するために新しい ``View`` インスタンスが作成され、それらの新しいオブジェクトは
    メインのテンプレート／レイアウトとはコンテキストを共有しません。各セルは内包されていて、
    ``View::cell()`` の呼び出しの引数として渡された変数にのみアクセスが可能です。


セル内のデータのページ制御
=============================

ページ制御された結果セットを描画するセルを作成するには、ORM の ``Paginator`` クラスを利用します。
ユーザーのお気に入りメッセージをページ制御する例は次のようになります。 ::

    namespace App\View\Cell;

    use Cake\View\Cell;
    use Cake\Datasource\Paginator;

    class FavoritesCell extends Cell
    {
        public function display($user)
        {
            $this->loadModel('Messages');

            // paginator の作成
            $paginator = new Paginator();

            // モデルをページ制御
            $results = $paginator->paginate(
                $this->Messages,
                $this->request->getQueryParams(),
                [
                    // パラメーター付きカスタムファインダーを使用
                    'finder' => ['favorites' => [$user]],

                    // スコープ指定のクエリー文字列パラメーターを使用
                    'scope' => 'favorites',
                ]
            );
            $this->set('favorites', $results);
        }
    }

上記のセルは、 :ref:`スコープ指定のページ制御パラメーター <paginating-multiple-queries>`
を使用して ``Messages`` モデルをページ制御します。

.. versionadded:: 3.5.0
    ``Cake\Datasource\Paginator`` は 3.5.0 で追加されました。
