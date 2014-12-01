Translate
#########

.. php:class:: TranslateBehavior()

TranslateBehavior is actually quite easy to setup and works out of
the box with very little configuration. In this section, you will
learn how to add and setup the behavior to use in any model.

If you are using TranslateBehavior in alongside containable issue,
be sure to set the 'fields' key for your queries. Otherwise you
could end up with invalid SQL generated.

Initializing the i18n Database Tables
=====================================

You can either use the CakePHP console or you can manually create
it. It is advised to use the console for this, because it might
happen that the layout changes in future versions of CakePHP.
Sticking to the console will make sure that you have the correct
layout.::

    ./cake i18n

Select ``[I]`` which will run the i18n database initialization
script. You will be asked if you want to drop any existing and if
you want to create it. Answer with yes if you are sure there is no
i18n table already, and answer with yes again to create the table.

Attaching the Translate Behavior to your Models
===============================================

Add it to your model by using the ``$actsAs`` property like in the
following example.::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate'
        );
    }

This will do nothing yet, because it expects a couple of options
before it begins to work. You need to define which fields of the
current model should be tracked in the translation table we've
created in the first step.

Defining the Fields
===================

You can set the fields by simply extending the ``'Translate'``
value with another array, like so::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'fieldOne', 'fieldTwo', 'and_so_on'
            )
        );
    }

After you have done that (for example putting "title" as one of the
fields) you already finished the basic setup. Great! According to
our current example the model should now look something like this::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'title'
            )
        );
    }

When defining fields for TranslateBehavior to translate, be sure to
omit those fields from the translated model's schema. If you leave
the fields in, there can be issues when retrieving data with
fallback locales.

.. note::

    If all the fields in your model are translated be sure to add ``created``
    and ``modified`` columns to your table. CakePHP requires at least one non
    primary key field before it will save a record.

Conclusion
==========

From now on each record update/creation will cause
TranslateBehavior to copy the value of "title" to the translation
table (default: i18n) along with the current locale. A locale is
the identifier of the language, so to speak.


Reading translated content
==========================

By default the TranslateBehavior will automatically fetch and add in data based
on the current locale. The current locale is read from ``Configure::read('Config.language')``
which is assigned by the :php:class:`L10n` class. You can override this
default on the fly using ``$Model->locale``.

Retrieve translated fields in a specific locale
-----------------------------------------------

By setting ``$Model->locale`` you can read translations for a specific locale::

    // Read the spanish locale data.
    $this->Post->locale = 'es';
    $results = $this->Post->find('first', array(
        'conditions' => array('Post.id' => $id)
    ));
    // $results will contain the spanish translation.

Retrieve all translation records for a field
--------------------------------------------

If you want to have all translation records attached to the current
model record you simply extend the **field array** in your behavior
setup as shown below. The naming is completely up to you.::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'title' => 'titleTranslation'
            )
        );
    }

With this setup the result of ``$this->Post->find()`` should look
something like this::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [title] => Beispiel Eintrag
                 [body] => lorem ipsum...
                 [locale] => de_de
             )

         [titleTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => title
                         [content] => Example entry
                     )

                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => title
                         [content] => Beispiel Eintrag
                     )

             )
    )

.. note::

    The model record contains a *virtual* field called
    "locale". It indicates which locale is used in this result.

Note that only fields of the model you are directly doing \`find\`
on will be translated. Models attached via associations won't be
translated because triggering callbacks on associated models is
currently not supported.

Using the bindTranslation method
--------------------------------

You can also retrieve all translations, only when you need them,
using the bindTranslation method

.. php:method:: bindTranslation($fields, $reset)

``$fields`` is a named-key array of field and association name,
where the key is the translatable field and the value is the fake
association name.::

    $this->Post->bindTranslation(array('title' => 'titleTranslation'));
    // need at least recursive 1 for this to work.
    $this->Post->find('all', array('recursive' => 1));

With this setup the result of your find() should look something
like this::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [title] => Beispiel Eintrag
                 [body] => lorem ipsum...
                 [locale] => de_de
             )

         [titleTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => title
                         [content] => Example entry
                     )

                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => title
                         [content] => Beispiel Eintrag
                     )

             )
    )

Saving in another language
==========================

You can force the model which is using the TranslateBehavior to
save in a language other than the one detected.

To tell a model in what language the content is going to be you
simply change the value of the ``$locale`` property on the model
before you save the data to the database. You can do that either in
your controller or you can define it directly in the model.

**Example A:** In your controller::

    class PostsController extends AppController {

        public function add() {
            if (!empty($this->request->data)) {
                // we are going to save the german version
                $this->Post->locale = 'de_de';
                $this->Post->create();
                if ($this->Post->save($this->request->data)) {
                    return $this->redirect(array('action' => 'index'));
                }
            }
        }
    }

**Example B:** In your model::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'title'
            )
        );

        // Option 1) just define the property directly
        public $locale = 'en_us';

        // Option 2) create a simple method
        public function setLanguage($locale) {
            $this->locale = $locale;
        }
    }

Multiple Translation Tables
===========================

If you expect a lot entries you probably wonder how to deal with a
rapidly growing database table. There are two properties introduced
by TranslateBehavior that allow to specify which "Model" to bind as
the model containing the translations.

These are **$translateModel** and **$translateTable**.

Lets say we want to save our translations for all posts in the
table "post\_i18ns" instead of the default "i18n" table. To do so
you need to setup your model like this::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'title'
            )
        );

        // Use a different model (and table)
        public $translateModel = 'PostI18n';
    }

.. note::

    It is important that you to pluralize the table. It is now a
    usual model and can be treated as such and thus comes with the
    conventions involved. The table schema itself must be identical
    with the one generated by the CakePHP console script. To make sure
    it fits one could just initialize a empty i18n table using the
    console and rename the table afterwards.

Create the TranslateModel
-------------------------

For this to work you need to create the actual model file in your
models folder. Reason is that there is no property to set the
displayField directly in the model using this behavior yet.

Make sure that you change the ``$displayField`` to ``'field'``.::

    class PostI18n extends AppModel {
        public $displayField = 'field'; // important
    }
    // filename: PostI18n.php

That's all it takes. You can also add all other model stuff here
like $useTable. But for better consistency we could do that in the
model which actually uses this translation model. This is where the
optional ``$translateTable`` comes into play.

Changing the Table
------------------

If you want to change the name of the table you simply define
$translateTable in your model, like so::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'title'
            )
        );

        // Use a different model
        public $translateModel = 'PostI18n';

        // Use a different table for translateModel
        public $translateTable = 'post_translations';
    }

Please note that **you can't use $translateTable alone**. If you
don't intend to use a custom ``$translateModel`` then leave this
property untouched. Reason is that it would break your setup and
show you a "Missing Table" message for the default I18n model which
is created in runtime.


.. meta::
    :title lang=en: Translate
    :keywords lang=en: invalid sql,correct layout,translation table,layout changes,database tables,array,queries,cakephp,models,translate,public name
