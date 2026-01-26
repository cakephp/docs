# Inflector

`class` Cake\\Utility\\**Inflector**

The Inflector class takes a string and can manipulate it to handle word
variations such as pluralization or camelizing and is normally accessed
statically. Example:
`Inflector::pluralize('example')` returns "examples".

You can try out the inflections online at [inflector.cakephp.org](https://inflector.cakephp.org/) or [sandbox.dereuromark.de](https://sandbox.dereuromark.de/sandbox/inflector).

<a id="inflector-methods-summary"></a>

## Summary of Inflector Methods and Their Output

Quick summary of the Inflector built-in methods and the results they output
when provided a multi-word argument:

<table style="width:72%;">
<colgroup>
<col style="width: 27%" />
<col style="width: 22%" />
<col style="width: 22%" />
</colgroup>
<thead>
<tr>
<th>Method</th>
<th>Argument</th>
<th>Output</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="2"><code>pluralize()</code></td>
<td>BigApple</td>
<td>BigApples</td>
</tr>
<tr>
<td>big_apple</td>
<td>big_apples</td>
</tr>
<tr>
<td rowspan="2"><code>singularize()</code></td>
<td>BigApples</td>
<td>BigApple</td>
</tr>
<tr>
<td>big_apples</td>
<td>big_apple</td>
</tr>
<tr>
<td rowspan="2"><code>camelize()</code></td>
<td>big_apples</td>
<td>BigApples</td>
</tr>
<tr>
<td>big apple</td>
<td>BigApple</td>
</tr>
<tr>
<td rowspan="2"><code>underscore()</code></td>
<td>BigApples</td>
<td>big_apples</td>
</tr>
<tr>
<td>Big Apples</td>
<td>big apples</td>
</tr>
<tr>
<td rowspan="2"><code>humanize()</code></td>
<td>big_apples</td>
<td>Big Apples</td>
</tr>
<tr>
<td>bigApple</td>
<td>BigApple</td>
</tr>
<tr>
<td rowspan="2"><code>classify()</code></td>
<td>big_apples</td>
<td>BigApple</td>
</tr>
<tr>
<td>big apple</td>
<td>BigApple</td>
</tr>
<tr>
<td rowspan="2"><code>dasherize()</code></td>
<td>BigApples</td>
<td>big-apples</td>
</tr>
<tr>
<td>big apple</td>
<td>big apple</td>
</tr>
<tr>
<td rowspan="2"><code>tableize()</code></td>
<td>BigApple</td>
<td>big_apples</td>
</tr>
<tr>
<td>Big Apple</td>
<td>big apples</td>
</tr>
<tr>
<td rowspan="2"><code>variable()</code></td>
<td>big_apple</td>
<td>bigApple</td>
</tr>
<tr>
<td>big apples</td>
<td>bigApples</td>
</tr>
</tbody>
</table>

## Creating Plural & Singular Forms

`static` Cake\\Utility\\Inflector::**singularize**($singular)

`static` Cake\\Utility\\Inflector::**pluralize**($singular)

Both `pluralize` and `singularize()` work on most English nouns. If you need
to support other languages, you can use [Inflection Configuration](#inflection-configuration) to
customize the rules used:

``` php
// Apples
echo Inflector::pluralize('Apple');
```

> [!NOTE]
> `pluralize()` should not be used on a noun that is already in its plural form.

``` php
// Person
echo Inflector::singularize('People');
```

> [!NOTE]
> `singularize()` should not be used on a noun that is already in its singular form.

## Creating CamelCase and under_scored Forms

`static` Cake\\Utility\\Inflector::**camelize**($underscored)

`static` Cake\\Utility\\Inflector::**underscore**($camelCase)

These methods are useful when creating class names, or property names:

``` php
// ApplePie
Inflector::camelize('Apple_pie')

// apple_pie
Inflector::underscore('ApplePie');
```

It should be noted that underscore will only convert camelCase formatted words.
Words that contains spaces will be lower-cased, but will not contain an
underscore.

## Creating Human Readable Forms

`static` Cake\\Utility\\Inflector::**humanize**($underscored)

This method is useful when converting underscored forms into "Title Case" forms
for human readable values:

``` php
// Apple Pie
Inflector::humanize('apple_pie');
```

## Creating Table and Class Name Forms

`static` Cake\\Utility\\Inflector::**classify**($underscored)

`static` Cake\\Utility\\Inflector::**dasherize**($dashed)

`static` Cake\\Utility\\Inflector::**tableize**($camelCase)

When generating code, or using CakePHP's conventions you may need to inflect
table names or class names:

``` php
// UserProfileSetting
Inflector::classify('user_profile_settings');

// user-profile-setting
Inflector::dasherize('UserProfileSetting');

// user_profile_settings
Inflector::tableize('UserProfileSetting');
```

## Creating Variable Names

`static` Cake\\Utility\\Inflector::**variable**($underscored)

Variable names are often useful when doing meta-programming tasks that involve
generating code or doing work based on conventions:

``` php
// applePie
Inflector::variable('apple_pie');
```

<a id="inflection-configuration"></a>

## Inflection Configuration

CakePHP's naming conventions can be really nice - you can name your database
table `big_boxes`, your model `BigBoxes`, your controller
`BigBoxesController`, and everything just works together automatically. The
way CakePHP knows how to tie things together is by *inflecting* the words
between their singular and plural forms.

There are occasions (especially for our non-English speaking friends) where you
may run into situations where CakePHP's inflector (the class that pluralizes,
singularizes, camelCases, and under_scores) might not work as you'd like. If
CakePHP won't recognize your Foci or Fish, you can tell CakePHP about your
special cases.

### Loading Custom Inflections

`static` Cake\\Utility\\Inflector::**rules**($type, $rules, $reset = false)

Define new inflection and transliteration rules for Inflector to use. Often,
this method is used in your **config/bootstrap.php**:

``` php
Inflector::rules('singular', ['/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta']);
Inflector::rules('uninflected', ['singulars']);
Inflector::rules('irregular', ['phylum' => 'phyla']); // The key is singular form, value is plural form
```

The supplied rules will be merged into the respective inflection sets defined in
`Cake/Utility/Inflector`, with the added rules taking precedence over the core
rules. You can use `Inflector::reset()` to clear rules and restore the
original Inflector state.
