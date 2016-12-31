Entendendo o Model-View-Controller
##################################

O CakePHP segue o padrão de projeto `MVC <http://pt.wikipedia.org/wiki/MVC>`_.
Programar usando o MVC separa sua aplicação em três partes principais:

.. note::

    Optamos por não traduzir as palavras `Model`, `View` e `Controller`.
    Gostariamos que você se acostumasse com elas pois são muito utilizadas no
    dia a dia de um desenvolvedor CakePHP. Assim como o Português
    incorporou diversas palavras estrangeiras, o que você acha de incorporar
    estas palavras no seu vocabulário?

A camada Model
==============

A camada `Model` (modelo) representa a parte de sua aplicação que implementa
a lógica do negócio. Isto significa que ela é responsável por obter os dados
convertendo-os em conceitos significativos para sua aplicação, assim como,
processar, validar, associar e qualquer outra tarefa relativa ao tratamento
dos dados.

À primeira vista, os objetos do tipo Model podem ser vistos como a primeira
camada de interação com qualquer banco de dados que você possa estar usando na
sua aplicação. Mas em geral eles representam os principais conceitos em torno do
qual você implementa sua aplicação.

No caso de uma rede social, a camada Model cuida de tarefas como as de salvar
os dados dos usuários e o relacionamento entre amigos, armazenar e
recuperar as fotos dos usuários, encontrar novos amigos para sugestões e etc.
Neste exemplo os Models podem ser vistos como "Amigo", "Usuario", "Comentario"e
"Foto".

A camada View
=============

Uma `View` exibe uma representação dos dados modelados. Sendo separadas do
objeto Model, é responsável por usar as informações disponibilizadas para
produzir qualquer interface de apresentação que sua aplicação possa necessitar.

Por exemplo, como a camada Model retorna um conjunto de dados, a view pode
usá-los para exibir uma página HTML ou retornar o resultado em um formato XML
para que outros o consuma.

A camada View não está limitada à representações dos dados no formato HTML ou
texto, podendo ser usada para entregar uma variedade de formatos diferentes,
dependendo do que você precisar, como vídeos, músicas, documentos e qualquer
outro formato que você puder pensar.

A camada Controller
===================

A camada `Controller` (controlador) lida com as requisições dos usuários. É
responsável por retornar uma resposta com a ajuda das camadas Model e View.

Os Controllers podem ser vistos como gerentes tomando os devidos cuidados para
que todos os recursos necessários para completar uma tarefa sejam delegados para
os trabalhadores corretos. Ele aguarda os pedidos dos clientes, verifica a
validade de acordo com as regras de autenticação e autorização, delega dados
para serem obtidos ou processados pelos Models e seleciona o tipo correto de
apresentação dos dados para o qual o cliente está aceitando para finalmente
delegar o trabalho de renderização para a camada de visualização.

Ciclo de Requisição no CakePHP
==============================

|Figure 1|
Figura: 1: Uma requisição básica no MVC

Figura 1: Mostra o tratamento de uma simples requisição de um cliente pelo
CakePHP.

Um ciclo de requisição típico do CakePHP começa com o usuário solicitando uma
página ou recurso em sua aplicação. Esta solicitação é primeiramente processada
por um `dispatcher` (expedidor) que irá selecionar o objeto Controller correto
para lidar com a solicitação feita.

Assim que a solicitação do cliente chega ao Controller, este irá se comunicar
como a camada Model para processar qualquer operação de busca ou armazenamento
de dados que for necessário. Após esta comunicação terminar, o Controller
continuará delegando, agora para o objeto View correto a tarefa de gerar uma
saída resultante dos dados fornecidos pelo Model.

Finalmente quando a saída é gerada, ela é imediatamente enviada para o usuário.

Praticamente todas as requisições feitas para a sua aplicação irão seguir este
padrão.

Depois nós iremos adicionar mais alguns detalhes específicos do CakePHP,
portanto, tenha isto em mente enquanto prosseguimos.

Benefícios
==========

Por que usar MVC? Porque é um verdadeiro e testado padrão de projeto de software
que transforma uma aplicação em pacotes de desenvolvimento rápido, de fácil
manutenção e modular. Elaborar tarefas divididas entre models, views e
controllers faz com que sua aplicação fique leve. Novas funcionalidades são
facilmente adicionadas e pode-se dar nova cara nas características antigas num
piscar de olhos. O design modular e separado também permite aos desenvolvedores
e designers trabalharem simultaneamente, incluindo a capacidade de se construir
um `protótipo <https://en.wikipedia.org/wiki/Software_prototyping>`_ muito
rapidamente. A separação também permite que os desenvolvedores alterem uma parte
da aplicação sem afetar outras.

Se você nunca construiu uma aplicação desta forma, leva algum tempo para se
acostumar, mas estamos confiantes que uma vez que você tenha construído sua
primeira aplicação usando CakePHP, você não vai querer fazer de outra maneira.

Para começar a sua primeira aplicação CakePHP, tente seguir o tutorial para a
:doc:`construção de um blog </tutorials-and-examples/blog/blog>`

.. |Figure 1| image:: /_static/img/basic_mvc.png
