# SessionHelper

`class` **SessionHelper**(View $view, array $settings = array())

As a natural counterpart to the Session Component, the Session
Helper replicates most of the component's functionality and makes it
available in your view.

The major difference between the Session Helper and the Session
Component is that the helper does *not* have the ability to write
to the session.

As with the Session Component, data is read by using
`dot notation` array structures:

``` text
array('User' => array(
    'username' => 'super@example.com'
));
```

Given the previous array structure, the node would be accessed by
`User.username`, with the dot indicating the nested array. This
notation is used for all Session helper methods wherever a `$key` is
used.

`method` SessionHelper::**read**(string $key)

`method` SessionHelper::**consume**($name)

`method` SessionHelper::**check**(string $key)

`method` SessionHelper::**error**()

`method` SessionHelper::**valid**()

## Displaying notifications or flash messages

`method` SessionHelper::**flash**(string $key = 'flash', array $params = array())
