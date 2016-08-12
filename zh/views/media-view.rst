媒体视图
========

.. php:class:: MediaView

.. deprecated:: 2.3
   请不要再使用，而是使用 :ref:`cake-response-file` 。

媒体视图(*Media View*)允许你发送二进制文件给用户。例如，你也许会希望使用 webroot
目录之外的目录存放文件以防止用户直接访问它们。你可以使用媒体视图从 /app/ 中的一个
特殊目录中拉取文件，并在传送文件之前验证用户。

要使用媒体视图，你需要告诉你的控制器使用 MediaView 类，而不是缺省的 View 类。然后，
只需要传入其它参数指定文件位置::

    class ExampleController extends AppController {
        public function download() {
            $this->viewClass = 'Media';
            // 下载 app/outside_webroot_dir/example.zip
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

下面这个例子渲染的文件，其 mime 类型不在 MediaView 的 ``$mimeType`` 数组中。同时
使用相对于缺省的 ``app/webroot`` 目录的路径::

    public function download() {
        $this->viewClass = 'Media';
        // 渲染 app/webroot/files/example.docx
        $params = array(
            'id'        => 'example.docx',
            'name'      => 'example',
            'extension' => 'docx',
            'mimeType'  => array(
                'docx' => 'application/vnd.openxmlformats-officedocument' .
                    '.wordprocessingml.document'
            ),
            'path'      => 'files' . DS
        );
        $this->set($params);
    }

可设参数
--------

``id``
    ID 是位于文件服务器上包括扩展名的文件名。

``name``
    name 让你可以定义发送给用户的不同的文件名。指定文件名时请不要包括扩展名。

``download``
    布尔值，说明是否在头文件中设置为强制下载。

``extension``
    文件扩展名。与可接受的 mime 类型内部列表相匹配。如果指定的 mime 类型不在列表
    中(或者不在 mimeType 参数数组中)，这个文件就无法下载。

``path``
    目录名，包括最终的目录分隔符。应当是绝对路径，但可以是相对于 ``app/webroot`` 
    目录。

``mimeType``
    额外 mime 类型的数组，会与 MediaView 的可接受的 mime 类型内部列表合并。

``cache``
    布尔值或整数值 — 如果设置为 true，它就会允许浏览器缓存
    文件(默认为不允许)；或者设置成数字，表示缓存将在多少秒
    之后过期。


.. todo::

    加入例子说明如何使用媒体视图发送文件。


.. meta::
    :title lang=zh: Media Views
    :keywords lang=zh: array php,true extension,zip name,document path,mimetype,boolean value,binary files,webroot,file extension,mime type,default view,file server,authentication,parameters
