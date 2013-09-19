
/*
 * GET home page.
 */

var fs = require('fs');
var async = require('async');
var path = require('path');

exports.index = function(req, res, next){
  var docDir = "docSections/";
  var viewsPath = path.resolve(__dirname, "../views") + "/";
  var docPath = viewsPath + docDir;
  console.log("docPath: " + docPath);

  function getSectionData(filenames, cb) {

    function capitaliseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getSectionName (filename, cb) {
      var basename = path.basename(filename, ".html");
      var sectionName = capitaliseFirstLetter(basename.replace(/-/g, " "));
      cb(null, {
        filename: docDir + filename,
	sectionName: sectionName
      });
    }

    async.map(filenames, getSectionName, function(err, sections) {
      cb(err, sections);
    });
  }
  
  var listSections = async.compose(getSectionData, fs.readdir);
  listSections(docPath, function(err, sections) {
    if (err)
      return next(new Error("Something borked"));
    
    var includeSections = sections.map(function(section) {
      return "<% include " + section.filename + " %>";
    });
    console.log(includeSections);
    
    res.render('playground');
  });
};
