Validação de dados
##################

A validação dos dados é uma das mais importantes partes de qualquer
aplicação, elas fazem com que os dados em um *Model* respeitem as regras
da aplicação. Por exemplo, você pode estar querendo que as senhas tenham
no mínimo oito caracteres, ou garantir que os *usernames* sejam únicos.
Definindo regras de validação você faz com que a manipulação dos
formulários fique bem mais fácil.

Há vários aspectos diferentes no processo de validação. O quê iremos
cobrir nesta seção é a parte do *Model*. Essencialmente: o quê acontece
quando você chama o método save() do seu *model*. Para mais informações
de como manipular as mensagens de erro de validação, dê uma olhada na
`seção sobre o FormHelper </pt/view/182/Form>`_.

O primeiro passo para a validação de dados, é a criação de regras de
validação no seu *Model*. Para isso, use a *array* Model::validate na
definição do módulo, por exemplo:

::

    <?php
    class User extends AppModel {  
        var $name = 'User';
        var $validate = array();
    }
    ?>

No exemplo acima, a *array* $validate foi adicionada ao *Model* User,
mas a array ainda não contém nenhuma regra de validação. Assumindo que a
tabela de usuários já tenha os campos de *login*, *password* (senha),
*email* e *born* (data de nascimento), o exemplo abaixo mostra algumas
regras de validação simples para aplicarmos à esses campos:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $validate = array(
            'login' => 'alphaNumeric',
            'email' => 'email',
            'born' => 'date'
        );
    }
    ?>

Este último exemplo mostra como as regras de validação podem ser
adicionadas a campos do *model*. Para o campo de login, somente letras e
números serão aceitos, o email tem de ser válido, e a data de nascimento
deve ser uma data válida. Definindo regras de validação o CakePHP mostra
as mensagens de erro nos formulários automágicamente, se os dados não
seguirem as regras.

O CakePHP possui várias regras de validação e usar elas é bem fácil.
Algumas das regras "de fábrica" lhe permitem verificar as formatações de
e-mails, URLs, e números de cartões de crédito - cobriremos essas regras
em detalhes em breve.

Temos aqui um exemplo mais complexo de validação que tira vantagem de
algumas dessas regras de validação "de fábrica":

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $validate = array(
            'login' => array(
                'alphanumeric' => array(
                    'rule' => 'alphaNumeric',
                    'required' => true,
                    'message' => 'Letras e números somente'
                    ),
                'between' => array(
                    'rule' => array('between', 5, 15),
                'message' => 'Entre 5 e 15 caracteres'
                )
            ),
            'password' => array(
                'rule' => array('minLength', '8'),
                'message' => 'Mínimo de 8 caracteres'
            ),
            'email' => 'email',
            'born' => array(
                'rule' => 'date',
                'message' => 'Insira uma data válida',
                'allowEmpty' => true
            )
        );
    }
    ?>

Duas regras de validação foram definidas para o login: ele deve conter
apenas letras e números e o tamanho deve ter entre 5 e 15 caracteres. O
campo *password* (senha) deve ter no mínimo 8 caracteres. O *email* deve
ser um endereço de email válido, e o campo *born* (data de nascimento)
deve ser uma data válida. Note também que você pode incluir mensagens
personalizadas para que o CakePHP mostre quando as regras definidas
falharem.

Como o exemplo acima mostrou, um único campo pode haver múltiplas regras
de validação. E se as regras de validação "de fábrica" não resolverem o
seu caso, você pode adicionar suas próprias regras de validação.

Agora que você aprendeu um pouco sobre como a validação funciona, vamos
olhar como elas são definidas em um *model*. Há três diferentes formas
que você pode usar para definir regras de validação: arrays simples,
regra única por campo, e múltiplas regras por campo.

Regras Simples
==============

Como o nome sugere, essa é a maneira mais simples de definir uma regra
de validação:

::

    var $validate = array('fieldName' => 'ruleName');

Sendo que 'fieldName' é o nome do campo para qual a regra está sendo
definida e 'ruleName' seria o nome de uma regra pré-definida, tal como
'alphaNumeric', 'email' ou 'isUnique'.

Uma Regra por Campo
===================

Esta técnica de definição permite um melhor controle sobre como as
regras de validação funcionam. Mas antes de discutirmos isso, vamos ver
o padrão de uso geral para adicionar regras à um campo único:

