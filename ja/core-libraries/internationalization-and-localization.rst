国際化と地域化
##############

アプリケーションをより多くのユーザーに届けるのに最も良い方法の一つは、
複数の言語に対応することです。これは、しばしば気が遠くなるような作業になります。
しかし、CakePHP の国際化と地域化の機能は、これを容易にします。

まずは、いくつかの専門用語について理解しましょう。
国際化 *(internationalization)* とは、あるアプリケーションを地域化できるようにすることです。
地域化 *(localization)* とは、あるアプリケーションを特定の言語や文化での表現(
すなわちロケール *(locale)*) に適応させることです。国際化と地域化は、それぞれ「i18n」と
「l10n」というように省略されます。「internationalization (国際化)」の最初と最後の文字の間に
18文字あるから「i18n」となり、「localization (地域化)」も同様の理由で「l10n」となります。

翻訳の準備
==========

単一言語のアプリケーションから、複数言語のアプリケーションに移行するためには、
数ステップを踏むだけです。最初のステップは、 :php:func:`__()` 関数をあなたのコードで
使用することです。以下が単一言語アプリケーションのとあるコードの例です。 ::

      <h2>Popular Articles</h2>

あなたのコードを国際化するためには、以下のように :php:func:`__()`
で文字列を囲んでください。 ::

      <h2><?= __('Popular Articles') ?></h2>

これ以上何もしなければ、上記の２つのコードの例は、機能的に同じです。それらは、
両方ともブラウザに同じ内容を送信します。 :php:func:`__()` 関数は、
与えられた文字列を翻訳がある場合は翻訳し、そうでなければ何も変更せずに返します。

言語ファイル
------------

翻訳はアプリケーションの中にある言語ファイルを使って有効になります。
CakePHP 翻訳ファイルのデフォルトの形式は、 `Gettext <http://en.wikipedia.org/wiki/Gettext>`_
です。ファイルは **src/Locale** 以下に置かれる必要があります。各言語用のサブフォルダは
以下のようになっている必要があります。 ::

    /src
        /Locale
            /en_US
                default.po
            /en_GB
                default.po
                validation.po
            /es
                default.po

デフォルトのドメインは 'default' です。ロケールフォルダは上記のように少なくとも **default.po**
ファイルを含まなくてはなりません。ドメインは翻訳メッセージの任意のグルーピングを参照します。
グループが使われていない場合、デフォルトのグループが選択されます。

CakePHP のライブラリから抜き出されたコアの文字列は **src/Locale** 内の **cake.po** という名前の
ファイルに分けて置かれます。 `CakePHP localized library <https://github.com/cakephp/localized>`_
は、コア (Cake のドメイン) の中にクライエント・フェイシングな翻訳文字列を置いています。
これらのファイルを利用するには、期待された場所 **src/Locale/<locale>/cake.po** にリンク
またはコピーをしてください。もし不完全または正しくない場合は、修正するためにこのリポジトリに
PR を送ってください。

プラグインは、翻訳ファイルをも含みます。プラグインの名前が ``under_scored`` なバージョンのものを、
翻訳メッセージのドメインとして利用する方法は以下の通りです。 ::

    MyPlugin
        /src
            /Locale
                /fr
                    my_plugin.po
                /de
                    my_plugin.po

翻訳フォルダは、2文字の言語 ISO コード、または、言語及び話されている国を含む
``fr_FR``, ``es_AR``, ``da_DK`` のような完全なロケールの名称にしてください。

翻訳ファイルの具体例は以下のようになります。

.. code-block:: pot

     msgid "My name is {0}"
     msgstr "Je m'appelle {0}"

     msgid "I'm {0,number} years old"
     msgstr "J'ai {0,number} ans"

I18n を利用して Pot ファイルを生成する
--------------------------------------

アプリケーション内の、 `__()` や他の国際化されたメッセージから pot ファイルを生成するためには、
i18n シェルを利用できます。より知りたい場合は、 :doc:`次の章 </console-and-shells/i18n-shell>`
を読んでください。

