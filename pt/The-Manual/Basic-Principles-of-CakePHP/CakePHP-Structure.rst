Estrutura CakePHP
#################

CakePHP possui a característica de usar as classes de Controlador,
Modelo e Visão, mas também possui classes e objetos adicionais que fazem
o desenvolvimento em MVC mais rápido e agradável. Componentes, Behaviors
e Ajudantes (*Helpers*) são classes que proporcionam extensibilidade e
reuso para adicionar funcionalidades rapidamente à base MVC das suas
aplicações. Agora vamos começar a subir um pouco o nível para analisar
os detalhes de como usar estas ferramentas mais tarde.

Extensões de Controlador (Componentes)
======================================

O Componente (Component) é a classe que ajuda na lógica do controlador.
Se você tem a mesma lógica e quer compartilhar entre controladores (ou
aplicações), o componente é uma boa saída. Por exemplo, o componente
interno EmailComponent cria e envia e-mails em segundo plano. Ao invés
de escrever um método em cada controlador que utiliza esta lógica,
pode-se criar um componente que empacote esta funcionalidade e seja
compartilhado entre os controladores.

Controladores também são equipados com callbacks. Estes callbacks estão
disponíveis para que você possa utilizar, apenas se você precisar
inserir uma lógica entre operações do núcleo do CakePHP. Os callbacks
disponíveis incluem:

-  beforeFilter(), executado antes de qualquer ação do controlador;
-  beforeRender(), executado depois da lógica do controlador, mas antes
   da visão ser renderizada;
-  afterFilter(), executado depois de todas as lógicas do controlador,
   incluindo a renderização da visão. Não há diferença entre
   afterRender() e afterFilter(), exceto que você tenha feito uma
   chamada manualmente para render() no seu método do controlador e
   tenha incluído alguma lógica depois dessa chamada.

Extensões de Visão
==================

O Ajudante (Helper) é a classe que ajuda na lógica da visão. Assim como
o componente ajuda o controlador, os ajudantes permitem a apresentação
lógica ser acessada e compartilhada entre as visões. AjaxHelper é um dos
principais ajudantes. Ele faz requisições AJAX facilmente de dentro das
visões.

A maioria das aplicações tem partes do código que são usados
repetidamente nas visões. CakePHP facilita o reuso de código na visão
com a utilização de layouts e elementos (elements). Por padrão, toda
visão é renderizada por um controlador seguindo algum layout. Os
elementos são como pequenos trechos de código necessários que podem ser
reutilizados em diversas visões.

Extensões de Modelo
===================

Assim como as outras extensões, os Behaviors funcionam do mesmo modo,
adicionando funcionalidades entre os modelos. Por exemplo, se você
armazenar os dados do usuário em uma estrutura de árvore, você pode
especificar o modelo User como comportamento de árvore e ganhar
funcionalidades para remover, adicionar e alterar nós em sua estrutura
de árvore fundamental.

Os modelos também são suportados por outra classe chamada DataSource.
DataSources são abstrações que permitem os modelos manipularem
diferentes tipos de dados consistentemente. Enquanto a principal fonte
de dados numa aplicação CakePHP é via banco de dados, você pode escrever
DataSources adicionais que permitem seu modelo representar um feed RSS,
arquivo CSV, entidades LDAP ou eventos iCal. DataSources permite você
associar registros de diferentes fontes: ao invés de limitar em joins do
SQL, DataSources permitem você chamar seu modelo de LDAP que está
associada a vários eventos iCal.

Assim como nos controladores, modelos têm recursos de callback como:

-  beforeFind()
-  afterFind()
-  beforeValidate()
-  beforeSave()
-  afterSave()
-  beforeDelete()
-  afterDelete()

Os nomes desses métodos devem ser descritivos o bastante para que você
saiba o que eles fazem. Certifique-se de pegar os detalhes no capítulo
sobre modelo.

Extensões de Aplicação
======================

Tanto os controladores, ajudantes e modelos têm uma classe pai que você
pode usar para definir modificações na aplicação. AppController
(localizado em '/app/app\_controller.php'), AppHelper (localizado em
'/app/app\_helper.php') e AppModel (localizado em '/app/app\_model.php')
são bons lugares para colocar métodos que você precisa para acessar
entre todos os controladores, ajudantes e modelos.

Embora não sejam classes ou arquivos, as rotas definem regras na
requisição feita para o CakePHP. As definições das rotas definem como o
CakePHP deve mapear uma URL para um método do controlador. O behavior
padrão assume que a URL '/controller/action/var1/var2' mapeia para
Controller::action($var1, $var2), mas você pode usar rotas para
personalizar URLs e como elas devem ser interpretadas pela sua
aplicação.

Alguns recursos na sua aplicação podem ser empacotados com mérito. Um
plugin é um pacote de modelo, controlador e visão que realiza um
objetivo específico que pode abranger vários aplicativos. Um sistema de
gestão de usuários ou um blog simplificado podem ser bons exemplos de
plugins para CakePHP.
