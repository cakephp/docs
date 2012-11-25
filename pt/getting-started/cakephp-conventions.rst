Convenções no CakePHP
#####################

Nós somos grandes fãns de `convenções sobre configuração
<http://pt.wikipedia.org/wiki/Conven%C3%A7%C3%A3o_sobre_configura%C3%A7%C3%A3o>`_.
Enquanto pode levar um tempo para aprender as convenções do CakePHP, você
ganhará muito tempo a longo prazo: seguindo as convenções você ganhará
funcionalidades e ficará livre dos pesadelos de manter arquivos de configuração.
As convenções também contribuem para o desenvolvimento de sistemas mais
uniformes, permitindo que outros desenvolvedores entrem no projeto e comecem a
trabalhar muito mais rapidamente.

As convenções do CakePHP foram destiladas ao longo de anos de experiência no
desenvolvimento de aplicações web e boas práticas. Da mesma forma que sugerimos
que você use essas convenções enquanto desenvolve com o CakePHP, devemos
mencionar que muitos destes princípios são facilmente sobrescritos – algo que é
especialmente útil quando se trabalha com sistemas legados.


Convenções nos Controllers
==========================

As classes Controllers devem ser escritas no plural, usando o formato
`CamelCase <http://pt.wikipedia.org/wiki/CamelCase>`_ e terminarem com a
palavra ``Controller``. ``PeopleController`` e ``LatestArticlesController`` são
dois exemplos de nomes de controllers que seguem a convenção.

O primeiro método que você pode escrever para um controller é o método
``index()``. Quando uma requisição especifica o controller mas não a ação, o
comportamento padrão do CakePHP é executar o método ``index()``. Por exemplo,
uma requisição para http://www.example.com/apples/ é mapeada para o método
``index()`` do controller ``ApplesController``, enquanto a URL
http://www.example.com/apples/view/ é mapeada para a chamada do método
``view()`` do mesmo controller.

Você também pode alterar a visibilidade dos métodos de controllers no CakePHP
prefixando os nome dos métodos com underscores. Se um método de um controller 
for prefixado, o método não poderá ser acessado diretamente da web mas estará
disponível para uso interno. Por exemplo::

    class NewsController extends AppController {
    
        function latest() {
            $this->_findNewArticles();
        }
        
        function _findNewArticles() {
            // lógica para encontrar os os últimos artigos
        }
    }

Enquanto a página http://www.example.com/news/latest/ pode ser acessada
normalmente pelos usuários, alguem tentando visitar a página
http://www.example.com/news/\_findNewArticles/ receberá um erro porque o nome
do método é prefixado com um underscore. Você também pode utilizar as
palavras-chave de visibilidade do PHP para indicar se um método pode ou não ser
acessado por uma URL. Métodos privados não podem ser acessados.

Considerações sobre URLs para nomes de Controllers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Como você viu, controllers com nomes formados por uma palavra são mapeados
por URLs em caixa baixa. Por exemplo, ``ApplesController`` (que seria definido
em um arquivo com o nome de 'ApplesController.php') pode ser acessado com a
seguinte URL: http://example.com/apples.

Controllers formados por mais de uma palavra *podem* ter qualquer forma
'flexionada' do nome:

-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

Todas serão resolvidas para o método index do controller RedApples. Porém, a
convenção diz que suas URLs devem ser em caixa baixa e usar underscores,
portanto /red\_apples/go\_pick é a forma mais apropriada para acessar a ação
``RedApplesController::go_pick``.

Para mais informações sobre as URLs do CakePHP e o tratamento de parâmetros,
veja :ref:`routes-configuration`.

.. _file-and-classname-conventions:

Convenções de Arquivos e Nomes de Classes
=========================================

Geralmente, nomes de arquivos correspondem com o nome de suas classes, que são
em `CamelCase <http://pt.wikipedia.org/wiki/CamelCase>`_. Então se você possui
uma classe **MyNiftyClass**, para o Cake, o nome do arquivo deve ser
**MyNiftyClass.php**. Abaixo estão alguns exemplos de como nomear arquivos para
diferentes tipos de classes que você usará em aplicações CakePHP:

-  O controller **KissesAndHugsController** seria encontrado em um arquivo
   chamado **KissesAndHugsController.php**
-  O componente **MyHandyComponent** seria encontrado em um arquivo
   chamado **MyHandyComponent.php**
-  O model **OptionValue** seria encontrado em um arquivo chamado
   **OptionValue.php**