::

    var $validate = array(
        'fieldName1' => array(
            'rule' => 'ruleName', // ou: array('ruleName', 'param1', 'param2' ...)
            'required' => true,
            'allowEmpty' => false,
            'on' => 'create', // ou: 'update'
            'message' => 'Sua mensagem de erro'
        )
    );

A chave 'rule' é obrigatória. Se você definir apenas 'required' => true,
a validação de formulário não vai funcionar corretamente. Isto porque
'required' atualmente não é uma regra.

Como você pode ver, cada campo (apenas um campo foi mostrado acima) é
associado com um array com cinco chaves: 'rule', 'required',
'allowEmpty', 'on' e 'message'. À exceção da chave 'rule', as demais
chaves são opcionais. Vamos analisar estas chaves.

rule
----

A chave 'rule' define um método de validação e aceita tanto um único
valor quanto um array. O valor da chave 'rule' deve ser o nome de um
método em seu *model*, um método da classe de validação principal, ou
uma expressão regular. Para mais informações sobre as regras disponíveis
por padrão, veja as <a href="/view/134/Core-Validation-Rules">Regras de
validação incorporadas por padrão</a>.

Se a regra não exigir nenhum parâmetro, a chave ‘rule’ pode conter um
único valor ex:

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric'
        )
    );

Se a regra exigir mais de um parâmetro (como max, min ou range), o valor
de ‘rule’ deve ser um array:

::

    var $validate = array(
        'password' => array(
        'rule' => array('minLength', 8),
    );

Lembre-se, a chave 'rule' é obrigatória para regras baseadas em array.

required
--------

Para esta chave deve se dar um valor booleano. Se ‘required’ for
verdadeiro, o campo deve estar presente na array de dados. Por exemplo,
se a regra de validação for definida como a seguir:

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'required' => true
        )
    );

Os dados enviados para o método save() do seu *model* devem conter o
campo de login. Senão, a validação irá falhar. O valor padrão para esta
chave é *false*.

``required => true`` não é o mesmo que a regra de validação
``notEmpty()``. ``required => true`` indica que o respectivo *índice* do
array de dados deve existir - o que não quer dizer que ele precise ter
um valor. Desta forma, a validação irá falhar se o campo não estiver
presente no dataset, mas pode ter sucesso (dependendo da regra) se o
valor submetido for vazio ('').

allowEmpty
----------

A chave ``allowEmpty`` deve possui um valor booleano. Se ``allowEmpty``
for falso, os dados passados para o método ``save()`` do *model* devem
incluir o campo e ele não poderá ser vazio. Se for verdadeiro e o campo
estiver vazio, todo e qualquer tipo de validação será ignorado.

O valor padrão para ``allowEmpty`` é ``null``. Ou seja, o campo sempre
processará as regras de validação, incluindo funções de validação
personalizada.

Se definido para ``false``, o valor do campo deve ser "não-vazio", sendo
"não-vazio" definido como ``!empty($valor) || is_numeric($valor)``. A
verificação de dado numérico confere se o CakePHP fará a coisa certa
quando ``$valor`` for zero.

A diferença entre ``required`` e ``allowEmpty`` pode não ser muito
clara. ``'required' => true`` significa que você não pode salvar o model
se o índice para este campo não existir no ``$this->data`` (a
verificação é feita com a função ``isset``); ao passo que
``'allowEmpty' => false`` assegura que o *valor* do campo atual seja
"não-vazio", como descrito acima.

on
--

A chave 'on' pode conter os seguintes valores: 'update' ou 'create'.
Isso lhe permite aplicar uma certa regra durante a criação ou a
atualização de um registro.

Se uma regra for definida como 'on' => 'create', a regra será executada
apenas quando algum registro for criado. Por outro lado, se estiver
definida como 'on' => 'update', ela será executada apenas quando algum
registro for atualizado.

O valor padrão para 'on' é null. Quando 'on' estiver definido como null,
a regra será executada durante a criação e a atualização de um registro.

message
-------

A chave ‘message’ permite você definir mensagens de erro de validação
personalizadas para uma regra:

::

    var $validate = array(
        'password' => array(
            'rule' => array('minLength', 8),
            'message' => 'A senha deve ter no mìnimo 8 caracteres'
        )
    );

