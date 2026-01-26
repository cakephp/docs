# Html

`class` Cake\\View\\Helper\\**HtmlHelper**(View $view, array $config = [])

The role of the HtmlHelper in CakePHP is to make HTML-related
options easier, faster, and more resilient to change. Using this
helper will enable your application to be more light on its feet,
and more flexible on where it is placed in relation to the root of
a domain.

Many HtmlHelper methods include a `$attributes` parameter,
that allow you to tack on any extra attributes on your tags. Here
are a few examples of how to use the `$attributes` parameter:

``` html
Desired attributes: <tag class="someClass" />
Array parameter: ['class' => 'someClass']

Desired attributes: <tag name="foo" value="bar" />
Array parameter:  ['name' => 'foo', 'value' => 'bar']
```

## Inserting Well-Formatted Elements

The most important task the HtmlHelper accomplishes is creating
well formed markup. This section will cover some of the
methods of the HtmlHelper and how to use them.

### Creating Charset Tags

`method` Cake\\View\\Helper\\HtmlHelper::**charset**($charset=null)

Used to create a meta tag specifying the document's character. The default value
is UTF-8. An example use:

``` php
echo $this->Html->charset();
```

Will output:

``` html
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
```

Alternatively, :

``` php
echo $this->Html->charset('ISO-8859-1');
```

Will output:

``` html
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
```

### Linking to CSS Files

`method` Cake\\View\\Helper\\HtmlHelper::**css**(mixed $path, array $options = [])

Creates a link(s) to a CSS style-sheet. If the `block` option is set to
`true`, the link tags are added to the `css` block which you can print
inside the head tag of the document.

You can use the `block` option to control which block the link element
will be appended to. By default it will append to the `css` block.

If key 'rel' in `$options` array is set to 'import' the stylesheet will be imported.

This method of CSS inclusion assumes that the CSS file specified
resides inside the **webroot/css** directory if path doesn't start with a '/'. :

``` php
echo $this->Html->css('forms');
```

Will output:

``` html
<link rel="stylesheet" href="/css/forms.css" />
```

The first parameter can be an array to include multiple files. :

``` php
echo $this->Html->css(['forms', 'tables', 'menu']);
```

Will output:

``` html
<link rel="stylesheet" href="/css/forms.css" />
<link rel="stylesheet" href="/css/tables.css" />
<link rel="stylesheet" href="/css/menu.css" />
```

You can include CSS files from any loaded plugin using
`plugin syntax`. To include **plugins/DebugKit/webroot/css/toolbar.css**
you could use the following:

``` php
echo $this->Html->css('DebugKit.toolbar.css');
```

If you want to include a CSS file which shares a name with a loaded
plugin you can do the following. For example if you had a `Blog` plugin,
and also wanted to include **webroot/css/Blog.common.css**, you would:

``` php
echo $this->Html->css('Blog.common.css', ['plugin' => false]);
```

### Creating CSS Programatically

`method` Cake\\View\\Helper\\HtmlHelper::**style**(array $data, boolean $oneline = true)

Builds CSS style definitions based on the keys and values of the
array passed to the method. Especially handy if your CSS file is
dynamic. :

``` php
echo $this->Html->style([
    'background' => '#633',
    'border-bottom' => '1px solid #000',
    'padding' => '10px'
]);
```

Will output:

``` css
background:#633; border-bottom:1px solid #000; padding:10px;
```

### Creating meta Tags

`method` Cake\\View\\Helper\\HtmlHelper::**meta**(string|array $type, string $url = null, array $options = [])

This method is handy for linking to external resources like RSS/Atom feeds
and favicons. Like css(), you can specify whether or not you'd like this tag
to appear inline or appended to the `meta` block by setting the 'block'
key in the \$attributes parameter to `true`, ie - `['block' => true]`.

If you set the "type" attribute using the \$attributes parameter,
CakePHP contains a few shortcuts:

| type      | translated value       |
|-----------|------------------------|
| html      | text/html              |
| rss       | application/rss+xml    |
| atom      | application/atom+xml   |
| icon      | image/x-icon           |
| csrfToken | The current CSRF token |

