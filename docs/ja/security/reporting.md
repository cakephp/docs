# 脆弱性の報告

**セキュリティの脆弱性は、公開の Issue、Pull Request、Discussion では報告しないでください。**
pieceofcake2 Organization の [セキュリティポリシー](https://github.com/pieceofcake2/.github/blob/master/SECURITY.md)
に従い、非公開で報告してください。

<a id="how-to-report"></a>

## 報告の方法

Organization のリポジトリでは、GitHub の非公開の脆弱性報告 (private vulnerability reporting)
で報告を受け付けています。

1. 影響を受けるリポジトリを開きます。たとえばフレームワークの場合は
   [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp)、アプリケーションスケルトンの場合は
   [pieceofcake2/app](https://github.com/pieceofcake2/app) です。
2. **Security** タブを開き、**Report a vulnerability** をクリックします。
3. フォームに記入して送信します。報告の内容は、報告者とリポジトリのメンテナーだけが見られます。

報告には GitHub のアカウントが必要です。詳しくは GitHub のドキュメントの
[Privately reporting a security vulnerability](https://docs.github.com/ja/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
を参照してください。

本家の CakePHP 2.x の脆弱性も、`pieceofcake2/cakephp` に影響する場合はポリシーの対象になるので、
同じ方法で報告してください。CakePHP チームは CakePHP 2.x の修正を行っていません。

<a id="what-to-include"></a>

## 報告に含める情報

できるだけ次の情報を含めてください。

- 影響を受けるパッケージとバージョン
- 問題の種類 (XSS、CSRF、SQL インジェクションなど)
- 影響を受けるファイルとコードの位置
- 再現手順、または概念実証 (PoC)
- 影響の範囲と、攻撃者がどのように悪用できるか

<a id="what-happens-next"></a>

## 報告した後の流れ

セキュリティポリシーでは、公開までの流れを次のように定めています。

1. メンテナーが報告の内容を確認し、影響を受けるバージョンを特定します。
2. 修正を用意してリリースします。
3. GitHub のセキュリティアドバイザリを公開し、必要に応じて CVE を申請します。

修正がリリースされるまでは、詳細を公開しないでください。修正は [修正の告知](/ja/security/#announcements)
で説明した方法で告知し、[脆弱性への対応](/ja/security/fixes) に掲載します。
