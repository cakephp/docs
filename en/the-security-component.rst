The Security Component
######################

The Security component is used to secure your controller actions against
malicious or errant requests. It allows you to set up the conditions
under which an action can be requested, and optionally specify how to
deal with requests that don't meet those requirements. Again, before
using the Security component, you must make sure that 'Security' is
listed in your controllers' $components array.

Protecting Controller Actions
=============================

The Security component contains two primary methods for restricting
access to controller actions:

requirePost
---------------

-  string *$action1*
-  string *$action2*
-  string *$action3...*

In order for the specified actions to execute, they must be requested
via POST.

requireAuth
-----------

-  string *$action1*
-  string *$action2*
-  string *$action3...*

Ensures that a request is coming from within the application by checking
an authentication key in the POST'ed form data against an authentication
key stored in the user's session. If they match, the action is allowed
to execute. Be aware, however, that for reasons of flexibility, this
check is only run if form data has actually been posted. If the action
is called with a regular GET request, requireAuth() will do nothing. For
maximum security, you should use requirePost() and requireAuth() on
actions that you want fully protected. Learn more about how the
authentication key is generated, and how it ends up where it should in
Section 4 below.

But first, let's take a look at a simple example::

    <?php
    class ThingsController extends AppController
    {
        var $components = array('Security');

        function beforeFilter()
        {
            $this->Security->requirePost('delete');
        }

        function delete($id)
        {
            // This will only happen if the action is called via an HTTP POST request
            $this->Thing->del($id);
        }
    }

Here, we're telling the Security component that the 'delete' action
requires a POST request. The ``beforeFilter()`` method is usually where
you'll want to tell Security (and most other components) what to do with
themselves. It will then go do what it's told right after
``beforeFilter()`` is called, but right before the action itself is
called.

And that's about all there is to it. You can test this by typing the URL
for the action into your browser and seeing what happens.

Handling Invalid Requests
=========================

So if a request doesn't meet the security requirements that we define,
what happens to it? By default, the request is black-holed, which means
that the client is sent a 404 header, and the application immediately
exits. However, the Security component has a ``$blackHoleCallback``
property, which you can set to the name of a custom callback function
defined in your controller.

Rather than simply give a 404 header and then nothing, this property
allows you to perform some additional checking on the request, redirect
the request to another location, or even log the IP address of the
offending client. However, if you choose to use a custom callback, it is
your responsibility to exit the application if the request is invalid.
If your callback returns true, then the Security component will continue
to check the request against other defined requirements. Otherwise, it
stops checking, and your application continues uninhibited.

Advanced Request Authentication
===============================

The ``requireAuth()`` method allows you to be very detailed in
specifying how and from where an action can be accessed, but it comes
with certain usage stipulations, which become clear when you understand
how this method of authentication works. As stated above,
``requireAuth()`` works by comparing an authentication key in the POST
data to the key stored in the user's session data. Therefore, the
Security component must be included in both the controller recieveing
the request, as well as the controller making the request.

For example, if I have an action in PostsController with a view
containing a form that POSTs to an action in CommentsController, then
the Security component must be included in both CommentsController
(which is receiving the request, and actually protecting the action), as
well as PostsController (from which the request will be made).

Every time the Security component is loaded, even if it is not being
used to protect an action, it does the following things: First, it
generates an authentication key using the core Security class. Then, it
writes this key to the session, along with an expiration date and some
additional information (the expiration date is determined by your
session security setting in **/app/config/core.php**). Next, it sets the
key in your controller, to be referenced later.

Then in your view files, any form tag you generate using
``$html->formTag()`` will also contain a hidden input field with the
authentication key. That way, when the form is POSTed, the Security
component can compare that value to the value in the session on the
receiving end of the request. After that, the authentication key is
regenerated, and the session is updated for the next request.
