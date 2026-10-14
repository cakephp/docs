# プラグインの作成

動作サンプルとして、 [プラグインの使い方](../plugins/how-to-use-plugins) セクションを参考に ContactManager
プラグインを作りましょう。 先ず始めに、プラグインの基本ディレクトリ構成を準備します。
それはこのようになります。

    /plugins
        /ContactManager
            /Controller
                /Component
            /Model
                /Behavior
            /View
                /Helper
                /Layouts

プラグインフォルダーの名前は、 **ContactManager** となります。 プラグインと同じ
名前のフォルダになることが重要です。

プラグインはプロジェクトルートの `plugins/` ディレクトリに置きます (従来の `app/` レイアウトの
アプリケーションでは `app/Plugin/` も使えます)。アプリケーション本体とは異なり、プラグインの
*内部* は CakePHP 2 の構成のままです。PHP のクラスは `Controller/` や `Model/` などに置き、
テンプレートは `View/Helper/` と並べて `View/` に置きます。プラグインのテストには
`Test/Case/` と `Test/Fixture/`、または `tests/TestCase/` と `tests/Fixture/` のどちらも使えます。
新しくプラグインを作るときは、 [pieceofcake2/plugin](https://github.com/pieceofcake2/plugin)
スケルトンをひな形にするとよいでしょう。

プラグインフォルダー内では、CakePHP アプリケーションのような構成が多くあるのに気づくと
思いますが、 それが基本的な構成です。 使わないフォルダには、何も入れる必要はありません。
コンポーネントとビヘイビアだけで定義されるプラグインもあれば、 'View' ディレクトリが
完全に省略されるプラグインもあります。

プラグインは、アプリケーションが持つ Config, Console, Lib, webroot 等といった
ディレクトリも設置できます。

> [!NOTE]
> URL でプラグインにアクセスできるようにしたい場合、AppController と AppModel への
> 定義が必要です。 この２つの特別なクラスはプラグインの後に名前をつけて、
> アプリケーションの AppController と AppModel を継承します。
> ContacktManager の例ではこうなります。

``` php
// plugins/ContactManager/Controller/ContactManagerAppController.php の中で
App::uses('AppController', 'Controller');

class ContactManagerAppController extends AppController
{
}
```

``` php
// plugins/ContactManager/Model/ContactManagerAppModel.php の中で
App::uses('AppModel', 'Model');

class ContactManagerAppModel extends AppModel
{
}
```

アプリケーションの `src/` ディレクトリにあるクラスとは異なり、プラグインのクラスは
アプリケーションの Composer classmap には含まれません。プラグインのクラスは CakePHP 自身の
クラスローダーで読み込まれるため、プラグイン内のコードでは、依存するクラスを `App::uses()` で
宣言しておきます。こうしておけば、classmap オートロードを使っていないアプリケーションでも
プラグインが動作します。

もしこれらの特別なクラスの定義を忘れると、”Missing Controller” エラーがでます。

プラグインの作成は、 [Bake プラグイン](https://pieceofcake2.github.io/bake/) を使えば非常に簡単です。

プラグインを bake するのは以下のコマンドになります。

``` bash
bin/cake bake plugin ContactManager
```

そうすると、いつも通りの bake ができます。 例えば controllers を bake するには、次のようにします。

``` bash
bin/cake bake controller Contacts --plugin ContactManager
```

Bake のインストール方法と使い方は、
[Bakeでコード生成](../console-and-shells/code-generation-with-bake)
のチャプターを参照してください。

> [!WARNING]
> プラグインは、コードの分離のための名前空間は機能しません。
> CakePHP 2 のクラスには名前空間が無いためです。
> プラグインの中で、同じクラスやファイル名を使用できません。
> ２つの異なるプラグインであってもです。
> プラグイン名をクラスやファイル名にプレフィックスをつけて
> ユニークなクラスやファイル名を使用してください。

## プラグインコントローラ

ContactManager プラグインのコントローラーは、
`plugins/ContactManager/Controller/` に設置されます。 主にやりたい事は
contacts の管理ですので、このプラグインには ContactsController が必要です。

そこで ContactsController を `plugins/ContactManager/Controller` に設置し、
このように書きます。

``` php
// plugins/ContactManager/Controller/ContactsController.php の中で

class ContactsController extends ContactManagerAppController
{
    public $uses = ['ContactManager.Contact'];

    public function index()
    {
        // ...
    }
}
```

> [!NOTE]
> このコントローラは、親アプリケーションの AppController ではなく、 （
> ContactManagerAppController という名前の）プラグインの
> AppController を継承します。
>
> モデルの名前の頭にプラグイン名がつくことにも注意してください。 これは、
> プラグイン内のモデルとメインのアプリケーション内のモデルの区別が必要だからです。
>
> 今回の例では、ContactManager.Contact はこのコントローラのデフォルトの
> モデルなのですから、 \$uses 配列に書く必要は無かったかもしれませんが、
> プラグイン名を正しく頭につける方法を示すためにここでは書いています。

これまで行ってきたものにアクセスしたい場合、 /contact_manager/contacts
にアクセスします。 Contact モデルをまだ定義してないので、 “Missing Model”
エラーがでるはずです。

## プラグインモデル {#plugin-models}

プラグインのモデルは `plugins/ContactManager/Model` に設置されます。
プラグインの ContactsController は既に定義してあるので、そのモデルを作成します。

``` php
// plugins/ContactManager/Model/Contact.php の中で

class Contact extends ContactManagerAppModel
{
}
```

/contact_manager/contacts に（contacts テーブルがある状態で）
今アクセスすると、“Missing View” エラーが発生します。 次にこれを作ります。

> [!NOTE]
> もしプラグイン内のモデルを参照したいなら、ドットで区切られた、
> モデル名といっしょのプラグイン名を含む必要があります。

例えば:

``` php
// plugins/ContactManager/Model/Contact.php の中で

class Contact extends ContactManagerAppModel
{
    public $hasMany = ['ContactManager.AltName'];
}
```

プラグインの接頭語との連携の無い配列キーを参照したいなら、代わりのシンタックスを使います。

``` php
// plugins/ContactManager/Model/Contact.php の中で

class Contact extends ContactManagerAppModel
{
    public $hasMany = [
        'AltName' => [
            'className' => 'ContactManager.AltName',
        ],
    ];
}
```

## プラグインビュー

ビューは通常のアプリケーション内での動作として振る舞います。
`plugins/[PluginName]/View/` フォルダー内に設置するだけです。
ContactManager プラグインでは、ContactsController::index()
アクションのビューが必要になるので、 このような内容になります。

``` html
<!-- plugins/ContactManager/View/Contacts/index.ctp: -->
<h1>Contacts</h1>
<p>Following is a sortable list of your contacts</p>
<!-- A sortable list of contacts would go here....-->
```

> [!NOTE]
> プラグインからのエレメントの使い方に関する情報は、 [View Elements](../views#view-elements)
> を参照してください。

### アプリケーション内でのプラグインビューのオーバーライド

プラグインのビューはあるパスを使ってオーバーライドできます。 ContactManager
という名のプラグインがあるなら、 `templates/Plugin/[Plugin]/[Controller]/[view].ctp`
(従来の `app/` レイアウトでは `app/View/Plugin/...`)
というテンプレートを作成することでオーバーライドできます。 Contacts コントローラーには
このファイルを作ります。

    templates/Plugin/ContactManager/Contacts/index.ctp

このファイルを作れば、
`plugins/ContactManager/View/Contacts/index.ctp`
を上書きできます。

## プラグインアセット

プラグインのウェブアセット（php ファイルではない）は、 プラグインの
’webroot’ ディレクトリを通して受け取られます。

    plugins/ContactManager/webroot/
                                   css/
                                   js/
                                   img/
                                   pdf/

通常の webroot と同じようにどのディレクトリにどんなファイルでも置くことができます。

ただ、プラグインの静的アセットや画像や JavaScript または CSS は、 ディスパチャーを
経由しますが、非常に効率が悪くなることを覚えておいてください。 ですので、本番環境では
それらにシンボリックリンクを張っておくことを強くおすすめします。
例えばこのようにします。

``` bash
ln -s ../../plugins/YourPlugin/webroot/css/yourplugin.css webroot/css/yourplugin.css
```

### プラグイン内のアセットへのリンク

プラグイン内のアセットへのリクエストの始めは、単に /plugin_name/
を頭に付けるだけで、アプリケーションの webroot として動作します。

例えば、’/contact_manager/js/some_file.js’ へのリンクは、
`plugins/ContactManager/webroot/js/some_file.js` で受け取れます。

> [!NOTE]
> アセットのパスの前に **/your_plugin/** に付けるのが重要です。
> 魔法のようなことが起きます！

::: info Changed in version 2.1
アセットのリクエストには `プラグイン記法` を使用してください。 View での利用方法:
:::

``` php
echo $this->Html->css('ContactManager.style');
```

## コンポーネント、ヘルパーとビヘイビア

コンポーネント、ヘルパーやビヘイビアを持つプラグインは、通常の CakePHP アプリケーションの
ようなものです。 コンポーネントだけ、または、ヘルパーやビヘイビアだけを含むプラグインも
作る事が可能で、 他のプロジェクトで簡単に使えるような、再利用できるコンポーネントを作る
すばらしい方法にもなり得ます。

このようなコンポーネントを作る事は、実際、通常のアプリケーションとして作る事と同じであり、
特別な命名規則もありません。

プラグインの内部や外部からコンポーネントを参照する方法は、
コンポーネント名の前にプラグイン名を付けるだけです。 例えば:

``` php
// 'ContactManager' プラグインのコンポーネントとして定義

class ExampleComponent extends Component
{
}

// あなたのコントローラで下記のように呼び出す

public $components = ['ContactManager.Example'];
```

同じテクニックはヘルパーとビヘイビアにも使えます。

> [!NOTE]
> プラグインの AppController や AppModel と同じく、プラグインのヘルパーが依存するクラスも
> `App::uses()` で宣言してください。そうすれば、classmap オートロードを使っていない
> アプリケーションでもプラグインが動作します。
>
> ``` php
> // プラグインのヘルパーで AppHelper を使うことを宣言する
> App::uses('AppHelper', 'View/Helper');
> ```

## プラグインの拡張

この例は、プラグインを作るための一つの良い開始方法であって、他にも色んな方法があります。
通常のルールでは、つまりアプリケーションでできることは、プラグインでもできます。

まずは、Composer でサードパーティのライブラリを導入し、 cake console に新しい shell
を追加します。 さらに、利用者が自動で出来る、プラグインの機能をテストするためのテストケースを
作成する事を忘れないでください。

ContactManager の例だと、ContactsController 内に add/remove/edit/delete
アクションを作り、 Contact モデルに validation を作成し、contact 管理機能を追加します。
プラグインの改良の仕方もあなた次第で決めれます。 コミュニティ内でコード共有を忘れないので
ください。 その誰もが、あなたの素晴らしい、再利用可能なコンポーネントの恩恵を受けることができます！

## プラグイン Tips

一度、プラグインを `plugins/` にインストールすると、
/plugin_name/controller_name/action というURLでアクセスできます。
ContactManager の例だと、ContactsController には
/contact_manager/contacts でアクセスできます。

CakePHP アプリケーションで動作するプラグインの最後の tips です。

- \[Plugin\]AppController と \[Plugin\]AppModel が無ければ、
  プラグインコントローラにアクセスしようとすると、 missing Controller エラーになります。
- プラグインのレイアウトは定義可能で、 `plugins/[Plugin]/View/Layouts` に含まれます。
  一方でプラグインは、デフォルトは `templates/Layouts` フォルダからレイアウトを利用します。
- コントローラ内で `$this->requestAction('/plugin_name/controller_name/action');`
  と書くと 内部プラグインとコミュニケーションができます。
- requestAction を使う際は、コントローラ名とモデル名がユニークであることを確認してください。
  そうしないと、”redefined class ...” エラーが発生します。
- 拡張子であなたのプラグインへのルーティングを追加するとき、アプリケーションのルーティングを
  上書きせずに、必ず `Router::setExtensions()` を使用してください。

## プラグインの公開

プラグインを共有するには、 `composer.json` ファイルを作成し、あなたのプラグインを
[packagist.org](https://packagist.org/) に公開します。
これで Composer を通して簡単にあなたのプラグインが使用できるようになります。
パッケージの `type` を `cakephp-plugin` にし、アプリケーションのプラグインディレクトリに
インストールされるように `composer/installers` を require に追加して、 `installer-name` に
プラグインのフォルダ名を指定します。

``` json
{
    "name": "foo-bar/cakephp-logging",
    "type": "cakephp-plugin",
    "require": {
        "php": ">=8.0",
        "composer/installers": "*",
        "pieceofcake2/cakephp": "^2.12"
    },
    "extra": {
        "installer-name": "Logging"
    }
}
```

パッケージ名にセマンティックな意味のある名前を選んでください。これは、理想を言えば、
"cakephp" をフレームワークとして依存関係を設定するべきです。
ベンダー名は、通常あなたの GitHub ユーザー名になります。
CakePHP 名前空間 (cakephp) を **使用しない** でください。
これは、CakePHP 自身のプラグインのために予約されています。
小文字と区切り文字のダッシュを使用することが決まりです。

もし、あなたの GitHub アカウントが "FooBar" で "Logging" プラグインを作成する場合、
`foo-bar/cakephp-logging` と名付けるといいでしょう。
そして、CakePHP 自身の "Localized" プラグインは、 `cakephp/localized` で見つけられます。
その PHP 8 対応フォークは [pieceofcake2/localized](https://pieceofcake2.github.io/localized/) でメンテナンスされています。
