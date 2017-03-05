Form
####

.. php:namespace:: Cake\View\Helper

.. php:class:: FormHelper(View $view, array $config = [])

FormHelper は、フォーム作成時の力作業のほとんどを代行してくれます。
FormHelper は、フォームを素早く作成し、検証、再配置、レイアウトを効率化します。
FormHelper は、柔軟でもあります。通常は規約に沿ってほとんどのことをやってくれますが、
特定のメソッドを使って必要な機能だけを使うこともできます。

フォームの開始
==============

.. php:method:: create(mixed $context = null, array $options = [])

FormHelper を活用するために最初に使うメソッドは ``create()`` です。
このメソッドは、フォームの開始タグを出力します。

パラメータはすべてオプションです。 ``create()`` が、パラメータなしで呼ばれた場合、
現在の URL を元に現在のコントローラーに送信するためのフォームを作ろうとしているものとみなします。
フォーム送信のためのデフォルトのメソッドは POST です。UsersController::add() のビューの中で
``create()`` を呼んだ場合、描画されたビューの中で次のような出力が表示されます。

.. code-block:: html

    <form method="post" action="/users/add">

``$context`` 引数は、フォームの「コンテキスト」として使用されます。
いくつかの組み込みフォームのコンテキストがあり、独自に追加することができます。次のセクションで説明します。
組み込みのプロバイダーは、 ``$context`` の次の値とマップします。

* ``Entity`` インスタンスまたはイテレータは、 ``EntityContext`` にマップされます。
  このコンテキストは、FormHelper が組み込みの ORM の結果を処理できるようにします。
* ``schema`` キーを含む配列は、 ``ArrayContext`` にマップされます。
  これは単純なデータ構造を作成してフォームを構築することができます。
* ``null`` と ``false`` は、 ``NullContext`` にマップされます。
  このコンテキストクラスは、FormHelper が必要とするインターフェースを単に満たすだけです。
  このコンテキストは、ORM の永続性を必要としない短いフォームを作成したい場合に便利です。

すべてのコンテキストクラスは、リクエストデータにアクセスできるため、フォームを簡単に作成できます。

コンテキストを持ったフォームが作成されると、作成したすべてのコントロールはアクティブなコンテキストを使用します。
ORM バックエンドフォームの場合、FormHelper は関連データ、検証エラー、およびスキーマメタデータに
アクセスできます。 ``end()`` メソッドを使用したり、再度 ``create()`` を呼び出すことによって、
アクティブなコンテキストを閉じることができます。エンティティのフォームを作成するには、
次の手順を実行します。 ::

    // /articles/add において
    // $article は、空の Article エンティティである必要があります。
    echo $this->Form->create($article);

出力結果:

.. code-block:: html

    <form method="post" action="/articles/add">

これは ArticlesController の ``add()`` アクションにフォームデータを POST します。
また、編集フォームを作成するために、同じロジックを使用することができます。
FormHelper は、追加または編集のフォームを作成するかどうかを自動的に検出するために、
``Entity`` オブジェクトを使用します。
提供されたエンティティが「新しく」ない場合は、編集フォームとして作成されます。
例えば、 **http://example.org/articles/edit/5** を閲覧すると、次のことができます。 ::

    // src/Controller/ArticlesController.php:
    public function edit($id = null)
    {
        if (empty($id)) {
            throw new NotFoundException;
        }
        $article = $this->Articles->get($id);
        // 保存ロジックがここに入ります
        $this->set('article', $article);
    }

    // View/Articles/edit.ctp:
    // $article->isNew() は false なので、編集フォームが得られます
    <?= $this->Form->create($article) ?>

出力結果:

.. code-block:: html

    <form method="post" action="/articles/edit/5">
    <input type="hidden" name="_method" value="PUT" />

.. note::

    これは編集フォームなので、デフォルトの HTTP メソッドを上書きするために
    hidden 入力フィールドが生成されます。

``$options`` 配列は、ほとんどのフォーム設定が行われる場所です。
この特殊配列には、form タグの生成方法に影響を与えるさまざまなキーと値のペアが含まれます。

.. _form-values-from-query-string:

クエリ文字列からフォームの値を取得
--------------------------------------

.. versionadded:: 3.4.0

FormHelper の値ソースは、input タグなどの描画される要素がどこから値を受け取るかを定義します。

デフォルトでは、FormHelper は、「コンテキスト」をもとにその値を描画します。
``EntityContext`` などのデフォルトのコンテキストは、現在のエンティティや
``$request->getData()`` からデータを取得します。

しかし、クエリ文字列から読み込む必要があるフォームを構築している場合は、 ``FormHelper`` の
``valueSource()`` を使って、どこから入力データを読み込むかを変更できます。 ::

    // コンテキストでクエリ文字列の優先順位をつける
    echo $this->Form->create($article, [
        'valueSources' => ['query', 'context']
    ]);

    // 同じ効果:
    echo $this->Form
        ->setValueSources(['query', 'context'])
        ->create($articles);

    // クエリ文字列からのみのデータの読み取り
    echo $this->Form->create($article);
    $this->Form->setValueSources('query');

    // 同じ効果:
    echo $this->Form->create($article, ['valueSources' => 'query']);

サポートするソースは、 ``context``, ``data`` そして ``query`` です。
単一または複数のソースを使用できます。 ``FormHelper`` によって生成されたウィジェットは
設定した順序でソースから値を集めます。

``end()`` が呼ばれた時、値ソースはデフォルト (``['context']``) にリセットされます。

フォームの HTTP メソッドを変更
------------------------------

``type`` オプションを使用することにより、フォームが使用する HTTP メソッドを変更することができます。 ::

    echo $this->Form->create($article, ['type' => 'get']);

出力結果:

.. code-block:: html

    <form method="get" action="/articles/edit/5">

'file' を指定すると、フォームの送信方法は、'POST' に変更し、form タグに
"multipart/form-data" の enctype が含まれます。
これは、フォーム内部に file 要素がある場合に使用されます。
適切な enctype 属性が存在しない場合は、ファイルのアップロードが機能しない原因となります。 ::

    echo $this->Form->create($article, ['type' => 'file']);

出力結果:

.. code-block:: html

   <form enctype="multipart/form-data" method="post" action="/articles/add">

'put'、 'patch' または 'delete' を使用すると、フォームは機能的に 'post' フォームに相当しますが、
送信されると、HTTP リクエストメソッドは、それぞれ 'PUT'、 'PATCH' または 'DELETE' で上書きされます。
これで、CakePHP は、ウェブブラウザで適切な REST サポートをエミュレートすることができます。

フォームの URL を設定
---------------------

``url`` オプションを使うと、フォームを現在のコントローラやアプリケーションの別のコントローラの
特定のアクションに向けることができます。例えば、フォームを現在のコントローラの ``login()``
アクションに向けるには、次のような $options 配列を与えます。 ::

    echo $this->Form->create($article, ['url' => ['action' => 'login']]);

出力結果:

.. code-block:: html

    <form method="post" action="/users/login">

目的のフォームアクションが現在のコントローラにない場合は、フォームアクションの完全な URL を指定できます。
出力される URL は CakePHP アプリケーションに対する相対になります。 ::

    echo $this->Form->create(null, [
        'url' => ['controller' => 'Articles', 'action' => 'publish']
    ]);

出力結果:

.. code-block:: html

    <form method="post" action="/articles/publish">

または外部ドメインを指定することができます。 ::

    echo $this->Form->create(null, [
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    ]);

出力結果:

.. code-block:: html

    <form method="get" action="http://www.google.com/search">

フォームアクションに URL を出力したくない場合、 ``'url' => false`` を使用してください。

独自バリデータの利用
------------------------

多くの場合、モデルには複数の検証セットがあり、コントローラアクションが適用される
特定の検証ルールに基づいて必要なフィールドに FormHelper を設定する必要があります。
たとえば、Users テーブルには、アカウントの登録時にのみ適用される特定の検証ルールがあります。 ::

    echo $this->Form->create($user, [
        'context' => ['validator' => 'register']
    ]);

