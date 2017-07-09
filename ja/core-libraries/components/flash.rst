フラッシュ
###########

.. php:class:: FlashComponent(ComponentCollection $collection, array $config = array())

FlashComponent は、フォームの処理後やデータの確認のために表示する一回限りのメッセージ通知に
使用します。 このような通知を CakePHP では「フラッシュメッセージ」と呼んでいます。
FlashComponent は、 ``$_SESSION`` にフラッシュメッセージを書き込みます。そして、
:doc:`FlashHelper </core-libraries/helpers/flash>` を使ってビューで表示します。

FlashComponent は、 非推奨となった ``SessionComponent`` の ``setFlash()`` メソッドを
置き換えるコンポーネントです。

フラッシュメッセージの設定
==========================

FlashComponent は、フラッシュメッセージの設定に２つの方法を用意しています。
ひとつは、 ``__call`` マジックメソッドで、もうひとつは ``set()`` メソッドです。

デフォルトのフラッシュメッセージハンドラを使用するために、 ``set()`` メソッドが
使用できます。 ::

    $this->Flash->set('This is a message');

.. versionadded:: 2.10.0

    フラッシュメッセージは積み重なります。連続して ``set()`` や ``__call()`` を同じキーで
    呼び出すと、 ``$_SESSION`` にメッセージが追加されます。古い動作 (連続して呼び出しても
    １つのメッセージ) を保ちたい場合、メッセージをセットする際に ``clear`` オプションに
    true をセットしてください。

独自の Flash エレメントを作成するためには、 FlashComponent の ``__call`` マジック
メソッドで、 ``app/View/Elements/Flash`` ディレクトリ以下に配置されたエレメントと
メソッド名を関連づけることができます。規約により、キャメルケース形式のメソッドは、
小文字でアンダースコア区切りのエレメント名に置き換えられます。 ::

    // app/View/Elements/Flash/success.ctp を使用
    $this->Flash->success('This was successful');

    // app/View/Elements/Flash/great_success.ctp を使用
    $this->Flash->greatSuccess('This was greatly successful');

FlashComponent の ``__call`` や ``set()`` メソッドは、第２引数にオプションの配列を
設定できます。

* ``key`` デフォルトは 'flash'。セッション内の 'Flash' キー配下の配列キー。
* ``element`` デフォルトは null ですが、 ``__call()`` マジックメソッドの使用時には、
  自動的に設定されます。表示に使用されるエレメント名。
* ``params`` エレメントの中で変数として利用する配列。
* ``clear`` 指定されたキーや要素の既存のフラッシュメッセージを削除するために
  ``true`` をセットしてください。(2.10.0 で追加)

オプションの使用例::

    // コントローラの中で
    $this->Flash->success('The user has been saved', array(
        'key' => 'positive',
        'params' => array(
            'name' => $user['User']['name'],
            'email' => $user['User']['email']
        )
    ));

    // ビューの中で
    <?php echo $this->Flash->render('positive') ?>

    <!-- app/View/Elements/Flash/success.ctp の中で -->
    <div id="flash-<?php echo h($key) ?>" class="message-info success">
        <?php echo h($message) ?>: <?php echo h($params['name']) ?>, <?php echo h($params['email']) ?>.
    </div>

``__call()`` マジックメソッドを使用している時、 ``element`` オプションは、
常に置き換えられます。プラグインから指定したエレメントを取得するためには、
``plugin`` パラメータをセットしてください。
例::

    // コントローラの中で
    $this->Flash->warning('My message', array('plugin' => 'PluginName'));

上記のコードは、 ``plugins/PluginName/View/Elements/Flash`` 配下の warning.ctp
エレメントを使用しています。

.. note::
    デフォルトでは、CakePHP は、フラッシュメッセージ中の HTML はエスケープしません。
    もし、任意のリクエストやユーザーデータをフラッシュメッセージ中で使用する場合は、
    メッセージを表示する際に :php:func:`h` でエスケープしなければなりません。

フラッシュメセージの表示に関する詳しい情報は、
:doc:`FlashHelper </core-libraries/helpers/flash>` セクションをご覧ください。
