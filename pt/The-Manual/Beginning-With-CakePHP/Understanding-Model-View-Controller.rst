Entendendo o Model-View-Controller (MVC)
########################################

Aplicações bem escritas em CakePHP segue o design pattern MVC
(Model-View-Controller ou Modelo-Visão-Controlador). Programando em MVC
separa sua aplicação em três partes principais:

#. O model representa os dados;
#. A view representa a visualização dos dados;
#. O controller manipula e roteia as requisições dos usuários.

.. figure:: /_static/img/basic_mvc.png
   :align: center
   :alt: Figure 1

   Figura 1: Requisição básica de MVC

A Figura 1 mostra um exemplo de uma simples requisição MVC em CakePHP.
Para fins ilustrativos, digamos que um usuário chamado Ricardo apenas
clicou no link “Comprar um bolo personalizado agora!” da sua aplicação.

#. Ricardo clica no link apontando para
   http://www.exemplo.com.br/cakes/comprar e seu browser faz uma
   requisição ao site;
#. O dispatcher (expedidor) verifica a URL requisitada (/cakes/comprar)
   e redireciona ao controller correto;
#. O controller executa a lógica específica da aplicação. Por exemplo,
   verifica se o Ricardo está logado;
#. O controller também usa os models para acessar os dados da sua
   aplicação. Muitas vezes, os models representam as tabelas do banco de
   dados, mas podem representar registros
   `LDAP <https://pt.wikipedia.org/wiki/LDAP>`_, feeds de
   `RSS <https://pt.wikipedia.org/wiki/RSS>`_ ou até mesmo arquivos do
   sistema. Neste exemplo, o controller usa o model para trazer ao
   Ricardo as últimas compras do banco de dados;
#. Depois que o controller fez sua mágica sobre os dados, ele repassa
   para a view. A view faz com que os dados fiquem prontos para a
   representação do usuário. As views em CakePHP normalmente vem no
   formato HTML, mas pode ser facilmente exibidas em PDF, documento XML,
   um objeto JSON ou outro formato qualquer, dependendo da sua
   necessidade;
#. Uma vez que a view tenha usado os dados provenientes do controller
   para construir a página, o conteúdo é retornado ao browser do
   Ricardo.

Aproximadamente toda requisição da sua aplicação seguirá o modelo básico
do modelo. Nós vamos especificar os detalhes mais adiante, mas mantenha
essa visão geral no seu pensamento.

Benefícios
==========

Por que usar MVC? Porque é um verdadeiro padrão de projeto (design
pattern) e torna fácil a manutenção da sua aplicação, com pacotes
modulares de rápido desenvolvimento. Elaborar tarefas divididas entre
models, views e controllers faz com que sua aplicação fique leve e
independente. Novas funcionalidades são facilmente adicionadas e pode-se
dar nova cara nas características antigas num piscar de olhos. O design
modular e separado também permite aos desenvolvedores e designers
trabalharem simultaneamente, incluindo a habilidade de se construir um
rápido protótipo. A separação também permite que os desenvolvedores
alterem uma parte da aplicação sem afetar outras.

Se você nunca desenvolveu uma aplicação neste sentido, isso vai lhe
agradar muito, mas estamos confiantes que depois de construir sua
primeira aplicação em CakePHP, você não vai querer voltar atrás.
