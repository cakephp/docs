Componentes del Núcleo
######################

CakePHP posee una serie de componentes integrados. Éstos proveen
distintas funcionalidades para tareas realizadas comunmente.

Acl

El componente Acl provee una sencilla interfaz para listas de control de
acceso (*access control list*) basadas en archivos ini o base de datos.

Auth

El componente Auth provee un sistema de autenticación fácil de utilizar
usando diferentes procesos de validación, como ser *callbacks* en los
controladores, Acl u *callbacks* en los objetos.

Session

El componente Session provee un *wrapper* de almacenamiento
independiente a las sesiones de PHP.

RequestHandler

El componente RequestHandler permite analizar las peticiones HTTP para
informarle a la aplicación acerca del tipo de contenido y la información
requerida por el usuario.

Security

El componente Security permite aumentar la seguridad y gestionar
autenticación HTTP.

Email

Una interfaz que puede ser utilizada para enviar emails usando distintos
MTA (*mail transfer agent*) incluyendo la función mail() de PHP y el
protocolo SMTP.

Cookie

El componente Cookie se comporta en cierta forma similar al Session ya
que provee un *wrapper* para el soporte nativo de cookies en PHP.

Para aprender más acerca de cada componente mira en el menu a la
izquierda, o aprende acerca de `cómo crear tus propios
componentes </es/view/62/components>`_.


.. toctree::
    :maxdepth: 1

    Core-Components/Access-Control-Lists
    Core-Components/Authentication
    Core-Components/Cookies
    Core-Components/Email
    Core-Components/Request-Handling
    Core-Components/Security-Component
    Core-Components/Sessions