# はじめに

このページは、CakePHP 2 のアプリケーションをすでに運用している方と、モダンな PHP の経験があって
CakePHP 2 のアプリケーションを担当することになった開発者に向けた、このドキュメントの入口です。
このフォークで何が違うのか、詳しくはどこを読めばよいのかをまとめています。
CakePHP 2 を初めて使う場合は、[ブログチュートリアル](tutorials-and-examples/blog/blog) で
小さなアプリケーションを順を追って作ることができます。

## このフォークについて {#about-this-fork}

このドキュメントは、CakePHP 2.x のコミュニティによるフォーク [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp)
について説明しています。このフォークは CakePHP 2.10.24 をベースにしており、PHP 8.0 から 8.5 で動作します。
保守を目的としたフォークで、CakePHP 2 を現在の PHP に対応させ、バグとセキュリティの問題を修正します。
機能の追加は目的としておらず、追加するのは CakePHP 5 からのバックポートなど、保守と移行に役立つものに限っています。

CakePHP プロジェクトによる CakePHP 2.x のサポートは
[2021年6月に終了](https://bakery.cakephp.org/2021/10/02/cakephp_2_eol.html)しました。

このクックブックは、フォーク上で動く CakePHP 2 に合わせて、Composer でのインストール、PHP 8、
[pieceofcake2/app](https://pieceofcake2.github.io/app/) で使っているモダンなディレクトリ構成を前提に説明しています。
本家の CakePHP 2.x のドキュメントとの違いは [本家ドキュメントからの変更点](/ja/appendices/changes-from-the-original-book)
にまとめています。フォークのほかのプロジェクトやリソースは
[Piece of Cake 2 のサイト](https://pieceofcake2.github.io/) から参照できます。

## CakePHP 2.10 との違い {#whats-different}

CakePHP 2.10 を知っていれば、その知識のほとんどはそのまま使えます。モデル、コントローラ、ビュー、
コンポーネント、ビヘイビア、ヘルパーはこれまでどおりに動作します。変わったのは次の点です。

- **Composer のみ。** `pieceofcake2/cakephp` を Composer でインストールします。アーカイブ、PEAR、
  `include_path` によるインストールは無くなりました。このパッケージは `cakephp/cakephp` を置き換える
  (replace する) ので、`cakephp/cakephp` 2.x に依存するプラグインもそのままインストールできます。
  フレームワークは `vendor/pieceofcake2/cakephp/src/Cake/` (以前は `lib/Cake/`) にあり、
  クラスは `App::uses()` ではなく Composer のクラスマップで読み込まれます。
  [インストール](installation) と [クラスの読み込み](controllers#autoloading-classes) を参照してください。
- **PHP 8。** PHP 8.0 から 8.5 で動作します。現在の PHP で動作しない API はいくつか削除されました。
  たとえば `String` クラス (`CakeText` を使ってください) や、Xcache と Wincache のキャッシュエンジンです。
  [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) を参照してください。
- **モダンなディレクトリ構成。** アプリケーションは CakePHP 5 と同じ構成 (`bin/cake`、`config/`、`src/`、
  `templates/`、`tests/`、`plugins/`) を使えます。従来の `app/` 構成も引き続き動作します。
  このドキュメントはモダンな構成で説明しています。
  [CakePHP のフォルダ構造](getting-started/cakephp-folder-structure) を参照してください。
- **PHPUnit 9.6。** テストは PHPUnit 3.7 ではなく 9.6 で実行します。[テスト](development/testing) と
  [PHPUnit 9.6 への移行](/ja/appendices/phpunit-9-migration-hints) を参照してください。
- **コーディング規約。** フォークのコードとこのドキュメントのサンプルは、CakePHP 5 の codesniffer の
  ルール (スペース 4 つのインデント、短い配列構文) に従っています。
  [コーディング規約](contributing/cakephp-coding-conventions) を参照してください。
- **静的解析。** [pieceofcake2/phpstan-cakephp2](https://pieceofcake2.github.io/phpstan-cakephp2/)
  拡張を使うと、PHPStan がモデル、コンポーネント、ビヘイビアを理解できるようになります。
  [静的解析](development/static-analysis) を参照してください。
- **セキュリティ修正。** CakePHP 2.10.24 の既知の脆弱性を修正しています。たとえば CSRF トークンは
  HMAC で署名されるようになりました。[脆弱性への対応](/ja/security/fixes) を参照してください。
- **CakePHP 5 からのバックポート。** `IntegrationTestTrait` と `EmailTrait` (CakePHP 2.12.4) を使うと、
  実際のディスパッチャを通してコントローラを CakePHP 5 と同じメソッド名でテストできます。
  [統合テスト](development/integration-testing) を参照してください。アプリケーションスケルトンは
  `.env` ファイルを読み込みます (pieceofcake2/app 2.4.0)。
  [環境変数](development/configuration#environment-variables) を参照してください。
- **Bake とプラグイン。** Bake とアップグレード用のシェルはコアからプラグインに移りました。
  また、主要な CakePHP 2 のプラグインも PHP 8 対応版がメンテナンスされています。
  [Bakeでコード生成](console-and-shells/code-generation-with-bake) と
  [メンテナンスされているプラグイン](/ja/plugins/maintained-plugins) を参照してください。

## どこから始めるか {#where-to-start}

### 既存のアプリケーション {#existing-application}

このドキュメントの読者の多くは、CakePHP 2 で動いているアプリケーションを保守しています。

1. [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) で前提条件と互換性のない
   変更点を確認します。フォークは CakePHP 2.10.24 をベースにしているので、それより古い 2.x の
   アプリケーションは先に 2.10.24 にアップグレードしてください。
2. [既存のアプリケーションへの導入](installation#adding-cakephp-to-an-existing-application) のとおりに、
   `cakephp/cakephp` を `pieceofcake2/cakephp` に置き換え、ディスパッチャファイルを更新します。
3. 必要であれば、[モダン構成への移行](/ja/appendices/migrating-to-the-modern-layout) のとおりに、
   ディレクトリ単位で少しずつモダンな構成に移行します。この作業は、将来 CakePHP 5 に移行するための
   準備にもなります。

### 新しいアプリケーション {#new-application}

フォークで新しくアプリケーションを始めるときは、アプリケーションスケルトンから作成します。

```bash
composer create-project pieceofcake2/app my_app
```

その後の設定は [新しいアプリケーションの作成](installation#creating-a-new-application) を参照してください。

> [!NOTE]
> 新しいプロジェクトでは、まず [CakePHP 5](https://book.cakephp.org/5/ja/) を検討してください。
> このフォークは、CakePHP 2 のまま運用する必要があるアプリケーションのためのものです。

## モダンな PHP から来た方へ {#coming-from-modern-php}

CakePHP 2 は PHP 5.2 と 5.3 の時代に設計されました。CakePHP 5、Laravel、Symfony などに慣れている場合は、
次の違いに注意してください。

- **名前空間がありません。** フレームワークとアプリケーションのクラスはグローバルなクラスで、
  クラス名とファイルの場所は [規約](getting-started/cakephp-conventions#file-and-classname-conventions)
  で決まります。たとえば `PostsController` は `src/Controller/PostsController.php` に置きます。
  フォークでは Composer のクラスマップがこれらを読み込みます。`App::uses()` が必要なのは、
  多くのプラグインのクラスのように、Composer が知らないクラスだけです。
- **オブジェクトではなく配列。** `find()` はオプションを配列で受け取り、`$post['Post']['title']` のように
  モデルのエイリアスをキーにした入れ子の配列を返します。エンティティやコレクションではありません。
  [データを取得する](models/retrieving-your-data) を参照してください。フォームのデータ、
  バリデーションルール、コンポーネントの設定も配列です。
- **モデルはテーブルゲートウェイです。** テーブルごとに 1 つの `Model` クラスが、検索、保存、
  バリデーション、アソシエーションを扱います。再利用するロジックは、モデルならビヘイビア、
  コントローラならコンポーネント、ビューならヘルパーにまとめます。
  [CakePHP の構造](getting-started/cakephp-structure) を参照してください。
- **依存性注入ではなく規約による結び付け。** サービスコンテナはありません。コントローラは
  `$uses`、`$components`、`$helpers` などのプロパティで使うものを宣言し、
  `$this->Post`、`$this->Auth`、`$this->Html` としてアクセスします。
- **グローバルな設定。** 設定は静的なレジストリ [Configure](development/configuration#configure-class)
  に置き、`Configure::read('App.encoding')` のように読み出します。キャッシュとログも
  `Cache::config()`、`CakeLog::config()` という同じ形の静的メソッドで設定します。
- **PSR-7 もミドルウェアもありません。** リクエストとレスポンスは `CakeRequest` と `CakeResponse`
  オブジェクトで、ディスパッチャの前後で動かす処理は
  [ディスパッチャー・フィルター](development/dispatch-filters) として書きます。
- **ネイティブな型宣言はわずかです。** コアのメソッドのほとんどは引数や戻り値の型宣言を持ちません。
  docblock と [静的解析](development/static-analysis) で補ってください。

これらの要素がどのように連携するかは
[CakePHP の典型的なリクエスト](getting-started/a-typical-cakephp-request) で説明しています。

## このセクションのページ {#in-this-section}

- [インストール](installation)、[応用インストール](installation/advanced-installation)、
  [URL リライト](installation/url-rewriting)
- [CakePHP のフォルダ構造](getting-started/cakephp-folder-structure)
- [CakePHP の規約](getting-started/cakephp-conventions)
- [CakePHP の構造](getting-started/cakephp-structure)
- [CakePHP の典型的なリクエスト](getting-started/a-typical-cakephp-request)
