例外(Exception)
###############

例外(Exception) はあなたのアプリケーションの中で、さまざまな用途で使うことができるものです。
CakePHP ではロジックの間違いや誤用を指し示すのに内部的に例外を使っています。
CakePHP が発生させるすべての例外は :php:exc:`CakeException` を継承しており、
この基底クラスを継承したクラス／タスク固有の例外が存在します。

CakePHP はまた、HTTP エラーで使うことのできる数多くの例外クラスを提供します。
詳細は :ref:`built-in-exceptions` のセクションを参照してください。

例外の設定
==========

例外の設定として使えるキーがいくつかあります::

    Configure::write('Exception', array(
        'handler' => 'ErrorHandler::handleException',
        'renderer' => 'ExceptionRenderer',
        'log' => true
    ));

* ``handler`` - callback - 例外をハンドルするコールバック。無名関数を含め、
  どんなコールバックタイプでも設定可能。
* ``renderer`` - string - キャッチされなかった例外をレンダリングする役目を担うクラス。
  独自のクラスを使う場合には、app/Lib/Error の下にそのクラスのファイルを置いてください。
  このクラスは ``render()`` メソッドを実装している必要があります。
* ``log`` - boolean - true を指定したなら、例外とそのスタックトレースが CakeLog に出力されます。
* ``consoleHandler`` - callback - コンソールで実行された場合に、例外をハンドルするのに使われる
  コールバック。未定義なら、CakePHP のデフォルトハンドラが使われます。

例外のレンダリングはデフォルトでは HTML ページですが、設定を変更することでハンドラもしくはレンダラを
カスタマイズできます。ハンドラを変更した場合は例外のハンドルプロセスを完全に制御することができ、
一方、レンダラを変更した場合は、出力する形式や内容を簡単に変更できます。
こうして、アプリケーション固有の例外ハンドリングを組み込むことができるのです。

.. versionadded:: 2.2
    ``Exception.consoleHandler`` オプションは 2.2 で追加されました。

例外クラス
==========

CakePHP には多くの例外クラスが存在します。
旧来の ``cakeError()`` によるエラーメッセージはそれぞれの例外に置き代わっています。
例外は、継承したり、ロジックを組み込んだりという柔軟さも提供してくれます。
組み込みの例外ハンドリングでは、キャッチされなかった例外をどんなものであれキャッチし、
有益な情報を表示します。400番台のコードを特に使わない例外なら、
Internal Server Error として扱われます。

.. _built-in-exceptions:

CakePHP の組み込み例外
======================

内部的なフレームワーク例外の他にも、CakePHP 内部の組み込み例外で、
HTTP 方式の例外がいくつか存在します。

.. php:exception:: BadRequestException

    400 Bad Request エラーを発生させるために使います。

.. php:exception:: UnauthorizedException

    401 Unauthorized エラーを発生させるために使います。

.. php:exception:: ForbiddenException

    403 Forbidden エラーを発生させるために使います。

.. php:exception:: NotFoundException

    404 Not found エラーを発生させるために使います。

.. php:exception:: MethodNotAllowedException

    405 Method Not Allowed エラーを発生させるために使います。

.. php:exception:: InternalErrorException

    500 Internal Server Error を発生させるために使います。

.. php:exception:: NotImplementedException

    501 Not Implemented Errors を発生させるために使います。

あなたのコントローラが失敗のステータスや HTTP エラーを示すために、これらの例外を投げることができます。
下記は、見つからなかったものがある場合の、 404 ページをレンダリングする HTTP 例外の使用例です::

    public function view($id) {
        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException('この Post は見つかりませんでした');
        }
        $this->set('post', $post);
    }

HTTP エラー用の例外を使うことで、あなたのコードを奇麗に保つことができ、RESTful なレスポンスを
クライアントのアプリケーションとユーザに返すことができるのです。

また、次に挙げるフレームワーク層の例外を使うこともできます。これらは CakePHP コアコンポーネントの
多くから投げられているものです。

.. php:exception:: CakeException

    CakePHP での例外の基底クラスです。CakePHP によって投げられるフレームワーク層のすべての
    例外はこのクラスを継承しています。

これらの例外クラスはすべて :php:exc:`CakeException` を継承しています。
CakeException を継承することで、独自の 'フレームワーク' エラーを作ることができます。
CakePHP が投げる標準的な例外もすべて、CakeException を継承しています。

.. versionadded:: 2.3
    CakeBaseException が追加されました。

