翻訳
####

翻訳ビヘイビアのセットアップは本当に簡単で、ちょっと設定するだけですぐに動作するようになります。この章では、モデルにこのビヘイビアを追加し、セットアップする方法を説明します。

翻訳ビヘイビアをコンテイナブルと併用するならば、クエリに'fields'キーがセットされているか確かめてください。さもないと、無効なSQLが生成されてしまうことになるでしょう。

i18n データベーステーブルを初期化する
=====================================

i18n データベーステーブルは、CakePHP
コンソールを使っても生成できますし、手動でもできます。ただし、CakePHP
の将来のバージョンでレイアウトに変更があるかもしれませんので、コンソールを使うことをお勧めします。コンソールをずっと使い続けていれば、レイアウトに変更が入っても問題はおきません。

::

    ./cake i18n

i18n データベースを初期化するには、 ``[I]``
を選択してください。既存のテーブルをドロップし、新しく作成するかどうかを聞かれます。i18n
テーブルをまだ作成していないなら yes
と答え、テーブルを作成するにはもう一度 yes と答えます。

モデルに翻訳ビヘイビアを追加する
================================

次の例のように、 ``$actAs``
プロパティを使って、モデルに翻訳ビヘイビアを追加します。

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate'
        );
    }
    ?>

翻訳ビヘイビアは、動作する前に一組のオプションがあることを期待するので、これだけではまだ何も起きません。まず、最初のステップで作成した翻訳テーブルで、現在のモデルのどのフィールドを辿るのかを定義する必要があります。

フィールドを定義する
====================

フィールドをセットするには、配列を使って、単純に ``'Translate'``
の値を拡張するだけです。次のようになります。

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'fieldOne', 'fieldTwo', 'and_so_on'
            )
        );
    }
    ?>

このようにすれば、基本的なセットアップは完了です。説明で使用する例では、対象とするフィールドを「name」とします。さて、この例にならうなら、モデルの例は次のようになるはずです。

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
    }
    ?>

翻訳ビヘイビアのために翻訳するフィールドを定義するとき、翻訳されるモデルのスキーマからこれらのフィールドを必ず省略してください。もしフィールドを残しておくと、代替ロケールでデータを検索するとき、問題が起こりうることになるでしょう。

最後に
======

これで、各レコードが更新・新規作成されたら、翻訳ビヘイビアは現在のロケールに従い、「name」の値を翻訳用のテーブル(デフォルトでは「i18n」)にコピーします。ロケールとは、いわば言語の識別子です。

*現在のロケール* は、現在の ``Configure::read('Config.language')``
の値です。\ *Config.language*
の値は、まだ何も割り当てられていなければ、L10n
クラスに割り当てられます。しかしながら、翻訳ビヘイビアはロケールを動的に上書きすることもできます。これにより、ページのユーザが初期設定を変更せず、複数のバージョンを作成することができます。より詳しい情報は、以降の節を参照してください。

フィールドに対するすべての翻訳レコードを取得する
================================================

現在のモデルに対する全ての翻訳レコードを取得するには、ただ単純に、次に示す通りビヘイビアのセットアップにおける\ *フィールドの配列*\ を拡張します。名前は好きにつけてください。

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name' => 'nameTranslation'
            )
        );
    }
    ?>

このようにセットアップすると、find() の結果は次のようになります。

::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [name] => Beispiel Eintrag 
                 [body] => lorem ipsum...
                 [locale] => de_de
             )

         [nameTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Example entry
                     )

                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Beispiel Eintrag
                     )

             )
    )

**注意**:
モデルのレコードは「locale」という\ *仮想的な*\ フィールドを含みます。このフィールドは、結果セットのロケールが何であるかを示します。

Using the bindTranslation method
--------------------------------

You can also retrieve all translations, only when you need them, using
the bindTranslation method

``bindTranslation($fields, $reset)``

``$fields`` is a named-key array of field and association name, where
the key is the translatable field and the value is the fake association
name.

::

    $this->Post->bindTranslation(array ('name' => 'nameTranslation'));
    $this->Post->find('all', array ('recursive'=>1)); // need at least recursive 1 for this to work.

With this setup the result of your find() should look something like
this:

::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [name] => Beispiel Eintrag 
                 [body] => lorem ipsum...
                 [locale] => de_de
             )

         [nameTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Example entry
                     )

                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Beispiel Eintrag
                     )

             )
    )

別の言語で保存する
==================

翻訳ビヘイビアを使ったモデルが何かを保存する時に、検出したもの以外の言語で強制的に保存を行うことができます。

コンテンツにどの言語を使うかをモデルに伝えるには、保存前に、モデルの
``$locale``
プロパティ値を変更するだけです。コントローラ中で定義することもできますし、モデルに直接定義することもできます。

**例 A:** コントローラ中での定義

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';
        
        function add() {
            if ($this->data) {
                $this->Post->locale = 'de_de'; // ドイツ語版を保存する
                $this->Post->create();
                if ($this->Post->save($this->data)) {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>

**例 B:** モデル中での定義

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // オプション 1) 直接プロパティを定義する
        var $locale = 'en_us';
        
        // オプション 2) 簡単なメソッドを作成する 
        function setLanguage($locale) {
            $this->locale = $locale;
        }
    }
    ?>

複数の翻訳テーブル
==================

たくさんのエントリーがあることを予測しているなら、急速に成長するデータベースをどのように扱うべきかが気がかりになるかもしれません。翻訳ビヘイビアには、どのモデルを翻訳を格納するために用いるかを定義するためのプロパティが、2つあります。

これらのプロパティは、\ **$translateModel** と **$translateTable**
になります。

全ての posts
の翻訳を保存するテーブルとして、「i18n」の代わりに「post\_i18ns」を使用するとしましょう。これには、モデルを次のようにセットアップします。

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // 別のモデル(あるいはテーブル)を使用する。
        var $translateModel = 'PostI18n';
    }
    ?>

テーブル名は複数形にすることを\ **忘れないでください**\ 。これで通常のモデルとして扱え、規約にも従います。テーブルのスキーマは、CakePHP
のコンソールスクリプトが生成するものと同じある必要があります。これを間違いなく行うには、コンソールで空の
i18n テーブルを初期化し、それをリネームすると良いでしょう。

TranslateModel を作成する
-------------------------

TranslateModel
を動作させるには、モデルのフォルダに実際にモデルを作成する必要があります。なぜなら、このビヘイビアを使うモデルの中で、
displayField
ディレクトリをセットするプロパティがまだ存在しないからです。

``$displayField`` を ``'field'`` に変更することを忘れないでください。

::

    <?php
    class PostI18n extends AppModel { 
        var $displayField = 'field'; // 重要
    }
    // ファイル名: post_i18n.php
    ?>

これで完了です。$useTable
といったような、モデルの他の要素も追加することができます。しかし一貫性を保つために、これは実際に翻訳を行うモデルで実施するようにしましょう。この点が、\ ``$translateTable``
の効果が発揮されるところです。

テーブルを変更する
------------------

テーブルの名前を変更したい場合は、次に示すように、ただ単純にモデル中の
$translateTable を定義します。

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // 別のモデルを使う
        var $translateModel = 'PostI18n';
        
        // translateModel で別のテーブルを使う
        var $translateTable = 'post_translations';
    }
    ?>

**$translateTable
は単独で使用できない**\ 、ということに注意してください。独自の
``$translateModel``
を使わない場合、このプロパティはいじらないでください。セットアップが壊れ、実行中に生成されるデフォルトの
l18n モデルで「Missing Table」メッセージが表示されてしまいます。