デフォルトのロケールを設定する
------------------------------

デフォルトのロケールは **config/app.php** ファイルの ``App.defaultLocale``
を以下のようにすることで設定できます。 ::

    'App' => [
        ...
        'defaultLocale' => env('APP_DEFAULT_LOCALE', 'en_US'),
        ...
    ]

これは、CakePHP が提供している地域化のライブラリを使うと示されている場合いつでも、
デフォルトの翻訳言語、日付のフォーマット、番号のフォーマットおよび通貨を含む、
アプリケーションのいくつかの様相をコントロールします。

ランタイムでロケールを変更する
------------------------------

翻訳文字列の言語を変更する場合はこのメソッドを呼び出せます。 ::

    use Cake\I18n\I18n;

    I18n::setLocale('de_DE');

地域化のツールを使うと、これは数字や日付がどのようにフォーマットされているかについても変更します。

翻訳の機能を利用する
====================

CakePHP はアプリケーションを国際化する手助けになるさまざまな機能を提供しています。
最も頻繁に使われているものとして :php:func:`__()` があります。
この機能は一つの翻訳メッセージを引き出すか、見つからなかった場合は同じ文字列を返します。 ::

    echo __('Popular Articles');


もし、プラグインの中などで、メッセージをまとめる必要がある場合は、
別のドメインからメッセージを取ってくるのに :php:func:`__d()` が利用できます。 ::

    echo __d('my_plugin', 'Trending right now');

.. note::

    もし、名前空間付きのプラグインを翻訳したい場合、ドメイン文字列には ``Namespace/PluginName``
    と名前を付けなければなりません。しかし、関連する言語ファイルは、プラグインのフォルダの中の
    ``plugins/Namespace/PluginName/src/Locale/plugin_name.po`` になります。

翻訳の際に、翻訳すべき文字列が曖昧であることがあります。
これは、2つの文字列がまったく同じであるのに異なることがらを指し示している場合に起こりえます。
例えば、英語では 'letter' という単語は複数の意味を持ちます。この問題を解決するために
:php:func:`__x()` を利用することができます。 ::

    echo __x('written communication', 'He read the first letter');

    echo __x('alphabet learning', 'He read the first letter');

第1引数はメッセージの文脈を示し、第2引数は翻訳されるべきメッセージです。

翻訳メッセージで変数を利用する
------------------------------

翻訳関数を利用すると、メッセージの中あるいは翻訳された文字列の中で定義された特別なマーカーを
用いているメッセージの中で変数を補完することができます。 ::

    echo __("Hello, my name is {0}, I'm {1} years old", ['Sara', 12]);

マーカーは数値で、渡された配列のキーに対応します。関数に独立した引数として変数を渡すことも可能です。 ::

    echo __("Small step for {0}, Big leap for {1}", 'Man', 'Humanity');

あらゆる翻訳関数はプレースホルダーの置き換えに対応しています。 ::

    __d('validation', 'The field {0} cannot be left empty', 'Name');

    __x('alphabet', 'He read the letter {0}', 'Z');


``'`` (シングルクオーテーション) は、翻訳メッセージの中ではエスケープコードとして扱われます。
シングルクオーテーションの間の変数は、置き換えられませんし、文字通りのテキストとして扱われます。
例えば、 ::

    __("This variable '{0}' be replaced.", 'will not');

変数の中で2つ連続してクオーテーションを用いると適切に置き換えられます。 ::

    __("This variable ''{0}'' be replaced.", 'will');

これらの関数は `ICU MessageFormatter <http://php.net/manual/ja/messageformatter.format.php>`_
を活用しています。そのためメッセージと地域化された日付や番号、通貨とを同時に翻訳することが可能です。 ::

    echo __(
        'Hi {0}, your balance on the {1,date} is {2,number,currency}',
        ['Charles', new FrozenTime('2014-01-13 11:12:00'), 1354.37]
    );

    // 結果
    Hi Charles, your balance on the Jan 13, 2014, 11:12 AM is $ 1,354.37

