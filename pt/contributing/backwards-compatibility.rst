Guia de retrocompatibilidade
############################

Garantir que você possa atualizar suas aplicações facilmente é importante para
nós. Por esse motivo, apenas quebramos compatibilidade nos *major releases*.
Você deve estar familiarizado  com
`versionamento semântico <http://semver.org/>`_, orientação usada em
todos os projetos do CakePHP. Resumindo, significa que apenas *major releases*
(tais como 2.0, 3.0, 4.0) podem quebrar retrocompatibilidades. *Minor releases*
(tais como 2.1, 3.1, 4.1) podem introduzir novos recursos, mas não podem quebrar
retrocompatibilidades. *Releases* de correção de *bugs* (tais como 2.1.2, 3.0.1)
não incluem novos recursos, são destinados apenas à correção de erros e melhora
de desempenho.

.. note::

    O CakePHP começou a seguir o versionamento semântico na versão 2.0.0. Essas
    regras não se aplicam às versões 1.x.

Para esclarecer que mudanças você pode esperar em cada ciclo de *release*, nós
temos mais informações detalhadas para desenvolvedores usando o CakePHP, e para
desenvolvedores trabalhando Não CakePHP que ajudam a definir espectativas do que
pode ser feito em *minor releases*. *Major releases* podem ter tantas quebras
quanto forem necessárias.

Guia de migração
================

Para cada *major* ou *minor releases*, a equipe do CakePHP vai disponibilizar
um guia de migração. Esses guias explicam os novos recursos e qualquer quebra
de compatibilidade. Eles podem ser encontrados na seção :doc:`/appendices` do
manual.

Usando o CakePHP
================

Se você está construindo sua aplicação com o CakePHP, as orientações a seguir
vão demonstrar a estabilidade que você pode esperar.

Interfaces
----------

Com exceção dos *major releases*, interfaces oferecidas pelo CakePHP **não**
irão ter alterações em qualquer método. Novos métodos podem ser incluídos, mas
nenhum método existente será alterado.

Classes
-------

Classes oferecidas pelo CakePHP podem ser construidas e ter seus métodos
públicos e propriedades usados Não código da aplicação e com exceção de
*major releases* a retrocompatibilidade é garantida.

.. note::

    Algumas classes Não CakePHP são marcadas com a *tag* da documentação da API
    ``@internal``. Essas classes **não** são estáveis e não tem garantias de
    retrocompatibilidade.

Em *minor releases*, novos métodos podem ser adicionados a classes, e métodos
existentes podem passar a receber novos argumentos. Qualquer novo argumento vai
ter valores padrões, mas se você sobrescrever métodos com uma assinatura
diferente, é possível que você receba erros fatais. Métodos que recebem novos
argumentos serão documentados Não guia de migração correspondente ao *release*.

A tabela a seguir descreve quais casos de uso e que tipo de compatibilidade
você pode esperar do CakePHP.

+-------------------------------+--------------------------+
| Se você...                    | Retrocompatibilidade?    |
+===============================+==========================+
| Typehint referente à classe   | Sim                      |
+-------------------------------+--------------------------+
| Criar uma nova instância      | Sim                      |
+-------------------------------+--------------------------+
| Estender a classe             | Sim                      |
+-------------------------------+--------------------------+
| Acessar uma propriedade       | Sim                      |
| pública                       |                          |
+-------------------------------+--------------------------+
| Chamar um método público      | Sim                      |
+-------------------------------+--------------------------+
| **Estender uma classe e...**                             |
+-------------------------------+--------------------------+
| Sobrescrever uma              | Sim                      |
| propriedade pública           |                          |
+-------------------------------+--------------------------+
| Acessar uma propriedade       | Não [1]_                 |
| protegida                     |                          |
+-------------------------------+--------------------------+
| Sobrescrever uma              | Não [1]_                 |
| propriedade protegida         |                          |
+-------------------------------+--------------------------+
| Sobrescrever um método        | Não [1]_                 |
+-------------------------------+--------------------------+
| Chamar um método protegido    | Não [1]_                 |
+-------------------------------+--------------------------+
| Adicionar uma propriedade     | Não                      |
| pública                       |                          |
+-------------------------------+--------------------------+
| Adicionar um método público   | Não                      |
+-------------------------------+--------------------------+
| Adicionar um argumento        | Não [1]_                 |
| a um método sobrescrito       |                          |
+-------------------------------+--------------------------+
| Adicinar um valor padrão      | Sim                      |
| a um argumento de método      |                          |
| existente                     |                          |
+-------------------------------+--------------------------+

Trabalhando no CakePHP
======================

Se você está ajudando a fazer o CakePHP ainda melhor, por favor, siga as
orientações a seguir quando estiver adicionando/alterando funcionalidades:

Em um *minor release* você pode:

+-------------------------------+--------------------------+
| Em um *minor release* você pode...                       |
+===============================+==========================+
| **Classes**                                              |
+-------------------------------+--------------------------+
| Remover uma classe            | Não                      |
+-------------------------------+--------------------------+
| Remover uma interface         | Não                      |
+-------------------------------+--------------------------+
| Remover um trait              | Não                      |
+-------------------------------+--------------------------+
| Tornar final                  | Não                      |
+-------------------------------+--------------------------+
| Tornar abstract               | Não                      |
+-------------------------------+--------------------------+
| Trocar o nome                 | Sim [2]_                 |
+-------------------------------+--------------------------+
| **Properties**                                           |
+-------------------------------+--------------------------+
| Adicionar uma propriedade     | Sim                      |
| pública                       |                          |
+-------------------------------+--------------------------+
| Remove a public property      | Não                      |
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
| Adicionar um método público   | Sim                      |
+-------------------------------+--------------------------+
| Mover para uma classe parente | Sim                      |
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
| a um método existente.        |                          |
+-------------------------------+--------------------------+
| Remover um valor padrão de    | Não                      |
| um argumento existente        |                          |
+-------------------------------+--------------------------+


.. [1] Seu código *pode* ser quebrado por *minor releases*. Verifique o guia de
       migração para mais detalhes.
.. [2] Você pode mudar o nome de uma classe/método desde que o nome antigo
       permaneça disponível. Isso normalmente é evitado, a não ser que a
       renomeação traga algum benefício significante.
.. [3] Evite sempre que possível. Qualquer remoção precisa ser documentada
       no guia de migração.

