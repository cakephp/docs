Tratamento de Dados
###################

A classe Sanitize do CakePHP pode ser usada para tratar dados submetidos
por um usuário da aplicação, protegendo-a de dados maliciosos e outras
informações indesejáveis. Sanitize faz parte do núcleo do CakePHP,
podendo então ser utilizada em qualquer parte do seu código. Entretanto,
seu uso é mais adequado nos controlers ou nos models.

Tudo o que você precisa é incluir a classe Sanitize em seu código assim:

::

    App::import('Sanitize');

Feito isto, você pode fazer chamadas estáticas à classe Sanitize.

paranoid
========

paranoid(string $string, array $allowedChars);

Esta função gera a string de saída removendo tudo da entrada que não
sejam caracteres alfanuméricos. A função irá permitir alguns caracteres
desde que sejam passados no array $allowedChars.

::

    $badString = ";:<script><html><   // >@@#";
    echo Sanitize::paranoid($badString);
    // saída: scripthtml
    echo Sanitize::paranoid($badString, array(' ', '@'));
    // saída: scripthtml    @@

html
====

html(string $string, boolean $remove = false)

Este método prepara dados submetidos pelo usuário para exibição em um
conteúdo HTML. Isto é particularmente útil se você não quer que usuários
consigam quebrar o layout de sua aplicação ou inserir imagens ou scripts
em suas páginas HTML. Se a opção $remove for definida para true, o
conteúdo HTML detectado é removido ao invés de ser renderizado como
entidades HTML.

::

    $badString = '<font size="99" color="#FF0000">HEY</font><script>...</script>';
    echo Sanitize::html($badString);
    // saída: &lt;font size=&quot;99&quot; color=&quot;#FF0000&quot;&gt;HEY&lt;/font&gt;&lt;script&gt;...&lt;/script&gt;
    echo Sanitize::html($badString, true);
    // saída: HEY...

escape
======

escape(string $string, string $connection)

Usado para tratar declarações em SQL com a adição de barras de escape,
dependendo da configuração magic\_quotes\_gpc do sistema. $connection é
o nome da base de dados, definido em seu arquivo
app/config/databasel.php, em que o tratamento deve ser aplicado.

clean
=====

``Sanitize::clean(mixed $data, mixed $options)``

Este é um método de limpeza de dados de padrão industrial e multiuso, o
que quer dizer que ele foi feito para ser utilizado em arrays inteiros
(como o $this->data, por exemplo). O método recebe um array (ou uma
string) e retorna sua versão limpa. As seguintes operações de limpeza
são executadas em cada elemento do array (recursivamente):

-  Caracteres de espaçamento diversos quaisquer (incluindo 0xCA) são
   substituídos por espaços simples.
-  Forte verificação de caracteres especiais e remoção de quebras de
   linha para melhoria da segurança em SQL.
-  Adição de barras de escape para SQL (uma chamada interna ao método
   sql mostrado anteriormente).
-  Troca de barras invertidas da entrada do usuário por barras
   invertidas confiáveis.

O argumnto $options pode ser tanto uma string como um array. Quando uma
string for informada, significará o nome de uma conexão de base de
dados. Se um array for informado, ele poderá ser composto das seguintes
opções:

-  connection
-  odd\_spaces
-  encode
-  dollar
-  carriage
-  unicode
-  escape
-  backslash

Então, chamar o método clean() com opções seria algo como:

::

    $this->data = Sanitize::clean($this->data, array('encode' => false));

