5.1.2 Defining Permissions: Cake's INI-based ACL
------------------------------------------------

Cake's first ACL implementation was based on INI files stored in
the Cake installation. While it's useful and stable, we recommend
that you use the database backed ACL solution, mostly because of
its ability to create new ACOs and AROs on the fly. We meant it for
usage in simple applications - and especially for those folks who
might not be using a database for some reason.

By default, CakePHP's ACL is database-driven. To enable INI-based
ACL, you'll need to tell CakePHP what system you're using by
updating the following lines in app/config/core.php

::

    //Change these lines:
    Configure::write('Acl.classname', 'DbAcl');
    Configure::write('Acl.database', 'default');
    
    //To look like this:
    Configure::write('Acl.classname', 'IniAcl');
    //Configure::write('Acl.database', 'default');

ARO/ACO permissions are specified in **/app/config/acl.ini.php**.
The basic idea is that AROs are specified in an INI section that
has three properties: groups, allow, and deny.


-  groups: names of ARO groups this ARO is a member of.
-  allow: names of ACOs this ARO has access to
-  deny: names of ACOs this ARO should be denied access to

ACOs are specified in INI sections that only include the allow and
deny properties.

As an example, let's see how the Fellowship ARO structure we've
been crafting would look like in INI syntax:

::

    ;-------------------------------------
    ; AROs
    ;-------------------------------------
    [aragorn]
    groups = warriors
    allow = diplomacy
    
    [legolas]
    groups = warriors
    
    [gimli]
    groups = warriors
    
    [gandalf]
    groups = wizards
    
    [frodo]
    groups = hobbits
    allow = ring
    
    [bilbo]
    groups = hobbits
    
    [merry]
    groups = hobbits
    deny = ale
    
    [pippin]
    groups = hobbits
    
    [gollum]
    groups = visitors
    
    ;-------------------------------------
    ; ARO Groups
    ;-------------------------------------
    [warriors]
    allow = weapons, ale, salted_pork
    
    [wizards]
    allow = salted_pork, diplomacy, ale
    
    [hobbits]
    allow = ale
    
    [visitors]
    allow = salted_pork

Now that you've got your permissions defined, you can skip along to
`the section on checking permissions </view/1249/Checking-Permissions-The-ACL-Component>`_
using the ACL component.

5.1.2 Defining Permissions: Cake's INI-based ACL
------------------------------------------------

Cake's first ACL implementation was based on INI files stored in
the Cake installation. While it's useful and stable, we recommend
that you use the database backed ACL solution, mostly because of
its ability to create new ACOs and AROs on the fly. We meant it for
usage in simple applications - and especially for those folks who
might not be using a database for some reason.

By default, CakePHP's ACL is database-driven. To enable INI-based
ACL, you'll need to tell CakePHP what system you're using by
updating the following lines in app/config/core.php

::

    //Change these lines:
    Configure::write('Acl.classname', 'DbAcl');
    Configure::write('Acl.database', 'default');
    
    //To look like this:
    Configure::write('Acl.classname', 'IniAcl');
    //Configure::write('Acl.database', 'default');

ARO/ACO permissions are specified in **/app/config/acl.ini.php**.
The basic idea is that AROs are specified in an INI section that
has three properties: groups, allow, and deny.


-  groups: names of ARO groups this ARO is a member of.
-  allow: names of ACOs this ARO has access to
-  deny: names of ACOs this ARO should be denied access to

ACOs are specified in INI sections that only include the allow and
deny properties.

As an example, let's see how the Fellowship ARO structure we've
been crafting would look like in INI syntax:

::

    ;-------------------------------------
    ; AROs
    ;-------------------------------------
    [aragorn]
    groups = warriors
    allow = diplomacy
    
    [legolas]
    groups = warriors
    
    [gimli]
    groups = warriors
    
    [gandalf]
    groups = wizards
    
    [frodo]
    groups = hobbits
    allow = ring
    
    [bilbo]
    groups = hobbits
    
    [merry]
    groups = hobbits
    deny = ale
    
    [pippin]
    groups = hobbits
    
    [gollum]
    groups = visitors
    
    ;-------------------------------------
    ; ARO Groups
    ;-------------------------------------
    [warriors]
    allow = weapons, ale, salted_pork
    
    [wizards]
    allow = salted_pork, diplomacy, ale
    
    [hobbits]
    allow = ale
    
    [visitors]
    allow = salted_pork

Now that you've got your permissions defined, you can skip along to
`the section on checking permissions </view/1249/Checking-Permissions-The-ACL-Component>`_
using the ACL component.
