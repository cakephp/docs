Flash
#####

.. php:namespace:: Cake\View\Helper

.. php:class:: FlashHelper(View $view, array $config = [])

FlashHelperは、 :doc:`FlashComponent </controllers/components/flash>` によって
``$_SESSION`` にセットされたフラッシュメッセージを描画する方法を提供しています。
:doc:`FlashComponent </controllers/components/flash>` および
FlashHelper はフラッシュメッセージを描画するためのエレメントを使用します。
フラッシュエレメントは **templates/element/flash** ディレクトリー以下に存在します。
CakePHP の App テンプレートには、 **success.php** 、 **default.php** と **error.php** の
3つのフラッシュエレメントが付属しています。

フラッシュメッセージの描画
==========================

フラッシュメッセージを描画するためには、テンプレートファイルの中で FlashHelper の ``render()``
メソッドを使用します。 ::

    <?= $this->Flash->render() ?>

デフォルトでは、CakePHP は、フラッシュメッセージのためにセッション中の "flash" キーを使用します。
しかし、 :doc:`FlashComponent </controllers/components/flash>` の中でフラッシュメッセージを
設定した時にキーを指定した場合、そのキーを指定して描画します。 ::

    <?= $this->Flash->render('other') ?>

FlashComponent の中で設定したオプションを上書きすることもできます。 ::

    // コントローラーの中で
    $this->Flash->set('The user has been saved.', [
        'element' => 'success'
    ]);

    // テンプレートファイルの中で、 success.php の代わりに great_success.php を使用
    <?= $this->Flash->render('flash', [
        'element' => 'great_success'
    ]);

.. note::

    フラッシュメッセージの独自テンプレートを作成する場合、全てのユーザーデータを適切に
    HTML エンコードしてください。CakePHP は、フラッシュメッセージのパラメーターをエスケープしません。

.. versionadded:: 3.1

    :doc:`FlashComponent </controllers/components/flash>` はメッセージをスタックしています。
    複数のフラッシュメッセージをセットした場合、 ``render()`` を呼び出すと、それぞれのメッセージが
    設定された順番でそれぞれのエレメントの中で描画されます。

使用できる配列オプションについてもっと知りたい場合は、
:doc:`FlashComponent </controllers/components/flash>` セクションをご覧ください。

ルーティングのプレフィックスとフラッシュメッセージ
==================================================

.. versionadded:: 3.0.1

設定したルーティングのプレフィックスがある場合、フラッシュエレメントを
**templates/{Prefix}/element/flash** に置きます。
これにより、アプリケーションの各部分に特定のメッセージレイアウトを設定できます。
例えば、フロントエンドと管理者のセクションで異なるレイアウトを使用する場合です。

フラッシュメッセージとテーマ
============================

FlashHelper は、メッセージを描画するために標準のエレメントを使用し、指定したテーマに従います。
そのため、テーマが **templates/element/flash/error.php** ファイルを持つ場合、
エレメントやビューと同様に使用されます。
