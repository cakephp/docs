Texto
#####

.. php:namespace:: Cake\Utility

.. php:class:: Text

A classe Text inclui métodos de conveniência para criar e manipular
strings e é normalmente acessada estaticamente. Exemplo:
``Text::uuid()``.

Se você precisa das funcionalidades do :php:class:`Cake\\View\\Helper\\TextHelper` fora
de uma ``View``, use a classe ``Text``::

    namespace App\Controller;

    use Cake\Utility\Text;

    class UsersController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Auth')
        };

        public function afterLogin()
        {
            $message = $this->Users->find('new_message')->first();
            if (!empty($message)) {
                // Notificar usuário sobre nova mensagem
                $this->Flash->success(__(
                    'Você tem uma nova mensagem: {0}',
                    Text::truncate($message['Message']['body'], 255, ['html' => true])
                ));
            }
        }
    }

Converter Strings para ASCII
=============================

.. php:staticmethod:: transliterate($string, $transliteratorId = null)

Transliterate por padrão converte todos os caracteres na string fornecida em
caracteres ASCII equivalentes. O método espera codificação UTF-8. A conversão de caracteres
pode ser controlada usando identificadores de transliteração que você pode
passar usando o argumento ``$transliteratorId`` ou alterar a string de identificador padrão
usando ``Text::setTransliteratorId()``. Identificadores de transliteração ICU
são basicamente da forma ``<script origem>:<script destino>`` e você pode especificar
múltiplos pares de conversão separados por ``;``. Você pode encontrar mais informações sobre
identificadores de transliterador
`aqui <https://unicode-org.github.io/icu/userguide/transforms/general/#transliterator-identifiers>`_::

    // apple puree
    Text::transliterate('apple purée');

    // Ubermensch (apenas caracteres latinos são transliterados)
    Text::transliterate('Übérmensch', 'Latin-ASCII;');

Criando Strings Seguras para URL
=================================

.. php:staticmethod:: slug(string $string, array|string $options = [])

Slug transliterate todos os caracteres em versões ASCII e converte caracteres não correspondentes
e espaços em traços. O método slug espera codificação UTF-8.

Você pode fornecer um array de opções que controla slug. ``$options`` também pode ser
uma string, caso em que ela será usada como string de substituição. As opções
suportadas são:

* ``replacement`` String de substituição, padrão é '-'.
* ``transliteratorId`` Uma string de id de transliterador válida. Se o padrão ``null``
  ``Text::$_defaultTransliteratorId`` será usado.
  Se ``false`` nenhuma transliteração será feita, apenas não-palavras serão removidas.
* ``preserve`` Caractere não-palavra específico para preservar. Padrão é ``null``.
  Por exemplo, esta opção pode ser definida como '.' para gerar nomes de arquivo limpos::

    // apple-puree
    Text::slug('apple purée');

    // apple_puree
    Text::slug('apple purée', '_');

    // foo-bar.tar.gz
    Text::slug('foo bar.tar.gz', ['preserve' => '.']);

Gerando UUIDs
=============

.. php:staticmethod:: uuid()

O método UUID é usado para gerar identificadores únicos conforme :rfc:`4122`. O
UUID é uma string de 128 bits no formato
``485fc381-e790-47a3-9794-1337c0a8fe68``. ::

    Text::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68

Análise Simples de String
==========================

.. php:staticmethod:: tokenize(string $data, string $separator = ',', string $leftBound = '(', string $rightBound = ')')

Tokeniza uma string usando ``$separator``, ignorando qualquer instância de ``$separator``
que apareça entre ``$leftBound`` e ``$rightBound``.

Este método pode ser útil ao dividir dados que têm formatação regular
como listas de tags::

    $data = "cakephp 'great framework' php";
    $result = Text::tokenize($data, ' ', "'", "'");
    // Result contém
    ['cakephp', "'great framework'", 'php'];

.. php:method:: parseFileSize(string $size, mixed $default = false)

