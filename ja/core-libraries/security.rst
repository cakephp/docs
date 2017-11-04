セキュリティ
############

.. php:namespace:: Cake\Utility

.. php:class:: Security

`security library
<https://api.cakephp.org/3.x/class-Cake.Utility.Security.html>`_ は、
データのハッシュ化や暗号化などのメソッドなどの基本的なセキュリティ分野を取り扱います。

データの暗号化と復号
====================

.. php:staticmethod:: encrypt($text, $key, $hmacSalt = null)
.. php:staticmethod:: decrypt($cipher, $key, $hmacSalt = null)

``$text`` の暗号化には AES-256 を利用します。 ``$key`` は例えば「よいパスワード」のように、
沢山の分散された値であるべきです。返却される結果は HMAC チェックサム（checksum）つきの
暗号化された値となります。

このメソッドは、 `openssl <http://php.net/openssl>`_ か
`mcrypt <http://php.net/mcrypt>`_ のいずれかを利用し、
あなたのシステムで有効であることが基準になります。
いずれかの実装で暗号化されたデータは、もう一方の実装に移植できます。

.. warning::
    `mcrypt <http://php.net/mcrypt>`_ 拡張は、PHP7.1 で非推奨になりました。


このメソッドは **決して** パスワードの保存に使ってはいけません。代わりに一方通行の
ハッシュ化メソッド :php:meth:`~Cake\\Utility\\Security::hash()` を利用すべきです。
以下に一例を挙げます。 ::

    // キーがどこかに保存されたと仮定すれば、あとで復号のために再利用されることが可能
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
    $result = Security::encrypt($value, $key);

もしあなたが HMAC ソルトを提供しなければ、 ``Security.salt`` の値が利用されます。
暗号化された値は :php:meth:`Cake\\Utility\\Security::decrypt()` を利用して復号できます。

すでに暗号化された値を復号します。 ``$key`` と ``$hmacSalt`` のパラメーターは、
暗号化時に利用された各々の値と一致する必要があり、さもなければ復号は失敗します。
以下に一例を挙げます。 ::

    // キーがどこかに保存されたと仮定すれば、あとで復号のために再利用されることが可能
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

    $cipher = $user->secrets;
    $result = Security::decrypt($cipher, $key);

キーや HMAC ソルトの変更により値が復号できない場合、 ``false`` が返却されます。


.. _force-mcrypt:

特定の暗号化を実装を選択
------------------------

もし CakePHP 2.x からアプリケーションをアップグレードするならば、 2.x で暗号化されたデータは
openssl では互換性がありません。これは、暗号化されたデータは AES に完全には準拠していないから
です。もしデータを再度暗号化するときにトラブルを避けたければ、 ``engine()`` メソッドを使用して
``mcrypt`` の利用を CakePHP に強制できます。 ::

    // In config/bootstrap.php
    use Cake\Utility\Crypto\Mcrypt;

    Security::engine(new Mcrypt());

上記は古いバージョンの CakePHP のデータのシームレスな読み込みを許可し、新しいデータを
暗号化すると OpenSSL 互換となります。

データのハッシュ化
==================

.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

このメソッドで文字列からハッシュを作成します。次の有効なメソッドを頼ってください。
もし ``$salt`` が ``true`` にセットされていた場合、アプリケーションのソルト値が
利用されます。 ::

    // アプリケーションのソルト値を利用
    $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

    // カスタムソルト値を利用
    $sha1 = Security::hash('CakePHP Framework', 'sha1', 'my-salt');

    // デフォルトのハッシュアルゴリズムを利用
    $hash = Security::hash('CakePHP Framework');

``hash()`` メソッドは以下のハッシュ方法をサポートします。

- md5
- sha1
- sha256

そして、PHP の ``hash()`` 関数がサポートしている他のハッシュアルゴリズムもサポートします。

.. warning::

    新しいアプリケーションのパスワード用に ``hash()`` を利用すべきではありません。
    代わりにデフォルトで bcrypt を利用する ``DefaultPasswordHasher`` クラスを利用すべきです。

セキュアなランダムデータの取得
==============================

.. php:staticmethod:: randomBytes($length)

セキュアなランダムソースから ``$length`` バイト数を取得します。この関数は、
以下のソースの１つからデータを生成します。

* PHP の ``random_bytes`` 関数。
* SSL 拡張の ``openssl_random_pseudo_bytes`` 。

どちらのソースも利用できない場合、警告が発せられ、
後方互換のために安全ではない値が使用されます。

.. versionadded:: 3.2.3
    randomBytes メソッドは 3.2.3 で追加されました。

.. meta::
    :title lang=ja: Security
    :keywords lang=ja: security api,secret password,cipher text,php class,class security,text key,security library,object instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php security
