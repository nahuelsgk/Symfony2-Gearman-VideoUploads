angular-symfony
===============

Project Bootstrap for an angularJS + Symfony webservices project.

Introduction
------------

This project is a template application with secured communication via a RestFul API between the client part with AngularJS and the server part with Symfony2.

Installation
------------

Clone the project :

	git clone git@github.com:FlyersWeb/angular-symfony.git angular-symfony

Update packages :

	cd angular-symfony
	composer.phar install

Create cache and logs folders :

	mkdir app/cache
	mkdir app/logs
	chmod -R 777 app/cache
	chmod -R 777 app/logs

Edit database credentials :

	vim app/config/parameters.yml

Update schemas (FOSUserBundle) :

 	php app/console doctrine:schema:create

Create and activate user :

	php app/console fos:user:create
	php app/console fos:user:activate

Link project to your webserver and access it :

	ln -snf ./ /var/www/html/angular-symfony
	firefox http://localhost/angular-symfony/ &

Authentication system
---------------------

The Authentication system is based on the custom Authentication Provider of the Symfony2 Cookbook : http://symfony.com/doc/2.1/cookbook/security/custom_authentication_provider.html

> The following chapter demonstrates how to create a custom authentication provider for WSSE authentication. The security protocol for WSSE provides several security benefits:
> * Username / Password encryption
> * Safe guarding against replay attacks
> * No web server configuration required
> 
> WSSE is very useful for the securing of web services, may they be SOAP or REST.

I used the exact same authentication system with a little change in moment of generating the digest, we use the hexadecimal value of the hashed seed in lieu of the binary value.

Client Side specifics
---------------------

On the client side, I've inspired my code from Nils Blum-Oeste article explaining how to send an authorization token for every request. To do this you have to register a wrapper for every resource actions that execute a specific code before doing the action. For more information you can check http://nils-blum-oeste.net/angularjs-send-auth-token-with-every--request/.

The differences there is that I send the token, username and user digest in the HTTP Header *X-WSSE*.

Conclusion
----------

You can use this template and adapt it to your needs.

Custom requirements Linkeman
----------------------------
CONFIGURACION PHP:
* activar int.dll
* upload.max.filesize = 16M o 32M
* UN SINFIN DE REQUERIMIENTOS QUE NO SE HAN IDO APUNTANDO

MAILCHIMP
* http://redwebturtle.blogspot.nl/2013/09/mailchimp-api-v20-ssl-error-solution.html
En mi caso he tenido que usar el segundo metodo. El primero no me lo coje. Tener en cuenta en producción.
* curl_setopt($this->ch, CURLOPT_SSL_VERIFYPEER, false);
@CH212vip

Developer guide
---------------

#Schema
##Symfony application
The symfony version is 2.2. 
The main menu is static template on app/Resources/views/admin_base.html.twig
For create the first user admin if the DB is empty, have to use the fos_user_service from the command line
php app/console fos:user:create
php app/consoel fos:user:activate

###BackendBundle
All the routes are specified through @Route notation on the two main controllers.
http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/routing.html

All the common logic is a service with all the symfony dependencies injected on:
src/BackendBundle/Service/AlessoService.php.

###Mandrill
For Mandrill API key:
For Mandrill template data:
BUG for some servers:

###Webservices
All WS have a documentation on ApiController through annotations: methods, variables and responses.
src/BackendBundle/Controller/ApiController.php.

#Deployments
There are several parameters configuration. For every enviroment, /web/app_ENVIROMENT.php,  app/config/config_ENVIROMENT and app/config/parameters.yml
 
Useful commands for Symfony and Backbone
php app/console fos:user:create //To create user for the backend
php app/console fos:user:activate //To activate user for the backend 

##Dev linkeman
Backend: http://dev.linkemann.net/212vip/server/web/app_devlinkemann.php/login
admin_linkemann / #$lord#star

Notas:
Comentar la linea 68 en server/vendor/mandrill/src/Mandrill.php
        //curl_setopt($this->ch, CURLOPT_FOLLOWLOCATION, true);
Añadir linea en servidores sin ssl:
        curl_setopt($this->ch, CURLOPT_SSL_VERIFYPEER, false);

##Pasar de nuestro dev a su pre-produccion

##Test
There are several test that can be run from the server folder::
phpunit -c app --debug

##Translations
http://www.leccionespracticas.com/informatica-web/symfony-yaml-caracteres-especiales-y-tildes-resuelto
Los YML han de abrirse en UTF-8 sin BOM.


##Fixtures
Hay una carga de fake participations:
php app/console  doctrine:fixtures:load --append

#Gearman
##Devlinkeman
### PRIMERA DOCUMENTACION: OBSOLETA. 
Ejemplo de uso
0) > cd /root/gearman/gearman-1.0.2
1) > gearmand
2) > php -dextension=./modules/gearman.so examples/reverse_worker.php //ARRANCA TRABAJO
3) > php -dextension=./modules/gearman.so examples/reverse_client.php

