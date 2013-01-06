Text
####

O TextHelper contém métodos para tornar texto mais usável e amigável em
suas views. Este helper ajuda a habilitar links, formatar URLs, criar
excertos de texto entre palavras escolhidas ou frases, destacar
palavras-chave em blocos de texto e truncar trechos longos de texto.

**autoLinkEmails (string $text, array $htmlOptions=array())**

Adiciona links para endereços de e-mail bem-formados dentro de $text, de
acordo com quaisquer opções definidas em $htmlOptions (veja
HtmlHelper::link()).

::

    $my_text = 'Para mais informações sobre nossos doces e sobremesas mundialmente famosos, escreva para info@exemplo.com'; 
    $linked_text    = $text->autoLinkEmails($my_text);

    // $linked_text:
    Para mais informações sobre nossos doces e sobremesas mundialmente famosos, escreva para <a href="mailto:info@exemplo.com"><u>info@exemplo.com</u></a>

**autoLinkUrls ( string $text, array $htmlOptions=array() )**

O meso que autoLinkEmails(), exceto que este método procura por strings
que comecem com https, http, ftp, ou nntp e cria links apropriados a
partir delas.

**autoLink (string $text, array $htmlOptions=array())**

Combina a funcionalidade do autoLinkUrls() e do autoLinkEmails() no
texto informado em $text. Todas as URLs e e-mails são linkados
apropriadamente a partir das opções dadas em $htmlOptions.

**excerpt (string $haystack, string $needle, int $radius=100, string
$ending="...")**

Extrai um excerto a partir de $haystack, encapsulando $needle com alguns
caracteres em cada lado determinado por $radius e incluindo um sufixo
$ending. Este método é especialmente útil para resultados de busca. A
string da consulta ou palavras-chave podem ser destacadas dentro do
documento resultante.

::

    <?php echo $text->excerpt($ultimo_paragrafo, 'método', 50); ?> 
    // saída
    o por $radius e incluindo um sufixo $ending. Este método é especialmente útil para resultados de busca. A...

**highlight (string $haystack, string $needle, $highlighter= '<span
class="highlight">\\1</span>')**

Destaca o texto $needle em $haystack usando a string $highlighter
especificada.

::

    <?php echo $text->highlight($ultima_sentenca, 'usando'); ?> 
    // saída
    Destaca o texto $needle em $haystack usando a string <span class="highlight">$highlighter</span> especificada. 

**stripLinks ($text)**

Remove quaisquer links HTML que existam em $text.

**toList (array $list, $and= 'and')**

Cria uma lista de itens separados por vírgula sendo que os últimos dois
itens são unidos por ‘and’.

::

    <?php echo $text->toList($colors); ?> 
    // saída <br />red, orange, yellow, green, blue, indigo and violet

**truncate (string $text, int $length=100, string $ending= '...',
boolean $exact=true, boolean $considerHtml=false)**

**trim(); // um alias para truncate**

Trunca uma string pelo tamanho dado em $length e inclui $ending como
sufixo se o texto for maior do que $length. Se $exact for passado como
*false*, o truncamento vai acontecer depois do final da próxima palavra.
Se $considerHtml for passado como *true*, tags HTML serão respeitadas e
não serão truncadas.

::

    <?php    
    echo $text->truncate(
        'O assassino rastejou para a frente e tropeçou no tapete.',
        22,
        '...',
        false
    ); 
    ?> 

::

     // saída:
    O assassino rastejou...

