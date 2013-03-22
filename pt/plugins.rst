Plugins
#######

CakePHP permite que você defina uma combinação de controllers, models,
e views e lance-os como um pacote de aplicação que outras pessoas podem 
usar em suas aplicações CakePHP. Você quer ter um módulo de gestão de 
usuários, um blog simples, ou um módulo de serviços web em uma das suas 
aplicações? Empacote-os como um plugin do CakePHP para que você possa 
colocá-lo em outras aplicações.

A principal diferença entre um plugin e a aplicação em que ele é 
instalado, é a configuração da aplicação (base de dados, conexão, etc.).
Caso contrário, ele opera em seu próprio espaço, comportando-se como se
fosse uma aplicação por conta própria.

Instalando um Plugin
--------------------

Para instalar um plugin, basta simplesmente colocar a pasta plugin 
dentro do diretório app/Plugin. Se você está instalando um plugin 
chamado 'ContactManager', então você deve ter uma pasta dentro de 
app/Plugin chamado 'ContactManager' em que podem estar os diretórios de 
plugin: View, Model, Controller, webroot, e qualquer outro diretório.

Novo para CakePHP 2.0, plugins precisam ser carregados manualmente em 
app/Config/bootstrap.php.

Você pode carregá-los um por um ou todos eles em uma única chamada:: 

    CakePlugin::loadAll(); // Carrega todos os plugins de uma vez
    CakePlugin::load('ContactManager'); // Carrega um único plugin

loadAll carrega todos os plugins disponíveis, enquanto permite que você 
defina certas configurações para plugins específicos. load() funciona de
maneira semelhante, mas carrega somente os plugins que você especificar 
explicitamente.

Há uma porção de coisas que você pode fazer com os métodos load e 
loadAll para ajudar com a configuração do plugin e roteamento. Talvez 
você tenha que carregar todos os plugins automaticamente, enquanto 
especifica rotas personalizadas e arquivos de bootstrap para certos 
plugins.

Sem problema::

    CakePlugin::loadAll(array(
        'Blog' => array('routes' => true),
        'ContactManager' => array('bootstrap' => true),
        'WebmasterTools' => array('bootstrap' => true, 'routes' => true),
    ));

Com este estilo de configuração, você não precisa mais fazer manualmente um
include() ou require() de arquivo de configuração do plugin ou rotas --
acontece automaticamente no lugar e na hora certa. Os exatos mesmos parâmetros 
também poderiam ter sido fornecidos ao método load(), o que teria carregado 
apenas aqueles três plugins, e não o resto.

Finalmente, você pode especificar também um conjunto de padrões para loadAll
que se aplicará a cada plugin que não tem uma configuração mais específica.


Carrega o arquivo bootstrap de todos os plugins, e as rotas do plugin Blog::
    
    CakePlugin::loadAll(array(
        array('bootstrap' => true),
        'Blog' => array('routes' => true)
    ));

Note que todos os arquivos especificados devem realmente existir no plugin(s)
configurado ou o PHP irá dar avisos (warnings) para cada arquivo que não pôde
carregar. Isto é especialmente importante para lembrar ao especificar padrões
para todos os plugins.


Alguns plugins precisam que seja criado uma ou mais tabelas em sua
base de dados. Nesses casos, muitas vezes eles vão incluir um arquivo de 
esquema que você pode chamar a partir do cake shell dessa forma::

    user@host$ cake schema create --plugin ContactManager

A maioria dos plugins indicará o procedimento adequado para a configurá-los e
configurar a base de dados, em sua documentação. Alguns plugins irão exigir 
mais configurações do que outros.

Usando um Plugin
----------------

Você pode referenciar controllers, models, components, behaviors, e helpers
de um plugin, prefixando o nome do plugin antes do nome da classe.

Por exemplo, digamos que você queira usar o ContactInfoHelper do plugin
CantactManager para a saída de algumas informações de contato em uma de suas
views. Em seu controller, seu array $helpers poderia ser assim::

    public $helpers = array('ContactManager.ContactInfo');

Você então será capaz de acessar o ContactInfoHelper como qualquer outro 
helper em sua view, tal como::

    echo $this->ContactInfo->address($contact);


Criando Seus Próprios Plugins
-----------------------------

Como um exemplo de trabalho, vamos começar a criar o plugin ContactManager
referenciado acima. Para começar, vamos montar a nossa estrutura básica de 
plugins. Ela deve se parecer com isso::

    /app
        /Plugin
            /ContactManager
                /Controller
                    /Component
                /Model
                    /Behavior
                /View
                    /Helper
                    /Layouts

Note o nome da pasta do plugin, '**ContactManager**'. É importante que 
essa pasta tenha o mesmo nome do plugin.
                    
Dentro da pasta do plugin, você verá que se parece muito com uma aplicação 
CakePHP, e que basicamente é isso mesmo. Você realmente não tem que incluir
qualquer uma dessas pastas se você não for usá-las. Alguns plugins podem 
definir somente um Component e um Behavior, e nesse caso eles podem omitir 
completamente o diretório 'View'.

