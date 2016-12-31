Forms
#####

Der FormHelper ist eine neue Erweiterung von CakePHP. Die meiste Arbeit
bei der Formularerstellung wird nun von dieser neuen Klasse übernommen.
Durch den neuen FormHelper sind die Methoden zur Formularerstellung im
HtmlHelper veraltet geworden. Der FormHelper konzentriert sich auf das
schnelle Erstellen von Formularen, hinsichtlich Validierung,
Wiederbefüllung und Layout. Der FormHelper ist auch sehr flexibel - er
kann alles automatisch erledigen, oder du kannst spezifische Methoden
verwenden, damit du nur das bekommst was du brauchst.

Formulare erstellen
===================

Die erste Methode die du brauchen wirst ist create(). Diese Methode gibt
einen öffnenden Form Tag aus.

::

    <?php
    echo $form->create(string $model = null, array $options = array());
    ?>

Alle Parameter sind optional. Wenn create() ohne Parameter aufgerufen
wird, wird angenommen, dass du ein Formular erstellst, das an die add()
Action des momentanen Controllers mithilfe von Post gesendet werden
soll. Das Form Element wird auch als DOM id, benannt nach der Controller
Action in CamelCase, zurückgegeben. Wenn ich create() innerhalb eines
Views des UsersController aufrufe, dann würde die Ausgabe etwa so
aussehen:

::

    <form id="UserAddForm" method="post" action="/users/add" />

Die create() Methode erlaubt noch viel mehr Anpassung über ihre
Parameter. Zuerst kannst du den Namen des Models angeben. Dieses Model
wird dann für alle Felder des Formulars angenommen und die DOM id des
Form Tags wird geändert.

::

    <?php echo $form->create('Recipe'); ?>
     
    //Ausgabe:
    <form id="RecipeAddForm" method="post" action="/recipes/add" />

Im $options Feld findet das Meiste der Konfiguration statt. Dieses
spezielle Feld kann eine Anzahl von verschiedenen Schlüssel-Wert Paaren
(key-value pairs) enthalten, die die Erstellung des Formulars
beeinflussen.

$options[‘type’]
----------------

Dieser Schlüssel wird benutzt um die Art des Formulars zu bestimmen, das
erstellt werden soll. Gültige Werte sind 'post', 'get', 'file', 'put'
und 'delete'.

Das Übergeben von 'post' oder 'get' verändert die Methode zur
Übertragung der Formulardaten entsprechend.

::

    <?php echo $form->create('User', array('type' => 'get')); ?>
     
    //Ausgabe:
    <form id="UserAddForm" method="get" action="/users/add" />

Durch den Wert 'file' wird die Formularübertragung auf 'post' geändert
und eine Eigenschaft "enctype" mit Wert "multipart/form-data angehängt.
Dieses wird benutzt wenn irgendwelche file Elemente im Formular sind.
Ohne dem "enctype" Attribut wird der Datei Upload nicht funktionieren.

::

    <?php echo $form->create('User', array('type' => 'file')); ?>
     
    //Ausgabe:
    <form id="UserAddForm" enctype="multipart/form-data" method="post" action="/users/add" />

Wenn 'put' oder 'delete' verwendet wird, ist das Formular gleich wie ein
normales 'post' Formular, mit dem Unterschied, dass wenn es abgeschickt
wird, die HTTP Request Methode mit 'PUT' oder 'DELETE' überschrieben
wird. Das erlaubt CakePHP eine einwandfreie REST Unterstützung für
Web-Browser zu emulieren.

$options[‘action’]
------------------

Der Schlüssel action erlaubt dir eine spezielle action in deinem
aktuellen Controller anzugeben. Wenn du z.B. das Formular für die action
login() des aktuellen Controllers erstellen möchtest, so würde der
form-Aufruf wie folgt aussehen:

::

    <?php echo $form->create('User', array('action' => 'login')); ?>
     
    //Output:
    <form id="UserLoginForm" method="post" action="/users/login">
    </form>

$options[‘url’]
---------------

