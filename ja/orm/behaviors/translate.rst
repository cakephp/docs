Translate
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TranslateBehavior

Translate ビヘイビアーは、エンティティーの複数の言語で翻訳されたコピーを作成し、取得することができます。
これは、独立した ``i18n`` テーブルを使って行います。このテーブルと結び付けられている任意の
Table オブジェクトの各フィールドの翻訳を格納します。

.. warning::

    TranslateBehavior は、現時点では複合主キーをサポートしていません。

クイックツアー
==============

データベース内に ``i18n`` テーブルを作成した後、翻訳できるようにしたい
Table オブジェクトにビヘイビアーを追加してください。 ::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title']]);
        }
    }

次に、アプリケーションの言語を変更して、エンティティーを取得するために使用する言語を選択します。
これはすべての翻訳に影響します。 ::

    // コントロールの中。例えば、スペイン語にロケールを変更。
    I18n::setLocale('es');
    $this->loadModel('Articles');

次に、既存のエンティティーを取得します。 ::

    $article = $this->Articles->get(12);
    echo $article->title; // 'A title' と出力、まだ未翻訳。

次に、エンティティーを翻訳します。 ::

    $article->title = 'Un Artículo';
    $this->Articles->save($article);

再びエンティティーを取得してみます。 ::

    $article = $this->Articles->get(12);
    echo $article->title; // 'Un Artículo' と出力、超簡単！

複数の翻訳での動作は、Entity クラスに特別なトレイトを使用して行うことができます。 ::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

これで、単一のエンティティーのすべての翻訳を見つけることができます。 ::

    $article = $this->Articles->find('translations')->first();
    echo $article->translation('es')->title; // 'Un Artículo'

    echo $article->translation('en')->title; // 'An Article';

同様に複数の翻訳を一度に保存することも簡単です。 ::

    $article->translation('es')->title = 'Otro Título';
    $article->translation('fr')->title = 'Un autre Titre';
    $this->Articles->save($article);

動作の仕方や必要に応じたビヘイビアーの調整方法について詳しく知りたい場合は、
この章の残りの部分を読んでください。

i18n データベーステーブルの初期化
=================================

ビヘイビアーを使用するためには、正しいスキーマで ``i18n`` テーブルを作成する必要があります。
現在、 ``i18n`` テーブルを読み込む唯一の方法は、手動でデータベースに次の
SQL スクリプトを実行することです。

.. code-block:: sql

    CREATE TABLE i18n (
        id int NOT NULL auto_increment,
        locale varchar(6) NOT NULL,
        model varchar(255) NOT NULL,
        foreign_key int(10) NOT NULL,
        field varchar(255) NOT NULL,
        content text,
        PRIMARY KEY (id),
        UNIQUE INDEX I18N_LOCALE_FIELD(locale, model, foreign_key, field),
        INDEX I18N_FIELD(model, foreign_key, field)
    );

スキーマは、 **/config/schema/i18n.sql** の中で sql ファイルとして提供されています。

言語省略形の注意: Translate ビヘイビアーは言語識別子に制限はありませんが、
可能な値は、 ``locale`` カラムの型とサイズによってのみ制限されています。
``es-419`` (ラテンアメリカのスペイン語、言語省略形と地域コード
`UN M.49 <https://en.wikipedia.org/wiki/UN_M.49>`_) のように省略形を使用したい場合に備えて、
``locale`` は ``varchar(6)`` として定義されます。

.. tip::

    :doc:`国際化と地域化 </core-libraries/internationalization-and-localization>`
    で必要なものと同じ言語省略形を使用するのが賢明です。そうすると、一貫性があり、
    言語を切り替えることは、 ``Translate ビヘイビアー`` と ``国際化と地域化`` の両方が等しく動作します。

したがって、 ``en`` 、 ``fr`` 、 ``de`` のような 2 文字の ISO コードまたは、
言語とそれが話される国の両方が含まれている ``fr_FR`` 、 ``es_AR`` 、 ``da_DK``
のような完全なロケール名のいずれかを使用することをお勧めします。

Table への Translate ビヘイビアーの追加
=======================================

ビヘイビアーの追加は、Table クラスの ``initialize()`` メソッドで行うことができます。 ::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

最初に注意しなければならないのは、設定配列に ``fields`` キーを渡す必要があるということです。
このフィールドのリストは、どのカラムが翻訳を格納できるかをビヘイビアーに伝えるために必要です。

別の翻訳テーブルの利用
----------------------

特定のリポジトリーを翻訳するために ``i18n`` 以外のテーブルを使用する場合は、
ビヘイビアーの設定で指定することができます。これは、翻訳するテーブルが複数あり、
それぞれのテーブルごとに格納されているデータをより明確に分離したい場合によく使用されます。 ::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Translate', [
                'fields' => ['title', 'body'],
                'translationTable' => 'ArticlesI18n'
            ]);
        }
    }

