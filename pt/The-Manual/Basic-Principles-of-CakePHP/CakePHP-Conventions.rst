Convenções no CakePHP
#####################

Nós somos grandes fãs de convenções nas configurações. Apesar de tomar
um pouco de tempo para aprender as convenções do CakePHP, você ganha
tempo em um longo processo: seguindo as convenções, você ganha
funcionalidades gratuitamente e livra-se de madrugadas de manutenção de
arquivos de configuração. Convenções também fazem com que o sistema
fique uniformemente desenvolvido, permitindo que outros desenvolvedores
o ajudem mais facilmente.

Convenções no CakePHP têm sido produzidas por anos de experiência em
desenvolvimento web e boas práticas. Apesar de sugerirmos que você use
essas convenções enquanto desenvolve em CakePHP, devemos mencionar que
muitos desses princípios são facilmente sobrescritos - algo que
especialmente acontece quando trabalha-se com sistemas legados.

Convenções de Arquivos e Nomes de Classes
=========================================

Normalmente, nomes de arquivos são sublinhados enquanto nomes de classes
são CamelCased. Então, se você tem uma classe **MyNiftyClass**, no Cake,
o arquivo deve ser nomeado como **my\_nifty\_class.php**. Abaixo estão
exemplos de como nomear o arquivo para cada um dos diferentes tipos de
classes que você deve usar normalmente em uma aplicação CakePHP:

-  A classe do Controlador (*Controller class*)
   **KissesAndHugsController** seria encontrada em um arquivo chamado
   **kisses\_and\_hugs\_controller.php** (observe o \_controller no nome
   de arquivo)
-  A classe do Componente (*Component class*) **MyHandyComponent** seria
   encontrada em um arquivo chamado **my\_handy.php**
-  A classe do Modelo (*Model class*) **OptionValue** seria encontrada
   em um arquivo chamado **option\_value.php**
-  A classe do Comportamento (*Behavior class*)
   **EspeciallyFunkableBehavior** seria encontrada em um arquivo chamado
   **especially\_funkable.php**
-  A classe da Visão (*View class*) **SuperSimpleView** seria encontrada
   em um arquivo chamado **super\_simple.php**
-  A classe da Ajuda (*Helper class*) **BestEverHelper** seria
   encontrada em um arquivo chamado **best\_ever.php**

Cada arquivo deverá estar localizado em uma pasta ou subpasta apropriada
na sua pasta app.

Convenções de Modelo e Banco de Dados
=====================================

Nome das classes de modelo devem ser no singular e CamelCased. Person,
BigPerson e ReallyBigPerson são exemplos de nomes convencionados para
modelos.

Os nomes das tabelas correspondentes a modelos do CakePHP devem estar no
plural e sublinhados. As tabelas para os modelos mencionados
anteriormente devem ser people, big\_people e really\_big\_people,
respectivamente.

Você pode usar o a biblioteca utilitária "Inflector" para conferir o
singular/plural das palavras. Veja a documentação do
`Inflector </pt/view/491/Inflector>`_ para mais informações.

Campos de nomes com duas ou mais palavras são sublinhados como,
first\_name.

Chaves estrangeiras em relacionamentos do tipo temMuitos (*hasMany*),
pertenceA (*belongsTo*) ou temUm (*hasOne*) são reconhecidos por padrão
como o nome (no singular) da tabela relacionada seguido por \_id. Assim,
se um padeiro temMuitos bolos, a tabela bolos referenciará a um padeiro
na tabela padeiros através da chave estrangeira padeiro\_id. Para uma
tabela com múltiplas palavras como category\_types, a chave estrangeira
deve ser category\_type\_id.

Tabelas associativas, usadas em relações temEPertenceAMuitos
(*hasAndBelongsToMany*) entre modelos, devem ser nomeadas conforme os
modelos das tabelas que a compõem, em ordem alfabética (apples\_zebras
em vez de zebras\_apples).

Todas as tabelas com as quais os modelos CakePHP interagem (exceto as
tabelas associativas) exigem uma única chave primária para identificar
unicamente cada linha. Se você deseja modelar uma tabela que não tem uma
chave primária de um único campo, como as linhas de nossa tabela
associativa posts\_tags, a convenção do CakePHP é de que uma chave
primária de um único campo deve ser adicionada à tabela.

