ACLShell
########

Aclシェル はACLデータベースのレコードの管理や確認をするのに有用です。
多くの場合、コントローラに変更を加えるよりもこちらのほうが使いやすいはずです。

Aclシェルのサブコマンドはたいてい、 aco/aro ノードへの参照を伴います。ノードには２つの「形式」があるためシェルにも２種類の記述方法が存在します。 ::

    # モデル + 外部キーによる参照
    ./Console/cake acl view aro Model.1

    # エイリアスパスによる参照
    ./Console/cake acl view aco root/controllers

``.`` はレコードによる参照を表し、 ``/`` はエイリアスパスを表します。


テーブルの準備
==============

ACLデータベースを使用するにはテーブルを構築する必要があります。
下のコマンドを入力することで構築できます。 ::

    ./Console/cake acl initdb

ノードの生成と削除
==================

create サブコマンドあるいは delete サブコマンドを利用し、ノードを新たに生成したり削除することができます。 ::

    ./Console/cake acl create aco controllers Posts
    ./Console/cake acl create aco Posts index

エイリアスパスによるACLレコードが生成されるでしょう。
同様に以下のようにすると ::

    ./Console/cake acl create aro Group.1

Group id = 1のAROノード生成がされるはずです。

アクセス許可と禁止
==================

ACLで許可を与えるには grant コマンドを使用してください。コマンドを実行すると、特定ARO（およびその子ノード）から特定のACOアクション（およびその子ノード）へのアクセスが許可されるはずです。 ::

    ./Console/cake acl grant Group.1 controllers/Posts

上のコマンドでは全ての権限が与えられます。以下のコマンドを使用すると read 権限のみを許可することもできます。 ::

    ./Console/cake acl grant Group.1 controllers/Posts read

禁止の場合も同じです。唯一の違いは grant の代わりに deny を使用することです。

権限のチェック
==============

ACLでの権限をチェックするには check コマンドを使用して下さい。 ::

    ./Console/cake acl check Group.1 controllers/Posts read

``allowed`` または ``not allowed`` のどちらかが出力されるはずです。

ノードツリーを確認する
======================

view コマンドはAROツリーまたはACOツリーを返します。オプションを付けることにより、リクエストツリーの一部のみを返すこともできます。 ::

    ./Console/cake acl view



.. meta::
    :title lang=ja: ACLシェル