プレースホルダーの中の数字は、出力のきめ細やかなコントロールによって、同様にフォーマットされます。 ::

    echo __(
        'You have traveled {0,number} kilometers in {1,number,integer} weeks',
        [5423.344, 5.1]
    );

    // 結果
    You have traveled 5,423.34 kilometers in 5 weeks

    echo __('There are {0,number,#,###} people on earth', 6.1 * pow(10, 8));

    // 結果
    There are 6,100,000,000 people on earth

以下は、 ``number`` という言葉の後に続けられるフォーマット修飾子のリストです:

* ``integer``: 小数の部分を取り除く
* ``currency``: 地域の通貨、を利用し、小数点以下を丸めます
* ``percent``: パーセントとして数をフォーマットします

日付は、プレースホルダーの数値の後に ``date`` という語を利用することによってフォーマットされます。
以下は特別なオプションのリストです:

* ``short``
* ``medium``
* ``long``
* ``full``

プレースホルダーの数値の後に ``time`` という語も使用でき、 ``date`` と同じオプションとして認識されます。

.. note::

    named プレースホルダーは PHP 5.5 以上でサポートされており、 ``{name}`` として
    フォーマットされます。named プレースホルダーを用いたい場合は、key/value ペアを用いた配列として
    変数を渡してください。たとえば、 ``['name' => 'Sara', 'age' => 12]`` というようにです。

    CakePHP で国際化の機能を活用する場合は PHP 5.5 以上を利用することが推奨されています。
    ``php5-intl`` エクステンションがインストールされていなくてはなりませんし、ICU のバージョンは
    48.x.y よりも上であるべきです ( ``Intl::getIcuVersion()`` で ICU のバージョンを確認してください)。

複数形
------

見せる言語によって、メッセージを正しく複数形にすることは、アプリケーションの国際化において
重要な部分のひとつです。CakePHP はメッセージの中の複数形を正しく選択するいつかの方法を提供しています。

ICU の複数形選択を利用する
~~~~~~~~~~~~~~~~~~~~~~~~~~

一つ目は、翻訳関数のデフォルトである ``ICU`` のメッセージフォーマットを活用する方法です。
翻訳ファイルにおいて、以下の文字列があるかもしれません。

.. code-block:: pot

     msgid "{0,plural,=0{No records found} =1{Found 1 record} other{Found # records}}"
     msgstr "{0,plural,=0{Ningún resultado} =1{1 resultado} other{# resultados}}"

     msgid "{placeholder,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}"
     msgstr "{placeholder,plural,=0{Ningún resultado} =1{1 resultado} other{{1} resultados}}"

そしてアプリケーション内では、このような文字列の翻訳のどちらかを出力するために、以下のようなコードを
使ってください。 ::

    __('{0,plural,=0{No records found }=1{Found 1 record} other{Found # records}}', [0]);

    // 引数 {0} を 0 として "Ningún resultado" を返します。

    __('{0,plural,=0{No records found} =1{Found 1 record} other{Found # records}}', [1]);

    // 引数 {0} は 1 なので "1 resultado" を返します。

    __('{placeholder,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}', [0, 'many', 'placeholder' => 2])

    // 引数 {placeholder} は 2 で、引数 {1} は 'many' なので
    // "many resultados" を返します。

いま利用したフォーマットをよくみると、どのようにメッセージが構築されているのかがはっきりするでしょう。 ::

    { [count placeholder],plural, case1{message} case2{message} case3{...} ... }

この ``[count placeholder]`` は翻訳関数にわたす変数の配列の key の番号です。
正しい複数形を選択するのに使われます。

``{message}`` の中の ``[count placeholder]`` を参照するためには ``#`` を
利用しなくてはならないことに注意してください。

もちろん、コードの中で完全な複数形を求めていない場合は、メッセージ ID をよりシンプルにすることができます。

.. code-block:: pot

     msgid "search.results"
     msgstr "{0,plural,=0{Ningún resultado} =1{1 resultado} other{{1} resultados}}"

この場合は新しい文字列を使います。 ::

    __('search.results', [2, 2]);

    // 戻り値: "2 resultados"

