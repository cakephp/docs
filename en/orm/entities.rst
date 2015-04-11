Entities
########

.. php:namespace:: Cake\ORM

.. php:class:: Entity

While :doc:`/orm/table-objects` represent and provide access to a collection of
objects, entities represent individual rows or domain objects in your
application. Entities contain persistent properties and methods to manipulate and
access the data they contain.

Entities are created for you by CakePHP each time you use ``find()`` on a table
object.

Creating Entity Classes
=======================

You don't need to create entity classes to get started with the ORM in CakePHP.
However, if you want to have custom logic in your entities you will need to
create classes. By convention entity classes live in **src/Model/Entity/**. If
our application had an ``articles`` table we could create the following entity::

    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
    }

Right now this entity doesn't do very much. However, when we load data from our
articles table, we'll get instances of this class.

.. note::

    If you don't define an entity class CakePHP will use the basic Entity class.

Creating Entities
=================

Entities can be directly instantiated::

    use App\Model\Entity\Article;

    $article = new Article();

When instantiating an entity you can pass the properties with the data you want
to store in them::

    use App\Model\Entity\Article;

    $article = new Article([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

Another way of getting new entities is using the ``newEntity()`` method from the
``Table`` objects::

    use Cake\ORM\TableRegistry;

    $article = TableRegistry::get('Articles')->newEntity();
    $article = TableRegistry::get('Articles')->newEntity([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

Accessing Entity Data
=====================

Entities provide a few ways to access the data they contain. Most commonly you
will access the data in an entity using object notation::

    use App\Model\Entity\Article;

    $article = new Article;
    $article->title = 'This is my first post';
    echo $article->title;

You can also use the ``get()`` and ``set()`` methods::

    $article->set('title', 'This is my first post');
    echo $article->get('title');

When using ``set()`` you can update multiple properties at once using an array::

    $article->set([
        'title' => 'My first post',
        'body' => 'It is the best ever!'
    ]);

.. warning::

    When updating entities with request data you should whitelist which fields
    can be set with mass assignment.

Accessors & Mutators
====================

.. php:method:: set($field = null, $value = null)

In addition to the simple get/set interface, entities allow you to provide
accessors and mutator methods. These methods let you customize how properties
are read or set. For example::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected function _getTitle($title)
        {
            return ucwords($title);
        }
    }

Accessors use the convention of ``_get`` followed by the CamelCased version of
the field name. They receive the basic value stored in the ``_properties`` array
as their only argument. You can customize how properties get set by defining
a mutator::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Utility\Inflector;

    class Article extends Entity
    {

        protected function _setTitle($title)
        {
            $this->set('slug', Inflector::slug($title));
            return $title;
        }

    }

Mutator methods should always return the value that should be stored in the
property. As you can see above, you can also use mutators to set other
calculated properties. When doing this, be careful to not introduce any loops,
as CakePHP will not prevent infinitely looping mutator methods. Mutators allow
you easily convert properties as they are set, or create calculated data.
Mutators and accessors are applied when properties are read using object
notation, or using get() and set().

Creating Virtual Properties
---------------------------

By defining accessors you can provide access to properties that do not
actually exist. For example if your users table has ``first_name`` and
``last_name`` you could create a method for the full name::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected function _getFullName()
        {
            return $this->_properties['first_name'] . '  ' .
                $this->_properties['last_name'];
        }

    }

You can access virtual properties as if they existed on the entity. The property
name will be the lower case and underscored version of the method::

    echo $user->full_name;

Do bear in mind that virtual properties cannot be used in finds.


Checking if an Entity Has Been Modified
========================================

.. php:method:: dirty($field = null, $dirty = null)

You may want to make code conditional based on whether or not properties have
changed in an entity. For example, may only want to validate fields when they
change::

    // See if the title has been modified.
    $article->dirty('title');

You can also flag fields as being modified. This is handy when appending into
array properties::

    // Add a comment and mark the field as changed.
    $article->comments[] = $newComment;
    $article->dirty('comments', true);

In addition you can also base you conditional code on the original properties values
by using the ``getOriginal()`` method. This method will either return the original
value of the property if it has been modified or its actual value.

You can also check for changes to any property in the entity::

    // See if the entity has changed
    $article->dirty();

To remove the dirty mark from fields in an entity, you can use the ``clean()``
method::

    $article->clean();

When creating a new entity, you can avoid the fields from being marked as dirty
by passing an extra option::

    $article = new Article(['title' => 'New Article'], ['markClean' => true]);

Validation Errors
=================

.. php:method:: errors($field = null, $errors = null)

After you :ref:`save an entity <saving-entities>` any validation errors will be
stored on the entity itself. You can access any validation errors using the
``errors()`` method::

    // Get all the errors
    $errors = $user->errors();

    // Get the errors for a single field.
    $errors = $user->errors('password');

The ``errors()`` method can also be used to set the errors on an entity, making
it easier to test code that works with error messages::

    $user->errors('password', ['Password is required.']);

.. _entities-mass-assignment:

Mass Assignment
===============

While setting properties to entities in bulk is simple and convenient, it can
create significant security issues. Bulk assigning user data from the request
into an entity allows the user to modify any and all columns. When using
anonymous entity classes CakePHP does not protect against mass-assignment. You
can easily protect against mass-assignment by using :doc:`/bake` to generate your
entities.

The ``_accessible`` property allows you to provide a map of properties and
whether or not they can be mass-assigned. The values ``true`` and ``false``
indicate whether a field can or cannot be mass-assigned::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            'title' => true,
            'body' => true,
        ];
    }

In addition to concrete fields there is a special ``*`` field which defines the
fallback behavior if a field is not specifically named::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            'title' => true,
            'body' => true,
            '*' => false,
        ];
    }

If the ``*`` property is not defined it will default to ``false``.

Avoiding Mass Assignment Protection
-----------------------------------

When creating a new entity using the ``new`` keyword you can tell it to not
protect itself against mass assignment::

    use App\Model\Entity\Article;

    $article = new Article(['id' => 1, 'title' => 'Foo'], ['guard' => false]);

Modifying the Guarded Fields at Runtime
---------------------------------------

You can modify the list of guarded fields at runtime using the ``accessible``
method::

    // Make user_id accessible.
    $article->accessible('user_id', true);

    // Make title guarded.
    $article->accessible('title', false);

.. note::

    Modifying accessible fields effects only the instance the method is called
    on.

When using the ``newEntity()`` and ``patchEntity()`` methods in the ``Table``
objects you also have control over the mass assignment protection. Please refer
to the :ref:`changing-accessible-fields` section for more information.

Bypassing Field Guarding
------------------------

There are sometimes situations when you want to allow mass-assignment to guarded
fields::

    $article->set($properties, ['guard' => false]);

By setting the ``guard`` option to ``false``, you can ignore the accessible field
list for a single call to ``set()``.


Checking In An Entity Was Persisted
-----------------------------------

It is often needed to know if an entity represents a row that is already
present in the database. For those cases use the ``isNew()`` method::

    if (!$aricle->isNew()) {
        echo 'This article was saved already!';
    }

If you are certain that an entity was already persisted in database, you can
change at runtime the return value of ``isNew()``::

    $article->isNew(false);

    $article->isNew(true);

.. _lazy-load-associations:

Lazy Loading Associations
=========================

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

While lazy loading is not included by CakePHP's ORM, it is not hard to implement
it yourself when and where you need it. When implementing an accessor method you
can lazily load associated data::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\ORM\TableRegistry;

    class Article extends Entity
    {

        protected function _getComments()
        {
            $comments = TableRegistry::get('Comments');
            return $comments->find('all')
                ->where(['article_id' => $this->id])
                ->all();
        }

    }

Implementing the above method will enable you to do the following::

    $article = $this->Articles->findById($id);
    foreach ($article->comments as $comment) {
        echo $comment->body;
    }

Creating Re-usable Code with Traits
===================================

You may find yourself needing the same logic in multiple entity classes. PHP's
traits are a great fit for this. You can put your application's traits in
**src/Model/Entity**. By convention traits in CakePHP are suffixed with
``Trait`` so they are easily discernible from classes or interfaces. Traits are
often a good compliment to behaviors, allowing you to provide functionality for
the table and entity objects.

For example if we had SoftDeletable plugin, it could provide a trait. This trait
could give methods for marking entities as 'deleted', the method ``softDelete``
could be provided by a trait::

    // SoftDelete/Model/Entity/SoftDeleteTrait.php

    namespace SoftDelete\Model\Entity;

    trait SoftDeleteTrait {

        public function softDelete()
        {
            $this->set('deleted', true);
        }

    }

You could then use this trait in your entity class by importing it and including
it::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use SoftDelete\Model\Entity\SoftDeleteTrait;

    class Article extends Entity
    {
        use SoftDeleteTrait;
    }

Converting to Arrays/JSON
=========================

When building APIs, you may often need to convert entities into arrays or JSON
data. CakePHP makes this simple::

    // Get an array.
    $array = $user->toArray();

    // Convert to JSON
    $json = json_encode($user);

When converting an entity to an array/JSON the virtual & hidden field lists are
applied. Entities are converted recursively as well. This means that if you
eager loaded entities and their associations CakePHP will correctly handle
converting the associated data into the correct format.

Exposing Virtual Properties
---------------------------

By default virtual properties are not exported when converting entities to
arrays or JSON. In order to expose virtual properties you need to make them
visible. When defining your entity class you can provide a list of virtual
fields that should be exposed::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected $_virtual = ['full_name'];

    }

This list can be modified at runtime using ``virtualProperties``::

    $user->virtualProperties(['full_name', 'is_admin']);

Hiding Properties
-----------------

There are often fields you do not want exported in JSON or array formats. For
example it is often unwise to expose password hashes or account recovery
questions. When defining an entity class, define which properties should be
hidden::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected $_hidden = ['password'];

    }

This list can be modified at runtime using ``hiddenProperties``::

    $user->hiddenProperties(['password', 'recovery_question']);

Storing Complex Types
=====================

Entities are not intended to contain the logic for serializing and
unserializing complex data coming from the database. Refer to the
:ref:`saving-complex-types` section to understand how your application can store
more complex data types like arrays and objects.