last
----

Setting the ``'last'`` key to ``true`` will cause the validator to stop
on the rule if it fails instead of continuing with the next rule. This
is handy if you want validation to stop if the field is notEmpty in a
`multi-rule field </pt/view/133/Multiple-Rules-per-Field>`_.

::

    var $validate = array(
        'username' => array(
            'usernameRule-1' => array(
                'rule' => 'notEmpty',  
                'message' => 'Please enter a username.',
                'last' => true
             ),
            'usernameRule-2' => array(
                'rule' => array('minLength', 8),  
                'message' => 'Minimum length of 8 characters.'
            )  
        )
    );

The default value for ``'last'`` is ``false``.

Múltiplas regras por campo
==========================

Esta técnica nos dá muito mais flexibilidade do que o modelo de regras
simples, mas há um passo extra que temos que seguir antes de obtermos
maior controle sobre a validação dos dados. A próxima técnica que iremos
explicar nos permite atribuir múltiplas regras de validação por campo.

Se você desejar atribuir múltiplas regras de validaçãoo para um único
campo, seu código terá basicamente isso:

::

     
    var $validate = array(
        'fieldName' => array(
            'ruleName' => array(
                'rule' => 'ruleName',
                // chaves extras como 'on', 'required', etc. vão aqui...
            ),
            'ruleName2' => array(
                'rule' => 'ruleName2',
                // chaves extras como 'on', 'required', etc. vão aqui...
            )
        )
    );

Como você pode ver, é bem similar ao que fizemos na seção anterior. Lá,
para cada campo tinhamos apenas uma matriz com parâmetros de validação.
Nesse caso, cada 'fieldName' consiste em um array com outros arrays
(índices) de regra. Cada chave 'ruleName' contém uma array separada com
parâmetros de validação.

É mais fácil explicarmos isso com um exemplo prático:

::

    var $validate = array(
        'login' => array(
            'alphanumeric' => array(
                'rule' => 'alphaNumeric',  
                'message' => 'Apenas números e letras são permitidos'
             ),
            'minlength' => array(
                'rule' => array('minLength', '8'),  
                'message' => 'Mínimo de 8 caracteres'
            ),  
        )
    );

O exemplo acima define duas regras para o campo de login: 'alphanumeric'
e 'minLength'. Como você pode ver, cada regra é identificada por um nome
de índice. Nesse caso em especial, o nome dos índices são similares às
regras que eles empregam, mas o índice pode ter qualquer nome que você
escolher.

*Nota:* Se você planeja usar mensagens internacionalizadas, você deverá
especificar as mensagens de erro também na sua view.

::

    echo $form->input('login', array(
        'label' => __('Login', true), 
        'error' => array(
                'alphanumeric' => __('Apenas números e letras são permitidos', true),
                'minlength' => __('Mínimo de 8 caracteres', true)
            )
        )
    );

Agora o campo está internacionalizado, e você pode remover as mensagens
do seu model. Para maiores informações sobre a função \_\_(), veja
"Localização & Internacionalização".

Regras de validação incorporadas por padrão
===========================================

A classe de validação no CakePHP contém muitas regras de validação que
podem fazer da validação de dados para o *model* muito mais simples.
Essa classe contém as mais-usadas técnicas, assim você não precisará
reescrevêlas. Abaixo, você irá encontrar uma lista completa de todas as
regras e seus respectivos exemplos.

alphaNumeric
------------

Os dados do campo devem conter apenas letras e números.

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'message' => 'Nomes de usuário devem conter apenas letras e números.'
        )
    );

between
-------

O comprimento dos dados do campo deve estar entre os números
especificados (inclusive). Tanto o valor mínimo quanto o máximo devem
ser especificados.

::

    var $validate = array(
        'password' => array(
            'rule' => array('between', 5, 15),
            'message' => 'Senhas deve ter entre 5 e 15 caracteres.'
        )
    );

blank
-----

Essa regra é usada para ter certeza de que o campo foi deixado em branco
ou apenas caracteres de espaço estão presentes nele. São considerados
caracteres em branco: espaço, tab, carriage return, e newline.

::

    var $validate = array(
        'id' => array(
            'rule' => 'blank',
            'on' => 'create'
        )
    );

boolean
-------

