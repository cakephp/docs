フラッシュ
##########

.. php:namespace:: Cake\Controller\Component

.. php:class:: FlashComponent(ComponentCollection $collection, array $config = [])

FlashComponent は、フォームの処理後やデータの確認のために表示する一回限りのメッセージ通知に
使用します。このような通知を CakePHP では「フラッシュメッセージ」と呼んでいます。
FlashComponent はフラッシュメッセージを ``$_SESSION`` に書き込みます。そして
:doc:`FlashHelper </views/helpers/flash>` を使ってビューで表示します。

フラッシュメッセージの設定
==========================

FlashComponent は、フラッシュメッセージの設定に２つの方法を用意しています。
ひとつは、 ``__call()`` マジックメソッドで、もうひとつは ``set()`` メソッドです。
アプリケーションをより様々な表現を用いて利用するためには、 FlashComponent の ``__call()``
マジックメソッドを利用することで **src/Template/Element/Flash** ディレクトリ以下に配置された
エレメントをマッピングしたメソッド名を使用することができます。規約により、キャメルケース形式の
メソッドは、小文字でアンダースコア区切りのエレメント名に置き換えられます。 ::

    // src/Template/Element/Flash/success.ctp を使用
    $this->Flash->success('This was successful');

    // src/Template/Element/Flash/great_success.ctp を使用
    $this->Flash->greatSuccess('This was greatly successful');

あるいは、エレメントをレンダリングしないで平文メッセージを設定するためには、
``set()`` メソッドを用いることができます。 ::

    $this->Flash->set('This is a message');


.. versionadded:: 3.1

    フラッシュメッセージはスタックです。 ``set()`` あるいは ``__call()`` が同一のキーとともに
    正常に呼び出されたら、 ``$_SESSION`` にメッセージを付け加えます。
    もし、古いビヘイビア(連続した呼び出しのあとのあるメッセージ)を保っておきたい場合は、
    コンポーネントの設定のときに ``clear`` パラメータを ``true`` にしてください。

FlashComponent の ``__call()`` および ``set()`` メソッドは任意に第2引数をとります、
その配列のオプションは以下の通りです。

* ``key`` デフォルトは ‘flash’。セッション内の ‘Flash’ キー配下の配列キー。
* ``element`` デフォルトは null ですが、 ``__call()`` マジックメソッドの使用時には、
  自動的に設定されます。表示に使用されるエレメント名。
* ``params`` キーバリューの任意の配列です。エレメントの中で変数として利用する配列。

.. versionadded:: 3.1

    新しいキーの ``clear`` が追加されました。このキーは ``bool`` 値を期待しており、
    現在のスタックの全てのメッセージを消去し、新しいものを始めることができます。

オプションの使用例::

    // コントローラの中で
    $this->Flash->success('The user has been saved', [
        'key' => 'positive',
        'params' => [
            'name' => $user->name,
            'email' => $user->email
        ]
    ]);

    // ビューの中で
    <?= $this->Flash->render('positive') ?>

    <!-- src/Template/Element/Flash/success.ctp の中で -->
    <div id="flash-<?= h($key) ?>" class="message-info success">
        <?= h($message) ?>: <?= h($params['name']) ?>, <?= h($params['email']) ?>.
    </div>

``__call()`` マジックメソッドを使用している時、 ``element`` オプションは、常に置き換えられます。
プラグインから指定したエレメントを取得するためには、 ``plugin`` パラメータをセットしてください。
例::

    // コントローラの中で
    $this->Flash->warning('My message', ['plugin' => 'PluginName']);

上記のコードは ``plugins/PluginName/src/Template/Element/Flash`` 配下の
``warning.ctp`` エレメントを使用しています。

.. note::

    デフォルトでは、CakePHP は、クロスサイトスクリプティング防止のためにフラッシュメッセージ中の
    内容はエスケープします。フラッシュメセージ中のユーザーデータは、HTML エンコードされ、
    安全に表示されます。もし、フラッシュメッセージの中に HTML を含めたい場合、
    ``escape`` オプションをセットする必要があり、escape オプションがセットされた際に、
    エスケープを無効にするようにフラッシュメッセージのテンプレートを調整してください。

フラッシュメッセージ内の HTML
=============================

.. versionadded:: 3.3.3

``'escape'`` オプションキーを使用することでフラッシュメッセージ中に
HTML を出力することができます。 ::

    $this->Flash->info(sprintf('<b>%s</b> %s', h($highlight), h($message)), ['escape' => false]);

手動で入力をエスケープされることを確かめてください。上記の例では、
``$highlight`` と ``$message`` は、非 HTML な入力で、エスケープされます。

フラッシュメッセージの表示に関する詳しい情報は、 :doc:`FlashHelper </views/helpers/flash>`
セクションをご覧ください。
