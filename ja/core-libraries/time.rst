日付と時刻
##########

.. php:namespace:: Cake\I18n

.. php:class:: Time

:php:class:`TimeHelper` の機能を ``View`` の外で使いたい場合は、
``Time`` クラスを利用してください。 ::

    use Cake\I18n\Time;

    class UsersController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth');
        }

        public function afterLogin()
        {
            $time = new Time($this->Auth->user('date_of_birth'));
            if ($time->isToday()) {
                // 誕生日祝いのメッセージでユーザーに挨拶
                $this->Flash->success(__('Happy birthday to you...'));
            }
        }
    }


内部的には、この ``Time`` ユーティリティを動かすために、CakePHP は
`Chronos <https://github.com/cakephp/chronos>`_ を利用しています。
``Chronos`` と ``DateTime`` でできることはなんでも、 ``Time`` と ``Date`` ですることができます。

.. note::
    3.2.0 以前の CakePHP では `Carbon
    <https://github.com/briannesbitt/Carbon>`__
    が使われていました。

Chronos についてより詳しく知りたい場合は `API ドキュメント
<https://api.cakephp.org/chronos/1.0/>`_ をご覧ください。

.. start-time

Time インスタンスを作成する
===========================

``Time`` インスタンスを作成するにはいくつかの方法があります。 ::

    use Cake\I18n\Time;

    // 日時文字列から作成
    $time = Time::createFromFormat(
        'Y-m-d H:i:s',
        $datetime,
        'America/New_York'
    );

    // タイムスタンプから作成
    $time = Time::createFromTimestamp($ts);

    // 現在時刻を取得
    $time = Time::now();

    // あと、 'new' を使用して
    $time = new Time('2014-01-10 11:11', 'America/New_York');

    $time = new Time('2 hours ago');

``Time`` クラスのコンストラクターは、内部の PHP クラスである ``Datetime`` が受け取れる、
あらゆるパラメーターを受け取ることができます。数値や数字文字列を渡したとき、
UNIX タイムスタンプとして解釈されます。

テストケースでは、 ``setTestNow()`` を使うことで ``now()`` をモックアップできます。 ::

    // 時間の固定
    $now = new Time('2014-04-12 12:22:30');
    Time::setTestNow($now);

    // 結果は '2014-04-12 12:22:30'
    $now = Time::now();

    // 結果は '2014-04-12 12:22:30'
    $now = Time::parse('now');

操作
====

いったん作成した後は、セッターメソッドを使用することで ``Time`` インスタンスを操作できます。 ::

    $now = Time::now();
    $now->year(2013)
        ->month(10)
        ->day(31);

PHP のビルトインの ``DateTime`` クラスで提供されているメソッドも使用できます。 ::

    $now->setDate(2013, 10, 31);

日付はコンポーネントの引き算や足し算で編集できます。 ::

    $now = Time::now();
    $now->subDays(5);
    $now->addMonth(1);

    // strtotime で使用する文字列
    $now->modify('+5 days');

プロパティーにアクセスすることで日付の内部コンポーネントを取得することができます。 ::

    $now = Time::now();
    echo $now->year; // 2014
    echo $now->month; // 5
    echo $now->day; // 10
    echo $now->timezone; // America/New_York

日付を編集する際に、直接これらのプロパティーを指定することもできます。 ::

    $time->year = 2015;
    $time->timezone = 'Europe/Paris';

フォーマットする
================

.. php:staticmethod:: setJsonEncodeFormat($format)

このメソッドは、オブジェクトを json 形式に変換するときに使われる
デフォルトのフォーマットをセットします。 ::

    Time::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // 可変の DataTime 用
    FrozenTime::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // 不変の DateTime 用
    Date::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // 可変の Date 用
    FrozenDate::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // 不変の Date 用

.. note::
    このメソッドは静的に呼び出されなくてはなりません。

.. php:method:: i18nFormat($format = null, $timezone = null, $locale = null)

``Time`` インスタンスで行うごく一般的なことは、フォーマットされたデータを出力することです。
CakePHP は snap を作成します。 ::

    $now = Time::parse('2014-10-31');

    // 地域化された日時のスタンプを出力します。
    echo $now;

    // en-US ロケールでは '10/31/14, 12:00 AM' を出力します。
    $now->i18nFormat();

    // 日付と時刻のフルフォーマットを利用します。
    $now->i18nFormat(\IntlDateFormatter::FULL);

    // 日付のフルフォーマットと時刻のショートフォーマットを利用します。
    $now->i18nFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

    // '2014-10-31 00:00:00' と出力します。
    $now->i18nFormat('yyyy-MM-dd HH:mm:ss');

文字列が表示される希望のフォーマットを特定することも可能です。
この関数に第1引数として `IntlDateFormatter 定数
<http://www.php.net/manual/ja/class.intldateformatter.php>`_ を渡したり、
あるいは以下のリソースで指定されている ICU の日付フルフォーマット文字列を渡すことができます:
http://www.icu-project.org/apiref/icu4c/classSimpleDateFormat.html#details.

