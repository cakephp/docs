Internacionalização & Localização
##################################

Uma das melhores maneiras de uma aplicação alcançar um público maior é atender
a vários idiomas. Isso pode frequentemente se revelar uma tarefa assustadora, mas os
recursos de internacionalização e localização no CakePHP tornam isso muito mais fácil.

Primeiro, é importante entender alguma terminologia. *Internacionalização*
refere-se à capacidade de uma aplicação ser localizada. O termo *localização*
refere-se à adaptação de uma aplicação para atender requisitos específicos de idioma (ou
cultura) (ou seja, uma "locale"). Internacionalização e localização
são frequentemente abreviadas como i18n e l10n respectivamente; 18 e 10 são o número
de caracteres entre o primeiro e o último caractere.

Configurando Traduções
======================

Existem apenas alguns passos para ir de uma aplicação de idioma único para uma
aplicação multi-idioma, o primeiro dos quais é fazer uso da
função :php:func:`__()` no seu código. Abaixo está um exemplo de algum código para uma
aplicação de idioma único::

    <h2>Popular Articles</h2>

Para internacionalizar seu código, tudo que você precisa fazer é envolver strings na
função :php:func:`__()` assim::

    <h2><?= __('Popular Articles') ?></h2>

Não fazendo nada mais, esses dois exemplos de código são funcionalmente idênticos - eles
enviarão o mesmo conteúdo para o navegador. A função :php:func:`__()`
traduzirá a string passada se uma tradução estiver disponível, ou a retornará
sem modificações.

Arquivos de Idioma
------------------

