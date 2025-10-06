Guia de Compatibilidade com Versões Anteriores
##############################################

Garantir que você possa atualizar suas aplicações de forma fácil e suave é importante
para nós. É por isso que só quebramos a compatibilidade em marcos de lançamentos principais.
Você pode estar familiarizado com `versionamento semântico <https://semver.org/>`_, que é
a diretriz geral que usamos em todos os projetos CakePHP. Resumindo, versionamento
semântico significa que apenas lançamentos principais (como 2.0, 3.0, 4.0) podem quebrar
a compatibilidade com versões anteriores. Lançamentos menores (como 2.1, 3.1, 3.2) podem introduzir novos
recursos, mas não têm permissão para quebrar a compatibilidade. Lançamentos de correção de bugs (como 2.1.2,
3.0.1) não adicionam novos recursos, mas corrigem bugs ou melhoram apenas o desempenho.

.. note::

    Depreciações são removidas com a próxima versão principal do framework.
    É aconselhável que você se adapte às depreciações conforme são introduzidas para
    garantir que futuras atualizações sejam mais fáceis.

Para esclarecer quais mudanças você pode esperar em cada nível de lançamento, temos
informações mais detalhadas para desenvolvedores usando CakePHP e para desenvolvedores trabalhando no
CakePHP que ajudam a definir expectativas do que pode ser feito em lançamentos menores. Lançamentos principais
podem ter tantas mudanças quebradas quanto necessário.

Guias de Migração
=================

Para cada lançamento principal e menor, a equipe CakePHP fornecerá um guia de migração.
Esses guias explicam os novos recursos e quaisquer mudanças quebradas que estão
em cada lançamento. Eles podem ser encontrados na seção :doc:`/appendices` do
cookbook.

Usando CakePHP
==============

Se você está construindo sua aplicação com CakePHP, as seguintes diretrizes
explicam a estabilidade que você pode esperar.

Interfaces
----------

Fora de lançamentos principais, interfaces fornecidas pelo CakePHP **não** terão nenhum
método existente alterado. Novos métodos podem ser adicionados, mas nenhum método existente será
alterado.

Classes
-------

Classes fornecidas pelo CakePHP podem ser construídas e ter seus métodos públicos e
propriedades usadas por código de aplicação e fora de lançamentos principais a
compatibilidade com versões anteriores é garantida.

.. note::

    Algumas classes no CakePHP são marcadas com a tag de documentação API ``@internal``. Essas
    classes **não** são estáveis e não têm nenhuma promessa de compatibilidade com versões anteriores.

Em lançamentos menores, novos métodos podem ser adicionados a classes, e métodos existentes podem
ter novos argumentos adicionados. Quaisquer novos argumentos terão valores padrão, mas se
você substituiu métodos com uma assinatura diferente, pode ver erros fatais.
Métodos que tiverem novos argumentos adicionados serão documentados no guia de migração
para aquele lançamento.

A tabela a seguir descreve vários casos de uso e qual compatibilidade você pode
esperar do CakePHP:

+-------------------------------+--------------------------+
| Se você...                    | Compatibilidade?         |
+===============================+==========================+
| Typehint contra a classe      | Sim                      |
+-------------------------------+--------------------------+
| Cria uma nova instância       | Sim                      |
+-------------------------------+--------------------------+
| Estende a classe              | Sim                      |
+-------------------------------+--------------------------+
| Acessa uma propriedade pública| Sim                      |
+-------------------------------+--------------------------+
| Chama um método público       | Sim                      |
+-------------------------------+--------------------------+
| **Estende uma classe e...**                              |
+-------------------------------+--------------------------+
| Substitui uma propriedade     | Sim                      |
| pública                       |                          |
+-------------------------------+--------------------------+
| Acessa uma propriedade        | Não [1]_                 |
| protegida                     |                          |
+-------------------------------+--------------------------+
| Substitui uma propriedade     | Não [1]_                 |
| protegida                     |                          |
+-------------------------------+--------------------------+
| Substitui um método protegido | Não [1]_                 |
+-------------------------------+--------------------------+
| Chama um método protegido     | Não [1]_                 |
+-------------------------------+--------------------------+
| Adiciona uma propriedade      | Não                      |
| pública                       |                          |
+-------------------------------+--------------------------+
| Adiciona um método público    | Não                      |
+-------------------------------+--------------------------+
| Adiciona um argumento a um    | Não [1]_                 |
| método substituído            |                          |
+-------------------------------+--------------------------+
| Adiciona um valor de argumento| Sim                      |
| padrão a um argumento de      |                          |
| método existente              |                          |
+-------------------------------+--------------------------+

