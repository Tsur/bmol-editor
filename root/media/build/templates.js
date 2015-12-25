angular.module('kalzate').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/static/core/partials/404.html',
    "<p>Página no encontrada</p>"
  );


  $templateCache.put('/static/core/partials/forgot.html',
    "<form data-ng-submit=step1() class=forgot-form data-ng-class=\"{'form-loading': loading}\" novalidate><input placeholder=\"Nombre de emplead@ o Correo electrónico\" class=\"form-control btn-custom\" data-ng-model=\"identifier\"> <input type=submit class=\"btn btn-lg btn-primary btn-block btn-custom\" value=\"Recuperar Contraseña\"><div class=\"text-center text-medium-size\"><small>¡ Creo que ya me acuerdo ! ... <a class=text-primary ui-sref=signin title=\"signin for now!\">Voy a intentarlo</a></small></div></form>"
  );


  $templateCache.put('/static/core/partials/forgot_secure.html',
    "<form data-ng-submit=step2() data-ng-class=\"{'form-loading': loading}\" novalidate><input placeholder=\"Código de Seguridad\" class=\"form-control btn-custom\" data-ng-model=\"code\"><div class=\"text-center text-medium-size\"><small>Introduce el código de seguridad que le hemos enviado a su correo electrónico.</small></div><input type=submit class=\"btn btn-lg btn-primary btn-block btn-custom\" value=\"Quiero trabajar ya ;)\"><div class=\"text-center text-medium-size\"><small>¡ No he recibido ningún correo ! <a class=text-primary ui-sref=signin title=\"signin for now!\">Envíamelo de nuevo</a></small></div></form>"
  );


  $templateCache.put('/static/core/partials/index.html',
    "<section id=app-grid><p>hola</p><div style=width:248px;margin:auto;height:204px;position:absolute;top:50%;left:50%;margin-top:-102px;margin-left:-124px><img src=/static/modules/core/img/construction.png title=\"Lo sentimos. Esta sección no está terminada aún\" alt=\"Lo sentimos. Esta sección no está terminada aún\"></div></section>"
  );


  $templateCache.put('/static/core/partials/me.html',
    "<section id=app-grid><div id=app-me class=content-page><div class=row><div class=\"col-xs-3 col-sm-3 col-md-3\"><aside><ul><li class=active><a data-ui-sref=me.profile>Perfil</a></li><li><a data-ui-sref=me.notification>Notificaciones</a></li><li><a data-ui-sref=me.design>Diseño</a></li></ul></aside></div><div class=\"col-xs-9 col-sm-9 col-md-9 col-content\"><div data-ui-view></div></div></div></div></section>"
  );


  $templateCache.put('/static/core/partials/me_profile.html',
    "<div id=app-me-profile data-ng-controller=MeProfile><div data-file-dropzone=\"[image/png, image/jpg, image/jpeg, image/gif]\" data-max-file-size=2 data-on-file-change=newFile(file) data-file-input=true data-file-error=imagesError data-file-loading=progress data-read-file-as=data class=profile-picture><img src=\"/static/modules/core/img/no_profile_big.png\"></div><form><div class=\"form-inline form-group\"><label class=sr-only for=exampleInputEmail2>Nombre</label><input class=form-control id=exampleInputEmail2 placeholder=Nombre tabindex=1><label class=sr-only for=exampleInputEmail2>Apellido</label><input class=form-control id=exampleInputEmail2 placeholder=Apellido tabindex=2></div><div class=form-group><label class=sr-only for=exampleInputEmail2>Nombre Emplead@</label><input class=\"form-control large\" id=exampleInputEmail2 placeholder=\"Nombre Empleado\" tabindex=3></div><div class=form-group><label class=sr-only for=exampleInputEmail2>Email</label><input type=email class=\"form-control large\" id=exampleInputEmail2 placeholder=Email tabindex=4></div><div class=form-group><label class=sr-only for=exampleInputEmail2>Tienda</label><input type=email class=\"form-control large\" id=exampleInputEmail2 value=\"C.C. La Trocha\" disabled></div><div class=\"form-inline form-group\"><label class=sr-only for=exampleInputEmail2>Contraseña</label><input type=password class=form-control id=exampleInputEmail2 placeholder=Contraseña tabindex=5><label class=sr-only for=exampleInputEmail2>Repite Contraseña</label><input type=password class=form-control id=exampleInputEmail2 placeholder=\"Repite Contraseña\" tabindex=6></div><div class=form-group><button class=\"btn btn-lg btn-primary btn-block btn-custom large\" tabindex=7>Guardar</button></div></form></div>"
  );


  $templateCache.put('/static/core/partials/security_check.html',
    "<img class=background-image src=\"/static/modules/core/img/signin/shoes_2.jpg\"><div class=background-image-overlap><div class=github_badge><a href=https://github.com/Tsur/kalzate-pos target=_blank>Fork me on Github</a></div><div class=\"panel panel-default panel-security-check\" data-ng-class=\"{'animated shake': error}\"><div class=panel-body><div class=text-center><img src=/static/modules/core/img/logo.png class=logo-img alt=\"Kalzate Shoes Store Point Of Sale\"></div><div ui-view></div><div class=loading-svg data-ng-show=loading></div></div></div><canvas data-canvas-animation></canvas><div id=footer><p class=\"text-center credit\"><small>Boon Kalzate S.L. Copyright &copy; 2014 (Software desarrollado por <a href=http://scripturesos.com>Zurisadai Pavón</a>)</small></p></div></div>"
  );


  $templateCache.put('/static/core/partials/signin.html',
    "<form data-ng-submit=signin() data-ng-class=\"{'form-loading': loading}\" novalidate><input placeholder=\"Nombre de emplead@\" class=\"form-control btn-custom\" data-ng-model=username name=username data-typeahead=\"item for item in ['ana.de.la.rosa.villalobos@gmail.com','canciondiferente@hotmail.com'] | filter:$viewValue | limitTo:1\" autocomplete=off tabindex=\"1\"> <input type=password placeholder=Contraseña class=\"form-control btn-custom\" data-ng-model=password name=password tabindex=2 data-ng-mouseenter=\"display_forgot_icon = true\" data-ng-mouseleave=\"display_forgot_icon = false\" data-ng-focus=\"display_forgot_icon = true\" data-ng-blur=\"hideForgotIconOnBlur()\"> <a ui-sref=forgot class=forgot-icon title=\"Recover your password\" data-ng-show=display_forgot_icon data-ng-mouseenter=\"display_forgot_icon = true\"><span class=\"glyphicon glyphicon-question-sign\"></span></a> <input type=submit class=\"btn btn-lg btn-primary btn-block btn-custom\" value=Acceder tabindex=\"3\"><div class=\"text-center text-medium-size\"><small>¿Tu primer día de trabajo? <a class=text-primary ui-sref=signup title=\"signup for now!\">¡No pierdas más tiempo!</a></small></div></form>"
  );


  $templateCache.put('/static/core/partials/signup.html',
    "<form ng-submit=signup() data-ng-class=\"{'form-loading': loading}\" novalidate><input placeholder=\"Nombre, Primer Apellido\" class=\"form-control btn-custom\" data-ng-model=fullname tabindex=\"1\"> <input type=email placeholder=\"Correo electrónico\" class=\"form-control btn-custom\" data-ng-model=email tabindex=\"2\"> <input type=submit class=\"btn btn-lg btn-primary btn-block btn-custom\" value=\"Crear Cuenta\" tabindex=\"3\"><div class=\"text-center text-medium-size\"><small>En realidad ... <a class=text-primary ui-sref=forgot>¡he olvidado mi contraseña!</a></small></div></form>"
  );

}]);
