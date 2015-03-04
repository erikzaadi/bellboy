var mustache = require('mustache');
var path = require('path');
var fs = require('fs');

var foreverExec = path.join(__dirname, "node_modules", ".bin", "forever");

var projectsList = process.argvslice(2);
var opt = {
  encoding: 'utf-8'
};

projectsList.forEach(function(project){
  var details = require(path.join(project, 'package.json'));
  details.project_dir = project;
  details.forever_exec = foreverExec;

  var template = null;
  if (project.indexOf("bellboy-hubot") != -1){
    template = fs.readFileSync(path.join(__dirname, 'hubot.template.sh'), opt);
  } else {
    template = fs.readFileSync(path.join(__dirname, 'service.template.sh'), opt);
  }

  var rendered = mustache.render(template, details);
  fs.writeFileSync(path.join(__dirname, 'rendered', details.name), rendered, opt);
});