Este método desformata um número de tamanho de byte legível por humanos para um número
inteiro de bytes::

    $int = Text::parseFileSize('2GB');

Formatando Strings
==================

.. php:staticmethod:: insert(string $str, array $data, array $options = [])

O método insert é usado para criar templates de string e permitir substituições de chave/valor::

    Text::insert(
        'Meu nome é :name e eu tenho :age anos.',
        ['name' => 'Bob', 'age' => '65']
    );
    // Retorna: "Meu nome é Bob e eu tenho 65 anos."

.. php:staticmethod:: cleanInsert(string $str, array $options)

Limpa uma string formatada com ``Text::insert`` com as ``$options`` fornecidas dependendo
da chave 'clean' em ``$options``. O método padrão usado é text, mas html também está
disponível. O objetivo desta função é substituir todos os espaços em branco e
marcação desnecessária ao redor de placeholders que não foram substituídos por
``Text::insert``.

Você pode usar as seguintes opções no array de opções::

    $options = [
        'clean' => [
            'method' => 'text', // ou html
        ],
        'before' => '',
        'after' => ''
    ];

Quebrando Texto
===============

.. php:staticmethod:: wrap(string $text, array|int $options = [])

Quebra um bloco de texto em uma largura definida e indenta blocos também.
Pode quebrar texto de forma inteligente para que palavras não sejam cortadas entre linhas::

    $text = 'Esta é a música que nunca termina.';
    $result = Text::wrap($text, 22);

    // Retorna
    Esta é a música que
    nunca termina.

Você pode fornecer um array de opções que controla como a quebra é feita. As
opções suportadas são:

* ``width`` A largura para quebrar. Padrão é 72.
* ``wordWrap`` Se deve quebrar palavras inteiras ou não. Padrão é ``true``.
* ``indent`` O caractere para indentar linhas. Padrão é ''.
* ``indentAt`` O número da linha para começar a indentar o texto. Padrão é 0.

.. php:staticmethod:: wrapBlock(string $text, array|int $options = [])

Se você precisa garantir que a largura total do bloco gerado não
exceda um certo comprimento mesmo com indentação interna, você precisa usar
``wrapBlock()`` em vez de ``wrap()``. Isso é particularmente útil para gerar
texto para o console, por exemplo. Aceita as mesmas opções que ``wrap()``::

    $text = 'Esta é a música que nunca termina. Esta é a música que nunca termina.';
    $result = Text::wrapBlock($text, [
        'width' => 22,
        'indent' => ' → ',
        'indentAt' => 1
    ]);

    // Retorna
    Esta é a música que
     → nunca termina. Esta
     → é a música que
     → nunca termina.

.. start-text

Destacando Substrings
=====================

.. php:method:: highlight(string $text, array|string $phrase, array $options = [])

Destaca ``$phrase`` em ``$text`` usando a string ``$options['format']``
especificada ou uma string padrão.

Opções:

-  ``format`` string - O pedaço de HTML com a frase que será
   destacada
-  ``html`` bool - Se ``true``, irá ignorar quaisquer tags HTML, garantindo que apenas
   o texto correto seja destacado

Exemplo::

    // Chamado como TextHelper
    echo $this->Text->highlight(
        $lastSentence,
        'usando',
        ['format' => '<span class="highlight">\1</span>']
    );

    // Chamado como Text
    use Cake\Utility\Text;

    echo Text::highlight(
        $lastSentence,
        'usando',
        ['format' => '<span class="highlight">\1</span>']
    );

Saída:

.. code-block: html

    Destaca $phrase em $text <span class="highlight">usando</span> a
    string $options['format'] especificada ou uma string padrão.

Truncando Texto
===============

.. php:method:: truncate(string $text, int $length = 100, array $options = [])

Se ``$text`` for maior que ``$length``, este método o trunca em ``$length``
e adiciona um sufixo consistindo de ``'ellipsis'``, se definido. Se ``'exact'`` for
passado como ``false``, o truncamento ocorrerá no primeiro espaço em branco após o
ponto em que ``$length`` for excedido. Se ``'html'`` for passado como ``true``,
tags HTML serão respeitadas e não serão cortadas.

