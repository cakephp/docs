インストールの準備
##################

CakePHP
は素早く簡単にインストールできます。最小構成で必要なものは、ウェブサーバと
Cake のコピー、それだけです!このマニュアルでは主に(最も一般的である)
Apache でのセットアップに主眼を置いていますが、 Cake を LightHTTPD や
Microsoft IIS
のような様々なウェブサーバで走らせるよう設定することもできます。

インストールの準備は次のステップからなります。

-  CakePHP のコピーをダウンロードする。
-  もし必要であればウェブサーバが PHP をハンドルできるよう設定する。
-  ファイルパーミッションをチェックする。

CakePHPを入手する
=================

CakePHP
の最新版を手に入れるには、主に二つの方法があります。ウェブサイトからアーカイブ(zip/tar.gz/tar.bz2)としてダウンロードする、あるいは
git
リポジトリからコードをチェックアウトする方法のいずれかにより取得できます。

最新のアーカイブをダウンロードするには、
`https://cakephp.org <https://cakephp.org>`_
のウェブサイトに行き、"Download Now!"
という大きなリンクに従って進みます。

CakePHP
の最新のリリースは\ `Github <https://github.com/cakephp>`_\ でホスティングされています。GithubにはCakePHP自身、また多くのCakePHPプラグインが含まれています。CakePHPのリリースは\ `Github
downloads <https://github.com/cakephp/cakephp1x/downloads>`_\ で入手できます。

他の手段を用いて、バグ修正や日ごとに行われる細かな機能追加が含まれた、できたてホヤホヤのコードを手に入れることができます。これらは
github
からレポジトリを複製することでアクセスすることができます。\ `CakePHP Repository <https://github.com/cakephp/cakephp>`_\ 。

パーミッションの設定
====================

CakePHP
は、幾つかの操作のために/app/tmpディレクトリを使用します。モデルのdescriptionや、ビューのキャッシュ、セッション情報などです。

なので、Cakeのインストール時には、/app/tmpディレクトリに書き込み権限があることを確認してください。