グレゴリオ暦以外の暦で日付をフォーマットすることも可能です。 ::

    // 出力結果 'Friday, Aban 9, 1393 AP at 12:00:00 AM GMT'
    $result = $now->i18nFormat(\IntlDateFormatter::FULL, null, 'en-IR@calendar=persian');

以下の暦のタイプがサポートされています。

* japanese
* buddhist
* chinese
* persian
* indian
* islamic
* hebrew
* coptic
* ethiopic

.. versionadded:: 3.1
    グレゴリオ暦以外の暦のサポートは 3.1 で追加されました。

.. note::
   IntlDateFormatter::FULL のような文字列定数のために Intl は ICU ライブラリーを使用します。
   そのライブラリーは、 CLDR (http://cldr.unicode.org/) からデータを取り入れています。
   ライブラリーのバージョンは、 PHP のインストールにとても依存し、バージョンにより異なる結果を返します。

.. php:method:: nice()

あらかじめ定義されている 'nice' フォーマットで出力します。 ::

    $now = Time::parse('2014-10-31');

    // en-USでは 'Oct 31, 2014 12:00 AM' と出力されます。
    echo $now->nice();

``Time`` オブジェクトそのものを変更することなく、出力される日付のタイムゾーンを変更することができます。
一つのタイムゾーンでデータを保存しているけれども、ユーザーのそれぞれのタイムゾーンで表示したい場合に
便利です。 ::

    $now->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris');

第1引数を ``null`` のままにしておくと、デフォルトのフォーマット文字列を使用します。 ::

    $now->i18nFormat(null, 'Europe/Paris');

最後に、日付を表示するのに異なるロケールを利用することができます。 ::

    echo $now->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris', 'fr-FR');

    echo $now->nice('Europe/Paris', 'fr-FR');

デフォルトのロケールとフォーマット文字列を設定する
--------------------------------------------------

``nice`` や ``i18nFormat`` を利用している際に表示される日付のデフォルトのロケールは、
`intl.default_locale <http://www.php.net/manual/en/intl.configuration.php#ini.intl.default-locale>`_ の指令です。
しかしながら、このデフォルト値は実行時にも変更できます。 ::

    Time::setDefaultLocale('es-ES'); // 可変の DateTime 用
    FrozenTime::setDefaultLocale('es-ES'); // 不変の DateTime 用
    Date::setDefaultLocale('es-ES'); // 可変の Date 用
    FrozenDate::setDefaultLocale('es-ES'); // 不変の Date 用

フォーマットメソッドの中で直接異なるローケルが指示されていない限り、今後、
日時はスペインのフォーマットで表示されます。

同様に、 ``i18nFormat`` を利用することでデフォルトのフォーマット文字列を変更できます。 ::

    Time::setToStringFormat(\IntlDateFormatter::SHORT); // 可変の DateTime 用
    FrozenTime::setToStringFormat(\IntlDateFormatter::SHORT); // 不変の DateTime 用
    Date::setToStringFormat(\IntlDateFormatter::SHORT); // 可変の Date 用
    FrozenDate::setToStringFormat(\IntlDateFormatter::SHORT); // 不変の Date 用

    // Date, FrozenDate, FrozenTime にも同じメソッドがあります。
    Time::setToStringFormat([
        \IntlDateFormatter::FULL,
        \IntlDateFormatter::SHORT
    ]);

    // Date, FrozenDate, FrozenTime にも同じメソッドがあります。
    Time::setToStringFormat('yyyy-MM-dd HH:mm:ss');

日付のフォーマット文字列を直接渡すよりも、定数を常に利用することが推奨されています。

相対時間のフォーマットについて
------------------------------

.. php:method:: timeAgoInWords(array $options = [])

現在との相対的な時間を出力することが有用なときがしばしばあります。 ::

    $now = new Time('Aug 22, 2011');
    echo $now->timeAgoInWords(
        ['format' => 'MMM d, YYY', 'end' => '+1 year']
    );
    // 2011年11月10日現在の表示: 2 months, 2 weeks, 6 days ago

``format`` オプションを利用してフォーマットされた相対時間の位置は
``end`` オプションによって定義されます。
``accuracy`` オプションは、それぞれの間隔幅に対してどのレベルまで詳細を出すかをコントロールします。 ::

    // If $timestamp is 1 month, 1 week, 5 days and 6 hours ago
    echo $timestamp->timeAgoInWords([
        'accuracy' => ['month' => 'month'],
        'end' => '1 year'
    ]);
    // 出力結果 '1 month ago'

``accuracy`` を文字列で設定すると、出力をどのレベルまで詳細を出すかの最大値を指定できます。 ::

    $time = new Time('+23 hours');
    // 出力結果 'in about a day'
    $result = $time->timeAgoInWords([
        'accuracy' => 'day'
    ]);

変換
====

.. php:method:: toQuarter()

一旦作成しても、 ``Time`` インスタンスを、タイムスタンプや四半期の値に変換することができます。 ::

    $time = new Time('2014-06-15');
    $time->toQuarter();
    $time->toUnixString();

現在と比較する
==============

.. php:method:: isYesterday()
.. php:method:: isThisWeek()
.. php:method:: isThisMonth()
.. php:method:: isThisYear()

様々な方法で ``Time`` インスタンスと現在とを比較することができます。 ::

    $time = new Time('2014-06-15');

    echo $time->isYesterday();
    echo $time->isThisWeek();
    echo $time->isThisMonth();
    echo $time->isThisYear();

上述のメソッドのいずれも、 ``Time`` インスタンスが現在と一致するかどうかによって、
``true``/``false`` を返します。

間隔を比較する
==============

.. php:method:: isWithinNext($interval)

``wasWithinLast()`` および ``isWithinNext()`` を用いて、与えられた範囲に
``Time`` インスタンスが属しているかどうかを確認できます。 ::

    $time = new Time('2014-06-15');

    // ２日以内かどうか
    echo $time->isWithinNext(2);

    // 次の２週間以内かどうか
    echo $time->isWithinNext('2 weeks');

.. php:method:: wasWithinLast($interval)

``Time`` インスタンスと過去と範囲の中で比較することもできます。 ::

    // 過去２日以内かどうか
    echo $time->wasWithinLast(2);

    // 過去２週間以内かどうか
    echo $time->wasWithinLast('2 weeks');

.. end-time

日付
====

.. php:class: Date

.. versionadded:: 3.2

CakePHP 内の ``Date`` クラスの実装は、API や :php:class:`Cake\\I18n\\Time` メソッドと同じです。
``Time`` と ``Date`` の主要な違いは、 ``Date`` は時刻の成分を記録せず、かつ常に UTC であることです。
以下が例です。 ::

    use Cake\I18n\Date;
    $date = new Date('2015-06-15');

    $date->modify('+2 hours');
    // 出力結果 2015-06-15 00:00:00
    echo $date->format('Y-m-d H:i:s');

    $date->modify('+36 hours');
    // 出力結果 2015-06-15 00:00:00
    echo $date->format('Y-m-d H:i:s');

``Date`` インスタンスでタイムゾーンを変更しようとしても、無視されます。 ::

    use Cake\I18n\Date;
    $date = new Date('2015-06-15');
    $date->setTimezone(new \DateTimeZone('America/New_York'));

    // 出力結果 UTC
    echo $date->format('e');

.. _immutable-time:

不変な日付と時刻
================

.. php:class:: FrozenTime
.. php:class:: FrozenDate

CakePHP は、変更可能な仲間と同じインターフェイスを実装する、不変な日付と時刻のクラスを
提供しています。不変なオブジェクトは、偶発的にデータが変わってしまうのを防ぎたいときや、
順番に依存する問題を避けたいときに、便利です。以下のコードをご覧ください。 ::

    use Cake\I18n\Time;
    $time = new Time('2015-06-15 08:23:45');
    $time->modify('+2 hours');

    // このメソッドは $time インスタンスも変更します。
    $this->someOtherFunction($time);

    // ここでの出力結果は不明です。
    echo $time->format('Y-m-d H:i:s');

メソッドの呼び出しの順番が変わった場合、あるいは ``someOtherFunction`` によって変更された場合、
出力は予期できません。このオブジェクトの変更可能な性質によって、一時的結合が作成されます。
不変のオブジェクトを用いれば、この問題を避けることができます。 ::

    use Cake\I18n\FrozenTime;
    $time = new FrozenTime('2015-06-15 08:23:45');
    $time = $time->modify('+2 hours');

    // このメソッドの変更は $time を変更しません。
    $this->someOtherFunction($time);

    // ここでの出力結果は明らかです。
    echo $time->format('Y-m-d H:i:s');

不変の日付と時刻は、エンティティー内での偶然的な更新を防ぎ、変更を明示するよう強制したいときに便利です。
不変なオブジェクトを利用することで、ORM が変更を追跡したり、日付や日付と時刻のカラムを正しく保持する
ことが、より簡単になります。 ::

    // 記事が保存されるとき、この変更は消去されます。
    $article->updated->modify('+1 hour');

    // 時刻のオブジェクトを置き換えると、プロパティーが保存されます。
    $article->updated = $article->updated->modify('+1 hour');

地域化されたリクエストデータの受け入れ
======================================

日付を操作するテキストの入力を作成するとき、きっと地域化された日時の文字列を受け入れて
パースしたいはずです。 :ref:`parsing-localized-dates` をご覧ください。

.. meta::
    :title lang=ja: Time
    :description lang=ja: Time class helps you format time and test time.
    :keywords lang=ja: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
