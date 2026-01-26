# FlashHelper

`class` **FlashHelper**(View $view, array $config = array())

::: info Added in version 2.7.0
`SessionHelper::flash()` を置き換えました。
:::

FlashHelper は、 [FlashComponent](../../core-libraries/components/flash) によって
`$_SESSION` にセットされたフラッシュメッセージを表示するために使用します。
[FlashComponent](../../core-libraries/components/flash) と FlashHelper は、
主にフラッシュメッセージを表示するためのエレメントを使用します。 Flash エレメントは、
`app/View/Elements/Flash` ディレクトリの配下に配置されます。
CakePHP の App テンプレートに `success.ctp` と `error.ctp` があることを
確認してください。

FlashHelper は、非推奨となった `SessionHelper` の `flash()` メソッドを
置き換えるヘルパーです。

## フラッシュメッセージの表示

フラッシュメッセージを表示するためには、FlashHelper の `render()` メソッドを
使用します。 :

``` php
<?php echo $this->Flash->render() ?>
```

デフォルトでは、CakePHP は、フラッシュメッセージのためにセッション中の "flash" キーを
使用します。しかし、 [FlashComponent](../../core-libraries/components/flash)
の中でフラッシュメッセージを設定した時にキーを指定した場合、そのキーを指定して表示します。 :

``` php
<?php echo $this->Flash->render('other') ?>
```

FlashComponent 内で設定したオプションを上書きすることができます。 :

``` php
// コントローラの中で
$this->Flash->set('The user has been saved.', array(
    'element' => 'success'
));

// ビューの中で、 success.ctp の代わりに great_success.ctp を使用
<?php echo $this->Flash->render('flash', array(
    'element' => 'great_success'
));
```

> [!NOTE]
> CakePHP は、デフォルトではフラッシュメッセージ中の HTML はエスケープしません。
> もし、リクエストやユーザーデータをフラッシュメッセージに含める場合は、
> メッセージを整形するときに `h` でエスケープするべきです。

::: info Added in version 2.10.0
[フラッシュ](../../core-libraries/components/flash) は 2.10.0 ではメッセージを積み重ねます。 複数のフラッシュメッセージをセットした場合、 `render()` を呼び出すと、各メッセージは メッセージが設定された順序で、それ自身の要素で描画されます。
:::

利用可能なオプション配列に関する詳しい情報は、
[FlashComponent](../../core-libraries/components/flash) セクションをご覧ください。
