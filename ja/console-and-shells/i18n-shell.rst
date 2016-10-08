I18N シェル
###########

CakePHP の国際化機能は、 `po files <http://en.wikipedia.org/wiki/GNU_gettext>`_
を翻訳のソースとして使います。POファイルは `poedit <http://www.poedit.net/>`_
のような一般的に使われている翻訳ツールと統合します。

i18n シェルは、素早く容易に po テンプレートファイルを生成します。
アプリケーション中の文字列を翻訳できるように、これらのテンプレートファイルが翻訳者に提供されます。
一度翻訳が済むと、 翻訳の更新に役立つよう pot ファイルは既存の翻訳とマージされます。

POT ファイルの生成
==================

``extract`` コマンドを使って、既存のアプリケーションのために POT ファイルを
生成することができます。このコマンドは、 ``__()`` 形式の関数を呼び、メッセージ文字列を
抽出するためにアプリケーション全体をスキャンします。アプリケーション中のユニークな文字列は
それぞれ一つの POT ファイルの中に混合されます。 ::

      bin/cake i18n extract

上記は、抽出シェルを実行します。 このコマンドの結果は、
**src/Locale/default.pot** ファイルになります。pot ファイルは、 po ファイルを
作成するためのテンプレートとして使用します。もし、手動で pot ファイルから po ファイルを
作成するなら、 ``Plural-Forms`` ヘッダー行を正しく設定してください。

プラグイン用 POT ファイルの生成
-------------------------------

特定のプラグインで使用される POT ファイルを生成することができます。 ::

    bin/cake i18n extract --plugin <Plugin>

これは、プラグイン中で使用されたで必要な POT ファイルを生成します。

一括で複数のフォルダーを抽出
----------------------------

しばしば、アプリケーションの１つ以上のディレクトリから文字列を抽出が必要なこともあるでしょう。
例えば、もし、あなたのアプリケーションの ``config`` ディレクトリ内のいくつかの文字列を
定義している場合、 ``src`` ディレクトリと同様にこのディレクトリからも文字列を抽出したくなる
はずです。それには ``--paths`` オプションを使用することができます。そのオプションに
抽出する絶対パスをカンマ区切りリストで渡します。 ::

    bin/cake i18n extract --paths /var/www/app/config,/var/www/app/src

フォルダーの除外
-----------------

除外したいフォルダをカンマ区切りで指定します。指定された値に含まれるパスは無視されます。 ::

    bin/cake i18n extract --exclude Test,Vendor

既存の POT ファイル上書きの警告をスキップする
---------------------------------------------

``--overwrite`` を追加することで、 POT ファイルが存在しても警告されず、
デフォルトで上書きされます。 ::

    bin/cake i18n extract --overwrite

CakePHP コアライブラリからのメッセージ抽出
------------------------------------------

デフォルトで、抽出シェルスクリプトは CakePHP コアライブラリ中で使われているメッセージを
抽出するかどうか訊ねます。 ``--extract-core`` に yes か no を設定することで、
デフォルトの動作を指定できます。::

    bin/cake i18n extract --extract-core yes

    // または

    bin/cake i18n extract --extract-core no

.. meta::
    :title lang=ja: I18N シェル
    :keywords lang=ja: pot files,locale default,translation tools,message string,app locale,php class,validation,i18n,translations,shell,models
