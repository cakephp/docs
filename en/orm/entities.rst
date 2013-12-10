Entities
########

.. php:namespace:: Cake\ORM

.. php:class:: Entity

While :doc:`/orm/table-objects` represent and provide access to a collection of
objects, entities represent individual rows or domain objects in your
application. Entities contain persitent properties and methods to manipulate and
access the data they contain.

Entities are created for you by CakePHP each time you use ``find()`` on a table
object.

Creating entity classes
=======================

You don't need to create entity classes to get started with the ORM in CakePHP.
However, if you want to have custom logic in your entities you will need to
create classes. By convention entity classes live in ``App/Model/Entity/``. If
our application had an ``articles`` table we could create the following entity::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity {
    }

Right now this entity doesn't do very much. However, when we load data off our
articles table, we'll get instances of this class.

.. note::

    If you don't define an entity class the base class will be used.

Accessing entity data
=====================

Entities provide a few ways to access the data they contain. Most commonly you
will access the data in an entity using object notation::

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
accessor and mutator methods. These methods let you customize how properties are
read or set. For example::

    use Cake\ORM\Entity;

    class Article extends Entity {
        public function getTitle() {
            return ucwords($this->_properties['title']);
        }
    }

Accessor methods use the convention of ``get`` followed by the CamelCased
version of the field name. You can customize how properties get set by defining
a mutator::

    use Cake\ORM\Entity;
    use Cake\Utility\Inflector;

    class Article extends Entity {

        public function setTitle($title) {
            $this->_properties['title'] = $title;
            $this->_properties['slug'] = Inflector::slug($title);
        }

    }

Mutators allow you easily convert properties as they are set, or create
calculated data. Mutators and accessors are applied when properties are read
using object notation, or using get() and set().

Creating virtual properties
---------------------------

By defining an accessor method you can provide access to properties that do not
actually exist. For example if your users table has ``first_name`` and
``last_name`` you could create an accessor for the full name::

    use Cake\ORM\Entity;
    use Cake\Utility\Inflector;

    class User extends Entity {

        public function getFullName($title) {
            return $this->_properties['first_name'] . '  ' .
                $this->_properties['last_name'];
        }

    }

You can access virtual properties as if they existed on the entity. The property
name will be the lower case and underscored version of the accessor method::

    echo $user->full_name;

Validation errors
=================

.. php:method:: errors($field = null, $errors = null)

After you :ref:`save an entity <saving-entities>` any validation errors will be
stored on the entity itself. You can access any validation errors using the
``errors()`` method::

    // Get all the errors
    $errors = $user->errors();

    // Get the errors for a single field.
    $errors = $user->errors('password');

The ``errors()`` method can also be used to set the errors on an entity::

    $user->errors('password', ['Password is required.']);

Mass assignment
===============

.. TODO:: Waiting on code to be written for this.

.. _lazy-load-associations:

Lazy loading associations
=========================

Creating re-usable code with traits
===================================

You may find yourself needing the same logic in multiple entity classes. PHP's
traits are a great fit for this. You can put your application's traits in
``App/Model/Entity``. By convention traits in CakePHP are suffixed with
``Trait`` so they are easily discernable from classes or interfaces. Traits are
often a good compliment to behaviors, allowing you to provide functionality for
the table and entity objects.

For example if we had SoftDeletable plugin, it could provide a trait. This trait
could give methods for marking entities as 'deleted', the method ``softDelete``
could be provided by a trait::

    // SoftDelete/Model/Entity/SoftDeleteTrait.php

    namespace SoftDelete\Model\Entity;

    trait SoftDeleteTrait {

        public function softDelete() {
            $this->_properties['deleted'] = true;
        }

    }

You could then use this trait in your entity class by importing it and including
it::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use SoftDelete\Model\Entity\SoftDeleteTrait;

    class Article extends Entity {
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

Exposing virtual properties
---------------------------

By default virtual properties are not exported when converting entities to
arrays or JSON. In order to expose virtual properties you need to make them
visible. When defining your entity class you can provide a list of virtual
fields that should be exposed::

    class User extends Entity {

        protected $_virtual = ['full_name'];

    }

This list can be modified at runtime using ``virtualProperties``::

    $user->virtualProperties(['full_name', 'is_admin']);

Hiding properties
-----------------

There are often fields you do not want exported in JSON or array formats. For
example it is often unwise to expose password hashes or account recovery
questions. When defining an entity class you can hide properties::

    class User extends Entity {

        protected $_hidden = ['password'];

    }

This list can be modified at runtime using ``hiddenProperties``::

    $user->hiddenProperties(['password', 'recovery_question']);
