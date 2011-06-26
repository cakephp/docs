Entendendo o Model-View-Controller
##################################

O CakePHP segue o padrão de projeto `MVC <http://en.wikipedia.org/wiki/Model-view-controller>`_.
Programar usando o MVC separa sua aplicação em três partes principais:

#. O `Model` representa os dados da aplicação
#. A `View` exibe os dados do modelo
#. O `Controller` trata e define as rotas das requisições feitas pelos usuários

|Figure 1|
Figura: 1: Uma requisição básica no MVC

Figura 1: Mostra um exemplo de uma simples requisição MVC em CakePHP. Para fins
ilustrativos, digamos que um usuário chamado "Ricardo" apenas clicou no link
"Comprar um bolo personalizado agora!" da sua aplicação.

-  Ricardo clica no link que aponta para http://www.example.com/cakes/buy e seu
   navegador faz uma requisição para seu servidor.
-  O dispatcher verifica a URL requisitada (/cakes/buy) e redireciona ao
   `controller` correto.
-  O `controller` executa a lógica específica da aplicação. Por exemplo,
   verifica se o Ricardo está logado.
-  O `controller` também utiliza os `models` para acessar os dados da sua
   aplicação. Geralmente os `models` representam tabelas do banco de dados, mas
   também podem representar registros `LDAP <http://en.wikipedia.org/wiki/Ldap>`_,
   feeds `RSS <http://en.wikipedia.org/wiki/Rss>`_ ou arquivos no sistema. Neste
   exemplo, o `controller usa o `model` para trazer do banco de dados as últimas
   compras do Ricardo.
-  Uma vez que o `controller` tenha feito sua mágica sobre os dados, ele repassa
   a uma `view`. A `view` pega esses dados e os prepara para serem exibidos ao
   cliente. `Views` em  CakePHP são geralmente em formato HTML, mas podem ser
   facilmente um PDF, documento XML, ou objetos JSON, dependendo de sua
   necessidade.
-  Depois que a `view` utilizou os dados do controller para construir uma
   página, o conteúdo é devolvido ao navegador do Ricardo.

Todas as requisições para sua aplicação seguirá este modelo básico. Vamos
acrescentar mais alguns detalhes específicos ao CakePHP mais adiante, então
mantenha isso em mente à medida que prosseguimos.

Benefícios
==========

Por que usar MVC? Porque é um verdadeiro e testado padrão de projeto de software
que transforma uma aplicação em pacotes de desenvolvimento rápido, de fácil
manutenção e modular. Elaborar tarefas divididas entre `models`, `views` e
`controllers` faz com que sua aplicação fique leve. Novas funcionalidades são
facilmente adicionadas e pode-se dar nova cara nas características antigas num
piscar de olhos. O design modular e separado também permite aos desenvolvedores
e designers trabalharem simultaneamente, incluindo a capacidade de se construir
um `protótipo <http://en.wikipedia.org/wiki/Software_prototyping>`_ muito
rapidamente. A separação também permite que os desenvolvedores alterem uma parte
da aplicação sem afetar outras.

Se você nunca construiu uma aplicação desta forma, leva algum tempo para se
acostumar, mas estamos confiantes que uma vez que você tenha construido sua
primeira aplicação usando CakePHP, você não vai querer fazer de outra maneira.

.. |Figure 1| image:: /_static/img/basic_mvc.png
