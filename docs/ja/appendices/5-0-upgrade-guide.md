# 5.0 アップグレードガイド

まず始めに、お手元のアプリケーションが CakePHP 4.x の最新バージョンで動作していることを確認して下さい。

## 非推奨警告の対応

CakePHP 4.x の最新バージョンで動作していることが確認できたら **config/app.php** の設定を変更して、非推奨警告を有効にします:

``` text
'Error' => [
    'errorLevel' => E_ALL,
]
```

これによって全ての警告が見えるようになります。アップグレードの作業を始める前に確実にこれを済ませておいて下さい。

いくつか、影響の大きな非推奨項目があります。

- `Table::query()` は 4.5.0 で非推奨となりました。代わりに `selectQuery()`, `updateQuery()`, `insertQuery()`, `deleteQuery()` を使用して下さい。

## PHP 8.1 にアップグレード

もしもPHPのバージョンが **8.1 または それ以上** ではない場合、CakePHPのアップデートをする前にPHPのアップグレードをして下さい。

> [!NOTE]
> CakePHP 5.0 の実行には **最低でも PHP 8.1** が必要です。

## アップグレード・ツール の利用

> [!NOTE]
> このアップグレード・ツールは、最新の CakePHP 4.x でのみ実行可能です。CakePHP を 5.0 にした後では実行することはできません。

CakePHP 5 では、union型 や `mixed` 型を有効活用するので、メソッドのシグネチャやファイル名などで、後方互換性を持たない変更が多く含まれます。
つまらない仕事をさっさと片付けるために、アップグレード用の CLI ツールを利用して下さい。

``` bash
# Install the upgrade tool
git clone https://github.com/cakephp/upgrade
cd upgrade
git checkout 5.x
composer install --no-dev
```

このアップグレードツールがインストールされると、お手元のアプリケーションやプラグインにおいて実行可能となります:

``` text
bin/cake upgrade rector --rules cakephp50 <app/src へのパス>
bin/cake upgrade rector --rules chronos3 <app/src へのパス>
```

## CakePHPの依存関係の更新

ツールでのアップグレードが完了した後には、 `composer.json` に示されている、CakePHPやそのプラグイン、PHPUnit、そしてその他の多くの依存関係をアップグレードしましょう。
この作業の内容は、お手元のアプリケーションの状況によって変わりますので、 `composer.json` ファイルを、お手元のアプリケーションのものと、 CakePHP 5.x のアプリのテンプレート [cakephp/app](https://github.com/cakephp/app/blob/5.x/composer.json) とで見比べると良いでしょう。

`composer.json` のバージョンが調整されたら、 `composer update -W` を実行して、結果を確認しましょう。

## アプリのファイルを、アプリのテンプレートに沿って更新

次に、アプリケーションの他のファイルについても、アプリのテンプレート [cakephp/app](https://github.com/cakephp/app/blob/5.x/) を見て、必要なアップデートを施します。