上記では ``UsersTable::validationRegister()`` で定義されている ``register``
バリデータの中で定義されたルールを ``$user`` と関連するすべてのアソシエーションに使用します。
関連付けられたエンティティのフォームを作成する場合は、配列を使用して各アソシエーションの検証ルールを
定義できます。 ::

    echo $this->Form->create($user, [
        'context' => [
            'validator' => [
                'Users' => 'register',
                'Comments' => 'default'
            ]
        ]
    ]);

上記は、ユーザーには ``register`` 、そしてユーザーのコメントには ``default`` を使用します。

コンテキストクラスの作成
------------------------

組み込みのコンテキストクラスは基本的なケースをカバーすることを目的としていますが、
異なる ORM を使用している場合は新しいコンテキストクラスを作成する必要があります。
このような状況では、 `Cake\\View\\Form\\ContextInterface
<https://api.cakephp.org/3.0/class-Cake.View.Form.ContextInterface.html>`_
を実装する必要があります。
このインターフェイスを実装すると、新しいコンテキストを FormHelper に追加することができます。
``View.beforeRender`` イベントリスナーやアプリケーションビュークラスで行うのが最善の方法です。 ::

    $this->Form->addContextProvider('myprovider', function ($request, $data) {
        if ($data['entity'] instanceof MyOrmClass) {
            return new MyProvider($request, $data);
        }
    });

コンテキストのファクトリ関数では、正しいエンティティタイプのフォームオプションを確認するための
ロジックを追加できます。一致する入力データが見つかった場合は、オブジェクトを返すことができます。
一致するものがない場合は null を返します。

.. _automagic-form-elements:

フォームコントロールの作成
==========================

.. php:method:: control(string $fieldName, array $options = [])

``control()`` メソッドを使うと完全なフォームコントロールを生成できます。これらのコントロールには、
必要に応じて、囲い込む div、label、コントロールウィジェット、および検証エラーが含まれます。
フォームコンテキストでメタデータを使用することにより、このメソッドは各フィールドに適切な
コントロールタイプを選択します。内部的に ``control()`` は FormHelper の他のメソッドを使います。

作成されるコントロールの型は、カラムのデータ型に依存します。

カラムの型
    得られたフォームのフィールド
string, uuid (char, varchar, その他)
    text
boolean, tinyint(1)
    checkbox
decimal
    number
float
    number
integer
    number
text
    textarea
text で、名前が password, passwd
    password
text で、名前が email
    email
text で、名前が tel, telephone, または phone
    tel
date
    day, month, および year の select
datetime, timestamp
    day, month, year, hour, minute, および meridian の select
time
    hour, minute, および meridian の select
binary
    file

``$options`` パラメータを使うと、必要な場合に特定のコントロールタイプを選択することができます。 ::

    echo $this->Form->control('published', ['type' => 'checkbox']);

.. _html5-required:

モデルのフィールドの検証ルールで入力が必須であり、空を許可しない場合は、囲い込む div は、
クラス名に ``required`` が追加されます。
required オプションを使用して自動的に必須フラグを無効にすることができます。 ::

    echo $this->Form->control('title', ['required' => false]);

フォーム全体のブラウザ検証トリガをスキップするには、
:php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` を使って生成する入力ボタンに対して
``'formnovalidate' => true`` オプションを設定したり、
:php:meth:`~Cake\\View\\Helper\\FormHelper::create()` のオプションで
``'novalidate' => true`` を設定できます。

たとえば、User モデルに username (varchar), password (varchar), approved (datetime)
および quote (text) のフィールドがあるとします。FormHelper の control() メソッドを使用すると、
これらのフォームフィールドすべてに適切なコントロールを作成できます。 ::

    echo $this->Form->create($user);
    // Text
    echo $this->Form->control('username');
    // Password
    echo $this->Form->control('password');
    // Day, month, year, hour, minute, meridian
    echo $this->Form->control('approved');
    // Textarea
    echo $this->Form->control('quote');

    echo $this->Form->button('Add');
    echo $this->Form->end();

日付フィールドのいくつかのオプションを示すより広範な例::

    echo $this->Form->control('birth_dt', [
        'label' => '生年月日',
        'minYear' => date('Y') - 70,
        'maxYear' => date('Y') - 18,
    ]);

以下にある ``control()`` のための特定のオプションに加えて、
コントロールタイプと HTML 属性のオプションを指定することができます（例えば ``onfocus`` など）。

belongsTo または hasOne を使用していて select フィールドを作成する場合は、
Users コントローラに次のものを追加できます（User belongsTo Group を前提とします）。 ::

    $this->set('groups', $this->Users->Groups->find('list'));

その後、ビューテンプレートに以下を追加します。 ::

    echo $this->Form->control('group_id', ['options' => $groups]);

belongsToMany で関連付く Groups の選択ボックスを作成するには、
UsersController に以下を追加します。 ::

    $this->set('groups', $this->Users->Groups->find('list'));

その後、ビューテンプレートに以下を追加します。 ::

    echo $this->Form->control('groups._ids', ['options' => $groups]);

モデル名が2つ以上の単語、たとえば "UserGroup" で構成されている場合、
set() を使用してデータを渡すときは、データを次のように複数形とキャメルケース形式で
名前を付ける必要があります。 ::

    $this->set('userGroups', $this->UserGroups->find('list'));

.. note::

    送信ボタンを生成するために ``FormHelper::control()`` を使用しないでください。
    代わりに :php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` を使用してください。

フィールドの命名規則
--------------------

コントロールウィジェットを作成するときは、フィールドの名前をフォームのエンティティに一致する属性の後に
指定する必要があります。たとえば、 ``$article`` のフォームを作成した場合、
そのプロパティの名前を付けたフィールドを作成します。例えば ``title`` 、 ``body`` と ``published`` 。

``association.fieldname`` を最初のパラメータとして渡すことで、関連するモデルや任意のモデルの
コントロールを作成できます。 ::

    echo $this->Form->control('association.fieldname');

フィールド名のドットは、ネストされたリクエストデータに変換されます。
たとえば、 ``0.comments.body`` という名前のフィールドを作成した場合、
``0[comments][body]`` のような名前属性が得られます。
この規則により、ORM でデータを簡単に保存できます。
さまざまなアソシエーションタイプの詳細は、 :ref:`associated-form-inputs` セクションにあります。

datetime に関連するコントロールを作成する場合、FormHelper はフィールドのサフィックスを追加します。
``year`` 、 ``month`` 、 ``day`` 、 ``hour`` 、 ``minute`` 、または ``meridian``
というフィールドが追加されていることがあります。エンティティがマーシャリングされると、
これらのフィールドは自動的に ``DateTime`` オブジェクトに変換されます。


オプション
----------

``FormHelper::control()`` は、多数のオプションをサポートしています。
``control()`` 自身のオプションに加えて、生成されたコントロールタイプに対するオプションと
HTML 属性を受け付けます。以下は ``FormHelper::control()`` で特有のオプションについて説明します。

* ``$options['type']`` type を指定することで、モデルの設定を上書きして、
  コントロールのタイプを強制することができます。 :ref:`automagic-form-elements`
  にあるフィールド型に加えて、 'file'、 'password'、および HTML5 で
  サポートされているすべてのタイプを作成することもできます。 ::

    echo $this->Form->control('field', ['type' => 'file']);
    echo $this->Form->control('email', ['type' => 'email']);

  出力結果:

  .. code-block:: html

    <div class="input file">
        <label for="field">Field</label>
        <input type="file" name="field" value="" id="field" />
    </div>
    <div class="input email">
        <label for="email">Email</label>
        <input type="email" name="email" value="" id="email" />
    </div>

* ``$options['label']`` 通常はコントロールに付随するラベル内に表示したい文字列を
  このキーに設定します。 ::

    echo $this->Form->control('name', [
        'label' => 'The User Alias'
    ]);

  出力結果:

  .. code-block:: html

    <div class="input">
        <label for="name">The User Alias</label>
        <input name="name" type="text" value="" id="name" />
    </div>

  あるいは、ラベルの出力を無効にするには、このキーに ``false`` を設定します。 ::

    echo $this->Form->control('name', ['label' => false]);

  出力結果:

  .. code-block:: html

    <div class="input">
        <input name="name" type="text" value="" id="name" />
    </div>

  これに配列を設定すると、 ``label`` 要素の追加オプションが提供されます。
  これを行う場合、配列中の ``text`` キーを使ってラベルテキストをカスタマイズすることができます。 ::

    echo $this->Form->control('name', [
        'label' => [
            'class' => 'thingy',
            'text' => 'The User Alias'
        ]
    ]);

  出力結果:

  .. code-block:: html

    <div class="input">
        <label for="name" class="thingy">The User Alias</label>
        <input name="name" type="text" value="" id="name" />
    </div>

