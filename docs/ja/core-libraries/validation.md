# バリデーション

CakePHP のバリデーションは、任意の配列データに対するバリデーションを簡単に行うための
バリデーター構築のパッケージを提供します。 [API 中の利用可能なバリデーションルールの一覧](https://api.cakephp.org/4.x/class-Cake.Validation.Validation.html)
をご覧ください。

## バリデーターを作成する

`class` Cake\\Validation\\**Validator**

バリデーターオブジェクトは１セットのフィールドに適用されるルールを定義します。
バリデーターオブジェクトはフィールドとバリデーションセットとの間のマッピングを含みます。
その引き換えに、バリデーションセットは、関係するフィールドに適用されるルールの集合体を
提供します。バリデーターを作成するのは簡単です。 :

``` php
use Cake\Validation\Validator;

$validator = new Validator();
```

一度作成した後、バリデーションを適用したいフィールドに対して、実際にルールを設定していきます。 :

``` php
$validator
    ->requirePresence('title')
    ->notEmptyString('title', 'このフィールドに入力してください')
    ->add('title', [
        'length' => [
            'rule' => ['minLength', 10],
            'message' => 'タイトルは 10 文字以上必要です',
        ]
    ])
    ->allowEmptyDateTime('published')
    ->add('published', 'boolean', [
        'rule' => 'boolean'
    ])
    ->requirePresence('body')
    ->add('body', 'length', [
        'rule' => ['minLength', 50],
        'message' => '記事は中身のある本文を持っていなければなりません。',
    ]);
```

上記例に見られるように、バリデーションは、実際にバリデーションを実行したいフィールドに対して
ルールを適用するような形で、流暢なインターフェイスとともに構築されて行きます。

上記例には、いくつかのメソッドが呼ばれていたので、様々な特徴について見て行きましょう。
`add()` メソッドを用いることにより、バリデーターに対して新しいルールを加えることができます。
上記のように個別にルールを加えることもできますし、グループ単位でルールを加えることもできます。

### フィールドが実在することを求める

`requirePresence()` メソッドは、バリデーションの対象となる配列について、
フィールドが実在することを求めます。もし、フィールドが存在していなければ、
バリデーションは失敗します。 `requirePresence()` には4つのモードがあります:

- `true` この場合、フィールドが存在することが常に求められます。
- `false` この場合、フィールドが存在することは必要なくなります。
- `create` **create** 実行時にバリデーションを行う場合、このフィールドが存在することが求められます。
- `update` **update** 実行時にバリデーションを行う場合、このフィールドが存在することが求められます。

デフォルトでは、 `true` が用いられます。キーの存在は、 `array_key_exists()`
を用いることによりチェックされるため、 null 値は、「存在する」としてカウントされます。
モードについては、２番目のパラメーターを用いることにより設定できます。 :

``` php
$validator->requirePresence('author_id', 'create');
```

もし要求するフィールドが複数ある場合、それらをリストとして定義することができます。 :

``` php
// create として複数フィールドを定義
$validator->requirePresence(['author_id', 'title'], 'create');

// 混在したモードで複数フィールドを定義
$validator->requirePresence([
    'author_id' => [
        'mode' => 'create',
        'message' => '著者は必須です。',
    ],
    'published' => [
        'mode' => 'update',
        'message' => '公開された状態が必要です。',
    ]
]);
```

### 空のフィールドを認める

バリデーターは、フィールドが空の値を許容するかどうかを制御するためのいくつかのメソッドを提供します。
そして、許容された空の値は他の名前付きフィールドのバリデーションルールには転送されません。
CakePHPは6つの異なる形状のデータに対して空の値のサポートを提供します。

1.  `allowEmptyString()` 空文字列を許容する場合にのみ使用します
2.  `allowEmptyArray()` 配列を許容する場合に使用します
3.  `allowEmptyDate()` 空文字列か、日付フィールドに取り込まれる配列を許容する場合に使用します
4.  `allowEmptyTime()` 空文字列か、時刻フィールドに取り込まれる配列を許容する場合に使用します
5.  `allowEmptyDateTime()` 空文字列か、日付時刻フィールドまたはタイムスタンプフィールドに取り込まれる配列を許容する場合に使用します
6.  `allowEmptyFile()` 空ファイルのアップロードが含まれた配列を許容する場合に使用します

`notEmpty()` を使用して空のフィールドを無効にすることもできますが、
推奨されるのは `notEmpty()` は使用せず、より具体的なバリデーターである
`notEmptyString()`, `notEmptyArray()`, `notEmptyFile()`, `notEmptyDate()`, `notEmptyTime()`, `notEmptyDateTime()`
を使用することです。

`allowEmpty*` メソッドは、空のフィールドを許容するかを制御する `when` パラメーターをサポートします。

- `false` フィールドは空にできません
- `create` **create** 操作のバリデーション時にフィールドを空にできます
- `update` **update** 操作のバリデーション時にフィールドを空にできます
- フィールドが空にできるかどうかを示す `true` または `false` を返すコールバック。このパラメーターの使用方法の例については、：ref：\`conditional-validation\` セクションを参照してください。

これらのメソッドの使用例は次のとおりです。:

``` php
$validator->allowEmptyDateTime('published')
    ->allowEmptyString('title', 'タイトルは空にできません', false)
    ->allowEmptyString('body', '本文は空にできません', 'update')
    ->allowEmptyFile('header_image', 'update');
    ->allowEmptyDateTime('posted', 'update');
```

### バリデーションルールの追加

`Validator` クラスはバリデーターの構築をシンプルかつ表現力豊かにするメソッドを提供します。
例えば、バリデーションルールを username フィールドに追加するには以下のようになります。 :

``` php
$validator = new Validator();
$validator
    ->email('username')
    ->ascii('username')
    ->lengthBetween('username', [4, 8]);
```

バリデータメソッドの完全なセットについては、 [Validator API ドキュメント](https://api.cakephp.org/4.x/class-Cake.Validation.Validator.html)
をご覧ください。

### カスタムバリデーションルールの使用

`Validator` やプロバイダーから与えられるメソッドを使うことに加え、
匿名関数を含むコールバック関数も、バリデーションルールとして用いることができます。 :

``` php
// グローバル関数を利用する
$validator->add('title', 'custom', [
    'rule' => 'validate_title',
    'message' => 'タイトルが正しくありません'
]);

// プロバイダーではないコールバック関数を利用する
$validator->add('title', 'custom', [
    'rule' => [$this, 'method'],
    'message' => 'タイトルが正しくありません'
]);

// クロージャーを利用する
$extra = 'クロージャー内に必要な追加値';
$validator->add('title', 'custom', [
    'rule' => function ($value, $context) use ($extra) {
        // true/falseを返すカスタムロジックを記入
    },
    'message' => 'タイトルが正しくありません'
]);

// カスタムプロバイダーからのルールを利用する
$validator->add('title', 'custom', [
    'rule' => 'customRule',
    'provider' => 'custom',
    'message' => 'タイトルが十分にユニークではありません'
]);
```

クロージャーやコールバックメソッドは、呼び出された際に2つの設定を受けることとなります。
最初は、バリデーションが行われるフィールド値であり、２番目はバリデーションプロセスに関連する
データを含む配列です。

- **data**: バリデーションメソッドに与えられた元々のデータのことです。
  値を比較するようなルールを作る場合には、利用価値が高いといえます。
- **providers**: プロバイダーオブジェクトについての完成されたリストのことです。
  複数のプロバイダーを呼び出すことにより複雑なルールを作りたいときに、利用価値が高いといえます。
- **newRecord**:　バリデーションコールが新しいレコードのためのものか、
  すでにあるレコードのためのものかを示します。

既存ユーザーの ID のようにあなたのバリデーションメソッドに追加のデータを渡す必要がある場合、
あなたのコントローラーからカスタム動的プロバイダー利用できます。 :

``` php
$this->Examples->validator('default')->provider('passed', [
    'count' => $countFromController,
    'userid' => $this->Auth->user('id')
]);
```

そのとき、あなたのバリデーションメソッドが、第２コンテキストパラメーターを持つことを保証します。 :

``` php
public function customValidationMethod($check, array $context)
{
    $userid = $context['providers']['passed']['userid'];
}
```

もし、バリデーションに合格した場合、クロージャーはブーリアン型の true を返さなければなりません。
もし、失敗した場合、ブーリアン型の false またはカスタムエラーメッセージとして文字列を返してください。
詳しくは [条件付き/動的なエラーメッセージ](#dynamic_validation_error_messages)
をご覧ください。

### 条件付き/動的なエラーメッセージ

バリデーションルールのメソッドは、 [カスタムコールバック](#custom-validation-rules)
または [プロバイダーによって提供されるメソッド](#adding-validation-providers) であり、
検証が成功したかどうかを示すブーリアン型を返すか、検証が失敗したことを意味する文字列を返すことができ、
返された文字列はエラーメッセージとして使用されます。

`message` オプションで定義された既存のエラーメッセージは、
バリデーションルールメソッドから返されたエラーメッセージによって上書きされます。 :

``` php
$validator->add('length', 'custom', [
    'rule' => function ($value, $context) {
        if (!$value) {
            return false;
        }

        if ($value < 10) {
            return '値が 10 より小さい場合のエラーメッセージ';
        }

        if ($value > 20) {
            return '値が 20 より大きい場合のエラーメッセージ';
        }

        return true;
    },
    'message' => '`false` が返されたときに使われる一般的なエラーメッセージ'
]);
```

### 条件付バリデーション

バリデーションルールを定義する際、 `on` キーを用いることで、バリデーションルールが
適用されるべきか否かを定義することができます。未定義のままにすると、ルールは常に適用されます。
他に有効な値は、 `create` 及び `update` です。これらの値を利用することにより、
`create` や `update` 実行時にのみ、ルールが適用されることとなります。

加えて、特定なルールが適用されるべきか決めるためのコールバック関数を活用することもできます。 :

``` php
$validator->add('picture', 'file', [
    'rule' => ['mimeType', ['image/jpeg', 'image/png']],
    'on' => function ($context) {
        return !empty($context['data']['show_profile_picture']);
    }
]);
```

`$context['data']` 配列を用いることで、他の送信されたフィールドにアクセスすることが
できます。上記例では、 `show_profile_picture` の値が空かどうかで 'picture'
のルールを任意なものとします。また、 `uploadedFile` を用いることで、
任意のファイルアップロードに関する入力を設定することができます。 :

``` php
$validator->add('picture', 'file', [
    'rule' => ['uploadedFile', ['optional' => true]],
]);
```

`allowEmpty*`, `notEmpty()` 及び `requirePresence()` メソッドは、
最後に引数としてコールバック関数を受け付けることができます。もしこれがあれば、
ルールが適用されるべきか否かをコールバック関数が決めます。例えば、以下のように、
フィールド値が空のままでも許容される時もあります。 :

``` php
$validator->allowEmptyString('tax', function ($context) {
    return !$context['data']['is_taxable'];
});
```

一方で、以下のように、一定の条件が満たされた場合にのみ、フィールド値が求められる
（空欄が許容されない）場合もあります。 :

``` php
$validator->notEmpty('email_frequency', 'このフィールドは必須です', function ($context) {
    return !empty($context['data']['wants_newsletter']);
});
```

上記の例は、ユーザーがニュースレターを受領したい場合には、 `email_frequency`
フィールドが空欄のまま残されてはいけない、という例です。

さらに、一定の条件の下でのみフィールドが存在することを求めることも可能です。 :

``` php
$validator->requirePresence('full_name', function ($context) {
    if (isset($context['data']['action'])) {
        return $context['data']['action'] === 'subscribe';
    }

    return false;
});
$validator->requirePresence('email');
```

これは、申し込みを作成したいユーザーの場合のみ `full_name` フィールドの存在を求め、
`email` フィールドは常に要求されます。申し込みをキャンセルした時にも必要とされます。

条件付きのカスタムコールバックに渡される `$context` パラメータには、以下のキーが含まれます。

- `data` バリデートされるデータ
- `newRecord` 新規または既存のレコードが存在しているかどうかを示すブール値
- `field` バリデートされるフィールド
- `providers` バリデーターに付与されるバリデーションプロバイダー

### 最後に適用されるルールとして設定する

フィールドに複数のルールが存在する場合は、前回のバリデーションが上手く機能しなかった場合でも、
個々のバリデーションルールは適用されます。このことにより、一回のパスにより、好きなだけ
バリデーションエラーを設定することが可能となります。ただし、あるルールが上手くいかなかった後に
その後のバリデーションを適用したくない場合は、 `last` オプションを `true`
に設定することができます。 :

``` php
$validator = new Validator();
$validator
    ->add('body', [
        'minLength' => [
            'rule' => ['minLength', 10],
            'last' => true,
            'message' => 'コメントには中身のある本文が必要です。',
        ],
        'maxLength' => [
            'rule' => ['maxLength', 250],
            'message' => 'コメントが長すぎることはできません。'
        ]
    ]);
```

上記例にて、minLength ルール適用によりエラーとなった場合は、maxLength ルールは適用されません。

### バリデーションプロバイダーを加える

`Validator`, `ValidationSet`, `ValidationRule` の各クラスは、
自らのバリデーションメソッドを提供するわけではありません。バリデーションルールは
'プロバイダー' からもたらされるのです。バリデーターオブジェクトに対しては、
いくつでもプロバイダーを設定することができます。バリデーターインスタンスには、
自動的にデフォルトのプロバイダー設定が付随しています。デフォルトのプロバイダーは、
`Cake\Validation\Validation` のクラスにマッピングされております。
このことが、このクラスにおけるメソッドをバリデーションルールとして使用することを容易にします。
バリデーターと ORM をともに用いる場合は、テーブル及びエンティティーのオブジェクトのために
追加のプロバーダーが設定されます。アプリケーションの用途に応じてプロバイダーを追加したい場合は、
`setProvider()` メソッドを用います。 :

``` php
$validator = new Validator();

// オブジェクトインスタンスを使います。
$validator->setProvider('custom', $myObject);

// クラス名を使います。メソッドは静的なものでなければなりません。
$validator->setProvider('custom', 'App\Model\Validation');
```

バリデーションプロバイダーは、オブジェクトか、あるいはクラス名で設定されます。
クラス名が使用されるのであれば、メソッドは静的でなければなりません。
デフォルト以外のプロバイダーを使うには、ルールの中に `provider`
キーを挿入することを忘れないこと。 :

``` php
// テーブルプロバイダーからのルールを使用する
$validator->add('title', 'custom', [
    'rule' => 'customTableMethod',
    'provider' => 'table'
]);
```

今後作成される全ての `Validator` オブジェクトに `provider` を追加したい場合、
以下のように `addDefaultProvider()` メソッドを使用できます。 :

``` php
use Cake\Validation\Validator;

// オブジェクトインスタンスを使います。
Validator::addDefaultProvider('custom', $myObject);

// クラス名を使います。メソッドは静的なものでなければなりません。
Validator::addDefaultProvider('custom', 'App\Model\Validation');
```

> [!NOTE]
> デフォルトプロバイダーは、 `Validator` オブジェクトが作成される前に追加されなければなりません。
> そのため **config/bootstrap.php** がデフォルトプロバイダーの設定に最適な場所です。

国に基いて提供するための [Localized プラグイン](https://github.com/cakephp/localized)
が利用できます。このプラグインで、国に依存するモデルのフィールドをバリデートできます。
例:

``` php
namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class PostsTable extends Table
{
    public function validationDefault(Validator $validator): Validator
    {
        // バリデーターにプロバイダーを追加
        $validator->setProvider('fr', 'Cake\Localized\Validation\FrValidation');
        // フィールドのバリデーションルールの中にプロバイダーを利用
        $validator->add('phoneField', 'myCustomRuleNameForPhone', [
            'rule' => 'phone',
            'provider' => 'fr'
        ]);

        return $validator;
    }
}
```

Localized プラグインは、バリデーションのための国の２文字の ISO コード
(例えば en, fr, de) を使用します。

[ValidationInterface インターフェイス](https://github.com/cakephp/localized/blob/master/src/Validation/ValidationInterface.php)
によって定義されたすべてのクラスに共通する幾つかのメソッドがあります。 :

``` text
電話番号のチェックのための phone()
郵便番号のチェックのための postal()
国が定めた個人 ID のチェックのための personId()
```

### バリデーターをネストする

ネストされたデータで [モデルのないフォーム](../core-libraries/form) をバリデートする場合、
また配列データを含むモデルを使用する場合、保有するネストされたデータをバリデートすることが
必要となります。CakePHP では、簡単に特定の属性に対してバリデーターを加えることが可能となります。
例えば、非リレーショナルデータベースを用いて作業しており、とある記事とそれに対するコメントを
保存したいとします。 :

``` php
$data = [
    'title' => 'Best article',
    'comments' => [
        ['comment' => '']
    ]
];
```

コメントに対してバリデーションをかけたい場合は、ネストされたバリデーターを使用します。 :

``` php
$validator = new Validator();
$validator->add('title', 'not-blank', ['rule' => 'notBlank']);

$commentValidator = new Validator();
$commentValidator->add('comment', 'not-blank', ['rule' => 'notBlank']);

// ネストされたバリデーターをつなげる
$validator->addNestedMany('comments', $commentValidator);

// ネストされたバリデーターからのエラーを含むすべてのエラーを取得する
$validator->validate($data);
```

`addNested()` を用いることで、1:1 の関係を構築することができ、 `addNestedMany()`
を用いることで 1:N の関係を築くことができます。両方のメソッドを用いることにより、
ネストされたバリデーターのエラーは親バリデーターのエラーに貢献し、最終結果に影響を与えます。
他のバリデーター機能と同様に、ネストされたバリデーターは、エラーメッセージと
条件付きアプリケーションをサポートします。 :

``` php
$validator->addNestedMany(
    'comments',
    $commentValidator,
    'Invalid comment',
    'create'
);
```

ネストされたバリデーターのエラーメッセージは、 `_nested` キーにあります。

### 再利用可能なバリデーターを作成する

バリデーターを、使用されている場所で定義するのは、良いサンプルコードにはなりますが、
簡単にメンテナンス可能なアプリケーションには結びつきません。実際には、
再利用可能なバリデーションのロジックを使用する際、
`Validator` サブクラスを使うべきです。 :

``` php
// src/Model/Validation/ContactValidator.php にて
namespace App\Model\Validation;

use Cake\Validation\Validator;

class ContactValidator extends Validator
{
    public function __construct()
    {
        parent::__construct();
        // バリデーションのルールを加える
    }
}
```

## データをバリデートする

バリデーターを作成し、適用したいルールを加えたので、実際にデータを用いてバリデーションを
実施して行きましょう。バリデーターを用いることにより、配列ベースのデータのバリデーションが
可能となります。例えば、 email を作成し、送る前にコンタクト先のバリデーションを行いたい場合は、
以下のようにするとよいでしょう。 :

``` php
use Cake\Validation\Validator;

$validator = new Validator();
$validator
    ->requirePresence('email')
    ->add('email', 'validFormat', [
        'rule' => 'email',
        'message' => 'Eメールは有効でなければなりません。'
    ])
    ->requirePresence('name')
    ->notEmpty('name', '名前が必要です。')
    ->requirePresence('comment')
    ->notEmpty('comment', 'コメントが必要です。');

$errors = $validator->validate($this->request->getData());
if (empty($errors)) {
    // email を送る。
}
```

`errors()` メソッドは、バリデーションエラーがあった場合に、空でない配列を返します。
返されたエラー配列は、以下のような構造となっております。 :

``` php
$errors = [
    'email' => ['Eメールは有効でなければなりません。']
];
```

もし単一のフィールドに複数のエラーがあった場合は、エラーメッセージの配列はフィールドごとに
返されます。デフォルトでは `errors()` メソッドは、 'create' を実行する際のルールが
適用されますが、 'update' を実行する際のルールを適用したい場合は、
以下のことが可能となります。 :

``` php
$errors = $validator->validate($this->request->getData(), false);
if (empty($errors)) {
    // email を送る。
}
```

> [!NOTE]
> もし、エンティティーをバリデーションしたい場合は、エンティティーのバリデーションのために
> 用意された次のようなメソッドを利用するべきです。
> `Cake\ORM\Table::newEntity()`,
> `Cake\ORM\Table::newEntities()`,
> `Cake\ORM\Table::patchEntity()`,
> `Cake\ORM\Table::patchEntities()`
> as they are designed for that.

## エンティティーをバリデーションする

エンティティーは保存される際にバリデーションが実行されますが、保存を試みる前にエンティティーの
バリデーションを行いたいようなケースがあるかもしれません。 `newEntity()`,
`newEntities()`, `patchEntity()` または `patchEntities()` を使った場合、
保存前のエンティティーのバリデーションは自動的に実行されます。 :

``` php
// ArticlesController クラスにおいて
$article = $this->Articles->newEntity($this->request->getData());
if ($article->errors()) {
    // エラーメッセージが表示されるためのコードを書く
}
```

同様に、いくつかのエンティティーに対して同時に事前のバリデーションを実行したい場合は、
`newEntities()` メソッドを用いることができます。 :

``` php
// ArticlesController クラスにおいて
$entities = $this->Articles->newEntities($this->request->getData());
foreach ($entities as $entity) {
    if (!$entity->errors()) {
        $this->Articles->save($entity);
    }
}
```

`newEntity()`, `patchEntity()`, `newEntities()` 及び `patchEntities()`
メソッドを用いることによりどのアソシエーションがバリデーションされたか、
`options` パラメーターを用いることによりどのバリデーションセットを適用させるかを
特定することができます。 :

``` php
$valid = $this->Articles->newEntity($article, [
  'associated' => [
    'Comments' => [
      'associated' => ['User'],
      'validate' => 'special',
    ]
  ]
]);
```

バリデーションは、ユーザーフォームやインターフェイスに主に利用され、その用途はテーブル内の
コラムをバリデーションすることに限られません。しかしながら、データ元がどこであったとしても、
データの統一性を維持することは重要です。この問題を解決するために、CakePHP は
"アプリケーションルール" と呼ばれる２段階目のバリデーションを提供します。
本件については、 [アプリケーションルールの適用](../orm/validation#application-rules)
セクションにて詳述します。

## コアバリデーションルール

CakePHP は `Validation` クラス内にバリデーションメソッドに関する基本的な構文を提供します。
バリデーションクラスには、色々な一般的なバリデーションのシチュエーションに対する、
様々な静的なメソッドが含まれます。

`Validation` クラスにおける [API ドキュメント](https://api.cakephp.org/4.x/class-Cake.Validation.Validation.html) では、
利用可能なバリデーションのルールについてのリスト及び基本的な使い方が案内されております。

いくつかのバリデーションメソッドは、上限下限に関する条件や有効なオプションを設定することができます。
このような上限下限に関する条件や有効なオプションは、以下のように提供可能です。 :

``` php
$validator = new Validator();
$validator
    ->add('title', 'minLength', [
        'rule' => ['minLength', 10]
    ])
    ->add('rating', 'validValue', [
        'rule' => ['range', 1, 5]
    ]);
```

追加のパラメーターが設定できるコアなルールには、 `rule` キーの中に、最初の要素として
ルールそのものを含むような配列が設定されるべきであり、その後のパラメーターには、
残りのパラメーターを含ませるべきです。
