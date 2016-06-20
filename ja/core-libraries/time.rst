日付と時刻
##########

.. php:namespace:: Cake\I18n

.. php:class:: Time

:php:class:`TimeHelper` の機能を ``View`` の外で使いたい場合は、 ``Time`` クラスを利用してください。::

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
                // Greet user with a happy birthday message
                $this->Flash->success(__('Happy birthday to you...'));
            }
        }
    }


内部的には、この ``Time`` ユーティリティを動かすために、CakePHPは `Chronos <https://github.com/cakephp/chronos>`_ を利用しています。
``Chronos`` と ``DateTime`` でできることはなんでも、 ``Time`` と ``Date`` ですることができます。

.. note::
    3.2.0以前のCakePHPでは `Carbon <https://github.com/briannesbitt/Carbon>`__ が使われていました。

Chronosについてより詳しく知りたい場合は `the API documentation <http://api.cakephp.org/chronos/1.0/>`_ をごらんください。

.. start-time

Timeインスタンスを作成する
==========================

``Time`` インスタンスを作成するにはいくつかの方法があります。::

    use Cake\I18n\Time;

    // Create from a string datetime.
    $time = Time::createFromFormat(
        'Y-m-d H:i:s',
        $datetime,
        'America/New_York'
    );

    // Create from a timestamp
    $time = Time::createFromTimestamp($ts);

    // Get the current time.
    $time = Time::now();

    // Or just use 'new'
    $time = new Time('2014-01-10 11:11', 'America/New_York');

    $time = new Time('2 hours ago');

``Time`` クラスのコンストラクタは、内部のPHPクラスである ``Datetime`` がとりうる、あらゆるパラメータをとることができます。
数値や数字文字列を渡したとき、UNIXタイムスタンプとして解釈されます。

テストケースでは、 ``setTestNow()`` を使うことで ``now()`` をモックアップできます。

    // Fixate time.
    $now = new Time('2014-04-12 12:22:30');
    Time::setTestNow($now);

    // Returns '2014-04-12 12:22:30'
    $now = Time::now();

    // Returns '2014-04-12 12:22:30'
    $now = Time::parse('now');

操作
====

いったん作成した後は、セッターメソッドを使用することで ``Time`` インスタンスを操作できます。::

    $now = Time::now();
    $now->year(2013)
        ->month(10)
        ->day(31);

PHPのビルトインの ``DateTime`` クラスで提供されているメソッドも使用できます。::

    $now->setDate(2013, 10, 31);

日付はコンポーネントの引き算や足し算で編集できます。::

    $now = Time::now();
    $now->subDays(5);
    $now->addMonth(1);

    // Using strtotime strings.
    $now->modify('+5 days');

プロパティにアクセスすることで日付の内部コンポーネントを取得することができます。::

    $now = Time::now();
    echo $now->year; // 2014
    echo $now->month; // 5
    echo $now->day; // 10
    echo $now->timezone; // America/New_York

日付を編集する際に、直接これらのプロパティを指定することもできます。::

    $time->year = 2015;
    $time->timezone = 'Europe/Paris';

フォーマットする
================

.. php:staticmethod:: setJsonEncodeFormat($format)

このメソッドは、オブジェクトをjson形式に変換するときに使われるデフォルトのフォーマットをセットします。::

    Time::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');

.. note::
    このメソッドは静的に呼び出されなくてはなりません。

.. php:method:: i18nFormat($format = null, $timezone = null, $locale = null)

``Time`` インスタンスで行うごく一般的なことは、フォーマットされたデータを出力することです。
CakePHPはsnapを作成します::

    $now = Time::parse('2014-10-31');

    // 地域化されたdatetimeスタンプを出力します。
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
この関数に第1引数として `IntlDateFormatter 定数 <http://www.php.net/manual/en/class.intldateformatter.php>`_ を渡したり、
あるいは以下のリソースで指定されているICUの日付フルフォーマット文字列を渡すことができます。:
http://www.icu-project.org/apiref/icu4c/classSimpleDateFormat.html#details.