Wenn die gewünschte Zieladresse (action) nicht der aktuelle Controller
ist, kann ein Ziel-Url über den URL Schlüssel des $option Array
angegeben werden. Hier ist ein relativer Verweis innerhalb der CakePhp
Installation, oder eine externe URL möglich.

::

    <?php echo $form->create(null, array('url' => '/recipes/add')); ?>
    // or
    <?php echo $form->create(null, array('url' => array('controller' => 'recipes', 'action' => 'add'))); ?>


    //Output:
    <form method="post" action="/recipes/add">
     
    <?php echo $form->create(null, array(
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    )); ?>
     
    //Output:
    <form method="get" action="http://www.google.com/search">

Also check `HtmlHelper::url <https://book.cakephp.org/view/842/url>`_
method for more examples of different types of urls.

$options[‘default’]
-------------------

Wenn ‘default’ auf den Boolean false gestzt wurde, wird die
Submit-Action des Formulars geändert, so dass Klicken auf den
Submit-Button das Formular nicht abschickt. Wenn das Formular via AJAX
übermittelt werden soll, unterdrückt die false-Einstellung von ‘default’
das Standard-Verhalten des Formulars, so dass die Daten via AJAX
abgegriffen und übermittelt werden können.

Formular schließen
==================

Der FormHelper beinhaltet ebenso eine end() Methode, die das Formular
schließt. Oftmals gibt end() nur einen schließenden Formular-Tag aus,
jedoch erlaubt end() dem FormHelper benötigte, versteckte
Formularelemente einzusetzen die andere Methoden benötigen könnten.

::

    <?php echo $form->create(); ?>
     
    <!-- Formularelemente kommen hier her -->
     
    <?php echo $form->end(); ?>

Wird ein String der Methode end() als erstem Parameter mitgegeben, gibt
der FormHelper einen Submit Button aus, der entsprechend diesem
Parameter beschriftet ist.

::

    <?php echo $form->end('Schluss jetzt'); ?>
     
    Ausgabe:
     
    <div class="submit">
        <input type="submit" value="Schluss jetzt" />
    </div>
    </form>

Automagic Form Elements
=======================

Schauen wir zuerst auf einige der automatischen
Formularerstellungsmethoden des FormHelpers. Besonderes Augenmerk
schenken wir der ``input()`` Methode. Diese Methode inspiziert
automatisch das passende Model-Feld, um ein entsprechendes
Formulareingabefeld zu erstellen.

input(string $fieldName, array $options = array())

+------------------------------------------------+-------------------------------------------------------------+
| Spaltentyp                                     | Resultierendes Formularfeld                                 |
+================================================+=============================================================+
| string (char, varchar, etc.)                   | text                                                        |
+------------------------------------------------+-------------------------------------------------------------+
| boolean, tinyint(1)                            | checkbox                                                    |
+------------------------------------------------+-------------------------------------------------------------+
| text                                           | textarea                                                    |
+------------------------------------------------+-------------------------------------------------------------+
| text, mit name password, passwd, oder psword   | passwort                                                    |
+------------------------------------------------+-------------------------------------------------------------+
| date                                           | tag, monat, und Jahresauswahl                               |
+------------------------------------------------+-------------------------------------------------------------+
| datetime, timestamp                            | Tag, Monat, Jahr, Stunden, Minuten, und meridian- Auswahl   |
+------------------------------------------------+-------------------------------------------------------------+
| time                                           | Stunden, Minuten, und meridian-Auswahl                      |
+------------------------------------------------+-------------------------------------------------------------+

Angenommen, mein User model beinhaltet Felder für einen usernaen
(varchar), password (varchar), approved (datetime) und quote (text). Die
``input()`` Methode des FormHelpers kann nun genutzt werden, um die
passenden Eingabefelder fpr alle diese Felder zu erzeugen.

::

    <?php echo $form->create(); ?>
     
        <?php
            echo $form->input('username');   //text
            echo $form->input('password');   //passwort
            echo $form->input('approved');   //tag, monat, jahr, stunden, minuten, meridian
            echo $form->input('quote');      //textfeld
        ?>
     
    <?php echo $form->end('Hinzufügen'); ?>

