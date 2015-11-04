..
    Security

セキュリティ
############

.. php:namespace:: Cake\Utility

.. php:class:: Security

..
    The `security library
    <http://api.cakephp.org/3.0/class-Cake.Utility.Security.html>`_
    handles basic security measures such as providing methods for
    hashing and encrypting data.

`security library
<http://api.cakephp.org/3.0/class-Cake.Utility.Security.html>`_ は、
データのハッシュ化や暗号化などのメソッドなどの基本的なセキュリティ分野を取り扱います。

..
    Encrypting and Decrypting Data

データの暗号化と復号化
==============================

.. php:staticmethod:: encrypt($text, $key, $hmacSalt = null)
.. php:staticmethod:: decrypt($cipher, $key, $hmacSalt = null)

..
    Encrypt ``$text`` using AES-256. The ``$key`` should be a value with a
    lots of variance in the data much like a good password. The returned result
    will be the encrypted value with an HMAC checksum.

``$text`` の暗号化には AES-256 を利用します。 ``$key`` は例えば「よいパスワード」のように、
沢山の分散された値であるべきです。返却される結果は HMAC チェックサム（checksum）つきの暗号化された値となります。

..
    This method will use either `openssl <http://php.net/openssl>`_ or `mcrypt
    <http://php.net/mcrypt>`_ based on what is available on your system. Data
    encrypted in one implementation is portable to the other.

このメソッドは、 `openssl <http://php.net/openssl>`_ か `mcrypt <http://php.net/mcrypt>`_ のいずれかを利用し、
あなたのシステムで有効であることが基準になります。
いずれかの実装で暗号化されたデータは、もう一方の実装に移植できます。

..
    This method should **never** be used to store passwords.  Instead you should use
    the one way hashing methods provided by
    :php:meth:`~Cake\\Utility\\Security::hash()`. An example use would be::

このメソッドは **決して** パスワードの保存に使ってはいけません。
代わりに一方通行のハッシュ化メソッド :php:meth:`~Cake\\Utility\\Security::hash()` を利用すべきです。
以下に一例を挙げます。

..
    // Assuming key is stored somewhere it can be re-used for
    // decryption later.
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
    $result = Security::encrypt($value, $key);

::

    // キーがどこかに保存されたと仮定すれば、あとで復号のために再利用されることが可能
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
    $result = Security::encrypt($value, $key);

..
    If you do not supply an HMAC salt, the ``Security.salt`` value will be used.
    Encrypted values can be decrypted using
    :php:meth:`Cake\\Utility\\Security::decrypt()`.

もしあなたが HMAC ソルトを提供しなければ、 ``Security.salt`` の値が利用されます。
暗号化された値は :php:meth:`Cake\\Utility\\Security::decrypt()` を利用して復号できます。

..
    Decrypt a previously encrypted value. The ``$key`` and ``$hmacSalt``
    parameters must match the values used to encrypt or decryption will fail. An
    example use would be::

すでに暗号化された値を復号します。 ``$key`` と ``$hmacSalt`` のパラメーターは、
暗号化時に利用された各々の値と一致する必要があり、さもなければ復号化は失敗します。
以下に一例を挙げます。

..
    // Assuming the key is stored somewhere it can be re-used for
    // Decryption later.
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

    $cipher = $user->secrets;
    $result = Security::decrypt($cipher, $key);

::

    // キーがどこかに保存されたと仮定すれば、あとで復号のために再利用されることが可能
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

    $cipher = $user->secrets;
    $result = Security::decrypt($cipher, $key);

..
    If the value cannot be decrypted due to changes in the key or HMAC salt
    ``false`` will be returned.

キーや HMAC ソルトの変更により値が復号化できない場合、 ``false`` が返却されます。


.. _force-mcrypt:

..
    Choosing a Specific Crypto Implementation

暗号化を一つに特定する実装
-----------------------------------------

..
    If you are upgrading an application from CakePHP 2.x, data encrypted in 2.x is
    not compatible with openssl. This is because the encrypted data is not fully AES
    compliant. If you don't want to go through the trouble of re-encrypting your
    data, you can force CakePHP to use ``mcrypt`` using the ``engine()`` method::

もし CakePHP 2.x からアプリケーションをアップグレードするならば、 2.x で暗号化されたデータは openssl では互換性がありません。
これは、暗号化されたデータはAESに完全には準拠していないからです。
もしデータを再度暗号化するときにトラブルを避けたければ、 ``engine()`` メソッドを使用して強制的に ``mcrypt`` を利用できます。

::

    // In config/bootstrap.php
    use Cake\Utility\Crypto\Mcrypt;

    Security::engine(new Mcrypt());

..
    The above will allow you to seamlessly read data from older versions of CakePHP,
    and encrypt new data to be compatible with OpenSSL.

上記は古いバージョンのCakePHPのデータのシームレスな読み込みを許可し、新しいデータを暗号化すると openssl 互換となります。

..
    Hashing Data

ハッシュデータ
===============

.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

..
    Create a hash from string using given method. Fallback on next
    available method. If ``$salt`` is set to ``true``, the applications salt
    value will be used::

このメソッドで文字列からハッシュを作成します。次の有効なメソッドを頼ってください。
もし ``$salt`` が ``true`` にセットされていた場合、アプリケーションのソルト値が利用されます。

..
    // Using the application's salt value
    $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

    // Using a custom salt value
    $sha1 = Security::hash('CakePHP Framework', 'sha1', 'my-salt');

    // Using the default hash algorithm
    $hash = Security::hash('CakePHP Framework');

::

    // アプリケーションのソルト値を利用
    $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

    // カスタムソルト値を利用
    $sha1 = Security::hash('CakePHP Framework', 'sha1', 'my-salt');

    // デフォルトのハッシュアルゴリズムを利用
    $hash = Security::hash('CakePHP Framework');

..
    The ``hash()`` method supports the following hashing strategies:

 ``hash()`` メソッドは以下のハッシュ方法をサポートします。

- md5
- sha1
- sha256

..
    And any other hash algorithmn that PHP's ``hash()`` function supports.

そして、他のどんなハッシュアルゴリズムであれ、PHPの ``hash()`` 関数がサポートしているハッシュアルゴリズムもサポートします。

..
    You should not be using ``hash()`` for passwords in new applications.
    Instead you should use the ``DefaultPasswordHasher`` class which uses bcrypt
    by default.

.. warning::

    新しいアプリケーションのパスワード用に ``hash()`` を利用すべきではありません。
    代わりにデフォルトで bcrypt を利用する ``DefaultPasswordHasher`` クラスを利用すべきです。

.. meta::
    :title lang=en: Security
    :keywords lang=en: security api,secret password,cipher text,php class,class security,text key,security library,object instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php security
