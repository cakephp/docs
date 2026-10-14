# コード

Pull Request は、Piece of Cake 2 フォークにコードを送って貢献するための素晴らしい方法です。
Pull Request は GitHub で、該当する `pieceofcake2/*` リポジトリに対して作成してください。
フレームワークであれば [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) です。

始める前に、フォークの目的を確認しておいてください。フォークは PHP 8 への対応を維持し、
バグとセキュリティ問題を修正し、CakePHP 5 への段階的な移行を支援することを目的としており、
新機能は追加しません。変更が目的に合うかどうかわからない場合は、まず Issue を作って相談してください。

手順は [コントリビューションガイド](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#pull-requests) (英語) で説明しています。

- [Initial Setup](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#initial-setup):
  必要なソフトウェア、リポジトリのフォークとクローン、`composer install`
- [Running the Tests](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#running-the-tests):
  PHPUnit 9.6 と、フレームワークのテストスイートで `DB` 環境変数によってデータベースを選ぶ方法
- [Working on a Change](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#working-on-a-change):
  トピックブランチ、Pull Request を作成する前に実行するチェック (`phpcs`、`phpunit`、
  `composer validate`、PHPStan)、`CHANGELOG.md` と `UPGRADE.md` への記載
- [Coding Standard](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#coding-standard) と
  [Backwards Compatibility](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#backwards-compatibility)

コーディング規約のルールは [コーディング規約](cakephp-coding-conventions) で説明しています。

> [!NOTE]
> フォークに貢献したすべてのコードは、CakePHP のライセンスである MIT License の下で
> ライセンスされることを覚えておいてください。
