# チケット

チケットの形式でコミュニティからのフィードバックと助けを得ることは、フォークをメンテナンスする上で
極めて重要です。チケットは GitHub の Issue です。フレームワークの問題は
[pieceofcake2/cakephp の Issues](https://github.com/pieceofcake2/cakephp/issues) に、
アプリケーションスケルトン、Bake、プラグインの問題はそれぞれの `pieceofcake2/*` リポジトリの
Issues に報告してください ([メンテナンスされているプラグイン](/ja/plugins/maintained-plugins) を参照)。
このドキュメントの問題は [pieceofcake2/docs](https://github.com/pieceofcake2/docs/issues) へ報告してください。

フォークの問題を cakephp/cakephp に報告しないでください。CakePHP 2.x は本家ではもうメンテナンスされていません。

## バグの報告

よく書かれたバグの報告は非常に有用です。
可能な限り最善のバグレポートを作成するのに役立ついくつかのステップがあります。

- 既存のよく似ているチケットを
  [検索](https://github.com/pieceofcake2/cakephp/issues?q=is%3Aissue)
  して、誰かが既にあなたの問題を報告していないか、リポジトリで既に修正されていないかを
  確認 **してください** 。
  [CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md) と
  [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) も確認してください。
  見ている挙動が、フォークで意図的に行われた変更である場合があります。
- **バグを再現する方法** についての詳細な手順を必ず **書いてください** 。
  これは問題の実例を示すテストケースかコードスニペットの形式となるでしょう。
  問題を再現する方法がないと、修正される可能性が低くなります。
- 環境についてできるだけ詳しく **書いてください** 。OS、PHP のバージョン、
  pieceofcake2/cakephp のバージョン (関係するプラグインがあればそのバージョンも)、
  データベース、エラーメッセージの全文などです。
- 一般的なサポートの質問にチケットシステムを使用 **しないでください** 。
  質問には [Stack Overflow](https://stackoverflow.com/questions/tagged/cakephp) を使ってください。

<a id="reporting-security-issues"></a>

## セキュリティ問題の報告

フォークでセキュリティ問題を見つけたら、公開の Issue、Pull Request、Discussion では
報告しないでください。代わりに GitHub の非公開の脆弱性報告 (private vulnerability reporting)
を使って報告してください。

1. 影響を受けるリポジトリ (例えば [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp))
   を開きます。
2. **Security** タブを開き、**Report a vulnerability** をクリックします。

影響を受けるパッケージとバージョン、問題の種類 (XSS、CSRF、SQL インジェクションなど)、
該当するファイル、再現手順または概念実証コード、影響の範囲を、できるだけ多く含めてください。
ポリシーの全文は Organization の
[セキュリティポリシー](https://github.com/pieceofcake2/.github/blob/master/SECURITY.md)
にあります。このポリシーは、独自の `SECURITY.md` を持つリポジトリを除き、
すべての `pieceofcake2/*` リポジトリに適用されます。

本家の CakePHP 2.x の脆弱性でフォークにも影響するものも対象です。
CakePHP チームはもうそれらを修正しないためです。

各々の報告について、メンテナーは次のことを行います。

- 報告内容を確認し、影響を受けるバージョンを特定します。
- 修正を準備し、リリースします。
- GitHub のセキュリティアドバイザリを公開し、必要に応じて CVE を申請します。

修正がリリースされるまで、詳細は公開しないようお願いします。
修正済みの脆弱性は [脆弱性への対応](/ja/appendices/security-fixes) にまとめています。
