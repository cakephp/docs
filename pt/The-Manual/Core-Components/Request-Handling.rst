Manipulando Requisições
#######################

O componente RequestHandler é usado para se obter informações adicionais
sobre as requisições HTTP feitas a sua aplicação CakePHP. Você pode
usá-lo para informar seus controllers sobre Ajax bem como obter dados
adicionais sobre os tipos de conteúdo que o cliente aceita e modificar
automaticamente o layout quando as extensões de arquivo estiverem
habilitadas.

Por padrão o RequestHandler vai detectar automaticamente requisições
Ajax com base no cabeçalho HTTP-X-Requested-With que muitas das
bibliotecas Javascript usam. Quando utilizado em conjunto com o
Router::parseExtensions(), o RequestHandler vai modificar
automaticamente os arquivos de layout e de views para aqueles que
correspondam ao tipo requisitado. Além disso, se um helper com o mesmo
nome da extensão requisitada existir, ele será adicionado ao array de
helpers do controller. Por fim, se dados XML forem submetidos para seus
controllers, eles serão convertidos em objetos XML os quais são
associados a Controller:data, podendo então serem salvos como dados de
model normalmente. Para fazer uso do RequestHandler ele deve estar
incluído no seu array de $components.

::

    <?php
    class WidgetController extends AppController {
        
        var $components = array('RequestHandler');
        
        // resto do controller
    }
    ?>

Obtendo Informações da Requisição
=================================

O componente RequestHandler possui vários métodos que proveem
informações sobre o cliente e sua requisição.

accepts ( $type = null)

$type pode ser uma string, um array ou null. Se for uma string, o método
accepts retornará verdadeiro se um cliente aceitar o tipo de conteúdo
dado. Se um array for especificado como parâmetro, o método accepts
retorna verdadeiro se qualquer um dos tipos de conteúdo for aceito pelo
cliente. Se o parâmetro for null, o método retorna um array de todos os
content-types que o cliente aceita. Por exemplo:

::

    class PostsController extends AppController {
        
        var $components = array('RequestHandler');

        function beforeFilter () {
            if ($this->RequestHandler->accepts('html')) {
                // Executa código só se o cliente aceita uma resposta em HTML (text/html)
            } elseif ($this->RequestHandler->accepts('xml')) {
                // Executa código com operações em XML
            }
            if ($this->RequestHandler->accepts(array('xml', 'rss', 'atom'))) {
                // Executa se o cliente aceita qualquer um dos tipos: XML, RSS ou Atom
            }
        }
    }

Outros 'tipos' (type) de deteção incluem:

isAjax()

Retorna verdadeiro se a requisição contiver um cabeçalho
X-Requested-Header igual a XMLHttpRequest.

isSSL()

Retorna verdadeiro se a requisição atual tiver sido feita sobre uma
conexão SSL.

isXml()

Retorna verdadeiro se a requisição atual aceitar XML como resposta.

isRss()

Retorna verdadeiro se a requisição atual aceitar RSS como resposta.

isAtom()

Retorna verdadeiro se a chamada atual aceitar Atom como resposta e falso
em caso contrário.

isMobile()

Retorna verdadeiro se a string do agente de usuário (user agent)
corresponder a um navegador web móvel, ou se o cliente aceitar conteúdo
WAP. As strings de agentes de usuário móveis aceitas são:

-  iPhone
-  MIDP
-  AvantGo
-  BlackBerry
-  J2ME
-  Opera Mini
-  DoCoMo
-  NetFront
-  Nokia
-  PalmOS
-  PalmSource
-  portalmmm
-  Plucker
-  ReqwirelessWeb
-  SonyEricsson
-  Symbian
-  UP.Browser
-  Windows CE
-  Xiino

isWap()

Retorna verdadeiro se o cliente aceitar conteúdo WAP.

Todos os métodos de deteção de requisição podem ser usados de forma
semelhante à funcionalidade de filtragem pretendida para dados tipos de
conteúdo. Por exemplo, ao responder a requisições Ajax, você quase
sempre vai querer desabilitar o cache do navegador web e mudar o nível
de debug. No entanto, você vai querer permitir cache para requisições
não-Ajax. O código a seguir deve bastar para fazer isso:

::

        if ($this->RequestHandler->isAjax()) {
            Configure::write('debug', 0);
            $this->header('Pragma: no-cache');
            $this->header('Cache-control: no-cache');
            $this->header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        }
        // Continua a ação do controller

Você também pode desabilitar o cache com o método análogo
``Controller::disableCache``