Ein umfangreicheres Beispiel, welches Optionen für ein date Feld
anschaulich darstellt:

::

            echo $form->input('birth_dt', array( 'label' => 'Date of birth'
                                        , 'dateFormat' => 'DMY'
                                        , 'minYear' => date('Y') - 70
                                        , 'maxYear' => date('Y') - 18 ));

Besides the specific input options found below you can specify any html
attribute (for instance onfocus). For more information on $options and
$htmlAttributes see `HTML Helper </de/view/205/HTML>`_.

And to round off, here's an example for creating a hasAndBelongsToMany
select. Assume that User hasAndBelongsToMany Group. In your controller,
set a camelCase plural variable (group -> groups in this case, or
ExtraFunkyModel -> extraFunkyModels) with the select options. In the
controller action you would put the following:

::

    $this->set('groups', $this->User->Group->find('list'));

And in the view a multiple select can be expected with this simple code:

::

    echo $form->input('Group');

If you want to create a select field while using a belongsTo- or
hasOne-Relation, you can add the following to your Users-controller
(assuming your User belongsTo Group):

::

    $this->set('groups', $this->User->Group->find('list'));

Afterwards, add the following to your form-view:

::

    echo $form->input('group_id');

If your model name consists of two or more words, e.g., "UserGroup",
when passing the data using set() you should name your data in a
pluralised and camelCased format as follows:

::

    $this->set('userGroups', $this->UserGroup->find('list'));
    // or
    $this->set('reallyInappropriateModelNames', $this->ReallyInappropriateModelName->find('list'));

Konventionen für Feldnamen
--------------------------

Der FormHelper denkt mit. Wenn ein Feldname mit den FormHelper Methoden
erstellt wird, nutzt dieser automatisch den aktuellen Modelnamen, um ein
Eingabefeld in der folgenden Form zu erstellen:

::

    <input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">

Man kann manuell den Modelnamen spezifizieren, wenn man diesen in der
Form Modelname.fieldname als ersten Parameter übergibt.

::

    echo $form->input('Modelname.fieldname');

Falls mehrere Felder, die den gleichen Feldamen nutzen, spezifiziert
werden sollen, und somit ein Array erzeugt werden kann, welches durch
saveAll() in einem Zug gespeichert werden kann, muss die folgende
Konventio genutzt werden:

::

    <?php 
       echo $form->input('Modelname.0.fieldname');
       echo $form->input('Modelname.1.fieldname');
    ?>

    <input type="text" id="Modelname0Fieldname" name="data[Modelname][0][fieldname]">
    <input type="text" id="Modelname1Fieldname" name="data[Modelname][1][fieldname]">

$options[‘type’]
----------------

Den Typ eines Eingabefeldes kann man mittels der Option type erzwingen
(und damit auch die Model Selbstprüfung überschreiben). Zusätzlich zu
den Feldtypen, die in der `Tabelle weiter
oben </de/view/189/Automagic-Form-Elements>`_ aufgeführt sind, können
auch ‘file’ und ‘password’ Eingabefelder erzeugt werden.

::

    <?php echo $form->input('field', array('type' => 'file')); ?>
     
    Ergebnis:
     
    <div class="input">
        <label for="UserField">Field</label>
        <input type="file" name="data[User][field]" value="" id="UserField" />
    </div>

$options[‘before’], $options[‘between’], $options[‘separator’] and $options[‘after’]
------------------------------------------------------------------------------------

Use these keys if you need to inject some markup inside the output of
the input() method.

::

    <?php echo $form->input('field', array(
        'before' => '--before--',
        'after' => '--after--',
        'between' => '--between---'
    ));?>
     
    Output:
     
    <div class="input">
    --before--
    <label for="UserField">Field</label>
    --between---
    <input name="data[User][field]" type="text" value="" id="UserField" />
    --after--
    </div>

For radio type input the 'separator' attribute can be used to inject
markup to separate each input/label pair.

