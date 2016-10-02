国際化と地域化
##############

あなたのアプリケーションをより多くのユーザーに届けるのに最も良い方法の一つは、
複数の言語に対応することです。これは、しばしば気が遠くなるような作業になります。
しかし、CakePHP の国際化と地域化の機能は、これを容易にします。

まずは、いくつかの専門用語について理解しましょう。
国際化 *(internationalization)* とは、あるアプリケーションを地域化できるようにすることです。
地域化 *(localization)* とは、あるアプリケーションを特定の言語や文化での表現(
すなわちロケール *(locale)*) に適応させることです。国際化と地域化は、それぞれ「i18n」と
「l10n」というように省略されます。「internationalization (国際化)」の最初と最後の文字の間に
18文字あるから「i18n」となり、「localization (地域化)」も同様の理由で「l10n」となります。

アプリケーションの国際化
========================

単一言語のアプリケーションから、複数言語のアプリケーションに移行するためには、
数ステップを踏むだけです。最初のステップは、 :php:func:`__()` 関数をあなたのコードで
使用することです。以下が単一言語アプリケーションのとあるコードの例です。 ::

    <h2>Posts</h2>

あなたのコードを国際化するためには、以下のように :php:func:`__()`
で文字列を囲んでください。 ::

    <h2><?php echo __('Posts'); ?></h2>

これ以上何もしなければ、上記の２つのコードの例は、機能的に同じです。それらは、
両方ともブラウザに同じ内容を送信します。 :php:func:`__()` 関数は、
与えられた文字列を翻訳がある場合は翻訳し、そうでなければ何も変更せずに返します。
これは、他の `Gettext <http://en.wikipedia.org/wiki/Gettext>`_ 実装と同様に動作します。
(他の翻訳用の関数 :php:func:`__d()` や :php:func:`__n()` とその他も同様です。)

あなたのコードの複数言語の用意ができたら、次のステップは、
`pot ファイル <http://en.wikipedia.org/wiki/Gettext>`_ の作成です。
これは、あなたのアプリケーション内の全ての翻訳可能文字列のテンプレートです。
pot ファイルを生成するためにしなければならないことは、
:doc:`i18n コンソールタスク </console-and-shells/i18n-shell>` の実行です。
これは、あなたのコード内の翻訳関数が使われている場所を探し、pot ファイルを生成します。
あなたのコードの翻訳が変更があった時にこのコンソールタスクを再実行してください。

pot ファイル自身は、 CakePHP では使用しません。それらのファイルは、翻訳を含む
`po ファイル <http://en.wikipedia.org/wiki/Gettext>`_ を作成したり更新するための
テンプレートです。CakePHP は、以下の場所にある po ファイルを参照します。 ::

    /app/Locale/<locale>/LC_MESSAGES/<domain>.po

デフォルトのドメインは 'default' です。従って、あなたのロケールフォルダは、
以下のようになります。 ::

    /app/Locale/eng/LC_MESSAGES/default.po (英語)
    /app/Locale/fra/LC_MESSAGES/default.po (フランス語)
    /app/Locale/por/LC_MESSAGES/default.po (ポルトガル語)

po ファイルの作成や編集は、あなたの好きなエディタを使用することは、 **お勧めしません** 。
最初に po ファイルを作成するときは、 pot ファイルを適切な場所にコピーし、
(見慣れない書式だと思いますが) 拡張子を変更します。それでは、不正な po ファイルを
作成してしまったり、誤った文字セットで保存してしまうことが簡単に起こります。
(手動で編集した場合、問題を避けるために UTF-8 を使用してください。)
`PoEdit <http://www.poedit.net>`_ のようなフリーのツールを使うと、po ファイルを
簡単な作業で編集や更新できます。特に新たに更新された pot ファイルをもとに既存の
po ファイルを更新する際に便利です。

３文字ロケールコードは、
`ISO 639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_
標準に準拠します。もし、地域ロケール (`en\_US`, `en\_GB`, その他) を作成した場合、
CakePHP はそちらを使用します。 

.. warning::

    2.3 と 2.4 では、ISO 標準を満たすように、いくつかの言語コードが訂正されました。
    詳細は関連する移行ガイドをご覧ください。

po ファイルは、短いメッセージの翻訳には便利ですが、長い文章やページ全体を翻訳したい場合、
他の方法で実装することを検討してください。例えば、 ::

    // App Controller Code.
    public function beforeFilter() {
        $locale = Configure::read('Config.language');
        if ($locale && file_exists(APP . 'View' . DS . $locale . DS . $this->viewPath . DS . $this->view . $this->ext)) {
            // e.g. use /app/View/fra/Pages/tos.ctp instead of /app/View/Pages/tos.ctp
            $this->viewPath = $locale . DS . $this->viewPath;
        }
    }

または、 ::

    // View code
    echo $this->element(Configure::read('Config.language') . '/tos');

.. _lc-time:

LC_TIME カテゴリ文字列の翻訳のために、CakePHP は POSIX 準拠の LC_TIME ファイルを使用します。
:php:class:`CakeTime` ユーティリティクラスと :php:class:`TimeHelper` クラスの i18n 関数は、
LC_TIME ファイルを使用します。

それぞれのロケールディレクトリ直下に LC_TIME ファイルを配置します。 ::

    /app/Locale/fra/LC_TIME (フランス語)
    /app/Locale/por/LC_TIME (ポルトガル語)

いくつかの主要な言語のこれらのファイルは、公式の
`Localized <https://github.com/cakephp/localized>`_ リポジトリをご覧ください。

CakePHP プラグインの国際化
==========================

もし、あなたのアプリケーションに翻訳ファイルを含めたい場合、いくつかの規約に従う必要があります。

