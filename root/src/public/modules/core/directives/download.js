'use strict';

function linkHandler(scope, element, attrs){

  // const jsonfile = require('jsonfile');
  // const dialog = require('electron').remote.require('dialog');


  // element.bind('$destroy', function() {
  //
  //   //remove event listeners that might cause memory leaks; Listeners registered to the element are automatically cleaned up when this is removed(destroyed), but if you registered a listener on a service or on a DOM node that isn't being deleted, you'll have to clean it up yourself here
  //
  // });

  $(element[0]).click(e => {

    const link = document.createElement('a');
    const data = scope.download();

    link.download = "map.json";
    link.href = "data:text/plain,"+encodeURIComponent(data);

    link.click();

    link.remove();

    // dialog.showSaveDialog({title:'Save Map'}, filename => {
    //
    //   if(!filename) return;
    //
    //   const data = scope.download();
    //
    //   jsonfile.writeFile(filename, data, function (err) {
    //
    //     if(err) console.error(err);
    //
    //     console.log('file saved');
    //
    //   });
    //
    // });


  });

}

function Download(){

    return {

      scope: {

        'download': '=downloadJson'
      },

      link: (scope, element, attrs) => linkHandler(scope, element, attrs)

    };
}

Download.$inject = [];

export default Download;
