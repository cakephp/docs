..
Chronos

Chronos(クロノス)
=================

..
  Chronos provides a zero-dependency collection of extensions to the ``DateTime``
  object. In addition to convenience methods, Chronos provides:

Chronosは、 ``DateTime`` オブジェクトへの拡張の依存関係の無いコレクションを提供します。
便利なメソッドに加えて、Chronosは以下を提供します。:

..
  * ``Date`` objects for representing calendar dates.
  * Immutable date and datetime objects.
  * A pluggable translation system. Only English translations are included in the
    library. However, ``cakephp/i18n`` can be used for full language support.

* カレンダー日付のための ``Date`` オブジェクト
* イミュータブルなdateとdatetimeオブジェクト
* プラグインのような翻訳システム。ライブラリは英語のみの翻訳を含んでいます。
  しかし、全ての言語サポートのために、 ``cakephp/i18n`` を使うことができます。

..
  Installation

インストール
------------

..
To install Chronos, you should use ``composer``. From your
application's ROOT directory (where composer.json file is located) run the
following::

Chronosをインストールためには、 ``composer`` を利用することができます。
アプリケーションのROOTディレクトリ（composer.jsonファイルのある場所）で以下のように実行します。::

    php composer.phar require cakephp/chronos "@stable"

..
  Overview

概要
----

..
  Chronos provides a number of extensions to the DateTime objects provided by PHP.
  Chronos provides 5 classes that cover mutable and immutable date/time variants
  and extensions to ``DateInterval``.

ChronosはPHPが提供するDataTimeオブジェクトの拡張の数値を提供します。
Chronosは ``DateInterval`` の拡張機能および、
ミュータブル（変更可能）とイミュータブル（変更不可）な date/time の派生系をカバーする5つのクラスを提供します。

..
  * ``Cake\Chronos\Chronos`` is an immutable *date and time* object.
  * ``Cake\Chronos\Date`` is a immutable *date* object.
  * ``Cake\Chronos\MutableTime`` is a mutable *date and time* object.
  * ``Cake\Chronos\MutableDate`` is a mutable *date* object.
  * ``Cake\Chronos\ChronosInterval`` is an extension to the ``DateInterval``
    object.

* ``Cake\Chronos\Chronos`` はイミュータブルな *日付と時刻* オブジェクト。
* ``Cake\Chronos\Date`` はイミュータブルな *日付* オブジェクト。
* ``Cake\Chronos\MutableTime`` はミュータブルな *日付と時刻* オブジェクト。
* ``Cake\Chronos\MutableDate`` はミュータブルな *日付* オブジェクト。
* ``Cake\Chronos\ChronosInterval`` は ``DateInterval`` の拡張機能。

..
  Lastly, if you want to typehint against Chronos-provided date/time objects you
  should use ``Cake\Chronos\ChronosInterface``. All of the date and time objects
  implement this interface.

最後に、もしあなたがChronosが提供する date/time オブジェクトに反した型宣言を行ないたい場合、
``Cake\Chronos\ChronosInterface`` を使用することができます。
全ての日付と時間のオブジェクトはこのインターフェースを実装しています。

..
  Creating Instances

インターフェースの作成
----------------------

..
  There are many ways to get an instance of Chronos or Date. There are a number of
  factory methods that work with different argument sets::
..
      // Parse relative expressions
      // Date and time integer values.
      // Date or time integer values.
      // Parse formatted values.

ChronosまたはDateのインスタンスを取得するためには、多くの方法があります。
異なる引数セットで動作する多くのファクトリメソッドがあります。::

    use Cake\Chronos\Chronos;

    $now = Chronos::now();
    $today = Chronos::today();
    $yesterday = Chronos::yesterday();
    $tomorrow = Chronos::tomorrow();

    // 相対式のパース
    $date = Chronos::parse('+2 days, +3 hours');

    // 日付と時間の整数値
    $date = Chronos::create(2015, 12, 25, 4, 32, 58);

    // 日付または時間の整数値
    $date = Chronos::createFromDate(2015, 12, 25);
    $date = Chronos::createFromTime(11, 45, 10);

    // 整形した値にパース
    $date = Chronos::createFromFormat('m/d/Y', '06/15/2015');

..
  Working with Immutable Objects

イミュータブルオブジェクトに伴う動作
------------------------------------

..
  If you've used PHP's ``DateTime`` objects, you're comfortable with *mutable*
  objects. Chronos offers mutable objects, but it also provides *immutable*
  objects. Immutable objects create copies of objects each time an object is
  modified. Because modifier methods around datetimes are not always transparent,
  data can be modified accidentally or without the developer knowing.
  Immutable objects prevent accidental changes to
  data, and make code free of order-based dependency issues. Immutability
  does mean that you will need to remember to replace variables when using
  modifiers::
..
      // This code doesn't work with immutable objects
      // This works like you'd expect

