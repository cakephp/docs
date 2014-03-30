Cookie
######

.. php:class:: CookieComponent(ComponentCollection $collection, array $config = array())

Cookie コンポーネントは PHP に組み込まれている ``setcookie`` メソッドに関連するラッパーです。
コントローラーで Cookie を使ったコーディングをするのにとても便利な糖衣構文も多数含んでいます。
Cookie コンポーネントを使おうとする前に、コントローラーの $components の配列に 'Cookie' を必ず加えてください。


コントローラーのセットアップ
============================

Cookie の発行や操作の設定をすることができる値を以下に示します。これらの値によって
Cookie コンポーネントがどのように動くかは、コントローラーの beforeFilter() メソッドでも特別に設定できます。

+-------------------+--------------+----------------------------------------------------------------------+
| Cookie の変数     | 規定値       | 内容                                                                 |
+===================+==============+======================================================================+
| string $name      |'CakeCookie'  | Cookie の名前です。                                                  |
+-------------------+--------------+----------------------------------------------------------------------+
| string $key       | null         | この文字列は Cookie の値を暗号化するために使われます。               |
|                   |              | ランダムで特定されにくい文字列を使うべきです。                       |
|                   |              |                                                                      |
|                   |              | Rijndael 暗号化を使うときは32バイトより長い値にしなければなりません。|
+-------------------+--------------+----------------------------------------------------------------------+
| string $domain    | ''           | Cookie を読むことができるドメインの名前を設定します。たとえば、      |
|                   |              | '.yourdomain.com' を使うと、あなたのサブドメイン全体                 |
|                   |              | からのアクセスを許可します。                                         |
+-------------------+--------------+----------------------------------------------------------------------+
| int または string | '5 Days'     | Cookie が無効になる時間を設定します。整数ならば秒として解釈され、    |
| $time             |              | 0であればセッション Cookie として評価されます。すなわち、ブラウザを  |
|                   |              | 終了したときに破棄されます。文字列を設定したときは、 PHP の          |
|                   |              | strtotime() 関数を使って解釈されます。 write() メソッドの中で        |
|                   |              | 直接設定することもできます。                                         |
+-------------------+--------------+----------------------------------------------------------------------+
| string $path      | '/'          | Cookie が適用されるサーバーのパスを設定します。 $path に '/foo/'     |
|                   |              | を設定した場合、この Cookie は、あなたのドメインの /foo/ と、        |
|                   |              | それ以下にあるすべてのサブディレクトリ( /foo/bar など) で有効に      |
|                   |              | なります。既定ではドメイン全体で有効です。 write() メソッドで        |
|                   |              | 直接指定することもできます。                                         |
+-------------------+--------------+----------------------------------------------------------------------+
| boolean $secure   | false        | セキュアな HTTPS 接続を通してのみ Cookie を伝送するかを設定          |
|                   |              | します。 true に設定すると、セキュアな接続が確立しているときにのみ   |
|                   |              | Cookie を発行するようになります。 write() メソッドで直接指定する     |
|                   |              | こともできます。                                                     |
+-------------------+--------------+----------------------------------------------------------------------+
| boolean           | false        | true に設定すると HTTP のみで有効な Cookie を作成します。これらの    |
| $httpOnly         |              | Cookie は Javascript からアクセスすることはできません。              |
+-------------------+--------------+----------------------------------------------------------------------+

以下のサンプルコードは、 Cookie コンポーネントをコントローラーにインクルードする方法と、
セキュアな接続でのみ、 'example.com' というドメインの ‘/bakers/preferences/’
というパス以下で、1時間だけ有効な 'baker\_id' という名前の HTTP のみで有効な
Cookie の初期設定をするための例です。::

    public $components = array('Cookie');
    public function beforeFilter() {
        parent::beforeFilter();
        $this->Cookie->name = 'baker_id';
        $this->Cookie->time = 3600;  // または '1 hour'
        $this->Cookie->path = '/bakers/preferences/';
        $this->Cookie->domain = 'example.com';
        $this->Cookie->secure = true;  // セキュアな HTTPS で接続している時のみ発行されます
        $this->Cookie->key = 'qSI232qs*&sXOw!adre@34SAv!@*(XSL#$%)asGb$@11~_+!@#HKis~#^';
        $this->Cookie->httpOnly = true;
    }

それでは、その他の Cookie コンポーネントのメソッドの使い方を見ていきましょう。

コンポーネントの使い方
======================

CookieComponent は Cookie を使った動作をするためにいくつかのメソッドを提供します。

.. php:method:: write(mixed $key, mixed $value = null, boolean $encrypt = true, mixed $expires = null)

    write() は Cookie コンポーネントの中核をなすメソッドです。 $key は必要な Cookie の値につける名前を、
    $value は保存しておきたい情報を設定します。::

        $this->Cookie->write('name', 'Larry');

    $key にドット記法を使うことで値をグルーピングすることもできます。::

        $this->Cookie->write('User.name', 'Larry');
        $this->Cookie->write('User.role', 'Lead');

    一度に2つ以上の Cookie を書き込みたい場合は、配列を渡すことができます。::

        $this->Cookie->write('User',
            array('name' => 'Larry', 'role' => 'Lead')
        );

    すべての Cookie の値は、既定では暗号化されます。平文で値を保存したい場合は、3つ目の引数に
    false を設定します。 Cookie の値は非常に単純な暗号化システムで暗号化されます。値の暗号化には、
    Configure クラスで予め定義された値である ``Security.salt`` と ``Security.cipherSeed``
    が使われます。よりよい暗号化をして Cookie をよりセキュアにするためには、 app/Config/core.php の
    ``Security.cipherSeed`` を変更することをおすすめします。::

        $this->Cookie->write('name', 'Larry', false);

    最後の引数 $expires は無効になる秒数を数値で指定します。使いやすくするために、
    PHP の関数 strtotime() が解釈できる文字列を渡すこともできます。::

        // いずれの Cookie も1時間で無効になります。
        $this->Cookie->write('first_name', 'Larry', false, 3600);
        $this->Cookie->write('last_name', 'Masters', false, '1 hour');

.. php:method:: read(mixed $key = null)

    このメソッドは、 $key で指定した名前をつけた Cookie の値を得るために使われます。::

        // “Larry” を出力します
        echo $this->Cookie->read('name');

        // ドット記法も使うことができます
        echo $this->Cookie->read('User.name');

        // ドット記法でグループにした値を配列として得る場合、例えば、
        $this->Cookie->read('User');

        // であれば、array('name' => 'Larry', 'role' => 'Lead') のような出力結果となります

.. php:method:: check($key)

    :param string $key: 確認のためのキー。

    key/path が存在し、値が null でない事を確認するために使われます。

    .. versionadded:: 2.3
        ``CookieComponent::check()`` は 2.3 で追加されました。

.. php:method:: delete(mixed $key)

    $key で指定した名前のCookieの値を削除します。ドット記法を使うことができます。::

        // ひとつの値を削除
        $this->Cookie->delete('bar');

        // barという値を削除しますが、foo以下のすべてを削除するわけではありません
        $this->Cookie->delete('foo.bar');

.. php:method:: destroy()

    現在の Cookie を破棄します。

.. php:method:: type($type)

    暗号化の方法を変更することができます。規定では 'cipher' 方式が使われます。しかし、
    より安全にするためには 'rijndael' 方式を使うべきです。

    .. versionchanged:: 2.2
        'rijndael' タイプが追加されました。


.. meta::
    :title lang=en: Cookie
    :keywords lang=en: array controller,php setcookie,cookie string,controller setup,string domain,default description,string name,session cookie,integers,variables,domain name,null
