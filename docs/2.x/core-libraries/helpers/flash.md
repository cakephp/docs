# FlashHelper

`class` **FlashHelper**(View $view, array $config = array())

::: info Added in version 2.7.0
in replacement of `SessionHelper::flash()`
:::

FlashHelper provides a way to render flash messages that were set in
`$_SESSION` by [FlashComponent](../../core-libraries/components/flash).
[FlashComponent](../../core-libraries/components/flash) and FlashHelper
primarily use elements to render flash messages. Flash elements are found under
the `app/View/Elements/Flash` directory. You'll notice that CakePHP's App
template comes with two flash elements: `success.ctp` and `error.ctp`.

The FlashHelper replaces the `flash()` method on `SessionHelper`
and should be used instead of that method.

## Rendering Flash Messages

To render a flash message, you can simply use FlashHelper's `render()`
method:

``` php
<?php echo $this->Flash->render() ?>
```

By default, CakePHP uses a "flash" key for flash messages in a session. But, if
you've specified a key when setting the flash message in
[FlashComponent](../../core-libraries/components/flash), you can specify which
flash key to render:

``` php
<?php echo $this->Flash->render('other') ?>
```

You can also override any of the options that were set in FlashComponent:

``` php
// In your Controller
$this->Flash->set('The user has been saved.', array(
    'element' => 'success'
));

// In your View: Will use great_success.ctp instead of success.ctp
<?php echo $this->Flash->render('flash', array(
    'element' => 'great_success'
));
```

> [!NOTE]
> By default, CakePHP does not escape the HTML in flash messages. If you are using
> any request or user data in your flash messages, you should escape it
> with `h` when formatting your messages.

::: info Added in version 2.10.0
[Flash](../../core-libraries/components/flash) stacks messages as of 2.10.0. If you set multiple flash messages, when you call `render()`, each message will be rendered in its own element, in the order the messages were set.
:::

For more information about the available array options, please refer to the
[FlashComponent](../../core-libraries/components/flash) section.
