Form
####

O FormHelper é uma das novidades nesta versão do CakePHP. A maior parte
do trabalho pesado relativo à criação de formulários agora pode ser
feita por esta nova classe, no lugar dos (agora obsoletos) métodos do
HtmlHelper. O FormHelper foca na criação rápida de formulários,
possibilitando valdação de dados, atribuição de valores de campos e
layout. O FormHelper também é flexível - ele vai fazer quase todo o
trabalho automagicamente, ou você pode usar os métodos específicos para
ter apenas o que você precise.

Criando Forms
=============

O primeiro método que você vai precisar para começar a usar o FormHelper
é o ``create()``. Este método especial retorna uma tag de abertura de
formulário HTML.

``create(string $model = null, array $options = array())``

Todos os parâmetros são opcionais. Se o ``create()`` for chamado sem
nenhum parâmetro, ele assume que você está criando um formulário que
submete para o controller atual por meio de uma action chamada ``add()``
ou ``edit()``. O método padrão para submissão de formulários é o POST. A
tag form também é retornada com um DOM ID. O ID é gerado a partir do
nome do model e do nome do controller, no formato CamelCase. Se
chamarmos ``create()`` dentro de uma view do UsersController, veremos
uma saída semelhante à esta no código renderizado da view:

::

    <form id="UserAddForm" method="post" action="/users/add">

Você também pode passar ``false`` para o parâmetro ``$model``. Isso faz
com que os dados de seu formulário sejam submetidos diretamente dentro
do array ``$this->data`` (ao invés de dentro de um sub-array
``$this->data['Model']``). Isto pode ser útil para formulários pequenos
e que não tenham uma correspondência direta com nenhuma entidade em sua
base de dados.

O método ``create()`` nos permite ainda mais personalizações através de
seus parâmetros. Primeiro, você pode especificar um nome para o model.
Ao especificar um model para o form, você está criando um *contexto* de
formulário. Assume-se que todos os campos dentro de um contexto
pertençam ao model especificado (a menos que outro model seja
explicitamente definido no nome do campo), além de presumir-se que
demais models associados façam referência ao model em questão. Se você
não especificar um model, então o Cake vai assumir que você está usando
o model padrão para o controller atual.

::

    <?php echo $form->create('Recipe'); ?>
     
    // saída:
    <form id="RecipeAddForm" method="post" action="/recipes/add">

Isto irá submeter os dados do formulários via POST para a action
``add()`` do RecipesController. Mas você também pode usar a mesma lógica
para criar um formulário de edição. O FormHelper utiliza a propriedade
``$this->data`` para detectar automaticamente se deve criar um form de
inserção (add) ou de edição (edit). Se o ``$this->data`` contiver um
elemento de array com o nome do model, e se este array for composto por
um outro array contendo um índice com o mesmo nome da chave primária do
model, então o FormHelper irá criar um formulário de edição para o
registro atual. Por exemplo, se acessarmos
http://example.com/recipes/edit/5, vamos obter o seguinte:

::

    // controllers/recipes_controller.php:
    <?php
    function edit($id = null) {
        if (empty($this->data)) {
            $this->data = $this->Recipe->findById($id);
        } else {
            // Lógica para salvar o registro aqui
        }
    }
    ?>

    // views/recipes/edit.ctp:

    // Como $this->data['Recipe']['id'] = 5, um form de edição é que será gerado
    <?php echo $form->create('Recipe'); ?>

    // saída:
    <form id="RecipeEditForm" method="post" action="/recipes/edit/5">
    <input type="hidden" name="_method" value="PUT" />

Como este é um formulário de edição, um campo escondido é gerado para
sobrescrever o método HTTP padrão.

O array ``$options`` é o parâmetro que contém a maioria das
configurações do formulário. Este array pode conter diversos pares de
chave-valor que afetam a maneira como a tag form é gerada.

$options[‘type’]
----------------

Esta chave é usada para especificar o tipo do formulário a ser criado.
Valores válidos incluem ‘post’, ‘get’, ‘file’, ‘put’ e ‘delete’.

Ao informar ‘post’ ou ‘get’, o método de submissão do formulário também
é modificado de acordo.

