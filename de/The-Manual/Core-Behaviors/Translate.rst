Translate
#########

TranslateBehavior ist ziemlich einfach zu installieren und funktioniert
danach mit wenig Konfigurationsaufwand. In diesem Abschnitt werden Sie
erfahren, wie man die Verhaltensweise für den Gebrauch in einem
beliebigen Modell vorbereitet und einfügt.

Wenn Sie TranlsateBehavior zusammen mit containable issue benutzen,
stellen Sie sicher, den 'fields'-Schlüssel für die Querys gesetzt zu
haben. Andernfalls könnte ungültiger SQL-Code generiert werden.

Initializing the i18n Database Tables
=====================================

Sie können die CakePHP-Konsole entweder benutzen oder sie manuell
erstellen. Wir empfehlen, die Konsole hierfür zu verwenden, denn es
könnte passieren, dass sich das Layout in zukünftigen Versionen von
CakePHP ändert. Indem Sie sich an die Konsole halten stellen Sie sicher,
dass sie das richtige Layout haben.

::

    ./cake i18n

Wählen Sie ``[I]``, um das il8n-Skript zu starten, das die Datenbank
erstellt. Falls bereits eine Datenbank exisitiert, werden Sie gefragt,
ob diese gelöscht werden soll. Antworten Sie mit yes, wenn Sie sicher
sind, dass noch keine il8n-Tabelle existiert und im Folgenden nochmals
mit yes, um die Tabelle zu erstellen.

Hinzufügen des Translate-Verhaltens zum Modell
==============================================

Um das Translate-Verhalten Ihrem Model hinzuzufügen, können Sie die
``$actsAs``-Property wie im folgenden Beispiel verwenden:

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate'
        );
    }
    ?>

Hier passiert noch nichts, denn ``$actsAs`` erwartet einige Optionen,
bevor es zu arbeiten beginnt. Sie müssen festlegen, welche Felder des
Models in der Übersetzungstabelle verfolgt werden, die wir im ersten
Schritt erstellt haben.

Defining the Fields
===================

Innerhalb des ``'Translate'`` Arrays werden die Felder eingeschrieben
die zu übersetzen sind:

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'fieldOne', 'fieldTwo', 'and_so_on'
            )
        );
    }
    ?>

Nachdem du dies getan hast, beispielsweise wenn du "name" als ein Feld
eingetragen hast, ist der Basis-Setup fertiggestellt. Super! In unserem
derzeitigen Beispiel sollte das Modell nun ungefähr so aussehen:

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
    }
    ?>

Wenn Felder für das TranslateBehavior eingetragen wurden, versichere
dich dass diese Felder vom überetzten Model Schema entfernt werden. Wenn
du sie dort beläst, können Probleme entstehen, wenn die Fallback-Locales
verwendet werden müssen.

Conclusion
==========

From now on each record update/creation will cause TranslateBehavior to
copy the value of "name" to the translation table (default: i18n) along
with the current locale. A locale is the identifier of the language, so
to speak.

The *current locale* is the current value of
``Configure::read('Config.language')``. The value of *Config.language*
is assigned in the L10n Class - unless it is already set. However, the
TranslateBehavior allows you to override this on-the-fly, which allows
the user of your page to create multiple versions without the need to
change his preferences. More about this in the next section.

Retrieve all translation records for a field
============================================

If you want to have all translation records attached to the current
model record you simply extend the *field array* in your behavior setup
as shown below. The naming is completely up to you.

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

With this setup the result of $this->Post->find() should look something
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

**Note**: The model record contains a *virtual* field called "locale".
It indicates which locale is used in this result.

Note that only fields of the model you are directly doing \`find\` on
will be translated. Models attached via associations won't be translated
because triggering callbacks on associated models is currently not
supported.

Using the bindTranslation method
--------------------------------

You can also retrieve all translations, only when you need them, using
the bindTranslation method

``bindTranslation($fields, $reset)``

``$fields`` is a named-key array of field and association name, where
the key is the translatable field and the value is the fake association
name.

::

    $this->Post->bindTranslation(array ('name' => 'nameTranslation'));
    $this->Post->find('all', array ('recursive'=>1)); // need at least recursive 1 for this to work.

With this setup the result of your find() should look something like
this:

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

Saving in another language
==========================

You can force the model which is using the TranslateBehavior to save in
a language other than the on detected.

To tell a model in what language the content is going to be you simply
change the value of the ``$locale`` property on the model before you
save the data to the database. You can do that either in your controller
or you can define it directly in the model.

**Example A:** In your controller

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';
        
        function add() {
            if ($this->data) {
                $this->Post->locale = 'de_de'; // we are going to save the german version
                $this->Post->create();
                if ($this->Post->save($this->data)) {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>

**Example B:** In your model

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // Option 1) just define the property directly
        var $locale = 'en_us';
        
        // Option 2) create a simple method 
        function setLanguage($locale) {
            $this->locale = $locale;
        }
    }
    ?>

Multiple Translation Tables
===========================

If you expect a lot entries you probably wonder how to deal with a
rapidly growing database table. There are two properties introduced by
TranslateBehavior that allow to specify which "Model" to bind as the
model containing the translations.

These are **$translateModel** and **$translateTable**.

Lets say we want to save our translations for all posts in the table
"post\_i18ns" instead of the default "i18n" table. To do so you need to
setup your model like this:

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // Use a different model (and table)
        var $translateModel = 'PostI18n';
    }
    ?>

**Important** is that you have to pluralize the table. It is now a usual
model and can be treated as such and thus comes with the conventions
involved. The table schema itself must be identical with the one
generated by the CakePHP console script. To make sure it fits one could
just initialize a empty i18n table using the console and rename the
table afterwards.

Create the TranslateModel
-------------------------

For this to work you need to create the actual model file in your models
folder. Reason is that there is no property to set the displayField
directly in the model using this behavior yet.

Make sure that you change the ``$displayField`` to ``'field'``.

::

    <?php
    class PostI18n extends AppModel { 
        var $displayField = 'field'; // important
    }
    // filename: post_i18n.php
    ?>

That's all it takes. You can also add all other model stuff here like
$useTable. But for better consistency we could do that in the model
which actually uses this translation model. This is where the optional
``$translateTable`` comes into play.

Changing the Table
------------------

If you want to change the name of the table you simply define
$translateTable in your model, like so:

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // Use a different model
        var $translateModel = 'PostI18n';
        
        // Use a different table for translateModel
        var $translateTable = 'post_translations';
    }
    ?>

Please note that **you can't use $translateTable alone**. If you don't
intend to use a custom ``$translateModel`` then leave this property
untouched. Reason is that it would break your setup and show you a
"Missing Table" message for the default I18n model which is created in
runtime.
