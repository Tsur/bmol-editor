'use strict';

import _ from 'lodash';

class MenuPaletteCtrl {

  constructor($scope){

    $scope.sprFile = {

      loading: false,
      error: false,
      loaded: false,

      onLoading: function() {

        $scope.sprFile.loading = true;
        $scope.sprFile.error = false;
      },

      onError: function(err) {

        $scope.sprFile.error = true;
        $scope.sprFile.errorMsg = err.message;
        $scope.sprFile.loading = false;
      },

      onData: function(data) {

        $scope.sprFile.loading = false;
        $scope.sprFile.error = false;

        //
        // $scope.sprFile.loading = false;
        //
        // SpriteManager.loadSpr(file['data']);
        //
        // if (SpriteManager.sprLoaded() && SpriteManager.dataLoaded()) {
        //   $scope.sprFile.loaded = true;
        //   $scope.sprFile.groundsRange = {
        //     from: 1,
        //     to: SpriteManager.read().groundsTotal,
        //     type: 1
        //   };
        //   // $scope.sprFile.bordersRange     = {from:1000,to:SpriteManager.read().bordersTotal};
        //   // $scope.sprFile.itemsRange       = {from:2000,to:SpriteManager.read().itemsTotal};
        //   // $scope.sprFile.creaturesRange   = {from:3000,to:SpriteManager.read().creaturesTotal};
        //   // $scope.sprFile.effectsRange     = {from:4000,to:SpriteManager.read().effectsTotal};
        //   // $scope.sprFile.missilesRange    = {from:5000,to:SpriteManager.read().missilesTotal};
        //   console.log($scope.sprFile.groundsRange);
        // }
      }
    };

    // SpriteManager.loadData(function(err) {
    //
    //   if (!err) {
    //     $scope.progress = false;
    //   }
    // });

  }


}

MenuPaletteCtrl.$inject = ['$scope'];

export default MenuPaletteCtrl;
