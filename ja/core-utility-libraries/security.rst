Security
########

.. php:class:: Security

`Security ライブラリ <https://api.cakephp.org/2.x/class-Security.html>`_ は、
データのハッシュ化や暗号化などのメソッドなどの基本的なセキュリティ分野を取り扱います。

.. warning::
    Security によって提供される暗号化機能は、非推奨な ``mcrypt`` 拡張に依存します。もし
    PHP=>7.1 を使用している場合、PECL 経由で ``mcrypt`` をインストールする必要があります。

Security API
============

.. php:staticmethod:: cipher( $text, $key )

    :rtype: string

    与えられたキーにを利用してテキストを暗号化・復号します。 ::

        // 'my_key' でテキストを暗号化する
        $secret = Security::cipher('hello world', 'my_key');

        // その後、テキストを復号する
        $nosecret = Security::cipher($secret, 'my_key');

    .. warning::

        ``cipher()`` は、 **脆弱な** XOR 暗号を利用しています。従って、
        重要で機密性の高いデータへ **使うべきではありません** 。
        このメソッドは、後方互換性のためだけに残されています。

.. php:staticmethod:: rijndael($text, $key, $mode)

    :param string $text: 暗号化するテキスト
    :param string $key: 暗号化に利用するキー。32バイトより長くする必要があります。
    :param string $mode: モード。'encrypt' もしくは 'decrypt'

    rijndael-256 暗号を使って、テキストを暗号化・復号します。
    このメソッドを使うには `mcrypt extension <https://secure.php.net/mcrypt>`_
    がインストールされている必要があります。 ::

        // データを暗号化
        $encrypted = Security::rijndael('a secret', Configure::read('Security.key'), 'encrypt');

        // その後、復号
        $decrypted = Security::rijndael($encrypted, Configure::read('Security.key'), 'decrypt');

    .. versionadded:: 2.2
        ``Security::rijndael()`` は、2.2 で追加されました。

.. php:staticmethod:: encrypt($text, $key, $hmacSalt = null)

    :param string $plain: 暗号化する値。
    :param string $key: 暗号キーとして使用する 256 ビット (32 バイト) キー。
    :param string $hmacSalt: HMAC 処理で使用するソルト。 null なら Security.salt を使用。

    AES-256 で ``$text`` を暗号化します。 ``$key`` は、適切なパスワードのように
    データの中の値はバラバラに分散した値にすべきです。戻り値は、HMAC チェックサムで
    暗号化された値です。

    このメソッドをパスワードの保存に **使用しないでください**。代わりに
    :php:meth:`~Security::hash()`` などの一方行ハッシュメソッドを使用してください。
    以下が使用例です。 ::

        // キーはどこかに格納されていて、後で復号に再利用されると仮定
        $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
        $result = Security::encrypt($value, $key);

    暗号化された値は、 :php:meth:`Security::decrypt()` で復号化されます。

    .. versionadded:: 2.5

.. php:staticmethod:: decrypt($cipher, $key, $hmacSalt = null)

    :param string $cipher: 復号する暗号文字列。
    :param string $key: 暗号キーとして使用する 256 ビット (32 バイト) キー。
    :param string $hmacSalt: HMAC 処理で使用するソルト。 null なら Security.salt を使用。

    事前に暗号化された値を復号します。 ``$key`` と ``$hmacSalt`` パラメータは、
    暗号化に使用した値と一致しなければなりません。そうでなければ復号に失敗します。
    以下が使用例です。 ::

        // キーはどこかに格納されていて、後で復号に再利用されると仮定
        $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

        $cipher = $user['User']['secrets'];
        $result = Security::decrypt($cipher, $key);

    暗号キーや HMAC ソルトが変わったことで復号化できなかった場合は、 ``false`` を返します。

    .. versionadded:: 2.5

.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

    :rtype: string

    与えられたハッシュ用メソッドを利用して、文字列からハッシュを生成します。
    指定されなかった場合は、順次利用可能なメソッドで生成を試みます。
    ``$salt`` を true にした場合、アプリケーションに設定した salt が利用されます。 ::

        // アプリケーションの salt 値を利用
        $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

        // 独自の salt 値を利用する場合
        $md5 = Security::hash('CakePHP Framework', 'md5', 'my-salt');

        // デフォルトのハッシュアルゴリズムを利用する場合
        $hash = Security::hash('CakePHP Framework');

    ``hash()`` は、 bcrypt のような別のセキュアなハッシュアルゴリズムにも対応しています。
    bcrypt を使用した場合、わずかに使用方法が異なることに注意してください。
    最初にハッシュを生成することは、他のアルゴリズムと同じ動作をします。 ::

        // bcrypt を使用してハッシュを作成
        Security::setHash('blowfish');
        $hash = Security::hash('CakePHP Framework');

    他のハッシュタイプと異なる点は、プレーンテキストの値とハッシュ化した値を比較する際に、
    以下のようにしなければならない点です。 ::

        // $storedPassword は、事前に生成された bcrypt ハッシュ
        $newHash = Security::hash($newPassword, 'blowfish', $storedPassword);

    bcrypt でハッシュ化された値を比較する時、元のハッシュ値は、 ``$salt`` パラメータに
    設定しなければなりません。bcrypt は、同じ cost 値と salt 値を再利用することで、
    同じ入力値を与えると同じ結果のハッシュが得られます。

    .. versionchanged:: 2.3
        bcrypt への対応は、2.3 で追加されました。

.. php:staticmethod:: setHash( $hash )

    :rtype: void

    Security オブジェクトがデフォルトで利用するハッシュ化メソッドを設定します。
    この操作は、 Security::hash() を利用する全てのオブジェクトへ影響します。

.. meta::
    :title lang=ja: セキュリティ
    :keywords lang=ja: セキュリティ api,秘密のパスワード,暗号文,php クラス,セキュリティクラス,テキストキー,セキュリティライブラリ,オブジェクトインスタンス,セキュリティ計測,基本セキュリティ,セキュリティレベル,文字列タイプ,fallback,ハッシュ,データセキュリティ,シングルトン,不活発,php 復号,実装,php セキュリティ
