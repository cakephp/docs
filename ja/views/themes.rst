テーマ
######

CakePHP のテーマは、テンプレートファイルを供給することに集中したシンプルなプラグインです。
:ref:`plugin-create-your-own` のセクションをご覧ください。
テーマには、ページの見た目や雰囲気を簡単に素早く切り替えられるようになるという利点があります。
もし必要であれば、テンプレートファイルに追加してヘルパーやセルもまた供給することができます。
ヘルパーやセルをテーマで使うときは、 :term:`プラグイン記法` を使い続ける必要があります。

テーマを使うためには、コントローラーのアクションをテーマ名にするか
``beforeRender()`` をコールバックしてください。 ::

    class ExamplesController extends AppController
    {
        // CakePHP 3.1 より前
        public $theme = 'Modern';

        public function beforeRender(\Cake\Event\Event $event)
        {
            $this->viewBuilder()->setTheme('Modern');

            // CakePHP 3.5 より前
            $this->viewBuilder()->theme('Modern');
        }
    }

テーマのテンプレートファイルは、同じ名前のプラグイン内にある必要があります。
例えば、上記のテーマは **plugins/Modern/src/Template** で見つかるでしょう。
CakePHP は plugin/theme の名前にキャメルケースを期待しています。これは大切な
ことなので覚えておいてください。
さらに **plugins/Modern/src/Template** の中のフォルダー構造は **src/Template/** と
全く同じにしてください。

例えば、Posts コントローラーの edit アクションのためのビューファイルは
**plugins/Modern/src/Template/Posts/edit.ctp** に配置されて、レイアウトファイルは
**plugins/Modern/src/Template/Layout/** に配置されます。カスタマイズされた
テンプレートにプラグイン・テーマを供給することもできます。
TagsController を含んだ 'Cms' と名付けられたプラグインがある場合、テーマ Modern は
edit テンプレートを **plugins/Modern/src/Template/Plugin/Cms/Tags/edit.ctp**
に置き換えます。

テーマの中にビューファイルを見つけられなかった場合、CakePHP はビューファイルを
**src/Template/** に配置しようとします。この方法によって、マスターテンプレートファイルを
作成して、テーマフォルダーには上書きが必要なファイルだけを配置すればよくなります。

テーマアセット
==============

テーマは CakePHP の標準のプラグインなので、必要なアセットを webroot ディレクトリーに
含めることができます。これは、テーマの配布と容易なパッケージングを可能にさせます。
開発中、テーマのアセットへのリクエストは :php:class:`Cake\\Routing\\Dispatcher` 
によってハンドリングされます。プロダクション環境でパフォーマンスを改善するためには、
:ref:`symlink-assets` を推奨します。

CakePHP の全ての組み込みヘルパーはテーマを認識しており、正確なパスを自動的に生成します。
テンプレートファイル同様に、ファイルがテーマフォルダーの中に無かったら
メインの webroot フォルダーをデフォルトにします。 ::

    // 'purple_cupcake'という名前のテーマの時
    $this->Html->css('main.css');

    // 以下のパスを生成する
    /purple_cupcake/css/main.css

    // 以下をリンクする
    plugins/PurpleCupcake/webroot/css/main.css

.. meta::
    :title lang=ja: Themes
    :keywords lang=ja: production environments,theme folder,layout files,development requests,callback functions,folder structure,default view,dispatcher,symlink,case basis,layouts,assets,cakephp,themes,advantage
