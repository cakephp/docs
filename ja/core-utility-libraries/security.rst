Security
########

.. php:class:: Security

`security library <http://api20.cakephp.org/class/security>` は、\
データのハッシュ化や暗号化などのメソッドなどの基本的なセキュリティ分野を取り扱います。



Security API
============

.. php:staticmethod:: cipher( $text, $key )

    :rtype: string

    Encrypts/Decrypts a text using the given key.::
    与えられたキーにを利用してテキストを暗号化・復号する。\ ::

        // 'my_key' で秘密のパスワードを暗号化する
        $secret = Security::cipher('my secret password', 'my_key');

        // その後、秘密のパスワードを復号する
        $nosecret = Security::cipher($secret, 'my_key');

    ``cipher()`` は、 **脆弱な** XOR 暗号を利用しています。従って、重要で機密性の高いデータへ **使うべきではありません** 。

.. php:staticmethod:: rijndael($text, $key, $mode)

    :param string $text: 暗号化するテキスト
    :param string $key: 暗号化に利用するキー。32バイトより長くする必要があります。
    :param string $mode: モード。'encrypt' もしくは 'decrypt'

    rijndael-256 暗号を使って、テキストの暗号化・復号を行います。
    このメソッドを使うには `mcrypt extension <http://php.net/mcrypt>`
    がインストールされている必要があります。\ ::

        // データを暗号化
        $encrypted = Security::rijndael('a secret', Configure::read('Security.key'), 'encrypt');

        // その後、復号
        $decrypted = Security::rijndael($encrypted, Configure::read('Security.key'), 'decrypt');

    .. versionadded:: 2.2
        ``Security::rijndael()`` は、2.2 で追加されました。

.. php:staticmethod:: generateAuthKey( )

    :rtype: string

        認可用のハッシュを生成します。

.. php:staticmethod:: getInstance( )

    :rtype: object

    オブジェクトのインスタンスを返す、シングルトン実装です。

.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

    :rtype: string

    与えられたハッシュ用メソッドを利用して、文字列からハッシュを生成します。
    指定されなかった場合は、順次利用可能なメソッドで生成を試みます。
    ``$salt`` を true にした場合、アプリケーションに設定した salt が利用されます。

    ::

        //アプリケーションの salt 値を利用します。
        $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

        //独自の salt 値を利用する場合
        $md5 = Security::hash('CakePHP Framework', 'md5', 'my-salt');

        //デフォルトのハッシュアルゴリズムを利用する場合
        $hash = Security::hash('CakePHP Framework');

.. php:staticmethod:: inactiveMins( )

    :rtype: integer

    セキュリティレベルに基づいた未操作の許容時間（単位：分）を返します。\ ::

        $mins = Security::inactiveMins();
        // Security.level を 'medium' にしていた場合、$mins は 100 となります。

.. php:staticmethod:: setHash( $hash )

    :rtype: void

    Security オブジェクトがデフォルトで利用するハッシュ化メソッドを設定します。
    この操作は、 Security::hash() を利用する全てのオブジェクトへ影響します。

.. php:staticmethod:: validateAuthKey( $authKey )

    :rtype: boolean

    認可用ハッシュを検証します。

.. todo::

    もっと例を追加してください :|

.. meta::
    :title lang=en: Security
    :keywords lang=en: security api,secret password,cipher text,php class,class security,text key,security library,object instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php security
