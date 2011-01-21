5.6.1 Configuration
-------------------

$blackHoleCallback
    A Controller callback that will handle and requests that are
    blackholed.
$requirePost
    A List of controller actions that require a POST request to occur.
    An array of controller actions or '\*' to force all actions to
    require a POST.
$requireSecure
    List of actions that require an SSL connection to occur. An array
    of controller actions or '\*' to force all actions to require a SSL
    connection.
$requireAuth
    List of actions that requires a valid authentication key. This
    validation key is set by Security Component.
$requireLogin
    List of actions that require HTTP-Authenticated logins (basic or
    digest). Also accepts '\*' indicating that all actions of this
    controller require HTTP-authentication.
$loginOptions
    Options for HTTP-Authenticate login requests. Allows you to set the
    type of authentication and the controller callback for the
    authentication process.
$loginUsers
    An associative array of usernames => passwords that are used for
    HTTP-authenticated logins. If you are using digest authentication,
    your passwords should be MD5-hashed.
$allowedControllers
    A List of Controller from which the actions of the current
    controller are allowed to receive requests from. This can be used
    to control cross controller requests.
$allowedActions
    Actions from which actions of the current controller are allowed to
    receive requests. This can be used to control cross controller
    requests.
$disabledFields
    List of form fields that shall be ignored when validating POST -
    The value, presence or absence of these form fields will not be
    taken into account when evaluating whether a form submission is
    valid. Specify fields as you do for the Form Helper
    (``Model.fieldname``).
$validatePost
    Set to ``false`` to completely skip the validation of POST
    requests, essentially turning CSRF protection off.

5.6.1 Configuration
-------------------

$blackHoleCallback
    A Controller callback that will handle and requests that are
    blackholed.
$requirePost
    A List of controller actions that require a POST request to occur.
    An array of controller actions or '\*' to force all actions to
    require a POST.
$requireSecure
    List of actions that require an SSL connection to occur. An array
    of controller actions or '\*' to force all actions to require a SSL
    connection.
$requireAuth
    List of actions that requires a valid authentication key. This
    validation key is set by Security Component.
$requireLogin
    List of actions that require HTTP-Authenticated logins (basic or
    digest). Also accepts '\*' indicating that all actions of this
    controller require HTTP-authentication.
$loginOptions
    Options for HTTP-Authenticate login requests. Allows you to set the
    type of authentication and the controller callback for the
    authentication process.
$loginUsers
    An associative array of usernames => passwords that are used for
    HTTP-authenticated logins. If you are using digest authentication,
    your passwords should be MD5-hashed.
$allowedControllers
    A List of Controller from which the actions of the current
    controller are allowed to receive requests from. This can be used
    to control cross controller requests.
$allowedActions
    Actions from which actions of the current controller are allowed to
    receive requests. This can be used to control cross controller
    requests.
$disabledFields
    List of form fields that shall be ignored when validating POST -
    The value, presence or absence of these form fields will not be
    taken into account when evaluating whether a form submission is
    valid. Specify fields as you do for the Form Helper
    (``Model.fieldname``).
$validatePost
    Set to ``false`` to completely skip the validation of POST
    requests, essentially turning CSRF protection off.