::

    <?php echo $form->create('User', array('type' => 'get')); ?>
     
    // saída:
    <form id="UserAddForm" method="get" action="/users/add">

Especificar o valor ‘file’ modifica o método de submissão do formulário
para ‘post’ e inclui o parâmetro enctype com o valor
“multipart/form-data” na tag form. Isto deve ser usado se você tiver
algum campo input do tipo file dentro de seu formulário. Sem o atributo
enctype na tag form, o browser não é capaz de realizar uploads de
arquivos adequadamente.

::

    <?php echo $form->create('User', array('type' => 'file')); ?>
     
    // saída:
    <form id="UserAddForm" enctype="multipart/form-data" method="post" action="/users/add">

Se você utilizar os valores ‘put’ ou ‘delete’, seu formulário será
funcionalmente equivalente a um form 'post', mas ao ser submetido, o
método da requisição HTTP será respectivamente sobrescrito por 'PUT' ou
'DELETE'. Isto permite o CakePHP emular o suporte a REST para o browser.

$options[‘action’]
------------------

Esta chave permite que você defina uma action específica em seu
controller atual para a qual o formulário irá submeter. Por exemplo, se
você quiser que o formulário apontasse para a action login() do
controller atual, você deve informar isso um array $options desta
maneira:

::

    <?php echo $form->create('User', array('action' => 'login')); ?>
     
    // saída:
    <form id="UserLoginForm" method="post" action="/users/login">
    </form>

$options[‘url’]
---------------

Se a action desejada para o form não estiver no controller atual, você
pode especificar uma URL para a action do formulário usando a chave
‘url’ do array $options. A URL informada deve ser relativa à sua
aplicação CakePHP, ou pode ainda apontar para um domínio externo.

::

    <?php echo $form->create(null, array('url' => '/recipes/add')); ?>
    // ou
    <?php echo $form->create(null, array('url' => array('controller' => 'recipes', 'action' => 'add'))); ?>


    // saída:
    <form method="post" action="/recipes/add">
     
    <?php echo $form->create(null, array(
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    )); ?>
     
    // saída:
    <form method="get" action="http://www.google.com/search">

$options[‘default’]
-------------------

Se ‘default’ for definido para o valor false, a action do formulário é
modificada de forma que ao se pressionar o botão de submit (ou se teclar
ENTER) o formulário não seja submetido. Se se pretende que o formulário
seja submetido via AJAX, definir ‘default’ para false evita o
comportamento padrão do formulário, e então você tem a possibilidade de
capturar os dados e submeter o form via AJAX.

$options['inputDefaults']
-------------------------

You can declare a set of default options for ``input()`` with the
``inputDefaults`` key to customize your default input creation.

::

    echo $this->Form->create('User', array(
            'inputDefaults' => array(
                'label' => false,
                'div'   => false,
                # define error defaults for the form
                'error' => array(
                  'wrap'  => 'span', 
                  'class' => 'my-error-class'
                )
            )
        ));

All inputs created from that point forward would inherit the options
declared in inputDefaults. You can override the defaultOptions by
declaring the option in the input() call.

::

    echo $this->Form->input('password'); // No div, no label
    echo $this->Form->input('username', array('label' => 'Username')); // has a label element

Fechando o Form
===============

O FormHelper também inclui um método end() que completa a marcação do
formulário. Normalmente, o end() gera apenas a tag form de fechamento,
mas o end() também é um bom lugar para incluir campos escondidos em seu
formulário que possam ser necessários na lógica de sua aplicação.

::

    <?php echo $form->create(); ?>
     
    <!-- Conteúdo do formulário aqui -->
     
    <?php echo $form->end(); ?>

Se uma string form informada como primeiro parâmetro para o método
end(), o FormHelper vai gerar um botão de submit com o nome
correspondente à string informada.

::

    <?php echo $form->end('Finalizar'); ?>
     
    saída:
     
    <div class="submit">
        <input type="submit" value="Finalizar" />
    </div>
    </form>

Automagic Form Elements
=======================

First, let’s look at some of the more automatic form creation methods in
the FormHelper. The main method we’ll look at is input(). This method
will automatically inspect the model field it has been supplied in order
to create an appropriate input for that field.

