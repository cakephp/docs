Estrutura do CakePHP
####################

O CakePHP possui as classes essenciais Controller, Model e View, mas também
apresenta algumas outras classes e objetos adicionais que fazem o
desenvolvimento com o MVC um pouco mais rápido e divertido. Componentes,
Behaviors e Helpers são classes que fornecem extensibilidade e reusabilidade
para adicionar funcionalidades à base das classes do MVC em sua aplicação.
Por enquanto, vamos fazer uma explicação superficial destas ferramentas e
detalhá-las mais tarde.

Extensões de Aplicação
======================

Cada controller, helper e model possui uma classe mãe que você pode usar para
incluir mudanças válidas por toda a aplicação. As classes AppController
(localizada em ``/app/Controller/AppController.php``), AppHelper (localizada em
``/app/View/Helper/AppHelper.php``) e AppModel (localizada em
``/app/Model/AppModel.php``) são excelentes lugares para colocar métodos que
você quer compartilhar entre todos os controllers, helpers ou models.

Embora não sejam classes ou arquivos, as rotas desempenhar um papel na
requisição feita para o CakePHP. Definições de rotas dizem ao CakePHP como
mapear URLs para as ações de controllers. O comportamento padrão assume que a
URL ``/controller/action/var1/var2`` deve ser mapeada para o método
Controller::action($var1, $var2), mas você pode usar as rotas para customizar as
URLs e como elas são interpretadas por sua aplicação.

Alguns recursos em uma aplicação merecem ser reunidas em um pacote. Um plugin é
um pacote de models, controllers e views que cumprem um objetivo específico e
que podem ser utilizados em várias aplicações. Um sistema de gerenciamento de
usuários ou um blog simplificado podem ser bons candidatos para plugins do
CakePHP.

Extensões de Controllers ("Componentes")
=======================================

Um `Component` é uma classe que dá suporte às lógicas nos controllers.
Se você possui uma lógica que queira compartilhar entre controllers, um
componente geralmente é uma boa escolha para colocá-la.
Como um exemplo, a classe EmailComponent do Cake permite criar e enviar emails
num piscar de olhos.

Ao invés de escrever um método em um controller único que executa esta lógica,
você pode empacotar a lógica para que seja possível compartilhá-la.

Os controllers também estão equipados com callbacks. Estes callbacks estão
disponíveis para que você possa utilizá-los, bem nos casos em que você precisa
inserir alguma lógica entre as operações do núcleo do CakePHP. Os callbacks
disponibilizados são:

-  ``beforeFilter()``, executado antes de qualquer ação de um controller.
-  ``beforeRender()``, executado após a lógica de um controller, mas antes da
   view ser renderizada.
-  ``afterFilter()``, executada após a lógica de um controller, incluindo a
   renderização da view. Pode não haver diferenças entre o
   ``afterRender()`` e o ``afterFilter()`` ao menos que você tenha chamado o
   método ``render()`` na ação de um controller e tenha incluído alguma lógica
   depois desta chamada.

Extensões de Models ("Behaviors")
==============================

Similarmente, Behaviors trabalham para adicionar funcionalidades comuns entre
models. Por exemplo, se você armazena os dados dos usuários em uma estrutura de
dados do tipo árvore, você pode especificar que seu model `Usuario` se comporta
tal como uma árvore e assim, ganha funcionalidades para remover,
adicionar e substituir nós na estrutura que existe por baixo do model.



Models também recebem o suporte de outra classe chamada DataSource.
DataSources são uma abstração que permite os models manipularem consistentemente
diferentes tipos de dados. Embora a fonte principal de dados em uma aplicação
usando o CakePHP seja banco de dados, você pode escrever DataSources adicionais
que permitem seus models representarem feeds RSS, arquivos CSV, entradas LDAP ou
eventos do iCal. Os DataSources permitem você associar registros de diferentes
fontes: Diferente de estar limitado pelas junções do SQL, os DataSources
permitem você dizer para seu Model LDAP que está associado à muitos eventos do
iCal.

Assim como os controllers, os models também possuem callbacks:

-  ``beforeFind()``, executado antes de uma busca.
-  ``afterFind()``, executado após uma busca.
-  ``beforeValidate()``, executado antes de fazer uma validação de dados.
-  ``beforeSave()``, executado antes de salvar ou atualizar registros de um
   model.
-  ``afterSave()``, executado após salvar ou atualizar registros de um model.
-  ``beforeDelete()``, executado antes de remover registros de um model.
-  ``afterDelete()``, executado após remover registros de um model.

Com a mínima descrição dada, deve ser possível saber o que estes callbacks
fazem. Você pode encontrar mais detalhes no capítulo dos models.

Extensões de Views ("Helpers")
===========================

Um Helper é uma classe que ajuda na lógica das views. Muito parecido como os
componentes que são usados pelos controllers, os helpers ajudam na lógica de
apresentação que podem ser acessadas e compartilhadas entre as views. Um dos
Helpers que acompanha o Cake é o AjaxHelper que torna requisições em ajax nas
views muito mais fácil.

Muitas aplicações possuem pedaços de código de apresentação que são usados
repetidamente. O CakePHP facilita a reutilização destes trechos com layouts e
elementos. Por padrão, cada view renderizada por um controller é colocada dentro
de um layout. Elementos são usados quando pequenos trechos de conteúdo precisam
ser reusados em muitas views.
