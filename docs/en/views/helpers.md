# Helpers

Helpers are the component-like classes for the presentation layer of your
application. They contain presentational logic that is shared between many
views, elements, or layouts. This chapter will show you how to configure
helpers. How to load helpers and use those helpers, and outline the simple steps
for creating your own custom helpers.

CakePHP includes a number of helpers that aid in view creation. They assist in
creating well-formed markup (including forms), aid in formatting text, times and
numbers, and can even speed up AJAX functionality. For more information on the
helpers included in CakePHP, check out the chapter for each helper:

- [Breadcrumbs](../views/helpers/breadcrumbs)
- [Flash](../views/helpers/flash)
- [Form](../views/helpers/form)
- [Html](../views/helpers/html)
- [Number](../views/helpers/number)
- [Paginator](../views/helpers/paginator)
- [Text](../views/helpers/text)
- [Time](../views/helpers/time)
- [Url](../views/helpers/url)

<a id="configuring-helpers"></a>

## Configuring Helpers

You configure helpers in CakePHP by declaring them in a view class. An `AppView`
class comes with every CakePHP application and is the ideal place to add
helpers for global use:

``` php
class AppView extends View
{
    public function initialize(): void
    {
        parent::initialize();
        $this->addHelper('Html');
        $this->addHelper('Form');
        $this->addHelper('Flash');
    }
}
```

To add helpers from plugins use the `plugin syntax` used elsewhere in
CakePHP:

``` php
$this->addHelper('Blog.Comment');
```

You don't have to explicitly add Helpers that come from CakePHP or your
application. These helpers can be lazily loaded upon first use. For example:

``` php
// Loads the FormHelper if it has not already been explicitly added/loaded.
$this->Form->create($article);
```

From within a plugin's views, plugin helpers can also be lazily loaded. For
example, view templates in the 'Blog' plugin, can lazily load helpers from the
same plugin.

### Conditionally Loading Helpers

You can use the current action name to conditionally add helpers:

``` php
class AppView extends View
{
    public function initialize(): void
    {
        parent::initialize();
        if ($this->request->getParam('action') === 'index') {
            $this->addHelper('ListPage');
        }
    }
}
```

You can also use your controller's `beforeRender` method to add helpers:

``` php
class ArticlesController extends AppController
{
    public function beforeRender(EventInterface $event): void
    {
        parent::beforeRender($event);
        $this->viewBuilder()->addHelper('MyHelper');
    }
}
```

### Configuration options

You can pass configuration options to helpers. These options can be used to set
attribute values or modify the behavior of a helper:

``` php
namespace App\View\Helper;

use Cake\View\Helper;
use Cake\View\View;

class AwesomeHelper extends Helper
{
    public function initialize(array $config): void
    {
        debug($config);
    }
}
```

By default all configuration options will be merged with the `$_defaultConfig`
property. This property should define the default values of any configuration
your helper requires. For example:

``` php
namespace App\View\Helper;

use Cake\View\Helper;
use Cake\View\StringTemplateTrait;

class AwesomeHelper extends Helper
{
    use StringTemplateTrait;

    /**
     * @var array<string, mixed>
     */
    protected array $_defaultConfig = [
        'templates' => [
            'label' => '<label for="{{for}}">{{content}}</label>',
        ],
    ];
}
```

Any configuration provided to your helper's constructor will be merged with the
default values during construction and the merged data will be set to
`_config`. You can use the `getConfig()` method to read runtime configuration:

``` php
// Read the autoSetCustomValidity config option.
$class = $this->Awesome->getConfig('autoSetCustomValidity');
```

Using helper configuration allows you to declaratively configure your helpers and
keep configuration logic out of your controller actions. If you have
configuration options that cannot be included as part of a class declaration,
you can set those in your controller's beforeRender callback:

``` php
class PostsController extends AppController
{
    public function beforeRender(EventInterface $event): void
    {
        parent::beforeRender($event);
        $builder = $this->viewBuilder();
        $builder->helpers([
            'CustomStuff' => $this->_getCustomStuffConfig(),
        ]);
    }
}
```

<a id="aliasing-helpers"></a>

### Aliasing Helpers

One common setting to use is the `className` option, which allows you to
create aliased helpers in your views. This feature is useful when you want to
replace `$this->Html` or another common Helper reference with a custom
implementation:

``` php
// src/View/AppView.php
class AppView extends View
{
    public function initialize(): void
    {
        $this->addHelper('Html', [
            'className' => 'MyHtml',
        ]);
    }
}

// src/View/Helper/MyHtmlHelper.php
namespace App\View\Helper;

use Cake\View\Helper\HtmlHelper;

class MyHtmlHelper extends HtmlHelper
{
    // Add your code to override the core HtmlHelper
}
```

