'use strict';

function linkHandler(scope, element, attrs){

  const dialog = require('electron').remote.require('dialog');
  const fs = require('fs');

  $(element[0]).click(e => {

    dialog.showOpenDialog({title:'Load Map'}, filename => {

      if(!filename) return;

      fs.readFile(filename[0], (err, file) => {

        if(err) return console.error(err);

        scope.upload(file);

      });

    });

  });

}

function Download(){

    return {

      scope: {

        'upload': '=uploadJson'
      },

      link: (scope, element, attrs) => linkHandler(scope, element, attrs)

    };
}

Download.$inject = [];

export default Download;