-  O behavior **EspeciallyFunkableBehavior** seria encontrado em um arquivo
   chamado **EspeciallyFunkableBehavior.php**
-  A View **SuperSimpleView** seria encontrado em um arquivo chamado
   **SuperSimpleView.php**
-  O helper **BestEverHelper** seria encontrado em um arquivo chamado
   **BestEverHelper.php**

Cada arquivo deverá estar em uma pasta apropriada no diretório app da sua
aplicação.

Convenções de Models e Banco de Dados
=====================================

O nome dos Models devem ser escritos no singular e no formato `CamelCase
<http://pt.wikipedia.org/wiki/CamelCase>`_. Car, BigCar e ReallyBigCar são todos
exemplos de nomes de models que seguem a convenção.

Nomes de tabelas correspondentes à models do CakePHP são escritos no plural e
usando underscores. As tabelas correspondentes para os models mencionados acima
são respectivamente cars, ``big\_cars`` e ``really\_big\_cars``.

Você pode usar a biblioteca utilitária :php:class:`Inflector` para verificar a
forma singular/plural das palavras. Veja a classe
:doc:`/core-utility-libraries/inflector` para mais informações.

Nomes de colunas formadas por mais de uma palavra devem ser separadas usando
underscore como em first\_name.

Chaves estrangeiras em associações do tipo hasMany, belongsTo ou hasOne são
reconhecidas por padrão como o nome (no singular) das tabelas relacionadas
seguidas por \_id. Então, se Baker hasMany (possui muitos) Cake, a tabela cakes
irá fazer referência a tabela bakers via chave estrangeira baker\_id. Para
tabelas formadas por mais de uma palavra como category\_types, a chave
estrangeira seria category\_type\_id.

Tabelas de junções usadas em relacionamentos do tipo hasAndBelongsToMany
(HABTM) entre models devem ser nomeadas usando o nome das tabelas dos models
referenciados unidas em ordem alfabética (apples\_zebras ao invés de
zebras\_apples).

Todas as tabela com que models do CakePHP interagem (com exceção das tabelas
de junção) requerem uma chave primária para identificar unicamente cada
registro. Se você quiser modelar uma tabela que não possua uma chave primária
única, a convenção do CakePHP diz que você deve adicionar uma se quiser
utilizá-la com um model.

O CakePHP não suporta chaves primárias compostas. Se você quiser manipular os
dados das tabelas de junções diretamente, use chamadas de
:ref:`query <model-query>` diretas ou adicione uma chave primaria para usá-las
como um model normal. Ex.::

    CREATE TABLE posts_tags (
        id      INT(10) NOT NULL AUTO_INCREMENT,
        post_id INT(10) NOT NULL,
        tag_id  INT(10) NOT NULL,
        PRIMARY KEY(id)
    ); 

Ao invés de usar chaves auto incrementadas, você também pode usar o tipo
char(36). Desta forma o Cake irá usar um identificador único (uuid) de 36
caracteres criado por String::uuid sempre que você salvar um novo registro
usando o método Model::save.

Convenções de Views
===================

Arquivos de templates de views são nomeados de acordo com o nome do método do
controller que exibem no formato underscore. O método getReady() da classe
PeopleController irá utilizar uma view localizada em
/app/View/People/get\_ready.ctp.

O molde padrão é /app/View/Controller/underscored\_function\_name.ctp.

Nomeando as partes de sua aplicação usando as convenções do CakePHP, você ganha
funcionalidades sem os incômodos e problemáticos arquivos de configuração.
Segue agora um exemplo final que mostra as convenções todas juntas.

-  Tabela do banco de dados: "cars"
-  Classe Model: "Car", encontrada em /app/Model/Car.php
-  Classe Controller: "CarsController", encontrada em
   /app/Controller/CarsController.php
-  Arquivo de View encontrada em /app/View/Cars/index.ctp

Usando estas convenções o CakePHP saberá que uma requisição feita pela URL
http://example.com/cars/ refere-se a uma chamada para o método index() da
classe CarsController, onde o model Car é automaticamente disponibilizado (e
automaticamente amarrado com a tabela cars no banco de dados) e renderiza o
arquivo /app/View/Cars/index.ctp. Nenhum destes relacionamentos precisou ser
configurado, a não ser a criação de classes e arquivos que você precisaria
criar de qualquer maneira.

Agora que você já foi introduzido aos fundamentos do CakePHP, você pode tentar
o :doc:`/tutorials-and-examples/blog/blog` para ver como todas as coisas se
encaixam juntas.