Trabalhando no CakePHP
======================

Se você está ajudando a tornar o CakePHP ainda melhor, por favor, mantenha as seguintes diretrizes
em mente ao adicionar/alterar funcionalidades:

Em um lançamento menor você pode:

+-------------------------------+--------------------------+
| Em um lançamento menor você                              |
| pode...                       |                          |
+===============================+==========================+
| **Classes**                                              |
+-------------------------------+--------------------------+
| Remover uma classe            | Não                      |
+-------------------------------+--------------------------+
| Remover uma interface         | Não                      |
+-------------------------------+--------------------------+
| Remover uma trait             | Não                      |
+-------------------------------+--------------------------+
| Tornar final                  | Não                      |
+-------------------------------+--------------------------+
| Tornar abstrata               | Não                      |
+-------------------------------+--------------------------+
| Mudar nome                    | Sim [2]_                 |
+-------------------------------+--------------------------+
| **Propriedades**                                         |
+-------------------------------+--------------------------+
| Adicionar uma propriedade     | Sim                      |
| pública                       |                          |
+-------------------------------+--------------------------+
| Remover uma propriedade       | Não                      |
| pública                       |                          |
+-------------------------------+--------------------------+
| Adicionar uma propriedade     | Sim                      |
| protegida                     |                          |
+-------------------------------+--------------------------+
| Remover uma propriedade       | Sim [3]_                 |
| protegida                     |                          |
+-------------------------------+--------------------------+
| **Métodos**                                              |
+-------------------------------+--------------------------+
| Adicionar um método público   | Sim                      |
+-------------------------------+--------------------------+
| Remover um método público     | Não                      |
+-------------------------------+--------------------------+
| Adicionar um método protegido | Sim                      |
+-------------------------------+--------------------------+
| Mover para classe pai         | Sim                      |
+-------------------------------+--------------------------+
| Remover um método protegido   | Sim [3]_                 |
+-------------------------------+--------------------------+
| Reduzir visibilidade          | Não                      |
+-------------------------------+--------------------------+
| Mudar nome do método          | Sim [2]_                 |
+-------------------------------+--------------------------+
| Adicionar um novo argumento   | Sim                      |
| com valor padrão              |                          |
+-------------------------------+--------------------------+
| Adicionar um novo argumento   | Não                      |
| obrigatório a um método       |                          |
| existente                     |                          |
+-------------------------------+--------------------------+
| Remover um valor padrão de    | Não                      |
| um argumento existente        |                          |
+-------------------------------+--------------------------+
| Mudar tipo de método para void| Sim                      |
+-------------------------------+--------------------------+

.. [1] Seu código *pode* ser quebrado por lançamentos menores. Verifique o guia de migração
       para detalhes.
.. [2] Você pode mudar um nome de classe/método desde que o nome antigo permaneça
       disponível. Isso geralmente é evitado a menos que a renomeação tenha benefício
       significativo.
.. [3] Evite sempre que possível. Quaisquer remoções precisam ser documentadas no
       guia de migração.

Depreciações
============

Em cada lançamento menor, recursos podem ser depreciados. Se recursos forem depreciados,
documentação da API e avisos em tempo de execução serão adicionados. Erros em tempo de execução ajudam você
a localizar código que precisa ser atualizado antes de quebrar. Se você deseja desabilitar
avisos em tempo de execução, pode fazê-lo usando o valor de configuração ``Error.errorLevel``::

    // em config/app.php
    // ...
    'Error' => [
        'errorLevel' => E_ALL ^ E_USER_DEPRECATED,
    ]
    // ...

Isso desabilitará avisos de depreciação em tempo de execução.

.. _experimental-features:

Recursos Experimentais
======================

Recursos experimentais **não estão incluídos** nas promessas de compatibilidade com versões anteriores
acima. Recursos experimentais podem ter mudanças quebradas feitas em lançamentos menores
enquanto permanecerem experimentais. Recursos experimentais podem ser identificados pelo
aviso no livro e pelo uso de ``@experimental`` na documentação
da API.

Recursos experimentais são destinados a ajudar a coletar feedback sobre como um recurso
funciona antes de se tornar estável. Uma vez que as interfaces e comportamento tenham sido verificados
com a comunidade, as flags experimentais serão removidas.