::

    <?php echo $form->input('field', array(
        'before' => '--before--',
        'after' => '--after--',
        'between' => '--between---',
        'separator' => '--separator--',
        'options' => array('1', '2') 
    ));?>
     
    Output:
     
    <div class="input">
    --before--
    <input name="data[User][field]" type="radio" value="1" id="UserField1" />
    <label for="UserField1">1</label>
    --separator--
    <input name="data[User][field]" type="radio" value="2" id="UserField2" />
    <label for="UserField2">2</label>
    --between---
    --after--
    </div>

For ``date`` and ``datetime`` type elements the 'separator' attribute
can be used to change the string between select elements. Defaults to
'-'.

$options[‘options’]
-------------------

This key allows you to manually specify options for a select input, or
for a radio group. Unless the ‘type’ is specified as ‘radio’, the
FormHelper will assume that the target output is a select input.

::

    <?php echo $form->input('field', array('options' => array(1,2,3,4,5))); ?>

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>
    </div>

Options can also be supplied as key-value pairs.

::

    <?php echo $form->input('field', array('options' => array(
        'Value 1'=>'Label 1',
        'Value 2'=>'Label 2',
        'Value 3'=>'Label 3'
     ))); ?>

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
            <option value="Value 3">Label 3</option>
        </select>
    </div>

If you would like to generate a select with optgroups, just pass data in
hierarchical format. Works on multiple checkboxes and radio buttons too,
but instead of optgroups wraps elements in fieldsets.

::

    <?php echo $form->input('field', array('options' => array(
        'Label1' => array(
           'Value 1'=>'Label 1',
           'Value 2'=>'Label 2'
        ),
        'Label2' => array(
           'Value 3'=>'Label 3'
        )
     ))); ?>

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <optgroup label="Label1">
                <option value="Value 1">Label 1</option>
                <option value="Value 2">Label 2</option>
            </optgroup>
            <optgroup label="Label2">
                <option value="Value 3">Label 3</option>
            </optgroup>
        </select>
    </div>

$options[‘multiple’]
--------------------

Wenn bei einem Eingabefeld, welches eine Select-Feld erzeugt, ‘multiple’
auf true gesetzt wird, dann erlaubt das Select-Feld eine
Mehrfachauswahl. Alternativ kann ‘multiple’ auch auf ‘checkbox’ gesetzt
werden, um eine Liste von zugehörigen Checkboxen zu erhalten.

::

    $form->input('Model.field', array( 'type' => 'select', 'multiple' => true ));
    $form->input('Model.field', array( 'type' => 'select', 'multiple' => 'checkbox' ));

$options[‘maxLength’]
---------------------

Definiert die maximale Anzahl an Buchstaben für ein Texteingabefeld.

$options[‘div’]
---------------

Nutze diese Option, um die Attribute für das umgebene div-Element des
Eingabefeldes zu setzen. Ein String wird als CSS Klasenname
interpretiert. Ein Array setzt die entsprechenden Schlüssel/Wert Paare
als div-Attribute. Es ist auch möglich, den Wert false zu übergeben, um
die Ausgabe eines umgebenenen div-Elements zu verhindern.

Klassenname setzen

::

        echo $form->input('User.name', array('div' => 'class_name'));

Ergebnis:

::

    <div class="class_name">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Mehrere Attribute

::

        echo $form->input('User.name', array('div' => array('id' => 'mainDiv', 'title' => 'Div Title', 'style' => 'display:block')));

Ergebnis:

::

    <div class="input text" id="mainDiv" title="Div Title" style="display:block">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Kein umgebenes div-Element

::

        <?php echo $form->input('User.name', array('div' => false));?>

Ergebnis:

::

        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />

$options[‘label’]
-----------------

Gib bei dieser Option den String ein, der innerhalb des Label-Elements
angezeigt werden soll. Das Label-Element begleitet normalerweise eine
Eingabefeld.

::

    <?php echo $form->input( 'User.name', array( 'label' => 'The User Alias' ) );?>

Ergebnis:

::

    <div class="input">
        <label for="UserName">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Wird der Wert der Label-Option auf false gesetzt, so wird kein
Label-Element ausgegeben.

::

    <?php echo $form->input( 'User.name', array( 'label' => false ) ); ?>

