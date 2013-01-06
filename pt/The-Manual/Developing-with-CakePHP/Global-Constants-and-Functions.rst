Constantes Globais e Funções
############################

Ainda que a maior parte do dia-a-dia de seu trabalho com o CakePHP será
utilizando suas classes e métodos principais, o CakePHP também dispõe de
diversas funções de conveniência que podem lhe ser bastante úteis.
Muitas dessas funções existem para uso com as classes do CakePHP
(carregando models ou classes de componentes), mas muitas outras tornam
o trabalho com arrays ou strings um pouco mais fácil.

Também abordamos algumas das constantes disponíveis para aplicações em
CakePHP. O uso destas constantes ajuda a conduzir atualizações mais
suavemente, mas também são formas convenientes de se referenciar a
certos arquivos ou diretórios em sua aplicação CakePHP.

Funções Globais
===============

Aqui está a relação das funções globais disponíveis no CakePHP. Muitas
são apenas funções de conveniência que encapsulam chamadas a funções com
nomes longos do próprio PHP, mas algumas delas (como a ``uses()``) podem
ser usadas para incluir código ou executar outras funções úteis. Se você
estiver constantemente pretendendo executar uma dada tarefa que acha que
deveria estar em uma função, é provável que tal função já esteja aqui.

\_\_
----

``__(string $string_id, boolean $return =  false)``

Esta função manipula localização (l10n) em aplicações CakePHP. O
parâmetro ``$string_id`` identifica o ID para uma tradução e o segundo
parâmetro indica se a função deve exibir a string automaticamente (o
comportamento padrão) ou se deve retorná-la para ser usada a posteriori
(passe um valor booleano true para habilitar este comportamento).

Confira a seção sobre `Localização &
Internacionalização </pt/view/161/localization-internationalizat>`_
deste manual para mais informações.

a
-

``a(mixed $one, $two, $three...)``

Retorna um array com os mesmos parâmetros usado para chamar função array
encapsulada.

::

    print_r(a('foo', 'bar')); 

    // saída:
    array(
       [0] => 'foo',
       [1] => 'bar'
    )

aa
--

``aa(string $one, $two, $three...)``

Usada para criar arrays associativos a partir dos parâmetros usados para
chamar a função encapsulada.

::

    echo aa('a','b'); 

    // saída:
    array(
        'a' => 'b'
    )

am
--

``am(array $one, $two, $three...)``

Mescla todos os arrays passados como parâmetros e retorna o array
resultante.

config
------

Pode ser usada para carregar arquivos a partir da pasta ``config`` de
sua aplicação através de uma chamada a include\_once. Esta função
verifica a existência do arquivo antes de incluí-lo, retornando um valor
booleano. Pode levar uma quantidade opcional de argumentos.

Exemplo: ``config('algum_arquivo', 'minhaconf');``

convertSlash
------------

``convertSlash(string $string)``

Converte barras para underscores e remove o primeiro e o último caracter
de underscore em uma string. Retorna a string convertida.

countdim
--------

``countdim(array $array)``

Retorna a quantidade de dimensões do array especificado.

debug
-----

``debug(mixed $var, boolean $showHtml = false)``

Se o nível de DEBUG da aplicação for diferente de zero, $var é exibida.
Se ``$showHTML`` for true, os dados são renderizados num formato HTML
amigável para o browser.

e
-

``e(mixed $data)``

Função de conveniência que encapsula uma chamada à ``echo()``.

env
---

``env(string $key)``

Obtém uma variável de ambiente a partir das fontes disponíveis.
Utilizada como um backup se as variáveis ``$_SERVER`` ou ``$_ENV``
estiverem desabilitadas.

Esta função também emula as variáveis PHP\_SELF e DOCUMENT\_ROOT nos
servidores que não as disponibilizam. Na verdade, é uma boa ideia usar
sempre ``env()`` ao invés de ``$_SERVER`` ou ``getenv()`` (especialmente
se você planeja distribuir o código), uma vez que é uma emulação
completa e uma garantia de acesso às variáveis.

fileExistsInPath
----------------

``fileExistsInPath(string $file)``

Verifica se o nome informado é de um arquivo que está presente no
momento no include\_path do PHP. Retorna um valor booleano.

h
-

``h(string $text, string $charset = null)``

Função de conveniência que encapsula uma chamada a
``htmlspecialchars()``.

ife
---

``ife($condition, $ifNotEmpty, $ifEmpty)``

Usada para operações similares à do operador ternário. Se o parâmetro
``$condition`` for não-vazio, ``$ifNotEmpty`` é retornado, do contrário
``$ifEmpty`` será retornado.

low
---

``low(string $string)``

Função de conveniência que encapsula uma chamada a ``strtolower()``.

paths
-----

``paths()``

Obtém os caminhos principais dentro do CakePHP como um array indexado. O
array resultante irá contem um array de caminhos indexados por: Models,
Behaviors, Controllers, Components e Helpers.

Esta função é considerada obsoleta e não está mais disponível a partir
do RC2. Utilize **Configure::corePaths();** em seu lugar.

pr
--

``pr(mixed $var)``

Função de conveniência que encapsula uma chamada a ``print_r()``, com a
diferença que a saída é exibida dentro das tags <pre>.

r
-

``r(string $search, string $replace, string  $subject)``

Função de conveniência que encapsula uma chamada a ``str_replace()``.

stripslashes\_deep
------------------

``stripslashes_deep(array $value)``

Remove recursivamente os caracteres de barra no array ``$value``
informado. Retorna o array modificado.

up
--

``up(string $string)``

Função de conveniência que encapsula uma chamada a ``strtoupper()``.

uses
----

``uses(string $lib1, $lib2, $lib3...)``

Usada para carregar bibliotecas do núcleo do CakePHP (encontrada em
cake/libs/). Informe o nome do arquivo da bilioteca sem a extensão
'.php'.

Principais Constantes Definidas
===============================

constante

Caminho absoluto para...

APP

diretório raiz da aplicação.

APP\_PATH

diretório app.

CACHE

diretório de arquivos de cache.

CAKE

diretório cake.

COMPONENTS

diretório de components.

CONFIGS

diretório dos arquivos de configuração.

CONTROLLER\_TESTS

diretório de testes de controllers.

CONTROLLERS

diretório dos controllers.

CSS

diretório dos arquivos CSS.

DS

Abreviação para a constante DIRECTORY\_SEPARATOR do PHP, que é igual a /
em sistemas Linux e \\ em windows.

ELEMENTS

diretório de elements.

HELPER\_TESTS

diretório de testes de helpers.

HELPERS

diretório de helpers.

IMAGES

diretório images.

INFLECTIONS

diretório de inflections (normalmente dentro do diretório de
configuração).

JS

diretório dos arquivos de JavaScript (dentro de webroot).

LAYOUTS

diretório de layouts.

LIB\_TESTS

diretório de testes das bibliotecas do CakePHP.

LIBS

diretório das bibliotecas do CakePHP.

LOGS

diretório de logs (dentro de app).

MODEL\_TESTS

diretório de testes de models.

MODELS

diretório de models.

SCRIPTS

diretório de scripts do Cake.

TESTS

diretório de testes (diretório-pai para os diretórios de testes de
models, controllers, etc.)

TMP

diretório tmp.

VENDORS

diretório de vendors.

VIEWS

diretório de views.

WWW\_ROOT

caminho completo do webroot.
