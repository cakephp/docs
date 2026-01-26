# HtmlHelper

`class` **HtmlHelper**(View $view, array $settings = array())

The role of the HtmlHelper in CakePHP is to make HTML-related
options easier, faster, and more resilient to change. Using this
helper will enable your application to be more light on its feet,
and more flexible on where it is placed in relation to the root of
a domain.

Many HtmlHelper methods include a `$options` parameter,
that allow you to tack on any extra attributes on your tags. Here
are a few examples of how to use the \$options parameter:

``` html
Desired attributes: <tag class="someClass" />
Array parameter: array('class' => 'someClass')

Desired attributes: <tag name="foo" value="bar" />
Array parameter:  array('name' => 'foo', 'value' => 'bar')
```

> [!NOTE]
> The HtmlHelper is available in all views by default. If you're
> getting an error informing you that it isn't there, it's usually
> due to its name being missing from a manually configured \$helpers
> controller variable.

## Inserting Well-Formatted elements

The most important task the HtmlHelper accomplishes is creating
well formed markup. Don't be afraid to use it often - you can cache
views in CakePHP in order to save some CPU cycles when views are
being rendered and delivered. This section will cover some of the
methods of the HtmlHelper and how to use them.

`method` HtmlHelper::**charset**($charset=null)

`method` HtmlHelper::**css**(mixed $path, array $options = array())

`method` HtmlHelper::**meta**(string $type, string $url = null, array $options = array())

`method` HtmlHelper::**docType**(string $type = 'xhtml-strict')

`method` HtmlHelper::**style**(array $data, boolean $oneline = true)

`method` HtmlHelper::**image**(string $path, array $options = array())

`method` HtmlHelper::**link**(string $title, mixed $url = null, array $options = array())

`method` HtmlHelper::**media**(string|array $path, array $options)

`method` HtmlHelper::**tag**(string $tag, string $text, array $options)

`method` HtmlHelper::**div**(string $class, string $text, array $options)

`method` HtmlHelper::** para(string $class, string $text, array $options)**()

`method` HtmlHelper::**script**(mixed $url, mixed $options)

`method` HtmlHelper::** scriptBlock($code, $options = array())**()

`method` HtmlHelper::**scriptStart**($options = array())

`method` HtmlHelper::**scriptEnd**()

`method` HtmlHelper::**nestedList**(array $list, array $options = array(), array $itemOptions = array(), string $tag = 'ul')

`method` HtmlHelper::**tableHeaders**(array $names, array $trOptions = null, array $thOptions = null)

`method` HtmlHelper::**tableCells**(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

`method` HtmlHelper::**url**(mixed $url = NULL, boolean $full = false)

`method` HtmlHelper::**useTag**(string $tag)

## Changing the tags output by HtmlHelper

`method` HtmlHelper::**loadConfig**(mixed $configFile, string $path = null)

## Creating breadcrumb trails with HtmlHelper

`method` HtmlHelper::**getCrumbs**(string $separator = '&raquo;', string|array|bool $startText = false)

`method` HtmlHelper::**addCrumb**(string $name, string $link = null, mixed $options = null)

`method` HtmlHelper::**getCrumbList**(array $options = array(), mixed $startText)