Os dados para o campo devem ser um valor booleano. Valores válidos são
true ou false, inteiros 0 ou 1 ou strings '0' ou '1'.

::

    var $validate = array(
        'myCheckbox' => array(
            'rule' => array('boolean'),
            'message' => 'Valor incorreto para myCheckbox'
        )
    );

cc
--

Essa regra é usada para checar quando o campo é um cartão de crédito
válido. Ele aceita três parâmetros: 'type', 'deep' e 'regex'.

À chave 'type' podem ser atribuidos os valores 'fast', 'all' ou qualquer
um dos seguintes:

-  bankcard
-  diners
-  disc
-  electron
-  enroute
-  jcb
-  maestro
-  mc
-  solo
-  switch
-  visa
-  voyager

Se a chave 'type' for setada como 'fast', ela validará o número do
cartão de crédito entre os cartões mais usados. Se o valor da chave
'type' for 'all' ele irá validar entre todos os cartões de crédito. Você
também pode setar o 'type' como uma array de tipos de cartão que você
queira validar.

À chave 'deep' deve se dar um valor *booleano*. Se for setada como true,
a validação checará o cartão de crédito com o algoritmo Luhn
(`https://en.wikipedia.org/wiki/Luhn\_algorithm <https://en.wikipedia.org/wiki/Luhn_algorithm>`_).
O padrão é *false*.

A chave 'regex' lhe permite inserir sua própria expressão regular que
irá ser usada para validar o cartão de crédito.

::

    var $validate = array(
        'ccnumber' => array(
            'rule' => array('cc', array('visa', 'maestro'), false, null),
            'message' => 'O número do cartão de crédito que você forneceu é inválido.'
        )
    );

comparison
----------

O 'comparison' é usado para comparar valores numéricos. Ele suporta "is
greater", "is less", "greater or equal", "less or equal", "equal to",
and "not equal". Alguns exemplos abaixo:

::

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', '>=', 18),
            'message' => 'Você deve ter no mínimo 18 anos.'
        )
    );

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', 'greater or equal', 18),
            'message' => 'Você deve ter no mínimo 18 anos.'
        )
    );

date
----

Essa regra assegura que a data enviada seja válida. Um único parâmetro
(que pode ser um array) pode ser passado para validar os dados
fornecidos. O valor desse parâmetro pode ser um dos seguitnes:

-  'dmy' ex: 27-12-2006 or 27-12-06 (os separadores podem ser espaço,
   ponto, traço e barra comum)
-  'mdy' ex: 12-27-2006 or 12-27-06 (os separadores podem ser espaço,
   ponto, traço e barra comum)
-  'ymd' ex: 2006-12-27 or 06-12-27 (os separadores podem ser espaço,
   ponto, traço e barra comum)
-  'dMy' ex: 27 Dezembro 2006 ou 27 Dezembro 2006
-  'Mdy' ex: Dezembro 27, 2006 or Dez 27, 2006 (vírgula é opcional)
-  'My' ex: (Dezembro 2006 ou Dez 2006)
-  'my' ex: 12/2006 ou 12/06 (os separadores podem ser espaço, ponto,
   traço e barra comum)

Se nenhuma chave for fornecida, a chave padrão será 'ymd'.

::

    var $validate = array(
        'born' => array(
            'rule' => 'date',
            'message' => 'Insira uma data válida no formato AA-MM-DD.',
            'allowEmpty' => true
        )
    );

Apesar dos bancos de dados requerirem um certo formato de data, você
deve fazer o trabalho pesado e tentar convertê-los, ao invés de forçar
os usuários a inserirem a data nesse formato. Quanto mais você puder
facilitar para os usuários, melhor.

decimal
-------

Esta regra garante que o dado seja um número decimal válido. Um
parâmetro pode ser passado para especificar a quantidade de casas
decimais após o ponto. Se nenhum parâmetro for passado, o dado será
validado como um número científico de ponto flutuante, que fará a
validação falhar se nenhuma dígito for encontrado após o ponto decimal.

::

    var $validate = array(
        'price' => array(
            'rule' => array('decimal', 2)
        )
    );

email
-----

Checa se é um e-mail válido. Passando um valor booleano true como
segundo parâmetro dessa regra fará com que tente verificar o host para o
endereço do e-mail.

