コントローラーからのバリデーション
##################################

通常は単にモデルの save メソッドを使うことが多いと思いますが、時には
データを保存せずにバリデーション（妥当性チェック）だけをやりたいという
ケースもあるかもしれません。たとえばデータベースに実際にデータを保存
する前に、なんらかの追加情報を表示したい場合もあるでしょう。
バリデーションには単なるデータの保存とは若干異なる処理が必要です。

まず、データをモデルにセットします::

    $this->ModelName->set($this->request->data);

そしてバリデーションするにはモデルの validates メソッドを使います。
これはデータが正しければ true 、エラーがあれば false を返します::

    if ($this->ModelName->validates()) {
        // 正しい場合のロジック
    } else {
        // 正しくない場合のロジック
        $errors = $this->ModelName->validationErrors;
    }

モデルで指定されているバリデーションのうちの、一部だけを適用
したい場合もあると思います。たとえば User というモデルがあって、
その中に first\_name, last\_name, email, password という項目が
あるとします。ユーザを作成または編集するためのインスタンスでは、
4 項目すべてのバリデーションを行うべきですね。一方ユーザがログイン
する際は email と password のルールだけをチェックすれば済みます。
これを行うには、チェックする項目を指定したオプション配列を渡して
あげます::

    if ($this->User->validates(array('fieldList' => array('email', 'password')))) {
        // バリデーションOK
    } else {
        // バリデーションNG
    }

validates メソッドは invalidFields メソッドを呼び出しますが、
この中でモデルの validationErrors プロパティを設定します。
invalidFields はまた、そのデータを結果として返します::

    $errors = $this->ModelName->invalidFields(); // validationErrors 配列を返す

バリデーション結果のエラーリストは一連の ``invalidFields()`` の
呼び出しの間はクリアされません。このため、ループの中でバリデーション
を行っている際にそれぞれのエラーを個別に取得する場合は、
``invalidFields()`` を使ってはいけません。その代わりに ``validates()``
を使い、モデルのプロパティである ``validationErrors`` にアクセス
してください。

重要な点としては、データのバリデーションを行うにあたり、事前にその
データはモデルにセットされていなければならないということです。
これは、データがパラメータとして渡される save メソッドとは異なります。
さらに、必ずしも save の前に validates を呼ぶ必要もありません。
これは、save では実際にデータの保存をする前に、自動的にバリデーション
が行われるためです。

複数のモデルのバリデーションを行うには次のアプローチを使います::

    if ($this->ModelName->saveAll(
        $this->request->data, array('validate' => 'only')
    )) {
      // データは有効
    } else {
      // データは無効
    }

もし save の前に妥当性チェックが終わっていれば、二度目のチェックを
省略することができます::

    if ($this->ModelName->saveAll(
        $this->request->data, array('validate' => false)
    )) {
        // チェックを省略して保存する
    }


.. meta::
    :title lang=ja: Validating Data from the Controller
    :keywords lang=ja: password rules,validations,subset,array,logs,logic,email,first name last name,models,options,data model
