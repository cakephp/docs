メディアビュー
==============

.. php:class:: MediaView

.. deprecated:: 2.3
   代わりに :ref:`cake-response-file` を使用してください。

メディアビューを使うとユーザにバイナリーファイルを送ることができます。例えば、
ユーザーが直接参照できないようにするためにwebrootディレクトリの外にディレクトリを配置したいとします。
メディアビューを使うと/app/以下の特定のフォルダからファイルを持ってきて、
認証してからファイルを渡すといったことができます。

メディアビューを使うためにはデフォルトビューの代わりにメディアビューを使うことをコントローラの中で宣言する必要があります。
あとは、ファイルが何処にあるかを示すために追加パラメータを渡して下さい。::

    class ExampleController extends AppController {
        public function download() {
            $this->viewClass = 'Media';
            //  app/outside_webroot_dir/example.zip をダウンロードする
            $params = array(
                'id'        => 'example.zip',
                'name'      => 'example',
                'download'  => true,
                'extension' => 'zip',
                'path'      => APP . 'outside_webroot_dir' . DS
            );
            $this->set($params);
        }
    }

ここではメディアビューの ``$mimeType`` に登録されていないmimeタイプのファイルを描画する例を示します。
また、デフォルトの ``app/webroot`` ディレクトリへの相対パスを使っています。::

    public function download() {
        $this->viewClass = 'Media';
        // app/webroot/files/example.docx を描画
        $params = array(
            'id'        => 'example.docx',
            'name'      => 'example',
            'extension' => 'docx',
            'mimeType'  => array(
                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ),
            'path'      => 'files' . DS
        );
        $this->set($params);
    }

設定できるパラメータ
--------------------

``id``
    IDはファイルサーバー上の拡張子を含むファイル名です。

``name``
    ユーザーに送られるファイルの名前をnameで指定することができます。拡張子を除いた名前で指定して下さい。

``download``
    ダウンロードを強制するためのヘッダを送るかどうかを指示する真偽値です。

``extension``
    ファイルの拡張子です。これは受理可能なmimeタイプの内部リストに一致します。もし、mimeタイプがリストにない場合(またはmimeTypeパラメータで渡されたものに一致しない場合)、ファイルはダウンロードされません。

``path``
    ディレクトリセパレータで終わるフォルダ名です。パスは絶対パスにすべきですが、 ``app/webroot`` フォルダからの相対パスも可能です。

``mimeType``
    追加のmimeタイプを含む配列です。この配列は、MediaViewが受け付けられるmimeタイプの内部リストにマージされます。

``cache``
    真偽値または整数値です。もしtrueが渡された場合、ブラウザはファイルをキャッシュすることを許可されます(もし設定されていない場合、デフォルトではfalseです)。
    それ以外の場合、キャッシュの有効期限が秒数で渡されます。

.. todo::

    メディアビューでファイルを送る方法の例を含めてください。

.. meta::
    :title lang=en: Media Views
    :keywords lang=en: array php,true extension,zip name,document path,mimetype,boolean value,binary files,webroot,file extension,mime type,default view,file server,authentication,parameters

