クッキー
#########

.. php:namespace:: Cake\Controller\Component

.. php:class:: CookieComponent(ComponentRegistry $collection, array $config = [])

CookieComponent は PHP に組み込まれている ``setcookie()`` メソッドのラッパーです。
このコンポーネントは、 Cookie の扱いを容易にし、 Cookie のデータを暗号化します。
CookieComponent で追加されたクッキーは、コントローラーのアクションが完了した場合にのみ送られます。

.. deprecated:: 3.5.0
    ``CookieComponent`` の代わりに :ref:`encrypted-cookie-middleware` を使用してください。

Cookie の設定
=================

Cookie はグローバルでも、トップレベルの名前ごとでも、どちらでも設定できます。
グローバル設定のデータはトップレベル設定に統合されますので、異なる部分の上書きさえすればよいです。
グローバルに設定するには、 ``config()`` メソッドを使用します。 ::

    $this->Cookie->config('path', '/');
    $this->Cookie->config([
        'expires' => '+10 days',
        'httpOnly' => true
    ]);

特定のキーで設定するには ``configKey()`` メソッドを使用します。 ::

    $this->Cookie->configKey('User', 'path', '/');
    $this->Cookie->configKey('User', [
        'expires' => '+10 days',
        'httpOnly' => true
    ]);

Cookie の設定、オプションついて

expires
    Cookie が無効になる時間を設定します。デフォルトは1ヶ月です。
path
    Cookie を有効にするパスを設定します。もしパスが '/foo/' で設定されていた場合、
    Cookie は /foo/ ディレクトリーとサブディレクトリー (例: /foo/bar/) でのみ有効になります。
    デフォルトは、アプリケーションの基本パスです。
domain
    Cookie が有効なドメイン。
    example.com の全てのサブドメインで Cookie を有効にするには、 '.example.com' に
    ドメインをセットしてください。
secure
    Cookie がセキュアな HTTPS 接続上でのみ転送されるべきであることを示します。このオプションを
    ``true`` に設定した場合、 Cookie はセキュアな接続時のみ発行されるようになります。
key
    暗号化された Cookie が有効な時に使われる暗号化キー。
    デフォルトは Security.salt です。
httpOnly
    このオプションに ``true`` を設定すると、 HTTP のみの Cookie を生成します。
    HTTP のみの Cookie は JavaScript からアクセスできません。デフォルトは ``false`` です。
encryption
    暗号化のタイプを設定します。デフォルトは `aes` です。
    互換性のために `rijndael` を設定することもできます。

コンポーネントの使い方
======================

CookieComponent は、いくつかのメソッドを提供します。

.. php:method:: write(mixed $key, mixed $value = null)

    write() は Cookie コンポーネントの核となるメソッドです。 $key は Cookie の
    変数名で、$value は保存されるデータです。 ::

        $this->Cookie->write('name', 'Larry');

    キーのパラメーターにドット記法を使うことで、変数をグループで扱うこともできます。 ::

        $this->Cookie->write('User.name', 'Larry');
        $this->Cookie->write('User.role', 'Lead');

    もし、一つの値より多くの値を、一度に Cookie へ書き込みたい場合は、
    配列を通すことで可能です。::

        $this->Cookie->write('User',
            ['name' => 'Larry', 'role' => 'Lead']
        );

    Cookie の全ての値はデフォルトでは AES で暗号化されています。もし平文で
    保存したい場合は、必ずキースペースを設定してください。 ::

        $this->Cookie->configKey('User', 'encryption', false);

.. php:method:: read(mixed $key = null)

    このメソッドは、 $key によって指定された変数名で Cookie の値を読むために
    使われます。 ::

        // "Larry"が出力されます
        echo $this->Cookie->read('name');

        // ドットで記法で読むこともできます
        echo $this->Cookie->read('User.name');

        // ドット記法でグループ化された変数は、次のように
        // 配列として取得されます。
        $this->Cookie->read('User');

        // ['name' => 'Larry', 'role' => 'Lead']

    .. warning::
	CookieComponent は、 ``,`` を含む文字列に対処できません。コンポーネントは、
	これらの値を配列として解釈しようとしますが、結果は正しくありません。代わりに、
	``$request->getCookie()`` を使用してください。

.. php:method:: check($key)

    :param string $key: チェックするキー

    キーやパスが存在するか、また null かどうかチェックするために使います。

.. php:method:: delete(mixed $key)

    $key の名前を持つ Cookie 変数を削除します。ドット記法と一緒に扱います。 ::

        // 変数の削除
        $this->Cookie->delete('bar');

        // Cookie の bar の値を削除しますが、foo 以下のすべてを削除するわけではありません
        $this->Cookie->delete('foo.bar');

.. meta::
    :title lang=ja: Cookie
    :keywords lang=ja: array controller,php setcookie,cookie string,controller setup,string domain,default description,string name,session cookie,integers,variables,domain name,null
