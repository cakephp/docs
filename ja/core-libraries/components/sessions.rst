セッション
##########

.. php:class:: SessionComponent(ComponentCollection $collection, array $settings = array())

CakePHP の SessionComponent は、複数のページにわたってクライアントのデータを継続して
保持する方法を提供します。このコンポーネントは ``$_SESSION`` 変数に関連した
いくつかの便利なメソッドを持つラッパのように振舞います。

CakePHP ではセッションの複数の方法で設定を行えます。
詳しくは :doc:`セッションの設定 </development/sessions>` を参照してください。

セッションデータを伝達する
==========================

SessionComponent はセッション情報を伝えあうために使われます。
ユーザへ出力するメッセージの作成はもちろんのこと、基本的な CRUD 機能が含まれます。

覚えておきたいことは、 :term:`ドット記法` により配列構造で作成可能ということです。
そのため ``User.username`` は、次のような値が参照されます。 ::

    array('User' => array(
        'username' => 'clark-kent@dailyplanet.com'
    ));

ドット (.) は、多次元配列のために使われます。
この表記は、SessionComponent 内で使用されるどの name/key においても使われます。

.. php:method:: write($name, $value)

    $name のなかに、$value をセッションとして格納します。
    $name には、ドット記法の配列を使用できます。
    たとえば::

        $this->Session->write('Person.eyeColor', 'Green');

    これは 'Green' という値を、 Person => eyeColor というキーに書き込んでいます。

.. php:method:: read($name)

    セッション内の $name というキーの値を返します。
    もし $name が null の場合、セッション全体の値を返します。::

        $green = $this->Session->read('Person.eyeColor');

    セッションから 'Green' という値を取り出します。キー存在しない場合は null が返されます。

.. php:method:: consume($name)

    セッションから値の読み込みと削除をします。一回の操作で、読み込みと削除を組み合わせたい
    ときに便利です。

.. php:method:: check($name)

    セッションの値がセットされているかチェックするために使用します。
    存在する場合は true を、存在しない場合は false を返します。

.. php:method:: delete($name)

    $name キーのセッションをクリアします。
    例::

        $this->Session->delete('Person.eyeColor');

    セッションには 'Green' という値も eyeColor というキーも、もう存在しません。
    しかし、 Person というキーはまだあります。
    Person 全体を削除するためには次のようにします。 ::

        $this->Session->delete('Person');

.. php:method:: destroy()

    ``destroy`` メソッドは、セッションクッキーと temporary file system 内の
    すべてのセッションデータを削除します。PHP セッションを無効にし、新鮮なセッションを
    作成します。 ::

        $this->Session->destroy();


.. _creating-notification-messages:

通知メッセージの作成
====================

.. php:method:: setFlash(string $message, string $element = 'default', array $params = array(), string $key = 'flash')

    .. deprecated:: 2.7.0
        フラッシュメッセージの作成には :doc:`/core-libraries/components/flash`
        を使用すべきです。 setFlash() メソッドは、3.0.0 で削除されます。

    ウェブアプリケーションではしばしば、フォームの処理やデータの受け取り時に、一回限りの通知を
    ユーザに対して表示したいときがあります。このような通知を CakePHP では、
    「フラッシュメッセージ」と呼んでいます。SessionComponent によって
    フラッシュメッセージをセットし、 :php:meth:`SessionHelper::flash()` を使用し表示します。
    メッセージのセットは、 ``setFlash`` を使用します。 ::

        // controller にて
        $this->Session->setFlash('Your stuff has been saved.');

    ユーザに表示する一回限りのメッセージが作成されます。
    セッションヘルパーを使用します。 ::

        // view にて
        echo $this->Session->flash();

        // このように出力されます
        <div id="flashMessage" class="message">
            保存しました
        </div>

    ほかの種類の フラッシュメッセージ を表示するために ``setFlash()`` に追加のパラメータを
    設定できます。たとえば、エラー・成功・注意に別の見た目にするかもしれません。
    CakePHP は、そのような場合のやり方を用意しています。
    ``$key`` パラメータを使い、多数のメッセージを保存し、別々に出力することができます。 ::

        // bad message をセット
        $this->Session->setFlash('Something bad.', 'default', array(), 'bad');

        // good message をセット
        $this->Session->setFlash('Something good.', 'default', array(), 'good');

    ビュー内にて、次のように別々の見た目で出力できます。 ::

        // viewにて
        echo $this->Session->flash('good');
        echo $this->Session->flash('bad');

    ``$element`` パラメータは、 ``/app/View/Elements`` 内のどのエレメントを使用し
    メッセージを表示するかに使います。エレメント内では ``$message`` によってメッセージを
    利用できます。まずコントローラ内でメッセージをセットします。 ::

        $this->Session->setFlash('Something custom!', 'flash_custom');

    エレメントファイル ``app/View/Elements/flash_custom.ctp`` を作成し、特別な表示が
    されるようにします::

        <div id="myCustomFlash"><?php echo h($message); ?></div>

    ``$params`` は追加の変数をビューに渡します。パラメータは描画した div に影響を及ぼします。
    たとえば、配列 $params に "class" を追加し、レイアウトやビュー内で
    ``$this->Session->flash()`` を使用し ``div`` に class を適用します。 ::

        $this->Session->setFlash(
            'Example message text',
            'default',
            array('class' => 'example_class')
        );

    上記の例で ``$this->Session->flash()`` を使用した出力は次のようになります。 ::

        <div id="flashMessage" class="example_class">Example message text</div>

    ``$params`` 内でプラグインの使用を明示し、プラグイン内のエレメントを使用するには
    次のようにします。::

        // /app/Plugin/Comment/View/Elements/flash_no_spam.ctp が使用されます
        $this->Session->setFlash('Message!', 'flash_no_spam', array('plugin' => 'Comment'));

    .. note::
        CakePHP は、デフォルトではフラッシュメッセージを HTML エスケープしません。
        もしリクエストやユーザーデータをフラッシュメッセージに含める場合は、
        メッセージを整形するときにそれらを :php:func:`h` でエスケープするべきです。


.. meta::
    :title lang=ja: セッション
    :keywords lang=ja: php 配列,dailyplanet com,設定ドキュメント,ドット記法,フィードバックメッセージ,データ読み込み,セッションデータ,ページリクエスト,クラーク・ケント,ドット,存在,セッション,便利,cakephp
