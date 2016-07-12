フラッシュ
##########

.. php:namespace:: Cake\View\Helper

.. php:class:: FlashHelper(View $view, array $config = [])

FlashHelperは、 :doc:`FlashComponent </controllers/components/flash>` によって ``$_SESSION`` にセットされたフラッシュメッセージをレンダリングする方法を提供しています。
:doc:`FlashComponent </controllers/components/flash>` および FlashHelperはフラッシュメッセージをレンダリングするために、まずエレメントを利用します。
フラッシュエレメントは **src/Template/Element/Flash** ディレクトリ以下に存在します。
CakePHPのアプリケーションテンプレートは2つのフラッシュエレメントから成ることに注意してください。 **success.ctp** と **error.ctp** です。

フラッシュメッセージをレンダリングする
======================================

フラッシュメッセージをレンダリングするためには、単に ``render()`` メソッドを使用するだけで良いです。::

    <?= $this->Flash->render() ?>

デフォルトでは、CakePHPはセッション内部のフラッシュメッセージには "flash" キーを利用します。
しかし、もし :doc:`FlashComponent </controllers/components/flash>` 内のフラッシュメッセージをセットするときに、キーを明示したい場合は、レンダリングするのはどのフラッシュキーかを明示できます。::

    <?= $this->Flash->render('other') ?>

FlashComponentの中で設定したオプションをオーバーライドすることもできます。::

    // In your Controller
    $this->Flash->set('The user has been saved.', [
        'element' => 'success'
    ]);

    // In your View: Will use great_success.ctp instead of succcess.ctp
    <?= $this->Flash->render('flash', [
        'element' => 'great_success'
    ]);

.. note::

    デフォルトでは、CakePHPはフラッシュメッセージのHTMLをエスケープしません。
    もしフラッシュメッセージでリクエストやユーザデータを使用している場合は、メッセージをフォーマットするとき :php:func:`h` を使ってエスケープしてください。

.. versionadded:: 3.1

    :doc:`FlashComponent </controllers/components/flash>` はメッセージをスタックしています。
    複数のフラッシュメッセージをセットした場合、 ``render()`` を呼び出すと、それぞれのメッセージが設定された順番でそれぞれのエレメントの中でレンダリングされます。

使用できる配列オプションについてもっと知りたい場合は、 :doc:`FlashComponent </controllers/components/flash>` セクションをご覧ください。

ルーティングのプレフィックスとフラッシュメッセージについて
==========================================================

.. versionadded:: 3.0.1

設定したルーティングのプレフィックスがある場合、Flashエレメントを **src/Template/{Prefix}/Element/Flash** に置きます。
このやり方では、アプリケーションのそれぞれの部分の特定のメッセージレイアウトを作成できます(例えば、フロントエンドと管理者側とで異なるレイアウトを設定する場合です)。

フラッシュメッセージとテーマについて
====================================

FlashHelperはメッセージをレンダリングする際、通常のエレメントを使用し、明示した場合はそのテーマに従います。
テーマが **src/Template/Element/Flash/error.ctp** を持つ場合、ElementやViewと同様にそれを利用します。
