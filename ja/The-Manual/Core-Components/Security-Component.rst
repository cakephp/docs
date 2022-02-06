セキュリティコンポーネント
##########################

セキュリティ(\ *Security*)コンポーネントを使うと、アプリケーションにさらに堅牢なセキュリティを導入できます。
セキュリティコンポーネントをコントローラの befireFilter() で使うことで
HTTP 認証リクエストを管理することができます。
いくつか設定できるパラメータがあり、これはプロパティと同じ名前のセッタを使うことで直接セットできます。

設定
====

$blackHoleCallback
    何らかの理由により、処理を停止するハンドルやリクエストに対する、コントローラコールバックです。
$requirePost
    POST
    によるリクエストだけで起動させるコントローラのアクションの一覧で定義します。コントローラのアクションを配列で渡すか、全てのアクションを
    POST のみで起動させるために「\*」を渡します。
$requireSecure
    SSL
    接続だけで起動させるアクションの一覧を定義します。コントローラのアクションを配列で渡すか、全てのアクションを
    SSL 接続のみで起動させるために「\*」を渡します。
$requireAuth
    有効な認証キーを必要とするアクションの一覧を定義します。この認証キーはセキュリティコンポーネントによりセットされます。
$requireLogin
    HTTP
    認証のログイン(ベーシック認証またはダイジェスト認証)を必要とするアクションの一覧を定義します。「\*」も指定でき、このコントローラの全てのアクションで
    HTTP 認証が必要となることを意味します。
$loginOptions
    HTTP
    認証のログインリクエストのオプションを指定します。認証タイプと、認証プロセスにおけるコントローラのコールバックをセットします。
$loginUsers
    HTTP 認証のログインで用いる usernames => passwords
    という型の連想配列を指定します。ダイジェスト認証を用いる場合、パスワードは
    MD5 のハッシュ値である必要があります。
$allowedControllers
    現在のコントローラがリクエストを受けることを許可するコントローラ一覧を定義します。これは複数のコントローラ間のリクエストの制御を行う場合に使用します。
$allowedActions
    現在のコントローラのアクションがリクエストを受け付けるアクション一覧を定義します。これは複数のコントローラ間のリクエストの制御を行う場合に使用します。
$disabledFields
    POST
    されたデータをバリデートするときに、無視するフィールドのリストです。値が入っているかどうかにかかわらず、また、フォームの送信が有効であるか否かにかかわらず、その値はバリデートの評価対象になりません。

メソッド
========

requirePost()
-------------

POST による呼び出しだけで起動するアクションをセットします。
複数の引数を渡すことができます。 全てのアクションで POST
が必要なようにするには、引数を何も渡しません。

requireSecure()
---------------

SSL による通信のみで起動できるアクションをセットします。
複数の引数を渡すことができます。 全てのアクションで SSL
による通信が必要なようにするには、引数を何も渡しません。

requireAuth()
-------------

起動するためにセキュリティコンポーネントが生成したトークンを必要とするアクションをセットします。
複数のアクションを引数として渡すことができます。
全てのアクションで有効な認証が必要なようにするには、引数を何も渡しません。

requireLogin()
--------------

HTTP 認証を必要とするアクションをセットします。
複数のアクションを引数として渡すことができます。
全てのアクションで有効な HTTP
認証が必要なようにするには、引数を何も渡しません。

loginCredentials(string $type)
------------------------------

HTTP 認証が成功するかどうかを試します。 $type は HTTP
認証のタイプを指定し、「basic」または「digest」のいずれかを使用できます。
これを空にするか null にすると、両方のタイプで認証を試行します。
もし認証が成功したら、そのユーザ名とパスワードを配列にしたものが返されます。

loginRequest(array $options)
----------------------------

$options 配列で指定されたもので HTTP
認証のリクエストのヘッダに含める文字列を生成します。

$options には一般的に「type」と「realm」が含まれます。 「type」はどの
HTTP 認証メソッドを使用するかを表します。 「realm」のデフォルトは現在の
HTTP サーバ環境のものになります。

