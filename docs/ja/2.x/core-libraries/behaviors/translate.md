# Translate

`class` **TranslateBehavior**

TranslateBehavior のセットアップは本当に簡単で、ちょっと設定するだけで
すぐに動作するようになります。このセクションでは、モデルにこのビヘイビアを追加し、
セットアップする方法を説明します。

TranslabeBehavior を Containable と併用するなら、クエリに 'fields'
キーをセットしているか確かめてください。さもないと、無効な SQL
が生成されてしまうことになるでしょう。

## i18n データベーステーブルを初期化する

i18n データベーステーブルは、CakePHP コンソールを使っても生成できますし、
手動でもできます。ただし、CakePHP の将来のバージョンでレイアウトに変更が
あるかもしれませんので、コンソールを使うことをお勧めします。コンソールを
ずっと使い続けていれば、レイアウトに変更が入っても問題はおきません。 :

    ./cake i18n

i18n データベースを初期化するには、 `[I]` を選択してください。
既存のテーブルをドロップし、新しく作成するかどうかを聞かれます。i18n
テーブルをまだ作成していないなら yes と答え、テーブルを作成するには
もう一度 yes と答えます。

## モデルに Translate ビヘイビアを追加する

次の例のように、 `$actAs` プロパティを使って、
モデルに Translate ビヘイビアを追加します。 :

``` php
class Post extends AppModel {
    public $actsAs = array(
        'Translate'
    );
}
```

Translate ビヘイビアは、動作する前に一組のオプションがあることを期待するので、
これだけではまだ何も起きません。まず、最初のステップで作成した翻訳用テーブルで、
現在のモデルのどのフィールドを辿るのかを定義する必要があります。

## フィールドを定義する

フィールドをセットするには、配列を使って、単純に `'Translate'`
の値を拡張するだけです。次のようになります。 :

``` php
class Post extends AppModel {
    public $actsAs = array(
        'Translate' => array(
            'fieldOne', 'fieldTwo', 'and_so_on'
        )
    );
}
```

このようにすれば、基本的なセットアップは完了です。説明で使用する例では、
対象とするフィールドを「title」とします。さて、この例にならうなら、
モデルの例は次のようになるはずです。 :

``` php
class Post extends AppModel {
    public $actsAs = array(
        'Translate' => array(
            'title'
        )
    );
}
```

TranslateBehavior のために翻訳するフィールドを定義するとき、
翻訳されるモデルのスキーマからこれらのフィールドを必ず省略してください。
もしフィールドを残しておくと、代替ロケールでデータを検索するとき、
問題が起こりうることになるでしょう。

> [!NOTE]
> モデルの全てのフィールドが翻訳される場合、必ずテーブルに `created` と
> `modified` カラムを追加してください。CakePHP は、レコードを保存する前に、
> 少なくとも１つの主キーが必要です。

## 最後に

これで、各レコードが更新・新規作成されたら、TranslateBehavior は
現在のロケールに従い、「title」の値を翻訳用のテーブル (デフォルトでは「i18n」)
にコピーします。ロケールとは、いわば言語の識別子です。

## 翻訳された内容の読み込み

デフォルトでは、 TranslateBehavior は、現在のロケールをもとに、自動的にデータの
取得や追加を行います。現在のロケールは、 `Configure::read('Config.language')`
の値です。まだ何も割り当てられていなければ、 `L10n` クラスによって
割り当てられます。 `$Model->locale` を使うと、ロケールを動的に上書きできます。

### 指定したロケールで翻訳されたフィールドを取得する

`$Model->locale` の設定によって、指定したロケールの翻訳を読むことができます。 :

``` php
// Read the spanish locale data.
$this->Post->locale = 'es';
$results = $this->Post->find('first', array(
    'conditions' => array('Post.id' => $id)
));
// $results will contain the spanish translation.
```

### フィールドに対するすべての翻訳レコードを取得する

現在のモデルに対する全ての翻訳レコードを取得するには、ただ単純に、次に示す通り
ビヘイビアのセットアップにおける *フィールドの配列* を拡張します。
名前は好きにつけてください。 :

``` php
class Post extends AppModel {
    public $actsAs = array(
        'Translate' => array(
            'title' => 'titleTranslation'
        )
    );
}
```

このようにセットアップすると、 `$this->Post->find()` の結果は次のようになります。
:

``` text
Array
(
     [Post] => Array
         (
             [id] => 1
             [title] => Beispiel Eintrag
             [body] => lorem ipsum...
             [locale] => de_de
         )

     [titleTranslation] => Array
         (
             [0] => Array
                 (
                     [id] => 1
                     [locale] => en_us
                     [model] => Post
                     [foreign_key] => 1
                     [field] => title
                     [content] => Example entry
                 )

             [1] => Array
                 (
                     [id] => 2
                     [locale] => de_de
                     [model] => Post
                     [foreign_key] => 1
                     [field] => title
                     [content] => Beispiel Eintrag
                 )

         )
)
```

> [!NOTE]
> モデルのレコードは「locale」という *バーチャル* フィールドを含みます。
> このフィールドは、結果セットのロケールが何であるかを示します。

