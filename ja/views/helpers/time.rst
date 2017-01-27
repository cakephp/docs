Time
####

.. php:namespace:: Cake\View\Helper

.. php:class:: TimeHelper(View $view, array $config = [])

TimeHelper は、まさに名前のとおりに、あなたの時間を節約します。
TimeHelper には時間に関係のある情報を手早く処理するための2つの役割があります。:

#. 時間文字列のフォーマットを整えることができます。
#. 時間の判定ができます。 (しかし時間をゆがませることは出来ません、ごめんね)

ヘルパーの使い方
================

TimeHelper の一般的な使い道は、ユーザーのタイムゾーンに合わせて日付と時刻を
補正することです。それでは掲示板を例にとりましょう。あなたの掲示板には
多くのユーザーがいて、世界中のどの地域からでもいつでもメッセージを投稿できます。
時間を管理する簡単な方法は、すべての日付と時刻を GMT+0 または UTC
として保存することです。
アプリケーションのタイムゾーンを確実に GMT+0 に設定するために
**config/bootstrap.php** の ``date_default_timezone_set('UTC');``
という記述のコメントアウトを解除してください。

次にタイムゾーンのフィールドをユーザーのテーブルに追加して、
ユーザーがタイムゾーンを設定できるように 必要な修正を加えます。
これでログインしているユーザーのタイムゾーンが分かるようになり、
TimeHelper を使って投稿日時を補正することができます。 ::

    echo $this->Time->format(
      $post->created,
      \IntlDateFormatter::FULL,
      null,
      $user->time_zone
    );
    // GMT+0 のユーザーには 'Saturday, August 22, 2011 at 11:53:00 PM GMT' と
    // 表示されます。
    // GMT-8 のユーザーには 'Saturday, August 22, 2011 at 03:53 PM GMT-8:00' と
    // 表示されます。

TimeHelper のほとんどの機能は、古いバージョンの CakePHP からアップグレードしている
アプリケーションのための下位互換性のあるインターフェースとして意図されています。
なぜなら、 ORM は ``timestamp`` 型と ``datetime`` 型の列ごとに
:php:class:`Cake\\I18n\\Time` インスタンスを返すので、そのメソッドを使用して
ほとんどのタスクを実行できるからです。例えば、受け入れられた書式指定文字列について
読むには、 `Cake\\I18n\\Time::i18nFormat()
<https://api.cakephp.org/3.0/class-Cake.I18n.Time.html#_i18nFormat>`_
メソッドを見てください。

.. meta::
    :title lang=ja: TimeHelper
    :description lang=ja: TimeHelper は時間のフォーマットと時間の判定に役立ちます。
    :keywords lang=ja: time helper,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
