REST
####

最近のアプリケーションプログラマの多くは、たくさんのユーザに対してコアとなる機能を開放することの重要性を実感しています。コア
API
へ自由なアクセスが簡単に行えるなら、そのアプリケーションは多くの人に受け入れられるでしょうし、マッシュアップや他のシステムとの連携もしやすくなるでしょう。

REST
はアプリケーション中のロジックへの容易なアクセスを提供する便利な方法です。他にも方法はありますが、
REST はとてもシンプルです。 SOAP エンベロープに比べると非常に簡潔な XML
を用いてデータのやりとりを行い、制御は HTTP ヘッダで行います。 CakePHP
において REST を用いた API の公開は簡単に行えます。

単純なセットアップ
==================

REST を起動して実行するための最も早い方法は、 app/config にある
routes.php に、必要な行を加えることです。「Router」オブジェクトの
mapResources() メソッドを呼び出すと、 REST
でコントローラにアクセスするルートの初期状態を変更できます。たとえば
recipe データベースに REST
で接続できるようにするには、次のような記述をします。

::

    // app/config/routes.php の中で次のコードを書く
        
    Router::mapResources('recipes');
    Router::parseExtensions();

最初の行で、 REST
によるアクセスのルートの状態を設定しています。設定したルートは HTTP
リクエストメソッドに応じたものになっています。

+-----------------+----------------+----------------------------------+
| HTTP メソッド   | URL            | 起動するコントローラアクション   |
+=================+================+==================================+
| GET             | /recipes       | RecipesController::index()       |
+-----------------+----------------+----------------------------------+
| GET             | /recipes/123   | RecipesController::view(123)     |
+-----------------+----------------+----------------------------------+
| POST            | /recipes       | RecipesController::add()         |
+-----------------+----------------+----------------------------------+
| PUT             | /recipes/123   | RecipesController::edit(123)     |
+-----------------+----------------+----------------------------------+
| DELETE          | /recipes/123   | RecipesController::delete(123)   |
+-----------------+----------------+----------------------------------+
| POST            | /recipes/123   | RecipesController::edit(123)     |
+-----------------+----------------+----------------------------------+

CakePHP の Router クラスは、何の HTTP
メソッドが使われているのかを判断するために、いくつかの情報を使います。優先度が高い順に次のようになります。

#. POST 変数の *\_method* 。
#. X\_HTTP\_METHOD\_OVERRIDE
#. REQUEST\_METHOD ヘッダ

POST 変数の *\_method* は、 REST
のクライアントとしてブラウザ(もしくは簡単に POST
が実行できるクライアント)を利用する時に便利です。 \_method の値に HTTP
リクエストメソッドの種類を入れれば、その HTTP
メソッドをエミュレートすることができます。

router で REST
リクエストをコントローラアクションにマップしたら、そのコントローラアクションを実装していきましょう。基本的なコントローラの構造は次のようになるでしょう。

::

    // controllers/recipes_controller.php

    class RecipesController extends AppController {

        var $components = array('RequestHandler');

        function index() {
            $recipes = $this->Recipe->find('all');
            $this->set(compact('recipes'));
        }

        function view($id) {
            $recipe = $this->Recipe->findById($id);
            $this->set(compact('recipe'));
        }

        function edit($id) {
            $this->Recipe->id = $id;
            if ($this->Recipe->save($this->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }

        function delete($id) {
            if($this->Recipe->del($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    }

Router::parseExtensions() の呼び出しを追加しているので、 CakePHP の
router
はすでに、異なる種類のリクエストに基づき通常とは異なるビューを出力するようになっています。
REST でのりクエストを実行すると、ビューのタイプは XML になります。
RecipesController のためのビューは app/views/xml
の中に設置しましょう。これらのビューの中で XmlHelper
を用いると、簡単にすばやく XML
を出力することができます。ビューのコードは次のようになります。

::

    // app/views/recipes/xml/index.ctp

    <recipes>
        <?php echo $xml->serialize($recipes); ?>
    </recipes>

賢明な CakePHP ユーザー諸氏の中には、 RecipesController の $helpers
配列に XmlHelper
が含まれていないことにお気づきの方もいるかもしれません。これは意図的にそうしています。
parseExtension() を使って特殊なコンテンツタイプのデータを出力するとき、
CakePHP は自動的に最適なビューヘルパーを探し出すのです。 XML
型のコンテンツを出力するときは、ビューに XmlHelper
が自動的に読み込まれます。

構築される XML は次のようなものになるでしょう。

::

    <posts>
        <post id="234" created="2008-06-13" modified="2008-06-14">
            <author id="23423" first_name="Billy" last_name="Bob"></author>
            <comment id="245" body="This is a comment for this post."></comment>
        </post>   
        <post id="3247" created="2008-06-15" modified="2008-06-15">
            <author id="625" first_name="Nate" last_name="Johnson"></author>
            <comment id="654" body="This is a comment for this post."></comment>
        </post>
    </posts>

edit
アクションの作成では注意する点があります。大したことはありませんが、少しややこしいのです。
REST を使うと XML を出力するわけですから、入力も XML
で行うことが自然です。しかし心配しないでください。 RequestHandler と
Router クラスによって XML での入力を簡単に扱えます。 POST あるいは PUT
リクエストが XML 型のコンテンツを持つ場合、その入力値は CakePHP の Xml
オブジェクトのインスタンスに渡されます、インスタンスはコントローラにおける
$data
変数のプロパティに登録されます。この機能により、コントローラやモデルのコードを変更することなく、
XML と POST
のデータを違和感なく同時に扱うことができます。必要なデータは、
$this->data の中にあるのです。

独自の REST ルーティング
========================

もし mapResources()
によって作られたルートの初期設定値が用途にそぐわなかったら、
Router::connect() を使って独自の REST ルートを定義してください。
connect() メソッドには、与えられた URL
に対していくつかの異なるオプションを定義します。一つ目のパラメータは、
URL
自身で、二つ目のパラメータはそれらのオプションを提供します。三つ目のパラメータは、指定された
URL の中で CakePHP
がある特定のマーカーを見つけるために指定する正規表現です。

その他の REST
の目的に応じたルートを仕立てる方法を、例で示します。ここでは、
mapResources() を使わずに REST のルートを編集しています。

::

    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9+]")
    )

より進んだルーティングのテクニックは他のところで説明されているので、ここでは特に重要な点である第二引数の配列の
[method]
キーについて説明します。このキーの値がセットされると、その値で指定した
HTTP リクエストメソッドの時だけ定義されたルートが機能します。 HTTP
リクエストメソッドには GET 、 DELETE やその他のものも指定できます。