グレゴリオ暦のカレンダーではない日付にフォーマットすることも可能です。::

    // Outputs 'Friday, Aban 9, 1393 AP at 12:00:00 AM GMT'
    $result = $now->i18nFormat(\IntlDateFormatter::FULL, null, 'en-IR@calendar=persian');

以下のカレンダータイプがサポートされています。:

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
    グレゴリオ暦ではないカレンダーのサポートは3.1で追加されました

.. php:method:: nice()

あらかじめ定義されている 'nice' フォーマットで出力します::

    $now = Time::parse('2014-10-31');

    // en-USでは 'Oct 31, 2014 12:00 AM' と出力されます。
    echo $now->nice();

``Time`` オブジェクトそのものを変更することなく、出力される日付のタイムゾーンを変更することができます。
一つのタイムゾーンでデータを保存しているけれども、ユーザのそれぞれのタイムゾーンで表示したい場合に有用です。::

    $now->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris');

第1引数を ``null`` のままにしておくと、デフォルトのフォーマット文字列を使用します。

    $now->i18nFormat(null, 'Europe/Paris');

さいごに、日付を表示するのに異なるロケールを利用することができます。::

    echo $now->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris', 'fr-FR');

    echo $now->nice('Europe/Paris', 'fr-FR');

デフォルトのロケールとフォーマット文字列を設定する
--------------------------------------------------

``nice`` や ``i18nFormat`` を利用している際に表示される日付のデフォルトのロケールは、
`intl.default_locale <http://www.php.net/manual/en/intl.configuration.php#ini.intl.default-locale>`_ の指令です。
しかしながら、このデフォルト値をランタイムで変更できます。::

    Time::$defaultLocale = 'es-ES';

フォーマットメソッドの中で直接異なるローケルが指示されていない限り、今後、日付はスペインのフォーマットで表示されます。

同様に、 ``i18nFormat`` を利用することでデフォルトのフォーマット文字列を変更できます。::

    Time::setToStringFormat(\IntlDateFormatter::SHORT);

    Time::setToStringFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

    Time::setToStringFormat('yyyy-MM-dd HH:mm:ss');

日付のフォーマット文字列を直接渡すよりも、定数を常に利用することが推奨されています。

相対時間のフォーマットについて
------------------------------

.. php:method:: timeAgoInWords(array $options = [])

現在との相対的な時間を出力することが有用なときがしばしばあります。::

    $now = new Time('Aug 22, 2011');
    echo $now->timeAgoInWords(
        ['format' => 'MMM d, YYY', 'end' => '+1 year']
    );
    // On Nov 10th, 2011 this would display: 2 months, 2 weeks, 6 days ago

``format`` オプションを利用してフォーマットされた相対時間の位置は ``end`` オプションによって定義されます。
``accuracy`` オプションは、それぞれの間隔幅に対してどのレベルまで詳細を出すかをコントロールします。::

    // If $timestamp is 1 month, 1 week, 5 days and 6 hours ago
    echo $timestamp->timeAgoInWords([
        'accuracy' => ['month' => 'month'],
        'end' => '1 year'
    ]);
    // Outputs '1 month ago'

``accuracy`` を文字列で設定すると、出力をどのレベルまで詳細を出すかの最大値を指定できます。::

    $time = new Time('+23 hours');
    // Outputs 'in about a day'
    $result = $time->timeAgoInWords([
        'accuracy' => 'day'
    ]);

変換
====

.. php:method:: toQuarter()

一旦作成しても、 ``Time`` インスタンスを、タイムスタンプや四半期の値に変換することができます。::

    $time = new Time('2014-06-15');
    $time->toQuarter();
    $time->toUnixString();

現在と比較する
==============

.. php:method:: isYesterday()
.. php:method:: isThisWeek()
.. php:method:: isThisMonth()
.. php:method:: isThisYear()

様々な方法で ``Time`` インスタンスと現在とを比較することができます。::

    $time = new Time('2014-06-15');

    echo $time->isYesterday();
    echo $time->isThisWeek();
    echo $time->isThisMonth();
    echo $time->isThisYear();