* ``$options['error']`` このキーを使用すると、
  デフォルトのモデルエラーメッセージを無効にすることができ、
  たとえば国際化メッセージを設定するために使用できます。

  エラーメッセージの出力とフィールドクラスを無効にするには、
  error キーを ``false`` に設定してください。 ::

    echo $this->Form->control('name', ['error' => false]);

  モデルのエラーメッセージを上書きするには、
  元の検証エラーメッセージと一致するキーを持つ配列を使用します。 ::

    $this->Form->control('name', [
        'error' => ['Not long enough' => __('This is not long enough')]
    ]);

  上記のように、モデルにある各検証ルールに対してエラーメッセージを設定することができます。
  さらに、フォームに国際化メッセージを提供することもできます。

特定のタイプの入力を生成する
============================

汎用的な ``control()`` メソッドに加えて、 ``FormHelper`` には様々な種類の
コントロールタイプを生成するために個別のメソッドがあります。
これらは、コントロールウィジェットそのものを生成するのに使えますが、
完全に独自のフォームレイアウトを生成するために
:php:meth:`~Cake\\View\\Helper\\FormHelper::label()` や
:php:meth:`~Cake\\View\\Helper\\FormHelper::error()` といった
他のメソッドを組み合わせることができます。

.. _general-input-options:

共通オプション
--------------

さまざまなコントロール要素メソッドは、共通のオプションをサポートしています。
これらのオプションはすべて、 ``control()`` でもサポートされています。
繰り返しを減らすために、すべてのコントロールメソッドで共有される共通オプションは次の通りです。

* ``$options['id']`` このキーを設定すると、コントロールの DOM id の値が強制的に設定されます。
  これにより、設定可能な idPrefix が上書きされます。

* ``$options['default']`` コントロールフィールドのデフォルト値を設定します。
  この値は、フォームに渡されるデータにそのフィールドに関する値が含まれていない場合
  (または、一切データが渡されない場合) に使われます。
  明示的なデフォルト値は、スキーマで定義されたデフォルト値を上書きします。

  使用例::

    echo $this->Form->text('ingredient', ['default' => 'Sugar']);

  select フィールドを持つ例（"Medium" サイズがデフォルトで選択されます） ::

    $sizes = ['s' => 'Small', 'm' => 'Medium', 'l' => 'Large'];
    echo $this->Form->select('size', $sizes, ['default' => 'm']);

  .. note::

    checkbox をチェックする目的では ``default`` は使えません。その代わり、コントローラで
    ``$this->request->getData()`` の中の値をセットするか、またはコントロールオプションの
    ``checked`` を ``true`` にします。

    デフォルト値への代入の際 ``false`` を使うのは注意が必要です。
    ``false`` 値はコントロールフィールドのオプションを無効または除外するために使われます。
    そのため ``'default' => false`` では値を全く設定しません。
    代わりに ``'default' => 0`` を使用してください。

* ``$options['value']`` コントロールフィールドに特定の値を設定するために使用します。
  これは、Form、Entity、 ``request->getData()`` などのコンテキストから
  注入される可能性のある値を上書きします。

  .. note::

    コンテキストや valuesSource から値を取得しないようにフィールドを設定したい場合、
    ``$options['value']`` を ``''`` に設定する必要があります (もしくは ``null`` に設定) 。

上記のオプションに加えて、任意の HTML 属性を混在させることができます。
特に規定のないオプション名は HTML 属性として扱われ、生成された HTML のコントロール要素に反映されます。

.. versionchanged:: 3.3.0
    3.3.0 では、FormHelper は、自動的にデータベーススキーマで定義されたデフォルト値を使用します。
    ``schemaDefault`` オプションを ``false`` に設定することで、この動作を無効にすることができます。

select, checkbox, radio に関するオプション
------------------------------------------

* ``$options['value']`` は、選択型コントロール (すなわち型が select、date、time、datetime)
  と組み合わせて使用することもできます。
  コントロールが描画されたときにデフォルトで選択したい項目の値に 'value' を設定します。 ::

    echo $this->Form->time('close_time', [
        'value' => '13:30:00'
    ]);

  .. note::

    date および datetime コントロールの value キーには、UNIX タイムスタンプまたは
    DateTime オブジェクトを使用することもできます。

  ``multiple`` 属性を true に設定した select コントロールでは、
  デフォルトで選択したい値の配列を使うことができます。 ::

    echo $this->Form->select('rooms', [
        'multiple' => true,
        // 値 1 と 3 のオプションがデフォルトとして選択されます
        'default' => [1, 3]
    ]);

* ``$options['empty']`` ``true`` に設定すると、コントロールを空のままにします。

  選択リストに渡されると、ドロップダウンリストに空の値を持つ空白のオプションが作成されます。
  単なる空白の option の代わりにテキストを表示して空の value を使用する場合は、
  empty に文字列を渡してください。 ::

      echo $this->Form->select(
          'field',
          [1, 2, 3, 4, 5],
          ['empty' => '(一つ選ぶ)']
      );

  出力結果:

  .. code-block:: html

      <select name="field">
          <option value="">(一つ選ぶ)</option>
          <option value="0">1</option>
          <option value="1">2</option>
          <option value="2">3</option>
          <option value="3">4</option>
          <option value="4">5</option>
      </select>

  オプションは、キーと値のペアとして指定することもできます。

* ``$options['hiddenField']`` 一部のコントロールタイプ (checkbox や radio) では、
  hidden フィールドが作成されるため、 ``$this->request->getData()`` で値が指定されなくても
  キーが存在します。

  .. code-block:: html

    <input type="hidden" name="published" value="0" />
    <input type="checkbox" name="published" value="1" />

  これは ``$options['hiddenField'] = false`` とすることで無効にできます。 ::

    echo $this->Form->checkbox('published', ['hiddenField' => false]);

  出力結果:

  .. code-block:: html

    <input type="checkbox" name="published" value="1">

  フォーム上に複数のコントロールブロックを作成してグループ化する場合は、
  最初のコントロールを除くすべての入力でこのパラメータを使用する必要があります。
  hidden 入力がページ上の複数の場所にある場合は、入力値の最後のグループだけが保存されます。

  この例では Tertiary Colors だけが渡され、Primary Colors は上書きされます。

  .. code-block:: html

    <h2>Primary Colors</h2>
    <input type="hidden" name="color" value="0" />
    <label for="color-red">
        <input type="checkbox" name="color[]" value="5" id="color-red" />
        Red
    </label>

    <label for="color-blue">
        <input type="checkbox" name="color[]" value="5" id="color-blue" />
        Blue
    </label>

    <label for="color-yellow">
        <input type="checkbox" name="color[]" value="5" id="color-yellow" />
        Yellow
    </label>

    <h2>Tertiary Colors</h2>
    <input type="hidden" name="color" value="0" />
    <label for="color-green">
        <input type="checkbox" name="color[]" value="5" id="color-green" />
        Green
    </label>
    <label for="color-purple">
        <input type="checkbox" name="color[]" value="5" id="color-purple" />
        Purple
    </label>
    <label for="color-orange">
        <input type="checkbox" name="color[]" value="5" id="color-orange" />
        Orange
    </label>

  2番目の入力グループで ``'hiddenField'`` を無効にすると、この動作を防ぐことができます。

  'N' のように 0 以外の別の hidden フィールド値を設定することができます。 ::

      echo $this->Form->checkbox('published', [
          'value' => 'Y',
          'hiddenField' => 'N',
      ]);

日時関連オプション
------------------

* ``$options['timeFormat']`` 時間関連のコントロールセットの select コントロールの書式を
  指定するために使用されます。有効な値は ``12`` 、 ``24`` 、および ``null`` が含まれます。

* ``$options['minYear'], $options['maxYear']`` date/datetime コントロールと組み合わせて使用します。
  年の select フィールドに表示される値の下限および上限を定義します。