もし、PHPの ``DateTime`` オブジェクトを使用したい場合、 *ミュータブル* オブジェクトで簡単にできます。
Chronosはミュータブルオブジェクトを提供しますが、これは *イミュータブル* オブジェクトにもなります。
イミュータブルオブジェクトはオブジェクトが変更されるたびにオブジェクトのコピーを作ります。
なぜなら、日時周りの変更メソッドは必ずしも透明でないため、データが誤って、または開発者が知らない内に変更してしまうからです。
イミュータブルオブジェクトはデータが誤って変更されることを防止し、順序ベースの依存関係の問題の無いコードを作ります。
不変性は、以下の修飾子を使用するときに、変数を置き換えるために覚えておく必要があることを意味しています。::

    // このコードはイミュータブルオブジェクトでは動作しません
    $time->addDay(1);
    doSomething($time);
    return $time

    // このコードは期待通りに動作します
    $time = $time->addDay(1);
    $time = doSomething($time);
    return $time
..
  By capturing the return value of each modification your code will work as
  expected. If you ever have an immutable object, and want to create a mutable
  one, you can use ``toMutable()``::

各修正の戻り値をキャプチャすることによって、コードは期待通りに動作します。
イミュータブルオブジェクトを持っていて、ミュータブルオブジェクトが欲しい場合、 ``toMutable()`` が使用できます。::

    $inplace = $time->toMutable();

..
  Date Objects

日付オブジェクト
------------------

..
PHP only provides a single DateTime object. Representing calendar dates can be
a bit awkward with this class as it includes timezones, and time components that
don't really belong in the concept of a 'day'. Chronos provides a ``Date``
object that allows you to represent dates. The time and timezone for these
objects is always fixed to ``00:00:00 UTC`` and all formatting/difference
methods operate at the day resolution::
..
    // Changes to the time/timezone are ignored.
    // Outputs '2015-12-20'

PHPは単純なDateTimeオブジェクトだけを提供します。
カレンダー日付はタイムゾーンおよび本当に「その日」の概念に属していないタイムコンポーネントを含むため、
このクラスで表現するには少し厄介なことができます。
Chronosは日時表現のための ``Date`` オブジェクトを提供します。
これらのオブジェクトの時間とタイムゾーン★::

    use Cake\Chronos\Date;

    $today = Date::today();

    // 時間/タイムゾーンの変更は無視されます
    $today->modify('+1 hours');

    // 出力 '2015-12-20'
    echo $today;

..
  Modifier Methods

変更メソッド
------------

..
  Chronos objects provide modifier methods that let you modify the value in
  a granular way::
..
    // Set components of the datetime value.

Chronosオブジェクトは細やかに値を変更できるメソッドを提供します。::

    // 日時の値のコンポーネントを設定
    $halloween = Date::create()
        ->year(2015)
        ->month(10)
        ->day(31)
        ->hour(20)
        ->minute(30);

..
  You can also modify parts of a date relatively::

また、日付部分を相対日付に変更することもできます::

    $future = Date::create()
        ->addYear(1)
        ->subMonth(2)
        ->addDays(15)
        ->addHours(20)
        ->subMinutes(2);

..
  It is also possible to make big jumps to defined points in time::

また、ある時間の中で、定義されたポイントにジャンプすることも可能です。::

    $time = Chronos::create();
    $time->startOfDay();
    $time->startOfMonth();
    $time->endOfMonth();
    $time->endOfYear();
    $time->startOfWeek();
    $time->endOfWeek();

..
  Or jump to specific days of the week::

また、1週間中の特定の日にもジャンプできます。::

    $time->next(ChronosInterface::TUESDAY);
    $time->previous(ChronosInterface::MONDAY);

..
  Comparison Methods

比較メソッド
------------

..
  Once you have 2 instances of Chronos date/time objects you can compare them in
  a variety of ways::
..
    // Full suite of comparators exist
    // See if the current object is between two others.
    // Find which argument is closest or farthest.

Chronosの日付/時間オブジェクトの2つのインスタンスを様々な方法で比較することができます。::

    // 既存の比較セット
    // ne, gt, lt, lte.
    $first->eq($second);
    $first->gte($second);

    // カレントオブジェクトが2つのオブジェクトの間にあるかどうかを確認します。
    $now->between($start, $end);

    // どちらの引数が最も近い(closest)か、または最も遠い(farthest)かを見つけます。
    $now->closest($june, $november);
    $now->farthest($june, $november);

..
  You can also inquire about where a given value falls on the calendar::
..
    // Check the day of the week
    // All other weekday methods exist too.

また、与えられた値のカレンダーに当たる場所について問い合わせできます。::

    $now->isToday();
    $now->isYesterday();
    $now->isFuture();
    $now->isPast();

    // 曜日をチェック
    $now->isWeekend();

    // 他の全ての曜日のメソッドも存在します。
    $now->isMonday();