Ergebnis:

::

    <div class="input">
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Wird ein Array als Wert der Label-Option ünergeben, so können mehrere
Attribute für das Label-Element übergeben werden. So kann über den
Schlüssel ``text`` innerhalb des Arrays der Label-Text angepasst werden.

::

    <?php echo $form->input( 'User.name', array( 'label' => array('class' => 'thingy', 'text' => 'The User Alias') ) ); ?>

Ergebnis:

::

    <div class="input">
        <label for="UserName" class="thingy">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

$options['legend']
------------------

Some inputs like radio buttons will be automatically wrapped in a
fieldset with a legend title derived from the fields name. The title can
be overridden with this option. Setting this option to false will
completely eliminate the fieldset.

$options[‘id’]
--------------

Set this key to force the value of the DOM id for the input.

$options['error']
-----------------

Using this key allows you to override the default model error messages
and can be used, for example, to set i18n messages. It has a number of
suboptions which control the wrapping element, wrapping element class
name, and whether HTML in the error message will be escaped.

To disable error message output set the error key to false.

::

    $form->input('Model.field', array('error' => false));

To modify the wrapping element type and its class, use the following
format:

::

    $form->input('Model.field', array('error' => array('wrap' => 'span', 'class' => 'bzzz')));

To prevent HTML being automatically escaped in the error message output,
set the escape suboption to false:

::

    $form->input('Model.field', array('error' => array('escape' => false)));

To override the model error messages use an associate array with the
keyname of the validation rule:

::

    $form->input('Model.field', array('error' => array('tooShort' => __('This is not long enough', true) )));

As seen above you can set the error message for each validation rule you
have in your models. In addition you can provide i18n messages for your
forms.

$options['default']
-------------------

Wird genutzt, um einen Standardwert für das Eingabefeld zu setzen. Der
Wert wird genau dann genutzt, wenn das Eingabefeld beim Absenden nicht
befüllt wurde (oder wenn gar keine Daten übermittelt wurden).

Beispiel:

::

    <?php 
        echo $form->input('zutat', array('default'=>'')); 
    ?>

Beispiel mit ausgewählten Feld(Größe "Mittel" soll der Standardwert
sein):

::

    <?php 
        $groesse = array('s'=>'klein', 'm'=>'mittel', 'l'=>'gross');
        echo $form->input('groesse', array('options'=>$groesse, 'default'=>'m')); 
    ?>

Man kann ``default`` nicht nutzen, um eine Checkbox zu aktivieren.
Stattdessen kann man den Wert im ``$this->data`` Array im Controller,
``$form->data`` Array im View setzen, oder die Option ``checked`` der
Input Methode auf 'true' setzen.

Die Standardwerte für date und datetime Felder können mit Hilfe des
'selected' Schlüssels gesetzt werden.

$options[‘selected’]
--------------------

Used in combination with a select-type input (i.e. For types select,
date, time, datetime). Set ‘selected’ to the value of the item you wish
to be selected by default when the input is rendered.

::

    echo $form->input('close_time', array('type' => 'time', 'selected' => '13:30:00'));

The selected key for date and datetime inputs may also be a UNIX
timestamp.

$options[‘rows’], $options[‘cols’]
----------------------------------

These two keys specify the number of rows and columns in a textarea
input.

::

    echo $form->input('textarea', array('rows' => '5', 'cols' => '5'));

Output:

::

    <div class="input text">
        <label for="FormTextarea">Textarea</label>
        <textarea name="data[Form][textarea]" cols="5" rows="5" id="FormTextarea" >
        </textarea>
    </div>

$options[‘empty’]
-----------------

If set to true, forces the input to remain empty.

When passed to a select list, this creates a blank option with an empty
value in your drop down list. If you want to have a empty value with
text displayed instead of just a blank option, pass in a string to
empty.

::

    <?php echo $form->input('field', array('options' => array(1,2,3,4,5), 'empty' => '(choose one)')); ?>

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="">(choose one)</option>
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>
    </div>

If you need to set the default value in a password field to blank, use
'value' => '' instead.