使用する独自のテーブルに、 ``field`` 、 ``foreign_key`` 、 ``locale`` 、 ``model``
というカラムがあることを確認する必要があります。

翻訳された内容の読み込み
========================

上記に示したように、読み込まれたエンティティーの有効な翻訳を選ぶために
``locale()`` メソッドを使用することができます。 ::

    // コントローラーの先頭で I18n コア機能をロード
    use Cake\I18n\I18n;

    // 次に、アクションの中で言語を変更することができます。
    I18n::setLocale('es');
    $this->loadModel('Articles');

    // 結果のすべてのエンティティーは、スペイン語の翻訳が含まれています。
    $results = $this->Articles->find()->all();

このメソッドは、Table 内の任意のファインダーで動作します。
たとえば、 ``find('list')`` で TranslateBehavior を使用することができます。 ::

    I18n::setLocale('es');
    $data = $this->Articles->find('list')->toArray();

    // データが含まれます。
    [1 => 'Mi primer artículo', 2 => 'El segundo artículo', 15 => 'Otro articulo' ...]

エンティティーのすべての翻訳を取得
----------------------------------

翻訳されたコンテンツを更新するためのインターフェイスを構築するときに、
同時に1つまたは複数の翻訳を表示すると便利です。
このために ``translations`` ファインダーを使用することができます。 ::

    // すべての対応する翻訳を持つ最初の記事を検索
    $article = $this->Articles->find('translations')->first();

上記の例では、 ``_translations`` プロパティーが設定されたエンティティーのリストを取得します。
このプロパティーは、翻訳データエンティティーのリストが含まれます。
たとえば、次のプロパティーがアクセス可能になります。 ::

    // 出力結果 'en'
    echo $article->_translations['en']->locale;

    // 出力結果 'title'
    echo $article->_translations['en']->field;

    // 出力結果 'My awesome post!'
    echo $article->_translations['en']->body;

このデータを扱うためのよりエレガントな方法は、
テーブルに使用されるエンティティークラスにトレイトを追加することです。 ::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

このトレイトには ``translation`` というメソッドが含まれています。
これにより、新しい翻訳エンティティーにその場でアクセスしたり作成することができます。 ::

    // 出力結果 'title'
    echo $article->translation('en')->title;

    // 新しい翻訳データエンティティーを article に追加
    $article->translation('de')->title = 'Wunderbar';

取得する翻訳を制限
------------------

特定のレコードセットのためにデータベースから取得される言語を制限することができます。 ::

    $results = $this->Articles->find('translations', [
        'locales' => ['en', 'es']
    ]);
    $article = $results->first();
    $spanishTranslation = $article->translation('es');
    $englishTranslation = $article->translation('en');

空の翻訳の取得を防止
--------------------

翻訳レコードには任意の文字列を含めることができますが、
もしレコードが翻訳されて空文字列（''）として格納されている場合、
translate ビヘイビアーは元のフィールド値を上書きします。

これが望ましくない場合は、 ``allowEmptyTranslations`` 設定キーを使用して、
空である翻訳を無視することができます。 ::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Translate', [
                'fields' => ['title', 'body'],
                'allowEmptyTranslations' => false
            ]);
        }
    }

上記は、内容のある翻訳されたデータのみを読み込みます。

アソシエーションのすべての翻訳を取得
------------------------------------

単一の検索操作で任意のアソシエーションの翻訳を見つけることもできます。 ::

    $article = $this->Articles->find('translations')->contain([
        'Categories' => function ($query) {
            return $query->find('translations');
        }
    ])->first();

    // 出力結果 'Programación'
    echo $article->categories[0]->translation('es')->name;

これは、 ``Categories`` に TranslateBehavior が追加されていることを前提としています。
アソシエーションで ``translations`` カスタムファインダーを使用するには、クエリービルダー関数の
``contain`` 句を単に使用するだけです。

I18n::locale を使用せずに一つの言語の取得
-----------------------------------------

``I18n::setLocale('es');`` を呼び出すと、翻訳されたすべての検索のデフォルトロケールが変更されますが、
アプリケーションの状態を変更せずに翻訳されたコンテンツを取得したいことがあります。
これらの状況には、ビヘイビアーの ``locale()`` メソッドを使用してください。 ::

    I18n::setLocale('en'); // 説明のためにリセット

    $this->loadModel('Articles');
    $this->Articles->locale('es'); // 特定のロケール

    $article = $this->Articles->get(12);
    echo $article->title; // 'Un Artículo' と出力、超簡単！

これは、Articles テーブルのみのロケールを変更し、
関連するデータの言語に影響を与えないことに注意してください。
関連するデータに影響を与えるためには、各テーブルで locale を呼び出すことが必要です。例えば、 ::

    I18n::setLocale('en'); // 説明のためにリセット

    $this->loadModel('Articles');
    $this->Articles->locale('es');
    $this->Articles->Categories->locale('es');

    $data = $this->Articles->find('all', ['contain' => ['Categories']]);

