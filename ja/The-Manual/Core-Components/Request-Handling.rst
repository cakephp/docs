リクエストハンドリング
######################

リクエストハンドラ(\ *Request
Handler*)コンポーネントは、アプリケーションに対して行われる HTTP
リクエストに関してさらなる情報を取得するために使用します。リクエストハンドラを使うことで、ファイルの拡張子が有効になっている時にクライアントが受け付けるコンテンツタイプの情報を得て適切なレイアウトを自動的に選択するだけでなく、
Ajax による接続であるかをコントローラに伝えることが出来ます。

デフォルトでは、 RequestHandler は多くの JavaScript ライブラリが使用する
HTTP-X-Requested-With ヘッダに基づき、 Ajax
によるリクエストであるかどうかを自動的に判定します。
Router::parseExtension() と一緒に使うと、 RequestHandler
は自動的にリクエストのタイプにマッチしたレイアウトとビューのファイルに切り替えます。
さらに、リクエストされた拡張子と同じ名前のヘルパーが存在したら、
RequestHandler はコントローラの helpers 配列にそれを加えます。 最後に、
XML について説明します。もしコントローラに XML のデータが POST
された場合、それは自動的に解析されモデルに保存できるデータの形式で
Controller::data に割り当てられます。
リクエストハンドラを使用したい場合は、コントローラの $components
配列にそれを加えてください。

::

    <?php
    class WidgetController extends AppController {
        
        var $components = array('RequestHandler');
        
        // コントローラの残りのコードが次に続く
    }
    ?>

リクエストの情報を取得する
==========================

リクエストハンドラはクライアントとリクエストについての情報を提供する、いくつかのメソッドを持っています。

accepts ( $type = null)

$type には、文字列か配列、または null を割り当てることができます。
文字列を渡した場合、それで指定したコンテンツタイプをクライアントが受け付ける場合、
true が返されます。
配列で定義した場合、それらで指定したコンテンツタイプをクライアントが受け付ける場合、
true が返されます。null
を指定すると、クライアントが受け付けるコンテンツタイプが配列で返されます。例は次のようになります。

::

    class PostsController extends AppController {
        
        var $components = array('RequestHandler');

        function beforeFilter () {
            if ($this->RequestHandler->accepts('html')) {
                // クライアントが HTML(text/html) を受け付ける場合のコードをここに書く
            } elseif ($this->RequestHandler->accepts('xml')) {
                // クライアントが XML を受け付ける場合のコードをここに書く
            }
            if ($this->RequestHandler->accepts(array('xml', 'rss', 'atom'))) {
                // クライアントが XML 、 RSS 、 Atom を受け付ける場合のコードをここに書く
            }
        }
    }

別のリクエスト「型」を判定するメソッドは次のようになります。

isAjax()

リクエストに含まれる X-Requested-Header が XMLHttpRequest である場合に
true を返します。

isSSL()

現在のリクエストが SSL 接続により行われていれば true を返します。

isXml()

現在のリクエストが XML のレスポンスを受け付けるなら true を返します。

isRss()

現在のリクエストが RSS のレスポンスを受け付けるなら true を返します。

isAtom()

現在のリクエストが Atom のレスポンスを受け付けるなら true
を返し、そうでないなら false を返します。

isMobile()

ユーザエージェントがモバイルのウェブブラウザにマッチするか、クライアントが
WAP のコンテンツを受け付けるなら、 true
を返します。サポートしているモバイル端末のユーザエージェントは次のものになります。

-  iPhone
-  MIDP
-  AvantGo
-  BlackBerry
-  J2ME
-  Opera Mini
-  DoCoMo
-  NetFront
-  Nokia
-  PalmOS
-  PalmSource
-  portalmmm
-  Plucker
-  ReqwirelessWeb
-  SonyEricsson
-  Symbian
-  UP.Browser
-  Windows CE
-  Xiino

isWap()

現在のクライアントが WAP のコンテンツを受け付けるなら true を返します。

先にあげたリクエストの型を判定する全てのメソッドは、コンテンツタイプを特定するフィルター機能に似たやり方で使うことが出来ます。例えば、
Ajax
リクエストに対するレスポンスではブラウザのキャッシュ機能を無効にし、デバッグレベルを変更したいことが多々あるでしょう。ところがこの場合でも、
Ajax
ではないリクエストに関してはブラウザのキャッシュを有効にしておきたいと考えるかもしれません。
これを実現するには次のようにします。 The following would accomplish
that:

::

        if ($this->RequestHandler->isAjax()) {
            Configure::write('debug', 0);
            $this->header('Pragma: no-cache');
            $this->header('Cache-control: no-cache');
            $this->header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        }
        // コントローラアクションの続きを書く