.. php:exception:: CakeBaseException

    CakePHP での例外の基底クラスです。
    前述の CakeExceptions と HttpExceptions はすべて、このクラスを継承しています。

.. php:method:: responseHeader($header = null, $value = null)

    :php:func:`CakeResponse::header()` を参照してください。

HTTP 例外と CakePHP 例外はすべて、CakeBaseException クラスを継承しており、このクラスはレスポンスに
ヘッダーを加えるメソッドを持っています。405 MethodNotAllowedException を投げる場合について例を
挙げると、RFC2616 ではこう言っています：
「レスポンスは、要求されたリソースへの正しいメソッドのリストを含む Allow ヘッダーを含有していなければ【なりません】。」

.. php:exception:: MissingViewException

    選ばれた view ファイルが見つかりません。

.. php:exception:: MissingLayoutException

    選ばれた layout が見つかりません。

.. php:exception:: MissingHelperException

    ヘルパーが見つかりません。

.. php:exception:: MissingBehaviorException

    設定で指定された behavior が見つかりません。

.. php:exception:: MissingComponentException

    設定で指定されたコンポーネントが見つかりません。

.. php:exception:: MissingTaskException

    設定で指定されたタスクが見つかりません。

.. php:exception:: MissingShellException

    Shell クラスが見つかりません。

.. php:exception:: MissingShellMethodException

    選択された Shell クラスにこの名前のメソッドはありません。

.. php:exception:: MissingDatabaseException

    設定で指定されたデータベースが見つかりません。

.. php:exception:: MissingConnectionException

    モデルのコネクションが見つかりません。

.. php:exception:: MissingTableException

    CakePHP のキャッシュ、もしくはデータソースからモデルのテーブルが見つかりません。
    データソースに新しいテーブルを追加した上で、モデルのキャッシュ
    (デフォルトでは tmp/cache/models 以下にある) を削除しなければなりません。

.. php:exception:: MissingActionException

    要求されたコントローラのアクションが見つかりません。

.. php:exception:: MissingControllerException

    要求されたコントローラが見つかりません。

.. php:exception:: PrivateActionException

    private なアクションにアクセスしています。 private や protected、_ で始まるアクションに
    アクセスしているか、prefix されたルートに誤ってアクセスしようとしています。

コントローラでの HTTP 例外の使用
================================

コントローラのアクションから失敗を示すために、 HTTP 関連のどの例外でも投げることができます。例::

    public function view($id) {
        $post = $this->Post->read(null, $id);
        if (!$post) {
            throw new NotFoundException();
        }
        $this->set(compact('post'));
    }

上記の例では、 :php:exc:`NotFoundException` をキャッチし、処理するために設定してある
``Exception.handler`` が呼び出されることになります。
これは、デフォルトではエラーページが生成され、例外がログに出力されます。

.. _error-views:

例外のレンダラ
==============

.. php:class:: ExceptionRenderer(Exception $exception)

ExceptionRenderer クラスは ``CakeErrorController`` を活用して、あなたのアプリケーションから
投げられるすべての例外について、エラーページのレンダリングを処理します。

エラーページの view は ``app/View/Errors/`` に置きます。4xx、5xx エラー用の view ファイルは
それぞれ ``error400.ctp`` 、 ``error500.ctp`` が使われます。
必要に応じてこれらをカスタマイスすることができます。デフォルトでは、``app/Layouts/default.ctp`` が
エラーページにも使われます。もし別のレイアウト、例えば ``app/Layouts/my_error.ctp`` を
独自のエラーページとして使いたいという場合は、単純に、それらのエラー view を編集して、`
``error400.ctp`` と ``error500.ctp`` に ``$this->layout = 'my_error';`` のステートメントを
加えてください。

フレームワーク層の例外はそれぞれ、自身の view ファイルをコアテンプレートの中に持っていますが、
それらは開発時にのみ使われるものですから、カスタマイズを思い悩む必要はまったくありません。
デバッグモードが OFF の場合は、フレームワーク層の例外はすべて ``InternalErrorException`` に
変換されます。

.. index:: application exceptions

独自のアプリケーション例外を作成する
====================================

組み込みの `SPL 例外 <https://secure.php.net/manual/ja/spl.exceptions.php>`_ 、 ``Exception``
そのもの、 :php:exc:`CakeException` のいずれかを使って独自のアプリケーション例外を作ることが
できます。Exception や SPL 例外を継承したアプリケーション例外は本番モードでは 500 エラーとして
扱われます。 :php:exc:`CakeException` は特別で、 :php:exc:`CakeException` のオブジェクトは
すべて、扱うコードに応じて 500 か 404 のどちらかのエラーを強制されます。開発モードでは、
:php:exc:`CakeException` のオブジェクトは単純にクラス名と一致する新しいテンプレートを必要とし、
これにて有益な情報を提供します。独自のアプリケーション次の例外が含まれていたなら::

    class MissingWidgetException extends CakeException {};