Traduções podem ser disponibilizadas usando arquivos de idioma armazenados na
aplicação. O formato padrão para arquivos de tradução do CakePHP é o
formato `Gettext <https://en.wikipedia.org/wiki/Gettext>`_. Os arquivos precisam ser
colocados em **resources/locales/** e dentro deste diretório, deve haver uma
subpasta para cada idioma que a aplicação precisa suportar::

    resources/
        locales/
            en_US/
                default.po
            en_GB/
                default.po
                validation.po
            es/
                default.po

O domínio padrão é 'default', portanto a pasta de locale deve pelo menos
conter o arquivo **default.po** como mostrado acima. Um domínio refere-se a qualquer
agrupamento arbitrário de mensagens de tradução. Quando nenhum grupo é usado, o grupo padrão
é selecionado.

As mensagens de strings principais extraídas da biblioteca CakePHP podem ser armazenadas
separadamente em um arquivo chamado **cake.po** em **resources/locales/**.
A `biblioteca localizada do CakePHP <https://github.com/cakephp/localized>`_ abriga
traduções para as strings traduzidas voltadas para o cliente no núcleo (o domínio cake).
Para usar esses arquivos, vincule ou copie-os para o local esperado:
**resources/locales/<locale>/cake.po**. Se sua locale estiver incompleta ou incorreta,
por favor envie um PR neste repositório para corrigi-la.

Plugins também podem conter arquivos de tradução, a convenção é usar a
versão ``under_scored`` do nome do plugin como domínio para as mensagens
de tradução::

    MyPlugin/
        resources/
            locales/
                fr/
                    my_plugin.po
                    additional.po
                de/
                    my_plugin.po

As pastas de tradução podem ser o código ISO de duas ou três letras do idioma ou
o nome completo da locale ICU como ``fr_FR``, ``es_AR``, ``da_DK`` que contém
tanto o idioma quanto o país onde é falado.

Veja https://www.localeplanet.com/icu/ para a lista completa de locales.

.. versionchanged:: 4.5.0
    A partir de 4.5.0, plugins podem conter múltiplos domínios de tradução. Use
   ``MyPlugin.additional`` para referenciar domínios de plugin.

Um exemplo de arquivo de tradução pode ser assim:

.. code-block:: pot

     msgid "My name is {0}"
     msgstr "Je m'appelle {0}"

     msgid "I'm {0,number} years old"
     msgstr "J'ai {0,number} ans"

.. note::
    Traduções são armazenadas em cache - Certifique-se de sempre limpar o cache após
    fazer alterações nas traduções! Você pode usar a
    :doc:`ferramenta de cache </console-commands/cache>` e executar por exemplo
    ``bin/cake cache clear _cake_core_``, ou limpar manualmente a pasta ``tmp/cache/persistent``
    (se estiver usando cache baseado em arquivo).

Extrair Arquivos Pot com I18n Shell
------------------------------------

Para criar os arquivos pot a partir de `__()` e outros tipos internacionalizados de
mensagens que podem ser encontradas no código da aplicação, você pode usar o comando i18n.
Por favor leia o :doc:`capítulo seguinte </console-commands/i18n>` para
aprender mais.

Definindo a Locale Padrão
--------------------------

A locale padrão pode ser definida no seu arquivo **config/app.php** definindo
``App.defaultLocale``::

    'App' => [
        ...
        'defaultLocale' => env('APP_DEFAULT_LOCALE', 'en_US'),
        ...
    ]

Isso controlará vários aspectos da aplicação, incluindo o idioma padrão das
traduções, o formato de data, formato de número e moeda sempre que qualquer
um deles for exibido usando as bibliotecas de localização que o CakePHP fornece.

Alterando a Locale em Tempo de Execução
----------------------------------------

Para alterar o idioma das strings traduzidas, você pode chamar este método::

    use Cake\I18n\I18n;

    I18n::setLocale('de_DE');

Isso também mudará como números e datas são formatados ao usar uma das
ferramentas de localização.

Usando Funções de Tradução
===========================

O CakePHP fornece várias funções que ajudarão você a internacionalizar sua
aplicação. A mais frequentemente usada é :php:func:`__()`. Esta função
é usada para recuperar uma única mensagem de tradução ou retornar a mesma string se nenhuma
tradução foi encontrada::

    echo __('Popular Articles');

Se você precisa agrupar suas mensagens, por exemplo, traduções dentro de um plugin,
você pode usar a função :php:func:`__d()` para buscar mensagens de outro
domínio::

    echo __d('my_plugin', 'Trending right now');

.. note::

    Se você quiser traduzir plugins que têm namespace de vendor, você deve usar
    a string de domínio ``vendor/plugin_name``. Mas o arquivo de idioma relacionado
    será ``plugins/<Vendor>/<PluginName>/resources/locales/<locale>/plugin_name.po``
    dentro da pasta do seu plugin.

Às vezes, strings de tradução podem ser ambíguas para as pessoas que as traduzem.
Isso pode acontecer se duas strings são idênticas mas se referem a coisas diferentes. Por
exemplo, 'letter' tem vários significados em inglês. Para resolver esse problema, você
pode usar a função :php:func:`__x()`::

    echo __x('written communication', 'He read the first letter');

    echo __x('alphabet learning', 'He read the first letter');

O primeiro argumento é o contexto da mensagem e o segundo é a mensagem
a ser traduzida.

.. code-block:: pot

     msgctxt "written communication"
     msgid "He read the first letter"
     msgstr "Er las den ersten Brief"

Usando Variáveis em Mensagens de Tradução
------------------------------------------

Funções de tradução permitem que você interpole variáveis nas mensagens usando
marcadores especiais definidos na própria mensagem ou na string traduzida::

    echo __("Hello, my name is {0}, I'm {1} years old", ['Sara', 12]);

Marcadores são numéricos e correspondem às chaves no array passado. Você também
pode passar variáveis como argumentos independentes para a função::

    echo __("Small step for {0}, Big leap for {1}", 'Man', 'Humanity');

Todas as funções de tradução suportam substituições de placeholder::

    __d('validation', 'The field {0} cannot be left empty', 'Name');

    __x('alphabet', 'He read the letter {0}', 'Z');

O caractere ``'`` (aspas simples) age como um código de escape em mensagens
de tradução. Quaisquer variáveis entre aspas simples não serão substituídas e são
tratadas como texto literal. Por exemplo::

    __("This variable '{0}' be replaced.", 'will not');

Ao usar duas aspas adjacentes, suas variáveis serão substituídas adequadamente::

    __("This variable ''{0}'' be replaced.", 'will');

Essas funções tiram proveito do
`ICU MessageFormatter <https://php.net/manual/en/messageformatter.format.php>`_
para que você possa traduzir mensagens e localizar datas, números e moeda ao
mesmo tempo::

    echo __(
        'Hi {0}, your balance on the {1,date} is {2,number,currency}',
        ['Charles', new DateTime('2014-01-13 11:12:00'), 1354.37]
    );

    // Returns
    Hi Charles, your balance on the Jan 13, 2014, 11:12 AM is $ 1,354.37

Números em placeholders também podem ser formatados com controle refinado da
saída::

    echo __(
        'You have traveled {0,number} kilometers in {1,number,integer} weeks',
        [5423.344, 5.1]
    );

    // Returns
    You have traveled 5,423.34 kilometers in 5 weeks

    echo __('There are {0,number,#,###} people on earth', 6.1 * pow(10, 8));

    // Returns
    There are 6,100,000,000 people on earth

Esta é a lista de especificadores de formatação que você pode colocar após a palavra ``number``:

* ``integer``: Remove a parte decimal
* ``currency``: Coloca o símbolo de moeda da locale e arredonda decimais
* ``percent``: Formata o número como porcentagem

Datas também podem ser formatadas usando a palavra ``date`` após o número
do placeholder. Uma lista de opções extras segue:

* ``short``
* ``medium``
* ``long``
* ``full``

A palavra ``time`` após o número do placeholder também é aceita e ela
entende as mesmas opções que ``date``.

Você também pode usar placeholders nomeados como ``{name}`` nas strings de mensagem.
Ao usar placeholders nomeados, passe o placeholder e a substituição em um array usando pares chave/valor,
por exemplo::

    // echos:  Hi. My name is Sara. I'm 12 years old.
    echo __("Hi. My name is {name}. I'm {age} years old.", ['name' => 'Sara', 'age' => 12]);

Plurais
-------

Uma parte crucial da internacionalização da sua aplicação é fazer com que suas mensagens
sejam pluralizadas corretamente dependendo do idioma em que são exibidas. O CakePHP fornece
algumas maneiras de selecionar corretamente plurais em suas mensagens.

Usando Seleção de Plural ICU
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A primeira é tirar proveito do formato de mensagem ``ICU`` que vem por
padrão nas funções de tradução. No arquivo de traduções você poderia ter
as seguintes strings

.. code-block:: pot

     msgid "{0,plural,=0{No records found} =1{Found 1 record} other{Found # records}}"
     msgstr "{0,plural,=0{Ningún resultado} =1{1 resultado} other{# resultados}}"

     msgid "{placeholder,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}"
     msgstr "{placeholder,plural,=0{Ningún resultado} =1{1 resultado} other{{1} resultados}}"

E na aplicação use o seguinte código para exibir qualquer uma das
traduções para tal string::

    __('{0,plural,=0{No records found }=1{Found 1 record} other{Found # records}}', [0]);

    // Returns "Ningún resultado" as the argument {0} is 0

    __('{0,plural,=0{No records found} =1{Found 1 record} other{Found # records}}', [1]);

    // Returns "1 resultado" because the argument {0} is 1

    __('{placeholder,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}', [0, 'many', 'placeholder' => 2])

    // Returns "many resultados" because the argument {placeholder} is 2 and
    // argument {1} is 'many'

Uma olhada mais de perto no formato que acabamos de usar tornará evidente como as mensagens são
construídas::

    { [count placeholder],plural, case1{message} case2{message} case3{...} ... }

O ``[count placeholder]`` pode ser o número da chave do array de qualquer uma das variáveis
que você passa para a função de tradução. Ele será usado para selecionar a forma
plural correta.

Note que para referenciar ``[count placeholder]`` dentro de ``{message}`` você tem que
usar ``#``.

Você pode, é claro, usar IDs de mensagem mais simples se não quiser digitar a sequência
completa de seleção de plural no seu código

.. code-block:: pot

     msgid "search.results"
     msgstr "{0,plural,=0{Ningún resultado} =1{1 resultado} other{{1} resultados}}"

Then use the new string in your code::

    __('search.results', [2, 2]);

    // Returns: "2 resultados"

A última versão tem a desvantagem de que há necessidade de ter um arquivo
de mensagens de tradução mesmo para o idioma padrão, mas tem a vantagem de que torna
o código mais legível e deixa as strings complicadas de seleção de plural nos
arquivos de tradução.

Às vezes usar correspondência direta de números em plurais é impraticável. Por exemplo,
idiomas como árabe requerem um plural diferente quando você se refere a
poucas coisas e outra forma plural para muitas coisas. Nesses casos você pode
usar os aliases de correspondência ICU. Em vez de escrever::

    =0{No results} =1{...} other{...}

Você pode fazer::

    zero{No Results} one{One result} few{...} many{...} other{...}

Certifique-se de ler o
`Guia de Regras de Plural de Idiomas <https://unicode-org.github.io/cldr-staging/charts/37/supplemental/language_plural_rules.html>`_
para obter uma visão completa dos aliases que você pode usar para cada idioma.

Usando Seleção de Plural Gettext
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

O segundo formato de seleção de plural aceito é usar os recursos integrados
do Gettext. Neste caso, plurais serão armazenados no arquivo ``.po``
criando uma linha de tradução de mensagem separada por forma plural:

.. code-block:: pot

    # One message identifier for singular
    msgid "One file removed"
    # Another one for plural
    msgid_plural "{0} files removed"
    # Translation in singular
    msgstr[0] "Un fichero eliminado"
    # Translation in plural
    msgstr[1] "{0} ficheros eliminados"

Ao usar este outro formato, você deve usar outra função
de tradução::

    // Returns: "10 ficheros eliminados"
    $count = 10;
    __n('One file removed', '{0} files removed', $count, $count);

    // It is also possible to use it inside a domain
    __dn('my_plugin', 'One file removed', '{0} files removed', $count, $count);

O número dentro de ``msgstr[]`` é o número atribuído pelo Gettext para a forma
plural do idioma. Alguns idiomas têm mais de duas formas plurais, por
exemplo Croata:

.. code-block:: pot

    msgid "One file removed"
    msgid_plural "{0} files removed"
    msgstr[0] "{0} datoteka je uklonjena"
    msgstr[1] "{0} datoteke su uklonjene"
    msgstr[2] "{0} datoteka je uklonjeno"

Por favor visite a `página de idiomas do Launchpad <https://translations.launchpad.net/+languages>`_
para uma explicação detalhada dos números de forma plural para cada idioma.

Criando Seus Próprios Tradutores
=================================

Se você precisa divergir das convenções do CakePHP em relação a onde e como
mensagens de tradução são armazenadas, você pode criar seu próprio carregador de
mensagens de tradução. A maneira mais fácil de criar seu próprio tradutor é definindo um loader
para um único domínio e locale::

    use Cake\I18n\Package;
    // Prior to 4.2 you need to use Aura\Intl\Package

    I18n::setTranslator('animals', function () {
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
    }, 'fr_FR');

O código acima pode ser adicionado ao seu **config/bootstrap.php** para que
traduções possam ser encontradas antes de qualquer função de tradução ser usada. O mínimo
absoluto necessário para criar um tradutor é que a função loader
deve retornar um objeto ``Cake\I18n\Package`` (antes de 4.2 deveria ser um objeto ``Aura\Intl\Package``).
Uma vez que o código esteja no lugar, você pode usar as funções de tradução como de costume::

    I18n::setLocale('fr_FR');
    __d('animals', 'Dog'); // Returns "Chien"

Como você vê, objetos ``Package`` recebem mensagens de tradução como um array. Você pode
passar o método ``setMessages()`` como quiser: com código inline, incluindo
outro arquivo, chamando outra função, etc. O CakePHP fornece algumas funções loader
que você pode reutilizar se precisar apenas mudar de onde as mensagens são carregadas.
Por exemplo, você ainda pode usar arquivos **.po**, mas carregados de outro local::

    use Cake\I18n\MessagesFileLoader as Loader;

    // Load messages from resources/locales/folder/sub_folder/filename.po
    I18n::setTranslator(
        'animals',
        new Loader('filename', 'folder/sub_folder', 'po'),
        'fr_FR'
    );

Criando Parsers de Mensagem
----------------------------

É possível continuar usando as mesmas convenções que o CakePHP usa, mas usar
um parser de mensagem diferente de ``PoFileParser``. Por exemplo, se você quisesse carregar
mensagens de tradução usando ``YAML``, você primeiro precisará criar a classe
do parser::

    namespace App\I18n\Parser;

    class YamlFileParser
    {
        public function parse($file)
        {
            return yaml_parse_file($file);
        }
    }

O arquivo deve ser criado no diretório **src/I18n/Parser** da sua
aplicação. Em seguida, crie o arquivo de traduções em
**resources/locales/fr_FR/animals.yaml**

.. code-block:: yaml

    Dog: Chien
    Cat: Chat
    Bird: Oiseau

E finalmente, configure o loader de tradução para o domínio e locale::

    use Cake\I18n\MessagesFileLoader as Loader;

    I18n::setTranslator(
        'animals',
        new Loader('animals', 'fr_FR', 'yaml'),
        'fr_FR'
    );

.. _creating-generic-translators:

Criando Tradutores Genéricos
-----------------------------

Configurar tradutores chamando ``I18n::setTranslator()`` para cada domínio e
locale que você precisa suportar pode ser tedioso, especialmente se você precisa suportar mais
de algumas locales diferentes. Para evitar este problema, o CakePHP permite que você defina
loaders de tradutor genéricos para cada domínio.

Imagine que você queira carregar todas as traduções para o domínio padrão e para
qualquer idioma de um serviço externo::

    use Cake\I18n\Package;
    // Prior to 4.2 you need to use Aura\Intl\Package

    I18n::config('default', function ($domain, $locale) {
        $locale = Locale::parseLocale($locale);
        $lang = $locale['language'];
        $messages = file_get_contents("http://example.com/translations/$lang.json");

        return new Package(
            'default', // Formatter
            null, // Fallback (none for default domain)
            json_decode($messages, true)
        )
    });

O exemplo acima chama um serviço externo de exemplo para carregar um arquivo JSON com as
traduções e então apenas constrói um objeto ``Package`` para qualquer locale que seja
solicitada na aplicação.

Se você quiser mudar como os pacotes são carregados para todos os pacotes que não
têm loaders específicos definidos, você pode substituir o loader de pacote de fallback usando
o pacote ``_fallback``::

    I18n::config('_fallback', function ($domain, $locale) {
        // Custom code that yields a package here.
    });

Plurais e Contexto em Tradutores Personalizados
------------------------------------------------

Os arrays usados para ``setMessages()`` podem ser criados para instruir o tradutor
a armazenar mensagens em diferentes domínios ou para acionar seleção de plural
estilo Gettext. O seguinte é um exemplo de armazenar traduções para a mesma chave
em diferentes contextos::

    [
        'He reads the letter {0}' => [
            'alphabet' => 'Él lee la letra {0}',
            'written communication' => 'Él lee la carta {0}',
        ],
    ]

Da mesma forma, você pode expressar plurais estilo Gettext usando o array de mensagens
tendo uma chave de array aninhada por forma plural::

    [
        'I have read one book' => 'He leído un libro',
        'I have read {0} books' => [
            'He leído un libro',
            'He leído {0} libros',
        ],
    ]

Usando Diferentes Formatadores
-------------------------------

Em exemplos anteriores vimos que Packages são construídos usando ``default`` como
primeiro argumento, e foi indicado com um comentário que ele correspondia ao
formatador a ser usado. Formatadores são classes responsáveis por interpolar
variáveis em mensagens de tradução e selecionar a forma plural correta.

Se você está lidando com uma aplicação legada, ou não precisa do poder oferecido
pela formatação de mensagem ICU, o CakePHP também fornece o formatador ``sprintf``::

    return Package('sprintf', 'fallback_domain', $messages);

As mensagens a serem traduzidas serão passadas para a função ``sprintf()`` para
interpolar as variáveis::

    __('Hello, my name is %s and I am %d years old', 'José', 29);

É possível definir o formatador padrão para todos os tradutores criados pelo
CakePHP antes de serem usados pela primeira vez. Isso não inclui tradutores criados
manualmente usando os métodos ``setTranslator()`` e ``config()``::

    I18n::setDefaultFormatter('sprintf');

Localizando Datas e Números
============================

Ao exibir Datas e Números na sua aplicação, você frequentemente precisará que
eles sejam formatados de acordo com o formato preferido para o país ou região
em que você deseja que sua página seja exibida.

Para mudar como datas e números são exibidos, você só precisa mudar
a configuração de locale atual e usar as classes corretas::

    use Cake\I18n\I18n;
    use Cake\I18n\DateTime;
    use Cake\I18n\Number;

    I18n::setLocale('fr-FR');

    $date = new DateTime('2015-04-05 23:00:00');

    echo $date; // Displays 05/04/2015 23:00

    echo Number::format(524.23); // Displays 524,23

Certifique-se de ler as seções :doc:`/core-libraries/time` e :doc:`/core-libraries/number`
para aprender mais sobre opções de formatação.

Por padrão, datas retornadas para resultados ORM usam a classe ``Cake\I18n\DateTime``,
então exibi-las diretamente na sua aplicação será afetado ao mudar a
locale atual.

.. _parsing-localized-dates:

Analisando Dados de Datetime Localizados
-----------------------------------------

Ao aceitar dados localizados da requisição, é bom aceitar informações de datetime
no formato localizado do usuário. Em um controller, ou
:doc:`/controllers/middleware` você pode configurar os tipos Date, Time e
DateTime para analisar formatos localizados::

    use Cake\Database\TypeFactory;

    // Enable default locale format parsing.
    TypeFactory::build('datetime')->useLocaleParser();

    // Configure a custom datetime format parser format.
    TypeFactory::build('datetime')->useLocaleParser()->setLocaleFormat('dd-M-y');

    // You can also use IntlDateFormatter constants.
    TypeFactory::build('datetime')->useLocaleParser()
        ->setLocaleFormat([IntlDateFormatter::SHORT, -1]);

O formato de análise padrão é o mesmo que o formato de string padrão.

.. _converting-request-data-from-user-timezone:

Convertendo Dados de Requisição do Fuso Horário do Usuário
-----------------------------------------------------------

Ao lidar com dados de usuários em fusos horários diferentes, você precisará converter
os datetimes nos dados da requisição para o fuso horário da sua aplicação. Você pode usar
``setUserTimezone()`` de um controller ou :doc:`/controllers/middleware` para
tornar este processo mais simples::

    // Set the user's timezone
    TypeFactory::build('datetime')->setUserTimezone($user->timezone);

Uma vez definido, quando sua aplicação cria ou atualiza entidades a partir de dados de requisição,
o ORM irá automaticamente converter valores datetime do fuso horário do usuário para
o fuso horário da sua aplicação. Isso garante que sua aplicação esteja sempre
trabalhando no fuso horário definido em ``App.defaultTimezone``.

Se sua aplicação lida com informações de datetime em várias actions, você pode
usar um middleware para definir tanto a conversão de fuso horário quanto a análise de locale::

    namespace App\Middleware;

    use Cake\Database\TypeFactory;
    use Psr\Http\Message\ResponseInterface;
    use Psr\Http\Message\ServerRequestInterface;
    use Psr\Http\Server\MiddlewareInterface;
    use Psr\Http\Server\RequestHandlerInterface;

    class DatetimeMiddleware implements MiddlewareInterface
    {
        public function process(
            ServerRequestInterface $request,
            RequestHandlerInterface $handler
        ): ResponseInterface {
            // Get the user from the request.
            // This example assumes your user entity has a timezone attribute.
            $user = $request->getAttribute('identity');
            if ($user) {
                TypeFactory::build('datetime')
                    ->useLocaleParser()
                    ->setUserTimezone($user->timezone);
            }

            return $handler->handle($request);
        }
    }

Escolhendo Automaticamente a Locale Baseado em Dados da Requisição
===================================================================

Ao usar o ``LocaleSelectorMiddleware`` na sua aplicação, o CakePHP irá
automaticamente definir a locale baseada no usuário atual::

    // in src/Application.php
    use Cake\I18n\Middleware\LocaleSelectorMiddleware;

    // Update the middleware function, adding the new middleware
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        // Add middleware and set the valid locales
        $middlewareQueue->add(new LocaleSelectorMiddleware(['en_US', 'fr_FR']));
        // To accept any locale header value
        $middlewareQueue->add(new LocaleSelectorMiddleware(['*']));
    }

O ``LocaleSelectorMiddleware`` usará o cabeçalho ``Accept-Language`` para
automaticamente definir a locale preferida do usuário. Você pode usar a opção de lista de locale
para restringir quais locales serão usadas automaticamente.

Traduzir Conteúdo/Entidades
============================

Se você quiser traduzir conteúdo/entidades, então você deve ver o :doc:`Translate Behavior </orm/behaviors/translate>`.

.. meta::
    :title lang=en: Internationalization & Localization
    :keywords lang=en: internationalization localization,internationalization and localization,language application,gettext,l10n,pot,i18n,translation,languages
