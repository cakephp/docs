# Sessions

`class` **SessionComponent**(ComponentCollection $collection, array $settings = array())

The CakePHP SessionComponent provides a way to persist client data
between page requests. It acts as a wrapper for `$_SESSION` as
well as providing convenience methods for several `$_SESSION`
related functions.

Sessions can be configured in a number of ways in CakePHP. For more
information, you should see the [Session configuration](../../development/sessions)
documentation.

## Interacting with Session data

The Session component is used to interact with session information.
It includes basic CRUD functions as well as features for creating
feedback messages to users.

It should be noted that Array structures can be created in the
Session by using `dot notation`. So `User.username` would
reference the following:

``` text
array('User' => array(
    'username' => 'clark-kent@dailyplanet.com'
));
```

Dots are used to indicate nested arrays. This notation is used for
all Session component methods wherever a name/key is used.

`method` SessionComponent::**write**($name, $value)

`method` SessionComponent::**read**($name)

`method` SessionComponent::**consume**($name)

`method` SessionComponent::**check**($name)

`method` SessionComponent::**delete**($name)

`method` SessionComponent::**destroy**()

<a id="creating-notification-messages"></a>

## Creating notification messages

`method` SessionComponent::**setFlash**(string $message, string $element = 'default', array $params = array(), string $key = 'flash')
