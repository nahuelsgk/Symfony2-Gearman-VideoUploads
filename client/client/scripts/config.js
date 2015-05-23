'use strict';

var entorno;
if (document.domain == '127.0.0.1' || document.domain == 'localhost') {
  entorno = 'dev';
} else if (document.domain == 'dev.linkemann.net') {
  entorno = 'pre';
} else if (document.domain == 'www-prep-origin.carolinaherrera.com') {
  entorno = 'pre-carolina';
} else {
  entorno = 'prod';
}

var _DEV_SERVER_PATH = 'http://localhost/linkemann/212vip/server/web/app_dev.php/api'; ///
var _PROD_SERVER_PATH = 'server/web/api';
var _PRE_SERVER_PATH = 'http://dev.linkemann.net/212vip/server/web/app_devlinkemann.php/api';
var _PRE2_SERVER_PATH = 'http://www-prep-origin.carolinaherrera.com/212/vipclubedition/server/web/app_pre.php/api';

var _APP_BASE_PATH = 'http://dev.linkemann.net/212vip';

/*http://dev.linkemann.net/212vip/server/web/app_devlinkemann.php/api*/

/**
 * Default path.
 * @type {string}
 * @private
 */
var _SERVER_PATH = _PRE_SERVER_PATH;

/**
 * develop definicion
 */
if (entorno === 'dev') {
  _SERVER_PATH = _DEV_SERVER_PATH;
}
/**
 * pre-production definition.
 */ else if (entorno === 'pre') {
  _SERVER_PATH = _PRE_SERVER_PATH
}
/**
 * pre-production carolina.
 */ else if (entorno === 'pre-carolina') {
  _SERVER_PATH = _PRE2_SERVER_PATH
}
/**
 * production definition.
 */

else {
  _SERVER_PATH = _PROD_SERVER_PATH
}

//_SERVER_PATH = _PRE_SERVER_PATH; //todo: hard code [debug]



