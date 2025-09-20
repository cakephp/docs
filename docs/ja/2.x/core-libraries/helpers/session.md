# SessionHelper

`class` **SessionHelper**(View $view, array $settings = array())

Session コンポーネントの自然な対応として、 Session ヘルパーは
コンポーネントの大半の機能を、ビューの中で使用可能にします。

Session ヘルパーと Session コンポーネントの大きな違いはヘルパーは
セッションへの書き込みが *出来ない* ことです。

Session コンポーネントと同じく、データは
`ドット記法` の配列構造で読み込みます:

``` text
array('User' => array(
    'username' => 'super@example.com'
));
```

ご覧の配列構造には、ノードに `User.username` といった形で、ドット
(.) で表された入れ子配列でアクセスします。

`method` SessionHelper::**read**(string $key)

`method` SessionHelper::**consume**($name)

`method` SessionHelper::**check**(string $key)

`method` SessionHelper::**error**()

`method` SessionHelper::**valid**()

## 通知やフラッシュメッセージの表示

`method` SessionHelper::**flash**(string $key = 'flash', array $params = array())
