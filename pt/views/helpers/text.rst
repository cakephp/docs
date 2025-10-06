Text
####

.. php:namespace:: Cake\View\Helper

.. php:class:: TextHelper(View $view, array $config = [])

O TextHelper contém métodos para tornar o texto mais utilizável e
amigável em suas views. Ele auxilia na criação de links, formatação de URLs,
criação de trechos de texto em torno de palavras ou frases escolhidas,
destacando palavras-chave em blocos de texto, e truncando graciosamente
longos trechos de texto.

Vinculando Endereços de E-mail
===============================

.. php:method:: autoLinkEmails(string $text, array $options = [])

Adiciona links aos endereços de e-mail bem formados em $text, de acordo
com quaisquer opções definidas em ``$options`` (consulte
:php:meth:`HtmlHelper::link()`). ::

    $myText = 'Para mais informações sobre nossas sobremesas e doces ' .
        'mundialmente famosos, entre em contato info@example.com';
    $linkedText = $this->Text->autoLinkEmails($myText);

Saída::

    Para mais informações sobre nossas sobremesas e doces mundialmente famosos,
    entre em contato <a href="mailto:info@example.com">info@example.com</a>

Este método automaticamente escapa sua entrada. Use a opção ``escape``
para desabilitar isso se necessário.

Vinculando URLs
===============

.. php:method:: autoLinkUrls(string $text, array $options = [])

Igual a ``autoLinkEmails()``, apenas este método procura por
strings que começam com https, http, ftp, ou nntp e as vincula
apropriadamente.

Este método automaticamente escapa sua entrada. Use a opção ``escape``
para desabilitar isso se necessário.

Vinculando Tanto URLs quanto Endereços de E-mail
=================================================

.. php:method:: autoLink(string $text, array $options = [])

Executa a funcionalidade tanto de ``autoLinkUrls()`` quanto de
``autoLinkEmails()`` no ``$text`` fornecido. Todas as URLs e e-mails
são vinculados apropriadamente de acordo com as ``$options`` fornecidas.

Este método automaticamente escapa sua entrada. Use a opção ``escape``
para desabilitar isso se necessário.

Opções adicionais:

* ``stripProtocol``: Remove ``http://`` e ``https://`` do início do
  rótulo do link. Padrão desligado.
* ``maxLength``: O comprimento máximo do rótulo do link. Padrão desligado.
* ``ellipsis``: A string a ser anexada ao final do rótulo do link. Padrão é
  reticências UTF8.

Convertendo Texto em Parágrafos
================================

.. php:method:: autoParagraph(string $text)

Adiciona <p> apropriados ao redor do texto onde retornos de linha duplos são encontrados, e <br> onde
retornos de linha simples são encontrados. ::

    $myText = 'Para mais informações
    sobre nossas sobremesas e doces mundialmente famosos.

    entre em contato info@example.com';
    $formattedText = $this->Text->autoParagraph($myText);

Saída::

    <p>Para mais informações<br />
    sobre nossas sobremesas e doces mundialmente famosos.</p>
    <p>entre em contato info@example.com</p>

.. include:: /core-libraries/text.rst
    :start-after: start-text
    :end-before: end-text

.. meta::
    :title lang=pt: TextHelper
    :description lang=pt: O TextHelper contém métodos para tornar o texto mais utilizável e amigável em suas views.
    :keywords lang=pt: text helper,autoLinkEmails,autoLinkUrls,autoLink,excerpt,highlight,stripLinks,truncate,string text