### SEGUNDA DOCUMENTACION: 
Proceos de instalacion:
* http://hasin.me/2013/10/30/installing-gearmand-libgearman-and-pecl-gearman-from-source/#comment-150552
* http://blog.litespeedtech.com/2013/04/05/trouble-shooting-pecl-install-doesnt-work/

1) /usr/local/sbin/gearmand --verbose=DEBUG
2) php -dextension=/usr/lib/php5/20100525/gearman.so examples/reverse_worker.php
3) php -dextension=/usr/lib/php5/20100525/gearman.so examples/reverse_client.php


#### Deploy de symfony
php -dextension=/usr/lib/php5/20100525/gearman.so /usr/local/bin/composer update 

Para limpiar cache:
php -dextension=/usr/lib/php5/20100525/gearman.so app/console cache:clear

Mira el app/config/config.yml para la configuracion del symfony.

### Servicio de colas
El servicio de colas esta implementado con gearman. Gearman es un servidor que encola trabajos y se los entrega a los workers. Usamos supervisord para levantar los trabajadores y que nunca muera. En la siguiente documentación se explica que dev.linkemann.net las comandas.  

#### Levantar el servicio de colas
/usr/local/sbin/gearmand --verbose=DEBUG -d

#### Esta corriendo el servicio de colas
ps axf | grep gearmand

#### Log del servicio de colas
cat /var/log/gearmand.log

#### Supervisord
Supervisord se asegura que los trabajadores esten siempre de pie.

##### Levantar supervisord
Levanta el supervisord con un archivo de configuracion.
/opt/virtualenv/supervisor/bin/python /opt/virtualenv/supervisor/bin/supervisord -c /var/tmp/test.conf

##### Supervisord esta corriendo
ps axf | grep supervisord

#### Levantar trabajadores
En el test.conf con el que levanta el supervisord, tiene las comandas que levantar trabajadores.

#### Salidas de los trabajadores
Los logs estan /var/tmp/log/supervisord/. 
Ejecutando desde la carpeta del backend tail -f app/logs/devlinkemann.log | grep WORKER se podra ver los logs de worker.

#### Cambios en los trabajadores
Si se cambia la programacion de symfony de los trabajadores se ha de matar el supervisord con kill y volvero a levantar.
#### Symfony test workers
> * Listado de workers
php -dextension=/usr/lib/php5/20100525/gearman.so app/console gearman:worker:list -v

> * Ejecutar el nuestro "test worker". Se queda esperando peticiones de trabajo. Puede ejecutar cualquier job.
cd /var/www/vhosts/dev.linkemann.net/httpdocs/212vip/server
php app/console gearman:worker:execute CH212appBackendBundleWorkersBackendWorker

> * Ejecutar el job de nuestro "test worker". Se queda esperando peticiones de un trabajo en concreto. 
php app/console gearman:job:execute CH212appBackendBundleWorkersBackendWorker~testB

> Enviar un trabajo desde un controlado. 
Ejemplos implementados en src/CH212/BackenBundle/Controller/Queue.php

> Visualizar el numero de trabajos en cola:
 gearadmin --show-jobs

#### Pequeño manual de pruebas
> Levantar el servidor de colas sino esta levantado
 /usr/local/sbin/gearmand --verbose=DEBUG
 ¿Como se recupera el log si esta corriendo?
 
> Levantar un worker: Fijarse en nombre del worker
 php app/console gearman:worker:execute CH212appBackendBundleWorkersBackendWorker 
 
 
 Supervisord:
 Un archivo de configuración de prueba se encuentra en: config/supervisor/supervisor.conf
 En este archivo se configuran tres procesos de gearman. Es necesario especificar el directorio de los archivos logs donde supervisor escribirá las salidas de los tres procesos.
 Supervisor crea un archivo log tanto para la salida estandar como para la salida de error de los procesos.
 La variable hildlogdir del archivo de configuración de supervisor indica el path donde se han de guardar estos archivos log.

 Para lanzar supervisor basta con ejecutar:
 /path_supervisor/supervisord -c /path_config/supervisor.conf donde path_supervisor contiene la ruta de supervisor y path_config contiene la ruta de la configuración de supervisor.
 
 es posible instalar supervisor en una virtualenv de python.
 
 En DEV.LINKEMANN.NET: 
 > /opt/virtualenv/supervisor/bin/supervisord -c /var/tmp/test.conf
  
 EN TEST.CONF hay una variable daemon. Si nodaemon=true, no se inicia como servicio. Su padre es la consola, morira si sales de la consola.
 
#Generacion de videos
##Preview
###Pruebas de codigo Josep en devlinkeman

El codigo esta en /var/www/vhosts/212vip.linkemann.net/httpdocs

El http://212vip.linkemann.net/form2.php peta.
http://212vip.linkemann.net/form3.php funciona.

####Manual de ejecucion via comanda
- Copiar el fichero desde documents/uploads/ a la carpeta donde espera encontrarlo.
-  /var/www/vhosts/212vip.linkemann.net/httpdocs/VR1.sh VRPendingFolder/5955780f72724adaf6738986517542cb2ddd0aae-N.mp4 Nahuel italiano header_a /var/www/vhosts/212vip.linkemann.net/httpdocs/config.sh
 
 

