Glossary
########

.. glossary::

    routing array
        An array of attributes that are passed to :php:meth:`Router::url()`.
        They typically look like::

            array('controller' => 'posts', 'action' => 'view', 5)
            
        Or a more complex example::

            array(
                'subdomain' => 'dev',
                'plugin' => 'account',
                'prefix' => 'admin',
                'controller' => 'profiles',
                'action' => 'edit',
                10257
                '#' => 'email',
                '?' => array(
                    'reset' => true,
                ),
                'full_base' => true,
            )

    HTML attributes
        An array of key => values that are composed into HTML attributes. For example::

            // Given
            array('class' => 'my-class', 'target' => '_blank')

            // Would generate
            class="my-class" target="_blank"

        If an option can be minimized or accepts it's name as the value, then ``true``
        can be used::

            // Given
            array('checked' => true)

            // Would generate
            checked="checked"

    plugin syntax
        Plugin syntax refers to the dot separated class name indicating classes
        are part of a plugin. E.g. ``DebugKit.Toolbar`` The plugin is DebugKit,
        and the class name is Toolbar.

    dot notation
        Dot notation defines an array path, by separating nested levels with ``.``
        For example::

            Asset.filter.css

        Would point to the following value::

            array(
                'Asset' => array(
                    'filter' => array(
                        'css' => 'got me'
                    )
                )
            )

    CSRF
        Cross Site Request Forgery. Prevents replay attacks, double
        submissions and forged requests from other domains.

    routes.php
        A file in APP/Config that contains routing configuration.
        This file is included before each request is processed.
        It should connect all the routes your application needs so
        requests can be routed to the correct controller + action.

    DRY
        Don't repeat yourself. Is a principle of software development aimed at
        reducing repetition of information of all kinds. In CakePHP DRY is used
        to allow you to code things once and re-use them across your
        application.


.. meta::
    :title lang=en: Glossary
    :keywords lang=en: html attributes,array class,array controller,glossary glossary,target blank,dot notation,routing configuration,forgery,replay,router,syntax,config,submissions