Options can also supplied as key-value pairs.

$options[‘timeFormat’]
----------------------

Used to specify the format of the select inputs for a time-related set
of inputs. Valid values include ‘12’, ‘24’, and ‘none’.

$options[‘dateFormat’]
----------------------

Used to specify the format of the select inputs for a date-related set
of inputs. Valid values include ‘DMY’, ‘MDY’, ‘YMD’, and ‘NONE’.

$options['minYear'], $options['maxYear']
----------------------------------------

Used in combination with a date/datetime input. Defines the lower and/or
upper end of values shown in the years select field.

$options['interval']
--------------------

This option specifies the number of minutes between each option in the
minutes select box.

::

    <?php echo $form->input('Model.time', array('type' => 'time', 'interval' => 15)); ?>

Would create 4 options in the minute select. One for each 15 minutes.

$options['class']
-----------------

You can set the classname for an input field using ``$options['class']``

::

    echo $form->input('title', array('class' => 'custom-class'));

File Fields
===========

To add a file upload field to a form, you must first make sure that the
form enctype is set to "multipart/form-data", so start off with a create
function such as the following.

::

    echo $form->create('Document', array('enctype' => 'multipart/form-data') );
    // OR
    echo $form->create('Document', array('type' => 'file'));

Next add either of the two lines to your form view file.

::

    echo $form->input('Document.submittedfile', array('between'=>'<br />','type'=>'file'));

    // or

    echo $form->file('Document.submittedfile');

Due to the limitations of HTML itself, it is not possible to put default
values into input fields of type 'file'. Each time the form is
displayed, the value inside will be empty.

Upon submission, file fields provide an expanded data array to the
script receiving the form data.

For the example above, the values in the submitted data array would be
organized as follows, if the CakePHP was installed on a Windows server.
'tmp\_name' will have a different path in a Unix environment.

::


    $this->data['Document']['submittedfile'] = array(
        'name' => conference_schedule.pdf
        'type' => application/pdf
        'tmp_name' => C:/WINDOWS/TEMP/php1EE.tmp
        'error' => 0
        'size' => 41737
    );

This array is generated by PHP itself, so for more detail on the way PHP
handles data passed via file fields `read the PHP manual section on file
uploads <http://php.net/features.file-upload>`_.

Validating Uploads
------------------

Below is an example validation method you could define in your model to
validate whether a file has been successfully uploaded.

::

    // Based on comment 8 from: https://bakery.cakephp.org/articles/view/improved-advance-validation-with-parameters

    function isUploadedFile($params){
        $val = array_shift($params);
        if ((isset($val['error']) && $val['error'] == 0) ||
        (!empty( $val['tmp_name']) && $val['tmp_name'] != 'none')) {
            return is_uploaded_file($val['tmp_name']);
        }
        return false;
    }

Form Element-Specific Methods
=============================

The rest of the methods available in the FormHelper are for creating
specific form elements. Many of these methods also make use of a special
$options parameter. In this case, however, $options is used primarily to
specify HTML tag attributes (such as the value or DOM id of an element
in the form).

::

    <?php echo $form->text('username', array('class' => 'users')); ?>

Will output:

::

     
    <input name="data[User][username]" type="text" class="users" id="UserUsername" />

checkbox
--------

``checkbox(string $fieldName, array $options)``

Creates a checkbox form element. This method also generates an
associated hidden form input to force the submission of data for the
specified field.

::

    <?php echo $form->checkbox('done'); ?>

Will output:

::

    <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
    <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />

button
------

``button(string $title, array $options = array())``

Erstellt eine Schaltfläche mit Titel und einem Standardtyp. Mit der
Option ``$options['type']`` können drei verschiedene Typen für die
Schaltfläche angegeben werden.

#. button: Es wird eine Standardschaltfläche erstellt.
#. reset: Es wird eine Reset Schaltfläche erstellt.
#. submit: Es wird eine Schaltfläche, für welche auch der Code
   ``$form->submit`` angewendet werden kann, erstellt.

