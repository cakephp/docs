# CakePHP のフォルダ構造

[pieceofcake2/app](https://pieceofcake2.github.io/app/) スケルトンから新しいアプリケーションを作成すると
([インストール](../installation) を参照)、次のようなファイルとフォルダが含まれているはずです。

- bin
- config
- logs
- plugins
- resources
- src
- templates
- tests
- tmp
- vendor
- webroot
- composer.json

主要なフォルダに注目してください。

- *src*、*config*、*templates* フォルダは、作成するプログラムが入る場所です。
  あなたのアプリケーションのファイルはここに入れます。
- *vendor* フォルダは Composer が管理します。CakePHP 本体 (`vendor/pieceofcake2/cakephp`) と、
  Composer で追加した外部の PHP ライブラリが入ります。
  このフォルダの中のファイルを勝手に編集 **しない** と誓ってください。
  これはコア (心臓部分) で、ここをいじってしまうと、私たちはもう助けを差し伸べることができません。
  代わりに [Application Extensions](../getting-started/cakephp-structure#application-extensions) の修正方法を調べてください。
- *webroot* フォルダは、アプリケーションのドキュメントルートです。

## アプリケーションのフォルダ

アプリケーションのフォルダについて詳しく見てみましょう。

bin  
コンソールスクリプト `cake` が入ります。CakePHP やアプリケーションのシェルを実行します
(例: `bin/cake server`、`bin/cake test`)。
詳しくは、 [シェルとタスクとコンソール](../console-and-shells) をご覧ください。

config  
CakePHP が使用する（数個の）設定ファイルが入る場所です。
データベース接続の詳細、ブートストラップ、コアの設定ファイルなどがここに入ります。
`config/define.php` では、アプリケーションの各フォルダのパスを定義します。

logs  
CakePHP のログファイルが書き込まれます。[ロギング](../core-libraries/logging) を参照してください。

plugins  
プラグインパッケージが入ります。Composer でインストールしたプラグインはここに置かれます。

resources/locales  
国際化のための文字ファイルが入ります。

src  
アプリケーションの PHP コードが入ります。

- `src/Console/Command` には、アプリケーションのコンソールコマンド (シェル) と、
  `Task/` にコンソールタスクが入ります。`src/Console/Templates` には、
  bake の出力をカスタマイズするためのテンプレートを置けます。
- `src/Controller` には、アプリケーションのコントローラと、`Component/` にコンポーネントが入ります。
- `src/Lib` には、サードパーティ、外部ベンダからのライブラリではなく、ファーストパーティのライブラリが入ります。
  これはベンダライブラリと内部ライブラリの構成を分割することを可能にします。
- `src/Model` には、アプリケーションのモデルと、`Behavior/` と `Datasource/` にビヘイビアとデータソースが入ります。
- `src/View/Helper` には、アプリケーションのヘルパーが入ります。

templates  
表示用のファイルはここに置きます。ビューのファイルはコントローラごとのフォルダ
(例: `templates/Posts/index.ctp`) に、エレメントは `Elements/`、エラーページは `Errors/`、
レイアウトは `Layouts/`、メールのテンプレートは `Emails/` に置きます。

tests  
このディレクトリは、アプリケーションの全てのテストケースやフィクスチャを含みます。
`tests/TestCase` ディレクトリは、あなたのアプリケーションを反映し、あなたのアプリケーションの
クラスごとに１つかそれ以上のテストケースを含むべきです。フィクスチャは `tests/Fixture` に置きます。
テストケースやフィクスチャの詳細は、 [テスト](../development/testing) をご覧ください。

tmp  
CakePHP が一時的なデータを保管する場所です。保管される実際のデータは、CakePHP の
設定しだいですが、このフォルダは通常、モデルの内容データや、ビューのキャッシュの保管に使用されます。
時にはセッション情報も入ります。

確実にこのフォルダが存在し、書き込み可能であるようにしてください。
そうしないと、アプリケーションのパフォーマンスは激しく影響をうけることになります。
デバッグモードでは、CakePHP がそうなっているかどうかを警告してくれます。

vendor  
CakePHP 本体を含む、Composer でインストールしたパッケージが入ります。
外部のライブラリは `composer require` で追加すると、`vendor/autoload.php` を通してオートロードされます。
ここにあるファイルを手で編集したり追加したりしないでください。

webroot  
開発時も運用時 (*production*) も、このフォルダだけがアプリケーションの
ドキュメントルートになります。CSS スタイルシートや画像、JavaScript ファイルを入れるための
フォルダもあります。

## 従来の `app/` 構成

CakePHP 2 の古いバージョンで作成したアプリケーションでは、すべてのコードが `app/` フォルダにあります。
CakePHP はこの構成もサポートしており、アプリケーションがどちらの構成を使っているかを判別します。
フォルダの対応は次のとおりです。

| 従来の構成 (`app/`)         | モダンな構成                        |
|---------------------------|------------------------------------|
| `app/Config`              | `config/`                          |
| `app/Console`             | `src/Console/`                     |
| `app/Console/cake`        | `bin/cake`                         |
| `app/Controller`          | `src/Controller/`                  |
| `app/Lib`                 | `src/Lib/`                         |
| `app/Locale`              | `resources/locales/`               |
| `app/Model`               | `src/Model/`                       |
| `app/Plugin`              | `plugins/`                         |
| `app/Test/Case`、`app/Test/Fixture` | `tests/TestCase/`、`tests/Fixture/` |
| `app/tmp`                 | `tmp/`                             |
| `app/tmp/logs`            | `logs/`                            |
| `app/Vendor`              | `vendor/` (Composer で管理)         |
| `app/View` (`.ctp` ファイル) | `templates/`                     |
| `app/View/Helper`         | `src/View/Helper/`                 |
| `app/webroot`             | `webroot/`                         |

### モダンな構成への移行

従来の構成のアプリケーションは、CakePHP 2 のまま動かしながら少しずつモダンな構成に移行できます。

1. [pieceofcake2/app](https://github.com/pieceofcake2/app) スケルトンから `config/define.php`、`bin/cake`、
   `webroot/index.php`、`webroot/test.php` をコピーします。`config/define.php` では `APP_DIR` が `src` に設定されています。
2. 上の表に従ってファイルを移動します。たとえば設定ファイル、`src/` の PHP コード、テンプレート、テストの順に移動します。
   `App::uses()` を含め、コード自体を変更する必要はありません。テストスイートは `Test/Case/` と
   `tests/TestCase/` のどちらからもテストを見つけるので、テストはしばらく `app/Test/` に置いたままでも構いません。
3. プラグインや外部ライブラリは `app/Plugin/` や `app/Vendor/` に置かず、Composer でインストールします。
4. 必要に応じて `composer.json` の `autoload` に `"classmap": ["src/"]` を追加して `composer dump-autoload` を実行すると、
   アプリケーションのクラスに対する `App::uses()` を取り除けます。

モダンな構成は CakePHP 5 と同じ構成なので、先に移行しておくと、フォルダの再編成と後のコードのアップグレードを分けて進められます。
