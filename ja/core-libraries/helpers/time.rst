TimeHelper
##########

.. php:class:: TimeHelper(View $view, array $settings = array())

Time ヘルパーはメッキをかぶせることであなたの時間を節約します。
Time ヘルパーには時間に関する情報を手早く処理するための2つの役割があります。

#. 時間を形式にそって文字列にすることができます。
#. 時間を調べることができます。ただし時間を変えることはできません。

.. versionchanged:: 2.1
   ``TimeHelper`` は :php:class:`CakeTime` クラスに含まれるようにリファクタリングされました。
   これにより、ビューの外からでもより簡単に使えるようになりました。
   ビューで使う際は `TimeHelper` クラスからこれらのメソッドを使うことができます。
   また、通常のヘルパーメソッドのように ``$this->Time->method($args);`` と
   呼び出すこともできます。

ヘルパーの使い方
================

Time ヘルパーの基本的な使い道は、ユーザーのタイムゾーンにあった日時に時刻を調整することです。
それでは掲示板を例にとりましょう。あなたの掲示板は世界各地からいろんな時間帯にたくさんのユーザーが
メッセージを投稿します。時刻を GMT+0 または UTC で保存すると、投稿時刻を簡単に管理できるでしょう。
あなたのアプリケーションで扱うタイムゾーンを確実に GMT+0 へするために、 ``app/Config/core.php``
の ``date_default_timezone_set('UTC');`` という記述のコメントアウトを解除します。

次にタイムゾーンのフィールドをユーザーのテーブルに追加して、ユーザーがタイムゾーンを設定できるように
必要な修正を加えます。これでログインしているユーザーのタイムゾーンが分かるようになり、 Time ヘルパーを
使って投稿時刻を補正することができるようになりました。 ::

    echo $this->Time->format(
      'F jS, Y h:i A',
      $post['Post']['created'],
      null,
      $user['User']['time_zone']
    );
    // GMT+0 での時刻が August 22nd, 2011 11:53 PMの場合、
    // タイムゾーンが GMT-8 の場合は August 22nd, 2011 03:53 PM、
    // GMT+10 の場合は August 23rd, 2011 09:53 AM が表示されます。

Time ヘルパーのメソッドは多くが $timezone パラメーターを持っています。このパラメーターは
タイムゾーンを表す文字列か、 `DateTimeZone` クラスのインスタンスを渡すことができます。

.. include:: ../../core-utility-libraries/time.rst
    :start-after: start-caketime
    :end-before: end-caketime

.. meta::
    :title lang=ja: TimeHelper
    :description lang=ja: The Time Helper will help you format time and test time.
    :keywords lang=ja: time helper,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
