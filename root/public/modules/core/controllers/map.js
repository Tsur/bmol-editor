angular.module('bmol.core')
  .controller('MapCtrl', ['$scope', 'SpriteManager',

    function($scope, SpriteManager) {

      $scope.progress = true;

      $scope.size = {

        'width': 2560,
        'height': 2560
      };

      $scope.sprFile = {

        loading: false,
        error: false,
        loaded: false,

        onFileLoading: function() {

          $scope.sprFile.loading = true;
          $scope.sprFile.error = false;
        },
        onFileError: function(err) {

          $scope.sprFile.error = true;
          $scope.sprFile.loading = false;
        },
        onFile: function(file) {
          $scope.sprFile.loading = false;

          SpriteManager.loadSpr(file['data']);

          if (SpriteManager.sprLoaded() && SpriteManager.dataLoaded()) {
            $scope.sprFile.loaded = true;
            $scope.sprFile.groundsRange = {
              from: 1,
              to: SpriteManager.read().groundsTotal,
              type: 1
            };
            // $scope.sprFile.bordersRange     = {from:1000,to:SpriteManager.read().bordersTotal};
            // $scope.sprFile.itemsRange       = {from:2000,to:SpriteManager.read().itemsTotal};
            // $scope.sprFile.creaturesRange   = {from:3000,to:SpriteManager.read().creaturesTotal};
            // $scope.sprFile.effectsRange     = {from:4000,to:SpriteManager.read().effectsTotal};
            // $scope.sprFile.missilesRange    = {from:5000,to:SpriteManager.read().missilesTotal};
            console.log($scope.sprFile.groundsRange);
          }
        }
      };

      SpriteManager.loadData(function(err) {

        if (!err) {
          $scope.progress = false;
        }
      });

    }

  ]);