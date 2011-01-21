4.7.12 Running tests in the Command Line
----------------------------------------

If you have simpletest installed you can run your tests from the
command line of your application.

from **app/**
::

    cake testsuite help



::

    Usage: 
        cake testsuite category test_type file
            - category - "app", "core" or name of a plugin
            - test_type - "case", "group" or "all"
            - test_file - file name with folder prefix and without the (test|group).php suffix
    
    Examples: 
            cake testsuite app all
            cake testsuite core all
    
            cake testsuite app case behaviors/debuggable
            cake testsuite app case models/my_model
            cake testsuite app case controllers/my_controller
    
            cake testsuite core case file
            cake testsuite core case router
            cake testsuite core case set
    
            cake testsuite app group mygroup
            cake testsuite core group acl
            cake testsuite core group socket
    
            cake testsuite bugs case models/bug
              // for the plugin 'bugs' and its test case 'models/bug'
            cake testsuite bugs group bug
              // for the plugin bugs and its test group 'bug'
    
    Code Coverage Analysis: 
    
    
    Append 'cov' to any of the above in order to enable code coverage analysis

As the help menu suggests, you'll be able to run all, part, or just
a single test case from your app, plugin, or core, right from the
command line.

If you have a model test of **test/models/my\_model.test.php**
you'd run just that test case by running:

::

    cake testsuite app models/my_model

4.7.12 Running tests in the Command Line
----------------------------------------

If you have simpletest installed you can run your tests from the
command line of your application.

from **app/**
::

    cake testsuite help



::

    Usage: 
        cake testsuite category test_type file
            - category - "app", "core" or name of a plugin
            - test_type - "case", "group" or "all"
            - test_file - file name with folder prefix and without the (test|group).php suffix
    
    Examples: 
            cake testsuite app all
            cake testsuite core all
    
            cake testsuite app case behaviors/debuggable
            cake testsuite app case models/my_model
            cake testsuite app case controllers/my_controller
    
            cake testsuite core case file
            cake testsuite core case router
            cake testsuite core case set
    
            cake testsuite app group mygroup
            cake testsuite core group acl
            cake testsuite core group socket
    
            cake testsuite bugs case models/bug
              // for the plugin 'bugs' and its test case 'models/bug'
            cake testsuite bugs group bug
              // for the plugin bugs and its test group 'bug'
    
    Code Coverage Analysis: 
    
    
    Append 'cov' to any of the above in order to enable code coverage analysis

As the help menu suggests, you'll be able to run all, part, or just
a single test case from your app, plugin, or core, right from the
command line.

If you have a model test of **test/models/my\_model.test.php**
you'd run just that test case by running:

::

    cake testsuite app models/my_model
