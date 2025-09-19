# データの検証

[データを保存する](../orm/saving-data) 前におそらくそのデータが正しく
矛盾がないことを保証したいはずです。
CakePHP ではデータの検証には二つの段階があります:

1.  リクエストデータがエンティティーにコンバートされる前、
    データ型や書式まわりのバリデーションルールが適用されます。
2.  データが保存される前、ドメインまたはアプリケーションルールが適用されます。
    これらのルールはアプリケーションのデータの一貫性の保証に役立ちます。

## エンティティー構築前のデータ検証

データからエンティティーを構築する時、データの検証 (バリデーション) ができます。
データのバリデーションではデータの型、形状およびサイズなどを確認することができます。
既定ではリクエストデータがエンティティーに変換される前に検証が行われます。
もしも何らかのバリデーションルールが通らなかった場合、
返されたエンティティーはエラーを含んだ状態になります。
エラーのあるフィールドは返されたエンティティーには含まれません。 :

``` php
$article = $articles->newEntity($this->request->getData());
if ($article->getErrors()) {
    // エンティティー検証失敗。
}
```

バリデーションが有効になっている状態でエンティティーを構築すると、次のことが起こります:

1.  バリデータオブジェクトが作成されます。
2.  `table` および `default` バリデーションプロバイダーが追加されます。
3.  命名に沿ったバリデーションメソッドが呼び出されます。たとえば `validationDefault` 。
4.  `Model.buildValidator` イベントが発動します。
5.  リクエストデータが検証されます。
6.  リクエストデータがそのカラム型に対応する型に変換されます。
7.  エラーがエンティティーにセットされます。
8.  正しいデータはエンティティーに設定されますが、
    検証を通らなかったフィールドは除外されます。

もしもリクエストデータを変換する時にバリデーションを無効にしたければ、
`validate` オプションに偽を指定してください。 :

``` php
$article = $articles->newEntity(
    $this->request->getData(),
    ['validate' => false]
);
```

`patchEntity()` メソッドについても同じことが言えます。 :

``` php
$article = $articles->patchEntity($article, $newData, [
    'validate' => false
]);
```

## 既定のバリデーションセットの作成

バリデーションルールは規約ではテーブルクラス中で定義されます。
何のデータが検証されるかとあわせてどこで保存されるかも定義します。

テーブル中で既定のバリデーションオブジェクトを作るには、
`validationDefault()` 関数を作成します。 :

``` php
use Cake\ORM\Table;
use Cake\Validation\Validator;

class ArticlesTable extends Table
{
    public function validationDefault(Validator $validator)
    {
        $validator
            ->requirePresence('title', 'create')
            ->notEmptyString('title');

        $validator
            ->allowEmptyString('link')
            ->add('link', 'valid-url', ['rule' => 'url']);

        ...

        return $validator;
    }
}
```

