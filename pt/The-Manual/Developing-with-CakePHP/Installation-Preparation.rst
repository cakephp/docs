Preparando a instalação
#######################

CakePHP é rápido e fácil de instalar. Os requisitos minimos são um
servidor web e uma cópia do Cake, só isso! Apesar deste manual focar
principalmente na configuração com Apache (porque ele é o mais comum),
você pode configurar o Cake para executar em diversos servidores weh,
tais como LightHTTPD ou Microsoft IIS.

A preparação para a instalação consiste dos seguintes passos:

-  Baixar uma cópia do CakePHP
-  Configurar seu servidor web para manipular php, se necessário
-  Checar permissão de arquivos

Baixando o CakePHP
==================

Há duas maneiras de pegar uma cópia do CakePHP, Primeiro: você pode
baixar o arquivo (zip/tar.gz/tar.bz2) ou você pode baixar o código do
repositório GIT.

Para pegar a cópia estável, visite o site
`https://cakephp.org <https://cakephp.org>`_. Lá haverá um link
chamado “Download Now!” para baixar.

Todas as versões do CakePHP também são armazenados no CakeForge, a casa
do CakePHP. Esse site também contém links para muitos outros projetos
CakePHP, incluindo plugins e aplicações para CakePHP. As versões de
CakePHP estão disponíveis em
`http://cakeforge.org/projects/cakephp <http://cakeforge.org/projects/cakephp>`_.

Uma alternativa são as compilações do tipo nighlyt, que incluem
correções de bugs e melhorias do último minuto (bem, do último dia).
Elas podem ser acessadas a partir do índice de download aqui:
`https://cakephp.org/downloads/index/nightly <https://cakephp.org/downloads/index/nightly>`_.
Para atualizações verdadeiramente do último minuto, você pode buscá-las
diretamente do branch de desenvolvimento no repositório GIT aqui:
`http://code.cakephp.org/source <http://code.cakephp.org/source>`_.

Permissões
==========

O CakePHP usa o diretório /app/tmp para diversas operações. Descritivos
dos modelos, fazer cache de visões e informações das sessões são alguns
exemplos.

Assim, tenha certeza que o diretório /app/tmp na instalação do seu cake
permite escrita pelo usuário do servidor de web.
