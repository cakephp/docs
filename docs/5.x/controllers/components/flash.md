# Flash

`class` Cake\\Controller\\Component\\**FlashComponent**(ComponentCollection $collection, array $config = [])

FlashComponent provides a way to set one-time notification messages to be
displayed after processing a form or acknowledging data. CakePHP refers to these
messages as "flash messages". FlashComponent writes flash messages to
`$_SESSION`, to be rendered in a View using
[FlashHelper](../../views/helpers/flash).

## Setting Flash Messages

FlashComponent provides two ways to set flash messages: its `__call()` magic
method and its `set()` method. To furnish your application with verbosity,
FlashComponent's `__call()` magic method allows you use a method name that
maps to an element located under the **templates/element/flash** directory.
By convention, camelcased methods will map to the lowercased and underscored
element name:

``` php
// Uses templates/element/flash/success.php
$this->Flash->success('This was successful');

// Uses templates/element/flash/great_success.php
$this->Flash->greatSuccess('This was greatly successful');
```

Alternatively, to set a plain-text message without rendering an element, you can
use the `set()` method:

``` php
$this->Flash->set('This is a message');
```

Flash messages are appended to an array internally. Successive calls to
`set()` or `__call()` with the same key will append the messages in the
`$_SESSION`. If you want to overwrite existing messages when setting a flash
message, set the `clear` option to `true` when configuring the Component.

FlashComponent's `__call()` and `set()` methods optionally take a second
parameter, an array of options:

- `key` Defaults to 'flash'. The array key found under the `Flash` key in
  the session.
- `element` Defaults to `null`, but will automatically be set when using the
  `__call()` magic method. The element name to use for rendering.
- `params` An optional array of keys/values to make available as variables
  within an element.
- `clear` expects a `bool` and allows you to delete all messages in the
  current stack and start a new one.

An example of using these options:

``` php
// In your Controller
$this->Flash->success('The user has been saved', [
    'key' => 'positive',
    'clear' => true,
    'params' => [
        'name' => $user->name,
        'email' => $user->email,
    ],
]);

// In your View
<?= $this->Flash->render('positive') ?>

<!-- In templates/element/flash/success.php -->
<div id="flash-<?= h($key) ?>" class="message-info success">
    <?= h($message) ?>: <?= h($params['name']) ?>, <?= h($params['email']) ?>.
</div>
```

Note that the parameter `element` will be always overridden while using
`__call()`. In order to retrieve a specific element from a plugin, you should
set the `plugin` parameter. For example:

``` php
// In your Controller
$this->Flash->warning('My message', ['plugin' => 'PluginName']);
```

The code above will use the **warning.php** element under
**plugins/PluginName/templates/element/flash** for rendering the flash
message.

> [!NOTE]
> By default, CakePHP escapes the content in flash messages to prevent cross
> site scripting. User data in your flash messages will be HTML encoded and
> safe to be printed. If you want to include HTML in your flash messages, you
> need to pass the `escape` option and adjust your flash message templates
> to allow disabling escaping when the escape option is passed.

## HTML in Flash Messages

It is possible to output HTML in flash messages by using the `'escape'` option
key:

``` php
$this->Flash->info(sprintf('<b>%s</b> %s', h($highlight), h($message)), ['escape' => false]);
```

Make sure that you escape the input manually, then. In the above example
`$highlight` and `$message` are non-HTML input and therefore escaped.

For more information about rendering your flash messages, please refer to the
[FlashHelper](../../views/helpers/flash) section.
