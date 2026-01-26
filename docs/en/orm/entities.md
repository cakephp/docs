# Entities

`class` Cake\\ORM\\**Entity**

While [Table Objects](../orm/table-objects) represent and provide access to a collection of
objects, entities represent individual rows or domain objects in your
application. Entities contain methods to manipulate and
access the data they contain. Fields can also be accessed as properties on the object.

Entities are created for you each time you iterate the query instance returned
by `find()` of a table object or when you call `all()` or `first()` method
of the query instance.

## Creating Entity Classes

You don't need to create entity classes to get started with the ORM in CakePHP.
However, if you want to have custom logic in your entities you will need to
create classes. By convention entity classes live in **src/Model/Entity/**. If
our application had an `articles` table we could create the following entity:

``` php
// src/Model/Entity/Article.php
namespace App\Model\Entity;

use Cake\ORM\Entity;

class Article extends Entity
{
}
```

Right now this entity doesn't do very much. However, when we load data from our
articles table, we'll get instances of this class.

> [!NOTE]
> If you don't define an entity class CakePHP will use the basic Entity class.

## Creating Entities

Entities can be directly instantiated:

``` php
use App\Model\Entity\Article;

$article = new Article();
```

When instantiating an entity you can pass the fields with the data you want
to store in them:

``` php
use App\Model\Entity\Article;

$article = new Article([
    'id' => 1,
    'title' => 'New Article',
    'created' => new DateTime('now')
]);
```

The preferred way of getting new entities is using the `newEmptyEntity()` method from the
`Table` objects:

``` php
use Cake\ORM\Locator\LocatorAwareTrait;

$article = $this->fetchTable('Articles')->newEmptyEntity();

$article = $this->fetchTable('Articles')->newEntity([
    'id' => 1,
    'title' => 'New Article',
    'created' => new DateTime('now')
]);
```

`$article` will be an instance of `App\Model\Entity\Article` or fallback to
`Cake\ORM\Entity` instance if you haven't created the `Article` class.

> [!NOTE]
> Prior to CakePHP 4.3 you need to use `$this->getTableLocator->get('Articles')`
> to get the table instance.

## Accessing Entity Data

Entities provide a few ways to access the data they contain. Most commonly you
will access the data in an entity using object notation:

``` php
use App\Model\Entity\Article;

$article = new Article;
$article->title = 'This is my first post';
echo $article->title;
```

You can also use the `get()` and `set()` methods.

`method` Cake\\ORM\\Entity::**set**($field, $value = null, array $options = [])

`method` Cake\\ORM\\Entity::**get**($field)

For example:

``` php
$article->set('title', 'This is my first post');
echo $article->get('title');
```

`method` Cake\\ORM\\Entity::**patch**(array $fields, array $options = [])

Using `patch()` you can mass assign multiple fields at once:

``` php
$article->patch([
    'title' => 'My first post',
    'body' => 'It is the best ever!'
]);
```

> [!NOTE]
> `patch()` is available since CakePHP 5.2.0. Prior to that you should use
> `set()` instead.

> [!WARNING]
> When updating entities with request data you should configure which fields
> can be set with mass assignment.

You can check if fields are defined in your entities with `has()`:

``` php
$article = new Article([
    'title' => 'First post',
    'user_id' => null
]);
$article->has('title'); // true
$article->has('user_id'); // true
$article->has('undefined'); // false
```

The `has()` method will return `true` if a field is defined. You can use
`hasValue()` to check if a field contains a 'non-empty' value:

``` php
$article = new Article([
    'title' => 'First post',
    'user_id' => null,
    'text' => '',
    'links' => [],
]);
$article->has('title'); // true
$article->hasValue('title'); // true

$article->has('user_id'); // true
$article->hasValue('user_id'); // false

$article->has('text'); // true
$article->hasValue('text'); // false

$article->has('links'); // true
$article->hasValue('links'); // false
```

If you often partially load entities you should enable strict-property access
behavior to ensure you're not using properties that haven't been loaded. On
a per-entity basis you can enable this behavior:

``` php
$article->requireFieldPresence();
```

Once enabled, accessing properties that are not defined will raise
a `Cake\ORM\MissingPropertyException`.

## Accessors & Mutators

In addition to the simple get/set interface, entities allow you to provide
accessors and mutator methods. These methods let you customize how fields
are read or set.

### Accessors

Accessors let you customize how fields are read. They use the convention of
`_get(FieldName)` with `(FieldName)` being the CamelCased version (multiple
words are joined together to a single word with the first letter of each word
capitalized) of the field name.

They receive the basic value stored in the `_fields` array as their only
argument. For example:

``` php
namespace App\Model\Entity;

use Cake\ORM\Entity;

class Article extends Entity
{
    protected function _getTitle($title)
    {
        return strtoupper($title);
    }
}
```

The example above converts the value of the `title` field to an uppercase
version each time it is read. It would be run when getting the field through any
of these two ways:

``` php
echo $article->title; // returns FOO instead of foo
echo $article->get('title'); // returns FOO instead of foo
```

> [!NOTE]
> Code in your accessors is executed each time you reference the field. You can
> use a local variable to cache it if you are performing a resource-intensive
> operation in your accessor like this: <span class="title-ref">\$myEntityProp = \$entity-\>my_property</span>.

> [!WARNING]
> Accessors will be used when saving entities, so be careful when defining methods
> that format data, as the formatted data will be persisted.

### Mutators

You can customize how fields get set by defining a mutator. They use the
convention of `_set(FieldName)` with `(FieldName)` being the CamelCased version
of the field name.

Mutators should always return the value that should be stored in the field.
You can also use mutators to set other fields. When doing this,
be careful to not introduce any loops, as CakePHP will not prevent infinitely
looping mutator methods. For example:

``` php
namespace App\Model\Entity;

use Cake\ORM\Entity;
use Cake\Utility\Text;

class Article extends Entity
{
    protected function _setTitle($title)
    {
        $this->slug = Text::slug($title);

        return strtoupper($title);
    }
}
```

The example above is doing two things: It stores a modified version of the
given value in the `slug` field and stores an uppercase version in the
`title` field. It would be run when setting the field through
any of these two ways:

``` php
$user->title = 'foo'; // sets slug field and stores FOO instead of foo
$user->set('title', 'foo'); // sets slug field and stores FOO instead of foo
```

> [!WARNING]
> Accessors are also run before entities are persisted to the database.
> If you want to transform fields but not persist that transformation,
> we recommend using virtual fields as those are not persisted.

<a id="entities-virtual-fields"></a>

### Creating Virtual Fields

By defining accessors you can provide access to fields that do not
actually exist. For example if your users table has `first_name` and
`last_name` you could create a method for the full name:

``` php
namespace App\Model\Entity;

use Cake\ORM\Entity;

class User extends Entity
{
    protected function _getFullName()
    {
        return $this->first_name . '  ' . $this->last_name;
    }
}
```

You can access virtual fields as if they existed on the entity. The property
name will be the lower case and underscored version of the method (`full_name`):

``` php
echo $user->full_name;
echo $user->get('full_name');
```

Do bear in mind that virtual fields cannot be used in finds. If you want
them to be part of JSON or array representations of your entities,
see [Exposing Virtual Fields](#exposing-virtual-fields).

## Checking if an Entity Has Been Modified

`method` Cake\\ORM\\Entity::**dirty**($field = null, $dirty = null)

You may want to make code conditional based on whether or not fields have
changed in an entity. For example, you may only want to validate fields when
they change:

``` php
// See if the title has been modified.
$article->isDirty('title');
```

You can also flag fields as being modified. This is handy when appending into
array fields as this wouldn't automatically mark the field as dirty, only
exchanging completely would.:

``` php
// Add a comment and mark the field as changed.
$article->comments[] = $newComment;
$article->setDirty('comments', true);
```

In addition you can also base your conditional code on the original field
values by using the `getOriginal()` method. This method will either return
the original value of the field if it has been modified or its actual value.

You can also check for changes to any field in the entity:

``` php
// See if the entity has changed
$article->isDirty();
```

To remove the dirty mark from fields in an entity, you can use the `clean()`
method:

``` php
$article->clean();
```

When creating a new entity, you can avoid the fields from being marked as dirty
by passing an extra option:

``` php
$article = new Article(['title' => 'New Article'], ['markClean' => true]);
```

To get a list of all dirty fields of an `Entity` you may call:

``` php
$dirtyFields = $entity->getDirty();
```

## Validation Errors

After you [save an entity](../orm/saving-data#saving-entities) any validation errors will be
stored on the entity itself. You can access any validation errors using the
`getErrors()`, `getError()` or `hasErrors()` methods:

``` php
// Get all the errors
$errors = $user->getErrors();

// Get the errors for a single field.
$errors = $user->getError('password');

// Does the entity or any nested entity have an error.
$user->hasErrors();

// Does only the root entity have an error
$user->hasErrors(false);
```

The `setErrors()` or `setError()` method can also be used to set the errors
on an entity, making it easier to test code that works with error messages:

``` php
$user->setError('password', ['Password is required']);
$user->setErrors([
    'password' => ['Password is required'],
    'username' => ['Username is required']
]);
```

<a id="entities-mass-assignment"></a>

## Mass Assignment

While setting fields to entities in bulk is simple and convenient, it can
create significant security issues. Bulk assigning user data from the request
into an entity allows the user to modify any and all columns. When using
anonymous entity classes or creating the entity class with the [Bake Console](../bake)
CakePHP does not protect against mass-assignment.

The `patchable` property allows you to provide a map of fields and
whether or not they can be mass-assigned. The values `true` and `false`
indicate whether a field can or cannot be mass-assigned:

``` php
namespace App\Model\Entity;

use Cake\ORM\Entity;

class Article extends Entity
{
    protected array $patchable = [
        'title' => true,
        'body' => true
    ];
}
```

In addition to concrete fields there is a special `*` field which defines the
fallback behavior if a field is not specifically named:

``` php
namespace App\Model\Entity;

use Cake\ORM\Entity;

class Article extends Entity
{
    protected array $patchable = [
        'title' => true,
        'body' => true,
        '*' => false,
    ];
}
```

> [!NOTE]
> If the `*` field is not defined it will default to `false`.

### Avoiding Mass Assignment Protection

When creating a new entity using the `new` keyword you can tell it to not
protect itself against mass assignment:

``` php
use App\Model\Entity\Article;

$article = new Article(['id' => 1, 'title' => 'Foo'], ['guard' => false]);
```

### Modifying the Guarded Fields at Runtime

You can modify the list of guarded fields at runtime using the `setPatchable()`
method:

``` php
// Make user_id accessible.
$article->setPatchable('user_id', true);

// Make title guarded.
$article->setPatchable('title', false);
```

> [!NOTE]
> Modifying accessible fields affects only the instance the method is called
> on.

When using the `newEntity()` and `patchEntity()` methods in the `Table`
objects you can customize mass assignment protection with options. Please refer
to the [Changing Accessible Fields](../orm/saving-data#changing-accessible-fields) section for more information.

### Bypassing Field Guarding

There are some situations when you want to allow mass-assignment to guarded
fields:

``` php
$article->patch($fields, ['guard' => false]);
```

By setting the `guard` option to `false`, you can ignore the accessible
field list for a single call to `patch()`.

### Checking if an Entity was Persisted

It is often necessary to know if an entity represents a row that is already
in the database. In those situations use the `isNew()` method:

``` php
if (!$article->isNew()) {
    echo 'This article was saved already!';
}
```

If you are certain that an entity has already been persisted, you can use
`setNew()`:

``` php
$article->setNew(false);

$article->setNew(true);
```

<a id="lazy-load-associations"></a>

## Lazy Loading Associations

While eager loading associations is generally the most efficient way to access
your associations, there may be times when you need to lazily load associated
data. Before we get into how to lazy load associations, we should discuss the
differences between eager loading and lazy loading associations:

Eager loading  
Eager loading uses joins (where possible) to fetch data from the
database in as *few* queries as possible. When a separate query is required,
like in the case of a HasMany association, a single query is emitted to
fetch *all* the associated data for the current set of objects.

Lazy loading  
Lazy loading defers loading association data until it is absolutely
required. While this can save CPU time because possibly unused data is not
hydrated into objects, it can result in many more queries being emitted to
the database. For example looping over a set of articles & their comments
will frequently emit N queries where N is the number of articles being
iterated.

While lazy loading is not included by CakePHP's ORM, you can just use one of the
community plugins to do so. We recommend [the LazyLoad Plugin](https://github.com/jeremyharris/cakephp-lazyload)

After adding the plugin to your entity, you will be able to do the following:

``` php
$article = $this->Articles->findById($id);

// The comments property was lazy loaded
foreach ($article->comments as $comment) {
    echo $comment->body;
}
```

## Creating Re-usable Code with Traits

You may find yourself needing the same logic in multiple entity classes. PHP's
traits are a great fit for this. You can put your application's traits in
**src/Model/Entity**. By convention traits in CakePHP are suffixed with
`Trait` so they can be discernible from classes or interfaces. Traits are
often a good complement to behaviors, allowing you to provide functionality for
the table and entity objects.

For example if we had SoftDeletable plugin, it could provide a trait. This trait
could give methods for marking entities as 'deleted', the method `softDelete`
could be provided by a trait:

``` php
// SoftDelete/Model/Entity/SoftDeleteTrait.php

namespace SoftDelete\Model\Entity;

trait SoftDeleteTrait
{
    public function softDelete()
    {
        $this->set('deleted', true);
    }
}
```

You could then use this trait in your entity class by importing it and including
it:

``` php
namespace App\Model\Entity;

use Cake\ORM\Entity;
use SoftDelete\Model\Entity\SoftDeleteTrait;

class Article extends Entity
{
    use SoftDeleteTrait;
}
```

## Converting to Arrays/JSON

When building APIs, you may often need to convert entities into arrays or JSON
data. CakePHP makes this simple:

``` php
// Get an array.
// Associations will be converted with toArray() as well.
$array = $user->toArray();

// Convert to JSON
// Associations will be converted with jsonSerialize hook as well.
$json = json_encode($user);
```

When converting an entity to an JSON, the virtual & hidden field lists are
applied. Entities are recursively converted to JSON as well. This means that if you
eager loaded entities and their associations CakePHP will correctly handle
converting the associated data into the correct format.

<a id="exposing-virtual-fields"></a>

### Exposing Virtual Fields

By default virtual fields are not exported when converting entities to
arrays or JSON. In order to expose virtual fields you need to make them
visible. When defining your entity class you can provide a list of virtual
field that should be exposed:

``` php
namespace App\Model\Entity;

use Cake\ORM\Entity;

class User extends Entity
{
    protected array $_virtual = ['full_name'];
}
```

This list can be modified at runtime using the `setVirtual()` method:

``` php
$user->setVirtual(['full_name', 'is_admin']);
```

### Hiding Fields

There are often fields you do not want exported in JSON or array formats. For
example it is often unwise to expose password hashes or account recovery
questions. When defining an entity class, define which fields should be
hidden:

``` php
namespace App\Model\Entity;

use Cake\ORM\Entity;

class User extends Entity
{
    protected $_hidden = ['password'];
}
```

This list can be modified at runtime using the `setHidden()` method:

``` php
$user->setHidden(['password', 'recovery_question']);
```

## Storing Complex Types

Accessor & Mutator methods on entities are not intended to contain the logic for
serializing and unserializing complex data coming from the database. Refer to
the [Saving Complex Types](../orm/saving-data#saving-complex-types) section to understand how your application can
store more complex data types like arrays and objects.