::

    var $validate = array('email' => array('rule' => 'email'));
     
    var $validate = array(
        'email' => array(
            'rule' => array('email', true),
            'message' => 'Insira um email válido.'
        )
    );

equalTo
-------

Essa regra vai garantir que o valor é igual e é do mesmo tipo do valor
dado.

::

    var $validate = array(
        'food' => array(
            'rule' => array('equalTo', 'cake'),  
            'message' => 'Esse valor deve ser igual a cake'
        )
    );

extension
---------

Essa regra verifica se é uma extensão válida de arquivo, como .jpg ou
.png. Permite múltiplas extensões se colocadas na forma de array.

::

    var $validate = array(
        'image' => array(
            'rule' => array('extension', array('gif', 'jpeg', 'png', 'jpg'),
            'message' => 'Por favor, informe uma imagem válida.'
        )
    );

file
----

Esta seção precisa ser reescrita. Se você tiver uma ideia sobre o que
deve constar aqui, por favor, utilize os links ao lado e submeta sua
sugestão!

ip
--

Checa se um endereço IP (IPv4) válido foi enviado.

::

    var $validate = array(
        'clientip' => array(
            'rule' => 'ip',
            'message' => 'Por favor, insira um endereço IP válido.'
        )
    );

isUnique
--------

O valor do campo deve ser único, não podendo ser usado por nenhum outro
registro.

::

    var $validate = array(
        'login' => array(
            'rule' => 'isUnique',
            'message' => 'O nome de usuário já está em uso.'
        )
    );

minLength
---------

Essa regra assegura que os dados enviados possuem o comprimento mínimo
requerido.

::

    var $validate = array(
        'login' => array(
            'rule' => array('minLength', '8'),  
            'message' => 'Nomes de usuário deve possuir no mínimo 8 caracteres.'
        )
    );

maxLength
---------

Essa regra assegura que o valor tem o mínimo de caracteres requerido.

::

    var $validate = array(
        'login' => array(
            'rule' => array('maxLength', '15'),  
            'message' => 'Nomes de usuário não podem ter mais que 15 caracteres.'
        )
    );

money
-----

Essa regra vai assegurar que o valor tem uma quantia monetária válida.

O segundo parâmetro define onde o símbolo está localizado (left/right).

::

    var $validate = array(
        'amount' => array(
            'rule' => array('money', 'left'),
            'message' => 'Por favor, informe um valor com uma quantia monetária'
        )
    );

multiple
--------

Use esta regra para validar uma entrada de seleção múltipla. Ela suporta
os parâmetros "in", "max" e "min".

::

    var $validate = array(
        'multiple' => array(
            'rule' => array('multiple', array('in' => array('do', 'ray', 'me', 'fa', 'so', 'la', 'ti'), 'min' => 1, 'max' => 3)),
            'message' => 'Por favor, selecione uma, duas ou três opções'
        )
    );

inList
------

Essa regra vai assegurar que é um valor permitido. Ele precisa de um
array de valores. O campo é válido se o valor do campo for um dos
valores do array.

::

    var $validate = array(
        'function' => array(
            'allowedChoice' => array(
             'rule' => array('inList', array('Foo', 'Bar')),
             'message' => 'Informe o valor Foo ou Bar.'
            )
        )
    );

numeric
-------

Verifica se o valor informado é um número válido.

::

    var $validate = array(
        'cars' => array(
            'rule' => 'numeric',  
            'message' => 'Por favor, informe o número de carros.'
        )
    );

notEmpty
--------

A regra básica para garantir que um campo não seja vazio.

::

    var $validate = array(
        'title' => array( 
            'rule' => 'notEmpty',
            'message' => 'Este campo não pode ser deixado em branco'
        )
    );

Não use esta regra para uma entrada de seleção múltipla, pois do
contrário isto vai causar um erro. Ao invés disso, utilize "multiple".

phone
-----

Valida números de telefones dos Estados Unidos (us). Se você quer
validar um número de telefone que não seja dos Estados Unidos, você pode
fornecer uma expressão regular no segundo parâmetro.

::

    var $validate = array(
        'phone' => array(
            'rule' => array('phone', null, 'us')
        )
    );

postal
------

Postal é usado para validar códigos postais dos Estados Unidos (us),
Canadá (ca), Reino Unido (uk), Itália (it), Alemanha (de) e Bélgica
(be). Para outro formato de código postal, você pode fornecer uma
expressão regular como segundo parâmetro.

::

    var $validate = array(
        'zipcode' => array(
            'rule' => array('postal', null, 'us')
        )
    );

range
-----

Essa regra garante que o valor está dentro da faixa númerica. Se nenhuma
faixa é fornecidade, a regra vai verificar se o valor é um número finito
válido na plataforma atual.

::

    var $validate = array(
        'number' => array(
            'rule' => array('range', 0, 10),
            'message' => 'Por favor coloque um número entre 0 e 10'
        )
    );

ssn
---

SSN valida números de segurança social dos Estados Unidos (us),
Dinamarca (dk) e dos Países Baixos (nl). Para outro formato de número de
segurança social, você pode fornecer uma expressão regular.

::

    var $validate = array(
        'ssn' => array(
            'rule' => array('ssn', null, 'us')
        )
    );

url
---

Essa regra verificar por formatos de URL válidos. Suporta http(s),
ftp(s), file, news, e protocolos gopher.

::

    var $validate = array(
        'website' => array(
            'rule' => 'url'
        )
    );

Regras de Validação Customizadas
================================

Se você não está encontrando o que você precisa, você sempre poderá
criar regras para sua aplicação. Há duas maneiras de fazer isso:
definindo expressões regulares customizadas, ou criando métodos
customizados de validação.

Validação com Expressão Regular Customizada
-------------------------------------------

Se a técnica de validação que você precisa pode ser completada usando
expressão regular, você pode definir uma expressão regular como um campo
na regra de validação.

::

    var $validate = array(
        'login' => array(
            'rule' => array('custom', '/[a-z0-9]{3,}$/i'),  
            'message' => 'Apenas letras e números, mínimo de 3 caracteres'
        )
    );

O exemplo acima verifica se *login* contem apenas letras e números, com
o mínimo de três caracteres.

Validação com Métodos Customizados
----------------------------------

As vezes verificar valores com expressões regulares não é o suficiente.
Por exemplo, você precisa garantir que um código promocional possa ser
usado apenas 25 vezes, você precisa adicionar um método customizado de
validação, como mostrado abaixo:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
      
        var $validate = array(
            'promotion_code' => array(
                'rule' => array('limitDuplicates', 25),
                'message' => 'Esse código promocional já foi usados muitas vezes.'
            )
        );
     
        function limitDuplicates($data, $limite) {
            $quantidade_existente = $this->find('count', array('conditions' => $data, 'recursive' => -1));
            return $quantidade_existente < $limite;
        }
    }
    ?>