* ``$options['orderYear']`` date/datetime コントロールと組み合わせて使用します。
  年の値が設定される順序を定義します。
  有効な値は 'asc' と 'desc' です。
  デフォルト値は 'desc' です。

* ``$options['interval']`` このオプションは、分の select ボックスの間隔を指定します。 ::

    echo $this->Form->control('time', [
        'type' => 'time',
        'interval' => 15
    ]);

  上記は、分の select で 4 つの option を作成します。
  15 分間隔です。

* ``$options['round']`` どちらの方向に丸めるかを `up` または `down` で設定できます。
  デフォルトは null で、これは `interval` にしたがって四捨五入します。

* ``$options['monthNames']`` ``false`` の場合は、テキストの代わりに2桁の数字が使用されます。
  ``['01' => 'Jan', '02' => 'Feb', ...]`` のような配列を指定した場合、指定された配列が使用されます。

input 要素の作成
================

テキスト入力の作成
------------------

.. php:method:: text(string $name, array $options)

FormHelper で利用可能なメソッドには、さらに特定のフォーム要素を作成するためのものがあります。
これらのメソッドの多くでは、特別な $options パラメータを指定できます。
$options は主に (フォーム要素の DOM id の値のような) HTML タグの属性を指定するために使われます。 ::

    echo $this->Form->text('username', ['class' => 'users']);

出力結果:

.. code-block:: html

    <input name="username" type="text" class="users">

パスワード入力の作成
--------------------

.. php:method:: password(string $fieldName, array $options)

パスワードフィールドを作成します。 ::

    echo $this->Form->password('password');

出力結果:

.. code-block:: html

    <input name="password" value="" type="password">

非表示入力の作成
----------------

.. php:method:: hidden(string $fieldName, array $options)

非表示のフォーム入力を作成します。
例::

    echo $this->Form->hidden('id');

出力結果:

.. code-block:: html

    <input name="id" value="10" type="hidden" />

テキストエリアの作成
--------------------

.. php:method:: textarea(string $fieldName, array $options)

textarea コントロールフィールドを作成します。 ::

    echo $this->Form->textarea('notes');

出力結果:

.. code-block:: html

    <textarea name="notes"></textarea>

フォームが編集されると（すなわち、配列 ``$this->request->getData()`` に
``User`` モデルに渡すために保存された情報が含まれている場合）、生成される HTML には
``notes`` フィールドに対応する値が自動的に含まれます。
例:

.. code-block:: html

    <textarea name="notes" id="notes">
    This text is to be edited.
    </textarea>

.. note::

    ``textarea`` コントロールタイプでは ``$options`` 属性の ``'escape'`` キーにより、
    textarea の内容をエスケープするかどうかを指定できます。デフォルトは ``true`` です。

::

    echo $this->Form->textarea('notes', ['escape' => false]);
    // または....
    echo $this->Form->control('notes', ['type' => 'textarea', 'escape' => false]);


**オプション**

:ref:`general-input-options` に加えて、 textarea() はいくつかの固有のオプションをサポートします。

* ``$options['rows'], $options['cols']`` この 2 つのキーは行と列の数を指定します。 ::

    echo $this->Form->textarea('textarea', ['rows' => '5', 'cols' => '5']);

  出力結果:

.. code-block:: html

    <textarea name="textarea" cols="5" rows="5">
    </textarea>

チェックボックスの作成
----------------------

.. php:method:: checkbox(string $fieldName, array $options)

フォームのチェックボックス要素を作成します。また、このメソッドは、
指定されたフィールドのデータ送信を強制するための hidden フォーム入力を生成します。 ::

    echo $this->Form->checkbox('done');

出力結果:

.. code-block:: html

    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" value="1">

$options 配列を使って checkbox の値を指定することもできます。 ::

    echo $this->Form->checkbox('done', ['value' => 555]);

出力結果:

.. code-block:: html

    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" value="555">

FormHelper で hidden 入力を作成したくない場合は::

    echo $this->Form->checkbox('done', ['hiddenField' => false]);

出力結果:

.. code-block:: html

    <input type="checkbox" name="done" value="1">


ラジオボタンの作成
------------------

.. php:method:: radio(string $fieldName, array $options, array $attributes)

radio ボタン入力を作成します。

**属性**

* ``value`` - このラジオボタンがチェックされたときの値を示します。
* ``label`` - ウィジェットのラベルを表示するかどうかを示すブール値。
* ``hiddenField`` - radio() の結果に値 '' の hidden 入力を含めるかどうかを示すブール値。
  これは、非連続的なラジオセットを作成する場合に便利です。
* ``disabled`` - すべてのラジオボタンを無効にするには ``true`` または ``disabled`` に設定します。
* ``empty`` - 最初のオプションとして値 '' の入力を作成するには ``true`` に設定します。
  ``true`` のとき、radio ラベルは空になります。
  このオプションを文字列に設定すると、ラベル値を制御できます。

一般に ``$options`` は単純な キー => 値 のペアです。
ただし、カスタム属性をラジオボタンに配置する必要がある場合は、拡張形式を使用することができます。 ::

    echo $this->Form->radio(
        'favorite_color',
        [
            ['value' => 'r', 'text' => 'Red', 'style' => 'color:red;'],
            ['value' => 'u', 'text' => 'Blue', 'style' => 'color:blue;'],
            ['value' => 'g', 'text' => 'Green', 'style' => 'color:green;'],
        ]
    );

    // 出力結果
    <input type="hidden" name="favorite_color" value="">
    <label for="favorite-color-r">
        <input type="radio" name="favorite_color" value="r" style="color:red;" id="favorite-color-r">
        Red
    </label>
    <label for="favorite-color-u">
        <input type="radio" name="favorite_color" value="u" style="color:blue;" id="favorite-color-u">
        Blue
    </label>
    <label for="favorite-color-g">
        <input type="radio" name="favorite_color" value="g" style="color:green;" id="favorite-color-g">
        Green
    </label>

選択ピッカーの作成
------------------

.. php:method:: select(string $fieldName, array $options, array $attributes)

デフォルトで選択されているように ``$attributes['value']`` で指定されたオプションを指定して、
``$options`` の項目で設定された select 要素を作成します。
``$attributes`` 変数の 'empty' キーを ``true`` (デフォルト値は ``false``) に設定して、
空の値を持つ空白のオプションをドロップダウンリストの先頭に追加します。 ::

    $options = ['M' => 'Male', 'F' => 'Female'];
    echo $this->Form->select('gender', $options, ['empty' => true]);

出力結果:

.. code-block:: html

    <select name="gender">
    <option value=""></option>
    <option value="M">Male</option>
    <option value="F">Female</option>
    </select>

``select`` コントロールタイプでは、 ``'escape'`` という特別な ``$option`` 属性が使用でき、
ブール値を受け取り、HTML エンティティに select オプションの内容をエンコードするかどうかを決定します。
デフォルトは ``true`` です。 ::

    $options = ['M' => 'Male', 'F' => 'Female'];
    echo $this->Form->select('gender', $options, ['escape' => false]);

* ``$attributes['options']`` このキーでは、select コントロールまたは
  radio グループのオプションを手動で指定できます。
  'type' に 'radio' が指定されていない限り、FormHelper はターゲット出力が
  select コントロールであると仮定します。 ::

    echo $this->Form->select('field', [1,2,3,4,5]);

  出力結果:

  .. code-block:: html

    <select name="field">
        <option value="0">1</option>
        <option value="1">2</option>
        <option value="2">3</option>
        <option value="3">4</option>
        <option value="4">5</option>
    </select>

  オプションはキーと値のペアとしても提供できます。 ::

    echo $this->Form->select('field', [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2',
        'Value 3' => 'Label 3'
    ]);

  出力結果:

  .. code-block:: html

    <select name="field">
        <option value="Value 1">Label 1</option>
        <option value="Value 2">Label 2</option>
        <option value="Value 3">Label 3</option>
    </select>

  optgroup 付きで select を生成したい場合は、データを階層形式で渡すだけです。
  これは複数のチェックボックスとラジオボタンでも機能しますが、optgroup の代わりに
  fieldset 要素で囲みます。 ::

    $options = [
       'Group 1' => [
          'Value 1' => 'Label 1',
          'Value 2' => 'Label 2'
       ],
       'Group 2' => [
          'Value 3' => 'Label 3'
       ]
    ];
    echo $this->Form->select('field', $options);

  出力結果:

  .. code-block:: html

    <select name="field">
        <optgroup label="Group 1">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
        </optgroup>
        <optgroup label="Group 2">
            <option value="Value 3">Label 3</option>
        </optgroup>
    </select>

