/*
 * spmrc
 *
 * Thanks to: https://github.com/shockie/iniparser
 *
 * An example of ~/.spm/spmrc
 *
 * [user]
 * username=lepture
 *
 * [server:spm]
 * url = https://spmjs.org
 *
 */

var fs = require('fs');
var path = require('path');

var homedir = process.env.HOME;
if (!homedir) {
  homedir = process.env.HOMEDRIVE + process.env.HOMEPATH;
}
exports.spmrcfile = path.join(homedir, '.spm', 'spmrc');
var localrc = path.join(process.cwd(), '.spmrc');

var tmpdir = process.env.TMPDIR || process.env.TMP || process.env.TEMP;
if (!tmpdir) {
  if (process.platform === 'win32') {
    tmpdir = 'c:\\windows\\temp';
  } else {
    tmpdir = '/tmp';
  }
}

var defaults = {
  'user.temp': tmpdir,
  'user.home': homedir,
  'source.default.url': 'https://spmjs.org',
  'install.path': 'sea-modules',
  'install.format': '{{family}}/{{name}}/{{version}}/{{filename}}'
};


exports.get = function(key) {
  var file = exports.spmrcfile;
  var ret = renderConfig(parse(file));
  if (fs.existsSync(localrc)) {
    ret = merge(ret, renderConfig(parse(localrc)));
  }
  if (!key) return ret;

  key = key.replace(':', '.');
  var keys = key.split('.');
  keys.forEach(function(section) {
    ret = ret ? ret[section] : null;
  });
  if (!ret && defaults[key]) {
    return defaults[key];
  }
  return ret;
};

exports.set = function(key, value) {
  var file = exports.spmrcfile;
  var data = parse(file);
  var keys = key.split('.');
  var ret;

  if (keys.length === 3) {
    ret = [];
    ret.push(keys[0] + ':' + keys[1]);
    ret.push(keys[2]);
    keys = ret;
  }
  if (keys.length === 2) {
    data[keys[0]] = data[keys[0]] || {};
    data[keys[0]][keys[1]] = value;
    updateConfig(data);
    return data;
  }
  throw 'A valid input should be something like user.username=spm';
};


exports.config = function(key, value) {
  if (!value) return exports.get(key);
  return exports.set(key, value);
};


var regex = {
  section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
  param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
  comment: /^\s*;.*$/
};

var _cache = {};
function parse(file) {
  file = file || exports.spmrcfile;
  if (!fs.existsSync(file)) {
    return {};
  }
  var data;
  if (_cache.hasOwnProperty(file)) {
    data = _cache[file];
  } else {
    data = fs.readFileSync(file, 'utf8');
    _cache[file] = data;
  }
  var value = {};
  var lines = data.split(/\r\n|\r|\n/);
  var section = null;
  var match;
  lines.forEach(function(line) {
    if (regex.comment.test(line)) {
      return;
    }
    if (regex.param.test(line)) {
      match = line.match(regex.param);
      if (section) {
        value[section][match[1]] = match[2];
      }else {
        value[match[1]] = match[2];
      }
    } else if (regex.section.test(line)) {
      match = line.match(regex.section);
      value[match[1]] = {};
      section = match[1];
    } else if (line.length === 0 && section) {
      section = null;
    }
  });
  return value;
}
exports.parse = parse;


function updateConfig(data) {
  var text = '';
  var init = true;
  var file = exports.spmrcfile;

  Object.keys(data).forEach(function(section) {
    if (!init) {
      text += '\n';
    } else {
      init = false;
    }
    text += '[' + section + ']\n';
    Object.keys(data[section]).forEach(function(key) {
      text += key + ' = ' + data[section][key] + '\n';
    });
  });
  mkdir(path.dirname(file));
  fs.writeFileSync(file, text);
  delete _cache[file];
}
exports.write = updateConfig;

function renderConfig(data) {
  var ret = {};
  Object.keys(data).forEach(function(section) {
    var sections = section.split(':');
    if (sections.length === 2) {
      ret[sections[0]] = ret[sections[0]] || {};
      ret[sections[0]][sections[1]] = data[section];
    } else {
      ret[section] = data[section];
    }
  });
  return ret;
}

function merge(obj) {
  var target, key;

  for (var i = 0; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

function mkdir(dirpath) {
  if (fs.existsSync(dirpath)) return;

  dirpath.split(/[\/\\]/g).reduce(function(parts, part) {
    parts += part + '/';
    var subpath = path.resolve(parts);
    if (!fs.existsSync(subpath)) {
      fs.mkdirSync(subpath);
    }
    return parts;
  }, '');
}