\`find\` を直接実行しているモデルのフィールドだけが翻訳されることに注意してください。
関連するモデルに対してコールバックを動作させることは現在サポートされていないので、
アソシエーション経由で追加されたモデルは、翻訳されません。

### bindTranslation メソッドの使用

bindTranslation メソッドを使用することで、あなたが必要な時だけ、
全ての翻訳を取得することができます。

`method` TranslateBehavior::**bindTranslation**($fields, $reset)

`$fields` は、フィールドとアソシエーション名の連想配列です。
キーは翻訳フィールドで、値は仮のアソシエーション名です。 :

``` php
$this->Post->bindTranslation(array('title' => 'titleTranslation'));
// 動作させるためには、少なくとも recursive は 1 が必要です。
$this->Post->find('all', array('recursive' => 1));
```

このようにセットアップすると、find() の結果は次のようになります。 :

``` text
Array
(
     [Post] => Array
         (
             [id] => 1
             [title] => Beispiel Eintrag
             [body] => lorem ipsum...
             [locale] => de_de
         )

     [titleTranslation] => Array
         (
             [0] => Array
                 (
                     [id] => 1
                     [locale] => en_us
                     [model] => Post
                     [foreign_key] => 1
                     [field] => title
                     [content] => Example entry
                 )

             [1] => Array
                 (
                     [id] => 2
                     [locale] => de_de
                     [model] => Post
                     [foreign_key] => 1
                     [field] => title
                     [content] => Beispiel Eintrag
                 )

         )
)
```

## 別の言語で保存する

TranslateBehavior を使ったモデルが何かを保存する時に、検出したもの以外の言語で
強制的に保存を行うことができます。

コンテンツにどの言語を使うかをモデルに伝えるには、保存前に、モデルの `$locale`
プロパティ値を変更するだけです。コントローラ中で定義することもできますし、
モデルに直接定義することもできます。

**例 A:** コントローラの中で:

``` php
class PostsController extends AppController {

    public function add() {
        if (!empty($this->request->data)) {
            // ドイツ語版を保存する
            $this->Post->locale = 'de_de';
            $this->Post->create();
            if ($this->Post->save($this->request->data)) {
                return $this->redirect(array('action' => 'index'));
            }
        }
    }
}
```

**例 B:** モデルの中で:

``` php
class Post extends AppModel {
    public $actsAs = array(
        'Translate' => array(
            'title'
        )
    );

    // オプション 1) 直接プロパティを定義する
    public $locale = 'en_us';

    // オプション 2) 簡単なメソッドを作成する 
    public function setLanguage($locale) {
        $this->locale = $locale;
    }
}
```

## 複数の翻訳テーブル

たくさんのエントリーがあることを予測しているなら、急速に成長するデータベースを
どのように扱うべきかが気がかりになるかもしれません。TranslateBehavior には、
翻訳を格納するためにどのモデルを用いるかを定義するためのプロパティが2つあります。

**\$translateModel** と **\$translateTable** です。

全ての posts の翻訳を保存するテーブルとして、「i18n」の代わりに「post_i18ns」を
使用するとしましょう。これには、モデルを次のようにセットアップします。 :

``` php
class Post extends AppModel {
    public $actsAs = array(
        'Translate' => array(
            'title'
        )
    );

    // 別のモデル(あるいはテーブル)を使用する。
    public $translateModel = 'PostI18n';
}
```

> [!NOTE]
> テーブル名は複数形にすることが重要です。これで通常のモデルとして扱え、
> 規約にも従います。テーブルのスキーマは、CakePHP のコンソールスクリプトが
> 生成するものと同じある必要があります。これを間違いなく行うには、コンソールで
> 空の i18n テーブルを初期化し、それをリネームすると良いでしょう。

### TranslateModel の作成

TranslateModel を動作させるには、モデルのフォルダに実際にモデルを作成する
必要があります。なぜなら、このビヘイビアを使うモデルの中で、displayField
ディレクトリをセットするプロパティがまだ存在しないからです。

`$displayField` を `'field'` に変更することを忘れないでください。 :

``` php
class PostI18n extends AppModel {
    public $displayField = 'field'; // 重要
}
// ファイル名: PostI18n.php
```

これで完了です。\$useTable といったような、モデルの他の要素も追加することができます。
しかし一貫性を保つために、これは実際に翻訳を行うモデルで実施するようにしましょう。
この点が、 `$translateTable` の効果が発揮されるところです。

### テーブルの変更

テーブルの名前を変更したい場合は、次に示すように、ただ単純にモデル中の
\$translateTable を定義します。 :

``` php
class Post extends AppModel {
    public $actsAs = array(
        'Translate' => array(
            'title'
        )
    );

    // 別のモデルを使う
    public $translateModel = 'PostI18n';

    // translateModel で別のテーブルを使う
    public $translateTable = 'post_translations';
}
```

**\$translateTable は単独で使用できない** ということに注意してください。
独自の `$translateModel` を使わない場合、このプロパティはいじらないでください。
セットアップが壊れ、実行中に生成されるデフォルトの l18n モデルで「Missing Table」
メッセージが表示されてしまいます。
