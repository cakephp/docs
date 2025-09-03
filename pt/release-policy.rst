Política de Lançamento
######################

O CakePHP segue o Versionamento Semântico para todos os lançamentos. Isso segue a convenção de versionamento
de **major.minor.patch**.

A equipe de desenvolvimento tenta garantir que cada lançamento siga as restrições e
garantias abaixo.

Lançamentos Principais
----------------------

Lançamentos principais geralmente não são compatíveis com versões anteriores. Embora o CakePHP tente
não alterar muitos recursos importantes em lançamentos principais, há mudanças na API.

As mudanças em lançamentos principais podem incluir quase tudo, mas são sempre usadas para
remover recursos obsoletos e atualizar interfaces.

Quaisquer mudanças de comportamento que não sejam compatíveis com versões anteriores são feitas em mudanças principais.

Cada lançamento principal normalmente vem com um guia de atualização e muitas atualizações
de código automáticas usando o rector.

Lançamentos Menores
-------------------

Lançamentos menores geralmente são compatíveis com versões anteriores com o lançamento menor e o patch
anteriores.

Recursos podem ser descontinuados, mas nunca são removidos em uma versão menor.

As interfaces não são alteradas, mas anotações podem ser adicionadas para novos métodos expostos
em implementações fornecidas pelo CakePHP.

Novos recursos geralmente são adicionados apenas em versões menores para que os usuários possam acompanhar as notas de migração.
Novos recursos também podem incluir novas exceções lançadas quando o comportamento é corrigido
ou bugs são relatados.

Mudanças de comportamento que exigem documentação são feitas em versões menores, mas estas
ainda são normalmente compatíveis com versões anteriores. Algumas exceções podem ser feitas se o problema for grave.

.. note:
    Versões menores também são conhecidas como versões pontuais.

Versões de Patch
----------------

Versões de patch são sempre compatíveis com versões anteriores. Somente alterações que corrigem recursos quebrados
são feitas.

Normalmente, os usuários devem poder confiar que as versões de patch não alteram o comportamento, exceto
para corrigir um problema.

Problemas que alteram comportamentos antigos normalmente não estão em versões de patch. Estas são
consideradas mudanças de comportamento e serão incluídas em versões menores ou maiores para que os usuários possam
migrar.

.. note:
    Lançamentos de patches também são conhecidos como lançamentos de correção de bugs.

Recursos Experimentais
----------------------

Quando um novo recurso é adicionado onde a API ainda está mudando, ele pode ser marcado como **experimental**.

Recursos experimentais devem seguir a mesma convenção de lançamentos menores e de correção de bugs. No entanto,
alterações na API podem ser incluídas em lançamentos menores, o que pode alterar significativamente o comportamento.

Os usuários devem sempre esperar que uma API mude antes que os recursos experimentais sejam totalmente lançados.