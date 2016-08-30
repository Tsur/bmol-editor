'use strict';

function linkHandler(scope, element, attrs){

  // const dialog = require('electron').remote.require('dialog');
  // const fs = require('fs');

  $(element[0]).click(e => {

  //   dialog.showOpenDialog({title:'Load Map'}, filename => {
  //
  //     if(!filename) return;
  //
  //     fs.readFile(filename[0], (err, file) => {
  //
  //       if(err) return console.error(err);
  //
  //       scope.upload(file);
  //
  //     });
  //
  //   });

    const input = document.createElement('input');

    input.type = "file";
    input.id = "item"+Math.random();

    const changeHandler = event => {

        const file = event.target.files[0];

        if(file){

            const reader = new FileReader();

            reader.onload = event => {

                const content = event.target.result;

                scope.upload(content);
            };

            reader.readAsText(file);
        }

        input.removeEventListener('click', changeHandler, false);

        input.remove();

    };

    input.addEventListener('change', changeHandler, false);

    input.click();

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