後者のバージョンでは、デフォルトの言語でさえも翻訳ファイルが必要になるという欠点がありますが、
コードの可読性が上がり、複雑な複数形の選択文字列が翻訳ファイルに入らないという利点もあります。

複数形において、直接数値を指定するやり方は実用的でないことがあります。例えば、アラビア語のような言語では、
少ないものの複数形と多いものの複数形が異なります。
このような場合は ICU のマッチングエイリアスを利用できます。以下のように書く代わりに::

    =0{No results} =1{...} other{...}

以下のようにすることができます。 ::

    zero{No Results} one{One result} few{...} many{...} other{...}

各言語のエイリアスの完全な概要を知りたい場合は
`Language Plural Rules Guide <http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html>`_
をご参照ください。

Gettext の複数形選択を使用する
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

二番目の複数形のフォーマットは、Gettext のビルトイン機能を用いたものです。
この場合、複数形ごとに分かれた翻訳メッセージの行を作成した ``.po`` ファイルに複数形が置かれます。:

.. code-block:: pot

    # One message identifier for singular
    msgid "One file removed"
    # Another one for plural
    msgid_plural "{0} files removed"
    # Translation in singular
    msgstr[0] "Un fichero eliminado"
    # Translation in plural
    msgstr[1] "{0} ficheros eliminados"

これを別のフォーマットで利用するとき、別の翻訳機能を利用する必要があります。 ::

    // 戻り値: "10 ficheros eliminados"
    $count = 10;
    __n('One file removed', '{0} files removed', $count, $count);

    // ドメインの中でそれを使うことが可能です。
    __dn('my_plugin', 'One file removed', '{0} files removed', $count, $count);

``msgstr[]`` 内の数値は、言語の複数形のために Gettext によって割り当てられた数値です。
言語によっては、例えばクロアチア語では、2つ以上の複数形が存在します。

.. code-block:: pot

    msgid "One file removed"
    msgid_plural "{0} files removed"
    msgstr[0] "{0} datoteka je uklonjena"
    msgstr[1] "{0} datoteke su uklonjene"
    msgstr[2] "{0} datoteka je uklonjeno"

各言語の数値の複数形についてより詳細な説明は
`Launchpad languages page <https://translations.launchpad.net/+languages>`_ をご覧ください。

独自の翻訳機構を作成する
========================

翻訳のメッセージが置かれている場所や方法についての CakePHP の慣習を拡張する必要がもしあるのなら、
独自の翻訳メッセージローダーを作成することができます。独自の翻訳機構を作成する最も簡単な方法は、
1つのドメインのローダーを指定して、以下を設置します。 ::

    use Aura\Intl\Package;

    I18n::translator('animals', function () {
        $package = new Package(
            'default', // フォーマット戦略 (ICU)
            'default'  // フォールバックドメイン
        );
        $package->setMessages([
            'Dog' => 'Chien',
            'Cat' => 'Chat',
            'Bird' => 'Oiseau'
            ...
        ]);

        return $package;
    }, 'fr_FR');

上記のコードは **config/bootstrap.php** に追加してください。そうすれば翻訳の機能が使われる前に
見つかります。翻訳機構を作成するのに最低限必要なのは、ローダー機能が ``Aura\Intl\Package``
オブジェクトを返すことです。一旦コードを置けば、翻訳機能は以下のように利用できるでしょう。 ::

    I18n::setLocale('fr_FR');
    __d('animals', 'Dog'); // "Chien" を返す

見てお分かりの通り、 ``Package`` オブジェクトは配列として翻訳メッセージを受け取ります。
インラインコードや、他のファイルの読み込み、別の機能の呼び出しなどのときに、いつでも
``setMessages()`` メソッドを渡すことができます。CakePHP はメッセージが読み込まれる場所を
変える必要がある場合に、使いまわせるいくつかのローダ機能を提供しています。例えば、
**.po** ファイルを利用しているのに、他の場所から読み込みたい場合は、 ::

    use Cake\I18n\MessagesFileLoader as Loader;

    // src/Locale/folder/sub_folder/filename.po からメッセージをロード

    I18n::setTranslator(
        'animals',
        new Loader('filename', 'folder/sub_folder', 'po'),
        'fr_FR',
    );