Se você quer passar parâmetros para seus métodos customizados, adicione
mais elementos no *array* ‘rule’, e depois acesse esses parâmetros
(depois do parâmetro principal ``$data``) no seu método.

Seu método pode estar no *model* (como mostrado acima), ou em um
*behavior* que o *model* implemente. Isso inclui métodos mapeados.

Métodos no *model/behavior* são verificados primeiro para depois
procurar por um método na classe ``Validation``. Isso significa que você
pode sobrescrever um método existente (como ``alphaNumeric()``) a nível
de aplicação (adicionando o método no ``AppModel``), ou em qualquer
*model*.

Validando Valores no Controle
=============================

Enquanto normalmente você apenas usa o método *save* do *model*, talvez
as vezes você queira validar os valores sem salva-los. Por exemplo,
talvez você queira mostrar alguma informação extra para o usuário antes
de salvar os valores no banco de dados. Validar estes valores requer um
processo um pouco diferente do que simplesmente salva-los.

Primeiro, defina os valores no *model*.

::

    $this->ModelName->set( $this->data );

Então verifique se os valores validaram, use o método ``validates()`` do
*model*, ele irá retornar *true* se validar e *false* se não validar.

::

    if ($this->ModelName->validates()) {
        // lógica de validado
    } else {
        // lógica de não validado
    }

O método ``validates()`` chama o método ``invalidFields()`` para
preencher o ``validationErrors`` no *model*. O método
``invalidFields()`` também retorna os resultados.

::

    $errors = $this->ModelName->invalidFields(); // contem o array validationErrors

É importante notar que os valores têm que estar definidos no *model*
antes para poderem ser validados. É diferente do método ``save()`` pois
permite que as informações sejam passados como parâmetro.