parseDigestAuthData(string $digest)
-----------------------------------

HTTP ダイジェスト認証のリクエストを解析します。
もし成功したら、ダイジェスト認証のデータを連想配列として返し、失敗したら
null を返します。

generateDigestResponseHash(array $data)
---------------------------------------

HTTP ダイジェスト認証のレスポンスと比較するためのハッシュを作成します。
$data には SecurityComponent::parseDigestAuthData()
で生成された配列を渡しましょう。

blackHole(object $controller, string $error)
--------------------------------------------

されたくないリクエストを 404
エラーかカスタムしたコールバックで代替します。
コールバックが何も指定されていない場合、リクエストは直ちに終了します。
もしコントローラのコールバックが SecurityComponent::blackHoleCallback
にセットされていたら、それが呼び出され全てのエラーの情報が渡されます。

使い方
======

セキュリティコンポーネントは、一般的にコントローラの beforeFilter()
で使用します。
行いたいセキュリティの制限をここで定義すると、セキュリティコンポーネントは起動時にそれらの制限を有効にします。

::

    <?php
    class WidgetController extends AppController {

        var $components = array('Security');

        function beforeFilter() {
            $this->Security->requirePost('delete');
        }
    }
    ?>

この例では、 delete アクションは POST
リクエストを受け取った場合にのみ起動します。

::

    <?php
    class WidgetController extends AppController {

        var $components = array('Security');

        function beforeFilter() {
            if(isset($this->params[Configure::read('Routing.admin')])){
                $this->Security->requireSecure();
            }
        }
    }
    ?>

この例では管理で用いるルーティングのアクションを全て、 SSL
による接続のみで許可するようにします。

ベーシック HTTP 認証
====================

SecurityComponent は強力な認証機能をいくつか持っています。
場合によって、アプリケーション中のいくつかの機能を `HTTP
ベーシック認証 <https://ja.wikipedia.org/wiki/Basic%E8%AA%8D%E8%A8%BC>`_\ によって保護したいかもしれません。
HTTP 認証がよく使われるものとしては、 REST や SOAP の API
の保護が挙げられます。

このタイプの認証は、ある理由によりベーシックであると言われます。 SSL
を用いない限り、認証のための情報は平文で通信されます。

SecurityComponent を HTTP 認証のために使用することは簡単です。
次のコード例ではセキュリティコンポーネントを組み込み、コントローラの
beforeFilter メソッドに何行か追加しています。

::

    class ApiController extends AppController {
        var $name = 'Api';
        var $uses = array();
        var $components = array('Security');

        function beforeFilter() {
            $this->Security->loginOptions = array(
                'type'=>'basic',
                'realm'=>'MyRealm'
            );
            $this->Security->loginUsers = array(
                'john'=>'johnspassword',
                'jane'=>'janespassword'
            );
            $this->Security->requireLogin();
        }
        
        function index() {
            // 保護されたアプリケーションロジックが続く
        }
    }

SecurityComponent の loginOptions
プロパティでは、ログインがどのようにハンドルされるかを定義するための連想配列を指定します。
これを行うには、 **type** と **basic**
がペアになったものをただ定義するだけです。 **realm**
を定義すると、ログインしようとするユーザにメッセージを表示したり、一つのアプリケーション中で独立した複数の認証(つまり\ *realm*)を持つことができます。

SecurityComponent の loginUsers プロパティはこの realm
に対してアクセスを許可するユーザ名とパスワードを含んだ連想配列を指定します。
先の例では、ユーザの情報を直接コードに書き込んでいますが、認証のための情報をより管理しやすくするためにはモデルを使用すると良いでしょう。

最後に、 requireLogin() について説明します。これは SecurityComponent
にこのコントローラがログインを必要とすることを教えます。
また、上述の例で requirePost()
にメソッドの名前を指定すると、それらのメソッドは保護し他のメソッドは開放するようになります。
