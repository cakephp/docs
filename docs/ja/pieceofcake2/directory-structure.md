# ディレクトリ構成

::: pieceofcake2
このページは **pieceofcake2 フォーク** 固有の内容で、本家 CakePHP 2.x のドキュメントには含まれません。
:::

pieceofcake2 フォークは、2 種類のアプリケーション構成に対応しています。

- **レガシー構成**: `app/` ディレクトリを使う従来の CakePHP 2.x の構成です。このドキュメントの
  他のページはこの構成で説明しています。
- **モダン構成**: プロジェクト直下に `config/`、`src/`、`templates/`、`tests/` などを置く
  CakePHP 5.x 風の構成です。[pieceofcake2/app](https://github.com/pieceofcake2/app)
  スケルトンはこの構成を使っています。

どちらの構成も同じバージョンのフレームワークで動作します。レガシー構成のまま使い続けることも、
段階的にモダン構成へ移ることもできます。

## レガシー構成とモダン構成

::: code-group

```text [レガシー (app/)]
your-project/
├── app/
│   ├── Config/          (大文字、app/ の下)
│   ├── Controller/
│   ├── Model/
│   ├── View/            (テンプレートとヘルパーが混在)
│   ├── Test/
│   ├── Plugin/
│   ├── Vendor/
│   └── tmp/
│       └── logs/
├── vendors/
└── ...
```

```text [モダン (src/)]
your-project/
├── bin/
│   └── cake
├── config/              (小文字、プロジェクト直下)
├── src/                 (PHP コードすべて)
│   ├── Controller/
│   ├── Model/
│   └── View/            (ヘルパークラスのみ)
├── templates/           (.ctp ファイルすべて)
├── resources/
│   └── locales/
├── tests/               (小文字、プロジェクト直下)
├── plugins/             (Composer で管理)
├── vendor/              (Composer の標準)
├── logs/                (tmp/ から分離)
├── tmp/
└── webroot/
```

:::

## ファイルの移行対応表 {#file-migration-map}

| 移行元（レガシー）  | 移行先（モダン）               |
|---------------------|--------------------------------|
| `app/Config/*`      | `config/*`                     |
| `app/Controller/*`  | `src/Controller/*`             |
| `app/Model/*`       | `src/Model/*`                  |
| `app/View/**/*.ctp` | `templates/**/*.ctp`           |
| `app/View/Helper/*` | `src/View/Helper/*`            |
| `app/Console/*`     | `src/Console/*`                |
| `app/Console/cake`  | `bin/cake`                     |
| `app/Lib/*`         | `src/Lib/*`                    |
| `app/Locale/*`      | `resources/locales/*`          |
| `app/Test/*`        | `tests/*`                      |
| `app/Plugin/*`      | `plugins/*`（Composer を使う） |
| `app/Vendor/*`      | `vendor/*`（Composer を使う）  |
| `app/tmp/logs/*`    | `logs/*`                       |
| `app/tmp/*`         | `tmp/*`                        |
| `app/webroot/*`     | `webroot/*`                    |

モダン構成の `tests/` では、`Test/Case/` と `Test/Fixture/` の代わりに `tests/TestCase/` と
`tests/Fixture/` を使います。テストスイートとフィクスチャローダーはどちらも検出します。

## フレームワークが構成を判別する仕組み

パスの定数は、アプリケーションの `config/define.php` とフレームワーク自身の `config/define.php`
で定義されます。アプリケーション側で定義していない定数は、フレームワークが構成を見て決めます。

- `CONFIG`: `ROOT/config/` があればそこ、無ければ `ROOT/APP_DIR/Config/`
- `TMP`: `ROOT/tmp/` があればそこ、無ければ `APP/tmp/`
- `LOGS`: `ROOT/tmp/` があれば `ROOT/logs/`、無ければ `TMP/logs/`
- `TESTS`: `ROOT/tests/` があればそこ、無ければ `APP/Test/`
- テンプレートは `ROOT/templates/` からも、ロケールは `ROOT/resources/locales/` からも探します

モダンなスケルトンの `config/define.php` では、主に次の定数を設定しています。

```php
define('ROOT', dirname(__DIR__));
define('APP_DIR', 'src');          // 'app' の代わり
define('WEBROOT_DIR', 'webroot');
define('WWW_ROOT', ROOT . DS . WEBROOT_DIR . DS);
define('VENDORS', ROOT . DS . 'vendor' . DS);
```

`webroot/index.php`、`webroot/test.php`、`bin/cake` がこのファイルを読み込みます。
既存のアプリケーションコード（`App::uses()`、コントローラー、モデル、ビュー）は、
どちらの構成でも変更せずに動作します。

## CakePHP 5 への段階的な移行

CakePHP 2.x から 5.x へ一度に移行すると、コード、フォルダー構成、API をすべて同時に変えることに
なります。モダン構成を使うと、これを小さなステップに分けられます。

```text
Step 1: 従来の構成の CakePHP 2.x
        ↓（フォルダー構成だけをモダン化）
Step 2: CakePHP 5.x 風の構成の CakePHP 2.x  ← ここで止めてもよい
        ↓（コードだけをアップグレード）
Step 3: CakePHP 5.x 風の構成の CakePHP 5.x
```

- フォルダーの再編とコードの変更を分けられるので、1 回の変更が小さく扱いやすくなります。
- 次に進む前に、各ステップをテストで確認できます。
- 必要なら Step 2 に留まり続けられます。
- 変更が小さいので、チームでのレビューもしやすくなります。

### Step 2: CakePHP 2.x のまま構成を変える

1. **`composer.json` を更新します**。

   ```json
   {
       "require": {
           "php": ">=8.0",
           "pieceofcake2/cakephp": "^2.12"
       },
       "autoload": {
           "classmap": ["src/"]
       },
       "config": {
           "vendor-dir": "vendor/",
           "sort-packages": true,
           "allow-plugins": {
               "composer/installers": true
           }
       },
       "extra": {
           "installer-paths": {
               "plugins/{$name}/": ["type:cakephp-plugin"]
           }
       }
   }
   ```

2. **ブートストラップ用のファイルを更新します**:
   [pieceofcake2/app](https://github.com/pieceofcake2/app) から `config/define.php`、
   `webroot/index.php`、`webroot/test.php`、`bin/cake` をコピーします。
3. [移行対応表](#file-migration-map) に従って **ファイルを移動します**。
   たとえば次の順に、少しずつ進められます。
   1. 設定ファイル: `app/Config/*` → `config/*`
   2. PHP コード: `app/Controller/*`、`app/Model/*` → `src/`
   3. テンプレート: `app/View/**/*.ctp` → `templates/`
   4. テスト: `app/Test/*` → `tests/`
   5. 依存パッケージ: プラグインとベンダーは Composer で管理
4. アプリケーションが引き続き動作することを **確認します**。
5. **必要に応じて Composer のオートロードを使います**: `"classmap": ["src/"]` を設定して
   `composer dump-autoload` を実行すれば、コントローラー、モデル、ヘルパー、シェルから
   `App::uses()` を削除できます。

   ```php
   // 変更前
   App::uses('AppController', 'Controller');

   class UsersController extends AppController
   {
       // ...
   }

   // 変更後（Composer のオートロードを使用）
   class UsersController extends AppController
   {
       // ...
   }
   ```

::: warning
新しいクラスファイルを作るたびに `composer dump-autoload` を実行してください。
classmap を再生成しないと、新しいクラスは見つかりません。
Composer のオートロードに対応していないプラグインでは、引き続き `App::uses()` か
`CakePlugin::load()` が必要です。
:::

### Step 3: CakePHP 5 にアップグレードする

フォルダー構成がすでに整っているので、CakePHP 5.x へのアップグレードはコードの変更だけで済みます。
`composer.json` で CakePHP 5.x を require し、API の変更に合わせてコードを直し、互換性の問題を
修正します。[CakePHP 5.x 移行ガイド](https://book.cakephp.org/5/ja/appendices/5-0-migration-guide.html)
を参照してください。

## フレームワーク自身の構成

フレームワークのパッケージ自体の構成も変わりました
（[PR #21](https://github.com/pieceofcake2/cakephp/pull/21)）。このドキュメントで
`lib/Cake/...` のようにコア内部のファイルを指している箇所は、次のように読み替えてください。

| 本家 CakePHP 2.10                       | pieceofcake2/cakephp                 |
|-----------------------------------------|--------------------------------------|
| `lib/Cake/`                             | `src/Cake/`                          |
| `lib/Cake/Test/Case/`                   | `tests/TestCase/`                    |
| `lib/Cake/Test/Fixture/`                | `tests/Fixture/`                     |
| `lib/Cake/Console/cake`                 | `bin/cake`（`vendor/bin/cake`）      |
| `lib/Cake/Config/`                      | `config/`                            |
| `lib/Cake/View/`、`lib/Cake/Templates/` | `templates/`                         |
| `lib/Cake/VERSION.txt`                  | `VERSION.txt`                        |
| `lib/Cake/Console/Templates/skel/`      | [pieceofcake2/bake](https://github.com/pieceofcake2/bake) に移動 |

`CORE_ROOT` 定数はフレームワークのルートディレクトリを指します。
`vendor/bin/cake` は Composer からプロジェクトのルートを検出し、`src/` と `app/` の
どちらの構成でも動作します。