input(string $fieldName, array $options = array())

+--------------------------------------------------+--------------------------------------------------------+
| Column Type                                      | Resulting Form Field                                   |
+==================================================+========================================================+
| string (char, varchar, etc.)                     | text                                                   |
+--------------------------------------------------+--------------------------------------------------------+
| boolean, tinyint(1)                              | checkbox                                               |
+--------------------------------------------------+--------------------------------------------------------+
| text                                             | textarea                                               |
+--------------------------------------------------+--------------------------------------------------------+
| text, with name of password, passwd, or psword   | password                                               |
+--------------------------------------------------+--------------------------------------------------------+
| date                                             | day, month, and year selects                           |
+--------------------------------------------------+--------------------------------------------------------+
| datetime, timestamp                              | day, month, year, hour, minute, and meridian selects   |
+--------------------------------------------------+--------------------------------------------------------+
| time                                             | hour, minute, and meridian selects                     |
+--------------------------------------------------+--------------------------------------------------------+

For example, let’s assume that my User model includes fields for a
username (varchar), password (varchar), approved (datetime) and quote
(text). I can use the input() method of the FormHelper to create
appropriate inputs for all of these form fields.

::

    <?php echo $this->Form->create(); ?>
     
        <?php
            echo $this->Form->input('username');   //text
            echo $this->Form->input('password');   //password
            echo $this->Form->input('approved');   //day, month, year, hour, minute, meridian
            echo $this->Form->input('quote');      //textarea
        ?>
     
    <?php echo $this->Form->end('Add'); ?>

A more extensive example showing some options for a date field:

::

            echo $this->Form->input('birth_dt', array( 'label' => 'Date of birth'
                                        , 'dateFormat' => 'DMY'
                                        , 'minYear' => date('Y') - 70
                                        , 'maxYear' => date('Y') - 18 ));

Besides the specific input options found below you can specify any html
attribute (for instance onfocus). For more information on $options and
$htmlAttributes see `HTML Helper </pt/view/1434/HTML>`_.

And to round off, here's an example for creating a hasAndBelongsToMany
select. Assume that User hasAndBelongsToMany Group. In your controller,
set a camelCase plural variable (group -> groups in this case, or
ExtraFunkyModel -> extraFunkyModels) with the select options. In the
controller action you would put the following:

::

    $this->set('groups', $this->User->Group->find('list'));

And in the view a multiple select can be expected with this simple code:

::

    echo $this->Form->input('Group');

If you want to create a select field while using a belongsTo- or
hasOne-Relation, you can add the following to your Users-controller
(assuming your User belongsTo Group):

::

    $this->set('groups', $this->User->Group->find('list'));

Afterwards, add the following to your form-view:

::

    echo $this->Form->input('group_id');

If your model name consists of two or more words, e.g., "UserGroup",
when passing the data using set() you should name your data in a
pluralised and camelCased format as follows:

::

    $this->set('userGroups', $this->UserGroup->find('list'));
    // or
    $this->set('reallyInappropriateModelNames', $this->ReallyInappropriateModelName->find('list'));

Field naming convention
-----------------------

The Form helper is pretty smart. Whenever you specify a field name with
the form helper methods, it'll automatically use the current model name
to build an input with a format like the following:

::

    <input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">

You can manually specify the model name by passing in
Modelname.fieldname as the first parameter.

::

    echo $this->Form->input('Modelname.fieldname');

If you need to specify multiple fields using the same field name, thus
creating an array that can be saved in one shot with saveAll(), use the
following convention:

::

    <?php 
       echo $this->Form->input('Modelname.0.fieldname');
       echo $this->Form->input('Modelname.1.fieldname');
    ?>

    <input type="text" id="Modelname0Fieldname" name="data[Modelname][0][fieldname]">
    <input type="text" id="Modelname1Fieldname" name="data[Modelname][1][fieldname]">

$opcoes[‘type’]
---------------

Utilizando o ``FormHelper``, você pode forçar um campo a mudar o seu
tipo (e substituir a conduta do model) especificando-o. Em adição aos
tipos da tabela acima, você pode criar campos do tipo 'file' e
'password'.