::

        if ($this->RequestHandler->isAjax()) {
            $this->disableCache();
        }
        // Contrinua a ação do controller

Deteção do Tipo de Requisição
=============================

O RequestHandler também dispõe de informação sobre o tipo de requisição
HTTP que é feita, permitindo a você dar uma resposta específica a cada
tipo de requisição..

isPost()

Retorna verdadeiro se a requisição for uma requisição do tipo POST.

isPut()

Retorna verdadeiro se a requisição for uma requisição do tipo PUT.

isGet()

Retorna verdadeiro se a requisição for uma requisição do tipo GET.

isDelete()

Retorna verdadeiro se a requisição for uma requisição do tipo DELETE.

Obtendo Informações Adicionais do Cliente
=========================================

getClientIP()

Obtém o endereço IP remoto do cliente.

getReferrer()

Retorna o nome de domínio a partir do qual a requisição foi originada.

getAjaxVersion()

Obtém a versão do Prototype no caso de uma chamada Ajax, caso contrário
retorna uma string vazia. A biblioteca Prototype define o cabeçalho HTTP
especial "Prototype version".

Respondendo a Requisições
=========================

Além da deteção de requisição, o RequestHandler também possibilita fácil
acesso a alteração da saída e dos mapeamentos de tipo de conteúdo para
sua aplicação.

setContent($name, $type = null)

-  $name string - O nome do Content-type ie. html, css, json, xml.
-  $type mixed - O(s) mime-type(s) para os quais o conteúdo são
   mapeados.

O método setContent define/adiciona os tipos de conteúdo (Content-types)
para um dado nome. Ele permite que os tipos de conteúdo sejam mapeados
para aliases amigáveis e/ou extensões. Isto possibilita ao
RequestHandler respondere automaticamente às requisições de cada tipo em
seu método de inicialização. Além do mais, estes tipos de conteúdo são
usados pelos métodos prefers() e accepts().

O setContent é mais adequado a ser usado dentro do beforeFilter() de
seus controllers, que é o lugar em que a automágica do mapeamento de
conteúdo acontece.

Os mapeamentos já definidos por padrão são:

-  **javascript** text/javascript
-  **js** text/javascript
-  **json** application/json
-  **css** text/css
-  **html** text/html, \*/\*
-  **text** text/plain
-  **txt** text/plain
-  **csv** application/vnd.ms-excel, text/plain
-  **form** application/x-www-form-urlencoded
-  **file** multipart/form-data
-  **xhtml** application/xhtml+xml, application/xhtml, text/xhtml
-  **xhtml-mobile** application/vnd.wap.xhtml+xml
-  **xml** application/xml, text/xml
-  **rss** application/rss+xml
-  **atom** application/atom+xml
-  **amf** application/x-amf
-  **wap** text/vnd.wap.wml, text/vnd.wap.wmlscript, image/vnd.wap.wbmp
-  **wml** text/vnd.wap.wml
-  **wmlscript** text/vnd.wap.wmlscript
-  **wbmp** image/vnd.wap.wbmp
-  **pdf** application/pdf
-  **zip** application/x-zip
-  **tar** application/x-tar

prefers($type = null)

Determina por qual tipo de conteúdo o cliente tem preferência. Se nenhum
parâmetro for dado, o tipo de conteúdo com mais afinidade é retornado.
Se $type for um array, o primeiro tipo que o cliente aceitar será
retornado. A preferência é determinada principalmente pela extensão de
arquivo tratada pelo Router se alguma for informada, e em segundo lugar,
pela lista de content-types no cabeçalho HTTP\_ACCEPT.

renderAs($controller, $type)

-  $controller - Referência ao controller
-  $type - nome amigável do content-type com o qual o conteúdo será
   renderizado, p.ex., xml, rss.

Modifica o modo de renderização de um controller para um tipo
específico. Também irá anexar o helper apropriado ao array de helpers do
controller, se estiver disponível e já não estiver incluso no array.

respondAs($type, $options)

-  $type - Nome amigável do content-type, p.ex., xml rss ou uma
   descrição completa do tipo, como em application/x-shockwave
-  $options - Se $type for um nome de tipo amigável que tenha mais de um
   conteúdo mapeado, $index é usado para selecionar o tipo de conteúdo.

Define o cabeçalho de resposta baseado nos mapeamentos dos tipos de
conteúdo. Se DEBUG for maior que 2, o header não é definido.

responseType()

Retorna o tipo de resposta atual do cabeçalho Content-type ou null se
este ainda estiver para ser definido.

mapType($ctype)

Mapeia um tipo de conteúdo de volta para um alias.