のようになります。

メッセージのパーサーを作成する
------------------------------

CakePHP が利用しているものと同じやり方を使い続けることもできますが、 ``PoFileParser``
以外のメッセージパーサーを利用してみてください。たとえば、 ``YAML`` を用いた翻訳メッセージを
読み込みたい場合、まずはじめにパーサークラスを作成する必要があります。 ::

    namespace App\I18n\Parser;

    class YamlFileParser
    {

        public function parse($file)
        {
            return yaml_parse_file($file);
        }
    }

アプリケーションの **src/I18n/Parser** ディレクトリ内にこのファイルを作成してください。
続いて、 **src/Locale/fr_FR/animals.yaml** として翻訳ファイルを作ります。

.. code-block:: yaml

    Dog: Chien
    Cat: Chat
    Bird: Oiseau

最後に、翻訳を読み込むドメインと場所を設定します。 ::

    use Cake\I18n\MessagesFileLoader as Loader;

    I18n::setTranslator(
        'animals',
        new Loader('animals', 'fr_FR', 'yaml'),
        'fr_FR'
    );

.. _creating-generic-translators:

包括的な翻訳機構を作成する
--------------------------

対応が必要なドメインおよび場所ごとに、 ``I18n::translator()`` を呼び出して翻訳機構を設定するのは、
非常に面倒です。わずかな違いで対応が必要な場合は特にです。この問題を避けるために、CakePHP では
ドメインごとに包括的な翻訳機構のローダーを定義することができます。

デフォルトのドメインとあらゆる言語のすべての翻訳を、外部のサービス読み込みたいときのことを
想像してみてください。 ::

    use Aura\Intl\Package;

    I18n::config('default', function ($domain, $locale) {
        $locale = Locale::parseLocale($locale);
        $language = $locale['language'];
        $messages = file_get_contents("http://example.com/translations/$lang.json");

        return new Package(
            'default', // フォーマット機構
            null, // フォールバック (デフォルトドメインにはありません)
            json_decode($messages, true)
        )
    });

上記の例は、翻訳を含む JSON ファイルを読み込む外部のサービスの例です。 アプリケーション内で
リクエストされたどの場所でも ``Package`` オブジェクトをビルドします。

特定のローダーが設定されていない全てのパッケージで、パッケージをロードする方法を変更したい場合、
``_fallback`` パッケージを使用することによって、代替パッケージローダーに置き換えることができます。 ::

    I18n::config('_fallback', function ($domain, $locale) {
        // パッケージを生成するカスタムコードはこちら。
    });

.. versionadded:: 3.4.0
    ``_fallback`` ローダーの置換は、3.4.0 で追加されました。

独自の翻訳機構における複数形と文脈について
------------------------------------------

``setMessages()`` に用いられている配列は、異なるドメイン配下にメッセージを翻訳機構が置くために
指示をだす、または、Gettext の複数形選択のきっかけとなるために作成されます。
以下は、異なる文脈において同じキーを翻訳に設置する例です。 ::

    [
        'He reads the letter {0}' => [
            'alphabet' => 'Él lee la letra {0}',
            'written communication' => 'Él lee la carta {0}'
        ]
    ]

同様にして、メッセージの配列で用いられているGettextの複数形を、複数形ごとのキーを用いて
ネストされた配列で表現することもできます。 ::

    [
        'I have read one book' => 'He leído un libro',
        'I have read {0} books' => [
            'He leído un libro',
            'He leído {0} libros'
        ]
    ]

異なるフォーマット機構を使う
----------------------------

前の例では最初の引数として ``default`` を用いるようにパッケージが作成されていました。そして、
これは使用されているフォーマット機構と対応するコメントを示します。
フォーマット機構は、翻訳メッセージに変数を渡す、そして正しい複数形を選択するクラスです。