``` php
echo $this->Html->meta(
    'favicon.ico',
    '/favicon.ico',
    ['type' => 'icon']
);
// Output (line breaks added)
// Note: The helper code makes two meta tags to  ensure the
// icon is downloaded by both newer and older browsers
// which require different rel attribute values.
<link
    href="/subdir/favicon.ico"
    type="image/x-icon"
    rel="icon"
/>
<link
    href="/subdir/favicon.ico"
    type="image/x-icon"
    rel="shortcut icon"
/>

echo $this->Html->meta(
    'Comments',
    '/comments/index.rss',
    ['type' => 'rss']
);
// Output (line breaks added)
<link
    href="http://example.com/comments/index.rss"
    title="Comments"
    type="application/rss+xml"
    rel="alternate"
/>
```

This method can also be used to add the meta keywords and
descriptions. Example:

``` php
echo $this->Html->meta(
    'keywords',
    'enter any meta keyword here'
);
// Output
<meta name="keywords" content="enter any meta keyword here" />

echo $this->Html->meta(
    'description',
    'enter any meta description here'
);
// Output
<meta name="description" content="enter any meta description here" />

echo $this->Html->meta('csrfToken');
// The CsrfProtection middleware must be loaded for your application
<meta name="csrf-token" content="CSRF token here" />
```

In addition to making predefined meta tags, you can create link elements:

``` php
<?= $this->Html->meta([
    'link' => 'http://example.com/manifest',
    'rel' => 'manifest'
]);
?>
// Output
<link href="http://example.com/manifest" rel="manifest"/>
```

Any attributes provided to meta() when called this way will be added to the
generated link tag.

::: info Changed in version 5.1.0
The `csrfToken` type was added.
:::

### Linking to Images

`method` Cake\\View\\Helper\\HtmlHelper::**image**(string $path, array $options = [])

