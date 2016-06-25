Internacionalização e Localização
#################################

.. note::
    A documentação não é atualmente suportada pela lingua portuguesa nesta
    página.

    Por favor, sinta-se a vontade para nos enviar um pull request no
    `Github <https://github.com/cakephp/docs>`_ ou use o botão
    **Improve This Doc** para propor suas mudanças diretamente.

    Você pode referenciar-se à versão inglesa no menu de seleção superior
    para obter informações sobre o tópico desta página.

Uma das melhores maneiras para uma aplicação alcançar uma maior audiência é
atender a vários idiomas. Isso muitas vezes pode provar ser uma tarefa difícil,
mas a internacionalização e recursos de localização do CakePHP tornam muito mais
fácil.

Primeiro, é importante entender a terminologia.  *Internacionalização* refere-se
à capacidade de um aplicativo ser localizado. O termo *localização* refere-se à
adaptação de uma aplicação, para atender idioma específico (ou cultura)
requisitos (Isto é, uma "localidade"). Internacionalização e Localização são
frequentemente abreviado como i18n (internacionalization) e l10n (localization);
18 e 10 são o número de caracteres entre a primeira e última letra de cada
termo.


Configurando Traduções
======================

Existem apenas alguns passos para ir de um aplicativo de um único idioma a uma
aplicação multi-lingual, o primeiro deles é fazer uso da função
:php:func: `__()` em seu código. Abaixo está um exemplo de algum código para uma
aplicação de um único idioma::

    <h2>Popular Articles</h2>

Para Internacionalizar seu código, tudo que você precisa fazer é refatorar a
string usando :php:func: `__()` por exemplo::

    <h2><?= __('Popular Articles') ?></h2>

Fazendo nada mais, estes dois exemplos de código são funcionalmente idênticos -
ambos irão enviar o mesmo conteúdo para o navegador. A função :php:func: `__()`
irá traduzir a string passada se a tradução estiver disponível, ou devolvê-la
inalterada.

Arquivos de Idiomas
-------------------

