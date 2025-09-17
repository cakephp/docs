# Session

`class` Cake\\View\\Helper\\**SessionHelper**(View $view, array $config = [])

<div class="deprecated">

3.0.0
The SessionHelper is deprecated in 3.x. Instead you should use either the
[FlashHelper](../../views/helpers/flash) or [access the
session via the request](../../../development/sessions#accessing-session-object).

</div>

As a natural counterpart to the Session object, the Session
Helper replicates most of the object's functionality and makes it
available in your view.

The major difference between the SessionHelper and the Session
object is that the helper does *not* have the ability to write
to the session.

As with the session object, data is read by using
`dot notation` array structures:

    ['User' => [
        'username' => 'super@example.com'
    ]];

Given the previous array structure, the node would be accessed by
`User.username`, with the dot indicating the nested array. This
notation is used for all SessionHelper methods wherever a `$key` is
used.

`method` Cake\\View\\Helper\\SessionHelper::**read**(string $key)

`method` Cake\\View\\Helper\\SessionHelper::**check**(string $key)