Creates a formatted image tag. The path supplied should be relative
to **webroot/img/**. :

``` php
echo $this->Html->image('cake_logo.png', ['alt' => 'CakePHP']);
```

Will output:

``` html
<img src="/img/cake_logo.png" alt="CakePHP" />
```

To create an image link specify the link destination using the
`url` option in `$attributes`. :

``` php
echo $this->Html->image("recipes/6.jpg", [
    "alt" => "Brownies",
    'url' => ['controller' => 'Recipes', 'action' => 'view', 6]
]);
```

Will output:

``` html
<a href="/recipes/view/6">
    <img src="/img/recipes/6.jpg" alt="Brownies" />
</a>
```

If you are creating images in emails, or want absolute paths to images you
can use the `fullBase` option:

``` php
echo $this->Html->image("logo.png", ['fullBase' => true]);
```

Will output:

``` html
<img src="http://example.com/img/logo.jpg" alt="" />
```

You can include image files from any loaded plugin using
`plugin syntax`. To include **plugins/DebugKit/webroot/img/icon.png**
You could use the following:

``` php
echo $this->Html->image('DebugKit.icon.png');
```

If you want to include an image file which shares a name with a loaded
plugin you can do the following. For example if you had a `Blog` plugin,
and also wanted to include **webroot/img/Blog.icon.png**, you would:

``` php
echo $this->Html->image('Blog.icon.png', ['plugin' => false]);
```

If you would like the prefix of the URL to not be `/img`, you can override this setting by specifying the prefix in the `$options` array :

``` php
echo $this->Html->image("logo.png", ['pathPrefix' => '']);
```

Will output:

``` html
<img src="logo.jpg" alt="" />
```

### Creating Links

`method` Cake\\View\\Helper\\HtmlHelper::**link**($title, $url = null, array $options = [])

General purpose method for creating HTML links. Use `$options` to
specify attributes for the element and whether or not the
`$title` should be escaped. :

``` php
echo $this->Html->link(
    'Enter',
    '/pages/home',
    ['class' => 'button', 'target' => '_blank']
);
```

Will output:

``` html
<a href="/pages/home" class="button" target="_blank">Enter</a>
```

Use `'_full'=>true` option for absolute URLs:

``` php
echo $this->Html->link(
    'Dashboard',
    ['controller' => 'Dashboards', 'action' => 'index', '_full' => true]
);
```

Will output:

``` html
<a href="http://www.yourdomain.com/dashboards/index">Dashboard</a>
```

Specify `confirm` key in options to display a JavaScript `confirm()`
dialog:

``` php
echo $this->Html->link(
    'Delete',
    ['controller' => 'Recipes', 'action' => 'delete', 6],
    ['confirm' => 'Are you sure you wish to delete this recipe?']
);
```

Will output:

``` html
<a href="/recipes/delete/6"
    onclick="return confirm(
        'Are you sure you wish to delete this recipe?'
    );">
    Delete
</a>
```

Query strings can also be created with `link()`. :

``` php
echo $this->Html->link('View image', [
    'controller' => 'Images',
    'action' => 'view',
    1,
    '?' => ['height' => 400, 'width' => 500]
]);
```

Will output:

``` html
<a href="/images/view/1?height=400&width=500">View image</a>
```

HTML special characters in `$title` will be converted to HTML
entities. To disable this conversion, set the escape option to
`false` in the `$options` array. :

``` php
echo $this->Html->link(
    $this->Html->image("recipes/6.jpg", ["alt" => "Brownies"]),
    "recipes/view/6",
    ['escape' => false]
);
```

Will output:

``` html
<a href="/recipes/view/6">
    <img src="/img/recipes/6.jpg" alt="Brownies" />
</a>
```

Setting `escape` to `false` will also disable escaping of attributes of the
link. You can use the option `escapeTitle` to disable just
escaping of title and not the attributes. :

``` php
echo $this->Html->link(
    $this->Html->image('recipes/6.jpg', ['alt' => 'Brownies']),
    'recipes/view/6',
    ['escapeTitle' => false, 'title' => 'hi "howdy"']
);
```

Will output:

``` html
<a href="/recipes/view/6" title="hi &quot;howdy&quot;">
    <img src="/img/recipes/6.jpg" alt="Brownies" />
</a>
```

Also check `Cake\View\Helper\UrlHelper::build()` method
for more examples of different types of URLs.

`method` Cake\\View\\Helper\\HtmlHelper::**linkFromPath**(string $title, string $path, array $params = [], array $options = [])

If you want to use route path strings, you can do that using this method:

``` php
echo $this->Html->linkFromPath('Index', 'Articles::index');
// outputs: <a href="/articles">Index</a>

echo $this->Html->linkFromPath('View', 'MyBackend.Admin/Articles::view', [3]);
// outputs: <a href="/admin/my-backend/articles/view/3">View</a>
```

### Linking to Videos and Audio Files

`method` Cake\\View\\Helper\\HtmlHelper::**media**(string|array $path, array $options)

Options:

- `type` Type of media element to generate, valid values are "audio"
  or "video". If type is not provided media type is guessed based on
  file's mime type.
- `text` Text to include inside the video tag
- `pathPrefix` Path prefix to use for relative URLs, defaults to
  'files/'
- `fullBase` If provided the src attribute will get a full address
  including domain name

Returns a formatted audio/video tag:

``` php
<?= $this->Html->media('audio.mp3') ?>

// Output
<audio src="/files/audio.mp3"></audio>

<?= $this->Html->media('video.mp4', [
    'fullBase' => true,
    'text' => 'Fallback text'
]) ?>

// Output
<video src="http://www.somehost.com/files/video.mp4">Fallback text</video>

<?= $this->Html->media(
    ['video.mp4', ['src' => 'video.ogg', 'type' => "video/ogg; codecs='theora, vorbis'"]],
    ['autoplay']
) ?>

// Output
<video autoplay="autoplay">
    <source src="/files/video.mp4" type="video/mp4"/>
    <source src="/files/video.ogg" type="video/ogg;
        codecs='theora, vorbis'"/>
</video>
```

### Linking to Javascript Files

`method` Cake\\View\\Helper\\HtmlHelper::**script**(mixed $url, mixed $options)

Include a script file(s), contained either locally or as a remote URL.

By default, script tags are added to the document inline. If you override
this by setting `$options['block']` to `true`, the script tags will instead
be added to the `script` block which you can print elsewhere in the document.
If you wish to override which block name is used, you can do so by setting
`$options['block']`.

`$options['once']` controls whether or
not you want to include this script once per request or more than
once. This defaults to `true`.

You can use \$options to set additional properties to the
generated script tag. If an array of script tags is used, the
attributes will be applied to all of the generated script tags.

This method of JavaScript file inclusion assumes that the
JavaScript file specified resides inside the **webroot/js**
directory:

``` php
echo $this->Html->script('scripts');
```

Will output:

``` html
<script src="/js/scripts.js"></script>
```

You can link to files with absolute paths as well to link files
that are not in **webroot/js**:

``` php
echo $this->Html->script('/otherdir/script_file');
```

You can also link to a remote URL:

``` php
echo $this->Html->script('https://code.jquery.com/jquery.min.js');
```

Will output:

``` html
<script src="https://code.jquery.com/jquery.min.js"></script>
```

The first parameter can be an array to include multiple files. :

``` php
echo $this->Html->script(['jquery', 'wysiwyg', 'scripts']);
```

Will output:

``` html
<script src="/js/jquery.js"></script>
<script src="/js/wysiwyg.js"></script>
<script src="/js/scripts.js"></script>
```

You can append the script tag to a specific block using the `block`
option:

``` php
$this->Html->script('wysiwyg', ['block' => 'scriptBottom']);
```

In your layout you can output all the script tags added to 'scriptBottom':

``` php
echo $this->fetch('scriptBottom');
```

You can include script files from any loaded plugin using
`plugin syntax`. To include **plugins/DebugKit/webroot/js/toolbar.js**
You could use the following:

``` php
echo $this->Html->script('DebugKit.toolbar.js');
```

If you want to include a script file which shares a name with a loaded
plugin you can do the following. For example if you had a `Blog` plugin,
and also wanted to include **webroot/js/Blog.plugins.js**, you would:

``` php
echo $this->Html->script('Blog.plugins.js', ['plugin' => false]);
```

### Creating Inline Javascript Blocks

`method` Cake\\View\\Helper\\HtmlHelper::**scriptBlock**(string $code, array $options = [])

To generate Javascript blocks from PHP view code, you can use one of the script
block methods. Scripts can either be output in place, or buffered into a block:

``` php
// Define a script block all at once, with the defer attribute.
$this->Html->scriptBlock('alert("hi")', ['defer' => true]);

// Buffer a script block to be output later.
$this->Html->scriptBlock('alert("hi")', ['block' => true]);
```

`method` Cake\\View\\Helper\\HtmlHelper::**scriptStart**(array $options = [])

`method` Cake\\View\\Helper\\HtmlHelper::**scriptEnd**()

You can use the `scriptStart()` method to create a capturing block that will
output into a `<script>` tag. Captured script snippets can be output inline,
or buffered into a block:

``` php
// Append into the 'script' block.
$this->Html->scriptStart(['block' => true]);
echo "alert('I am in the JavaScript');";
$this->Html->scriptEnd();
```

You can use simple `<script>...</script>` tags inside the script block to
enable syntax highlighting and LSP support in many editors:

``` php
<?php $this->Html->scriptStart(['block' => true]) ?>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        alert('I am in the JavaScript');
    });
</script>
<?php $this->Html->scriptEnd() ?>
```

The wrapping `script` tag will be removed and replaced with a script tag
generated by the helper that includes a CSP nonce if available.

Once you have buffered javascript, you can output it as you would any other
[View Block](../../views#view-blocks):

``` php
// In your layout
echo $this->fetch('script');
```

::: info Changed in version 5.3.0
Support for `script` tags inside `scriptStart()`/`scriptEnd()` was added.
:::

### Creating Javascript Importmap

`method` Cake\\View\\Helper\\HtmlHelper::**importmap(array $map, array $options = []): string**()

Creates an <span class="title-ref">importmap</span> script tag for your JavaScript files:

``` php
// In the head tag of your layout
echo $this->Html->importmap([
    'jquery' => 'jquery.js',
    'wysiwyg' => '/editor/wysiwyg.js'
]);
```

Will output:

``` html
<script type="importmap">{
    "imports": {
        "jquery": "/js/jquery.js",
        "wysiwyg": "/editor/wysiwyg.js"
    }
}</script>
```

Generating maps with imports, scopes and integrity:

``` php
echo $this->Html->importmap([
    'imports' => [
        'jquery' => 'jquery-3.7.1.min.js',
        'wysiwyg' => '/editor/wysiwyg.js'
    ],
    'scopes' => [
        'scoped/' => [
            'foo' => 'inner/foo',
        ],
    ],
    'integrity' => [
        'jquery' => 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=',
    ],
]);
```

Will output:

``` html
<script type="importmap">{
    "imports": {
        "jquery": "/js/jquery-3.7.1.min.js",
        "wysiwyg": "/editor/wysiwyg.js"
    },
    "scopes": {
        "scoped/": {
            "foo": "/js/inner/foo.js"
        }
    },
    "integrity": {
        "/js/jquery-3.7.1.min.js": "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
    }
}</script>
```

### Creating Nested Lists

`method` Cake\\View\\Helper\\HtmlHelper::**nestedList**(array $list, array $options = [], array $itemOptions = [])

Build a nested list (UL/OL) out of an associative array:

``` php
$list = [
    'Languages' => [
        'English' => [
            'American',
            'Canadian',
            'British',
        ],
        'Spanish',
        'German',
    ]
];
echo $this->Html->nestedList($list);
```

Output:

``` html
// Output (minus the whitespace)
<ul>
    <li>Languages
        <ul>
            <li>English
                <ul>
                    <li>American</li>
                    <li>Canadian</li>
                    <li>British</li>
                </ul>
            </li>
            <li>Spanish</li>
            <li>German</li>
        </ul>
    </li>
</ul>
```

### Creating Table Headings

`method` Cake\\View\\Helper\\HtmlHelper::**tableHeaders**(array $names, array $trOptions = null, array $thOptions = null)

Creates a row of table header cells to be placed inside of \<table\>
tags. :

``` php
echo $this->Html->tableHeaders(['Date', 'Title', 'Active']);
```

Output:

``` html
<tr>
    <th>Date</th>
    <th>Title</th>
    <th>Active</th>
</tr>
```

``` php
echo $this->Html->tableHeaders(
    ['Date', 'Title','Active'],
    ['class' => 'status'],
    ['class' => 'product_table']
);
```

Output:

``` html
<tr class="status">
     <th class="product_table">Date</th>
     <th class="product_table">Title</th>
     <th class="product_table">Active</th>
</tr>
```

You can set attributes per column, these are used instead of the
defaults provided in the `$thOptions`:

``` php
echo $this->Html->tableHeaders([
    'id',
    ['Name' => ['class' => 'highlight']],
    ['Date' => ['class' => 'sortable']]
]);
```

Output:

``` html
<tr>
    <th>id</th>
    <th class="highlight">Name</th>
    <th class="sortable">Date</th>
</tr>
```

### Creating Table Cells

`method` Cake\\View\\Helper\\HtmlHelper::**tableCells**(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

Creates table cells, in rows, assigning \<tr\> attributes differently
for odd- and even-numbered rows. Wrap a single table cell within an
\[\] for specific \<td\>-attributes. :

``` php
echo $this->Html->tableCells([
    ['Jul 7th, 2007', 'Best Brownies', 'Yes'],
    ['Jun 21st, 2007', 'Smart Cookies', 'Yes'],
    ['Aug 1st, 2006', 'Anti-Java Cake', 'No'],
]);
```

Output:

``` html
<tr><td>Jul 7th, 2007</td><td>Best Brownies</td><td>Yes</td></tr>
<tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
<tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td>No</td></tr>
```

``` php
echo $this->Html->tableCells([
    ['Jul 7th, 2007', ['Best Brownies', ['class' => 'highlight']] , 'Yes'],
    ['Jun 21st, 2007', 'Smart Cookies', 'Yes'],
    ['Aug 1st, 2006', 'Anti-Java Cake', ['No', ['id' => 'special']]],
]);
```

Output:

``` html
<tr>
    <td>
        Jul 7th, 2007
    </td>
    <td class="highlight">
        Best Brownies
    </td>
    <td>
        Yes
    </td>
</tr>
<tr>
    <td>
        Jun 21st, 2007
    </td>
    <td>
        Smart Cookies
    </td>
    <td>
        Yes
    </td>
</tr>
<tr>
    <td>
        Aug 1st, 2006
    </td>
    <td>
        Anti-Java Cake
    </td>
    <td id="special">
        No
    </td>
</tr>
```

``` php
echo $this->Html->tableCells(
    [
        ['Red', 'Apple'],
        ['Orange', 'Orange'],
        ['Yellow', 'Banana'],
    ],
    ['class' => 'darker']
);
```

Output:

``` html
<tr class="darker"><td>Red</td><td>Apple</td></tr>
<tr><td>Orange</td><td>Orange</td></tr>
<tr class="darker"><td>Yellow</td><td>Banana</td></tr>
```

## Changing the Tags Output by HtmlHelper

`method` Cake\\View\\Helper\\HtmlHelper::**setTemplates**(array $templates)

Load an array of templates to add/replace templates:

``` php
// Load specific templates.
$this->Html->setTemplates([
    'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
]);
```

You can load a configuration file containing templates using the templater
directly:

``` php
// Load a configuration file with templates.
$this->Html->templater()->load('my_tags');
```

When loading files of templates, your file should look like:

``` php
<?php
return [
    'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
];
```

> [!WARNING]
> Template strings containing a percentage sign (`%`) need special attention,
> you should prefix this character with another percentage so it looks like
> `%%`. The reason is that internally templates are compiled to be used with
> `sprintf()`. Example: `<div style="width:{{size}}%%">{{content}}</div>`
