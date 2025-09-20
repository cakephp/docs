# Scaffolding

::: info Deprecated in version 2.5
動的なスキャフォールディングは、 3.0 で削除され置き換えられます。
:::

アプリケーションのスキャフォールディング (*scaffolding*) は開発者がオブジェクトの作成、
取得、更新、削除といった基本的なアプリケーションを定義、作成するためのテクニックです。
CakePHP のスキャフォールディングはオブジェクト同士が互いにどのように関連しているかを定義し、
その接続の作成と削除ができます。

足場 (*scaffold*) を作成するにはモデルとコントローラが必要です。
コントローラに \$scaffold 変数を設定するだけで動作します。

CakePHP のスキャフォールディングはとても素晴らしいです。基本的な CRUD アプリケーションを
数分で作って動かすことができます。あまりに素晴らしいのでプロダクション環境で使いたいと
思うかもしれません。本当に素晴らしいのですが、スキャフォールディングはあくまで単なる
足場にすぎないということを心に留めて置いてください。足場はプロジェクトの初期段階でとにかく
早く動かすために粗いつくりになっています。柔軟性があるというよりも、とにかく動かすための
一時的な方法だと言えるでしょう。もしロジックやビューを自分でカスタマイズしたいと思い始めたら、
コードを書くために足場を使うのをやめるタイミングだと言えます。次の章で説明する CakePHP の
[Bake コンソール](../console-and-shells) は、すばらしい次の一歩で、現在の足場と
同じ結果になるコードを生成します。

スキャフォールディングはウェブアプリケーションの開発初期に必要なコードを得るためのすばらしい方法です。
設計の初期段階におけるデータベーススキーマの変更はよくあることです。しかし、このことは、
ウェブ開発者が実際の使われ方がわからないフォームの作成を嫌がるというマイナス面を生じます。
開発者の負担を軽減させるために CakePHP はスキャフォールディング機能を提供しています。
スキャフォールディングはデータベーステーブルを分析して、追加、削除、編集ボタンがついている標準的な一覧、
編集のための標準的なフォーム、データベースの1レコードを見るための標準的なビューを作成します。

スキャフォールディングを追加するために、コントローラの中で、 `$scaffold` 変数を追加して下さい。 :

``` php
class CategoriesController extends AppController {
    public $scaffold;
}
```

(`app/Model/Category.php` に) 基本的な Category モデルクラスを既に作成していたとすると、
準備は以上となります。
新しい足場を見るために <http://example.com/categories> へアクセスしてみて下さい。

> [!NOTE]
> 足場が作られたコントローラにメソッドを作成した場合、思った通りの結果にならない時があります。
> 例えば、足場が作られたコントローラに `index()` メソッドを作成した場合、
> その index メソッドはスキャフォールディング機能より優先的に描画されてしまいます。

スキャフォールディングはモデル間のつながりについての知識を与えてくれます。
もし Category モデルが User に従属 (`belongsTo`) していた場合、
Category 一覧に関連している User の ID が表示されているでしょう。
スキャフォールディングはモデル間のつながりについて"知って"いますが、
手動でモデルのつながりを示すコードを追加するまでは足場のビューの中には関連したレコードが表示されません。
例えば、もし Group が複数の User を持っていて (`hasMany`) 、 User が Group に
従属 (`belongsTo`) している場合、以下のコードを User と Group モデルに
手動で追加しなければなりません。このコードを追加する前だと、
User 追加フォームに Group のための select ボックスが空のまま表示されます。 :

``` php
// In Group.php
public $hasMany = 'User';
// In User.php
public $belongsTo = 'Group';
```

もし ID 以外の別なもの (例えばユーザの名前など) を表示したい場合、 `$displayField` 変数を
モデルで設定して下さい。それでは、スキャフォールディングの中で ID ではなく名前によってカテゴリに
関連したユーザが示されるように User クラスに `$displayField` を設定してみましょう。 :

``` php
class User extends AppModel {
    public $displayField = 'first_name';
}
```

## Scaffolding を使って単純な管理インターフェイスを作成する

もし `app/Config/core.php` にて管理ルーティングを有効にする場合、
`Configure::write('Routing.prefixes', array('admin'));`
とすることで管理者インターフェイスを生成するためにスキャフォールディングを使えるようになります。

一旦管理ルーティングを有効にしたら、スキャフォールディング変数に admin プレフィクスを設定して下さい。 :

``` php
public $scaffold = 'admin';
```

以上で管理用の足場のアクションにアクセスできるようになります。 :

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

これは単純なバックエンドインターフェイスを素早く作るための簡単な方法です。ただし、
管理用と非管理用の足場のメソッドを同時に使うことはできないことを覚えておいて下さい。
普通のスキャフォールディングでは個別のメソッドを上書きしたり、独自実装に置き換えることができます。 :

``` php
public function admin_view($id = null) {
  // custom code here
}
```

一度足場のアクションを置き換えてしまうとアクションと同じビューファイルを作成する必要が出てきます。

## Scaffold ビューをカスタマイズする

もし足場として作成されたビューにちょっとした違いが見つかるようであれば、テンプレートを作れます。
プロダクション環境でこのテクニックを使うことはあまり勧められませんが、プロトタイプ開発の間であれば
ここで紹介するカスタマイズは役に立つでしょう。

特定のコントローラ (例えば PostsController) のために独自の足場のビューは
次のように置き換えるべきです。 :

    app/View/Posts/scaffold.index.ctp
    app/View/Posts/scaffold.form.ctp
    app/View/Posts/scaffold.view.ctp

すべてのコントローラのために独自の足場のビューは次のように置き換えられるべきです。 :

    app/View/Scaffolds/index.ctp
    app/View/Scaffolds/form.ctp
    app/View/Scaffolds/view.ctp
