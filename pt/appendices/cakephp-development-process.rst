Processo de Desenvolvimento do CakePHP
######################################

Os projetos CakePHP seguem amplamente o `semver <https://semver.org/>`__. Isso significa que:

- As versões são numeradas na forma de **A.B.C**
- Versões **A** são *versões principais*. Elas contêm mudanças incompatíveis e exigirão
  quantidades não triviais de trabalho para atualizar de uma versão **A** inferior.
- Versões **A.B** são *versões de funcionalidades*. Cada versão será compatível com versões
  anteriores, mas pode introduzir novas depreciações. Se uma mudança incompatível for
  absolutamente necessária, será anotada no guia de migração para essa versão.
- Versões **A.B.C** são versões de *correção*. Elas devem ser compatíveis com a versão
  de correção anterior. A exceção a esta regra é se um problema de segurança for
  descoberto e a única solução for quebrar uma API existente.

Veja :doc:`/contributing/backwards-compatibility` para o que consideramos ser
compatível com versões anteriores e mudanças incompatíveis.

Versões Principais
==================

Versões principais introduzem novos recursos e podem remover funcionalidades depreciadas em
uma versão anterior. Essas versões vivem em branches ``next`` que correspondem ao seu
número de versão, como ``5.next``. Uma vez lançadas, elas são promovidas para ``master``
e então a branch ``5.next`` é usada para futuras versões de funcionalidades.

Versões de Funcionalidades
===========================

Versões de funcionalidades são onde novos recursos ou extensões para recursos existentes são
entregues. Cada série de versão que recebe atualizações terá uma branch ``next``. Por
exemplo ``4.next``. Se você gostaria de contribuir com um novo recurso, por favor, direcione
para essas branches.

Versões de Correção
====================

Versões de correção corrigem bugs em código/documentação existente e devem sempre ser
compatíveis com versões de correção anteriores da mesma versão de funcionalidade. Essas
versões são criadas a partir das branches estáveis. Branches estáveis são frequentemente nomeadas
após a série de versão, como ``3.x``.

Cadência de Versões
===================

- *Versões Principais* são entregues aproximadamente a cada dois a três anos. Esse prazo
  nos força a ser deliberados e cuidadosos com nossas mudanças incompatíveis e dá
  tempo para a comunidade acompanhar sem sentir que está sendo deixada para trás.
- *Versões de Funcionalidades* são entregues a cada cinco a oito meses.
- *Versões de Correção* são inicialmente entregues a cada duas semanas. À medida que uma versão de funcionalidade
  amadurece, essa cadência relaxa para um cronograma mensal.

Política de Depreciação
========================

Antes que um recurso possa ser removido em uma versão principal, ele precisa ser depreciado.
Quando um comportamento é depreciado na versão **A.x**, ele continuará a funcionar para
o restante de todas as versões **A.x**. Depreciações são geralmente indicadas via
avisos do PHP. Você pode habilitar avisos de depreciação adicionando ``E_USER_DEPRECATED`` ao
valor ``Error.level`` da sua aplicação.

Uma vez depreciado, o comportamento não é removido até a próxima versão principal. Por
exemplo, comportamento depreciado em ``4.1`` será removido em ``5.0``.

.. meta::
    :title lang=pt: Processo de Desenvolvimento do CakePHP
    :keywords lang=pt: branch de manutenção,interação com a comunidade,recurso da comunidade,recurso necessário,versão estável,sistema de tickets,recurso avançado,usuários avançados,conjunto de recursos,chat irc,ponta de lança,router,novos recursos,membros,tentativa,branches de desenvolvimento,desenvolvimento de branch