..
  You can also find out if a value was within a relative time period::

また、値が相対的な期間内にあった場合にも見つけることができます。::

    $time->wasWithinLast('3 days');
    $time->isWithinNext('3 hours');

..
  Generating Differences

差の生成
--------
..
  In addition to comparing datetimes, calculating differences or deltas between
  to values is a common task::
..
    // Get a DateInterval representing the difference
    // Get difference as a count of specific units.

日時比較に加えて、2つの値の差や変化の計算は一般的な作業です。::

    // 差をあらわすDateIntervalを取得
    $first->diff($second);

    // 特定の単位での差を取得
    $first->diffInHours($second);
    $first->diffInDays($second);
    $first->diffInWeeks($second);
    $first->diffInYears($second);

..
  You can generate human readable differences suitable for use in a feed or
  timeline::
..
    // Difference from now.
    // Difference from another point in time.
    echo $date->diffForHumans($other); // 1 hour ago;

フィードやタイムラインで使用するのに適した、人間が読める形式の差を生成することができます。::

    // 現在からの差
    echo $date->diffForHumans();

    // 別の時点からの差
    echo $date->diffForHumans($other); // 1時間前;

..
  Formatting Strings

フォーマットの設定
------------------

..
  Chronos provides a number of methods for displaying our outputting datetime
  objects::
..
    // Uses the format controlled by setToStringFormat()
    // Different standard formats
    // Get the quarter

Chronosは、出力した日時オブジェクトを表示するための多くのメソッドを提供します。::

    // setToStringFormat() が制御するフォーマットを使用します
    echo $date;

    // 別の標準フォーマット
    echo $time->toAtomString();      // 1975-12-25T14:15:16-05:00
    echo $time->toCookieString();    // Thursday, 25-Dec-1975 14:15:16 EST
    echo $time->toIso8601String();   // 1975-12-25T14:15:16-0500
    echo $time->toRfc822String();    // Thu, 25 Dec 75 14:15:16 -0500
    echo $time->toRfc850String();    // Thursday, 25-Dec-75 14:15:16 EST
    echo $time->toRfc1036String();   // Thu, 25 Dec 75 14:15:16 -0500
    echo $time->toRfc1123String();   // Thu, 25 Dec 1975 14:15:16 -0500
    echo $time->toRfc2822String();   // Thu, 25 Dec 1975 14:15:16 -0500
    echo $time->toRfc3339String();   // 1975-12-25T14:15:16-05:00
    echo $time->toRssString();       // Thu, 25 Dec 1975 14:15:16 -0500
    echo $time->toW3cString();       // 1975-12-25T14:15:16-05:00

    // クォーターを取得
    echo $time->toQuarter();         // 4;

..
  Extracting Date Components

日付要素の抽出
--------------

..
  Getting parts of a date object can be done by directly accessing properties::

日付オブジェクトのプロパティに直接アクセスして要素を取得することができます。::

    $time = new Chronos('2015-12-31 23:59:58');
    $time->year;    // 2015
    $time->month;   // 12
    $time->day;     // 31
    $time->hour     // 23
    $time->minute   // 59
    $time->second   // 58

..
  Other properties that can be accessed are:

以下のプロパティにもアクセスできます。::

- timezone
- timezoneName
- micro
- dayOfWeek
- dayOfMonth
- dayOfYear
- daysInMonth
- timesptamp
- quarter

..
  Testing Aids

テストの支援
------------

..
  When writing unit tests, it is helpful to fixate the current time. Chronos lets
  you fix the current time for each class. As part of your test suite's bootstrap
  process you can include the following::

単体テストを書いている場合、現在時刻を固定すると便利です。Chronosは、各クラスの現在時刻を修正することができます。
テストスイートのbootstrap処理に以下を含めることができます。::

    Chronos::setTestNow(Chronos::now());
    MutableDateTime::setTestNow(MutableDateTime::now());
    Date::setTestNow(Date::now());
    MutableDate::setTestNow(MutableDate::now());

..
  This will fix the current time of all objects to be the point at which the test
  suite started.
..
  For example, if you fixate the ``Chronos`` to some moment in the past, any new
  instance of ``Chronos`` created with ``now`` or a relative time string, will be
  returned relative to the fixated time::

これでテストスイートが開始された時点で全てのオブジェクトの現在時刻を修正します。

例えば、過去に何度か ``Chronos`` を固定した場合、新たな ``Chronos`` のインスタンスが生成する ``now`` または相対時刻の文字列は、
固定された時刻の相対を返却します。::

    Chronos::setTestNow(new Chronos('1975-12-25 00:00:00'));

    $time = new Chronos(); // 1975-12-25 00:00:00
    $time = new Chronos('1 hour ago'); // 1975-12-24 23:00:00
