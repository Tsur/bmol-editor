'use strict';

import _ from 'lodash';

function linkHandler(scope, element, attrs, $compile){

  if (!attrs.containerText) {
    attrs.containerText = 'DROP YOUR FOLDERS HERE &hellip;';
  }

  if (!attrs.containerClass) {
    attrs.containerClass = 'folderdrop-label';
  }

  var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes, template = element.html();

  if (attrs.onClick === 'true') {
    var fileId = 'filedropzone' + Math.random().toString(16);

    if (attrs.uploadFileWrapperClass) {
      var wrapper = attrs.uploadFileWrapperClass.split('.');
      template = '<' + wrapper[0] + ' class="' + wrapper[1] + '"><label class="{{uploadFileTextClass}}" for="' + fileId + '">{{uploadFileText}}</label><input id="' + fileId + '" type="file" style="display:none;"/></' + wrapper[0] + '>' + template;

      template = angular.element(template);

      element.children().remove();

      element.append(template);

      var fileLabel = angular.element(angular.element(element.children()[0]).children()[0]),
        fileInput = angular.element(angular.element(element.children()[0]).children()[1]);
    } else {
      template = '<label class="{{uploadFileTextClass}}" for="' + fileId + '">{{uploadFileText}}</label><input id="' + fileId + '" type="file" style="display:none;"/>' + template;

      template = angular.element(template);

      element.children().remove();

      element.append(template);

      var fileLabel = angular.element(element.children()[0]),
        fileInput = angular.element(element.children()[1]);
    }

    var resetFileInput = function() {

      fileInput.unbind('click');
      fileInput.remove();

      fileId = 'filedropzone' + Math.random().toString(16);

      fileInput = angular.element(document.createElement("input"));
      fileInput.attr('type', 'file');
      fileInput.attr('id', fileId);
      fileInput.css('display', 'none');
      fileInput.bind('change', function(e) {
        processFile(e, true);
      });

      fileLabel.after(fileInput);
      fileLabel.attr("for", fileId);
    };

    fileInput.bind('change', function(e) {
      processFile(e, true);
    });

  } else {


    template = '<div class="{{containerClass}}"><label>{{containerText}}</label></div>' + template;

    template = angular.element(template);

    element.children().remove();

    element.append(template);

  }

  $compile(template)(scope);

  // function traverseFileTreeRecursively(item, cb, path="") {
  //
  //   if (item.isFile) return item.file(file => cb(file));
  //
  //   if (item.isDirectory) {
  //
  //     // Get folder contents
  //     const dirReader = item.createReader();
  //
  //     return dirReader.readEntries(entries => {
  //
  //       for (var i=0; i<entries.length; i++)
  //         traverseFileTree(entries[i], cb, `${path}${item.name}/`);
  //
  //     });
  //
  //   }
  //
  // }

  function traverseFileTree(item, cb) {

    const filesList = [];

    if (item.isFile) filesList.push(item);

    if (item.isDirectory) {

      // Get folder contents
      const dirReader = item.createReader();

      return dirReader.readEntries(entries => {

        for (var i=0; i<entries.length; i++){

            if (entries[i].isFile) filesList.push(entries[i]);
        }

        cb({files:filesList});

      });

    }

    cb({files:filesList});

  }

  const onDrop = event => {

    scope.$apply(() => scope.onFileLoading());

    event.preventDefault();

    const items = event.dataTransfer.items;

    for (let i=0; i<items.length; i++) {

      // webkitGetAsEntry is where the magic happens
      const item = items[i].webkitGetAsEntry();

      if (item) return traverseFileTree(item, onFile);

    }

    onFile({files:[]});

  };

  const onFile = files => {

    if(!files || !files.files || !files.files.length)
      return scope.$apply(() => scope.onFileError({err: new Error("No files found in the folder")}));

    // const dat = _.filter(files.files, file => file.name.indexOf('.dat') > -1 );
    const spr = _.filter(files.files, file => file.name.indexOf('.spr') > -1 );

    // if(!dat.length && !spr.length) return scope.$apply(() => scope.onFileError({err: new Error("No .data or .spr file found")}));
    // if(!dat.length) return scope.$apply(() => scope.onFileError({err: new Error("No .data file found")}));
    if(!spr.length) return scope.$apply(() => scope.onFileError({err: new Error("No .spr file found")}));

    let numFiles = 1;
    const data = {};

    // dat[0].file( file => processFile(file, file => {
    //
    //   data.dat = file;
    //
    //   numFiles--;
    //
    //   if(!numFiles){
    //
    //      onData(data);
    //   }
    //
    // }));

    spr[0].file( file => processFile(file, file => {

      data.spr = file;

      numFiles--;

      if(!numFiles){

         onData(data);
      }

    }));

    // if(!files.length) console.log('no files');
    //
    // _.forEach(files, file => console.log('File', file));

  };

  const onData = data => {

      scope.$apply(() => scope.onFile({data}));
  }

  const processFile = (file, cb) => {

    try {

      const reader = new FileReader();

      reader.onload = event => {

          const data = {};

          data['data'] = event.target.result;
          data['name'] = file.name;
          data['size'] = file.size;
          data['type'] = file.type;

          cb(data);

      };

      attrs.readFileAs = attrs.readFileAs.toLowerCase();

      if (attrs.readFileAs == 'dataurl') {
        reader.readAsDataURL(file);
      } else if (attrs.readFileAs == 'buffer') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }

    } catch (error) {

      return scope.$apply(() => scope.onFileError({err: new Error(`${file.name} file is corrupted`)}));
    }

  };

  const body = $('body');

  body.bind('drop', event => event && event.preventDefault());
  body.bind('dragover', event => event && event.preventDefault());
  body.bind('dragenter', event => event && event.preventDefault());

  element[0].ondrop = onDrop;

  // processDragOverOrEnter = function(event) {
  //   if (event) {
  //     event.preventDefault();
  //   }
  //
  //   event.dataTransfer.effectAllowed = 'copy';
  //   return false;
  // };
  //
  // validMimeTypes = attrs.fileDropzone;
  //
  // checkSize = function(size) {
  //   var _ref;
  //
  //   if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
  //     return true;
  //   } else {
  //
  //     scope.$apply(function() {
  //       // scope.fileLoading = false;
  //       // scope.fileError['code']= 1;
  //       // scope.fileError['visible']= true;
  //       scope.onFileError({
  //         err: 1
  //       });
  //     });
  //
  //     return false;
  //   }
  //
  // };
  //
  // isTypeValid = function(type) {
  //
  //   console.log(type);
  //   //Temporal solution for those cases when the browser set no mime type on file
  //   if (type == '') {
  //     return true;
  //   }
  //
  //   if (((validMimeTypes === (void 0) || validMimeTypes === '') || !type || validMimeTypes.indexOf(type) > -1) && type.replace(/\ /g, '') != '') {
  //     return true;
  //   } else {
  //
  //     scope.$apply(function() {
  //       //scope.fileError = 'mime';
  //       // scope.fileLoading = false;
  //       // scope.fileError['code']= 2;
  //       // scope.fileError['visible']= true;
  //       scope.onFileError({
  //         err: 2
  //       });
  //       //toFn(scope);
  //     });
  //
  //     return false;
  //   }
  // };
  //

  //
  // var container = element.parent().parent().parent().parent().parent();
  //
  // container.bind('drop', function(e) {
  //   event.preventDefault();
  // });
  //
  // container.bind('dragover', function(e) {
  //   event.preventDefault();
  // });
  //
  // container.bind('dragenter', function(e) {
  //   event.preventDefault();
  // });
  //
  // element.bind('dragover', processDragOverOrEnter);
  //
  // element.bind('dragenter', processDragOverOrEnter);
  //
  // element.bind('drop', function(event) {
  //
  //   processFile(event, false);
  // });

}

function FolderDrop($compile){

    return {

      replace: false,
      terminal: true,
      scope: {
        containerText: '@',
        containerClass: '@',
        //fileList:'=',
        onFileError: '&',
        onFileLoading: '&',
        onFile: '&'
      },

      link: (scope, element, attrs) => linkHandler(scope, element, attrs, $compile)

    };
}

FolderDrop.$inject = ['$compile'];

export default FolderDrop;
