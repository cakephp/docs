# Session

`class` Cake\\View\\Helper\\**SessionHelper**(View $view, array $config = [])

::: info Deprecated in version 3.0.0
SessionHelper は 3.x で非推奨になりました。代わりに、 [FlashHelper](../../views/helpers/flash) を使用するか、 [セッションオブジェクトへアクセス](../../development/sessions#accessing-session-object) する必要があります。
:::

SessionHelper は Session オブジェクトのほとんどの機能を複製し、ビューで利用できるようにします。

SessionHelper と Session オブジェクトの主な違いは、
ヘルパーがセッションに書き込む能力を *持たない* ことです。

Session オブジェクトと同様に、データは `ドット記法` 配列構造を使用して読み取られます。 :

``` php
['User' => [
    'username' => 'super@example.com'
]];
```

上記の配列構造では、ノードは `User.username` によってアクセスされ、ドットはネストされた配列を示します。
この記法は、 `$key` が使用されている、すべての SessionHelper メソッドで使用されます。

`method` Cake\\View\\Helper\\SessionHelper::**read**(string $key)

`method` Cake\\View\\Helper\\SessionHelper::**check**(string $key)

>   :description lang=ja: SessionHelper は Session オブジェクトのほとんどの機能を複製し、ビューから利用できるようにします。  
> keywords lang=ja  
> Sessionヘルパー,フラッシュメッセージ,セッションフラッシュ,セッションリード,セッションチェック
>
> keywords lang=en  
> session helper,flash messages,session flash,session read,session check
