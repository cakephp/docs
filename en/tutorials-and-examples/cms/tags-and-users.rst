CMS Tutorial - Tags and Users
#############################

With the basic article creation functionality built, we need to enable multiple
authors to work in our CMS. Previously, we built all the models, views and
controllers by hand. This time around we're going to use
:doc:`console-and-shells/bake` to create our skeleton code. Bake is a powerful
code generation :abbr:`CLI (Command Line Interface)` tool that leverages the
conventions CakePHP uses to create skeleton :abbr:`CRUD (Create, Read, Update,
Delete)` applications very efficiently. We're going to use ``bake`` to build our
users code:

.. code-block:: bash

    cd /path/to/our/app

    bin/cake bake model users
    bin/cake bake controller users
    bin/cake bake template users

These 3 commands will generate:

* The Table, Entity, Fixture files.
* The Controller
* The CRUD templates.
* Test cases for each generated class.

Bake will also use the CakePHP conventions to infer the associations, and
validation your models have.

Adding Password Hashing
-----------------------

If you were to create/update a user at this point in time, you might notice that
the passwords are stored in plain text. This is really bad from a security point
of view, so lets fix that.

This is also a good time to talk about the model layer in CakePHP. In CakePHP,
we separate the methods that operate on a collection of objects, and a single
object into different classes. Methods that operate on the collection of
entities are put in the ``Table`` class, while features belonging to a single
record are put on the ``Entity`` class.

For example, password hashing is done on the individual record, so we'll
implement this behavior on the entity object. Because we want to hash the
password each time it is set, we'll use a mutator/setter method. CakePHP will
call convention based setter methods any time a property is set in one of your
entities. Let's add a setter for the password. In **src/Model/Entity/User.php**
add the following::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher; // Add this line
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Code from bake.

        protected function _setPassword($value)
        {
            $hasher = new DefaultPasswordHasher();
            return $hasher->hash($value);
        }
    }

Now update one of the users you created earlier, if you change their password,
you should see a hashed password instead of the original value on the list or
view pages. CakePHP hashes passwords with `bcrypt
<http://codahale.com/how-to-safely-store-a-password/>`_ by default. You can also
use SHA-1 or MD5 if you're working with an existing database, but we recommend
bcrypt for all new applications.

* Using Bake to create Tags CRUD
* Create some content
* Find Articles by Tag (route, action, finder, template)
* Improve Tagging

Next we'll be adding :doc:`authentication <authentication>`.