::

    <?php
    echo $form->button('Schaltfläche');
    echo $form->button('andere Schaltfläche', array('type'=>'button'));
    echo $form->button('Formular resetten', array('type'=>'reset'));
    echo $form->button('Formular absenden', array('type'=>'submit'));
    ?>

Entspricht der HTML-Ausgabe:

::

    <input type="button" value="Schaltfläche" />
    <input type="button" value="andere Schaltfläche" />
    <input type="reset" value="Formular resetten" />
    <input type="Submit" value="Formular absenden" />

year
----

``year(string $fieldName, int $minYear, int $maxYear, mixed $selected, array $attributes, mixed $showEmpty)``

Creates a select element populated with the years from ``$minYear`` to
``$maxYear``, with the ``$selected`` year selected by default.
``$selected`` can either be a four-digit year (e.g. 2004) or string
``'now'``. HTML attributes may be supplied in ``$attributes``.

::

    <?php
    echo $form->year('purchased', 2005, 2009);
    ?>

Will output:

::

    <select name="data[User][purchased][year]" id="UserPurchasedYear">
    <option value=""></option>
    <option value="2009">2009</option>
    <option value="2008">2008</option>
    <option value="2007">2007</option>
    <option value="2006">2006</option>
    <option value="2005">2005</option>
    </select>

If ``$showEmpty`` is false, the select will not include an empty option.
If ``$showEmpty`` is a string, it will be used as empty option's name.

::

    <?php
    echo $form->year('returned', 2008, 2010, null, null, 'Select a year');
    ?>

Will output:

::

    <select name="data[User][returned][year]" id="UserReturnedYear">
    <option value="">Select a year</option>
    <option value="2010">2010</option>
    <option value="2009">2009</option>
    <option value="2008">2008</option>
    </select>

month
-----