有効なバリデーションメソッドやルールは `Validator` クラスによって提供され
[Creating Validators](../core-libraries/validation#creating-validators) の節に記載されています。

> [!NOTE]
> バリデーションオブジェクトは主にユーザー入力の検証用に意図されています。
> たとえば、フォームやその他の投稿されたリクエストデータです。

## 異なるバリデーションセットの使用

バリデーションを無効にすることに加えて
適用させたいバリデーションルールを選ぶこともできます。 :

``` php
$article = $articles->newEntity(
    $this->request->getData(),
    ['validate' => 'update']
);
```

上記は必要なルールを構築するために、そのテーブルインスタンスの `validationUpdate()`
メソッドを呼び出します。既定では `validationDefault()` メソッドが使用されます。
記事テーブル用のバリデータの一例はこのようになります。 :

``` php
class ArticlesTable extends Table
{
    public function validationUpdate($validator)
    {
        $validator
            ->notEmptyString('title', __('タイトルを設定してください'))
            ->notEmptyString('body', __('本文は必須です'));

        return $validator;
    }
}
```

必要に応じていくつものバリデーションセットを設けることができます。
バリデーションルールセットの構築についてのより多くの情報は [バリデーション](../core-libraries/validation) を参照してください。

### アソシエーションに異なるバリデーションセットを使用

バリデーションセットはアソシエーションごとに定義することもできます。
`newEntity()` または `patchEntity()` メソッドを使用する時、
変換されるアソシエーション各々に追加のオプションを渡すことができます。 :

``` php
$data = [
     'title' => '私の肩書き',
     'body' => 'テキスト',
     'user_id' => 1,
     'user' => [
         'username' => 'マーク'
     ],
     'comments' => [
         ['body' => '一番目のコメント'],
         ['body' => '二番目のコメント'],
     ]
 ];

 $article = $articles->patchEntity($article, $data, [
     'validate' => 'update',
     'associated' => [
         'Users' => ['validate' => 'signup'],
         'Comments' => ['validate' => 'custom']
     ]
 ]);
```

## バリデータの組み合わせ

バリデータオブジェクトはこのように構築されるので、
その構築過程を複数の手順に分割することは簡単です。 :

``` php
// UsersTable.php

public function validationDefault(Validator $validator)
{
    $validator->notEmptyString('username');
    $validator->notEmptyString('password');
    $validator->add('email', 'valid-email', ['rule' => 'email']);
    ...

    return $validator;
}

public function validationHardened(Validator $validator): Validator
{
    $validator = $this->validationDefault($validator);

    $validator->add('password', 'length', ['rule' => ['lengthBetween', 8, 100]]);

    return $validator;
}
```

上の手順では、 `hardened` バリデーションセットを使う時には
`default` セット中で定義されているバリデーションルールも含むことになります。

## バリデーションプロバイダー

バリデーションルールは既知のあらゆるプロバイダーで定義されている関数を使うことができます。
既定では CakePHP はいくつかのプロバイダーを設定します:

1.  `table` プロバイダーではテーブルクラスまたはそのビヘイビアーのメソッドが有効です。
2.  コアの `Cake\Validation\Validation` クラスが
    `default` プロバイダーとしてセットアップされます。

バリデーションルールを作る時に、そのルールのプロバイダー名を指定できます。
たとえば、もしあなたのテーブルが `isValidRole` メソッドを持っているとすれば
それをバリデーションルールとして使うことができます。 :

``` php
use Cake\ORM\Table;
use Cake\Validation\Validator;

class UsersTable extends Table
{
    public function validationDefault(Validator $validator): Validator
    {
        $validator
            ->add('role', 'validRole', [
                'rule' => 'isValidRole',
                'message' => __('有効な権限を指定する必要があります'),
                'provider' => 'table',
            ]);

        return $validator;
    }

    public function isValidRole($value, array $context): bool
    {
        return in_array($value, ['admin', 'editor', 'author'], true);
    }

}
```

バリデーションルールにはクロージャも使うことができます。 :

``` php
$validator->add('name', 'myRule', [
    'rule' => function ($value, array $context) {
        if ($value > 1) {
            return true;
        }

        return '適切な値ではありません。';
    }
]);
```

バリデーションメソッドは通らない時にエラーメッセージを返すことができます。
これは渡された値に動的に基づくエラーメッセージを作るための簡単な方法です。

## テーブルからのバリデータ取得

テーブルクラスにバリデーションセットを作成した後は、
名前を指定して結果のオブジェクトを取得できるようになります。 :

``` php
$defaultValidator = $usersTable->getValidator('default');

$hardenedValidator = $usersTable->getValidator('hardened');
```

## 既定のバリデータクラス

上述の通り、既定ではバリデーションメソッドは
`Cake\Validation\Validator` のインスタンスを受け取ります。
そうではなくて、カスタムバリデータのインスタンスが毎回ほしいのであれば、
テーブルの `$_validatorClass` プロパティーを使うことができます。 :

``` php
// あなたのテーブルクラスの中で
public function initialize(array $config)
{
    $this->_validatorClass = '\FullyNamespaced\Custom\Validator';
}
```

## アプリケーションルールの適用

[リクエストデータがエンティティーに変換される](#validating-request-data) 時、
基本的なデータ検証が行われますが、多くのアプリケーションは
基本的な検証が完了した後にのみ適用されるもっと複雑な検証も設けています。

バリデーションはデータの形式や構文が正しいことを保証する一方、 ルールは
あなたのアプリケーションやネットワークの既存の状態に対してデータを比較することに
焦点を当てます。

この種のルールはしばしば「ドメインルール」や「アプリケーションルール」と言われます。
CakePHP は、エンティティーが保存される前に適用される「ルールチェッカー」を通して
これを行います。いくつかのドメインルールの例は次のようになります:

- メールアドレスの一意性の保証。
- ステータス遷移や業務フローの手順 (たとえば、請求書のステータス更新)。
- 論理削除されたアイテムの更新の抑制。
- 使用量／料金の上限の強制。

ドメインルールは `save()` および `delete()` メソッドを呼ぶとチェックされます。

### ルールチェッカーの作成

ルールチェッカークラスは一般にテーブルクラスの `buildRules()`
メソッドで定義されます。ビヘイビアーや他のイベントの受け手は
与えられたテーブルクラスのルールチェッカーを受け取るために `Model.buildRules`
イベントを使うことができます。 :

``` php
use Cake\ORM\RulesChecker;

// テーブルクラスの中で
public function buildRules(RulesChecker $rules)
{
    // 作成および更新操作に提供されるルールを追加
    $rules->add(function ($entity, $options) {
        // 失敗／成功を示す真偽値を返す
    }, 'ruleName');

    // 作成のルールを追加
    $rules->addCreate(function ($entity, $options) {
        // 失敗／成功を示す真偽値を返す
    }, 'ruleName');

    // 更新のルールを追加
    $rules->addUpdate(function ($entity, $options) {
        // 失敗／成功を示す真偽値を返す
    }, 'ruleName');

    // 削除のルールを追加
    $rules->addDelete(function ($entity, $options) {
        // 失敗／成功を示す真偽値を返す
    }, 'ruleName');

    return $rules;
}
```

ルールの関数はチェックされるエンティティーとオプションの配列を期待します。
オプションの配列は `errorField` 、 `message` 、そして `repository` を含みます。
`repository` オプションはルールが追加されるテーブルクラスを含みます。
ルールはあらゆる `callable` を受け取るので、インスタンス関数を使うこともできます。 :

``` php
$rules->addCreate([$this, 'uniqueEmail'], 'uniqueEmail');
```

または呼び出し可能なクラスも使えます。 :

``` php
$rules->addCreate(new IsUnique(['email']), 'uniqueEmail');
```

ルールを追加する時、任意でルールが適用されるフィールドやエラーメッセージ
を定義することができます。 :

``` php
$rules->add([$this, 'isValidState'], 'validState', [
    'errorField' => 'status',
    'message' => 'この請求書はそのステータスに遷移できません。'
]);
```

エンティティーの `getErrors()` メソッドを呼ぶとエラーを確認できます。 :

``` php
$entity->getErrors(); // ドメインルールのエラーメッセージを含んでいます
```

### 一意フィールドルールの作成

一意ルールは極めて一般的なので、CakePHP は一意フィールドの組み合わせを定義できる
単純なルールクラスを内包しています。 :

``` php
use Cake\ORM\Rule\IsUnique;

// 一つのフィールド
$rules->add($rules->isUnique(['email']));

// フィールドのリスト
$rules->add($rules->isUnique(
    ['username', 'account_id'],
    'この username と account_id の組み合わせはすでに使用されています。'
));
```

外部キーフィールドのルールを設定する時には、
ルールでは列挙したフィールドのみが使われるのを覚えておくことが重要です。
これは `$user->account->id` を変更しても上記のルールは発動しないことを意味します。

### 外部キールール

制約を強制するためにデータベースエラーに頼ることもできますが、
ルールのコードはより良いユーザーエクスペリエンスを提供するのに役立ちます。
このために CakePHP は `ExistsIn` ルールクラスを内包しています。 :

``` php
// 一つのフィールド
$rules->add($rules->existsIn('article_id', 'Articles'));

// 複数キー。複合主キーに役立ちます。
$rules->add($rules->existsIn(['site_id', 'article_id'], 'Articles'));
```

存在をチェックするための関連テーブルのフィールドは主キーの一部でなければなりません。

複合外部キーの null が可能な部分が null の時、 `existsIn` が通るように強制することができます。 :

``` php
// 例: NodesTable の複合主キーは (parent_id, site_id) です。
// Node は、親 Node を参照しますが、必須ではありません。参照しない場合、parent_id が null になります。
// たとえ null が可能なフィールド (parent_id のような) が null であっても、このルールが通ることを許可します。
$rules->add($rules->existsIn(
    ['parent_id', 'site_id'], // Schema: parent_id NULL, site_id NOT NULL
    'ParentNodes',
    ['allowNullableNulls' => true]
));

// それに加えて Node は、常に Site を参照してください。
$rules->add($rules->existsIn(['site_id'], 'Sites'));
```

大部分の SQL データベースでは、複数カラムの `UNIQUE` インデックスは、
`NULL` は、それ自身と等しくないため、複数の null 値が存在することを許可します。
複数の null 値を許可することは、CakePHP のデフォルトの振る舞いですが、
`allowMultipleNulls` を使用することでユニークチェックに null 値を含むことができます。 :

``` php
// null 値は `parent_id` と `site_id` の中に１つだけで存在できます。
$rules->add($rules->existsIn(
    ['parent_id', 'site_id'],
    'ParentNodes',
    ['allowMultipleNulls' => false]
));
```

### アソシエーションカウントルール

プロパティーやアソシエーションが正しい件数かどうかの検証が必要な場合、
`validCount()` ルールが利用できます。 :

``` php
// ArticlesTable.php ファイルの中で
// 記事にタグは５つ以内。
$rules->add($rules->validCount('tags', 5, '<=', 'タグは 5 つまで持てます'));
```

ルールに基づく件数を定義する際、第３引数は、比較演算子を定義します。
比較には `==`, `>=`, `<=`, `>`, `<`, そして `!=` が使えます。
プロパティーの件数が範囲内であることを保証するために、２つのルールを使用してください。 :

``` php
// ArticlesTable.php ファイルの中で
// タグは３つ以上、５つ以内
$rules->add($rules->validCount('tags', 3, '>=', 'タグは 3 つ以上必要です'));
$rules->add($rules->validCount('tags', 5, '<=', 'タグは 5 つ以下です'));
```

もしプロパティーが数えられない場合や存在しない場合、 `validCount` は `false`
を返すことに注意してください。 :

``` php
// もし tags が null の場合、保存操作は失敗します。
$rules->add($rules->validCount('tags', 0, '<=', 'タグを持つことはできません'));
```

### アソシエーションリンクの制約ルール

`LinkConstraint` はデータベースがサポートしないSQL制約をエミュレートしたり、
制約が失敗したときにユーザーフレンドリーなエラーメッセージを提供したい場合に使用できます。
このルールを使用すると、アソシエーションが関連レコードを持っているかどうかを確認できます。　:

``` php
// 更新時に各コメントが記事にリンクされていることを確認してください。
$rules->addUpdate($rules->isLinkedTo(
    'Articles',
    'article',
    '記事が必要です。'
));

// 削除時に記事にリンクされたコメントがないことを確認してください。
$rules->addDelete($rules->isNotLinkedTo(
    'Comments',
    'comments',
    '削除する前にコメントがない状態にしてください。'
));
```

### エンティティーメソッドをルールとして使用

ドメインルールとしてエンティティーのメソッドを使いたいかもしれません。 :

``` php
$rules->add(function ($entity, $options) {
    return $entity->isOkLooking();
}, 'ruleName');
```

### 条件付きルールの使用

エンティティーデータに基づいて条件付きでルールを適用することができます。 :

``` php
$rules->add(function ($entity, $options) use($rules) {
    if ($entity->role == 'admin') {
        $rule = $rules->existsIn('user_id', 'Admins');

        return $rule($entity, $options);
    }
    if ($entity->role == 'user') {
        $rule = $rules->existsIn('user_id', 'Users');

        return $rule($entity, $options);
    }

    return false;
}, 'userExists');
```

### 条件付き/動的なエラーメッセージ

ルールは、 [カスタムコールバック](#creating-a-rules-checker) または
[ルールオブジェクト](#creating-custom-rule-objects) であり、
パスするかどうかを示すブーリアン型を返すか、検証がパスしなかったことを意味する文字列を返すことができ、
返された文字列はエラーメッセージとして使用されます。

`message` オプションで定義された既存のエラーメッセージは、
ルールから返されたエラーメッセージによって上書きされます。 :

``` php
$rules->add(
    function ($entity, $options) {
        if (!$entity->length) {
            return false;
        }

        if ($entity->length < 10) {
            return '値が 10 より小さい場合のエラーメッセージ';
        }

        if ($entity->length > 20) {
            return '値が 20 より大きい場合のエラーメッセージ';
        }

        return true;
    },
    'ruleName',
    [
        'errorField' => 'length',
        'message' => '`false` が返された時に使われる一般的なエラーメッセージ'
    ]
 );
```

> [!NOTE]
> 返されたメッセージを実際に使用するためには、 `errorField` オプションも
> *指定しなければならない* ことに注意してください。そうしなければ、ルールは単にパスしないだけで、
> エンティティーにエラーメッセージが設定されません。

### 再利用可能なカスタムルールの作成

カスタムドメインルールを再利用したい事もあるでしょう。それには、
独自の呼び出し可能なルールを作成することによって行います。 :

``` php
use App\ORM\Rule\IsUniqueWithNulls;
// ...
public function buildRules(RulesChecker $rules)
{
    $rules->add(new IsUniqueWithNulls(['parent_id', 'instance_id', 'name']), 'uniqueNamePerParent', [
        'errorField' => 'name',
        'message' => 'Name must be unique per parent.'
    ]);

    return $rules;
}
```

そのようなルールを作成する方法の例として、コアのルールを確認してください。

### カスタムルールオブジェクト作成

もしもアプリケーションがよく再利用されるルールを持っているのであれば、
再利用可能なクラスにそうしたルールをまとめると役に立ちます。 :

``` php
// src/Model/Rule/CustomRule.php の中で
namespace App\Model\Rule;

use Cake\Datasource\EntityInterface;

class CustomRule
{
    public function __invoke(EntityInterface $entity, array $options)
    {
        // 何かする
        return false;
    }
}

// カスタムルールの追加
use App\Model\Rule\CustomRule;

$rules->add(new CustomRule(/* ... */), 'ruleName');
```

カスタムルールクラスを作ることでコードを *重複がない状態*
(訳注：DRY = Don't Repeat Yourself の訳)
に保つことができ、またドメインルールを簡単にテストできるようになります。

### ルールの無効化

エンティティーを保存する時、必要であればルールを無効にできます。 :

``` php
$articles->save($article, ['checkRules' => false]);
```

## バリデーション対アプリケーションルール

CakePHP の ORM は検証に二層のアプローチを使う点がユニークです。

一層目はバリデーションです。バリデーションルールは、ステートレスな方法の操作を意図しています。
それらは、形状、データ型、データの書式が正しいことを保証するために最もよく作用します。

二層目は、アプリケーションルールです。アプリケーションルールは、あなたのエンティティーの
ステートフルなプロパティーのチェックに最もよく作用します。例えば、バリデーションルールは、
メールアドレスが有効なことを保証することができますが、アプリケーションルールは、
メールアドレスがユニークであることを保証できます。

すでに見てきた通りに、一層目は `newEntity()` か `patchEntity()` を呼ぶ時に
`Validator` オブジェクトを通して行われます。 :

``` php
$validatedEntity = $articlesTable->newEntity(
    $unsafeData,
    ['validate' => 'customName']
);
$validatedEntity = $articlesTable->patchEntity(
    $entity,
    $unsafeData,
    ['validate' => 'customName']
);
```

上記の例では、 `validationCustomName()` メソッドを使って定義される
「カスタム」バリデータを使用します。 :

``` php
public function validationCustomName($validator)
{
    $validator->add(/* ... */);

    return $validator;
}
```

バリデーションは文字列や配列を渡されることを想定しています。
それらがリクエストから得られるものですので:

``` php
// src/Model/Table/UsersTable.php の中で
public function validatePasswords($validator)
{
    $validator->add('confirm_password', 'no-misspelling', [
        'rule' => ['compareWith', 'password'],
        'message' => 'パスワードが一致しません',
    ]);

    ...
    return $validator;
}
```

バリデーションはエンティティーのプロパティーを直接設定した時には起動 **しません** 。 :

``` php
$userEntity->email = 'not an email!!';
$usersTable->save($userEntity);
```

上記の例では、バリデーションは `newEntity()` と `patchEntity()`
メソッドのためにのみ起動されるので、エンティティーは保存されてしまうことになります。
検証の第二層がこの状況に対処します。

アプリケーションルールは上で説明したように
`save()` か `delete()` が呼ばれるといつでもチェックされます。 :

``` php
// src/Model/Table/UsersTable.php の中で
public function buildRules(RulesChecker $rules)
{
    $rules->add($rules->isUnique(['email']));

    return $rules;
}

// アプリケーションのコード中のどこかで
$userEntity->email = 'a@duplicated.email';
$usersTable->save($userEntity); // 偽を返します
```

バリデーションは直接のユーザー入力を意図しており、アプリケーションルールは
アプリケーション中で生成されたデータの変更に特化しています。 :

``` php
// src/Model/Table/OrdersTable.php の中で
public function buildRules(RulesChecker $rules)
{
    $check = function($order) {
        if ($order->shipping_mode !== 'free') {
            return true;
        }

        return $order->price >= 100;
    };
    $rules->add($check, [
        'errorField' => 'shipping_mode',
        'message' => '100ドル以下の注文を送料無料にはできません！'
    ]);

    return $rules;
}

// アプリケーションのコード中のどこかで
$order->price = 50;
$order->shipping_mode = 'free';
$ordersTable->save($order); // 偽を返します
```

### バリデーションをアプリケーションルールとして使用

ある状況ではユーザーあるいはアプリケーションによって生成されたデータの
両方に対して同じ検証の処理を走らせたいかもしれません。
これは、エンティティーのプロパティーを直接設定するような
CLI スクリプトを走らせる時に起こり得るでしょう。 :

``` php
// src/Model/Table/UsersTable.php の中で
public function validationDefault(Validator $validator)
{
    $validator->add('email', 'valid_email', [
        'rule' => 'email',
        'message' => '無効なメールアドレスです'
    ]);

    // ...

    return $validator;
}

public function buildRules(RulesChecker $rules): RulesChecker
{
    // アプリケーションルールの追加
    $rules->add(function($entity) {
        $data = $entity->extract($this->getSchema()->columns(), true);
        if (!$entity->isNew() && !empty($data)) {
            $data += $entity->extract((array)$this->getPrimaryKey());
        }
        $validator = $this->getValidator('default');
        $errors = $validator->validate($data, $entity->isNew());
        $entity->setErrors($errors);

        return empty($errors);
    });

    // ...

    return $rules;
}
```

保存が実行されると、追加された新しいアプリケーションのおかげで失敗します。 :

``` php
$userEntity->email = 'not an email!!!';
$usersTable->save($userEntity);
$userEntity->getError('email'); // 無効なメールアドレスです
```

同じ結果が `newEntity()` や `patchEntity()` を使う時にも期待できます。 :

``` php
$userEntity = $usersTable->newEntity(['email' => 'not an email!!']);
$userEntity->getError('email'); // 無効なメールアドレスです
```
