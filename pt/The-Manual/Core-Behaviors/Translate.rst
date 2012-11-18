Translate
#########

TranslateBehavior é bastante fácil de configurar e funciona bem com
pouca configuração. Nesta seção, você vai aprender como adicionar e
configurar o comportamento de utilização em qualquer model.

Initializing the i18n Database Tables
=====================================

Você pode usar o console CakePHP ou você pode criá-lo manualmente. É
aconselhado a usar o console para isso, porque pode acontecer que o
esquema alterações em futuras versões do CakePHP. Cumprindo com o
console irá certificar-se de que você tem a disposição correta.

::

    ./cake i18n

Selecione ``[I]``, que irá executar o script i18n dados intialization.
Você será perguntado se você quer largar qualquer existente e se você
deseja criá-lo. Resposta: Sim, se você estiver com certeza não existe
uma tabela i18n já, e responder com sim para criar novamente a tabela.

Anexando o Translate Behavior nos seus Models
=============================================

Para adicionar adicioná-lo ao seu model, use a propriedade ``$actsAs``,
como no exemplo a seguir.

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate'
        );
    }
    ?>

Isso não fará nada ainda, porque se espera algumas configurações antes
de começar a trabalhar. É necessário definir quais os campos do model
deve ser monitorada na tabela de tradução que criamos na primeira etapa.

Defining the Fields
===================

Você pode configurar os campos, simplesmente, que prorroga o
``'Traduzir' `` com outro valor array, assim:

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

Depois de ter feito isso (por exemplo, colocar "nome", como um dos
campos) que você já terminou a configuração básica. Ótimo! De acordo com
o nosso exemplo, o actual modelo deve agora olhar algo parecido com
isto:

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

Conclusion
==========

A partir de agora, cada registro atualização/criação irá causar
TranslateBehavior para copiar o valor do "nome" para a tabela de
tradução (por defeito: i18n), juntamente com o actual local. A
localidade é o identificador do idioma, por assim dizer.

O actual *locale* é o valor actual dos
`` Configure:: read ( 'Config.language') ``. O valor da
*Config.language* é atribuído na l10n classe - a menos que ele já está
definido. No entanto, o TranlateBehavior lhe permite substituir esta
on-the-fly, que permite que o usuário da sua página para criar múltiplas
versões sem a necessidade de alterar as suas preferências. Mais sobre
este assunto na próxima seção.

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