``$options`` é usado para passar todos os parâmetros extras, e tem as seguintes
chaves possíveis por padrão, todas opcionais::

    [
        'ellipsis' => '...',
        'exact' => true,
        'html' => false
    ]

Exemplo::

    // Chamado como TextHelper
    echo $this->Text->truncate(
        'O assassino avançou e tropeçou no tapete.',
        22,
        [
            'ellipsis' => '...',
            'exact' => false
        ]
    );

    // Chamado como Text
    use Cake\Utility\Text;

    echo Text::truncate(
        'O assassino avançou e tropeçou no tapete.',
        22,
        [
            'ellipsis' => '...',
            'exact' => false
        ]
    );

Saída::

    O assassino...

Truncando o Final de uma String
================================

.. php:method:: tail(string $text, int $length = 100, array $options = [])

Se ``$text`` for maior que ``$length``, este método remove uma
substring inicial com comprimento consistindo da diferença e adiciona um prefixo
consistindo de ``'ellipsis'``, se definido. Se ``'exact'`` for passado como ``false``,
o truncamento ocorrerá no primeiro espaço em branco antes do ponto em que
o truncamento ocorreria de outra forma.

``$options`` é usado para passar todos os parâmetros extras, e tem as seguintes
chaves possíveis por padrão, todas opcionais::

    [
        'ellipsis' => '...',
        'exact' => true
    ]

Exemplo::

    $sampleText = 'Eu arrumei minha mala e nela coloquei um PSP, um PS3, uma TV, ' .
        'um programa C# que pode dividir por zero, camisetas de death metal'

    // Chamado como TextHelper
    echo $this->Text->tail(
        $sampleText,
        70,
        [
            'ellipsis' => '...',
            'exact' => false
        ]
    );

    // Chamado como Text
    use Cake\Utility\Text;

    echo Text::tail(
        $sampleText,
        70,
        [
            'ellipsis' => '...',
            'exact' => false
        ]
    );

Saída::

    ...uma TV, um programa C# que pode dividir por zero, camisetas de death metal

Extraindo um Trecho
===================

.. php:method:: excerpt(string $text, string $phrase, int $radius = 100, string $ellipsis = '…')

Extrai um trecho de ``$text`` ao redor da ``$phrase`` com um número
de caracteres de cada lado determinado por ``$radius``, e prefixo/sufixo com
``$ellipsis``. Este método é especialmente útil para resultados de pesquisa. A string de consulta
ou palavras-chave podem ser mostradas dentro do documento resultante. ::

    // Chamado como TextHelper
    echo $this->Text->excerpt($lastParagraph, 'método', 50, '...');

    // Chamado como Text
    use Cake\Utility\Text;

    echo Text::excerpt($lastParagraph, 'método', 50, '...');

Saída::

    ... por $radius, e prefixo/sufixo com $ellipsis. Este método é especialmente
    útil para resultados de pesquisa. A consulta...

Convertendo um Array para Forma de Sentença
============================================

.. php:method:: toList(array $list, ?string $and = null, $separator = ', ')

Cria uma lista separada por vírgulas onde os dois últimos itens são unidos com 'e'::

    $colors = ['vermelho', 'laranja', 'amarelo', 'verde', 'azul', 'índigo', 'violeta'];

    // Chamado como TextHelper
    echo $this->Text->toList($colors);

    // Chamado como Text
    use Cake\Utility\Text;

    echo Text::toList($colors);

Saída::

    vermelho, laranja, amarelo, verde, azul, índigo e violeta

.. end-text

.. meta::
    :title lang=pt: Texto
    :keywords lang=pt: slug,transliterate,ascii,array php,array name,string options,data options,result string,class string,string data,string class,placeholders,default method,key value,markup,rfc,replacements,convenience,templates