option タグ内で属性を生成するには::

    $options = [
        [ 'text' => 'Description 1', 'value' => 'value 1', 'attr_name' => 'attr_value 1' ],
        [ 'text' => 'Description 2', 'value' => 'value 2', 'attr_name' => 'attr_value 2' ],
        [ 'text' => 'Description 3', 'value' => 'value 3', 'other_attr_name' => 'other_attr_value' ],
    ];
    echo $this->Form->select('field', $options);

出力結果:

.. code-block:: html

    <select name="field">
        <option value="value 1" attr_name="attr_value 1">Description 1</option>
        <option value="value 2" attr_name="attr_value 2">Description 2</option>
        <option value="value 3" other_attr_name="other_attr_value">Description 3</option>
    </select>

* ``$attributes['multiple']`` select を出力するコントロールに対して
  'multiple' が ``true`` に設定されている場合、select は複数の選択を許可します。 ::

    echo $this->Form->select('field', $options, ['multiple' => true]);

  または、関連するチェックボックスのリストを出力するために 'multiple' を 'checkbox' に設定します。 ::

    $options = [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2'
    ];
    echo $this->Form->select('field', $options, [
        'multiple' => 'checkbox'
    ]);

  出力結果:

  .. code-block:: html

      <input name="field" value="" type="hidden">
      <div class="checkbox">
        <label for="field-1">
         <input name="field[]" value="Value 1" id="field-1" type="checkbox">
         Label 1
         </label>
      </div>
      <div class="checkbox">
         <label for="field-2">
         <input name="field[]" value="Value 2" id="field-2" type="checkbox">
         Label 2
         </label>
      </div>

* ``$attributes['disabled']`` チェックボックスを作成するときは、このオプションを設定して、
  すべてまたは一部のチェックボックスを無効にすることができます。
  すべてのチェックボックスを無効にするには disabled を ``true`` にします。 ::

    $options = [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2'
    ];
    echo $this->Form->select('field', $options, [
        'multiple' => 'checkbox',
        'disabled' => ['Value 1']
    ]);

  出力結果:

  .. code-block:: html

       <input name="field" value="" type="hidden">
       <div class="checkbox">
          <label for="field-1">
          <input name="field[]" disabled="disabled" value="Value 1" type="checkbox">
          Label 1
          </label>
       </div>
       <div class="checkbox">
          <label for="field-2">
          <input name="field[]" value="Value 2" id="field-2" type="checkbox">
          Label 2
          </label>
       </div>

ファイル入力の作成
------------------

.. php:method:: file(string $fieldName, array $options)

フォームにファイルアップロードのための項目を追加するためには、まずフォームの enctype を
"multipart/form-data" にする必要がありますので、create 関数で次のようにしています。 ::

    echo $this->Form->create($document, ['enctype' => 'multipart/form-data']);
    // または
    echo $this->Form->create($document, ['type' => 'file']);

次にフォームビューファイルに以下のいずれかを追加します。 ::

    echo $this->Form->control('submittedfile', [
        'type' => 'file'
    ]);

    // または
    echo $this->Form->file('submittedfile');

HTML 自体の制限により、'file' タイプの入力フィールドにデフォルト値を設定することはできません。
フォームを表示するたびに、内部の値は空に設定されます。

フォームの送信に際して file フィールドは、フォームを受信しようとしているスクリプトに対して拡張された
data 配列を提供します。

CakePHP が Windows サーバ上にインストールされている場合、上記の例について、
送信されるデータ配列内の値は次のように構成されます。
Unix 環境では 'tmp\_name' が異なったパスになります。 ::

    $this->request->data['submittedfile'] = [
        'name' => 'conference_schedule.pdf',
        'type' => 'application/pdf',
        'tmp_name' => 'C:/WINDOWS/TEMP/php1EE.tmp',
        'error' => 0, // Windows の場合、文字列になります。
        'size' => 41737,
    ];

この配列は PHP 自身によって生成されます。PHP が file フィールドを通してデータを
どう処理しているのかについては、 `PHP マニュアルのファイルアップロードのセクションをご覧ください
<https://secure.php.net/features.file-upload>`_ 。

.. note::

    ``$this->Form->file()`` を使う場合、 ``$this->Form->create()`` の中の
    type オプションを 'file' に設定することで、フォームのエンコーディングのタイプを設定できます。

日時入力の作成
--------------

.. php:method:: dateTime($fieldName, $options = [])

日付と時刻の select コントロールのセットを生成します。
このメソッドには、いくつかのオプションがあります。

* ``monthNames`` ``false`` の場合は、テキストの代わりに2桁の数字が使用されます。
  配列の場合は、指定された配列が使用されます。
* ``minYear`` 年の select フィールドで使用される最小の年
* ``maxYear`` 年の select フィールドで使用される最大の年
* ``interval`` 分を選択する間隔。
  デフォルトは 1 です。
* ``empty`` - ``true`` の場合、空の select オプションが表示されます。
  文字列の場合、その文字列は空の要素として表示されます。
* ``round`` - いずれかの方向に丸めたい場合は ``up`` または ``down`` に設定します。
  デフォルトは null です。
* ``default`` コントロールで使用されるデフォルト値。
  フィールド名と一致する ``$this->request->getData()`` の値は、この値を上書きします。
  デフォルトが指定されていない場合、 ``time()`` が使用されます。
* ``timeFormat`` 使用する時刻の形式、12 または 24 のいずれか。
* ``second`` 秒を有効にするために ``true`` に設定します。

コントロールの順序、およびコントロール間の要素/内容を制御するには、 ``dateWidget``
テンプレートを上書きします。デフォルトで ``dateWidget`` テンプレートは::

    {{year}}{{month}}{{day}}{{hour}}{{minute}}{{second}}{{meridian}}

特定の select ボックスにカスタムクラス/属性を含む datetime コントロールを作成するには、
各コンポーネントのオプションを使用できます。 ::

    echo $this->Form->datetime('released', [
        'year' => [
            'class' => 'year-classname',
        ],
        'month' => [
            'class' => 'month-class',
            'data-type' => 'month',
        ],
    ]);

これは、次の2つの select を作成します。

.. code-block:: html

    <select name="released[year]" class="year-class">
        <option value="" selected="selected"></option>
        <option value="00">0</option>
        <option value="01">1</option>
        <!-- .. 以下省略 .. -->
    </select>
    <select name="released[month]" class="month-class" data-type="month">
        <option value="" selected="selected"></option>
        <option value="01">January</option>
        <!-- .. 以下省略 .. -->
    </select>

時間入力の作成
--------------

.. php:method:: time($fieldName, $options = [])

``hour`` と ``minute`` に対してそれぞれ 24 時間と 60 分の 2 つの select 要素を作成します。
さらに、HTML 属性は、特定の ``type`` ごとに $options で指定することができます。
``$options['empty']`` が ``false`` の場合、select は空のオプションを含みません。

* ``empty`` - ``true`` の場合、空の select オプションが表示されます。
  文字列の場合、その文字列は空の要素として表示されます。
* ``default`` | ``value`` コントロールで使用されるデフォルト値。
  フィールド名と一致する ``$this->request->getData()`` の値は、この値を上書きします。
  デフォルトが指定されていない場合、 ``time()`` が使用されます。
* ``timeFormat`` 使用する時刻の形式、12 または 24 のいずれか。
  デフォルトは 24 です。
* ``second`` 秒を有効にするために ``true`` に設定します。
* ``interval`` 分を選択する間隔。
  デフォルトは 1 です。

たとえば、15 分単位で選択できる時間範囲を作成し、各 select ボックスにクラスを適用するには、
次のようにします。 ::

    echo $this->Form->time('released', [
        'interval' => 15,
        'hour' => [
            'class' => 'foo-class',
        ],
        'minute' => [
            'class' => 'bar-class',
        ],
    ]);

これは、次の2つの select を作成します。

