Modelos
#######

Modelos são classes que formão a camada de negócios de sua aplicação.

Eles devem ser responsáveis ​​pela gestão de quase tudo
a respeito de seus dados, a sua validade , e as suas interacções , bem como a evolução
do fluxo de informações de seu domínio.

Normalmente, classes de modelo representam dados e são usadas pelas aplicações 
CakePHP ara acessar os dados. Geralmente representam uma tabela do banco de dados, mas podem ser 
usados para acessar qualquer coisa que manipule dados como arquivos, 
web services de terceiros ou eventos de iCal.

Um modelo pode ser associado com outro modelo. Por exemplo, uma Receita
pode ser associada com um Autor bem como com um Ingrediente.

Esta sessão explicará quais as características de um modelo pode ser automatizada,
como sobrescrevê-las, e quais são elas. Também explicará as diferentes formas de criar
associações para seus dados. Descreverá como buscar, salvar e deletar os dados.
Finalmente, iremos falar sobre Datasources.


Entendendo Modelos
==================

Um **Modelo** (Model) representa um modelo lógico de seus dados.
Em programação orientada a objeto, um **Modelo** é um objeto que 
representa uma coisa como um carro, uma pessoa ou um cavalo. Um blog, 
por exemplo pode ter muitos posts e cada post pode ter muitos comentários.
O Blog, Post e Comentário são exemplos de **Modelos**, e são associados um ao outro.

Abaixo temos um simples exemplo de definição de Modelo no CakePHP::

    App::uses('AppModel', 'Model');
    class Ingrediente extends AppModel {
        public $name = 'Ingrediente';
    }

Com apenas esta simples declaração, o modelo Ingrediente agora recebe todos as 
funcionalidades que você precisa para fazer suas buscas, salvar e deletar dados.
Estes métodos vem da classe Model do CakePHP pela magia da Herança. O modelo Ingrediente
herda (extends) do modelo de aplicação do CakePHP, AppModel, que herda da classe 
interna de Modelo do CakePHP (Model class).
E é esta classe Model do núcleo do CakePHP que dá a seu modelo Ingrediente superpoderes 
para fazer buscas, salvar, atualizar e deletar seus dados no Banco de Dados.
``App::uses('AppModel', 'Model')`` asegura que a Model seja carregada quando for necessário.

Mas então para que serve a classe AppModel?
Ela é uma classe vazia que você poderá utilizar para reescrever as funcionalidades da classe Model
e definir novos métodos que seram compartilhadas a todos os outros modelos de sua aplicação. 
Você pode fazer isso através do arquivo ``AppModel.php`` que ica dentro da pasta Model.
Criando um projeto usando :doc:`Bake <console-and-shells/code-generation-with-bake>` irá gerar automáticamente
este arquivo para você.
Veja também :doc:`Comportamentos(Behaviors) <models/behaviors>` para mais informações sobre
como aplicar lógica similar a múltiplos modelos.

Mas vamos voltar ao nosso modelo Ingrediente. Afim de trabalhar com ele, criamos o arquivo PHP no
diretório ``/app/Model/``. Por conveção ele deve ter o mesmo nome que a classe, que neste caso
será ``Ingrediente.php``.

.. note::

    O CakePHP  irá criar dinamicamente um objeto modelo para você se não conseguir encontrar um arquivo
    correspondente na pastar /app/Model. Isso também significa que seu arquivo modelo não foi
    nomeado corretamente (por exemplo, se seu arquivo se chamar ingrediente.php ou 
    Ingredientes.php ao invés de Ingrediente.php), o CakePHP usará uma instância da AppModel ao invés
    do sue modelo (que o CakePHP assume que está faltando). Se você está tentando usar um método que 
    definiu no seu modelo, ou um comportamento (Behavior) anexado em seu modelo, e você está recebendor 
    erros de SQL que tem o nome do seu método que esta sendo chamado,é um sinal claro de que o CakePHP 
    não pode encontrar o seu modelo e você precisa verificar o nome do arquivo, o cache da aplicação, ou ambos.

.. note::

    Alguns nomes de classe não podem ser utilizados como nomes para seus modelos.
    Por exemplo,"File" não pode ser utilizado , uma vez que "File" é uma classe que já existe no
    núcleo do CakePHP.

Quando seu model é definido, pode ser acessado de dentro de seu
:doc:`Controlador(Controller) <controllers>`. O CakePHP automaticamente
criará um modelo válido para acessar quando o seu nome corresponde ao
do controlador. Por exemplo, um controlador (Controller) chamado IngredientesController 
irá inicializar automáticamnete o modelo Ingrediente e anexá-lo ao controller 
model and attach it to the controller no ``$this->Ingredient``::

    class IngredientesController extends AppController {
        public function index() {
            //pega todos os ingredientes e passa para a view
            $ingredientes = $this->Ingrediente->find('all');
            $this->set('ingredientes', $ingredientes);
        }
    }

Modelos associados estão disponíveis por meio do modelo principal. 
Como no exemplo a seguir, Receita tem uma associação com o modelo ingrediente::

    class Receita extends AppModel {

        public function bifeReceitas() {
            $ingrediente = $this->Ingrediente->findByName('Bife');
            return $this->findAllByIngredientePrincipal($ingrediente['Ingrediente']['id']);
        }
    }

Isso mostra como usar modelos que já estão ligados. Para entender como associações são
definidas, dê uma olhada na :doc:`Sessão de Associações <models/associations-linking-models-together>`

Mais sobre modelos
==================

.. toctree::
    :maxdepth: 1

    models/associations-linking-models-together
    models/retrieving-your-data
    models/saving-your-data
    models/deleting-data
    models/data-validation
    models/callback-methods
    models/behaviors
    models/datasources
    models/model-attributes
    models/additional-methods-and-properties
    models/virtual-fields
    models/transactions


.. meta::
    :title lang=en: Models
    :keywords lang=en: information workflow,csv file,object oriented programming,model class,model classes,model definition,internal model,core model,simple declaration,application model,php class,database table,data model,data access,external web,inheritance,different ways,validity,functionality,queries
