テーマ
######

テーマにはページの見た目を簡単に素早く切り替えられるようになるという利点があります。

テーマを使うためには、コントローラの中でテーマ名を指定して下さい。 ::

    class ExampleController extends AppController {
        public $theme = 'Example';
    }

.. versionchanged:: 2.1
   バージョン2.1より前では、``$this->viewClass = 'Theme'`` という設定が必要でした。
   2.1ではこの設定は不要になり、通常の ``View`` クラスがテーマをサポートします。

またテーマの設定や変更はアクション、または ``beforeFilter`` や ``beforeRender`` などのコールバック関数の中から行えます。 ::

    $this->theme = 'AnotherExample';

テーマのビューファイルは ``/app/View/Themed/`` フォルダに配置する必要があります。
Themed フォルダの中にテーマ名のフォルダを作成して下さい。上記の例でいうと、テーマは
``/app/View/Themed/AnotherExample`` に配置するかたちになります。
これは大事なことなのですが、CakePHPはCamelCaseのテーマ名を期待しているということを覚えておいてください。
さらに、``/app/View/Themed/Example/``
以下は ``/app/View/`` と全く同じ構造にして下さい。

例えば、Postsコントローラのeditアクションのためのビューファイルは ``/app/View/Themed/Example/Posts/edit.ctp``
となります。また、レイアウトファイルは ``/app/View/Themed/Example/Layouts/`` に配置されます。


ビューファイルがテーマに見つからない時、CakePHPは ``/app/View/`` フォルダの中を探します。
これによって、マスタービューファイルを作成して、テーマフォルダには上書きが必要なファイルだけを配置すればよくなります。

テーマアセット
--------------

テーマにはビューファイルのように静的なアセットを含めることができます。テーマはwebrootディレクトリにあるアセットをいくつでも必要なだけ読み込めます。
その結果、テーマのパッケージングと配布は簡単になっています。開発中であってもテーマのアセットへのリクエストは
:php:class:`Dispatcher` によってハンドリングされます。プロダクション環境でのパフォーマンスを改善するためには、
テーマのアセットをアプリケーションのwebrootディレクトリにコピーするかシンボリックリンクを貼ることをお勧めします。
詳しくは以下を参照して下さい。

新しいテーマのwebrootを使うには ``app/View/Themed/<themeName>/webroot<path_to_file>`` のようなディレクトリをテーマの中に作成して下さい。
ディスパッチャはビューパスから正しいテーマのアセットの検索をハンドリングします。

..
  All of CakePHP's built-in helpers are aware of themes and will create the
  correct paths automatically. Like view files, if a file isn't in the theme
  folder, it will default to the main webroot folder::

CakePHPのすべての組み込みヘルパーはテーマに対応しており、自動的に正しいパスが作成されます。
ビューファイルのようにテーマフォルダにファイルが無い場合、メインのwebrootフォルダがデフォルトととなります。 ::

    //'purple_cupcake'という名前のテーマの時
    $this->Html->css('main.css');
    
    //パスの作成は以下の通り
    /theme/purple_cupcake/css/main.css
    
    //リンク
    app/View/Themed/PurpleCupcake/webroot/css/main.css

プラグインとテーマアセットのパフォーマンスを改善する
----------------------------------------------------

PHPを通してアセットを提供するとPHPを通さずにアセットを提供した場合より確実に遅くなることはよく知られています。
コアチームは出来るだけ速いプラグインとテーマのアセットを提供しようとコツコツと努力を重ねていますが、
より高い性能が必要とされる状況はあるかもしれません。そのような状況では、シンボリックリンクを張るかプラグインとテーマのアセットを
CakePHPによって使われている ``app/webroot`` のパスに一致するディレクトリにコピーすることが推奨されます。

-  ``app/Plugin/DebugKit/webroot/js/my_file.js`` は
   ``app/webroot/debug_kit/js/my_file.js`` になります。
-  ``app/View/Themed/Navy/webroot/css/navy.css`` は
   ``app/webroot/theme/Navy/css/navy.css`` になります。


.. meta::
    :title lang=en: Themes
    :keywords lang=en: production environments,theme folder,layout files,development requests,callback functions,folder structure,default view,dispatcher,symlink,case basis,layouts,assets,cakephp,themes,advantage