.. code-block:: html

    <select name="released[hour]" class="foo-class">
        <option value="" selected="selected"></option>
        <option value="00">0</option>
        <option value="01">1</option>
        <!-- .. 中略 .. -->
        <option value="22">22</option>
        <option value="23">23</option>
    </select>
    <select name="released[minute]" class="bar-class">
        <option value="" selected="selected"></option>
        <option value="00">00</option>
        <option value="15">15</option>
        <option value="30">30</option>
        <option value="45">45</option>
    </select>

年入力の作成
------------

.. php:method:: year(string $fieldName, array $options = [])

``minYear`` から ``maxYear`` までを列挙する select 要素を作成します。
さらに、HTML 属性は、$options で指定することができます。
``$options ['empty']`` が ``false`` の場合、select は空のオプションを含みません。

* ``empty`` - ``true`` の場合、空の select オプションが表示されます。
  文字列の場合、その文字列は空の要素として表示されます。
* ``orderYear`` - セレクトオプションの年の値の順序。
  利用可能な値は 'asc' と 'desc'。デフォルトは 'desc' です。
* ``value`` コントロールの選択された値。
* ``maxYear`` select 要素で表示する最大の年。
* ``minYear`` select 要素に表示する最小の年。

たとえば、2000 年から今年までの年を作成するには、次のようにします。 ::

    echo $this->Form->year('purchased', [
        'minYear' => 2000,
        'maxYear' => date('Y')
    ]);

2009 年だった場合は、次のようになるでしょう。

.. code-block:: html

    <select name="purchased[year]">
    <option value=""></option>
    <option value="2009">2009</option>
    <option value="2008">2008</option>
    <option value="2007">2007</option>
    <option value="2006">2006</option>
    <option value="2005">2005</option>
    <option value="2004">2004</option>
    <option value="2003">2003</option>
    <option value="2002">2002</option>
    <option value="2001">2001</option>
    <option value="2000">2000</option>
    </select>

月入力の作成
------------

.. php:method:: month(string $fieldName, array $attributes)

月の名前を列挙した select 要素を作成します。 ::

    echo $this->Form->month('mob');

出力結果:

.. code-block:: html

    <select name="mob[month]">
    <option value=""></option>
    <option value="01">January</option>
    <option value="02">February</option>
    <option value="03">March</option>
    <option value="04">April</option>
    <option value="05">May</option>
    <option value="06">June</option>
    <option value="07">July</option>
    <option value="08">August</option>
    <option value="09">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
    </select>

'monthNames' 属性に独自の月の名前を配列で設定することもできます。
また ``false`` を指定すると、月が数字で表示されます。
(注：デフォルトの月は、CakePHP の :doc:`/core-libraries/internationalization-and-localization`
機能でローカライズすることができます。) ::

    echo $this->Form->month('mob', ['monthNames' => false]);

日入力の作成
------------

.. php:method:: day(string $fieldName, array $attributes)

（数字の）日を列挙する select 要素を作成します。

あなたの選択した指示テキストで空のオプションを作成するには（たとえば、
最初のオプションは 'Day'）、次のようにテキストを最終パラメータとして指定できます。 ::

    echo $this->Form->day('created');

出力結果:

.. code-block:: html

    <select name="created[day]">
    <option value=""></option>
    <option value="01">1</option>
    <option value="02">2</option>
    <option value="03">3</option>
    ...
    <option value="31">31</option>
    </select>

時間入力の作成
--------------

.. php:method:: hour(string $fieldName, array $attributes)

時を列挙した select 要素を作成します。
format オプションを使用して、12 時間または 24 時間のピッカーを作成することができます。 ::

    echo $this->Form->hour('created', [
        'format' => 12
    ]);
    echo $this->Form->hour('created', [
        'format' => 24
    ]);

分入力の作成
------------

.. php:method:: minute(string $fieldName, array $attributes)

分を列挙した select 要素を作成します。
``interval`` オプションを使用して特定の値のみを含む select を作成することができます。
たとえば、10 分ずつ増やしたい場合は、次のようにします。 ::

    echo $this->Form->minute('created', [
        'interval' => 10
    ]);

午前と午後入力の作成
--------------------

.. php:method:: meridian(string $fieldName, array $attributes)

'am' と 'pm' を列挙した select 要素を生成します。

ラベルの作成
============

.. php:method:: label(string $fieldName, string $text, array $options)

label 要素を作成します。
``$fieldName`` は DOM id を生成するために使われます。
``$text`` が未定義の場合、 ``$fieldName`` はラベルのテキストを変えるために使われます。 ::

    echo $this->Form->label('User.name');
    echo $this->Form->label('User.name', 'Your username');

出力結果:

.. code-block:: html

    <label for="user-name">Name</label>
    <label for="user-name">Your username</label>

``$options`` は、HTML 属性の配列か、クラス名として使用される文字列のいずれかです。 ::

    echo $this->Form->label('User.name', null, ['id' => 'user-label']);
    echo $this->Form->label('User.name', 'Your username', 'highlight');

出力結果:

.. code-block:: html

    <label for="user-name" id="user-label">Name</label>
    <label for="user-name" class="highlight">Your username</label>

エラーの表示と確認
==================

.. php:method:: error(string $fieldName, mixed $text, array $options)

検証エラーが発生した場合に、指定されたフィールドに対して
$text で指定された検証エラーメッセージを表示します。

オプション:

- 'escape' エラーの内容を HTML エスケープするかどうかを指定するブール値。

.. TODO:: Add examples.

.. php:method:: isFieldError(string $fieldName)

指定された $fieldName に有効な検証エラーがある場合は ``true`` を返します。 ::

    if ($this->Form->isFieldError('gender')) {
        echo $this->Form->error('gender');
    }

.. note::

    :php:meth:`~Cake\\View\\Helper\\FormHelper::control()` を使用している場合、
    デフォルトでエラーは描画されます。

ボタンと submit 要素の作成
==========================

.. php:method:: submit(string $caption, array $options)

テキストとして ``$caption`` を使って submit 入力を作成します。
提供された ``$caption`` が画像への URL である場合、画像の送信ボタンが生成されます。
以下の場合::

    echo $this->Form->submit();

出力結果:

.. code-block:: html

    <div class="submit"><input value="Submit" type="submit"></div>

キャプションテキストの代わりにキャプションパラメータとして画像への相対 URL または
絶対 URL を渡すことができます。 ::

    echo $this->Form->submit('ok.png');

出力結果:

.. code-block:: html

    <div class="submit"><input type="image" src="/img/ok.png"></div>

submit 入力は、基本的なテキストやイメージが必要な場合に便利です。
より複雑なボタンの内容が必要な場合は、 ``button()`` を使用してください。

ボタン要素の作成
----------------

.. php:method:: button(string $title, array $options = [])

指定されたタイトルとデフォルトの "button" タイプの HTML ボタンを作成します。
``$options['type']`` を設定すると、次の3つの button タイプのどれかが出力されます。

#. submit: ``$this->Form->submit`` メソッド と同じです（デフォルト）。
#. reset: フォームのリセットボタンを作成します。
#. button: 標準の押しボタンを作成します。

::

    echo $this->Form->button('ボタン');
    echo $this->Form->button('別のボタン', ['type' => 'button']);
    echo $this->Form->button('フォームのリセット', ['type' => 'reset']);
    echo $this->Form->button('フォームの送信', ['type' => 'submit']);

出力結果:

.. code-block:: html

    <button type="submit">ボタン</button>
    <button type="button">別のボタン</button>
    <button type="reset">フォームのリセット</button>
    <button type="submit">フォームの送信</button>

``button`` コントロールタイプは ``escape`` オプションをサポートしています。
これはブール値を受け付け、デフォルトは ``false`` です。
これは、ボタンの ``$title`` を HTML エンコードするかどうかを決定します。 ::

    // エスケープされた HTML を描画します。
    echo $this->Form->button('<em>Submit Form</em>', [
        'type' => 'submit',
        'escape' => true
    ]);

フォームを閉じる
================

.. php:method:: end($secureAttributes = [])

``end()`` は、フォームを閉じて完成します。
多くの場合、 ``end()`` は終了タグだけを出力しますが、 ``end()`` を使うと、
FormHelper が :php:class:`Cake\\Controller\\Component\\SecurityComponent` に必要な
hidden フォーム要素を挿入できるようになります。

