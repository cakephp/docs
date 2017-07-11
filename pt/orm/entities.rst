Entities (Entidades)
####################

.. php:namespace:: Cake\ORM

.. php:class:: Entity

Enquanto :doc:`/orm/table-objects` representam e fornecem acesso a uma coleção
de objetos, entidades representam linhas individuais ou objetos de domínio na
sua aplicação. Entidades contêm propriedades persistentes e métodos para
manipular e acessar os dados que elas contêm.

Entidades são criadas para você pelo CakePHP cada vez que utilizar o ``find()`` em um
objeto de Table.

Criando Classes de Entidade
============================

Você não precisa criar classes de entidade para iniciar com o ORM no CakePHP.
No entanto, se você deseja ter lógica personalizada nas suas entidades, você
precisará criar classes. Por convensão, classes de entidades ficam em 
**src/Model/Entity/**. Se a nossa aplicação tem um tabela ``articles``, poderiamos
criar a seguinte entidade::

    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
    }

Neste momento, essa entidade não faz muita coisa. No entanto, quando carregarmos dados
da nossa tabela articles, obteremos instâncias dessa classe.

.. note::

    Se você não definir uma classe de entitdade o CakePHP usará a classe Entity básica.

Criando Entidade
=================

Entidades podem ser instanciadas diretamente::

    use App\Model\Entity\Article;

    $article = new Article();

Ao instanciar uma entidade, você pode passar as propriedades com os dados que deseja
armazenar nelas::

    use App\Model\Entity\Article;

    $article = new Article([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

Outro maneira de obter novas entidades é usando o método ``newEntity()`` dos objetos
``Table``::

    use Cake\ORM\TableRegistry;

    $article = TableRegistry::get('Articles')->newEntity();
    $article = TableRegistry::get('Articles')->newEntity([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

Acessando Dados de Entidade
===========================

Entidades fornecem algumas maneiras de acessar os dados que contêm. Normalmente, você
acessará os dados de uma entidade usando notação de objeto (object notation)::

    use App\Model\Entity\Article;

    $article = new Article;
    $article->title = 'This is my first post';
    echo $article->title;

Você também pode usar os métodos ``get()`` e ``set()``::

    $article->set('title', 'This is my first post');
    echo $article->get('title');

Ao usar ``set()``, você pode atualizar várias propriedades ao mesmo tempo usando
um array::

    $article->set([
        'title' => 'My first post',
        'body' => 'It is the best ever!'
    ]);

.. warning::
    
    Ao atualizar entidades com dados de requisição, você deve especificar com
    whitelist quais campos podem ser definidos com atribuição de massa.

Accessors & Mutators
====================

Além da simples interface get/set, as entidades permitem que você forneça
métodos acessadores e mutadores. Esses métodos deixam você personalizar
como as propriedades são lidas ou definidas.

Acessadores usam a convenção de ``_get`` seguido da versão CamelCased do nome
do campo.

.. php:method:: get($field)

Eles recebem o valor básico armazenado no array ``_properties`` como seu
único argumento. Acessadores serão usadas ao salvar entidades, então seja
cuidadoso ao definir métodos que formatam dados, já que os dados formatados
serão persistido. Por exemplo::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected function _getTitle($title)
        {
            return ucwords($title);
        }
    }

O acessador seria executado ao obter a propriedade através de qualquer uma dessas
duas formas::

    echo $user->title;
    echo $user->get('title');

Você pode personalizar como as propriedades são atribuidas definindo um mutador: 

.. php:method:: set($field = null, $value = null)

Os métodos mutadores sempre devem retornar o valor que deve ser armazenado na
propriedade. Como você pode ver acima, você também pode usar mutadores para
atribuir outras propriedades calculadas. Ao fazer isso, seja cuidadoso para não
introduzir nenhum loos, já que o CakePHP não impedirá os métodos mutadores de
looping infinitos.

Os mutadores permitem você converter as propriedades conforme são atribuidas, ou
criar dados calculados. Os mutadores e acessores são aplicados quando as
propriedades são lidas usando notação de objeto (object notation), ou usando os
métodos ``get()`` e ``set()``. Por exemplo::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Utility\Text;

    class Article extends Entity
    {

        protected function _setTitle($title)
        {
            return Text::slug($title);
        }

    }

O mutador seria executado ao atribuir a propriedade através de qualquer uma
dessas duas formas::

    $user->title = 'foo'; // slug is set as well
    $user->set('title', 'foo'); // slug is set as well

.. _entities-virtual-properties:

Criando Propriedades Virtuais
-----------------------------

Ao definir acessadores, você pode fornecer acesso aos campos/propriedades que
não existem. Por exemplo, se sua tabela users tem ``first_name`` e
``last_name``, você poderia criar um método para o ``full_name``::

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

Você pode acessar propriedades virtuais como se elas existissem na entidade.
O nome da propriedade será a versão lower case e underscored do método::

    echo $user->full_name;

Tenha em mente que as propriedades virtuais não podem ser usadas nos finds. Se
você deseja que as propriedades virtuais façam parte de representações JSON ou
array de suas entidades, consulte :ref:`exposing-virtual-properties`.

Checking if an Entity Has Been Modified
=======================================

.. php:method:: dirty($field = null, $dirty = null)

You may want to make code conditional based on whether or not properties have
changed in an entity. For example, you may only want to validate fields when
they change::

    // See if the title has been modified.
    $article->dirty('title');

You can also flag fields as being modified. This is handy when appending into
array properties::

    // Add a comment and mark the field as changed.
    $article->comments[] = $newComment;
    $article->dirty('comments', true);

In addition you can also base your conditional code on the original property
values by using the ``getOriginal()`` method. This method will either return
the original value of the property if it has been modified or its actual value.

You can also check for changes to any property in the entity::

    // See if the entity has changed
    $article->dirty();

To remove the dirty mark from fields in an entity, you can use the ``clean()``
method::

    $article->clean();

When creating a new entity, you can avoid the fields from being marked as dirty
by passing an extra option::

    $article = new Article(['title' => 'New Article'], ['markClean' => true]);

To get a list of all dirty properties of an ``Entity`` you may call::

    $dirtyFields = $entity->getDirty();

.. versionadded:: 3.4.3

    ``getDirty()`` has been added.


Validation Errors
=================

.. php:method:: errors($field = null, $errors = null)

After you :ref:`save an entity <saving-entities>` any validation errors will be
stored on the entity itself. You can access any validation errors using the
``getErrors()`` or ``getError()`` method::

    // Get all the errors
    $errors = $user->getErrors();
    // Prior to 3.4.0
    $errors = $user->errors();

    // Get the errors for a single field.
    $errors = $user->getError('password');
    // Prior to 3.4.0
    $errors = $user->errors('password');

The ``setErrors()`` or ``setError()`` method can also be used to set the errors on an entity, making
it easier to test code that works with error messages::

    $user->setError('password', ['Password is required']);
    $user->setErrors(['password' => ['Password is required'], 'username' => ['Username is required']]);
    // Prior to 3.4.0
    $user->errors('password', ['Password is required.']);

.. _entities-mass-assignment:

Mass Assignment
===============

While setting properties to entities in bulk is simple and convenient, it can
create significant security issues. Bulk assigning user data from the request
into an entity allows the user to modify any and all columns. When using
anonymous entity classes or creating the entity class with the :doc:`/bake`
CakePHP does not protect against mass-assignment.

The ``_accessible`` property allows you to provide a map of properties and
whether or not they can be mass-assigned. The values ``true`` and ``false``
indicate whether a field can or cannot be mass-assigned::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            'title' => true,
            'body' => true
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

.. note:: If the ``*`` property is not defined it will default to ``false``.

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
objects you can customize mass assignment protection with options. Please refer
to the :ref:`changing-accessible-fields` section for more information.

Bypassing Field Guarding
------------------------

There are some situations when you want to allow mass-assignment to guarded
fields::

    $article->set($properties, ['guard' => false]);

By setting the ``guard`` option to ``false``, you can ignore the accessible
field list for a single call to ``set()``.


Checking if an Entity was Persisted
-----------------------------------

It is often necessary to know if an entity represents a row that is already
in the database. In those situations use the ``isNew()`` method::

    if (!$article->isNew()) {
        echo 'This article was saved already!';
    }

If you are certain that an entity has already been persisted, you can use
``isNew()`` as a setter::

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

While lazy loading is not included by CakePHP's ORM, you can just use one of the
community plugins to do so. We recommend `the LazyLoad Plugin
<https://github.com/jeremyharris/cakephp-lazyload>`__

After adding the plugin to your entity, you will be able to do the following::

    $article = $this->Articles->findById($id);

    // The comments property was lazy loaded
    foreach ($article->comments as $comment) {
        echo $comment->body;
    }

Creating Re-usable Code with Traits
===================================

You may find yourself needing the same logic in multiple entity classes. PHP's
traits are a great fit for this. You can put your application's traits in
**src/Model/Entity**. By convention traits in CakePHP are suffixed with
``Trait`` so they can be discernible from classes or interfaces. Traits are
often a good complement to behaviors, allowing you to provide functionality for
the table and entity objects.

For example if we had SoftDeletable plugin, it could provide a trait. This trait
could give methods for marking entities as 'deleted', the method ``softDelete``
could be provided by a trait::

    // SoftDelete/Model/Entity/SoftDeleteTrait.php

    namespace SoftDelete\Model\Entity;

    trait SoftDeleteTrait
    {

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
    // Associations will be converted with toArray() as well.
    $array = $user->toArray();

    // Convert to JSON
    // Associations will be converted with jsonSerialize hook as well.
    $json = json_encode($user);

When converting an entity to an JSON the virtual & hidden field lists are
applied. Entities are recursively converted to JSON as well. This means that if you
eager loaded entities and their associations CakePHP will correctly handle
converting the associated data into the correct format.

.. _exposing-virtual-properties:

Exposing Virtual Properties
---------------------------

By default virtual fields are not exported when converting entities to
arrays or JSON. In order to expose virtual properties you need to make them
visible. When defining your entity class you can provide a list of virtual
properties that should be exposed::

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

Accessor & Mutator methods on entities are not intended to contain the logic for
serializing and unserializing complex data coming from the database. Refer to
the :ref:`saving-complex-types` section to understand how your application can
store more complex data types like arrays and objects.

.. meta::
    :title lang=en: Entities
    :keywords lang=en: entity, entities, single row, individual record