The above would *alias* `MyHtmlHelper` to `$this->Html` in your views.

> [!NOTE]
> Aliasing a helper replaces that instance anywhere that helper is used,
> including inside other Helpers.

## Using Helpers

Once you've configured which helpers you want to use in your controller,
each helper is exposed as a public property in the view. For example, if you
were using the `HtmlHelper` you would be able to access it by
doing the following:

``` php
echo $this->Html->css('styles');
```

The above would call the `css()` method on the HtmlHelper. You can
access any loaded helper using `$this->{$helperName}`.

### Loading Helpers On The Fly

There may be situations where you need to dynamically load a helper from inside
a view. You can use the view's `Cake\View\HelperRegistry` to
do this:

``` php
// Either one works.
$mediaHelper = $this->loadHelper('Media', $mediaConfig);
$mediaHelper = $this->helpers()->load('Media', $mediaConfig);
```

The HelperRegistry is a [registry](../core-libraries/registry-objects) and
supports the registry API used elsewhere in CakePHP.

## Callback Methods

Helpers feature several callbacks that allow you to augment the view rendering
process. See the [Helper Api](#helper-api) and the
[Events System](../core-libraries/events) documentation for more information.

## Creating Helpers

You can create custom helper classes for use in your application or plugins.
Like most components of CakePHP, helper classes have a few conventions:

- Helper class files should be put in **src/View/Helper**. For example:
  **src/View/Helper/LinkHelper.php**
- Helper classes should be suffixed with `Helper`. For example: `LinkHelper`.
- When referencing helper names you should omit the `Helper` suffix. For
  example: `$this->addHelper('Link');` or `$this->loadHelper('Link');`.

You'll also want to extend `Helper` to ensure things work correctly:

``` php
/* src/View/Helper/LinkHelper.php */
namespace App\View\Helper;

use Cake\View\Helper;

class LinkHelper extends Helper
{
    public function makeEdit($title, $url)
    {
        // Logic to create specially formatted link goes here...
    }
}
```

### Including Other Helpers

You may wish to use some functionality already existing in another helper. To do
so, you can specify helpers you wish to use with a `$helpers` array, formatted
just as you would in a controller:

``` php
/* src/View/Helper/LinkHelper.php (using other helpers) */

namespace App\View\Helper;

use Cake\View\Helper;

class LinkHelper extends Helper
{
    protected array $helpers = ['Html'];

    public function makeEdit($title, $url)
    {
        // Use the HTML helper to output
        // Formatted data:

        $link = $this->Html->link($title, $url, ['class' => 'edit']);

        return '<div class="editOuter">' . $link . '</div>';
    }
}
```

<a id="using-helpers"></a>

### Using Your Helper

Once you've created your helper and placed it in **src/View/Helper/**, you can
load it in your views:

``` php
class AppView extends View
{
    public function initialize(): void
    {
        parent::initialize();
        $this->addHelper('Link');
    }
}
```

Once your helper has been loaded, you can use it in your views by accessing the
matching view property:

``` php
<!-- make a link using the new helper -->
<?= $this->Link->makeEdit('Change this Recipe', '/recipes/edit/5') ?>
```

> [!NOTE]
> The `HelperRegistry` will attempt to lazy load any helpers not
> specifically identified in your `Controller`.

### Accessing View Variables Inside Your Helper

If you would like to access a View variable inside a helper, you can use
`$this->getView()->get()` like:

``` php
class AwesomeHelper extends Helper
{
    public array $helpers = ['Html'];

    public function someMethod()
    {
        // set meta description
        return $this->Html->meta(
            'description', $this->getView()->get('metaDescription'), ['block' => 'meta']
        );
    }
}
```

### Rendering A View Element Inside Your Helper

If you would like to render an Element inside your Helper you can use
`$this->getView()->element()` like:

``` php
class AwesomeHelper extends Helper
{
    public function someFunction()
    {
        return $this->getView()->element(
            '/path/to/element',
            ['foo'=>'bar','bar'=>'foo']
        );
    }
}
```

<a id="helper-api"></a>

## Helper Class

`class` **Helper**

### Callbacks

By implementing a callback method in a helper, CakePHP will automatically
subscribe your helper to the relevant event. Unlike previous versions of CakePHP
you should *not* call `parent` in your callbacks, as the base Helper class
does not implement any of the callback methods.

`method` Helper::**beforeRenderFile**(EventInterface $event, $viewFile)

`method` Helper::**afterRenderFile**(EventInterface $event, $viewFile, $content)

`method` Helper::**beforeRender**(EventInterface $event, $viewFile)

`method` Helper::**afterRender**(EventInterface $event, $viewFile)

`method` Helper::**beforeLayout**(EventInterface $event, $layoutFile)

`method` Helper::**afterLayout**(EventInterface $event, $layoutFile)
