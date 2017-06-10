データの削除
############

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

.. php:method:: delete(Entity $entity, $options = [])

読み込んだエンティティーは、テーブル本来の削除メソッドを呼びだすことによって削除することが出来ます。 ::

    // コントローラーの中
    $entity = $this->Articles->get(2);
    $result = $this->Articles->delete($entity);

エンティティー削除時には、いくつかのことが起こります。

1. :ref:`削除ルール <application-rules>` が適用されます。 ルールのチェックに失敗した場合、
   削除は中止されます。
2. ``Model.beforeDelete`` イベントが起動されます。このイベントが停止した場合、削除は失敗し、
   イベントの戻り値が返されます。
3. エンティティーが削除されます。
4. 全ての依存関係先が削除されます。依存関係先がエンティティーとして削除されるとき、
   追加のイベントが起動されます。
5. BelongsToMany アソシエーション用の全ての結合テーブルのレコードが削除されます。
6. ``Model.afterDelete`` イベントが起動されます。

デフォルトでは、一回のトランザクションの中で全ての削除が行われますが、
atomic オプションで無効化することも出来ます。 ::

    $result = $this->Articles->delete($entity, ['atomic' => false]);

連鎖削除
--------

エンティティーを削除するとき関連データを削除することもできます。HasOne や HasMany が
``dependent`` として設定されている場合、削除処理はそれらのエンティティーにも連鎖適用されます。
デフォルトでは、関連テーブル内のエンティティーの削除には :php:meth:`Cake\\ORM\\Table::deleteAll()`
が使用されます。 ``cascadeCallbacks`` オプションを ``true`` に設定することにより、
関連するエンティティーを ORM に読み出させ、それらを個別に削除させるように選択できます。
上記２つのオプションを有効にした HasMany のサンプルは、このようになります。 ::

    // テーブル内の初期化メソッド
    $this->hasMany('Comments', [
        'dependent' => true,
        'cascadeCallbacks' => true,
    ]);

.. note::

    ``cascadeCallbacks`` が ``true`` の時、一括削除に比較して削除処理はだいぶ遅くなります。
    cascadeCallbacks オプションは、あなたのアプリケーションがイベントリスナーによって処理される
    重要な仕事を持っている場合のみ有効にされるべきです。

一括削除
--------

.. php:method:: deleteAll($conditions)

一行ずつ削除することが効率的でなかったり有用ではない時があります。そういったケースでは、
一回で複数行を削除するために、一括削除を使うことが効率的です。 ::

    // 全てのスパムを削除する
    function destroySpam()
    {
        return $this->deleteAll(['is_spam' => true]);
    }

一括削除では、１つ以上の行が削除されると成功したとみなされます。

.. warning::

    deleteAll は、beforeDelete/afterDelete イベントを *呼び出しません* 。
    それらのイベントを呼び出したい場合、それぞれのレコードを読み込んで削除する必要があります。

厳密な削除
----------

.. php:method:: deleteOrFail($entity, $options = [])


このメソッドを使用すると、エンティティーが新しく主キーの値を持たず、
アプリケーションルールのチェックに失敗したり、削除がコールバックによって中断された場合、
:php:exc:`Cake\\ORM\\Exception\\PersistenceFailedException` を投げます。

保存に失敗したエンティティーを追跡する場合、
:php:meth:`Cake\\ORM\Exception\\PersistenceFailedException::getEntity()` メソッドを
使用できます。 ::

        try {
            $table->deleteOrFail($entity);
        } catch (\Cake\ORM\Exception\PersistenceFailedException $e) {
            echo $e->getEntity();
        }

これは内部的に :php:meth:`Cake\\ORM\\Table::delete()`
コールを実行するので、対応するすべての削除イベントがトリガーされます。

.. versionadded:: 3.4.1
