Requisição típica no CakePHP
############################

Nós cobrimos os ingredientes básicos no CakePHP, então vamos ver como
cada objeto funciona em uma requisição completa. Continuando com nossa
requisição original de exemplo, vamos imaginar que nosso amigo Ricardo
tenha clicado no link "Comprar um bolo personalizado agora!" da sua
aplicação CakePHP.

.. figure:: /img/typical-cake-request.gif
   :align: center
   :alt: Requisição típica no CakePHP

   Requisição típica no CakePHP
Figura 2. Requisição típica no CakePHP.

Preto = elemento necessário, Cinza = elemento opcional, Azul = callback

-  Ricardo clica no link apontando para
   http://www.exemplo.com.br/cakes/buy, e seu browser faz a requisição
   ao seu servidor web;
-  O roteador processa a URL, extraindo os parâmetros desta requisição:
   o controlador, ação e qualquer outro argumento que vai afetar na
   lógica do negócio durante esta requisição;
-  Usando rotas, a requisição da URL é mapeada para a ação do
   controlador (um método específico da classe do controlador). Neste
   caso, o método buy() do CakesController. O callback beforeFilter() do
   controlador é chamado antes de qualquer ação do controlador ser
   executada;
-  O controlador pode usar métodos para ter acesso aos dados da
   aplicação. Neste exemplo, o controlador usa o modelo para ver no
   banco de dados as últimas compras de Ricardo. Qualquer callback
   aplicável do modelo, behaviors e DataSources podem ser aplicados
   durante esta operação. Apesar de modelos não serem obrigatórios,
   todos os controladores do CakePHP inicialmente necessitam de pelo
   menos um modelo;
-  Depois do modelo ter adquirido os dados, ele os retorna ao
   controlador. Podem ser aplicados callbacks no modelo;
-  O controlador pode usar componentes para refinar os dados ou efetuar
   outras operações (manipular sessões, autenticação ou enviar e-mails,
   por exemplo);
-  Uma vez que o controlador tenha usado os modelos e os componentes
   para preparar os dados suficientemente, estes dados são repassados às
   visões usando o método set() do controlador. Callbacks dos
   controladores podem ser aplicados antes dos dados serem enviados. A
   lógica da visão é efetuada, podendo incluir elementos ou ajudantes.
   Por padrão, as visões são sempre renderizadas dentro de um layout;
-  Além disso, callbacks dos controladores (como afterFilter) podem ser
   aplicados. Para completar, o código renderizado pela visão vai para o
   browser do Ricardo.

