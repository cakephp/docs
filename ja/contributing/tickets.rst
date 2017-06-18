チケット
########

チケットの形式でコミュニティーからのフィードバックと助けを得ることは、
CakePHP の開発プロセスの極めて重要な部分です。CakePHP のチケットの全ては
`GitHub <https://github.com/cakephp/cakephp/issues>`_ にホストされています。

バグの報告
==========

よく書かれたバグの報告は非常に有用です。
可能な限り最善のバグレポートを作成するのに役立ついくつかのステップがあります:

* 既存のよく似ているチケットを
  `検索 <https://github.com/cakephp/cakephp/search?q=it+is+broken&ref=cmdform&type=Issues>`_
  して、誰かが既にあなたの問題を報告してるかを、またはレポジトリ内でまだバグが修正されていないかを
  確認 **してください** 。
* **バグを再現する方法** についての詳細な手順を必ず **書いてください** 。
  これは問題の実例を示すテストケースかコードスニペットの形式となるでしょう。
  問題を再現する方法がないと、修正される可能性が低くなります。
* 環境 (OS、PHP バージョン、CakePHP バージョン) についてできるだけ詳しく **書いてください** 。
* サポートの質問にチケットシステムを使用 **しないでください** 。
  `Freenode <https://webchat.freenode.net>`__ の #cakephp IRC チャンネルでは、
  あなたの質問の答えを手助けしてくれる多くの開発者に会えます。
  `Stack Overflow <https://stackoverflow.com/questions/tagged/cakephp>`__
  も覗いてみてください。

セキュリティ問題の報告
======================

もし CakePHP でセキュリティ問題を見つけたら、通常のバグ報告システムの代わりに、
以下の手順を使用してください。バグトラッカー、メーリングリスト、IRC を使う代わりに、
どうか **security [at] cakephp.org** に Eメールを送るようにしてください。
このアドレスに送られた Eメールは CakePHP コアチームにプライベートなメーリングリストで送られます。

各々の報告では、私たちは最初に脆弱性を確認しようとします。
一旦確認されたならば、CakePHP チームは次の処置を講ずるでしょう:

* 私たちは問題を受け渡した報告者に受け取ったことを知らせた上で、修正に取り組みます。
  私達がそれを発表するまで報告者が問題の機密性を保持するようお願いします。
* 修正・パッチを準備します。
* 危弱性と、エクスプロイトコードの説明をする記事を準備します。
* 影響する全てのバージョンの新規バージョンをリリースします。
* リリースの発表にその問題を大々的に載せます。

.. meta::
    :title lang=ja: チケット
    :keywords lang=ja: bug reporting system,code snippet,reporting security,private mailing,release announcement,google,ticket system,core team,security issue,bug tracker,irc channel,test cases,support questions,bug report,security issues,bug reports,exploits,vulnerability,repository