``app/View/Errors/missing_widget.ctp`` を作成することにより、素晴らしい開発用エラーを
提供させられます。本番モードでは、上記のエラーは 500 エラーとして扱われます。
継承元の :php:exc:`CakeException` のコンストラクタにデータのハッシュマップを渡すことができます。
それらのハッシュマップは messageTemplate の中にも、開発モードでエラーを表示するのに使われる
view の中にも、付け加えられます。これにより、あなたのエラーによりたくさんのコンテキストを
提供することで、豊富なデータを持つ例外を作ることができるのです。また、ネイティブな ``__toString()``
メソッドで通常で使われることになるメッセージテンプレートを提供することができます::

    class MissingWidgetException extends CakeException {
        protected $_messageTemplate = '%s が見つかりません。';
    }

    throw new MissingWidgetException(array('widget' => 'Pointy'));

組み込みの例外ハンドラでこれがキャッチされると、あなたのエラー view テンプレート内で変数
``$widget`` の値を得ることができます。また、例外を string にキャストしたり、例外の
``getMessage()`` メソッドを使ったりした場合は、 ``Pointy が見つかりません。`` が得られます。
これにより、CakePHP が内部的に使っているのと同じように、簡単に素早く、独自のリッチな開発用エラーが
作成できるのです。

独自のステータスコードを作成する
--------------------------------

例外を生成する際にコードを変えることで、独自の HTTP ステータスコードを作成することができます::

    throw new MissingWidgetHelperException('それはここではありません', 501);

上記ではレスポンスコード ``501`` を作成します。好きな HTTP ステータスコードを使うことができます。
開発モードで、あなたの例外が特にテンプレートを持っておらず、 ``500`` 以上のコードを使うなら、
``error500`` テンプレートが使われることなります。その他のコードの場合は ``error400`` テンプレートが
使われることになります。あなたの独自例外にエラーテンプレートを定義している場合は、開発モードなら
そのテンプレートが使われることになります。本番モードでも、あなた独自の例外にロジックを
ハンドリングさせたいなら、次のセクションを参照してください。

あなた独自の例外ハンドラの継承と実装
====================================

アプリケーション固有の例外ハンドラを実装する方法はいくつかあります。
方法により、例外ハンドリング処理の制御できる範囲に違いがあります。

- ``Configure::write('Exception.handler', 'YourClass::yourMethod');`` をセットする方法。
- ``AppController::appError()`` を作成する方法。
- ``Configure::write('Exception.renderer', 'YourClass');`` をセットする方法。

次のいくつかのセクションでは、さまざまな方法とそれらが持つメリットについて詳しく説明します。

`Exception.handler` を使って独自の例外ハンドラを作成する
========================================================

あなた独自の例外ハンドラを作成すれば、例外ハンドリング処理のすべてを完全に制御できるようになります。
選択したクラスは、あなたの ``app/Config/bootstrap.php`` でロードすべきものですので、
どんな例外でもハンドリングすることができます。どのようなコールバックタイプでも定義することができます。
``Exception.handler`` をセットすることにより、CakePHP は他のすべての例外設定を無視します。
独自の例外ハンドリングをセットアップする場合は次のようになります::

    // app/Config/core.php の中で
    Configure::write('Exception.handler', 'AppExceptionHandler::handle');

    // app/Config/bootstrap.php の中で
    App::uses('AppExceptionHandler', 'Lib');

    // app/Lib/AppExceptionHandler.php の中で
    class AppExceptionHandler {
        public static function handle($error) {
            echo 'Oh noes! ' . $error->getMessage();
            // ...
        }
        // ...
    }

``handleException`` の中ではどのようなコードでも走らせることができます。
上記の例では単純に「Oh noes! 」＋例外のメッセージを表示しています。例外ハンドラは
どのようなコールバックタイプでも（PHP 5.3 を使っているなら無名関数でも）定義することができます::

    Configure::write('Exception.handler', function ($error) {
        echo 'Ruh roh ' . $error->getMessage();
    });