もし、レガシーなアプリケーションを扱っている、あるいは ICU メッセージフォーマットが提供している機能が
必要ない場合、CakePHP は ``sprinf`` フォーマット機構も提供しています。 ::

    return Package('sprintf', 'fallback_domain', $messages);

翻訳されるメッセージは ``sprintf()`` 関数に引数を入れて引き渡されます。 ::

    __('Hello, my name is %s and I am %d years old', 'José', 29);

デフォルトのフォーマット機構を最初に使われる以前の CakePHP に作成されたすべての翻訳機構に
設置することができます。

これは、 ``translator()`` や ``config()`` メソッドを使って手で作成された翻訳機構を含みません。 ::

    I18n::defaultFormatter('sprintf');

日付や数値を地域化する
======================

アプリケーションで日付や数値を出力する際に、ページが表示される国や地域の適切なフォーマットに沿って
フォーマットされる必要があることがあります。

日付や数値を表示する方法を変えるためには、現在のロケールの設定を変更し、正しいクラスを使用する
必要があります。 ::

    use Cake\I18n\I18n;
    use Cake\I18n\Time;
    use Cake\I18n\Number;

    I18n::setLocale('fr-FR');

    $date = new Time('2015-04-05 23:00:00');

    echo $date; // 05/04/2015 23:00 と表示

    echo Number::format(524.23); // 524,23 と表示

フォーマットのオプションをより知りたい場合は、 :doc:`/core-libraries/time` や
:doc:`/core-libraries/number` を読んでください。

ORM で返されるデフォルトの日付では結果は ``Cake\I18n\Time`` クラスを利用しています。そのため、
アプリケーションで直接表示することは、現在のロケールの変更に影響されます。

.. _parsing-localized-dates:

地域化された日時データをパースする
----------------------------------

リクエストから地域化されたデータを受け取る場合、ユーザが地域化したフォーマットから日時の情報を
取得するのが良いでしょう。コントローラ、あるいは :doc:`/development/dispatch-filters` では、
日付、時刻、そして日時の型が地域化のフォーマットをパースするために定義できます。 ::

    use Cake\Database\Type;

    // デフォルトのロケールフォーマットのパースを有効化
    Type::build('datetime')->useLocaleParser();

    // カスタム datetime フォーマットパース書式の設定
    Type::build('datetime')->useLocaleParser()->setLocaleFormat('dd-M-y');

    // IntlDateFormatter 定数を使用することもできます。
    Type::build('datetime')->useLocaleParser()
        ->setLocaleFormat([IntlDateFormatter::SHORT, -1]);

デフォルトでパースするフォーマットは、デフォルトの文字列のフォーマットと同じです。

自動でリクエストデータに基づいたロケールを選択する
==================================================

``LocaleSelectorFilter`` をアプリケーション内で使用すると、CakePHP は自動で現在のユーザに基づいた
ロケールを設定します。 ::

    // src/Application.php の中で
    use Cake\I18n\Middleware\LocaleSelectorMiddleware;

    // 新しいミドルウェアを追加するために middleware 関数を更新してください。
    public function middleware($middleware)
    {
        // ミドルウェアの追加し、有効なロケールの設定
        $middleware->add(new LocaleSelectorMiddleware(['en_US', 'fr_FR']));
    }


    // 3.3.0 より前は、 DispatchFilter を使用してください。
    // config/bootstrap.php 内で
    DispatcherFactory::add('LocaleSelector');

    // en_US, fr_FR のみにロケールを制限
    DispatcherFactory::add('LocaleSelector', ['locales' => ['en_US', 'fr_FR']]);

``LocaleSelectorFilter`` は ``Accept-Language`` ヘッダを用いて、ユーザの選択したロケールを
自動的に設定します。どのロケールが自動で使われるかを制限するロケールリストオプションを使用することが
できます。

.. meta::
   :title lang=ja: 国際化と地域化
   :keywords lang=ja: 国際化 地域化,国際化と地域化,ローカライズ機能,言語アプリケーション,gettext,l10n,面倒なタスク,脚色,pot,i18n,観客,翻訳,言語
