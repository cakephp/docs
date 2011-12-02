Media Views
===========

.. php:class:: MediaView

Media views allow you to send binary files to the user. For example, you may
wish to have a directory of files outside of the webroot to prevent users from
direct linking them. You can use the Media view to pull the file from a special
folder within /app/, allowing you to perform authentication before delivering
the file to the user.

To use the Media view, you need to tell your controller to use the MediaView
class instead of the default View class. After that, just pass in additional
parameters to specify where your file is located::

    <?php
    class ExampleController extends AppController {
        function download () {
            $this->viewClass = 'Media';
            // Download app/outside_webroot_dir/example.zip
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

Here's an example of rendering a file whose mime type is not included in the
MediaView's ``$mimeType`` array. We are also using a relative path which will 
default to your ``app/webroot`` folder::

    <?php
    function download () {
        $this->viewClass = 'Media';
        // Render app/webroot/files/example.docx
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

Settable Parameters
-------------------

``id``
    The ID is the file name as it resides on the file server including
    the file extension.

``name``
    The name allows you to specify an alternate file name to be sent to
    the user. Specify the name without the file extension.

``download``
    A boolean value indicating whether headers should be set to force
    download. Note that your controller's autoRender option should be
    set to false for this to work correctly.

``extension``
    The file extension. This is matched against an internal list of
    acceptable mime types. If the mime type specified is not in the
    list (or sent in the mimeType parameter array), the file will not
    be downloaded.

``path``
    The folder name, including the final directory separator. The path
    should be absolute but can be relative to the ``app/webroot`` folder.

``mimeType``
    An array with additional mime types to be merged with MediaView
    internal list of acceptable mime types.

``cache``
    A boolean or integer value - If set to true it will allow browsers
    to cache the file (defaults to false if not set); otherwise set it
    to the number of seconds in the future for when the cache should
    expire.


.. todo::

    Include examples of how to send files with Media View.


.. meta::
    :title lang=en: Media Views
    :keywords lang=en: array php,true extension,zip name,document path,mimetype,boolean value,binary files,webroot,file extension,mime type,default view,file server,authentication,parameters