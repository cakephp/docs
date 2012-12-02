トランザクション    
################

トランザクションを実行するには、テーブルの種類がトランザクションをサポートしている必要があります。

全てのトランザクションメソッドは、モデルのデータソースオブジェクトが実行しなければなりません。モデルの内部でデータソースを取得するには、以下を使用してください。

::

    $dataSource = $this->getDataSource();

これで、データソースを用いてトランザクションを開始・コミット・ロールバックすることができるようになりました。

::

    $dataSource->begin();

    // 幾つかのタスクを実行する

    if (/*すべて成功*/) {
        $dataSource->commit();
    } else {
        $dataSource->rollback();
    }

ネスト化されたトランザクション
-------------------------------

:php:meth:`Datasource::begin()` メソッドによって、トランザクションを複数回開始することができます。
トランザクションは、beginと一致するコミットとロールバックの回数だけ実行されるでしょう。
::

    $dataSource->begin();
    // 幾つかのタスクを実行する
    $dataSource->begin();
    // More few tasks
    if (/*最後のタスクが完了*/) {
        $dataSource->commit();
    } else {
        $dataSource->rollback();
        // メインタスクの処理を変更する
    }
    $dataSource->commit();

もしデータベースがネスト化されたトランザクションをサポートし、それをデータソース内で行うことができるなら、ネスト化されたトランザクションを実行できるでしょう。
ネスト化されたトランザクションをサポートしないか利用できない場合、このメソッドは常にtrueを返します。

もし複数のbeginを使いたいがデータベースのネスト化されたトランザクションを使いたくないなら、``$dataSource->useNestedTransactions = false;`` とすることでそれを無効にします。その場合には、グローバルトランザクションだけを使うことができます。 

ネスト化されたトランザクションはデフォルトでは利用不可となっています。これを使うためには、\ ``$dataSource->useNestedTransactions = true;``\ として下さい。

.. meta::
    :title lang=en: Transactions
    :keywords lang=en: transaction methods,datasource,rollback,data source,begin,commit,nested transaction