Um plugin pode também ter basicamente qualquer um dos outros diretórios que 
sua aplicação pode, como Config, Console, Lib, webroot, etc.

.. note::

	Se você quer ser capaz de acessar seu plugin com uma URL, é necessário 
	definir um AppController e AppModel para o plugin. Estas duas classes 
	especiais são nomeadas após o plugin, e estendem AppController e AppModel 
	da aplicação pai. Aqui está o que deve ser semelhante para nosso
	exemplo ContactManager:

::

    // /app/Plugin/ContactManager/Controller/ContactManagerAppController.php:
    class ContactManagerAppController extends AppController {
    }

::

    // /app/Plugin/ContactManager/Model/ContactManagerAppModel.php:
    class ContactManagerAppModel extends AppModel {
    }

Se você se esqueceu de definir estas classes especiais, o CakePHP irá entregar
a você erros "Missing Controller" até que você tenha feito isso.

Por favor, note que o processo de criação de plugins pode ser muito 
simplificado usando o Cake shell.

Para assar um plugin por favor use o seguinte comando::

    user@host$ cake bake plugin ContactManager

Agora você pode assar usando as mesmas convenções que se aplicam ao resto de 
sua aplicação. Por exemplo - assando controllers::

    user@host$ cake bake controller Contacts --plugin ContactManager

Por favor consulte o capítulo
:doc:`/console-and-shells/code-generation-with-bake` se você tiver quaisquer 
problemas com o uso da linha de comando.


Plugin Controllers
------------------

Controllers de nosso plugin ContactManager serão armazenados em 
/app/Plugin/ContactManager/Controller/. Como a principal coisa que vamos
fazer é a gestão de contatos, vamos precisar de um ContactsController para este 
plugin.

Então, nós colocamos nosso novo ContactsController em
/app/Plugin/ContactManager/Controller e deve se parecer com isso::

    // app/Plugin/ContactManager/Controller/ContactsController.php
    class ContactsController extends ContactManagerAppController {
        public $uses = array('ContactManager.Contact');

        public function index() {
            //...
        }
    }

.. note::

    Este controller estende o AppController do plugin (chamado 
    ContactManagerAppController) ao invés do AppController da 
    aplicação pai.

    Observe também como o nome do model é prefixado com o nome do 
    plugin. Isto é necessário para diferenciar entre models do plugin 
    e models da aplicação principal.

    Neste caso, o array $uses não seria necessário com
    ContactManager. Contact seria o model padrão para este 
    controller, no entanto está incluído para demostrar adequadamente 
    como preceder o nome do plugin.

Se você quiser acessar o que nós fizemos até agora, visite 
/contact_manager/contacts. Você deve obter um erro "Missing Model"
porque não temos um model Contact definido ainda.

.. _plugin-models:

Plugin Models
-------------

Models para plugins são armazenados em /app/Plugin/ContactManager/Model. 
Nós já definimos um ContactsController para este plugin, então vamos 
criar o model para o controller, chamado Contact::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
    }

Visitando /contact_manager/contacts agora (dado que você tem uma 
tabela em seu banco de dados chamada ‘contacts’) deveria nos dar um 
erro “Missing View”.
Vamos criar na próxima.

.. note::

	Se você precisar fazer referência a um model dentro de seu plugin, 
	você precisa incluir o nome do plugin com o nome do model, 
	separados por um ponto. 
	
Por exemplo::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
        public $hasMany = array('ContactManager.AltName');
    }

Se você preferir que as chaves do array para associação não tenha o 
prefixo do plugin nelas, use uma sintaxe alternativa::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
        public $hasMany = array(
            'AltName' => array(
                'className' => 'ContactManager.AltName'
            )
        );
    }

Plugin Views
------------

Views se comportam exatamente como fazem em aplicações normais. 
Basta colocá-las na pasta certa dentro de 
/app/Plugin/[PluginName]/View/. Para nosso plugin ContactManager, vamos 
precisar de uma view para nosso action ContactsController::index(), 
por isso vamos incluir isso como::

    // /app/Plugin/ContactManager/View/Contacts/index.ctp:
    <h1>Contacts</h1>
    <p>Following is a sortable list of your contacts</p>
    <!-- A sortable list of contacts would go here....-->

.. note::

	Para obter informações sobre como usar elements de um plugin, 
	veja :ref:`view-elements`

Substituindo views de plugins de dentro da sua aplicação 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Você pode substituir algumas views de plugins de dentro da sua app 
usando caminhos especiais. Se você tem um plugin chamado 
'ContactManager' você pode substituir os arquivos de view do plugin
com lógicas de view da aplicação específica criando arquivos usando 
o modelo a seguir "app/View/Plugin/[Plugin]/[Controller]/[view].ctp". 
Para o controller Contacts você pode fazer o seguinte arquivo::

	/app/View/Plugin/ContactManager/Contacts/index.ctp