CakePHP não suporta chaves primárias compostas. No caso de você querer
manipular diretamente os dados das tabelas associativas, isso significa
que você precisa usar chamadas a `consultas </pt/view/456/query>`_
diretas, ou adicionar um campo como chave primária para ser capaz de
atuar nela como em um modelo normal. Por exemplo:

::

    CREATE TABLE posts_tags (
    id INT(10) NOT NULL AUTO_INCREMENT,
    post_id INT(10) NOT NULL,
    tag_id INT(10) NOT NULL,
    PRIMARY KEY(id)); 

Ao invés de usar uma chave auto-incremento como primária, você também
pode usar o tipo char(36). O Cake irá então usar um uuid (String::uuid)
sempre que você salvar um novo registro usando o método Model::save.

Convenções de controlador
=========================

O nome das classes de controladores são no plural, CamelCased e terminam
com ``Controller``. ``PessoasController`` e ``UltimosArtigosController``
são exemplos de nomes de controladores convencionais.

O primeiro método que você escreve para um controlador dever ser o
método ``index()``. Quando uma requisição especifica um controlador, mas
não uma ação, o comportamento padrão do CakePHP é executar o método
``index()`` do controlador. Por exemplo, uma requisição para
http://www.example.com/apples/ mapeia para uma chamada do método método
``index()`` da ApplesController, assim como
http://www.example.com/apples/view/ mapeia para a chamada do método
``view()`` da ApplesController.

Você também pode alterar a visibilidade dos métodos do controlador no
CakePHP, prefixando um sublinhado nos nomes dos métodos. Se um método do
controlador foi prefixado com um sublinhado, o método não será acessível
diretamente da web, mas está disponível para uso interno. Por exemplo:

::

    <?php
    class NewsController extends AppController {

        function latest() {
            $this->_findNewArticles();
        }
        
        function _findNewArticles() {
            //Lógica para encontrar últimos artigos
        }
    }
    ?>

Embora a página http://www.example.com/news/latest/ possa ser acessada
normalmente pelo usuário, alguém tentando acessar a página
http://www.example.com/news/\_findNewArticles/ iria obter um erro,
porque o método é precedido com um sublinhado.

Considerações sobre URLs para Nomes de Controladores
----------------------------------------------------

Como você acabou de ver, controladores de uma única palavra são
facilmente mapeados para um simples caminho URL em letras minúsculas.
Por exemplo, ``ApplesController`` (que seria definida em um arquivo com
nome 'apples\_controller.php') é acessado a partir de
http://example.com/apples.

Controladores de múltiplas palavras *podem* ter qualquer forma
'flexionada' que se iguale ao nome do controlador assim:

-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

Todos apontarão para o método ``index()`` do controlador RedApples. No
entanto, a convenção é que as URLs sejam minúsculas e sublinhadas,
portanto /red\_apples/go\_pick é a forma correta de acessar a ação
``RedApplesController::go_pick``.

Para obter mais informações sobre URLs CakePHP e manuseamento de
parâmetros, veja `Configuração de
Rotas <pt/view/945/Routes-Configuration>`_.

Convenções de visão
===================

Os arquivos de template de visões são nomeados conforme as funções de
controladores que mostram esses arquivos de template, na forma com
sublinhados. A função getReady() da classe PeopleController irá procurar
pelo template da visão em /app/views/people/get\_ready.ctp.

O modelo básico é /app/views/controller/underscored\_function\_name.ctp.

Nomeando os pedaços da aplicação usando as convenções do CakePHP, você
ganha funcionalidades sem luta e sem amarras de configuração. Aqui o
exemplo final que vincula as associações:

-  Tabela no banco de dados: 'people'
-  Classe do Modelo: 'Person', encontrada em /app/models/person.php
-  Classe do Controlador: 'PeopleController', encontrado em
   /app/controllers/people\_controller.php
-  Template da Visão: encontrado em /app/views/people/index.ctp

Usando estas convenções, CakePHP sabe que a requisição para
http://www.exemplo.com.br/people/ mapeia para a chamada da função
index() do PeopleController, onde o modelo Person é automaticamente
disponibilizado (e automaticamente associado à tabela 'people' no banco
de dados), e renderiza isso para o arquivo. Nenhuma destas relações
foram configuradas por qualquer meio que não seja através da criação de
classes e arquivos que você precise criar em algum lugar.

Agora que você leu os fundamentos do CakePHP, você pode tentar seguir o
tutorial de como fazer um `Blog em CakePHP </pt/view/219/Blog>`_, para
ver como as coisas são feitas juntas.
