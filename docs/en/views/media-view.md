# Media Views

`class` **MediaView**

::: info Deprecated in version 2.3
Use [Cake Response File](../controllers/request-response#cake-response-file) instead.
:::

Media views allow you to send binary files to the user. For example, you may
wish to have a directory of files outside of the webroot to prevent users from
direct linking them. You can use the Media view to pull the file from a special
folder in your project, allowing you to perform authentication before delivering
the file to the user.

To use the Media view, you need to tell your controller to use the MediaView
class instead of the default View class. After that, just pass in additional
parameters to specify where your file is located:

``` php
class ExampleController extends AppController
{
    public function download()
    {
        $this->viewClass = 'Media';
        // Download outside_webroot_dir/example.zip in the project root
        $params = [
            'id' => 'example.zip',
            'name' => 'example',
            'download' => true,
            'extension' => 'zip',
            'path' => ROOT . DS . 'outside_webroot_dir' . DS,
        ];
        $this->set($params);
    }
}
```

Here's an example of rendering a file whose mime type is not included in the
MediaView's `$mimeType` array. The file is in the `webroot/files` folder,
which is available as `WWW_ROOT . 'files'`:

``` php
public function download()
{
    $this->viewClass = 'Media';
    // Render webroot/files/example.docx
    $params = [
        'id' => 'example.docx',
        'name' => 'example',
        'extension' => 'docx',
        'mimeType' => [
            'docx' => 'application/vnd.openxmlformats-officedocument' .
                '.wordprocessingml.document',
        ],
        'path' => WWW_ROOT . 'files' . DS,
    ];
    $this->set($params);
}
```

## Settable Parameters

`id`  
The ID is the file name as it resides on the file server including
the file extension.

`name`  
The name allows you to specify an alternate file name to be sent to
the user. Specify the name without the file extension.

`download`  
A boolean value indicating whether headers should be set to force
download.

`extension`  
The file extension. This is matched against an internal list of
acceptable mime types. If the mime type specified is not in the
list (or set in the mimeType parameter array), the file will not
be downloaded.

`path`  
The folder name, including the final directory separator. The path
should be absolute. A relative path is resolved against the `APP` directory
(`src/`, or `app/` in the legacy layout), not against the webroot.

`mimeType`  
An array with additional mime types to be merged with MediaView
internal list of acceptable mime types.

`cache`  
A boolean or integer value - If set to true it will allow browsers
to cache the file (defaults to false if not set); otherwise set it
to the number of seconds in the future for when the cache should
expire.

<div class="todo">

Include examples of how to send files with Media View.

</div>