`__()` や `__n()` の代わりに `__d()` や `__dn()` を使用してください。"d" はドメインを
意味します。 'DebugKit' というプラグインを使う際、以下のように記述します。 ::

    __d('debug_kit', 'My example text');

アンダースコア構文を使用することが重要です。そうしなければ、
CakePHP があなたの翻訳ファイルを見つけられません。

上記の例のためのあなたの翻訳ファイルは、以下の様になります。 ::

    /app/Plugin/DebugKit/Locale/<locale>/LC_MESSAGES/<domain>.po

そして、他の言語の場合は、 ::

    /app/Plugin/DebugKit/Locale/eng/LC_MESSAGES/debug_kit.po (英語)
    /app/Plugin/DebugKit/Locale/fra/LC_MESSAGES/debug_kit.po (フランス語)
    /app/Plugin/DebugKit/Locale/por/LC_MESSAGES/debug_kit.po (ポルトガル語)

CakePHP が翻訳ドメインと比較のためにプラグイン名を小文字化してアンダースコア区切りにして
使用します。もし、与えられた翻訳ファイルにマッチする場合、プラグインの中を参照します。

翻訳順の制御
============

Configure の ``I18n.preferApp`` 値は、翻訳の順番を制御するのに使用します。
bootstrap で true にセットすると、プラグインの翻訳よりアプリケーションの翻訳を優先します。 ::

    Configure::write('I18n.preferApp', true);

デフォルトでは ``false`` です。

.. versionadded:: 2.6

CakePHP における地域化
======================

あなたのアプリケーションの言語の変更や設定をするために必要なことは、以下の通りです。 ::

    Configure::write('Config.language', 'fra');

上記は、どのロケールを使用するかを CakePHP に伝えます。 (例えば、 `fr\_FR`
の様な地域ロケールを使用していて、 もし翻訳が存在しない時は代わりに `ISO 639-2
<http://www.loc.gov/standards/iso639-2/php/code_list.php>`_
ロケールを使用します。) リクエストの間にいつでも言語を変更できます。
例えば、bootstrap 中でアプリケションのデフォルトの言語を設定した場合、
コントローラの beforeFilter でリクエストやユーザーや実際に異なる言語のメッセージに
したい時はいつでも変更できます。現在のユーザの言語をセットするために、
以下の様に Session オブジェクトに設定を保存することができます。 ::

    $this->Session->write('Config.language', 'fra');

各リクエストの始まるとき、コントローラの ``beforeFilter`` 内で ``Configure`` を
設定してください。 ::

    class AppController extends Controller {
        public function beforeFilter() {
            if ($this->Session->check('Config.language')) {
                Configure::write('Config.language', $this->Session->read('Config.language'));
            }
        }
    }

上記の様にすることで、 :php:class:`I18n` と :php:class:`TranslateBehavior`
の両方が同じ言語の値にアクセスすることを保証します。

単一の URL で複数言語の公開コンテンツを提供することは良い考えです。
これは、(サーチエンジンも含めて) ユーザーが望む言語で探し物を見つけることが容易になります。
実現には、いくつかの方法があります。サブドメインに言語を指定する方法 (en.exaple.com,
fra.example.com など)、このアプリケーション上の URL にプレフィックスを使用する方法など。
他には、ブラウザーのユーザーエージェントから情報を収集したいと考えるかもしれません。

前のセクションで言及したとおり、 :php:func:`__()` 便利関数やその他のグローバルに利用できる
翻訳関数を使って、地域化したコンテンツを表示します。しかし、あなたのビューの中で最適化します。
関数の第一引数は、 .po ファイル内で定義された msgid として利用されます。

CakePHP は、自動的に ``$validate`` 配列中のすべてのモデルのバリデーションエラーメッセージは
地域化されます。i18n シェルを実行した時、これらの文字列が抽出されます。

翻訳関数を使用することでカバーできないアプリケーションの地域化の側面があります。
それは、日付やお金のフォーマットです。CakePHP は PHP であることを忘れないでください。
これらのためのフォーマットを設定するには、 `setlocale <http://www.php.net/setlocale>`_
を使用する必要があります。

もし、コンピュータに存在しないロケールを `setlocale <http://www.php.net/setlocale>`_
に指定した場合、何も影響しません。ターミナル上で、 ``locale -a`` コマンドを実行することで、
利用可能な一覧を取得できます。

モデルのバリデーションエラーを翻訳
==================================

:doc:`i18n コンソールタスク </console-and-shells>` を使用することで、 CakePHP は
自動的にバリデーションエラーを抽出します。デフォルトで、デフォルトドメインが使用されます。
これは、モデルの中の ``$validationDomain`` プロパティを設定することによって
上書きすることができます。 ::

    class User extends AppModel {

        public $validationDomain = 'validation_errors';
    }

バリデーションルールの中で定義された追加のパラメータは、翻訳関数で処理されます。
これは、動的にバリデーションメッセージを作成することができます。 ::

    class User extends AppModel {

        public $validationDomain = 'validation';

        public $validate = array(
            'username' => array(
                    'length' => array(
                    'rule' => array('between', 2, 10),
                    'message' => 'Username should be between %d and %d characters'
                )
            )
        )
    }

以下のように内部的に呼びだされます。 ::

    __d('validation', 'Username should be between %d and %d characters', array(2, 10));


.. meta::
    :title lang=ja: 国際化と地域化
    :keywords lang=ja: 国際化 地域化,国際化と地域化,ローカライズ機能,言語アプリケーション,gettext,l10n,面倒なタスク,脚色,pot,i18n,観客,翻訳,言語
