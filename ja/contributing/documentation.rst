ドキュメント
############

ドキュメントへの貢献の方法はシンプルです。
ファイルは https://github.com/cakephp/docs にホストされています。
自由にレポジトリをフォークして、変更・改善・翻訳を追加し、プルリクエストを発行してください。
またファイルをダウンロードせず、ページにある "Improve this Doc" ボタンから GitHub の
オンラインエディタを使って直接ドキュメントを編集することもできます。

CakePHP のドキュメントは、
`継続的に統合 <https://en.wikipedia.org/wiki/Continuous_integration>`_
されます。また、 Jenkins サーバ上で、いつでも `様々なビルド  <https://ci.cakephp.org>`_ の
ステータスを確認できます。

翻訳
====

ドキュメントチーム (*docs at cakephp dot org*) までEメールを送るか、IRC
(#cakephp on freenode) で、参加したい旨を連絡してください。

新しい言語の翻訳
------------------

私たちは、できる限り完全な翻訳を提供したいです。しかしながら、翻訳ファイルが最新ではない場合が
あるかもしれません。英語版ドキュメントを信頼できるバージョンとして考えてください。

もし、あなたの言語の翻訳がない場合、 Github を通して連絡してください。そして、私たちは
スケルトンフォルダを作成することを考えるでしょう。以下のセクションは、頻繁に更新されることは
ありませんので、初めに翻訳することを考えてください:

- index.rst
- cakephp-overview.rst
- getting-started.rst
- installation.rst
- /installation フォルダ
- /getting-started フォルダ
- /tutorials-and-examples フォルダ

ドキュメント管理者の備忘録
---------------------------

全ての言語のフォルダーの構造は、英語のフォルダに合わせるべきです。もし、英語版で構造が変わったら、
他の言語にもそれらの変更を適用すべきです。

例えば、 **en/file.rst** に新しい英語のファイルが作られた場合:

- 他の全ての言語のファイルを追加します : **fr/file.rst**, **zh/file.rst**, ...
- ``title`` と ``meta`` 情報と最後に ``toc-tree`` 要素を保ったままで、内容を削除します。
  誰かがファイルを翻訳するまでは、以下の注意書きが追加されます::

    File Title
    ##########

    .. note::
        The documentation is not currently supported in XX language for this
        page.

        Please feel free to send us a pull request on
        `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
        button to directly propose your changes.

        You can refer to the English version in the select top menu to have
        information about this page's topic.

    // toc-tree 要素が英語版にある場合
    .. toctree::
        :maxdepth: 1

        one-toc-file
        other-toc-file

    .. meta::
        :title lang=xx: File Title
        :keywords lang=xx: title, description,...


翻訳者 tips
------------

- 翻訳する言語のページで閲覧・編集してください。
  そうしないと、どこが既に翻訳されているかわからないでしょう。
- この本の中に読みたい言語を見つけたら、どうぞ遠慮なくご覧ください。
- `フレンドリーな文体 <https://en.wikipedia.org/wiki/Register_(linguistics)>`_ を使ってください。
- タイトルと内容を同時に翻訳してください。
- 修正を投稿する前に、英語版との比較を行うようにしてください。
  どこかを修正しても、以前の変更が統合されていなかったら、投稿したものが受け付けられないことがあります。
- 用語を英語で書く場合には、 ``<em>`` タグで囲んでください。
  例えば、「asdf asdf *Controller* asdf」 や 「asdf asdf Kontroller (*Controller*) asfd」 などです。
- 一部だけ翻訳して投稿しないでください。
- 保留されている項目があるセクションは編集しないでください。
- アクセント文字のために
  `HTML エンティティ <https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references>`_
  を使用しないでください。
  この本は UTF-8 を使っています。
- 記述 (HTML) の変更や新しいコンテンツを、一度にたくさん加えないでください。
- 元のコンテンツに不備がある場合は、まずそれを編集するようにしてください。

ドキュメントのフォーマットガイド
================================

新しい CakePHP のドキュメントは
`ReST フォーマットテキスト <https://en.wikipedia.org/wiki/ReStructuredText>`_
で書かれています。
ReST (Re Structured Text) は markdown や textile と同様のプレーンテキストの
マークアップ記法です。一貫性を保持するために、CakePHP ドキュメントに追加をする場合、
以下のテキストのフォーマットと構造化をする方法のガイドラインに従うことが推奨されます。

行の長さ
--------

テキストの行は 80 列でワードラップがかけられるべきです。
例外は長い URL とコードスニペットのみです。

見出しとセクション
------------------

セクションの見出しはテキストの長さ以上の区切り文字でタイトルにアンダーラインをつけることで
作成されます。

- ``#`` はページタイトルを意味するのに使われます。
- ``=`` はページのセクションを意味するのに使われます。
- ``-`` はサブセクションを意味するのに使われます。
- ``~`` はサブ-サブセクションを意味するのに使われます。
- ``^`` はサブ-サブ-サブセクションを意味するのに使われます。

見出しは 5 レベルより深くネストしてはなりません。
また、空行で囲まれる必要があります。

段落(*Paragraphs*)
------------------

段落は単にテキストの塊で、全ての行に同じレベルのインデントがつけられます。
段落は1行以上の空行で区切られる必要があります。

インラインマークアップ
----------------------

* 単一のアスタリスク: *text* 強調(斜体)。
  一般的なハイライト/強調のために使用します。

  * ``*text*``.

* 二つのアスタリスク: **text** 強い強調(太文字)。
  ワークディレクトリ、箇条書きの項目、テーブル名、「テーブル」という言葉を省略するために
  使用します。

  * ``**/config/Migrations**``, ``**articles**``, etc.

* バッククォート: ``text`` コード例。
  メソッドオプション名、テーブルカラム名、オブジェクト名、「オブジェクト」という言葉を
  省略するため、"()"をつけてメソッド/関数名に使用します。

  * ````cascadeCallbacks````, ````true````, ````id````,
    ````PagesController````, ````config()````, etc.

もしアスタリスクやバッククォートがテキストが書かれている中に現れ、インラインマークアップの
区切り文字に取り間違えられることがあるなら、バックスラッシュでエスケープする必要があります。

インラインマークアップは多少の制限があります:

* ネスト **できない場合があります** 。
* 中身は空白で開始・終了できないでしょう: ``* text*`` は間違いです。
* 中身は非単語文字で、周囲のテキストから分離されている必要があります。
  これを回避するためにバックスラッシュでエスケープされた空白を使ってください:
  ``一つの長い\ *太文字*\ 単語`` 。

リスト
------

リストマークアップは markdown に非常によく似ています。
順番なしのリストは単一のアスタリスクと空白から始まる行によって示されます。
順番がついたリストは同様に数字、または ``#`` で自動的なナンバリングがなされます::

    * これは中黒 (*bullet*) です
    * これも同じです。しかしこの行は
      2 行あります。

    1. 一番目の行
    2. 二番目の行

    #. 自動的なナンバリング
    #. は時間の節約をもたらします。

インデントされたリストも、セクションをインデントし、空行で区切ることによって作成できます::

    * 一番目の行
    * 二番目の行

        * 深くなってる
        * ワーオ！

    * 最初のレベルに戻った。

定義リストは以下のようにして作成できます::

    用語
        定義
    CakePHP
        PHP の MVC フレームワーク

用語は 1 行以上にすることができませんが、定義は複数行にすることができ、全ての行は
一貫したインデントをつける必要があります。

リンク
------

いくつかの用途に合った種類のリンクがあります。

外部リンク
~~~~~~~~~~

外部のドキュメントへのリンクは以下のようにできます::

    `外部リンク <http://example.com>`_

以上のものは http://example.com に向けてのリンクを生成します。

他のページへのリンク
~~~~~~~~~~~~~~~~~~~~

.. rst:role:: doc

    ドキュメントの他のページへ ``:doc:`` ロール (*role*) を使ってリンクします。
    指定するドキュメントへ絶対パスまたは相対パス参照を用いてリンクできます。
    ``.rst`` 拡張子は省く必要があります。
    例えば、 ``:doc:`form``` が ``core-helpers/html`` に現れたとすると、
    リンクは ``core-helpers/form`` を参照します。
    もし参照が ``:doc:`/core-helpers``` であったら、どこで使われるかに関わらず、
    常に ``/core-helpers`` を参照します。

相互参照リンク
~~~~~~~~~~~~~~

.. rst:role:: ref

    ``:ref:`` ロールを使って任意のドキュメントに任意のタイトルを相互参照することができます。
    リンクのラベルはドキュメント全体に渡って一意のものに向けられる必要があります。
    クラスのメソッドのラベルを作る時は、リンクのラベルのフォーマットとして ``class-method`` を
    使うのがベストです。

    ラベルの最も一般的な使い方は上記のタイトルです。例::

        .. _ラベル名:

        セクションの見出し
        ------------------

        続きの内容..

    他の場所で、 ``:ref:`ラベル名``` を用いて上記のセクションを参照することができます。
    リンクのテキストはリンクの先にあるタイトルになります。また、
    ``:ref:`リンクテキスト <ラベル名>``` として自由にリンクのテキストを指定することができます。

Sphinx からの警告の出力を防ぐ
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sphinx は、 ファイルが toc-tree 内で参照されない場合、警告を出力します。
それは、全てのファイルがそれらを指すリンクを持っていることを保証する素晴らしい方法です。
しかし、時には、ファイルへのリンクの挿入が必要無いこともあります。例えば、
`epub-contents` や `pdf-contents` ファイルなどです。そんなとき、
ファイルの先頭に ``:orphan:`` を追加することで、 ファイルが
toc-tree に無い警告を抑制することができます。

クラスとその内容を記述する
--------------------------

CakePHP のドキュメントは `phpdomain
<http://pypi.python.org/pypi/sphinxcontrib-phpdomain>`_
を用いて PHP のオブジェクトと構成物を記述するための独自のディレクティブを提供します。
適切な索引 (*index*) と相互参照機能を与えるためにこのディレクティブとロールを必ず使う
必要があります。

クラスと構成物を記述する
------------------------

各々のディレクティブは索引と名前空間の索引のどちらか、または両方を生成します。

.. rst:directive:: .. php:global:: name

   このディレクティブは新規の PHP のグローバル変数を定義します。

.. rst:directive:: .. php:function:: name(signature)

   クラスに属さない新規のグローバル関数を定義します。

.. rst:directive:: .. php:const:: name

   このディレクティブは新規の定数を定義します。
   これを class ディレクティブの中でネストして使うことにより、クラス定数を作成することもできます。

.. rst:directive:: .. php:exception:: name

   このディレクティブは現在の名前空間内で新規の例外 (*Exception*) を定義します。
   コンストラクタの引数を含める書き方もできます。

.. rst:directive:: .. php:class:: name

   クラスを記述します。
   クラスに属するメソッド、属性、定数はこのディレクティブの本文の中にある必要があります::

        .. php:class:: MyClass

            クラスの説明

           .. php:method:: method($argument)

           メソッドの説明


   属性、メソッド、定数はネストする必要はありません。
   これらは単にクラス定義の後につけることができます::

        .. php:class:: MyClass

            クラスについての文

        .. php:method:: methodName()

            メソッドについての文


   .. seealso:: :rst:dir:`php:method`, :rst:dir:`php:attr`, :rst:dir:`php:const`

.. rst:directive:: .. php:method:: name(signature)

   クラスのメソッドと、その引数、返り値、例外を記述します::

        .. php:method:: instanceMethod($one, $two)

            :param string $one: 第一引数。
            :param string $two: 第二引数。
            :returns: なんらかの配列。
            :throws: InvalidArgumentException

           これはインスタンスメソッドです。

.. rst:directive:: .. php:staticmethod:: ClassName::methodName(signature)

    静的なメソッド、その引数、返り値、例外を記述します。
    オプションは :rst:dir:`php:method` を見てください。

.. rst:directive:: .. php:attr:: name

   クラスのプロパティ・属性を記述します。

Sphinx からの警告の出力を防ぐ
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ひとつの関数が複数のファイルで参照されている場合、Sphinx は警告を出力します。
それは、ひとつの関数を何度も追加されないようにすることを保証する素晴らしい方法です。しかし、
ときには２つ以上のファイルで、ひとつの関数を書きたいこともあります。
例えば、 `debug 関数` は、 `/development/debugging` と
`/core-libraries/global-constants-and-functions` で参照されています。
この場合、警告を抑えるために debug 関数の下に ``:noindex:`` を追加します。
関数に対する ``:no-index:`` を **付けない** 参照はひとつだけにキープしてください。 ::

    .. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
        :noindex:

相互参照
~~~~~~~~

以下のロールは PHP のオブジェクトを参照し、適合するディレクティブがあればリンクが生成されます:

.. rst:role:: php:func

   PHPの関数を参照します。

.. rst:role:: php:global

   ``$`` 接頭辞を持つグローバル変数を参照します。

.. rst:role:: php:const

   グローバル定数、またはクラス定数のどちらかを参照します。
   クラス定数はそのクラスが先に付けられる必要があります::

        DateTimeは :php:const:`DateTime::ATOM` 定数を持ちます。

.. rst:role:: php:class

   名前でクラスを参照します::

     :php:class:`ClassName`

.. rst:role:: php:meth

   クラスのメソッドを参照します。
   このロールは両方の種類のメソッドをサポートします::

     :php:meth:`DateTime::setDate`
     :php:meth:`Classname::staticMethod`

.. rst:role:: php:attr

   オブジェクトの属性を参照します::

      :php:attr:`ClassName::$propertyName`

.. rst:role:: php:exc

   例外を参照します。


ソースコード
------------

段落の終わりの ``::`` を用いて、リテラルコードブロックを生成します。
リテラルブロックはインデントされる必要があり、各段落のように単一の行で区切られる必要があります::

    これは段落です::

        while ($i--) {
            doStuff()
        }

    これは普通のテキストの再開です。

リテラルテキストは変更やフォーマットがされず、1レベル分のインデントが削除されたものが残ります。


注意と警告
----------

重要なヒント、特別な注記、潜在的な危険を読者に知らせるためにしたいことがしばしばあります。
sphinx の警告 (*Admonitions*) は、まさにそのために使われます。
警告には 5 つの種類があります。

* ``.. tip::`` tip は面白い情報や重要な情報を文書化、または再反復するために使用されています。
  ディレクティブの内容は完結した文章で書かれ、また全ての適切な句読点を含める必要があります。
* ``.. note::`` note は情報の特に重要なもののひとつを文書化するために使用されています。
  ディレクティブの内容は完結した文章で書かれ、また全ての適切な句読点を含める必要があります。
* ``.. warning::`` warning は潜在的な障害、またはセキュリティに関する情報を文書化するために使用されています。
  ディレクティブの内容は完結した文章で書かれ、また全ての適切な句読点を含める必要があります。
* ``.. versionadded:: X.Y.Z`` "version added" 警告は、上記の機能が
  ``X.Y.Z`` バージョンで追加された新しい機能であることを示すために使用されます。
* ``.. deprecated:: X.Y.Z`` "version added" 警告の反対で、"deprecated" 警告は、
  ``X.Y.Z`` バージョンから非推奨になった機能の告知のために使用されます。

全ての警告は同じようになります::

    .. note::

        インデントされ空の行に挟まれます。
        段落と一緒です。

    この文はnoteの一部ではありません。

サンプル
~~~~~~~~

.. tip::

    これは忘れがちで役に立つ一言です。

.. note::

    ここに注意を払う必要があります。

.. warning::

    危険に晒されるかもしれません。

.. versionadded:: 2.6.3

    バージョン 2.6.3 で素晴らしい機能が追加されました。

.. deprecated:: 2.6.3

    バージョン 2.6.3 で古い機能は非推奨になりました。


.. meta::
    :title lang=ja: Documentation
    :keywords lang=ja: partial translations,translation efforts,html entities,text markup,asfd,asdf,structured text,english content,markdown,formatted text,dot org,repo,consistency,translator,freenode,textile,improvements,syntax,cakephp,submission
