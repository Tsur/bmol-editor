
import settings from '../../settings/init';
import {ucwords, removeDiacritics} from './core';

/**
 * Description
 * @method generatePassword
 * @param {} obj
 * @return Literal
 */
export function generateRandomCode(pattern) {

  pattern = pattern || settings.get('user.recover.passwdPattern');

  return pattern.replace(/[xn]/g, function(c) {

    return c === 'x' ? (Math.random() * 16 | 0).toString(16) : Math.floor(
      Math.random() * 9).toString(16);
    //(r&0x3|0x8);
  });
};

/**
 * Description
 * @method parseFullName
 * @param {} globPatterns
 * @param {} removeRoot
 * @return output
 */
export function parseFullName(fullname) {

  var _fullname = {},
    _fullname_parts;

  if (typeof fullname === 'string' && fullname != '' && (_fullname_parts =
    fullname.split(' ')).length > 1) {

    if (fullname.indexOf(',') > 0) {

      _fullname_parts = fullname.split(',');
    }

    _fullname.firstname = ucwords(removeDiacritics(
      _fullname_parts[0].trim()));
    _fullname.lastname = ucwords(removeDiacritics(
      _fullname_parts.slice(1).join(' ').trim()));
    _fullname.username = (_fullname.firstname.toLowerCase() + '.' + _fullname.lastname
      .toLowerCase()).replace(/ /g, '');

  } else if (typeof fullname === 'string' && fullname != '') {

    _fullname.firstname = ucwords(removeDiacritics(
      fullname.trim()));
    _fullname.lastname = '';
    _fullname.username = _fullname.firstname.toLowerCase();
  }

  return _fullname;
};
