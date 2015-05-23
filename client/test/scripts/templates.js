this["JST"] = this["JST"] || {};

this["JST"]["client/templates/account/forgot.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>Forgot Password</h3>\r\n<form method="post" action="/forgot">\r\n  <p>Enter your email address below and we will send you password reset instructions.</p>\r\n\r\n  <p>\r\n    <label for="email">Email:</label>\r\n    <input type="email" name="email" id="email" placeholder="Enter your email" autofocus="autofocus" />\r\n  </p>\r\n\r\n  <button>Reset Password</button>\r\n</form>\r\n';

}
return __p
};

this["JST"]["client/templates/account/form.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row">\r\n  <div class="col-xs-8 text-left">\r\n    <p>' +
((__t = (input9)) == null ? '' : __t) +
'</p>\r\n  </div>\r\n  <div class="col-xs-4 text-right">\r\n    <p><p><span class="unCheck registered"></span>' +
((__t = (input10)) == null ? '' : __t) +
'</p>\r\n  </div>\r\n</div>\r\n<div id="formularioBoxesWrapper" class="col-xs-12" style="padding:0 !important">\r\n  <div id="loginWrapper" class="col-xs-12" style="padding:0 !important">\r\n    <form id="login" method="post" action="/user" data-toggle="validator" role="form">\r\n      <div class="row">\r\n        <div class="col-xs-9 text-left">\r\n          <input type="email" name="email1" id="email1" placeholder="' +
((__t = (input3)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n        <div class="col-xs-3 text-right">\r\n          <button id="btnLogin" type="submit" class="btn btn-default">' +
((__t = (bot3)) == null ? '' : __t) +
'</button>\r\n        </div>\r\n      </div>\r\n    </form>\r\n  </div>\r\n  <div id="registroWrapper" class="col-xs-12" style="padding:0 !important">\r\n    <form id="registro" method="post" action="/user" data-toggle="validator" role="form">\r\n      <div class="row">\r\n        <div class="col-xs-6 form-group">\r\n          <input type="text" name="name" id="name" placeholder="' +
((__t = (input1)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n        <div class="col-xs-6 form-group">\r\n          <input type="text" name="surname" id="surname" class="required" placeholder="' +
((__t = (input2)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-xs-12 form-group">\r\n          <input type="email" name="email2" id="email2" placeholder="' +
((__t = (input3)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-xs-4 form-group">\r\n          <input type="text" name="birth" id="birth" placeholder="' +
((__t = (input4)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n        <div class="col-xs-4 form-group">\r\n          <input type="text" name="zipcode" id="zipcode" placeholder="' +
((__t = (input5)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n        <div class="col-xs-4 form-group">\r\n          <select class="form-control" type="text" name="country" id="country">\r\n            <option value="AF">Afganistán</option>\r\n            <option value="AL">Albania</option>\r\n            <option value="DZ">Argelia</option>\r\n            <option value="AS">Samoa Americana</option>\r\n            <option value="AD">Andorra</option>\r\n            <option value="AO">Angola</option>\r\n            <option value="AI">Anguilla</option>\r\n            <option value="AQ">Antártida</option>\r\n            <option value="AG">Antigua y Barbuda</option>\r\n            <option value="AR">Argentina</option>\r\n            <option value="AM">Armenia</option>\r\n            <option value="AW">Aruba</option>\r\n            <option value="AU">Australia</option>\r\n            <option value="AT">Austria</option>\r\n            <option value="AZ">Azerbaiyán</option>\r\n            <option value="BS">Bahamas</option>\r\n            <option value="BH">Bahrein</option>\r\n            <option value="BD">Bangladesh</option>\r\n            <option value="BB">Barbados</option>\r\n            <option value="BY">Bielorrusia</option>\r\n            <option value="BE">Bélgica</option>\r\n            <option value="BZ">Belice</option>\r\n            <option value="BJ">Benin</option>\r\n            <option value="BM">Bermudas</option>\r\n            <option value="BT">Bután</option>\r\n            <option value="BO">Bolivia</option>\r\n            <option value="BA">Bosnia y Herzegovina</option>\r\n            <option value="BW">Botswana</option>\r\n            <option value="BV">Isla Bouvet</option>\r\n            <option value="BR">Brasil</option>\r\n            <option value="BN">Brunei</option>\r\n            <option value="BG">Bulgaria</option>\r\n            <option value="BF">Burkina Faso</option>\r\n            <option value="BI">Burundi</option>\r\n            <option value="KH">Camboya</option>\r\n            <option value="CM">Camerún</option>\r\n            <option value="CA">Canadá</option>\r\n            <option value="CV">Cabo Verde</option>\r\n            <option value="KY">Islas Caimán</option>\r\n            <option value="CF">República Centroafricana</option>\r\n            <option value="TD">Chad</option>\r\n            <option value="CL">Chile</option>\r\n            <option value="CN">China</option>\r\n            <option value="CX">Isla de Christmas</option>\r\n            <option value="CC">Islas de Cocos o Keeling</option>\r\n            <option value="CO">Colombia</option>\r\n            <option value="KM">Comores</option>\r\n            <option value="CG">Congo</option>\r\n            <option value="CD">Congo, Rep. Democrática</option>\r\n            <option value="CK">Islas Cook</option>\r\n            <option value="CR">Costa Rica</option>\r\n            <option value="CI">Costa de Marfíl</option>\r\n            <option value="HR">Croacia (Hrvatska)</option>\r\n            <option value="CU">Cuba</option>\r\n            <option value="CY">Chipre</option>\r\n            <option value="CZ">República Checa</option>\r\n            <option value="DK">Dinamarca</option>\r\n            <option value="DJ">Djibouti</option>\r\n            <option value="DM">Dominica</option>\r\n            <option value="DO">República Dominicana</option>\r\n            <option value="TP">Timor Oriental</option>\r\n            <option value="EC">Ecuador</option>\r\n            <option value="EG">Egipto</option>\r\n            <option value="SV">El Salvador</option>\r\n            <option value="ES" selected="selected">España</option>\r\n            <option value="GQ">Guinea Ecuatorial</option>\r\n            <option value="ER">Eritrea</option>\r\n            <option value="ES">España</option>\r\n            <option value="EE">Estonia</option>\r\n            <option value="ET">Etiopía</option>\r\n            <option value="FK">Islas Malvinas</option>\r\n            <option value="FO">Islas Faroe</option>\r\n            <option value="FJ">Fiji</option>\r\n            <option value="FI">Finlandia</option>\r\n            <option value="FR">Francia</option>\r\n            <option value="GF">Guayana Francesa</option>\r\n            <option value="PF">Polinesia Francesa</option>\r\n            <option value="GA">Gabón</option>\r\n            <option value="GM">Gambia</option>\r\n            <option value="GE">Georgia</option>\r\n            <option value="DE">Alemania</option>\r\n            <option value="GH">Ghana</option>\r\n            <option value="GI">Gibraltar</option>\r\n            <option value="GR">Grecia</option>\r\n            <option value="GL">Groenlandia</option>\r\n            <option value="GD">Granada</option>\r\n            <option value="GP">Guadalupe</option>\r\n            <option value="GU">Guam</option>\r\n            <option value="GT">Guatemala</option>\r\n            <option value="GN">Guinea</option>\r\n            <option value="GW">Guinea-Bissau</option>\r\n            <option value="GY">Guayana</option>\r\n            <option value="HT">Haití</option>\r\n            <option value="HN">Honduras</option>\r\n            <option value="HK">Hong Kong</option>\r\n            <option value="HU">Hungría</option>\r\n            <option value="IS">Islandia</option>\r\n            <option value="IN">India</option>\r\n            <option value="ID">Indonesia</option>\r\n            <option value="IR">Irán</option>\r\n            <option value="IQ">Irak</option>\r\n            <option value="IE">Irlanda</option>\r\n            <option value="IL">Israel</option>\r\n            <option value="IT">Italia</option>\r\n            <option value="JM">Jamaica</option>\r\n            <option value="JP">Japón</option>\r\n            <option value="JO">Jordania</option>\r\n            <option value="KZ">Kazajistán</option>\r\n            <option value="KE">Kenia</option>\r\n            <option value="KI">Kiribati</option>\r\n            <option value="KR">Corea</option>\r\n            <option value="KP">Corea del Norte</option>\r\n            <option value="KW">Kuwait</option>\r\n            <option value="KG">Kirguizistán</option>\r\n            <option value="LA">Laos</option>\r\n            <option value="LV">Letonia</option>\r\n            <option value="LB">Líbano</option>\r\n            <option value="LS">Lesotho</option>\r\n            <option value="LR">Liberia</option>\r\n            <option value="LY">Libia</option>\r\n            <option value="LI">Liechtenstein</option>\r\n            <option value="LT">Lituania</option>\r\n            <option value="LU">Luxemburgo</option>\r\n            <option value="MO">Macao</option>\r\n            <option value="MG">Madagascar</option>\r\n            <option value="MW">Malawi</option>\r\n            <option value="MY">Malasia</option>\r\n            <option value="MV">Maldivas</option>\r\n            <option value="ML">Malí</option>\r\n            <option value="MT">Malta</option>\r\n            <option value="MH">Islas Marshall</option>\r\n            <option value="MQ">Martinica</option>\r\n            <option value="MR">Mauritania</option>\r\n            <option value="MU">Mauricio</option>\r\n            <option value="YT">Mayotte</option>\r\n            <option value="MX">México</option>\r\n            <option value="FM">Micronesia</option>\r\n            <option value="MD">Moldavia</option>\r\n            <option value="MC">Mónaco</option>\r\n            <option value="MN">Mongolia</option>\r\n            <option value="MS">Montserrat</option>\r\n            <option value="MA">Marruecos</option>\r\n            <option value="MZ">Mozambique</option>\r\n            <option value="MM">Birmania</option>\r\n            <option value="NA">Namibia</option>\r\n            <option value="NR">Nauru</option>\r\n            <option value="NP">Nepal</option>\r\n            <option value="AN">Antillas Holandesas</option>\r\n            <option value="NL">Países Bajos</option>\r\n            <option value="NC">Nueva Caledonia</option>\r\n            <option value="NZ">Nueva Zelanda</option>\r\n            <option value="NI">Nicaragua</option>\r\n            <option value="NE">Níger</option>\r\n            <option value="NG">Nigeria</option>\r\n            <option value="NU">Niue</option>\r\n            <option value="NF">Norfolk</option>\r\n            <option value="MP">Islas Marianas del Norte</option>\r\n            <option value="NO">Noruega</option>\r\n            <option value="OM">Omán</option>\r\n            <option value="PK">Paquistán</option>\r\n            <option value="PW">Islas Palau</option>\r\n            <option value="PA">Panamá</option>\r\n            <option value="PG">Papúa Nueva Guinea</option>\r\n            <option value="PY">Paraguay</option>\r\n            <option value="PE">Perú</option>\r\n            <option value="PH">Filipinas</option>\r\n            <option value="PN">Pitcairn</option>\r\n            <option value="PL">Polonia</option>\r\n            <option value="PT">Portugal</option>\r\n            <option value="PR">Puerto Rico</option>\r\n            <option value="QA">Qatar</option>\r\n            <option value="RE">Reunión</option>\r\n            <option value="RO">Rumania</option>\r\n            <option value="RU">Rusia</option>\r\n            <option value="RW">Ruanda</option>\r\n            <option value="SH">Santa Helena</option>\r\n            <option value="KN">Saint Kitts y Nevis</option>\r\n            <option value="LC">Santa Lucía</option>\r\n            <option value="PM">St. Pierre y Miquelon</option>\r\n            <option value="VC">San Vicente y Granadinas</option>\r\n            <option value="WS">Samoa</option>\r\n            <option value="SM">San Marino</option>\r\n            <option value="ST">Santo Tomé y Príncipe</option>\r\n            <option value="SA">Arabia Saudí</option>\r\n            <option value="SN">Senegal</option>\r\n            <option value="SC">Seychelles</option>\r\n            <option value="SL">Sierra Leona</option>\r\n            <option value="SG">Singapur</option>\r\n            <option value="SK">República Eslovaca</option>\r\n            <option value="SI">Eslovenia</option>\r\n            <option value="SB">Islas Salomón</option>\r\n            <option value="SO">Somalia</option>\r\n            <option value="ZA">República de Sudáfrica</option>\r\n            <option value="LK">Sri Lanka</option>\r\n            <option value="SD">Sudán</option>\r\n            <option value="SR">Surinam</option>\r\n            <option value="SJ">Islas Svalbard y Jan Mayen</option>\r\n            <option value="SZ">Suazilandia</option>\r\n            <option value="SE">Suecia</option>\r\n            <option value="CH">Suiza</option>\r\n            <option value="SY">Siria</option>\r\n            <option value="TW">Taiwán</option>\r\n            <option value="TJ">Tayikistán</option>\r\n            <option value="TZ">Tanzania</option>\r\n            <option value="TH">Tailandia</option>\r\n            <option value="TG">Togo</option>\r\n            <option value="TK">Islas Tokelau</option>\r\n            <option value="TO">Tonga</option>\r\n            <option value="TT">Trinidad y Tobago</option>\r\n            <option value="TN">Túnez</option>\r\n            <option value="TR">Turquía</option>\r\n            <option value="TM">Turkmenistán</option>\r\n            <option value="TC">Islas Turks y Caicos</option>\r\n            <option value="TV">Tuvalu</option>\r\n            <option value="UG">Uganda</option>\r\n            <option value="UA">Ucrania</option>\r\n            <option value="AE">Emiratos Árabes Unidos</option>\r\n            <option value="UK">Reino Unido</option>\r\n            <option value="US">Estados Unidos</option>\r\n            <option value="UM">Islas menores de EE.UU</option>\r\n            <option value="UY">Uruguay</option>\r\n            <option value="UZ">Uzbekistán</option>\r\n            <option value="VU">Vanuatu</option>\r\n            <option value="VA">Ciudad del Vaticano</option>\r\n            <option value="VE">Venezuela</option>\r\n            <option value="VN">Vietnam</option>\r\n            <option value="VG">Islas Vírgenes (Reino Unido)</option>\r\n            <option value="VI">Islas Vírgenes (EE.UU.)</option>\r\n            <option value="WF">Islas Wallis y Futuna</option>\r\n            <option value="YE">Yemen</option>\r\n            <option value="YU">Yugoslavia</option>\r\n            <option value="ZM">Zambia</option>\r\n            <option value="ZW">Zimbabue</option>\r\n          </select>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-xs-12 form-group" style="display:none">\r\n          <input type="text" name="gift" id="gift" placeholder="' +
((__t = (input7)) == null ? '' : __t) +
'"/>\r\n          <input type="hidden" name="locale" id="locale" placeholder="' +
((__t = (locale)) == null ? '' : __t) +
'" value="' +
((__t = (locale)) == null ? '' : __t) +
'"/>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-xs-9 text-left">\r\n          <p><span class="unCheck readed"></span>' +
((__t = (input8)) == null ? '' : __t) +
'</p>\r\n        </div>\r\n        <div class="col-xs-3 text-right">\r\n          <button id="btnRegistro" type="submit" class="btn btn-default send">' +
((__t = (bot2)) == null ? '' : __t) +
'</button>\r\n        </div>\r\n      </div>\r\n    </form>\r\n  </div>\r\n</div>\r\n';

}
return __p
};

this["JST"]["client/templates/account/form2.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row">\r\n  <div class="col-xs-8 text-left">\r\n    <p>' +
((__t = (input9)) == null ? '' : __t) +
'</p>\r\n  </div>\r\n  <div class="col-xs-4 text-right">\r\n    <p><p><span class="unCheck registered"></span>' +
((__t = (input10)) == null ? '' : __t) +
'</p>\r\n  </div>\r\n</div>\r\n<div id="formularioBoxesWrapper" class="col-xs-12" style="padding:0 !important">\r\n  <div id="loginWrapper" class="col-xs-12" style="padding:0 !important">\r\n    <form id="login" method="post" action="/user" data-toggle="validator" role="form">\r\n      <div class="row">\r\n        <div class="col-xs-9 text-left">\r\n          <input type="email" name="email1" id="email1" placeholder="' +
((__t = (input3)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n        <div class="col-xs-3 text-right">\r\n          <button id="btnLogin" type="submit" class="btn btn-default">' +
((__t = (bot3)) == null ? '' : __t) +
'</button>\r\n        </div>\r\n      </div>\r\n    </form>\r\n  </div>\r\n  <div id="registroWrapper" class="col-xs-12" style="padding:0 !important">\r\n    <form id="registro" method="post" action="/user" data-toggle="validator" role="form">\r\n      <div class="row">\r\n        <div class="col-xs-6 form-group">\r\n          <input type="text" name="name" id="name" placeholder="' +
((__t = (input1)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n        <div class="col-xs-6 form-group">\r\n          <input type="text" name="surname" id="surname" class="required" placeholder="' +
((__t = (input2)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-xs-12 form-group">\r\n          <input type="email" name="email2" id="email2" placeholder="' +
((__t = (input3)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-xs-4 form-group">\r\n          <input type="text" name="birth" id="birth" placeholder="' +
((__t = (input4)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n        <div class="col-xs-4 form-group">\r\n          <input type="text" name="zipcode" id="zipcode" placeholder="' +
((__t = (input5)) == null ? '' : __t) +
'" required/>\r\n        </div>\r\n        <div class="col-xs-4 form-group">\r\n          <select class="form-control" type="text" name="country" id="country">\r\n            <option value="AF">Afganistán</option>\r\n            <option value="AL">Albania</option>\r\n            <option value="DZ">Argelia</option>\r\n            <option value="AS">Samoa Americana</option>\r\n            <option value="AD">Andorra</option>\r\n            <option value="AO">Angola</option>\r\n            <option value="AI">Anguilla</option>\r\n            <option value="AQ">Antártida</option>\r\n            <option value="AG">Antigua y Barbuda</option>\r\n            <option value="AR">Argentina</option>\r\n            <option value="AM">Armenia</option>\r\n            <option value="AW">Aruba</option>\r\n            <option value="AU">Australia</option>\r\n            <option value="AT">Austria</option>\r\n            <option value="AZ">Azerbaiyán</option>\r\n            <option value="BS">Bahamas</option>\r\n            <option value="BH">Bahrein</option>\r\n            <option value="BD">Bangladesh</option>\r\n            <option value="BB">Barbados</option>\r\n            <option value="BY">Bielorrusia</option>\r\n            <option value="BE">Bélgica</option>\r\n            <option value="BZ">Belice</option>\r\n            <option value="BJ">Benin</option>\r\n            <option value="BM">Bermudas</option>\r\n            <option value="BT">Bután</option>\r\n            <option value="BO">Bolivia</option>\r\n            <option value="BA">Bosnia y Herzegovina</option>\r\n            <option value="BW">Botswana</option>\r\n            <option value="BV">Isla Bouvet</option>\r\n            <option value="BR">Brasil</option>\r\n            <option value="BN">Brunei</option>\r\n            <option value="BG">Bulgaria</option>\r\n            <option value="BF">Burkina Faso</option>\r\n            <option value="BI">Burundi</option>\r\n            <option value="KH">Camboya</option>\r\n            <option value="CM">Camerún</option>\r\n            <option value="CA">Canadá</option>\r\n            <option value="CV">Cabo Verde</option>\r\n            <option value="KY">Islas Caimán</option>\r\n            <option value="CF">República Centroafricana</option>\r\n            <option value="TD">Chad</option>\r\n            <option value="CL">Chile</option>\r\n            <option value="CN">China</option>\r\n            <option value="CX">Isla de Christmas</option>\r\n            <option value="CC">Islas de Cocos o Keeling</option>\r\n            <option value="CO">Colombia</option>\r\n            <option value="KM">Comores</option>\r\n            <option value="CG">Congo</option>\r\n            <option value="CD">Congo, Rep. Democrática</option>\r\n            <option value="CK">Islas Cook</option>\r\n            <option value="CR">Costa Rica</option>\r\n            <option value="CI">Costa de Marfíl</option>\r\n            <option value="HR">Croacia (Hrvatska)</option>\r\n            <option value="CU">Cuba</option>\r\n            <option value="CY">Chipre</option>\r\n            <option value="CZ">República Checa</option>\r\n            <option value="DK">Dinamarca</option>\r\n            <option value="DJ">Djibouti</option>\r\n            <option value="DM">Dominica</option>\r\n            <option value="DO">República Dominicana</option>\r\n            <option value="TP">Timor Oriental</option>\r\n            <option value="EC">Ecuador</option>\r\n            <option value="EG">Egipto</option>\r\n            <option value="SV">El Salvador</option>\r\n            <option value="ES" selected="selected">España</option>\r\n            <option value="GQ">Guinea Ecuatorial</option>\r\n            <option value="ER">Eritrea</option>\r\n            <option value="ES">España</option>\r\n            <option value="EE">Estonia</option>\r\n            <option value="ET">Etiopía</option>\r\n            <option value="FK">Islas Malvinas</option>\r\n            <option value="FO">Islas Faroe</option>\r\n            <option value="FJ">Fiji</option>\r\n            <option value="FI">Finlandia</option>\r\n            <option value="FR">Francia</option>\r\n            <option value="GF">Guayana Francesa</option>\r\n            <option value="PF">Polinesia Francesa</option>\r\n            <option value="GA">Gabón</option>\r\n            <option value="GM">Gambia</option>\r\n            <option value="GE">Georgia</option>\r\n            <option value="DE">Alemania</option>\r\n            <option value="GH">Ghana</option>\r\n            <option value="GI">Gibraltar</option>\r\n            <option value="GR">Grecia</option>\r\n            <option value="GL">Groenlandia</option>\r\n            <option value="GD">Granada</option>\r\n            <option value="GP">Guadalupe</option>\r\n            <option value="GU">Guam</option>\r\n            <option value="GT">Guatemala</option>\r\n            <option value="GN">Guinea</option>\r\n            <option value="GW">Guinea-Bissau</option>\r\n            <option value="GY">Guayana</option>\r\n            <option value="HT">Haití</option>\r\n            <option value="HN">Honduras</option>\r\n            <option value="HK">Hong Kong</option>\r\n            <option value="HU">Hungría</option>\r\n            <option value="IS">Islandia</option>\r\n            <option value="IN">India</option>\r\n            <option value="ID">Indonesia</option>\r\n            <option value="IR">Irán</option>\r\n            <option value="IQ">Irak</option>\r\n            <option value="IE">Irlanda</option>\r\n            <option value="IL">Israel</option>\r\n            <option value="IT">Italia</option>\r\n            <option value="JM">Jamaica</option>\r\n            <option value="JP">Japón</option>\r\n            <option value="JO">Jordania</option>\r\n            <option value="KZ">Kazajistán</option>\r\n            <option value="KE">Kenia</option>\r\n            <option value="KI">Kiribati</option>\r\n            <option value="KR">Corea</option>\r\n            <option value="KP">Corea del Norte</option>\r\n            <option value="KW">Kuwait</option>\r\n            <option value="KG">Kirguizistán</option>\r\n            <option value="LA">Laos</option>\r\n            <option value="LV">Letonia</option>\r\n            <option value="LB">Líbano</option>\r\n            <option value="LS">Lesotho</option>\r\n            <option value="LR">Liberia</option>\r\n            <option value="LY">Libia</option>\r\n            <option value="LI">Liechtenstein</option>\r\n            <option value="LT">Lituania</option>\r\n            <option value="LU">Luxemburgo</option>\r\n            <option value="MO">Macao</option>\r\n            <option value="MG">Madagascar</option>\r\n            <option value="MW">Malawi</option>\r\n            <option value="MY">Malasia</option>\r\n            <option value="MV">Maldivas</option>\r\n            <option value="ML">Malí</option>\r\n            <option value="MT">Malta</option>\r\n            <option value="MH">Islas Marshall</option>\r\n            <option value="MQ">Martinica</option>\r\n            <option value="MR">Mauritania</option>\r\n            <option value="MU">Mauricio</option>\r\n            <option value="YT">Mayotte</option>\r\n            <option value="MX">México</option>\r\n            <option value="FM">Micronesia</option>\r\n            <option value="MD">Moldavia</option>\r\n            <option value="MC">Mónaco</option>\r\n            <option value="MN">Mongolia</option>\r\n            <option value="MS">Montserrat</option>\r\n            <option value="MA">Marruecos</option>\r\n            <option value="MZ">Mozambique</option>\r\n            <option value="MM">Birmania</option>\r\n            <option value="NA">Namibia</option>\r\n            <option value="NR">Nauru</option>\r\n            <option value="NP">Nepal</option>\r\n            <option value="AN">Antillas Holandesas</option>\r\n            <option value="NL">Países Bajos</option>\r\n            <option value="NC">Nueva Caledonia</option>\r\n            <option value="NZ">Nueva Zelanda</option>\r\n            <option value="NI">Nicaragua</option>\r\n            <option value="NE">Níger</option>\r\n            <option value="NG">Nigeria</option>\r\n            <option value="NU">Niue</option>\r\n            <option value="NF">Norfolk</option>\r\n            <option value="MP">Islas Marianas del Norte</option>\r\n            <option value="NO">Noruega</option>\r\n            <option value="OM">Omán</option>\r\n            <option value="PK">Paquistán</option>\r\n            <option value="PW">Islas Palau</option>\r\n            <option value="PA">Panamá</option>\r\n            <option value="PG">Papúa Nueva Guinea</option>\r\n            <option value="PY">Paraguay</option>\r\n            <option value="PE">Perú</option>\r\n            <option value="PH">Filipinas</option>\r\n            <option value="PN">Pitcairn</option>\r\n            <option value="PL">Polonia</option>\r\n            <option value="PT">Portugal</option>\r\n            <option value="PR">Puerto Rico</option>\r\n            <option value="QA">Qatar</option>\r\n            <option value="RE">Reunión</option>\r\n            <option value="RO">Rumania</option>\r\n            <option value="RU">Rusia</option>\r\n            <option value="RW">Ruanda</option>\r\n            <option value="SH">Santa Helena</option>\r\n            <option value="KN">Saint Kitts y Nevis</option>\r\n            <option value="LC">Santa Lucía</option>\r\n            <option value="PM">St. Pierre y Miquelon</option>\r\n            <option value="VC">San Vicente y Granadinas</option>\r\n            <option value="WS">Samoa</option>\r\n            <option value="SM">San Marino</option>\r\n            <option value="ST">Santo Tomé y Príncipe</option>\r\n            <option value="SA">Arabia Saudí</option>\r\n            <option value="SN">Senegal</option>\r\n            <option value="SC">Seychelles</option>\r\n            <option value="SL">Sierra Leona</option>\r\n            <option value="SG">Singapur</option>\r\n            <option value="SK">República Eslovaca</option>\r\n            <option value="SI">Eslovenia</option>\r\n            <option value="SB">Islas Salomón</option>\r\n            <option value="SO">Somalia</option>\r\n            <option value="ZA">República de Sudáfrica</option>\r\n            <option value="LK">Sri Lanka</option>\r\n            <option value="SD">Sudán</option>\r\n            <option value="SR">Surinam</option>\r\n            <option value="SJ">Islas Svalbard y Jan Mayen</option>\r\n            <option value="SZ">Suazilandia</option>\r\n            <option value="SE">Suecia</option>\r\n            <option value="CH">Suiza</option>\r\n            <option value="SY">Siria</option>\r\n            <option value="TW">Taiwán</option>\r\n            <option value="TJ">Tayikistán</option>\r\n            <option value="TZ">Tanzania</option>\r\n            <option value="TH">Tailandia</option>\r\n            <option value="TG">Togo</option>\r\n            <option value="TK">Islas Tokelau</option>\r\n            <option value="TO">Tonga</option>\r\n            <option value="TT">Trinidad y Tobago</option>\r\n            <option value="TN">Túnez</option>\r\n            <option value="TR">Turquía</option>\r\n            <option value="TM">Turkmenistán</option>\r\n            <option value="TC">Islas Turks y Caicos</option>\r\n            <option value="TV">Tuvalu</option>\r\n            <option value="UG">Uganda</option>\r\n            <option value="UA">Ucrania</option>\r\n            <option value="AE">Emiratos Árabes Unidos</option>\r\n            <option value="UK">Reino Unido</option>\r\n            <option value="US">Estados Unidos</option>\r\n            <option value="UM">Islas menores de EE.UU</option>\r\n            <option value="UY">Uruguay</option>\r\n            <option value="UZ">Uzbekistán</option>\r\n            <option value="VU">Vanuatu</option>\r\n            <option value="VA">Ciudad del Vaticano</option>\r\n            <option value="VE">Venezuela</option>\r\n            <option value="VN">Vietnam</option>\r\n            <option value="VG">Islas Vírgenes (Reino Unido)</option>\r\n            <option value="VI">Islas Vírgenes (EE.UU.)</option>\r\n            <option value="WF">Islas Wallis y Futuna</option>\r\n            <option value="YE">Yemen</option>\r\n            <option value="YU">Yugoslavia</option>\r\n            <option value="ZM">Zambia</option>\r\n            <option value="ZW">Zimbabue</option>\r\n          </select>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-xs-4 form-group">\r\n          <input type="text" name="eancode" id="eancode" placeholder="' +
((__t = (input11)) == null ? '' : __t) +
'"/>\r\n        </div>\r\n        <div class="col-xs-4 form-group text-left">\r\n          <img style="margin-top: 5px; height: 38px;" src="/images/desktop/eancode.svg">\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-xs-12 form-group" style="display:none">\r\n          <input type="text" name="gift" id="gift" placeholder="' +
((__t = (input7)) == null ? '' : __t) +
'"/>\r\n          <input type="hidden" name="locale" id="locale" placeholder="' +
((__t = (locale)) == null ? '' : __t) +
'" value="' +
((__t = (locale)) == null ? '' : __t) +
'"/>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-xs-9 text-left">\r\n          <p><span class="unCheck readed"></span>' +
((__t = (input8)) == null ? '' : __t) +
'</p>\r\n        </div>\r\n        <div class="col-xs-3 text-right">\r\n          <button id="btnRegistro" type="submit" class="btn btn-default send">' +
((__t = (bot2)) == null ? '' : __t) +
'</button>\r\n        </div>\r\n      </div>\r\n    </form>\r\n  </div>\r\n</div>\r\n';

}
return __p
};

this["JST"]["client/templates/account/login.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>Sign in</h3>\r\n<form method="post" action="/login">\r\n  <p>\r\n    <label for="email">Email:</label>\r\n    <input type="text" name="email" id="email" placeholder="Enter your email" autofocus="autofocus" />\r\n  </p>\r\n\r\n  <p>\r\n    <label for="password">Password:</label>\r\n    <input type="password" name="password" id="password" placeholder="Password" />\r\n  </p>\r\n\r\n  <button>Login</button>\r\n  <p><a href="/forgot">Forgot your password?</a></p>\r\n</form>\r\n';

}
return __p
};

this["JST"]["client/templates/account/reset.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>Reset Password</h3>\r\n<form method="post">\r\n  <p>\r\n    <label for="password">New Password</label>\r\n    <input type="password" name="password" value="" placeholder="New password" autofocus="autofocus" />\r\n  </p>\r\n\r\n  <p>\r\n    <label for="confirm">Confirm Password</label>\r\n    <input type="password" name="confirm" value="" placeholder="Confirm password" />\r\n  </p>\r\n\r\n  <button>Change Password</button>\r\n</form>\r\n';

}
return __p
};

this["JST"]["client/templates/account/settings.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>Profile Information</h3>\r\n\r\n<form id="profile-form" action="/user?_method=PUT" method="post">\r\n\r\n  <p>\r\n    <label for="email">Email:</label>\r\n    <input type="text" name="email" id="email" value="' +
((__t = ( user.email )) == null ? '' : __t) +
'" />\r\n  </p>\r\n\r\n  <p>\r\n    <label for="firstName">First Name:</label>\r\n    <input type="text" name="firstName" id="firstName" value="' +
((__t = (user.firstName)) == null ? '' : __t) +
'" />\r\n  </p>\r\n\r\n  <p>\r\n    <label for="lastName">Last Name:</label>\r\n    <input type="text" name="lastName" id="lastName" value="' +
((__t = (user.lastName)) == null ? '' : __t) +
'" />\r\n  </p>\r\n\r\n  <button>Update Profile</button>\r\n</form>\r\n\r\n<h3>Change Password</h3>\r\n\r\n<form id="password-form" action="/user/password?_method=PUT" method="post">\r\n\r\n  <p>\r\n    <label for="password">New Password:</label>\r\n    <input type="password" name="password" id="password" value=\'\' />\r\n  </p>\r\n\r\n  <p>\r\n    <label for="confirmPassword">Confirm Password:</label>\r\n    <input type="password" name="confirmPassword" id="confirmPassword" value=\'\' />\r\n  </p>\r\n\r\n  <button>Change Password</button>\r\n</form>\r\n\r\n<h3>Delete Account</h3>\r\n\r\n<p>You can delete your account, but keep in mind this action is irreversible.</p>\r\n\r\n<form id="delete-form" action="/user" method="post">\r\n  <button>Delete my account</button>\r\n</form>\r\n';

}
return __p
};

this["JST"]["client/templates/account/signup.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="signup animated fadeInUp">\r\n  <h1>' +
((__t = (title)) == null ? '' : __t) +
' <strong>' +
((__t = (tag)) == null ? '' : __t) +
'</strong></h1>\r\n  <p class="subtitle">' +
((__t = (text)) == null ? '' : __t) +
'</p>\r\n  <div class="col-xs-4 col-xs-offset-4">\r\n    <div class="wrapper-signup">\r\n      <div id="formularioWrapper"></div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n';

}
return __p
};

this["JST"]["client/templates/account/signup2.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="signup animated fadeInUp">\r\n  <h1>' +
((__t = (title)) == null ? '' : __t) +
' <strong>' +
((__t = (tag)) == null ? '' : __t) +
'</strong></h1>\r\n  <p class="subtitle">' +
((__t = (text)) == null ? '' : __t) +
'</p>\r\n  <div class="col-xs-8 col-xs-offset-2">\r\n    <div class="wrapper-signup">\r\n      <div class="row">\r\n        <div class="col-xs-4" style="min-height: 360px">\r\n          <img id="slideShow-dummy" src="/images/desktop/bodegon-1.png">\r\n          <div id="slideShow">\r\n            <img src="/images/desktop/bodegon-1.png">\r\n            <img src="/images/desktop/bodegon-2.png">\r\n            <img src="/images/desktop/bodegon-3.png">\r\n            <img src="/images/desktop/bodegon-4.png">\r\n            <img src="/images/desktop/bodegon-5.png">\r\n          </div>\r\n        </div>\r\n        <div class="col-xs-6">\r\n          <div id="formularioWrapper"></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n';

}
return __p
};

this["JST"]["client/templates/ecualizador.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="col-xs-12 wrapper-text animate fadeInRight">\r\n  <h2><strong>WHO IS TAKING PART</strong></h2>\r\n  <p class="subtitle">DISCOVER WHO HAS JOINED OUR VIDEO CLIP FROM ALL OVER THE WORLD.</p>\r\n</div>\r\n<div class="timeline animated fadeInLeft">\r\n  <div class="col-xs-1 clearfix controls">\r\n    <span class="pull-right control-video video-stop">\r\n      <img src="../images/bot_timeline_' +
((__t = ( buttonState )) == null ? '' : __t) +
'.png" alt="Pause Video"/>\r\n    </span>\r\n  </div>\r\n  <div class="col-xs-11 line">\r\n    <div class="wrapper-timeline clearfix">\r\n      <div class="inner-timeline-base"></div>\r\n      <div class="inner-timeline"></div>\r\n    </div>\r\n    <ul class="wrapper-sound-bars">\r\n      <li class="bar lenght_0"></li>\r\n      <li class="bar lenght1"></li>\r\n      <li class="bar lenght0"></li>\r\n      <li class="bar lenght2"></li>\r\n      <li class="bar lenght1"></li>\r\n      <li class="bar lenght2"></li>\r\n      <li class="bar lenght3"></li>\r\n      ';
 _(barsNumber).times(function(n){  ;
__p += '\r\n        <li class="random bar lenght' +
((__t = ( _.random(barsClassNumber) )) == null ? '' : __t) +
'"></li>\r\n      ';
 }); ;
__p += '\r\n      <li class="bar lenght3"></li>\r\n      <li class="bar lenght2"></li>\r\n      <li class="bar lenght1"></li>\r\n      <li class="bar lenght2"></li>\r\n      <li class="bar lenght0"></li>\r\n      <li class="bar lenght1"></li>\r\n      <li class="bar lenght_0"></li>\r\n    </ul>\r\n    <ul class="wrapper-participants">\r\n      ';
 _.each(participants,function(participant){ ;
__p += '\r\n        <li id="' +
((__t = ( participant.id )) == null ? '' : __t) +
'" class="participant" style="margin-left:' +
((__t = ( participant.position )) == null ? '' : __t) +
'%">\r\n          <p class="participant-name"><strong>' +
((__t = ( participant.name )) == null ? '' : __t) +
'</strong></p>\r\n          <p class="participant-city">' +
((__t = ( participant.city )) == null ? '' : __t) +
'</p>\r\n          <p class="participant-date">' +
((__t = ( participant.date )) == null ? '' : __t) +
'</p>\r\n        </li>\r\n      ';
 }) ;
__p += '\r\n    </ul>\r\n\r\n  </div>\r\n</div>\r\n\r\n\r\n';

}
return __p
};

this["JST"]["client/templates/gallery.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="gallery212" data-universe="Home Winner" data-slide="">\r\n  <ul class="gallery-slides" data-cols="4" style="width: 7680px; height: 7480px; display: block; margin-left: -1920px; margin-top: -935px;">\r\n    <li id="gallery-slide-66528" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/_/m/g/_mg_0116-1.jpg);" class="">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/_/m/g/_mg_0116-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66529" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy-1-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy-1-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66530" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy1-1-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy1-1-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66531" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy6ret-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy6ret-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66532" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy7-1-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy7-1-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66533" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy10ret-1.jpg);" class="active">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy10ret-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66534" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy11ret-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy11ret-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66535" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy13-2.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy13-2.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66536" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy14-2.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy14-2.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66537" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/i/m/g/img_9935rgb-2-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/i/m/g/img_9935rgb-2-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66538" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/1/0/9/10954549_823666351024528_6380111356799732131_o.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/1/0/9/10954549_823666351024528_6380111356799732131_o.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66539" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/n/y/c/nyc08-3.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/n/y/c/nyc08-3.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66540" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/v/i/p/vip01.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/v/i/p/vip01.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66541" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/_/m/g/_mg_0038.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/_/m/g/_mg_0038.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66542" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/_/m/g/_mg_0134-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/_/m/g/_mg_0134-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66543" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/_/m/g/_mg_0214.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/_/m/g/_mg_0214.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66544" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/2/0/-/20-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/2/0/-/20-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66545" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/g/i/s/gisele-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/g/i/s/gisele-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66546" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/g/i/s/gisele_marlon.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/g/i/s/gisele_marlon.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66547" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/g/i/s/gisele_marlon11.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/g/i/s/gisele_marlon11.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66548" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/g/m/1/gm14.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/g/m/1/gm14.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66549" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy_ganador_mobile.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/b/r/y/bryanboy_ganador_mobile.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66550" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_2_1855.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_2_1855.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66551" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_2_1971-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_2_1971-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66552" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_2_2199-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_2_2199-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66553" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_2_2529-1.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_2_2529-1.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66554" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_1515.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_1515.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66555" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_2_2106.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_2_2106.jpg">\r\n    </li>\r\n    <li id="gallery-slide-66556" style="width: 1920px; height: 935px; background-image: url(http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_1215.jpg);">\r\n      <img class="landscape" src="http://www.212areyouonthelist.com/uploads/images/2/1/2/212_dia3_1215.jpg">\r\n    </li>\r\n  </ul>\r\n\r\n  <nav style="width: 68px; display: block; opacity: 0.7;">\r\n    <a href="#66528" id="gallery-nav-66528" class="slide-link"></a><a href="#66529" id="gallery-nav-66529" class="slide-link"></a><a href="#66530" id="gallery-nav-66530" class="slide-link"></a><a href="#66531" id="gallery-nav-66531" class="slide-link"></a><a href="#66532" id="gallery-nav-66532" class="slide-link"></a><a href="#66533" id="gallery-nav-66533" class="slide-link active"></a><a href="#66534" id="gallery-nav-66534" class="slide-link"></a><a href="#66535" id="gallery-nav-66535" class="slide-link"></a><a href="#66536" id="gallery-nav-66536" class="slide-link"></a><a href="#66537" id="gallery-nav-66537" class="slide-link"></a><a href="#66538" id="gallery-nav-66538" class="slide-link"></a><a href="#66539" id="gallery-nav-66539" class="slide-link"></a><a href="#66540" id="gallery-nav-66540" class="slide-link"></a><a href="#66541" id="gallery-nav-66541" class="slide-link"></a><a href="#66542" id="gallery-nav-66542" class="slide-link"></a><a href="#66543" id="gallery-nav-66543" class="slide-link"></a><a href="#66544" id="gallery-nav-66544" class="slide-link"></a><a href="#66545" id="gallery-nav-66545" class="slide-link"></a><a href="#66546" id="gallery-nav-66546" class="slide-link"></a><a href="#66547" id="gallery-nav-66547" class="slide-link"></a><a href="#66548" id="gallery-nav-66548" class="slide-link"></a><a href="#66549" id="gallery-nav-66549" class="slide-link"></a><a href="#66550" id="gallery-nav-66550" class="slide-link"></a><a href="#66551" id="gallery-nav-66551" class="slide-link"></a><a href="#66552" id="gallery-nav-66552" class="slide-link"></a><a href="#66553" id="gallery-nav-66553" class="slide-link"></a><a href="#66554" id="gallery-nav-66554" class="slide-link"></a><a href="#66555" id="gallery-nav-66555" class="slide-link"></a><a href="#66556" id="gallery-nav-66556" class="slide-link"></a>\r\n  </nav>\r\n\r\n  <div class="controls" style="display: block;">\r\n    <a href="#" id="gallery-slide-up" data-direction="up" class="arrow up"></a>\r\n    <a href="#" id="gallery-slide-down" data-direction="down" class="arrow down"></a>\r\n    <a href="#" id="gallery-slide-left" data-direction="left" class="arrow left"></a>\r\n    <a href="#" id="gallery-slide-right" data-direction="right" class="arrow right"></a>\r\n  </div>\r\n\r\n  <div class="tip" style="display: none;">Utiliza las flechas del teclado para navegar</div>\r\n  <div class="close"><a title="cerrar" href="http://www.212areyouonthelist.com/es/[communication:communicationText]"><img src="http://www.212areyouonthelist.com//common/project/img/inv.gif" alt="cerrar" class="s-gal" width="60" height="60"></a></div>\r\n\r\n\r\n\r\n  <div class="share" style="display: block;">\r\n    <span><img class="s-gal" width="15" height="15" alt="Compartir" src="http://www.212areyouonthelist.com//common/project/img/inv.gif"></span>\r\n    <ul>\r\n      <li class="facebook">\r\n        <a href="https://www.facebook.com/sharer/sharer.php?1" class="link-share" data-url="http%3A%2F%2Fwww.212areyouonthelist.com%2Fes%2Fcomunicacion%2Fgaleria%2F11%2Fhome-winner"><img src="http://www.212areyouonthelist.com//common/project/img/inv.gif" alt="Facebook" class="s-gal" width="15" height="15"></a>\r\n      </li>\r\n      <li class="twitter">\r\n        <a href="https://twitter.com/share?text=212+-+Carolina+Herrera.+Home+Winner&amp;lang=es" class="link-share" data-url="http%3A%2F%2Fwww.212areyouonthelist.com%2Fes%2Fcomunicacion%2Fgaleria%2F11%2Fhome-winner"><img src="http://www.212areyouonthelist.com//common/project/img/inv.gif" alt="Twitter" class="s-gal" width="15" height="15"></a>\r\n      </li>\r\n      <li class="pinterest">\r\n        <a href="http://www.pinterest.com/pin/create/button/?description=212+-+Carolina+Herrera.+Home+Winner&amp;media=http%3A%2F%2Fwww.212areyouonthelist.com%2Fuploads%2Fimages%2F_%2Fm%2Fg%2F_mg_0116-1_M.jpg" class="link-share" data-url="http%3A%2F%2Fwww.212areyouonthelist.com%2Fes%2Fcomunicacion%2Fgaleria%2F11%2Fhome-winner"><img src="http://www.212areyouonthelist.com//common/project/img/inv.gif" alt="Pinterest" class="s-gal" width="15" height="15"></a>\r\n      </li>\r\n      <li class="google">\r\n        <a href="http://plus.google.com/share?hl=es" class="link-share" data-url="http%3A%2F%2Fwww.212areyouonthelist.com%2Fes%2Fcomunicacion%2Fgaleria%2F11%2Fhome-winner"><img src="http://www.212areyouonthelist.com//common/project/img/inv.gif" alt="Google+" class="s-gal" width="15" height="15"></a>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n\r\n</section>\r\n';

}
return __p
};

this["JST"]["client/templates/index.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="participate animated fadeInUp">\r\n  <h1>#ALESSOFOR<strong>212VIP</strong></h1>\r\n  <p class="subtitle col-xs-6 col-xs-offset-3">' +
((__t = ( texto )) == null ? '' : __t) +
'</p>\r\n  <div class="col-xs-4 col-xs-offset-4">\r\n    <div class="wrapper-participate">\r\n      <div class="loading-wrapper">\r\n        <div class="page-loader">\r\n          <div class="loader">Loading...</div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n';

}
return __p
};

this["JST"]["client/templates/layouts/default.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="background">\r\n  <div id="backgroundImg"></div>\r\n  <div id="backgroundVideo"></div>\r\n  <div id="mascara"></div>\r\n</div>\r\n<div id="content"></div>\r\n<header></header>\r\n<footer></footer>\r\n';

}
return __p
};

this["JST"]["client/templates/layouts/gallery.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<main class="gallery">\n  <div id="container">\n    <section id="gallery212" data-universe="Alesso Gallery" data-slide="">\n\n      <ul class="gallery-slides" data-cols="' +
((__t = ( colNum )) == null ? '' : __t) +
'">\n        ';
 _.each(gallery,function(imageData){;
__p += '\n        <li id=\'gallery-slide-' +
((__t = ( imageData.id )) == null ? '' : __t) +
'\' style="background-image: url(\'' +
((__t = ( imageData.url )) == null ? '' : __t) +
'\');">\n          <img class="landscape" src="' +
((__t = ( imageData.url )) == null ? '' : __t) +
'"/>\n        </li>\n        ';
});;
__p += '\n      </ul>\n\n      <nav>\n        ';
 _.each(gallery,function(imageData){;
__p += '\n        <a id="gallery-nav-' +
((__t = ( imageData.id )) == null ? '' : __t) +
'" class="slide-link" data-bypass></a>\n        ';
});;
__p += '\n      </nav>\n\n      <div class="controls">\n        <a data-bypass href="#" id="gallery-slide-up" data-direction="up" class="arrow up"></a>\n        <a data-bypass href="#" id="gallery-slide-down" data-direction="down" class="arrow down"></a>\n        <a data-bypass href="#" id="gallery-slide-left" data-direction="left" class="arrow left"></a>\n        <a data-bypass href="#" id="gallery-slide-right" data-direction="right" class="arrow right"></a>\n      </div>\n\n      <div class="tip">' +
((__t = ( tip )) == null ? '' : __t) +
'</div>\n\n    </section>\n  </div>\n</main>\n<header></header>\n<footer></footer>\n';

}
return __p
};

this["JST"]["client/templates/modules/background_img.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<img class="bgImg" src="' +
((__t = ( imgUrl )) == null ? '' : __t) +
'"  alt=""/>\r\n';

}
return __p
};

this["JST"]["client/templates/modules/background_video.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<video id="bgVideo" class="video-js vjs-default-skin" preload autoplay loop>\n  <source src="' +
((__t = ( mp4Url )) == null ? '' : __t) +
'" type=\'video/mp4\'/>\n  <source src="' +
((__t = ( webmUrl )) == null ? '' : __t) +
'" type=\'video/webm\'/>\n  <source src="' +
((__t = ( oggUrl )) == null ? '' : __t) +
'" type=\'video/ogg\'/>\n</video>\n<!--{{ asset(\'bundles/frontend/data/CH_video.mp4\') }}-->\n';

}
return __p
};

this["JST"]["client/templates/modules/footer.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<nav>\r\n  <ul>\r\n    <li><a href="/participate">' +
((__t = ( nav1 )) == null ? '' : __t) +
'</a></li>\r\n    <li><a href="https://soundcloud.com/eliasenglase/alesso-if-it-wasnt-for-you-teaser-for-carolina-herrera-212vip" target="_blank">' +
((__t = ( nav2 )) == null ? '' : __t) +
' <img style="padding-left:5px" src="../../images/desktop/soundcloud.svg" width="34px" height="15px"/></a></li>\r\n    <li><span id="legalbox">' +
((__t = ( nav3 )) == null ? '' : __t) +
'</span></li>\r\n    <li>( <span id="es">ES</span> | <span id="en">EN</span> )</li>\r\n  </ul>\r\n</nav>\r\n<div id="ean-box">\r\n  <div id="ean-box-popup">\r\n    <h3><strong>A VIP</strong> always has<br>more options</h3>\r\n    <p>Pursache a 212 VIP fragance and<br>increase your chances to win.</p>\r\n    <button id="eancode" type="button" class="btn btn-default">Enter Now</button>\r\n  </div>\r\n  <div id="ean-box-display">\r\n    <img src="../../images/new_botles.png" alt="Discover the 212 VIP fragrances"/>\r\n    <p>Discover <strong>212 vip</strong> fragances</p>\r\n  </div>\r\n</div>\r\n';

}
return __p
};

this["JST"]["client/templates/modules/header.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="logo-box">\r\n  <a href="/"><img src="../../images/logo.png" alt="Alesso for 212 VIP Club Edition"/></a>\r\n</div>\r\n';

}
return __p
};

this["JST"]["client/templates/modules/header2.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="logo-box">\r\n  <a href="/"><img src="../../images/logo.png" alt="Alesso for 212 VIP Club Edition"/></a>\r\n</div>\r\n<nav>\r\n  <ul>\r\n    <li class="botcerrar"><img src="../../images/desktop/back.svg" width="60px" height="60px"/></li>\r\n  </ul>\r\n</nav>\r\n';

}
return __p
};

this["JST"]["client/templates/modules/loading_img.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<i class="fa fa-circle-o-notch fa-spin fa-lg"></i>\r\n';

}
return __p
};

this["JST"]["client/templates/participate.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="participate animated fadeInUp">\r\n  <h1>' +
((__t = (title)) == null ? '' : __t) +
' <strong>' +
((__t = (tag)) == null ? '' : __t) +
'</strong></h1>\r\n  <p class="subtitle">' +
((__t = (text)) == null ? '' : __t) +
'</p>\r\n  <div class="col-xs-4 col-xs-offset-4">\r\n    <div class="wrapper-participate">\r\n      <p>\r\n        <button id="participate" type="button" class="btn btn-default">' +
((__t = (bot1)) == null ? '' : __t) +
'</button>\r\n        <button id="video" type="button" class="btn btn-default">' +
((__t = (bot2)) == null ? '' : __t) +
'</button>\r\n      </p>\r\n    </div>\r\n  </div>\r\n</div>\r\n';

}
return __p
};

this["JST"]["client/templates/thanks.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="participate animated fadeInUp">\n  <h1><strong>' +
((__t = ( title )) == null ? '' : __t) +
'</strong></h1>\n  <p class="subtitle">' +
((__t = ( p1 )) == null ? '' : __t) +
'</p>\n  <div class="col-xs-4 col-xs-offset-4">\n    <div class="wrapper-participate">\n      <p>\n        <a href="participate/' +
((__t = ( tag )) == null ? '' : __t) +
'/video"  type="button" class="btn btn-default">' +
((__t = ( b1 )) == null ? '' : __t) +
'</a>\n        <a href="participate/' +
((__t = ( tag )) == null ? '' : __t) +
'/upload" type="button" class="btn btn-default">' +
((__t = ( b2 )) == null ? '' : __t) +
'</a>\n      </p>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["client/templates/timeline.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\r\n<div class="timeline animated fadeInLeft">\r\n  <div class="col-xs-1">\r\n     <span class="switch-control">\r\n      <div class="timeline active">VIDEO CLIP</div>\r\n      <div class="swtich"><input type="checkbox" name="my-checkbox" checked></div>\r\n      <div class="ecualizador">PARTICIPANTS</div>\r\n    </span>\r\n  </div>\r\n  <div class="col-xs-1 clearfix controls">\r\n    <span class="pull-right control-video video-stop">\r\n      <img src="../images/bot_timeline_' +
((__t = ( buttonState )) == null ? '' : __t) +
'.png" alt="Pause Video"/>\r\n    </span>\r\n  </div>\r\n  <div class="col-xs-10 line">\r\n    <div class="wrapper-timeline clearfix">\r\n      <div class="inner-timeline-base"></div>\r\n      <div class="inner-timeline"></div>\r\n      <div class="hot-spots-wrapper pull-left">\r\n        ';
 _.each(hotSpots,function(hotspot){ ;
__p += '\r\n          <div id="' +
((__t = ( hotspot.id )) == null ? '' : __t) +
'" class="hot-spot" style="margin-left:' +
((__t = ( hotspot.position )) == null ? '' : __t) +
'%">\r\n            <img class="hot-spot-img img-circle" src="' +
((__t = ( hotspot.img )) == null ? '' : __t) +
'" alt=""/>\r\n            <p class="hot-spot-text">' +
((__t = ( hotspot.text[0][locale] )) == null ? '' : __t) +
'</p>\r\n            ';
 if (hotspot.type == 'drop-up') {;
__p += '\r\n            <ul class="wrapper-subpoints">\r\n              ';
_.each(hotspot.subPoints,function(point){;
__p += '\r\n                 <li class="subpoint">\r\n                   <a href="' +
((__t = ( point.url )) == null ? '' : __t) +
'">\r\n                     <img class="subpoint-img img-circle" src="' +
((__t = ( point.imgUrl )) == null ? '' : __t) +
'" alt=""/>\r\n                     <p class="subpoint-text">' +
((__t = ( point.text[0][locale] )) == null ? '' : __t) +
'</p>\r\n                   </a>\r\n                   <span class="vertical-line"></span>\r\n                 </li>\r\n              ';
 });
__p += '\r\n            </ul>\r\n            ';
 } ;
__p += '\r\n          </div>\r\n        ';
 }); ;
__p += '\r\n      </div>\r\n  </div>\r\n  </div>\r\n</div>\r\n\r\n\r\n';

}
return __p
};

this["JST"]["client/templates/timelineVideo.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="timeline">\r\n  <div class="col-xs-1 clearfix controls">\r\n    <span class="pull-right control-video video-stop">\r\n      <img src="../images/bot_timeline_pause.png" alt="Pause Video"/>\r\n    </span>\r\n  </div>\r\n  <div class="col-xs-11 line">\r\n    <div class="wrapper-timeline clearfix">\r\n      <div class="inner-timeline-base"></div>\r\n      <div class="inner-timeline"></div>\r\n    </div>\r\n  </div>\r\n</div>\r\n';

}
return __p
};

this["JST"]["client/templates/uploadVideo.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="participate animated fadeInUp">\r\n  <h1><strong>' +
((__t = ( title )) == null ? '' : __t) +
'</strong></h1>\r\n  <p class="">' +
((__t = ( p1 )) == null ? '' : __t) +
'</p>\r\n  <div class="col-xs-4 col-xs-offset-4 wrapper-drag-zone">\r\n    <p>' +
((__t = ( p2 )) == null ? '' : __t) +
'</p>\r\n    <div class="drag-zone">\r\n      <p>' +
((__t = ( p3 )) == null ? '' : __t) +
'</p>\r\n      <p class="error-upload"></p>\r\n      <button id="participate" type="button" class="btn btn-default select-file">' +
((__t = ( b1 )) == null ? '' : __t) +
'</button>\r\n      <input class="hidden" id="fileInput" type="file" name="fileInput">\r\n    </div>\r\n    <div class="wrapper-loading onload">\r\n      <p class="loading-text"></p>\r\n      <div class="loading-video">\r\n        <div class="loading-video-bar"></div>\r\n      </div>\r\n    </div>\r\n    <p class="video-requeriment">' +
((__t = ( p4 )) == null ? '' : __t) +
'</p>\r\n    <div class="legal-terms loaded">\r\n      <p><span class="unCheck readed"></span>' +
((__t = ( p5 )) == null ? '' : __t) +
'</p>\r\n      <button href="/participate" class="btn btn-default send" disabled>' +
((__t = ( b2 )) == null ? '' : __t) +
'</button>\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n';

}
return __p
};

this["JST"]["client/templates/video.jst"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="video animated fadeInUp">\r\n  <div class="col-xs-12">\r\n    <button id="participate" type="button" class="btn btn-default">' +
((__t = (bot2)) == null ? '' : __t) +
'</button>\r\n  </div>\r\n</div>\r\n';

}
return __p
};