Uma Requisição Típica do CakePHP
################################

Nós já abordamos os ingredientes básicos do CakePHP, então agora vamos dar uma
olhada em como os objetos trabalham juntos para completar uma requisição básica.
Continuando com o exemplo da requisição original, vamos imaginar que nosso amigo
Ricardo apenas clicou no link "Compre um bolo personalizado agora!" em uma
`landing page <http://pt.wikipedia.org/wiki/Landing_page>`_ de uma aplicação
CakePHP.

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Um diagrama de fluxo mostrando uma típica requisição CakePHP
   
   Um diagrama de fluxo mostrando uma típica requisição CakePHP

Figure: 2. Requisição típica do CakePHP.

Em preto = elemento requerido, em cinza = elemento opcional, em Azul = callbacks

#. Ricardo clica no link apontando para http://www.example.com/cakes/buy,
   e o navegador dele faz uma requisição para seu servidor web.
#. O roteador analisa a URL para extrair os parâmetros desta requisição:
   o controller, a ação, e qualquer outro argumento que afeta a lógica do negócio
   durante esta requisição.
#. Usando rotas, a URL da requisição é mapeada para uma ação de um controller
   (um método em uma classe controller específica). Neste caso, será o método
   buy() do controller CakesController. O callback beforeFilter() do controller
   é chamado antes de qualquer ação lógica do controller. As linhas tracejadas
   em azul mostram isso no diagrama.
#. O controller pode usar models para obter acesso aos dados do aplicativo.
   Neste exemplo o controller usa o model para pegar no banco de dados as
   últimas compras do Ricardo. Qualquer callback do model, behaviors ou
   DataSources que for aplicável neste momento, será chamado.
   Enquanto a utilização de Models não seja obrigatória, todas os controllers
   inicialmente requerem ao menos um model.
#. Após o model buscar os dados, estes são retornados para o controller.
   Callbacks de um Model podem ser aplicados.
#. O controller poderá utilizar componentes para refinar os dados ou executar
   outras operações (manipular sessão, autenticar ou enviar e-mails são exemplos)
#. Uma vez que o controller usou os models e componentes para preparar os dados
   de forma suficiente, os dados são passados para a view usando o método set()
   do controller. Callbacks do controller podem ser chamados antes que os dados
   sejam passados. A view é executada, podendo incluir o uso de elementos e/ou
   helpers. Por padrão, a view é renderizada dentro de um layout.
#. Adicionalmente, callbacks do controller (como o afterFilter) podem ser
   aplicados. A view renderizada e completa é enviada para o navegador do
   Ricardo.