独自の例外ハンドラを作成することで、アプリケーション例外についての独自のエラーハンドリングを
提供することができます。例外ハンドラとして提供されるメソッド内で、下記のようにすることができます::

    // app/Lib/AppErrorHandler.php の中で
    class AppErrorHandler {
        public static function handleException($error) {
            if ($error instanceof MissingWidgetException) {
                return self::handleMissingWidget($error);
            }
            // その他、各種処理
        }
    }

.. index:: appError

AppController::appError() を使う
================================

独自の例外ハンドラを実装する代わりに、このメソッドを実装します。
これはそもそも下位互換のためのものであり、新しいアプリケーション用としては推奨されません。
このコントローラのメソッドは、デフォルトの例外レンダリングの代わりに呼ばれます。
唯一の引数には投げられた例外が渡されます。
このメソッドの中で独自のエラーハンドリングを実装します::

    class AppController extends Controller {
        public function appError($error) {
            // ここに独自ロジックを書きます。
        }
    }

Exception.renderer を使って独自のレンダラを使用し、アプリケーション例外をハンドリングする
=========================================================================================

例外ハンドリングの制御はしたくないが、例外のレンダリングについては変更したいのならば、
``Configure::write('Exception.renderer', 'AppExceptionRenderer');`` を使うことで、
例外ページをレンダリングするクラスを選択することができます。デフォルトでは、
:php:class`ExceptionRenderer` が使われます。独自の例外レンダラクラスは
``app/Lib/Error`` の中に置いてください。もしくは、bootstrap にて指定された
Lib のパスの中にある、 ``Error`` ディレクトリ内に置いてください。
独自の例外レンダリングクラスの中であなたはアプリケーション固有のエラーに特化したハンドリングを
提供することができます::

    // app/Lib/Error/AppExceptionRenderer.php の中で
    App::uses('ExceptionRenderer', 'Error');

    class AppExceptionRenderer extends ExceptionRenderer {
        public function missingWidget($error) {
            echo 'おっと、widget が見つかりません！';
        }
    }

上記の例では、``MissingWidgetException`` 型のすべての例外をハンドリングし、
独自の表示／ハンドリングロジックをそれら例外のために提供できます。
例外ハンドリングメソッドはハンドリングする例外を引数で受け取ります。

.. note::

    独自のレンダラはそのコンストラクタ内での例外を予期すべきであり、レンダリングメソッドを
    実装すべきです。そうしていない場合、さらなる別のエラーが発生してしまいます。

.. note::

    独自の ``Exception.handler`` を使っているなら、その実装の中でそれを参照していない限り、
    この設定は何の効果もありません。

例外をハンドリングする独自のコントローラを作成する
--------------------------------------------------

あなたの ExceptionRenderer のサブクラス内で ``_getController`` メソッドを使うことで、
あなたのエラーをハンドリングする独自のコントローラを返すことができます。
エラーがいつも確実に表示されるように通常のコールバックをいくつか削除している
``CakeErrorController`` を CakePHP はデフォルトで使います。
しかしながら、あなたのアプリケーション内では独自のエラーハンドリングがもっと必要になるかもしれません。
あなたの ``AppExceptionRenderer`` クラス内で ``_getController`` を実装することにより、
好きなコントローラを使うことができます::

    class AppExceptionRenderer extends ExceptionRenderer {
        protected function _getController($exception) {
            App::uses('SuperCustomErrorController', 'Controller');
            return new SuperCustomErrorController();
        }
    }

別の方法として、コアの  CakeErrorController を単に書き換えて ``app/Controller`` の
下に置くということができます。エラーハンドリング用の独自コントローラを使う場合は、
必要なセットアップをあなたのコンストラクタ内かレンダリングメソッド内ですべて行えているか
よく確認してください。それらは組み込みの ``ErrorHandler`` クラスが直接呼び出す唯一の
方法となるからです。

例外のログ出力
--------------

あなたの core.php で ``Exception.log`` に true をセットすることで、組み込みの例外ハンドリングを
使って ErrorHandler が扱うすべての例外をログに出力することができます。これを有効にすることで、
すべての例外が :php:class:`CakeLog` と設定で指定された logger に出力されることになります。

.. note::

    独自の ``Exception.handler`` を使っているなら、その実装の中でそれを参照していない限り、
    この設定は何の効果もありません。

.. meta::
    :title lang=ja: Exceptions
    :keywords lang=ja: uncaught exceptions,stack traces,logic errors,anonymous functions,renderer,html page,error messages,flexibility,lib,array,cakephp,php