上述のメソッドのいずれも、 ``Time`` インスタンスが現在と一致するかどうかによって、 ``true``/``false`` を返します。

間隔を比較する
==============

.. php:method:: isWithinNext($interval)

``wasWithinLast()`` および ``isWithinNext()`` を用いて、与えられた範囲に ``Time`` インスタンスが属しているかどうかを確認できます。::

    $time = new Time('2014-06-15');

    // Within 2 days.
    echo $time->isWithinNext(2);

    // Within 2 next weeks.
    echo $time->isWithinNext('2 weeks');

.. php:method:: wasWithinLast($interval)

``Time`` インスタンスと過去と範囲の中で比較することもできます::

    // Within past 2 days.
    echo $time->wasWithinLast(2);

    // Within past 2 weeks.
    echo $time->wasWithinLast('2 weeks');

.. end-time

日付
====

.. php:class: Date

.. versionadded:: 3.2

CakePHP内の ``Date`` クラスの実装は、APIや :php:class:`Cake\\I18n\\Time` メソッドと同じです。
``Time`` と ``Date`` の主要な違いは、 ``Date`` は時刻の成分を記録せず、かつ常にUTCであることです。
以下が例です::

    use Cake\I18n\Date;
    $date = new Date('2015-06-15');

    $date->modify('+2 hours');
    // Outputs 2015-06-15 00:00:00
    echo $date->format('Y-m-d H:i:s');

    $date->modify('+36 hours');
    // Outputs 2015-06-15 00:00:00
    echo $date->format('Y-m-d H:i:s');

``Date`` インスタンスでタイムゾーンを変更しようとしても、無視されます。::

    use Cake\I18n\Date;
    $date = new Date('2015-06-15');
    $date->setTimezone(new \DateTimeZone('America/New_York'));

    // Outputs UTC
    echo $date->format('e');

.. _immutable-time:

不変な日付と時刻
================

.. php:class:: FrozenTime
.. php:class:: FrozenDate

CakePHPは変更可能なきょうだいとして、同じインタフェースで実装されている不変の日付と時刻のクラスを提供しています。
不変のオブジェクトは、偶発的にデータが変わってしまうのを防ぎたいときや、順番に依存的なイシューを避けたいときに、有用です。
以下のコードをみてください::

    use Cake\I18n\Time;
    $time = new Time('2015-06-15 08:23:45');
    $time->modify('+2 hours');

    // このメソッドは$timeインスタンスも変更します
    $this->someOtherFunction($time);

    // ここでの出力はunknownです
    echo $time->format('Y-m-d H:i:s');

メソッドの呼び出しの順番が変わった場合、あるいは ``someOtherFunction`` によって変更された場合、出力は予期できません。
このオブジェクトの変更可能な性質によって、一時的結合が作成されます。
不変のオブジェクトを用いれば、この問題を避けることができます::

    use Cake\I18n\FrozenTime;
    $time = new FrozenTime('2015-06-15 08:23:45');
    $time = $time->modify('+2 hours');

    // このメソッドの変更は$timeを変更しません
    $this->someOtherFunction($time);

    // ここでの出力はわかります
    echo $time->format('Y-m-d H:i:s');

不変の日付と時刻は、偶然的な変更を防ぐために、そして明確に変更することを矯正したいときに、エンティティにおいて有用です。
不変なオブジェクトを利用することで、ORMが変更を追跡したり、日付や日付と時刻のカラムを正しく保持したりすることが、より簡単になります。::

    // 記事が保存されるとき、この変更は消去されます。
    $article->updated->modify('+1 hour');

    // 時刻のオブジェクトを置き換えると、プロパティが保存されます。
    $article->updated = $article->updated->modify('+1 hour');

地域化されたリクエストデータの受け入れ
======================================

日付を操作するテキストのinputを作成するとき、きっと地域化された日付と時刻の文字列を受け入れてパースしたいと思うでしょう。
:ref:`parsing-localized-dates` をご覧ください。

.. meta::
    :title lang=ja: Time
    :description lang=ja: Time class helps you format time and test time.
    :keywords lang=ja: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
