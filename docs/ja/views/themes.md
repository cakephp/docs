# テーマ

テーマにはページの見た目を簡単に素早く切り替えられるようになるという利点があります。

テーマを使うためには、コントローラの中でテーマ名を指定して下さい。 :

``` php
class ExampleController extends AppController {
    public $theme = 'Example';
}
```

::: info Changed in version 2.1
バージョン 2.1 より前では、 `$this->viewClass = 'Theme'` という設定が必要でした。 2.1 ではこの設定は不要になり、通常の `View` クラスがテーマをサポートします。
:::

またテーマの設定や変更はアクション、または `beforeFilter` や `beforeRender`
などのコールバック関数の中から行えます。 :

``` php
$this->theme = 'AnotherExample';
```

テーマのビューファイルは `/app/View/Themed/` フォルダに配置する必要があります。
Themed フォルダの中にテーマ名のフォルダを作成して下さい。上記の例でいうと、テーマは
`/app/View/Themed/AnotherExample` に配置するかたちになります。

> [!NOTE]
> これは大事なことなのですが、CakePHP は CamelCase のテーマ名を期待しているということを
> 覚えておいてください。

さらに、 `/app/View/Themed/Example/` 以下は `/app/View/` と全く同じ構造にして下さい。

例えば、Posts コントローラの edit アクションのためのビューファイルは
`/app/View/Themed/Example/Posts/edit.ctp` となります。また、レイアウトファイルは
`/app/View/Themed/Example/Layouts/` に配置されます。

ビューファイルがテーマに見つからない時、CakePHP は `/app/View/` フォルダの中を探します。
これによって、マスタービューファイルを作成して、テーマフォルダには上書きが必要なファイルだけを
配置すればよくなります。

## テーマアセット

テーマにはビューファイルのように静的なアセットを含めることができます。テーマは webroot
ディレクトリにあるアセットをいくつでも必要なだけ読み込めます。その結果、テーマの
パッケージングと配布は簡単になっています。開発中であってもテーマのアセットへのリクエストは
`Dispatcher` によってハンドリングされます。プロダクション環境での
パフォーマンスを改善するためには、テーマのアセットをアプリケーションの webroot
ディレクトリにコピーするかシンボリックリンクを貼ることをお勧めします。
詳しくは以下を参照して下さい。

新しいテーマの webroot を使うには:

``` text
app/View/Themed/<themeName>/webroot<path_to_file>
```

のようなディレクトリをテーマの中に作成して下さい。ディスパッチャはビューパスから
正しいテーマのアセットの検索をハンドリングします。

CakePHP のすべての組み込みヘルパーはテーマに対応しており、自動的に正しいパスが作成されます。
ビューファイルのようにテーマフォルダにファイルが無い場合、メインの webroot フォルダが
デフォルトととなります。 :

``` php
//'purple_cupcake'という名前のテーマの時
$this->Html->css('main.css');

//パスの作成は以下の通り
/theme/purple_cupcake/css/main.css

//リンク
app/View/Themed/PurpleCupcake/webroot/css/main.css
```

## プラグインとテーマアセットのパフォーマンスを改善する

PHP を通してアセットを提供すると PHP を通さずにアセットを提供した場合より確実に
遅くなることはよく知られています。コアチームは出来るだけ速いプラグインとテーマのアセットを
提供しようとコツコツと努力を重ねていますが、より高い性能が必要とされる状況はあるかもしれません。
そのような状況では、シンボリックリンクを張るかプラグインとテーマのアセットを
CakePHP によって使われている `app/webroot` のパスに一致するディレクトリに
コピーすることが推奨されます。

- `app/Plugin/DebugKit/webroot/js/my_file.js` は
  `app/webroot/debug_kit/js/my_file.js` になります。
- `app/View/Themed/Navy/webroot/css/navy.css` は
  `app/webroot/theme/Navy/css/navy.css` になります。
