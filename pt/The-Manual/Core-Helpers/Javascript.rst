Javascript
##########

O helper Javascript é usado para ajudar na criação de tags e blocos de
código javascript bem-formados. Ele contém diversos métodos, alguns dos
quais foram desenvolvidos para funcionar com a biblioteca de Javascript
`Prototype <https://www.prototypejs.org>`_.

Métodos
=======

``codeBlock($script, $options = array('allowCache'=>true,'safe'=>true,'inline'=>true), $safe)``

-  string $script - o código Javascript a ser embutido em tags SCRIPT
-  array $options - um conjunto de opções:

   -  allowCache: booleano, define se este é um bloco armazenável com as
      configurações atuais de cache.
   -  safe: booleano, se este bloco deve ser delimitado por tags CDATA.
      O padrão é o definido na configuração do objeto helper.
   -  inline: booleano, se este bloco deve ser exibido inline, ou
      guardado para ser exibido depois na seção específica no cabeçalho
      do documento (i.e. $scripts\_for\_layout).

-  boolean $safe - OBSOLETO. Prefira utilizar $options['safe'] em seu
   lugar

O método codeBlock retorna um elemento de script formatado contendo o
código dado por $script. Mas também retorna null se o helper Javascript
estiver configurado para armazenar eventos em cache. Veja
JavascriptHelper::cacheEvents(). Este método também pode escrever na
variável de layout ``$scripts_for_layout`` se você definir a chave
$options['inline'] para false.

``blockEnd()``

Encerra um bloco de Javascript em cache. Pode retornar tanto uma tag de
fechamendo de script ou esvaziar o buffer, adicionando o conteúdo para o
array cachedEvents. Este método retorna um valor dependendo das
configurações de cache. Veja JavascriptHelper::cacheEvents()

``link($url, $inline)``

-  mixed $url - uma string URL para um arquivo Javascript ou um array de
   URLs.
-  boolean $inline - se for true, a tag <script> será exibida inline,
   caso contrário será escrita para a variável ``$scripts_for_layout``

Cria um link Javascript para um único arquivo ou para um conjunto de
arquivos Javascript. Pode escrever o conteúdo inline ou para a variável
``$scripts_for_layout``.

``escapeString($string)``

-  string $script - string que precisa ser escapada.

Escapa uma string num formato amigável para Javascript, permitindo assim
utilizá-la em blocos de código Javascript.

Os caracteres a serem escapados são:

-  "\\r\\n" => '\\n'
-  "\\r" => '\\n'
-  "\\n" => '\\n'
-  '"' => '\\"'
-  "'" => "\\\\'"

``event($object, $event, $observer, $useCapture)``

-  string $object - o objto DOM a ser observado.
-  string $event - tipo de evento a ser observado, como 'click' ou
   'over'.
-  string $observer - a função Javascript a ser chamada quando o evento
   ocorrer.
-  array $options - define as opções: useCapture, allowCache, safe

   -  boolean $options['useCapture'] - se deve disparar o evento na
      captura ou então borbulhar a fase de manipulação de evento. O
      padrão é false
   -  boolean $options['allowCache'] - veja
      JavascriptHelper::cacheEvents()
   -  boolean $options['safe'] - indica se os blocos <script /> devem se
      escritos 'seguramente', i.e., delimitados por blocos CDATA

Anexa um manipulador de evento Javascript especificado por $event para
um elemento DOM especificado por $object. O elemento em questão não
precisa ser uma referência por ID, mas pode ser qualquer objeto
Javascript válido ou mesmo seletores CSS. Se um seletor CSS for usado
para definir o manipulador de evento, ele é mantido em cache e deve ser
obtido com JavascriptHelper::getCache(). Este método necessida da
biblioteca Prototype.

``cacheEvents($file, $all)``

-  boolean $file - se true, o código será escrito para um arquivo
-  boolean $all - se true, todo o código escrito com o helper Javascript
   será enviado para um arquivo

Permite que você controle como o helper Javascript faz cache do código
dos tratadores de evento gerados por event(). Se $all for definido para
true, todo o código gerado pelo helper é mantido em cache e pode ser
obtido com getCache() ou escrito para um arquivo ou página com
writeCache().

``getCache($clear)``

-  boolean $clear - se definido para true, o cache de Javascript é
   limpo. O padrão é true.

Obtém (e limpa) o evento atual de Javascript do cache

``writeEvents($inline)``

-  boolean $inline - se true, retorna o código de evento Javascript.
   Caso contrário, é adicionado à saída da variável
   $scripts\_for\_layout no layout.

Retorna o código de Javascript que está em cache. Se $file foi definido
para true com cacheEvents(), code é post em cache para um arquivo e um
link de script para o arquivo de eventos em cache é retornado. Se inline
for true, o código de evento é retornado inline, caso contrário ele será
adicionado à variável $scripts\_for\_layout para a página.

``includeScript($script)``

-  string $script - o nome do arquivo de script a ser incluído.

Inclui o $script discriminado. Se $script for deixado em branco, o
helper irá incluir todos os scripts em seu diretório app/webroot/js
directory. Este método inclui o conteúdo de cada arquivo inline. Para
criar uma tag de script com um atributo src, utilize o método link().

``object($data, $options)``

-  array $data - os dados a serem convertidos
-  array $options - conjunto de opções entre: block, prefix, postfix,
   stringKeys, quoteKeys, q

   -  boolean $options['block'] - se true, encapsula o valor retornado
      em um bloco <script />. O padrão é false.
   -  string $options['prefix'] - prefixa a stringo aos dados
      retornados.
   -  string $options['postfix'] - anexa a string aos dados retornados.
   -  array $options['stringKeys'] - uma lista de índices de array a
      serem tratados como uma string.
   -  boolean $options['quoteKeys'] - se falso, trata $stringKey como
      uma lista que \*não\* será delimitada por aspas. O padrão é true.
   -  string $options['q'] - o tipo de aspas a usar.

Gera um objeto Javascript na notação de JavaScript Object Notation
(JSON) a partir do array $data.