Traduções podem ser disponibilizados usando arquivos de idiomas armazenados na
aplicação. O formato padrão para arquivos de tradução do CakePHP é o formato
`Gettext <http://en.wikipedia.org/wiki/Gettext>`_. Os arquivos precisam ser
colocado dentro do Diretório **src/Locale/** e dentro deste diretório, deve
haver uma subpasta para cada idioma, por exemplo::

    /src
        /Locale
            /en_US
                default.po
            /en_GB
                default.po
                validation.po
            /es
                default.po

O domínio padrão é 'default', portanto, a pasta **src/Locale/** deve pelo menos
conter o arquivo **default.po** como mostrado acima. Um domínio refere-se a
qualquer arbitrário agrupamento de mensagens de tradução. Quando nenhum grupo é
usado, o grupo padrão é selecionado.

As mensagens das Strings do core extraídos da biblioteca CakePHP podem ser
armazenado separadamente em um arquivo chamado **cake.po** em **src/Locale/**.
O `CakePHP localized library <https://github.com/cakephp/localized>`_ possui
traduções para as mensagens traduzidas voltados para o cliente no núcleo (o
domínio Cake). Para usar esses arquivos, baixar ou copiá-los para o seu local
esperado: **src/Locale/<locale>/cake.po**. Se sua localidade está incompleta ou
incorreta, por favor envie um PR neste repositório para corrigi-lo.

Plugins também podem conter arquivos de tradução, a convenção é usar o
``under_score`` do nome do plugin como o domínio para a tradução mensagens::

    MyPlugin
        /src
            /Locale
                /fr
                    my_plugin.po
                /de
                    my_plugin.po

Pastas de tradução pode ser o código ISO de duas letras do idioma ou nome do
local completo, como ``fr_FR``, ``es_AR``, ``da_DK`` que contém tanto o idioma e
o país onde ele é falado.

Um exemplo de arquivo de tradução pode ser visto como:

.. code-block:: pot

     msgid "My name is {0}"
     msgstr "Je m'appelle {0}"

     msgid "I'm {0,number} years old"
     msgstr "J'ai {0,number} ans"

Extraindo arquivos .pot com I18n Shell
--------------------------------------

Para criar os arquivos .pot apartir de `__()` e outros tipos de mensagens
internacionalizadas que podem ser encontrados no código do aplicativo, você pode
usar o shell i18n.  Por favor, leia o :doc:`Capítulo Seguinte
</console-and-shells/i18n-shell>` para saber mais.

Definir a localidade padrão
---------------------------
A localidade padrão pode ser definida em no arquivo **config/app.php**,
definindo ``App.default Locale``::

    'App' => [
        ...
        'defaultLocale' => env('APP_DEFAULT_LOCALE', 'en_US'),
        ...
    ]

Isto vai controlar vários aspectos da aplicação, incluindo o padrão da linguagem
de traduções, o formato da data, formato de número e moeda sempre que qualquer
daqueles é exibida usando as bibliotecas de localização que o CakePHP fornece.

Alterando o local em tempo de execução
--------------------------------------

Para alterar o idioma para as mensagens traduzidas você pode chamar esse
método::

    use Cake\I18n\I18n;

    I18n::locale('de_DE');

Isso também irá alterar a forma como números e datas são formatadas quando
usamos uma das ferramentas de localização.

Usando funções de tradução
==========================

CakePHP fornece várias funções que o ajudarão a internacionalizar sua aplicação.
O mais utilizado é :php:func: `__()`. Esta função é usada para recuperar uma
única mensagem de tradução ou devolver a mesma String se não houver tradução::

    echo __('Popular Articles');

Se você precisa agrupar suas mensagens, por exemplo, traduções dentro de um
plugin, você pode usar a função :php:func: `__d()` para buscar mensagens de
outro domínio::

    echo __d('my_plugin', 'Trending right now');

Às vezes traduções de Strings podem ser ambíguos para as pessoas traduzindo-os.
Isso pode acontecer se duas sequências são idênticas, mas referem-se a coisas
diferentes. Por exemplo, "letter" tem vários significados em Inglês. Para
resolver esse problema, você pode usar a função :php:func: `__x()`::

    echo __x('written communication', 'He read the first letter');

    echo __x('alphabet learning', 'He read the first letter');

O primeiro argumento é o contexto da mensagem e a segunda é a mensagem a ser
traduzida.

Usando variáveis em mensagens de tradução
-----------------------------------------

Funções de tradução permitem que você interpole variáveis para as mensagens
usando marcadores especiais definidos na própria mensagem ou na string
traduzida::

    echo __("Hello, my name is {0}, I'm {1} years old", ['Jefferson', 19]);

Marcadores são numéricos, e correspondem às teclas na matriz passada. Você pode
também passar variáveis como argumentos independentes para a função::

    echo __("Small step for {0}, Big leap for {1}", 'Man', 'Humanity');

Todas as funções de tradução apoiam as substituições de espaço reservado::

    __d('validation', 'The field {0} cannot be left empty', 'Name');

    __x('alphabet', 'He read the letter {0}', 'Z');

O caracter ``'`` (aspas simples) age como um código de escape na mensagem de
tradução. Todas as variáveis entre aspas simples não serão substituídos e é
tratado como texto literal. Por exemplo::

    __("This variable '{0}' be replaced.", 'will not');

Ao usar duas aspas adjacentes suas variáveis e serão substituídos
adequadamente::

    __("This variable ''{0}'' be replaced.", 'will');

Estas funções tiram vantagem do
`UTI MessageFormatter <http://php.net/manual/en/messageformatter.format.php>`_
para que possa traduzir mensagens e localizar datas, números e moeda, ao mesmo
tempo::

    echo __(
        'Hi {0,string}, your balance on the {1,date} is {2,number,currency}',
        ['Charles', '2014-01-13 11:12:00', 1354.37]
    );

    // Returns
    Hi Charles, your balance on the Jan 13, 2014, 11:12 AM is $ 1,354.37

Os números em espaços reservados podem ser formatados, bem como com o controle
de grão fino da saída::

    echo __(
        'You have traveled {0,number,decimal} kilometers in {1,number,integer} weeks',
        [5423.344, 5.1]
    );

    // Returns
    You have traveled 5,423.34 kilometers in 5 weeks

    echo __('There are {0,number,#,###} people on earth', 6.1 * pow(10, 8));

    // Returns
    There are 6,100,000,000 people on earth

Esta é a lista de especificadores de formato que você pode colocar após
a palavra ``number``:

* ``integer``: Remove a parte Decimal
* ``decimal``: Formata o número como um float
* ``currency``: Coloca o local do símbolo de moeda e números de casas decimais
* ``percent``: Formata o número como porcentagem


Datas também pode ser formatadas usando a palavra ``date`` após o número do
espaço reservado. Uma lista de opções adicionais a seguir:

* ``short``
* ``medium``
* ``long``
* ``full``

A palavra ``time`` após o número de espaço reservado também é aceito e
compreende as mesmas opções que ``date``.

.. note::

    Espaços reservados nomeados são suportados no PHP 5.5+ e são formatados como
    ``{name}``. Ao usar espaços reservados nomeados para passar as variáveis em
    uma matriz usando pares de chave/valor, por exemplo  ``['name' =>
    'Jefferson', 'age' => 19]``.

    Recomenda-se usar o PHP 5.5 ou superior ao fazer uso de recursos de
    internacionalização no CakePHP. A extensão ``php5-intl`` deve ser instalada
    e a versão UTI deve estar acima 48.x.y (para verificar a versão UTI
    ``Intl::getIcuVersion ()``).

Plurais
-------

Uma parte crucial de internacionalizar sua aplicação é a pluralização das suas
mensagens corretamente, dependendo do idioma que eles são mostrados. O CakePHP
fornece algumas maneiras de selecionar corretamente plurais em suas mensagens.


Usando UTI para Seleção de Plural
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

O primeiro está aproveitando o formato de mensagem ``ICU`` que vem por padrão
nas funções de tradução. Nos arquivos de traduções você pode ter as seguintes
cadeias


.. code-block:: pot

     msgid "{0,plural,=0{No records found} =1{Found 1 record} other{Found # records}}"
     msgstr "{0,plural,=0{Nenhum resultado} =1{1 resultado} other{# resultados}}"

     msgid "{placeholder,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}"
     msgstr "{placeholder,plural,=0{Nenhum resultado} =1{1 resultado} other{{1} resultados}}"

E na aplicação utilize o seguinte código para a saída de uma das traduções para
essa seqüência::

    __('{0,plural,=0{No records found }=1{Found 1 record} other{Found # records}}', [0]);

    // Returns "Ningún resultado" as the argument {0} is 0

    __('{0,plural,=0{No records found} =1{Found 1 record} other{Found # records}}', [1]);

    // Returns "1 resultado" because the argument {0} is 1

    __('{placeholder,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}', [0, 'many', 'placeholder' => 2])

    // Returns "many resultados" because the argument {placeholder} is 2 and
    // argument {1} is 'many'

Um olhar mais atento para o formato que acabamos utilizado tornará evidente
como as mensagens são construídas::

    { [count placeholder],plural, case1{message} case2{message} case3{...} ... }

O ``[count placeholder]`` pode ser o número-chave de qualquer das variáveis que
você passar para a função de tradução. Ele será usado para selecionar o plural
correto.

Note que essa referência para ``[count placeholder]`` dentro de ``{message}``
você tem que usar ``#``.

Você pode usar ids de mensagem mais simples se você não deseja digitar a plena
seqüência de seleção para plural em seu código

.. code-block:: pot

     msgid "search.results"
     msgstr "{0,plural,=0{Nenhum resultado} =1{1 resultado} other{{1} resultados}}"

Em seguida, use a nova string em seu código::

    __('search.results', [2, 2]);

    // Returns: "2 resultados"

A última versão tem a desvantagem na qual existe uma necessidade de arquivar
mensagens e precisa de tradução para o idioma padrão mesmo, mas tem a vantagem
de que torna o código mais legível.

Às vezes, usando o número de correspondência direta nos plurais é impraticável.
Por exemplo, idiomas como o árabe exigem um plural diferente quando você se
refere a algumas coisas. Nesses casos, você pode usar o UTI correspondentes. Em
vez de escrever::

    =0{No results} =1{...} other{...}

Você pode fazer::

    zero{No Results} one{One result} few{...} many{...} other{...}

Certifique-se de ler a
`Language Plural Rules Guide <http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html>`_
para obter uma visão completa dos aliases que você pode usar para cada idioma.

Usando Gettext para Seleção de Plural
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

O segundo formato para seleção de plural aceito é a utilização das capacidades
embutidas de Gettext. Neste caso, plurais será armazenado nos arquivos ``.po``,
criando uma linha de tradução de mensagens separada por forma de plural.

.. code-block:: pot

    msgid "One file removed" # One message identifier for singular
    msgid_plural "{0} files removed" # Another one for plural
    msgstr[0] "Un fichero eliminado" # Translation in singular
    msgstr[1] "{0} ficheros eliminados" # Translation in plural

Ao usar este outro formato, você é obrigado a usar outra tradução de forma
funcional::

    // Returns: "10 ficheros eliminados"
    $count = 10;
    __n('One file removed', '{0} files removed', $count, $count);

    // Também é possível utilizá-lo dentro de um domínio
    __dn('my_plugin', 'One file removed', '{0} files removed', $count, $count);

O número dentro de ``msgstr[]`` é o número atribuído pela Gettext para o plural
na forma da língua.  Algumas línguas têm mais de duas formas plurais, para
exemplo *Croatian*:

.. code-block:: pot

    msgid "One file removed"
    msgid_plural "{0} files removed"
    msgstr[0] "{0} datoteka je uklonjena"
    msgstr[1] "{0} datoteke su uklonjene"
    msgstr[2] "{0} datoteka je uklonjeno"

Por favor visite a `Launchpad languages page
<https://translations.launchpad.net/+languages>`_ para uma explicação detalhada
dos números de formulário de plurais para cada idioma.

Criar seus próprios Tradutores
================================

Se você precisar a divergir convenções do CakePHP sobre onde e como as mensagens
de tradução são armazenadas, você pode criar seu próprio carregador de mensagem
de tradução. A maneira mais fácil de criar o seu próprio tradutor é através da
definição de um carregador para um único domínio e localidade::

    use Aura\Intl\Package;

    I18n::translator('animals', 'fr_FR', function () {
        $package = new Package(
            'default', // The formatting strategy (ICU)
            'default'  // The fallback domain
        );
        $package->setMessages([
            'Dog' => 'Chien',
            'Cat' => 'Chat',
            'Bird' => 'Oiseau'
            ...
        ]);

        return $package;
    });

O código acima pode ser adicionado ao seu **config/bootstrap.php** de modo que
as traduções podem ser encontradas antes de qualquer função de tradução é usada.
O mínimo absoluto que é necessário para a criação de um tradutor é que a função
do carregador deve retornar um ``Aura\Intl\Package`` objeto. Uma vez que o
código é no lugar que você pode usar as funções de tradução, como de costume::

    I18n::locale('fr_FR');
    __d('animals', 'Dog'); // Retorna "Chien"

Como você vê objetos, ``Package`` carregam mensagens de tradução como uma
matriz. Você pode passar o método ``setMessages()`` da maneira que quiser: com
código inline, incluindo outro arquivo, chamar outra função, etc. CakePHP
fornece algumas funções da carregadeira que podem ser reutilizadas se você só
precisa mudar para onde as mensagens são carregadas. Por exemplo, você ainda
pode usar **.po**, mas carregado de outro local::

    use Cake\I18n\MessagesFileLoader as Loader;

    // Load messages from src/Locale/folder/sub_folder/filename.po

    I18n::translator(
        'animals',
        'fr_FR',
        new Loader('filename', 'folder/sub_folder', 'po')
    );