A criação desse, permite a você substituir 
"/app/Plugin/ContactManager/View/Contacts/index.ctp".

.. _plugin-assets:


Imagens de Plugin, CSS e Javascript
-----------------------------------

Imagens, css e javascript de um plugin (mas não arquivos PHP), podem ser servidos por 
meio do diretório de plugin 'webroot', assim como imagens, css e javascript da aplicação 
principal::

    app/Plugin/ContactManager/webroot/
                                        css/
                                        js/
                                        img/
                                        flash/
                                        pdf/

Você pode colocar qualquer tipo de arquivo em qualquer diretório, 
assim como um webroot normal. A única restrição é que ``MediaView`` 
precisa saber o mime-type do arquivo.

Linkando para imagens, css e javascript em plugins
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Basta preceder /plugin_name/ no início de um pedido para um arquivo 
dentro do plugin, e ele vai funcionar como se fosse um arquivo do 
webroot de sua aplicação.  

Por exemplo, linkando para '/contact_manager/js/some_file.js'
deveria servir o arquivo
'app/Plugin/ContactManager/webroot/js/some_file.js'.

.. note::

	É importante notar o **/your_plugin/** prefixado antes do caminho
	do arquivo. Isso faz a magica acontecer!


Components, Helpers e Behaviors
-------------------------------

Um plugin pode ter Conponents, Helpers e Behaviors como uma aplicação
CakePHP normal. Você pode até criar plugins que consistem apenas de 
Components, Helpers ou Behaviors que podem ser uma ótima maneira de 
contruir componentes reutilizáveis que podem ser facilmente acoplados 
em qualquer projeto.

A construção destes componentes é exatamente o mesmo que contruir 
dentro de uma aplicação normal, sem convenção especial de nomenclatura.

Referindo-se ao seu componente de dentro ou fora do seu plugin, exige 
somente que o nome do plugin esteja prefixado antes do nome do 
componente. Por exemplo::

    // Componente definido no plugin 'ContactManager'
    class ExampleComponent extends Component {
    }
    
    // dentro de seu controller:
    public $components = array('ContactManager.Example'); 

A mesma técnica se aplica aos Helpers e Behaviors.

.. note::

    Ao criar Helpers você pode notar que AppHelper não está disponível 
    automaticamente. Você deve declarar os recursos que precisar com 
    Uses::
	
        // Declare o uso do AppHelper para seu Helper Plugin
        App::uses('AppHelper', 'View/Helper');

Expanda seu Plugin
------------------

Este exemplo criou um bom começo para um plugin, mas há muito mais 
coisas que você pode fazer. Como uma regra geral, qualquer coisa que 
você pode fazer com sua aplicação, você pode fazer dentro de um plugin 
em seu lugar.

Vá em frente, inclua algumas bibliotecas de terceiros em 'Vendor', 
adicione algumas novas shells para o cake console, e não se esqueça de 
criar casos de testes para que usuários de seus plugins possam testar 
automaticamente as funcionalidades de seus plugins!

Em nosso exemplo ContactManager, poderíamos criar os actions 
add/remove/edit/delete em ContactsController, implementar a validação 
no model Contact, e implementar uma funcionalidade que poderia se 
esperar ao gerenciar seus contatos. Cabe a você decidir o que 
implementar em seus plugins. Só não se esqueça de compartilhar seu 
código com a comunidade para que todos possam se beneficiar de seus 
impressionantes componentes reutilizáveis! 

Plugin Dicas
------------

Uma vez que o plugin foi instalado em /app/Plugin, você pode acessá-lo
através da URL /plugin_name/controller_name/action. Em nosso plugin 
ContactManager de exemplo, acessamos nosso ContactsController 
com /contact_manager/contacts.

Algumas dicas finais sobre como trabalhar com plugins em suas 
aplicações CakePHP:


-  Quando você não tiver um [Plugin]AppController e [Plugin]AppModel, 
   você terá um erro Missing Controller quando estiver tentando 
   acessar um controller de plugin.
-  Você pode definir seus layouts para plugins, dentro de 
   app/Plugin/[Plugin]/View/Layouts. Caso contrário, o plugin irá 
   utilizar por padrão os layouts da pasta /app/View/Layouts.
-  Você pode fazer um inter-plugin de comunicação usando 
   ``$this->requestAction('/plugin_name/controller_name/action');``
   em seus controllers.  
-  Se você usar requestAction, esteja certo que os nomes dos 
   controllers e das models sejam tão únicos quanto possível. Caso 
   contrário você poderá obter do PHP o erro "redefined class ..."


.. meta::
    :title lang=pt: Plugins
    :keywords lang=pt: pasta plugin,configurando base de dados,bootstrap,módulo gestão,próprio espaço,conexão base de dados,webroot,gestão usuário,contactmanager,array,config,cakephp,models,php,diretórios,blog,plugins,aplicações
