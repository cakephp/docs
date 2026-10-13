# コード

Pull Request は、Piece of Cake 2 フォークにコードを送って貢献するための素晴らしい方法です。
Pull Request は GitHub で、該当する `pieceofcake2/*` リポジトリに対して作成してください。
フレームワークであれば [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) です。

始める前に、フォークの目的を確認しておいてください。フォークは PHP 8 への対応を維持し、
バグとセキュリティ問題を修正し、CakePHP 5 への段階的な移行を支援することを目的としており、
新機能は追加しません。変更が目的に合うかどうかわからない場合は、まず Issue を作って相談してください。

## 最初のセットアップ

フォークの修正に取りかかる前に自分の環境を整えることをお勧めします。
以下のソフトウェアが必要になります。

- Git
- PHP 8.0 以上。`mbstring` 拡張 (強く推奨) と、テストに使うデータベースの PDO ドライバー
- [Composer](https://getcomposer.org)
- MySQL、PostgreSQL、SQLite、SQL Server のいずれか、またはそれらを動かすための Docker

PHPUnit 9.6、CakePHP ルールセット付きの PHP_CodeSniffer、PHPStan はフレームワークの
開発用依存パッケージなので、Composer がインストールします。

ユーザー情報 (自分の名前/ハンドル名とメールアドレス) をセットしてください。

``` bash
git config --global user.name 'Bob Barker'
git config --global user.email 'bob.barker@example.com'
```

> [!NOTE]
> Git を使うのが初めてなら、無料で素敵なドキュメント
> [ProGit](https://git-scm.com/book/ja/) をぜひお読みください。

フレームワークのソースコードの clone を GitHub から取得してください。

- [GitHub](https://github.com) アカウントを持っていないなら、作成してください。
- [pieceofcake2/cakephp リポジトリ](https://github.com/pieceofcake2/cakephp) の **Fork**
  ボタンをクリックして Fork してください。

Fork できたら、Fork したものを自分のローカルマシンへと clone してください。

``` bash
git clone git@github.com:YOURNAME/cakephp.git
```

元のリポジトリを remote リポジトリとして追加してください。
これは後で元のリポジトリから変更分を fetch し、最新の状態を保つために使います。

``` bash
cd cakephp
git remote add upstream https://github.com/pieceofcake2/cakephp.git
```

次に依存パッケージをインストールします。

``` bash
composer install
```

## テストの実行

フレームワークのテストスイートは
[pieceofcake2/app](https://github.com/pieceofcake2/app) スケルトンの上で実行します。
スケルトンは開発用依存パッケージとして Composer が `vendor/pieceofcake2/app` にインストールします。
テスト用のデータベース設定をそこへコピーしてください。

``` bash
cp tests/config/database.php vendor/pieceofcake2/app/config/
```

この設定は、環境変数 `DB` でデータベースを選びます。値は `mysql` (デフォルト)、`mysql80`、
`pgsql`、`sqlite`、`sqlsrv` のいずれかです。SQLite はインメモリーのデータベースを使うので、
データベースサーバーは必要ありません。

``` bash
DB=sqlite vendor/bin/phpunit
```

その他のデータベースでは、`tests/config/database.php` に書かれた認証情報とデータベース名で
サーバーを起動し、`DB` をそれに合わせて指定します。

``` bash
DB=pgsql vendor/bin/phpunit
```

リポジトリの `compose.yml` には、サポートしているすべてのデータベースサーバーの
Docker コンテナが定義されているので、これを利用することもできます。

1 つのテストファイルだけを実行するには、そのパスを PHPUnit に渡します。

``` bash
DB=sqlite vendor/bin/phpunit tests/TestCase/Utility/HashTest.php
```

コードが [コーディング規約](../contributing/cakephp-coding-conventions) に沿っているかも
確認してください。

``` bash
vendor/bin/phpcs
```

リポジトリの CI は、すべての Pull Request について、サポートしているすべての PHP バージョンと
データベースでテストスイートを実行し、`phpcs` も実行します。

## 修正に取りかかる

バグの修正や改善に取り組むたびに、トピック・ブランチを作成してください。

フォークでメンテナンスしているブランチは `2.x` だけです。このブランチを元にしてください。

``` bash
git fetch upstream
git checkout -b fix-1234 upstream/2.x
```

> [!TIP]
> ブランチの名前は説明的につけてください。
> Issue 番号や修正内容を短く含めるのは良い慣習です。
> 例) fix-1234, php84-deprecations

上記は upstream の `2.x` ブランチをベースにローカル・ブランチを作成します。
修正に取り組み、必要なだけ commit してください。
ただし、次の点に注意してください。

- [コーディング規約](../contributing/cakephp-coding-conventions) に従ってください。
- バグが修正されたこと、もしくは変更が機能することが判るテストケースを追加してください。
- CakePHP 2 の公開 API を壊さないでください。
  [後方互換性ガイド](../contributing/backwards-compatibility) を参照してください。
- 理にかなったコミットを心がけ、コミットメッセージは解りやすく簡潔に書いてください。

## Pull Request を送信する

変更し終え、マージされる準備が整ったら、ブランチを更新します。

``` bash
git fetch upstream
git rebase upstream/2.x
```

これは作業開始以降にリポジトリで行われた変更を fetch し、rebase、つまり現在のコードの先端に
あなたの変更を適用し直します。`rebase` 中にコンフリクトが起きることもあります。
rebase が途中で止まったら、`git status` でどのファイルがコンフリクト/マージ失敗したのかを
確認できます。各コンフリクトを解決してから、rebase を続けてください。

``` bash
git add <filename> # コンフリクトしたファイルごとにこれを行ってください。
git rebase --continue
```

テストがすべて通ることを確認してください。
その後、ブランチをあなたの Fork へと push します。

``` bash
git push origin <branch-name>
```

ブランチが GitHub に上がったら、upstream リポジトリの `2.x` ブランチに対して
Pull Request を作成してください。何を修正したのか、どのようにテストしたのかを書き、
関連する Issue があればリンクしてください。

> [!NOTE]
> フォークに貢献したすべてのコードは、CakePHP のライセンスである MIT License の下で
> ライセンスされることを覚えておいてください。
