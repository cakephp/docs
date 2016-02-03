Processo de desenvolvimento no CakePHP
######################################

Aqui tentamos explicar o processo utilizado no desenvolvimento com o framework
CakePHP. Nós dependemos fortemente da interação por tickets e no canal do IRC.
O IRC é o melhor lugar para encontrar membros do
`time de desenvolvimento <https://github.com/cakephp?tab=members>`_ e discutir
idéias, o ultimo código e fazer comentários gerais. Se algo mais formal tem que
ser proposto ou exite um problema com uma versão, o sistema de tickets é o
melhor lugar para compartilhar seus pensamentos.

Nós atualmente mantemos 4 versões do CakePHP.

- **versões tageadas** : Versões tageadas são destinadas para produção onde uma
  estabilidade maior é mais importante do que funcionalidades. Questões sobre versões
  tageadas serão resolvidas no branch relacionado e serão parte do próximo release.
- **branch principal** : Esses branches são onde todas as correções são fundidas.
  Versões estáveis são rotuladas apartir desses branches. ``master`` é o principal
  branch para a versão atual. ``2.x`` é o branch de manutenção para a versão 2.x.
  Se você está usando versões estáveis e precisa de correções que não chegaram em
  uma versão tageada olhe aqui.
- **desenvolvimento** ; O branch de desenvolvimento contém sempre as ultimas
  correções e funcionalidades. Eles são nomeados pela versão a qual se destinam,
  ex: *3.next%. Uma vez que estas braches estão estáveis elas são fundidas na
  branch principal da versão.
- **branches de funcionalidades** : Branches de funcionalidade contém trabalhos
  que estão sendo desenvolvidos ou possivelmente instáveis e são recomendadas
  apenas para usuários avançados interessados e dispostos a contribuir com a
  comunidade. Branches de funcionalidade são nomeadas pela seguinte convenção
  *versão-funcionalidade*. Um exemplo seria *3.3-router* Que conteria novas funcionalidades
  para o Router na 3.3

Esperamos que isso te ajudará a entender que versão é correta pra você.
Uma vez que escolhida a versão você pode se sentir compelido a reportar um erro ou
fazer comentários gerais no código.

- Se você está usando uma versão estável ou de manutenção, por favor envie tickets
  ou discuta conosco no IRC.
- Se você está usando uma branch de desenvolvimento ou funcionalidade, o primeiro
  lugar para ir é o IRC. Se você tem um comentário e não consegue entrar no IRC
  depois de um ou dois dias, envie um ticket.

Se você encontrar um problema, a melhor resposta é escrever um teste. O melhor conselho
que podemos oferecer em escrever testes é olhar nos que estão no núcleo do projeto.

E sempre, se você tiver alguma questão ou cometários, nos visite no #cakephp no
irc.freenode.net

.. meta::
  :title lang=pt: Processo de desenvolvimento no CakePHP
  :keywords lang=pt: manutenção, interação com a comunidade, comunidade, funcionalidade, versão estável, ticket, funcionalidade avançada, usuários avançados, irc, desenvolvimento, tentativas