この例では、 ``Categories`` も TranslateBehavior が追加されていることを前提としています。

翻訳されたフィールドのクエリー
-------------------------------

TranslateBehavior は、デフォルトでは検索条件を置換しません。
翻訳されたフィールドの検索条件を作成するには ``translationField()`` メソッドを使用します。 ::

    $this->Articles->locale('es');
    $data = $this->Articles->find()->where([
        $this->Articles->translationField('title') => 'Otro Título'
    ]);

別の言語で保存
==============

TranslateBehavior の背後にある哲学は、デフォルトの言語を表すエンティティー、
およびそのエンティティー内の特定のフィールドを上書きできる複数の翻訳を持っているということです。
これを踏まえて、直感的に任意のエンティティーの翻訳を保存することができます。
たとえば、次のような設定になります。 ::

    // src/Model/Table/ArticlesTable.php の中で
    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

    // src/Model/Entity/Article.php の中で
    class Article extends Entity
    {
        use TranslateTrait;
    }

    // コントローラーの中で
    $articles = $this->loadModel('Articles');
    $article = new Article([
        'title' => 'My First Article',
        'body' => 'This is the content',
        'footnote' => 'Some afterwords'
    ]);

    $this->Articles->save($article);

最初の記事を保存した後、その翻訳を保存することができる２通りの方法があります。
１つ目、エンティティーに直接言語を設定します。 ::

    $article->_locale = 'es';
    $article->title = 'Mi primer Artículo';

    $this->Articles->save($article);

エンティティーが保存された後、翻訳されたフィールドも同様に永続化されますが、
もう１つの注意点は、デフォルトの言語の値は上書きされずに保存されることです。 ::

    // 出力結果 'This is the content'
    echo $article->body;

    // 出力結果 'Mi primer Artículo'
    echo $article->title;

一度、値を上書きすると、そのフィールドの翻訳が保存され、通常通りに取得することができます。 ::

    $article->body = 'El contendio';
    $this->Articles->save($article);

別の言語でエンティティーを保存するために使用する２つ目の方法は、
直接テーブルにデフォルトの言語を設定することです。 ::

    $article->title = 'Mi Primer Artículo';

    $this->Articles->locale('es');
    $this->Articles->save($article);

同じ言語でエンティティーを取得や保存の両方が必要な時や、複数のエンティティーを一括で保存する時に、
テーブルに直接言語を設定すると便利です。

.. _saving-multiple-translations:

複数の翻訳を保存
================

任意のデータベースのレコードに複数の翻訳を同時に追加したり編集したりできるようにすることは、
一般的な要件です。これは、 ``TranslateTrait`` を使用して行うことができます。 ::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

次に、それらを保存する前に翻訳を取り込むことができます。 ::

    $translations = [
        'fr' => ['title' => "Un article"],
        'es' => ['title' => 'Un artículo']
    ];

    foreach ($translations as $lang => $data) {
        $article->translation($lang)->set($data, ['guard' => false]);
    }

    $this->Articles->save($article);

3.3.0 では、複数の翻訳での動作は簡素化されました。
翻訳されたフィールドのフォームコントロールを作成することができます。 ::

    // ビューテンプレートの中で
    <?= $this->Form->create($article); ?>
    <fieldset>
        <legend>French</legend>
        <?= $this->Form->control('_translations.fr.title'); ?>
        <?= $this->Form->control('_translations.fr.body'); ?>
    </fieldset>
    <fieldset>
        <legend>Spanish</legend>
        <?= $this->Form->control('_translations.es.title'); ?>
        <?= $this->Form->control('_translations.es.body'); ?>
    </fieldset>

コントローラーの中では、通常通りにデータをマーシャリングできます。 ::

    $article = $this->Articles->newEntity($this->request->getData());
    $this->Articles->save($article);

これは、すべてが永続化されたフランス語とスペイン語の翻訳の記事になります。
同様に、エンティティーの ``$_accessible`` フィールドの中に
``_translations`` を追加することを忘れないでください。

翻訳されたエンティティーの検証
------------------------------

モデルに ``TranslateBehavior`` を追加した場合、 ``newEntity()`` や ``patchEntity()`` で、
ビヘイビアーによって翻訳レコードが作成・更新される際に使用するバリデータを定義できます。 ::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', [
                'fields' => ['title'],
                'validator' => 'translated'
            ]);
        }
    }

上記は、翻訳されたエンティティーを検証するための ``validationTranslated``
によって作成されるバリデータを使用します。

.. versionadded:: 3.3.0
    翻訳されたエンティティーの検証と合理化された翻訳の保存は、3.3.0 で追加されました。