.. code-block:: php

    <?= $this->Form->create(); ?>

    <!-- フォーム要素はここにあります -->

    <?= $this->Form->end(); ?>

``$secureAttributes`` パラメータは、アプリケーションが ``SecurityComponent``
を使っているときに生成される hidden 入力に、追加の HTML 属性を渡すことを可能にします。
生成された hidden 入力に追加の属性を追加する必要がある場合は、
``$secureAttributes`` 引数を使用できます。 ::

    echo $this->Form->end(['data-type' => 'hidden']);

出力結果:

.. code-block:: html

    <div style="display:none;">
        <input type="hidden" name="_Token[fields]" data-type="hidden"
            value="2981c38990f3f6ba935e6561dc77277966fabd6d%3AAddresses.id">
        <input type="hidden" name="_Token[unlocked]" data-type="hidden"
            value="address%7Cfirst_name">
    </div>

.. note::

    アプリケーションで :php:class:`Cake\\Controller\\Component\\SecurityComponent`
    を使用している場合は、必ずフォームを ``end()`` で終わらせてください。

単独のボタンと POST リンクの作成
================================

.. php:method:: postButton(string $title, mixed $url, array $options = [])

    POST で送信する ``<form>`` と ``<button>`` タグを作ります。

    このメソッドは ``<form>`` 要素を作成します。
    なので、開かれたフォームの中でこのメソッドを使用しないでください。
    代わりに :php:meth:`Cake\\View\\Helper\\FormHelper::submit()` または
    :php:meth:`Cake\\View\\Helper\\FormHelper::button()` を使用して、
    開かれたフォームの中でボタンを作成してください。

.. php:method:: postLink(string $title, mixed $url = null, array $options = [])

    HTML リンクを作成しますが、POST メソッドを使用して URL にアクセスします。
    ブラウザで有効にするには JavaScript が必要です。

    このメソッドは ``<form>`` 要素を作成します。
    このメソッドを既存のフォームの中で使いたい場合は、 ``block`` オプションを使用して、
    新しいフォームがメインフォームの外部でレンダリング可能な
    :ref:`ビューブロック <view-blocks>` に設定されるようにする必要があります。

    あなたが探しているものがフォームを送信するボタンであれば、代わりに
    :php:meth:`Cake\\View\\Helper\\FormHelper::button()` または
    :php:meth:`Cake\\View\\Helper\\FormHelper::submit()` を使用してください。

    .. note::
        開いているフォームの中に postLink を入れないように注意してください。
        代わりに、 ``block`` オプションを使ってフォームを
	:ref:`view-blocks` にバッファリングしてください。


FormHelper で使用するテンプレートのカスタマイズ
===============================================

CakePHP の多くのヘルパーと同じように、FormHelper は、
作成する HTML をフォーマットするための文字列テンプレートを使用しています。
既定のテンプレートは、合理的な既定値のセットを意図していますが、
アプリケーションに合わせてテンプレートをカスタマイズする必要があるかもしれません。

ヘルパーが読み込まれたときにテンプレートを変更するには、コントローラにヘルパーを含めるときに
``templates`` オプションを設定することができます。 ::

    // View クラスの中で
    $this->loadHelper('Form', [
        'templates' => 'app_form',
    ]);

これは、 **config/app_form.php** の中のタグを読み込みます。
このファイルには、名前で索引付けされたテンプレートの配列が含まれている必要があります。 ::

    // config/app_form.php の中で
    return [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];

定義したテンプレートは、ヘルパーに含まれるデフォルトのテンプレートを置き換えます。
置き換えられていないテンプレートは引き続きデフォルト値を使用します。
``setTemplates()`` メソッドを使って実行時にテンプレートを変更することもできます。 ::

    $myTemplates = [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];
    $this->Form->setTemplates($myTemplates);
    // 3.4 より前
    $this->Form->templates($myTemplates);

.. warning::

    パーセント記号 (``%``) を含むテンプレート文字列には特別な注意が必要です。
    この文字の先頭に ``%%`` のようにもう一つパーセンテージを付ける必要があります。
    なぜなら、内部的なテンプレートは ``sprintf()`` で使用されるためにコンパイルされているからです。
    例: '<div style="width:{{size}}%%">{{content}}</div>'

テンプレート一覧
----------------

デフォルトのテンプレートのリスト、それらのデフォルトのフォーマット、そして期待される変数は
`FormHelper API ドキュメント
<https://api.cakephp.org/3.2/class-Cake.View.Helper.FormHelper.html#%24_defaultConfig>`_
で見つけることができます。

これらのテンプレートに加えて、 ``control()`` メソッドはコントロールコンテナごとに異なるテンプレートを
使用しようとします。たとえば、datetime コントロールを作成する場合、 ``datetimeContainer``
が存在する場合にはそれが使用されます。
そのコンテナがない場合、 ``inputContainer`` テンプレートが使用されます。
例えば::

    // 独自の HTML で囲まれた radio を追加
    $this->Form->templates([
        'radioContainer' => '<div class="form-radio">{{content}}</div>'
    ]);

    // 独自の div で囲まれた radio セットを作成
    echo $this->Form->radio('User.email_notifications', ['y', 'n']);

コンテナの制御と同様に、 ``control()`` メソッドはフォームグループごとに異なるテンプレートを
使用しようとします。フォームグループは、ラベルとコントロールの組み合わせです。
例えば、radio 入力を作成する時、 ``radioFormGroup`` が存在する場合、それが使用されます。
そのテンプレートが存在しない場合、デフォルトでは、ラベル＆入力の各セットは、
``formGroup`` テンプレートを使用して描画されます。
例えば::

    // 独自の radio フォームグループを追加
    $this->Form->setTemplates([
        'radioFormGroup' => '<div class="radio">{{label}}{{input}}</div>'
    ]);

テンプレートに追加のテンプレート変数を追加
------------------------------------------

独自のテンプレートにテンプレートプレースホルダを追加し、
コントロールを生成するときにプレースホルダを設定することができます。 ::

    // help プレースホルダ付きでテンプレートを追加
    $this->Form->setTemplates([
        'inputContainer' => '<div class="input {{type}}{{required}}">
            {{content}} <span class="help">{{help}}</span></div>'
    ]);

    // help 変数を設定し入力を生成
    echo $this->Form->control('password', [
        'templateVars' => ['help' => '少なくとも 8 文字の長さ。']
    ]);

.. versionadded:: 3.1
    templateVars オプションは 3.1.0 で追加されました。

チェックボックスとラジオのラベル外への移動
------------------------------------------

デフォルトでは、CakePHP はラベル要素内のチェックボックスとラジオボタンをネストします。
これにより、人気の CSS フレームワークとの統合に役立ちます。
ラベルの外に checkbox/radio 入力を配置する必要がある場合は、
テンプレートを変更することで行うことができます。 ::

    $this->Form->setTemplates([
        'nestingLabel' => '{{input}}<label{{attrs}}>{{text}}</label>',
        'formGroup' => '{{input}}{{label}}',
    ]);

これにより、ラジオボタンとチェックボックスがラベルの外側に描画されます。

フォーム全体の生成
==================

.. php:method:: controls(array $fields = [], $options = [])

fieldset で囲まれた指定された一連のコントロールセットを生成します。
生成されたフィールドを含めることで指定できます。 ::

    echo $this->Form->controls([
        'name',
        'email'
    ]);

オプションを使用して legend のテキストをカスタマイズすることができます。 ::

    echo $this->Form->controls($fields, ['legend' => 'Update news post']);

``$fields`` パラメータで追加のオプションを定義することによって、
生成されたコントロールをカスタマイズすることができます。 ::

    echo $this->Form->controls([
        'name' => ['label' => 'カスタムラベル']
    ]);

``fields`` をカスタマイズする場合、生成された legend/fieldset を制御するために
``$options`` パラメータを使用することができます。

- ``fieldset`` filedset を無効にするために ``false`` を設定してください。
  HTML 属性として適用するパラメータの配列を fieldset タグに渡すこともできます。
  空の配列を渡すと、fieldset は属性なしで表示されます。
- ``legend`` 生成されたコントロールセットの legend を無効にするために ``false`` を設定してください。
  または、legend のテキストをカスタマイズするための文字列を指定します。