::

    <?php echo $form->input('campo', array('type' => 'file')); ?>
     
    //A saída será:
     
    <div class="input">
        <label for="UsuarioCampo">Campo</label>
        <input type="file" name="data[Usuario][campo]" value="" id="UsuarioCampo" />
    </div>

$options[‘before’], $options[‘between’], $options[‘separator’] and $options[‘after’]
------------------------------------------------------------------------------------

Use these keys if you need to inject some markup inside the output of
the input() method.

::

    <?php echo $this->Form->input('field', array(
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

    <?php echo $this->Form->input('field', array(
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

    <?php echo $this->Form->input('field', array('options' => array(1,2,3,4,5))); ?>

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

    <?php echo $this->Form->input('field', array('options' => array(
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

    <?php echo $this->Form->input('field', array('options' => array(
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

If ‘multiple’ has been set to true for an input that outputs a select,
the select will allow multiple selections.

::

    echo $this->Form->input('Model.field', array( 'type' => 'select', 'multiple' => true ));

Alternatively set ‘multiple’ to ‘checkbox’ to output a list of related
check boxes.

::

    echo $this->Form->input('Model.field', array(
        'type' => 'select', 
        'multiple' => 'checkbox',
        'options' => array(
                'Value 1' => 'Label 1',
                'Value 2' => 'Label 2'
        )
    ));

Output:

::

    <div class="input select">
       <label for="ModelField">Field</label>
       <input name="data[Model][field]" value="" id="ModelField" type="hidden">
       <div class="checkbox">
          <input name="data[Model][field][]" value="Value 1" id="ModelField1" type="checkbox">
          <label for="ModelField1">Label 1</label>
       </div>
       <div class="checkbox">
          <input name="data[Model][field][]" value="Value 2" id="ModelField2" type="checkbox">
          <label for="ModelField2">Label 2</label>
       </div>
    </div>

$options[‘maxLength’]
---------------------

Define o número máximo de caracteres permitidos em uma input do tipo
texto.

$options[‘div’]
---------------

Use this option to set attributes of the input's containing div. Using a
string value will set the div's class name. An array will set the div's
attributes to those specified by the array's keys/values. Alternatively,
you can set this key to false to disable the output of the div.

Setting the class name:

::

        echo $form->input('User.name', array('div' => 'class_name'));

Output:

::

    <div class="class_name">
        <label form="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Setting multiple attributes:

::

        echo $form->input('User.name', array('div' => array('id' => 'mainDiv', 'title' => 'Div Title', 'style' => 'display:block')));

Output:

::

    <div class="input text" id="mainDiv" title="Div Title" style="display:block">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Disabling div output:

::

        <?php echo $form->input('User.name', array('div' => false));?>

Output:

::

        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />

$options[‘label’]
-----------------

Set this key to the string you would like to be displayed within the
label that usually accompanies the input.

::

    <?php echo $this->Form->input( 'User.name', array( 'label' => 'The User Alias' ) );?>

Output:

::

    <div class="input">
        <label for="UserName">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Alternatively, set this key to false to disable the output of the label.

::

    <?php echo $this->Form->input( 'User.name', array( 'label' => false ) ); ?>

Output:

::

    <div class="input">
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Set this to an array to provide additional options for the ``label``
element. If you do this, you can use a ``text`` key in the array to
customize the label text.

::

    <?php echo $this->Form->input( 'User.name', array( 'label' => array('class' => 'thingy', 'text' => 'The User Alias') ) ); ?>

Output:

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

Defina esta chave forçando assim valor do id DOM para uma entrada.

$options['error']
-----------------

Using this key allows you to override the default model error messages
and can be used, for example, to set i18n messages. It has a number of
suboptions which control the wrapping element, wrapping element class
name, and whether HTML in the error message will be escaped.

To disable error message output set the error key to false.

::

    $this->Form->input('Model.field', array('error' => false));

To modify the wrapping element type and its class, use the following
format:

::

    $this->Form->input('Model.field', array('error' => array('wrap' => 'span', 'class' => 'bzzz')));

To prevent HTML being automatically escaped in the error message output,
set the escape suboption to false:

::

    $this->Form->input('Model.field', array('error' => array('escape' => false)));

To override the model error messages use an associate array with the
keyname of the validation rule:

::

    $this->Form->input('Model.field', array('error' => array('tooShort' => __('This is not long enough', true) )));

As seen above you can set the error message for each validation rule you
have in your models. In addition you can provide i18n messages for your
forms.

$options['default']
-------------------

Usada para atribuir um valor default para o campo input. O valor é usado
se os dados passados para o form não contiverem um valor correspondente
para o campo (ou se nenhum dado for passado).

Exemplo de utilização:

::

    <?php 
        echo $form->input('ingrediente', array('default'=>'Açúcar')); 
    ?>

Exemplo com um campo select (o tamanho "Médio" será selecionado como
padrão):

::

    <?php 
        $sizes = array('p'=>'Pequeno', 'm'=>'Médio', 'g'=>'Grande');
        echo $form->input('tamanho', array('options'=>$sizes, 'default'=>'m')); 
    ?>

Você não pode usar ``default`` para marcar um checkbox - ao invés disso
você deve atribuir o valor para o campo correspondente em
``$this->data`` no seu controller ou em ``$form->data`` na sua view.

Valores default para campos do tipo date e datetime podem ser atribuídos
utilizando-se a chave 'selected'.

$options[‘selected’]
--------------------

Used in combination with a select-type input (i.e. For types select,
date, time, datetime). Set ‘selected’ to the value of the item you wish
to be selected by default when the input is rendered.

::

    echo $this->Form->input('close_time', array('type' => 'time', 'selected' => '13:30:00'));

The selected key for date and datetime inputs may also be a UNIX
timestamp.

$options[‘rows’], $options[‘cols’]
----------------------------------

These two keys specify the number of rows and columns in a textarea
input.

::

    echo $this->Form->input('textarea', array('rows' => '5', 'cols' => '5'));

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

    <?php echo $this->Form->input('field', array('options' => array(1,2,3,4,5), 'empty' => '(choose one)')); ?>

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

    <?php echo $this->Form->input('Model.time', array('type' => 'time', 'interval' => 15)); ?>

Would create 4 options in the minute select. One for each 15 minutes.

$options['class']
-----------------

You can set the classname for an input field using ``$options['class']``

::

    echo $this->Form->input('title', array('class' => 'custom-class'));

$options['hiddenField']
-----------------------

For certain input types (checkboxes, radios) a hidden input is created
so that the key in $this->data will exist even without a value
specified.

::

    <input type="hidden" name="data[Post][Published]" id="PostPublished_" value="0" />
    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />

This can be disabled by setting the ``$options['hiddenField'] = false``.

::

    echo $this->Form->checkbox('published', array('hiddenField' => false));

Which outputs:

::

    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />

If you want to create multiple blocks of inputs on a form that are all
grouped together, you should use this parameter on all inputs except the
first. If the hidden input is on the page in multiple places, only the
last group of input's values will be saved

In this example, only the tertiary colors would be passed, and the
primary colors would be overridden

::

    <h2>Primary Colors</h2>
    <input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsRed" />
    <label for="ColorsRed">Red</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsBlue" />
    <label for="ColorsBlue">Blue</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsYellow" />
    <label for="ColorsYellow">Yellow</label>

    <h2>Tertiary Colors</h2>
    <input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsGreen" />
    <label for="ColorsGreen">Green</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsPurple" />
    <label for="ColorsPurple">Purple</label>
    <input type="checkbox" name="data[Addon][Addon][]" value="5" id="ColorsOrange" />
    <label for="ColorsOrange">Orange</label>

Disabling the ``'hiddenField'`` on the second input group would prevent
this behavior

Campos do tipo File(Arquivo)
============================

Para adicionar campos do tipo arquivo (file), você primeiro deve se
certificar que o formulário está definido como "multipart/form-data".
Para isso crie o seu formulário usando uma dessas formas abaixo.

::

    echo $form->create('Arquivo', array('enctype' => 'multipart/form-data') );

    // OUTRA ALTERNATIVA

    echo $form->create('Arquivo', array('type' => 'file'));

Em seguida, adicione uma das duas linhas ao seu arquivo de exibição do
formulário.

::

    echo $form->input('Arquivo.file', array('between'=>'<br />','type'=>'file'));

    // ou

    echo $form->file('Arquivo.file');

Devido a limitações do próprio HTML não é possível adicionar valores nos
campos do tipo arquivo (file). Cada vez que o formulário for exibido o
seu valor sempre será vazio (em branco).

Após o envio, os campos do tipo arquivo (file) mostram um array com os
dados para o script que recebe os dados do formulário.

Para o exemplo acima, os valores enviados sempre estará organizado da
forma como mostrado abaixo. O caminho físico do arquivo na variável
'tmp\_name' pode váriar de acordo com o sistema operacional usado pelo
CakePHP.

::

    $this->data['Arquivo']['file'] = array(
        'name' => nome_do_arquivo.pdf
        'type' => application/pdf
        'tmp_name' => C:/WINDOWS/TEMP/php1EE.tmp
        'error' => 0
        'size' => 41737
    );

Esse array é gerado automaticamente pelo próprio PHP. Para mais detalhes
sobre os dados de arquivo passados pelo PHP `leia a documentação no site
oficial do PHP <https://secure.php.net/manual/pt_BR/features.file-upload.php>`_.

Validando Uploads
-----------------

Abaixo é um exemplo do método de validação que você pode definir no seu
model para validar se um arquivo foi enviado com sucesso.

::

    // Baseado no comentário 8 de: https://bakery.cakephp.org/articles/view/improved-advance-validation-with-parameters

    function isUploadedFile($params){
        $val = array_shift($params);
        if ((isset($val['error']) && $val['error'] == 0) ||
        (!empty($val['tmp_name']) && $val['tmp_name'] != 'none')) 
        {
            return is_uploaded_file($val['tmp_name']);
        } else {
            return false;
        }
    } 

Elementos Específicos de Formulários
====================================

O restante dos métodos diponíveis no FormHelper são para criar elementos
específicos de formulários. Muitos desses métodos também fazem uso de um
segundo parâmetro especial de opções. Nesse caso, o parâmetro $opcoes é
usado para especificar elmentos e atributos HTML (como o valor ou o id
do DOM do elemento do formulário).

::

    <?php echo $form->text('nome', array('class' => 'users')); ?>

A saída será:

::

     
    <input name="data[Usuario][nome]" type="text" class="users" id="UsuarioNome" />

checkbox
--------

``checkbox(string $fieldName, array $options)``

Cria um elemento de form checkbox. Este método também gera uma
associação oculta de form input para forçar a submição (submit) do dado
para o campo específico.

::

    <?php echo $form->checkbox('done'); ?>

Will output:

::

    <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
    <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />

button
------

``button(string $titulo, array $opcoes= array())``

Cria um elemento HTML "button" com o título especificado. Definindo o
``$opcoes['type']`` a saída será uma dessas três possibilidades:

#. button: Cria um botão padrão do HTML.
#. reset: Cria um botão padrão de limpar o formulário.
#. submit: Cria um botão padrão de submeter um formulário. (O mesmo que
   o método ``$form->submit``).

::

    <?php
    echo $form->button('Teste');
    echo $form->button('Outro Botão', array('type'=>'button'));
    echo $form->button('Limpar', array('type'=>'reset'));
    echo $form->button('Enviar formulário', array('type'=>'submit'));
    ?>

A saída será:

::

    <input type="button" value="Teste" />
    <input type="button" value="Outro Botão" />
    <input type="reset" value="Limpar" />
    <input type="Submit" value="Enviar formulário" />

year
----

``year(string $fieldName, int $minYear, int $maxYear, mixed $selected, array $attributes)``

Creates a select element populated with the years from ``$minYear`` to
``$maxYear``, with the $selected year selected by default. HTML
attributes may be supplied in $attributes. If ``$attributes['empty']``
is false, the select will not include an empty option.

::

    <?php
    echo $this->Form->year('purchased',2000,date('Y'));
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
    <option value="2004">2004</option>
    <option value="2003">2003</option>

    <option value="2002">2002</option>
    <option value="2001">2001</option>
    <option value="2000">2000</option>
    </select>

month
-----

``month(string $fieldName, mixed $selected, array $attributes)``

Creates a select element populated with month names.

::

    <?php
    echo $this->Form->month('mob');
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
'monthNames' attribute, or have months displayed as numbers by passing
false. (Note: the default months are internationalized and can be
translated using localization.)

::

    <?php
    echo $this->Form->month('mob', null, array('monthNames' => false));
    ?>

dateTime
--------

``dateTime($fieldName, $dateFormat = 'DMY', $timeFormat = '12', $selected = null, $attributes = array())``

Creates a set of select inputs for date and time. Valid values for
$dateformat are ‘DMY’, ‘MDY’, ‘YMD’ or ‘NONE’. Valid values for
$timeFormat are ‘12’, ‘24’, and null.

You can specify not to display empty values by setting "array('empty' =>
false)" in the attributes parameter. You also can pre-select the current
datetime by setting $selected = null and $attributes = array("empty" =>
false).

day
---

``day(string $fieldName, mixed $selected, array $attributes)``

Creates a select element populated with the (numerical) days of the
month.

To create an empty option with prompt text of your choosing (e.g. the
first option is 'Day'), you can supply the text as the final parameter
as follows:

::

    <?php
    echo $this->Form->day('created');
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

``hour(string $fieldName, boolean $format24Hours, mixed $selected, array $attributes)``

Creates a select element populated with the hours of the day.

minute
------

``minute(string $fieldName, mixed $selected, array $attributes)``

Creates a select element populated with the minutes of the hour.

One of the possible values for *$attributes* is called 'interval'. To
display an automagic select menu in 15-minute increments, add the
following in the attributes array:

::

    $this->Form->minute('example_time_field', null, array('interval' => 15));

meridian
--------

``meridian(string $fieldName, mixed $selected, array $attributes)``

Creates a select element populated with ‘am’ and ‘pm’.

error
-----

``error(string $fieldName, mixed $text, array $options)``

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
    echo $this->Form->create('User',array('type'=>'file'));
    echo $this->Form->file('avatar');
    ?>

Will output:

::

    <form enctype="multipart/form-data" method="post" action="/users/add">
    <input name="data[User][avatar]" value="" id="UserAvatar" type="file">

When using ``$this->Form->file()``, remember to set the form
encoding-type, by setting the type option to 'file' in
``$this->Form->create()``

hidden
------

``hidden(string $fieldName, array $options)``

Cria um caixa no form input hidden. Exemplo:

::

    <?php
    echo $form->hidden('id');
    ?>

A saída:

::

    <input name="data[User][id]" value="10" id="UserId" type="hidden">

isFieldError
------------

``isFieldError(string $fieldName)``

Returns true if the supplied $fieldName has an active validation error.

::

    <?php
    if ($this->Form->isFieldError('gender')){
        echo $this->Form->error('gender');
    }
    ?>

When using ``$this->Form->input()``, errors are rendered by default.

label
-----

``label(string $fieldName, string $text, array $attributes)``

Creates a label tag, populated with $text.

::

    <?php
    echo $this->Form->label('status');
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
    echo $this->Form->password('password');
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
    echo $this->Form->radio('gender',$options,$attributes);
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

Cria um elemento select com as opções do ``$options``, usando o
``$selected`` como opção selecionada por padrão. Use ``$showEmpty`` como
falso se você não quiser mostrar a opção em branco.

::

    <?php
    $opcoes=array('M'=>'Masculino','F'=>'Feminino');
    echo $form->select('sexo',$opcoes);
    ?>

A saída será:

::

    <select name="data[User][sexo]" id="UserSexo">
    <option value=""></option>
    <option value="M">Masculino</option>
    <option value="F">Feminino</option>
    </select>

Usando o ``$showEmpty`` como falso a saída será:

::

    <select name="data[User][sexo]" id="UserSexo">
    <option value="M">Masculino</option>
    <option value="F">Feminino</option>
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
    echo $this->Form->submit();
    ?>

Will output:

::

    <div class="submit"><input value="Submit" type="submit"></div>

You can also pass a relative or absolute url to an image for the caption
parameter instead of caption text.

::

    <?php
    echo $this->Form->submit('ok.png');
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
    echo $this->Form->text('first_name');
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
    echo $this->Form->textarea('notes');
    ?>

Will output:

::

    <textarea name="data[User][notes]" id="UserNotes"></textarea>

The ``textarea`` input type allows for the ``$options`` attribute of
``'escape'`` which determines whether or not the contents of the
textarea should be escaped. Defaults to ``true``.

::

    <?php
    echo $this->Form->textarea('notes', array('escape' => false));
    // OR....
    echo $this->Form->input('notes', array('type' => 'textarea', 'escape' => false));
    ?>

1.3 improvements
================

The FormHelper is one of the most frequently used classes in CakePHP,
and has had several improvements made to it.

**Entity depth limitations**

In 1.2 there was a hard limit of 5 nested keys. This posed significant
limitations on form input creation in some contexts. In 1.3 you can now
create infinitely nested form element keys. Validation errors and value
reading for arbitrary depths has also been added.

**Model introspection**

Support for adding 'required' classes, and properties like ``maxlength``
to hasMany and other associations has been improved. In the past only 1
model and a limited set of associations would be introspected. In 1.3
models are introspected as needed, providing validation and additional
information such as maxlength.

**Default options for input()**

In the past if you needed to use ``'div' => false``, or
``'label' => false`` you would need to set those options on each and
every call to ``input()``. Instead in 1.3 you can declare a set of
default options for ``input()`` with the ``inputDefaults`` key.

::

    echo $this->Form->create('User', array(
            'inputDefaults' => array(
                'label' => false,
                'div' => false
            )
        ));

All inputs created from that point forward would inherit the options
declared in inputDefaults. You can override the defaultOptions by
declaring the option in the input() call.

::

    echo $this->Form->input('password'); // No div, no label
    echo $this->Form->input('username', array('label' => 'Username')); // has a label element

**Omit attributes**

You can now set any attribute key to null or false in an
options/attributes array to omit that attribute from a particular html
tag.

::

    echo $this->Form->input('username', array(
        'div' => array('class' => false)
    )); // Omits the 'class' attribute added by default to div tag

**Accept-charset**

Forms now get an accept-charset set automatically, it will match the
value of ``App.encoding``, it can be overridden or removed using the
'encoding' option when calling create().

::

    // To remove the accept-charset attribute.
    echo $this->Form->create('User', array('encoding' => null));

**Removed parameters**

Many methods such as ``select``, ``year``, ``month``, ``day``, ``hour``,
``minute``, ``meridian`` and ``datetime`` took a ``$showEmpty``
parameter, these have all been removed and rolled into the
``$attributes`` parameter using the ``'empty'`` key.

**Default url**

The default url for forms either was ``add`` or ``edit`` depending on
whether or not a primary key was detected in the data array. In 1.3 the
default url will be the current action, making the forms submit to the
action you are currently on.

**Disabling hidden inputs for radio and checkbox**

The automatically generated hidden inputs for radio and checkbox inputs
can be disabled by setting the ``'hiddenField'`` option to ``false``.

**button()**

button() now creates button elements, these elements by default do not
have html entity encoding enabled. You can enable html escaping using
the ``escape`` option. The former features of ``FormHelper::button``
have been moved to ``FormHelper::submit``.

**submit()**

Due to changes in ``button()``, ``submit()`` can now generate reset, and
other types of input buttons. Use the ``type`` option to change the
default type of button generated. In addition to creating all types of
buttons, ``submit()`` has ``before`` and ``after`` options that behave
exactly like their counterparts in ``input()``.

**$options['format']**

The HTML generated by the form helper is now more flexible than ever
before. The $options parameter to Form::input() now supports an array of
strings describing the template you would like said element to follow.
It's just been recently added to SCM, and has a few bugs for non PHP 5.3
users, but should be quite useful for all. The supported array keys are
``array('before', 'input', 'between', 'label', 'after', 'error')``.
