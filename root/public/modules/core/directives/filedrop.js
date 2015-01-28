'use strict';

angular.module('bmol.core')
  .directive('fileDropzone', ['$compile',
    function($compile) {
      return {
        replace: false,
        terminal: true,
        scope: {
          uploadFileText: '@',
          uploadFileTextClass: '@',
          //fileList:'=',
          onFileError: '&',
          onFileLoading: '&',
          onFile: '&'
        },
        //template: '<label class="{{uploadFileTextClass}}">{{uploadFileText}}</label><input type="file" style="display:none;"/>',
        //scope: true,
        link: function(scope, element, attrs) {

          var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes, processFile, template = element.html();

          if (attrs.fileInput) {
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
            template = '<label class="{{uploadFileTextClass}}">{{uploadFileText}}</label>' + template;

            template = angular.element(template);

            element.children().remove();

            element.append(template);

          }

          if (!attrs.uploadFileText) {
            attrs.uploadFileText = 'ARRASTRA TUS FICHEROS AQUÍ';
          }

          if (!attrs.uploadFileTextClass) {
            attrs.uploadFileTextClass = 'dropzone-label';
          }

          $compile(template)(scope);

          processDragOverOrEnter = function(event) {
            if (event) {
              event.preventDefault();
            }

            event.dataTransfer.effectAllowed = 'copy';
            return false;
          };

          validMimeTypes = attrs.fileDropzone;

          checkSize = function(size) {
            var _ref;

            if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
              return true;
            } else {

              scope.$apply(function() {
                // scope.fileLoading = false;
                // scope.fileError['code']= 1;
                // scope.fileError['visible']= true;
                scope.onFileError({
                  err: 1
                });
              });

              return false;
            }

          };

          isTypeValid = function(type) {

            console.log(type);
            //Temporal solution for those cases when the browser set no mime type on file
            if (type == '') {
              return true;
            }

            if (((validMimeTypes === (void 0) || validMimeTypes === '') || !type || validMimeTypes.indexOf(type) > -1) && type.replace(/\ /g, '') != '') {
              return true;
            } else {

              scope.$apply(function() {
                //scope.fileError = 'mime';
                // scope.fileLoading = false;
                // scope.fileError['code']= 2;
                // scope.fileError['visible']= true;
                scope.onFileError({
                  err: 2
                });
                //toFn(scope);
              });

              return false;
            }
          };

          processFile = function(event, input) {

            scope.$apply(function() {

              scope.onFileLoading();

            });

            try {
              var file, name, reader, size, type;

              if (event) {
                event.preventDefault();
              }

              file = (input) ? fileInput[0].files[0] : event.dataTransfer.files[0];
              name = file.name;
              type = file.type;
              size = file.size;

              reader = new FileReader();

              reader.onload = function(evt) {

                if (checkSize(size) && isTypeValid(type)) {

                  var file = {};

                  file['data'] = evt.target.result;
                  file['name'] = name;
                  file['size'] = size;
                  file['type'] = type;

                  if (input) {
                    resetFileInput();
                  }

                  return scope.$apply(function() {

                    scope.onFile({
                      file: file
                    });

                  });
                }

              };

              attrs.readFileAs = attrs.readFileAs.toLowerCase();

              if (attrs.readFileAs == 'dataurl') {
                reader.readAsDataURL(file);
              } else if (attrs.readFileAs == 'buffer') {
                reader.readAsArrayBuffer(file);
              } else {
                reader.readAsText(file);
              }

              return false;
            } catch (e) {
              return scope.$apply(function() {

                scope.onFileError({
                  err: -1
                });

              });
            }
          };

          var container = element.parent().parent().parent().parent().parent();

          container.bind('drop', function(e) {
            event.preventDefault();
          });

          container.bind('dragover', function(e) {
            event.preventDefault();
          });

          container.bind('dragenter', function(e) {
            event.preventDefault();
          });

          element.bind('dragover', processDragOverOrEnter);

          element.bind('dragenter', processDragOverOrEnter);

          element.bind('drop', function(event) {

            processFile(event, false);
          });
        }
      };
    }
  ]);