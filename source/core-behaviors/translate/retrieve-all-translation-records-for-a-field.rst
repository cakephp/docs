6.3.5 Retrieve all translation records for a field
--------------------------------------------------

If you want to have all translation records attached to the current
model record you simply extend the *field array* in your behavior
setup as shown below. The naming is completely up to you.

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name' => 'nameTranslation'
            )
        );
    }
    ?>

With this setup the result of $this->Post->find() should look
something like this:

::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [name] => Beispiel Eintrag 
                 [body] => lorem ipsum...
                 [locale] => de_de
             )
    
         [nameTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Example entry
                     )
    
                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Beispiel Eintrag
                     )
    
             )
    )

**Note**: The model record contains a *virtual* field called
"locale". It indicates which locale is used in this result.

Note that only fields of the model you are directly doing \`find\`
on will be translated. Models attached via associations won't be
translated because triggering callbacks on associated models is
currently not supported.

Using the bindTranslation method
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can also retrieve all translations, only when you need them,
using the bindTranslation method

``bindTranslation($fields, $reset)``

``$fields`` is a named-key array of field and association name,
where the key is the translatable field and the value is the fake
association name.

::

    $this->Post->bindTranslation(array ('name' => 'nameTranslation'));
    $this->Post->find('all', array ('recursive'=>1)); // need at least recursive 1 for this to work.

With this setup the result of your find() should look something
like this:

::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [name] => Beispiel Eintrag 
                 [body] => lorem ipsum...
                 [locale] => de_de
             )
    
         [nameTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Example entry
                     )
    
                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Beispiel Eintrag
                     )
    
             )
    )

6.3.5 Retrieve all translation records for a field
--------------------------------------------------

If you want to have all translation records attached to the current
model record you simply extend the *field array* in your behavior
setup as shown below. The naming is completely up to you.

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name' => 'nameTranslation'
            )
        );
    }
    ?>

With this setup the result of $this->Post->find() should look
something like this:

::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [name] => Beispiel Eintrag 
                 [body] => lorem ipsum...
                 [locale] => de_de
             )
    
         [nameTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Example entry
                     )
    
                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Beispiel Eintrag
                     )
    
             )
    )

**Note**: The model record contains a *virtual* field called
"locale". It indicates which locale is used in this result.

Note that only fields of the model you are directly doing \`find\`
on will be translated. Models attached via associations won't be
translated because triggering callbacks on associated models is
currently not supported.

Using the bindTranslation method
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can also retrieve all translations, only when you need them,
using the bindTranslation method

``bindTranslation($fields, $reset)``

``$fields`` is a named-key array of field and association name,
where the key is the translatable field and the value is the fake
association name.

::

    $this->Post->bindTranslation(array ('name' => 'nameTranslation'));
    $this->Post->find('all', array ('recursive'=>1)); // need at least recursive 1 for this to work.

With this setup the result of your find() should look something
like this:

::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [name] => Beispiel Eintrag 
                 [body] => lorem ipsum...
                 [locale] => de_de
             )
    
         [nameTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Example entry
                     )
    
                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Beispiel Eintrag
                     )
    
             )
    )