同じ機能を持つ ``Controller::disableCache``
を使用することでも、キャッシュを無効にすることができます。

::

        if ($this->RequestHandler->isAjax()) {
            $this->disableCache();
        }
        // コントローラアクションの続きを書く

リクエストの型の判定
====================

リクエストハンドラを使うと、行われた HTTP
リクエストの型についての情報を取得することと、それぞれのリクエストの型に応じたレスポンスを行うこともできます。

isPost()

リクエストが POST の場合に true を返します。

isPut()

リクエストが PUT の場合に true を返します。

isGet()

リクエストが GET の場合に true を返します。

isDelete()

リクエストが DELETE の場合に true を返します。

クライアントについての追加情報を取得する
========================================

getClientIP()

クライアントの IP アドレスを取得します。

getReferrer()

リクエストが行われたドメイン名を返します。

getAjaxVersion()

Prototype ライブラリは特殊な HTTP ヘッダである「Prototype
version」をセットします。 これを用い、呼び出しが Ajax
によるものであった場合、 prototype.js のバージョンを返します。 Ajax
による呼び出しでない場合、空の文字列を返します。

リクエストに対するレスポンス
============================

リクエストの型を判定する機能に加え、 RequestHandler
は、出力の種類の変更機能とコンテンツタイプへのマッピング機能をアプリケーションに簡単に追加することもできます。

setContent($name, $type = null)

-  $name -
   文字列でコンテンツタイプの名前を割り当てます。この名前とは、すなわち「html」「css」「json」「xml」のことです。
-  $type - 文字列や配列で、コンテンツタイプにマップさせる MIME
   タイプを割り当てます。 複数の MIME タイプを割り当てることができます。

setContent は与えられた名前でコンテンツタイプをセットまたは追加します。
コンテンツタイプには、わかりやすい別名または拡張子がマップされます。
これにより、 RequestHandler
はスタートアップメソッドの中で、リクエストの型に応じたレスポンスを自動的に返すことができます。
またさらに、これらのコンテンツタイプは prefers() と accepts()
メソッドでも使われます。

コンテンツタイプの別名に対する自動的な動作の変更を効果的に行えるよう、
setContent はコントローラの beforeFilter() で使うと良いでしょう。

デフォルトのマッピングは次の通りです。

-  **javascript** text/javascript
-  **js** text/javascript
-  **json** application/json
-  **css** text/css
-  **html** text/html, \*/\*
-  **text** text/plain
-  **txt** text/plain
-  **csv** application/vnd.ms-excel, text/plain
-  **form** application/x-www-form-urlencoded
-  **file** multipart/form-data
-  **xhtml** application/xhtml+xml, application/xhtml, text/xhtml
-  **xhtml-mobile** application/vnd.wap.xhtml+xml
-  **xml** application/xml, text/xml
-  **rss** application/rss+xml
-  **atom** application/atom+xml
-  **amf** application/x-amf
-  **wap** text/vnd.wap.wml, text/vnd.wap.wmlscript, image/vnd.wap.wbmp
-  **wml** text/vnd.wap.wml
-  **wmlscript** text/vnd.wap.wmlscript
-  **wbmp** image/vnd.wap.wbmp
-  **pdf** application/pdf
-  **zip** application/x-zip
-  **tar** application/x-tar

prefers($type = null)

クライアントが好むコンテンツタイプを確定します。
もしパラメータをセットしなければ、最も優先度の高いコンテンツタイプが返されます。
$type
を配列で渡した場合、クライアントが受け付けるものとマッチした最初の値が返されます。
優先度はまず、もしファイルの拡張子が指定されていたらそれを Router
で解析することにより確定されます。 次に、 HTTP\_ACCEPT
にあるコンテンツタイプのリストから選ばれます。

renderAs($controller, $type)

-  $controller - コントローラの参照
-  $type - 表示したいコンテンツタイプの名前。例えば「xml」「rss」など。

定義した型でコントローラの出力のモードを変更します。
また、適切なヘルパーが存在し、それがコントローラ中のヘルパー配列で指定されていなければ、これを追加します。

respondAs($type, $options)

-  $type -
   応答したいコンテンツタイプを「xml」「rss」といった名前や、「application/x-shockwave」といったコンテンツタイプの完全な名前で指定します。
-  $options -
   指定したコンテンツタイプが複数のコンテンツに関連付いている場合、どれを使うかを
   $index で指定します。

コンテンツタイプにマップした名前に基づき、応答するヘッダをセットします。
DEBUG の値が2より大きい場合、ヘッダはセットされません。

responseType()

現在の応答するコンテンツタイプのヘッダをの型を返します。もしセットされていなければ
null を返します。

mapType($ctype)

コンテンツタイプを別名にマップします。