例えば::

    echo $this->Form->allControls(
        [
            'name' => ['label' => 'カスタムラベル']
        ],
        null,
        ['legend' => 'Update your post']
    );
    // 3.4.0 より前の場合:
    echo $this->Form->allInputs(
        [
            'name' => ['label' => 'カスタムラベル']
        ],
        null,
        ['legend' => 'Update your post']
    );

fieldset を無効にすると、legend は出力されません。

.. php:method:: allControls(array $fields, $options = [])

このメソッドは ``controls()`` と密接に関係していますが、
``$fields`` 引数は現在のトップレベルエンティティの *全ての* フィールドにデフォルト設定されています。
生成されたコントロールから特定のフィールドを除外するには、fields パラメータで ``false`` を設定します。 ::

    echo $this->Form->allControls(['password' => false]);
    // 3.4.0 より前の場合:
    echo $this->Form->allInputs(['password' => false]);

.. _associated-form-inputs:

関連データの入力を作成
======================

関連するデータのフォームを作成するのは簡単で、エンティティのデータ内のパスに密接に関連しています。
次のテーブルリレーションを仮定します。

* Authors HasOne Profiles
* Authors HasMany Articles
* Articles HasMany Comments
* Articles BelongsTo Authors
* Articles BelongsToMany Tags

アソシエーション付きで読み込まれた記事を編集していた場合、次のコントロールを作成できます。 ::

    $this->Form->create($article);

    // Article 入力
    echo $this->Form->control('title');

    // Author 入力 (belongsTo)
    echo $this->Form->control('author.id');
    echo $this->Form->control('author.first_name');
    echo $this->Form->control('author.last_name');

    // Author の profile (belongsTo + hasOne)
    echo $this->Form->control('author.profile.id');
    echo $this->Form->control('author.profile.username');

    // Tags 入力 (belongsToMany)
    echo $this->Form->control('tags.0.id');
    echo $this->Form->control('tags.0.name');
    echo $this->Form->control('tags.1.id');
    echo $this->Form->control('tags.1.name');

    // belongsToMany の複数選択要素
    echo $this->Form->control('tags._ids', [
        'type' => 'select',
        'multiple' => true,
        'options' => $tagList,
    ]);

    // 結合テーブルの入力 (articles_tags)
    echo $this->Form->control('tags.0._joinData.starred');
    echo $this->Form->control('tags.1._joinData.starred');

    // Comments 入力 (hasMany)
    echo $this->Form->control('comments.0.id');
    echo $this->Form->control('comments.0.comment');
    echo $this->Form->control('comments.1.id');
    echo $this->Form->control('comments.1.comment');

上記のコントロールは、コントローラ内の次のコードを使用して完成したエンティティグラフに
マーシャリングすることができます。 ::

    $article = $this->Articles->patchEntity($article, $this->request->getData(), [
        'associated' => [
            'Authors',
            'Authors.Profiles',
            'Tags',
            'Comments'
        ]
    ]);

独自ウィジェットの追加
======================

CakePHP を使うと、アプリケーションに独自のコントロールウィジェットを簡単に追加でき、
他のコントロールタイプと同様に使用することができます。
すべてのコアコントロールタイプはウィジェットとして実装されています。
つまり、独自の実装でコアウィジェットを上書きすることができます。

Widget クラスの構築
-------------------

Widget クラスは、とても単純で必須のインターフェースを持っています。
これらは :php:class:`Cake\\View\\Widget\\WidgetInterface` を実装しなければなりません。
このインターフェースを実装するには、 ``render(array $data)`` メソッドと
``secureFields(array $data)`` メソッドが必要です。
``render()`` メソッドは、ウィジェットを構築するためのデータ配列を受け取り、
ウィジェットの HTML 文字列を返すことが期待されています。
``secureFields()`` メソッドは、同様にデータ配列を受け取り、
このウィジェットで保護するフィールドのリストを含む配列を返すことが期待されています。
CakePHP がウィジェットを構築している場合、最初の引数として ``Cake\View\StringTemplate``
インスタンスを取得し、その後にあなたが定義した依存関係が続くことが期待できます。
autocomplete ウィジェットを作成したい場合、以下を実行できます。 ::

    namespace App\View\Widget;

    use Cake\View\Form\ContextInterface;
    use Cake\View\Widget\WidgetInterface;

    class AutocompleteWidget implements WidgetInterface
    {

        protected $_templates;

        public function __construct($templates)
        {
            $this->_templates = $templates;
        }

        public function render(array $data, ContextInterface $context)
        {
            $data += [
                'name' => '',
            ];
            return $this->_templates->format('autocomplete', [
                'name' => $data['name'],
                'attrs' => $this->_templates->formatAttributes($data, ['name'])
            ]);
        }

        public function secureFields(array $data)
        {
            return [$data['name']];
        }
    }

明らかに、これは非常に簡単な例ですが、独自ウィジェットの構築方法を示しています。

ウィジェットの使用
------------------

FormHelper を読み込むときや、
``addWidget()`` メソッドを使って独自のウィジェットを読み込むことができます。
FormHelper を読み込むとき、ウィジェットは設定として定義されます。 ::

    // View クラスの中で
    $this->loadHelper('Form', [
        'widgets' => [
            'autocomplete' => ['Autocomplete']
        ]
    ]);

あなたのウィジェットが他のウィジェットを必要とする場合は、それらの依存関係を宣言することによって
FormHelper に取り込ませることができます。 ::

    $this->loadHelper('Form', [
        'widgets' => [
            'autocomplete' => [
                'App\View\Widget\AutocompleteWidget',
                'text',
                'label'
            ]
        ]
    ]);

上記の例では、autocomplete ウィジェットは ``text`` と ``label`` ウィジェットに依存します。
ウィジェットがビューにアクセスする必要がある場合は、 ``_view`` 'ウィジェット' を使用してください。
autocomplete ウィジェットが作成されると、 ``text`` と ``label``
の名前に関連するウィジェットオブジェクトが渡されます。
``addWidget()`` メソッドを使ってウィジェットを追加すると、次のようになります。 ::

    // classname の使用。
    $this->Form->addWidget(
        'autocomplete',
        ['Autocomplete', 'text', 'label']
    );

    // インスタンスの使用 - 依存関係を解決する必要があります。
    $autocomplete = new AutocompleteWidget(
        $this->Form->getTemplater(),
        $this->Form->widgetRegistry()->get('text'),
        $this->Form->widgetRegistry()->get('label'),
    );
    $this->Form->addWidget('autocomplete', $autocomplete);

追加/置換されると、ウィジェットはコントロールの 'type' として使用できます。 ::

    echo $this->Form->control('search', ['type' => 'autocomplete']);

これは、 ``control()`` とまったく同じように label と囲い込む div を持つ独自ウィジェットを作成します。
あるいは、マジックメソッドを使用してコントロールウィジェットだけを作成することもできます。 ::

    echo $this->Form->autocomplete('search', $options);

SecurityComponent との連携
==========================

:php:meth:`Cake\\Controller\\Component\\SecurityComponent` には、
フォームをより安全で安全にするためのいくつかの機能があります。
コントローラに ``SecurityComponent`` を含めるだけで、フォームの改ざん防止機能が自動的に有効になります。

SecurityComponent を利用する際は、前述のようにフォームを閉じる際は、
必ず :php:meth:`~Cake\\View\\Helper\\FormHelper::end()` を使う必要があります。
これにより特別な ``_Token`` 入力が生成されます。

.. php:method:: unlockField($name)

    ``SecurityComponent`` によるフィールドのハッシュ化が行われないようにフィールドのロックを
    解除します。またこれにより、そのフィールドを JavaScript で操作できるようになります。
    ``$name`` には入力のためのエンティティのプロパティ名を指定します。 ::

        $this->Form->unlockField('id');

.. php:method:: secure(array $fields = [])

    フォームで使用されるフィールドを元にしたセキュリティハッシュを持つ hidden フィールドを生成します。


.. meta::
    :title lang=ja: FormHelper
    :description lang=ja: FormHelper は、フォームの作成を迅速に行い、検証、再配置、レイアウトを効率化します。
    :keywords lang=ja: form helper,cakephp form,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security