``month(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with month names.

::

    <?php
    echo $form->month('mob');
    ?>

Will output:

::

    <select name="data[User][mob][month]" id="UserMobMonth">
    <option value=""></option>
    <option value="01">January</option>
    <option value="02">February</option>
    <option value="03">March</option>
    <option value="04">April</option>
    <option value="05">May</option>
    <option value="06">June</option>
    <option value="07">July</option>
    <option value="08">August</option>
    <option value="09">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
    </select>

You can pass in your own array of months to be used by setting the
'monthNames' attribute (CakePHP 1.3 only), or have months displayed as
numbers by passing false. (Note: the default months are
internationalized and can be translated using localization.)

::

    <?php
    echo $form->month('mob', null, array('monthNames' => false));
    ?>

dateTime
--------

``dateTime(string $fieldName, string $dateFormat = ‘DMY’, $timeFormat = ‘12’, mixed $selected, array $attributes, boolean $showEmpty)``

Erstellt einen Satz Dropdowns für Datum und Zeit. Gültige Werte für
$dateformat sind ‘DMY’, ‘MDY’, ‘YMD’ und ‘NONE’. Gültige Werte für
$timeFormat sind ‘12’, ‘24’, und ‘NONE’.

day
---

``day(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with the (numerical) days of the
month.

To create an empty option with prompt text of your choosing (e.g. the
first option is 'Day'), you can supply the text as the final parameter
as follows:

::

    <?php
    echo $form->day('created');
    ?>

Will output:

::

    <select name="data[User][created][day]" id="UserCreatedDay">
    <option value=""></option>
    <option value="01">1</option>
    <option value="02">2</option>
    <option value="03">3</option>
    ...
    <option value="31">31</option>
    </select>

hour
----

``hour(string $fieldName, boolean $format24Hours, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with the hours of the day.

minute
------

``minute(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with the minutes of the hour.

meridian
--------

``meridian(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with ‘am’ and ‘pm’.

error
-----

``error(string $fieldName, string $text, array $options)``

Shows a validation error message, specified by $text, for the given
field, in the event that a validation error has occurred.

Options:

-  'escape' bool Whether or not to html escape the contents of the
   error.
-  'wrap' mixed Whether or not the error message should be wrapped in a
   div. If a string, will be used as the HTML tag to use.
-  'class' string The classname for the error message

file
----

``file(string $fieldName, array $options)``

Creates a file input.

::

    <?php
    echo $form->create('User',array('type'=>'file'));
    echo $form->file('avatar');
    ?>

Will output:

::

    <form enctype="multipart/form-data" method="post" action="/users/add">
    <input name="data[User][avatar]" value="" id="UserAvatar" type="file">

When using ``$form->file()``, remember to set the form encoding-type, by
setting the type option to 'file' in ``$form->create()``

hidden
------

``hidden(string $fieldName, array $options)``

Creates a hidden form input. Example:

::

    <?php
    echo $form->hidden('id');
    ?>

Will output:

::

    <input name="data[User][id]" value="10" id="UserId" type="hidden">

isFieldError
------------

``isFieldError(string $fieldName)``

Returns true if the supplied $fieldName has an active validation error.

::

    <?php
    if ($form->isFieldError('gender')){
        echo $form->error('gender');
    }
    ?>

When using ``$form->input()``, errors are rendered by default.

label
-----

``label(string $fieldName, string $text, array $attributes)``

Creates a label tag, populated with $text.

::

    <?php
    echo $form->label('status');
    ?>

Will output:

::

    <label for="UserStatus">Status</label>

password
--------

``password(string $fieldName, array $options)``

Creates a password field.

::

    <?php
    echo $form->password('password');
    ?>

Will output:

::

    <input name="data[User][password]" value="" id="UserPassword" type="password">

radio
-----

``radio(string $fieldName, array $options, array $attributes)``

Creates a radio button input. Use ``$attributes['value']`` to set which
value should be selected default.

Use ``$attributes['separator']`` to specify HTML in between radio
buttons (e.g. <br />).

Radio elements are wrapped with a label and fieldset by default. Set
``$attributes['legend']`` to false to remove them.

::

    <?php
    $options=array('M'=>'Male','F'=>'Female');
    $attributes=array('legend'=>false);
    echo $form->radio('gender',$options,$attributes);
    ?>

Will output:

::

    <input name="data[User][gender]" id="UserGender_" value="" type="hidden">
    <input name="data[User][gender]" id="UserGenderM" value="M" type="radio">
    <label for="UserGenderM">Male</label>
    <input name="data[User][gender]" id="UserGenderF" value="F" type="radio">
    <label for="UserGenderF">Female</label>

If for some reason you don't want the hidden input, setting
``$attributes['value']`` to a selected value or boolean false will do
just that.

select
------

``select(string $fieldName, array $options, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element, populated with the items in ``$options``, with
the option specified by ``$selected`` shown as selected by default. Set
``$showEmpty`` to false if you do not want an empty select option to be
displayed.

::

    <?php
    $options=array('M'=>'Male','F'=>'Female');
    echo $form->select('gender',$options)
    ?>

Will output:

::

    <select name="data[User][gender]" id="UserGender">
    <option value=""></option>
    <option value="M">Male</option>
    <option value="F">Female</option>
    </select>

submit
------

``submit(string $caption, array $options)``

Creates a submit button with caption ``$caption``. If the supplied
``$caption`` is a URL to an image (it contains a ‘.’ character), the
submit button will be rendered as an image.

It is enclosed between ``div`` tags by default; you can avoid this by
declaring ``$options['div'] = false``.

::

    <?php
    echo $form->submit();
    ?>

Will output:

::

    <div class="submit"><input value="Submit" type="submit"></div>

You can also pass a relative or absolute url to an image for the caption
parameter instead of caption text.

::

    <?php
    echo $form->submit('ok.png');
    ?>

Will output:

::

    <div class="submit"><input type="image" src="/img/ok.png"></div>

text
----

``text(string $fieldName, array $options)``

Creates a text input field.

::

    <?php
    echo $form->text('first_name');
    ?>

Will output:

::

    <input name="data[User][first_name]" value="" id="UserFirstName" type="text">

textarea
--------

``textarea(string $fieldName, array $options)``

Creates a textarea input field.

::

    <?php
    echo $form->textarea('notes');
    ?>

Will output:

::

    <textarea name="data[User][notes]" id="UserNotes"></textarea>

