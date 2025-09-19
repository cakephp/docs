# セッション

`class` **SessionComponent**(ComponentCollection $collection, array $settings = array())

CakePHP の SessionComponent は、複数のページにわたってクライアントのデータを継続して
保持する方法を提供します。このコンポーネントは `$_SESSION` 変数に関連した
いくつかの便利なメソッドを持つラッパのように振舞います。

CakePHP ではセッションの複数の方法で設定を行えます。
詳しくは [セッションの設定](../../development/sessions) を参照してください。

## セッションデータを伝達する

SessionComponent はセッション情報を伝えあうために使われます。
ユーザへ出力するメッセージの作成はもちろんのこと、基本的な CRUD 機能が含まれます。

覚えておきたいことは、 `ドット記法` により配列構造で作成可能ということです。
そのため `User.username` は、次のような値が参照されます。 :

    array('User' => array(
        'username' => 'clark-kent@dailyplanet.com'
    ));

ドット (.) は、多次元配列のために使われます。
この表記は、SessionComponent 内で使用されるどの name/key においても使われます。

`method` SessionComponent::**write**($name, $value)

`method` SessionComponent::**read**($name)

`method` SessionComponent::**consume**($name)

`method` SessionComponent::**check**($name)

`method` SessionComponent::**delete**($name)

`method` SessionComponent::**destroy**()

## 通知メッセージの作成

`method` SessionComponent::**setFlash**(string $message, string $element = 'default', array $params = array(), string $key = 'flash')
