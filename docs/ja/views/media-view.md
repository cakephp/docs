# メディアビュー

`class` **MediaView**

::: info Deprecated in version 2.3
代わりに [Cake Response File](../controllers/request-response#cake-response-file) を使用してください。
:::

メディアビューを使うとユーザにバイナリーファイルを送ることができます。例えば、
ユーザーが直接参照できないようにするために webroot ディレクトリの外にディレクトリを
配置したいとします。メディアビューを使うとプロジェクト内の特定のフォルダからファイルを持ってきて、
認証してからファイルを渡すといったことができます。

メディアビューを使うためにはデフォルトビューの代わりにメディアビューを使うことをコントローラの
中で宣言する必要があります。あとは、ファイルが何処にあるかを示すために追加パラメータを
渡して下さい。

``` php
class ExampleController extends AppController
{
    public function download()
    {
        $this->viewClass = 'Media';
        // プロジェクトルートの outside_webroot_dir/example.zip をダウンロードする
        $params = [
            'id' => 'example.zip',
            'name' => 'example',
            'download' => true,
            'extension' => 'zip',
            'path' => ROOT . DS . 'outside_webroot_dir' . DS,
        ];
        $this->set($params);
    }
}
```

ここではメディアビューの `$mimeType` に登録されていないmimeタイプのファイルを描画する例を
示します。ファイルは `webroot/files` フォルダにあり、 `WWW_ROOT . 'files'` で指定できます。

``` php
public function download()
{
    $this->viewClass = 'Media';
    // webroot/files/example.docx を描画する
    $params = [
        'id' => 'example.docx',
        'name' => 'example',
        'extension' => 'docx',
        'mimeType' => [
            'docx' => 'application/vnd.openxmlformats-officedocument' .
                '.wordprocessingml.document',
        ],
        'path' => WWW_ROOT . 'files' . DS,
    ];
    $this->set($params);
}
```

## 設定できるパラメータ

`id`  
ID はファイルサーバー上の拡張子を含むファイル名です。

`name`  
ユーザーに送られるファイルの名前をnameで指定することができます。
拡張子を除いた名前で指定して下さい。

`download`  
ダウンロードを強制するためのヘッダを送るかどうかを指示する真偽値です。

`extension`  
ファイルの拡張子です。これは受理可能なmimeタイプの内部リストに一致します。もし、
mime タイプがリストにない場合 (または mimeType パラメータで渡されたものに
一致しない場合)、ファイルはダウンロードされません。

`path`  
ディレクトリセパレータで終わるフォルダ名です。パスは絶対パスにすべきです。
相対パスを指定した場合は、webroot ではなく `APP` ディレクトリ (`src/`、従来のレイアウトでは
`app/`) からの相対パスとして扱われます。

`mimeType`  
追加の mime タイプを含む配列です。この配列は、MediaView が受け付けられる
mime タイプの内部リストにマージされます。

`cache`  
真偽値または整数値です。もし true が渡された場合、ブラウザはファイルを
キャッシュすることを許可されます (もし設定されていない場合、デフォルトでは false です)。
それ以外の場合、キャッシュの有効期限が秒数で渡されます。

<div class="todo">

メディアビューでファイルを送る方法の例を含めてください。

</div>
