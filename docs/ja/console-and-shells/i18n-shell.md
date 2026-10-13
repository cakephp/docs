# I18N シェル

CakePHP の国際化機能は、 [po files](https://en.wikipedia.org/wiki/GNU_gettext)
を翻訳のソースとして使います。これにより [poedit](https://www.poedit.net/) のようなツールや
その他の一般的な翻訳ツールによる統合が容易になります。

i18n シェルは、素早く容易に po テンプレートファイルを生成します。
アプリケーション中の文字列を翻訳できるように、これらのテンプレートファイルが翻訳者に提供されます。
一度翻訳が済むと、 翻訳の更新に役立つよう pot ファイルは既存の翻訳とマージされます。

## POT ファイルの生成

`extract` コマンドを使って、既存のアプリケーションのために POT ファイルを
生成することができます。このコマンドは、 `__()` 形式の関数を呼び、メッセージ文字列を
抽出するためにアプリケーション全体をスキャンします。アプリケーション中のユニークな文字列は
それぞれ一つの POT ファイルの中に混合されます。 :

    bin/cake i18n extract

上記は、抽出シェルを実行します。シェルは、スキャンするディレクトリ (デフォルトは
アプリケーションディレクトリの `src/`) と出力先 (デフォルトは `src/Locale`) を尋ねます。
`__()` メソッド中の文字列を抽出することにくわえて、モデルのバリデーションメッセージも
抽出できます。

ビューテンプレートは `templates/` に、翻訳ファイルは `resources/locales/` に置くので、
通常はこの 2 つの場所を明示的に指定します。 :

    bin/cake i18n extract --paths src,templates --output resources/locales

このコマンドの結果は、 `resources/locales/default.pot` ファイルになります。
pot ファイルは、 po ファイルを作成するためのテンプレートとして使用します。もし、手動で
pot ファイルから po ファイルを作成するなら、 `Plural-Forms` ヘッダー行を正しく設定してください。

> [!NOTE]
> モデルのバリデーションメッセージが抽出されるのは、スキャン対象がアプリケーション
> ディレクトリだけの場合 (対話モードのデフォルト) に限られます。上の
> `--paths src,templates` を指定したコマンドでは抽出されません。

### プラグイン用 POT ファイルの生成

特定のプラグインで使用される POT ファイルを生成することができます。 :

``` text
bin/cake i18n extract --plugin <Plugin>
```

これは、プラグイン中で使用されたで必要な POT ファイルを生成します。

### モデルバリデーションメッセージ

モデル中から抽出されたバリデーションメッセージが使用するドメインを設定できます。
もし、モデルがすでに `$validationDomain` プロパティを持っているなら、
与えられたバリデーションドメインは無視されます。 :

    bin/cake i18n extract --validation-domain validation_errors

また、バリデーションメッセージの抽出を止められます。 :

    bin/cake i18n extract --ignore-model-validation

### フォルダーの除外

除外したいフォルダをカンマ区切りで指定します。指定された値に含まれるパスは無視されます。 :

    bin/cake i18n extract --exclude Test,Vendor

### 既存の POT ファイル上書きの警告をスキップする

::: info Added in version 2.2
:::

`--overwrite` を追加することで、 POT ファイルが存在しても警告されず、
デフォルトで上書きされます。 :

    bin/cake i18n extract --overwrite

### CakePHP コアライブラリからのメッセージ抽出

::: info Added in version 2.2
:::

デフォルトで、抽出シェルスクリプトは CakePHP コアライブラリ中で使われているメッセージを
抽出するかどうか訊ねます。 `--extract-core` に `yes` か `no` を設定することで、
デフォルトの動作を指定できます。

    bin/cake i18n extract --extract-core yes

    または

    bin/cake i18n extract --extract-core no

## TranslateBehavior で使用されるテーブルを作る

i18n シェルは、 `TranslateBehavior` で使用されるデフォルトのテーブルを
初期化することができます。 :

    bin/cake i18n initdb

これで翻訳ビヘイビアで使用される `i18n` デーブルが作成されます。
