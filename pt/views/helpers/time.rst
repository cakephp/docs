Time
####

.. php:namespace:: Cake\View\Helper

.. php:class:: TimeHelper(View $view, array $config = [])

O TimeHelper permite o processamento rápido de informações relacionadas ao tempo.
O TimeHelper tem duas tarefas principais que pode realizar:

#. Ele pode formatar strings de tempo.
#. Ele pode testar tempo.

Usando o Helper
===============

Um uso comum do TimeHelper é compensar a data e hora para corresponder ao fuso
horário de um usuário. Vamos usar um fórum como exemplo. Seu fórum tem muitos usuários que
podem postar mensagens a qualquer momento de qualquer parte do mundo. Uma maneira de
gerenciar o tempo é salvar todas as datas e horas como GMT+0 ou UTC. Descomente a
linha ``date_default_timezone_set('UTC');`` em **config/bootstrap.php** para garantir
que o fuso horário da sua aplicação esteja definido como GMT+0.

Em seguida, adicione um campo de fuso horário à sua tabela de usuários e faça as modificações necessárias
para permitir que seus usuários definam seu fuso horário. Agora que sabemos
o fuso horário do usuário logado, podemos corrigir a data e hora em nossas
postagens usando o TimeHelper::

    echo $this->Time->format(
      $post->created,
      \IntlDateFormatter::FULL,
      false,
      $user->time_zone
    );
    // Exibirá 'Saturday, August 22, 2011 at 11:53:00 PM GMT'
    // para um usuário em GMT+0. Enquanto exibe,
    // 'Saturday, August 22, 2011 at 03:53 PM GMT-8:00'
    // para um usuário em GMT-8

A maioria dos recursos do TimeHelper são destinados como interfaces compatíveis com versões anteriores
para aplicações que estão atualizando de versões mais antigas do CakePHP. Porque o
ORM retorna instâncias de :php:class:`Cake\\I18n\\Time` para cada coluna ``timestamp``
e ``datetime``, você pode usar os métodos lá para fazer a maioria das tarefas.
Por exemplo, para ler sobre as strings de formatação aceitas, dê uma olhada no método
`Cake\\I18n\\Time::i18nFormat()
<https://api.cakephp.org/5.x/class-Cake.I18n.Time.html#i18nFormat()>`_.

.. meta::
    :title lang=pt: TimeHelper
    :description lang=pt: O TimeHelper ajudará você a formatar tempo e testar tempo.
    :keywords lang=pt: time helper,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
