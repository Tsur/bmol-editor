'use strict';

import settings from '../../../../settings/init';
import clients from './clients';

function _findBy(type, value, returnVersion) {

  value = value.toUpperCase();

  for(var version in clients) {

    var client = clients[version];

    if(Array.isArray(client)) {

      for(var rev in client) {

        if(client[rev][type] == value) {
          return (returnVersion) ? version : true;
        }

      }

    } else {

      if(client[type] == value) {
        return (returnVersion) ? version : true;
      }

    }

  }

  return false;

};

function toHex(value){

  return value.toString(16);
}

class ClientsVersion {

  constructor(){

  }

  getBySignature(signature){

    return _findBy('dat', toHex(signature), true);

  }

  static factory(){

    return new ClientsVersion();

  }

}

ClientsVersion.factory.$inject = [];

export default ClientsVersion;
