
/*
 * GET home page.
 */

var fs = require('fs');
var async = require('async');
var path = require('path');

exports.index = function(req, res, next){
  var viewsPath = path.resolve(__dirname, "../views") + "/";
  var docDir = "docSections/";
  var docPath = viewsPath + docDir;
  console.log("docPath: " + docPath);

  function getSectionData(filenamesString, cb) {

    function capitaliseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getSectionName (filename, cb) {
      var basename = path.basename(filename, ".html");
      var sectionName = capitaliseFirstLetter(basename.replace(/-/g, " "));
      cb(null, {
        filename: docDir + filename,
	sectionName: sectionName,
	anchorId: basename
      });
    }
    
    console.log("FilenamesString: " + filenamesString);
    var filenames = filenamesString.trim().split("\n");
    async.map(filenames, getSectionName, function(err, sections) {
      cb(err, sections);
    });
  }
  
  var listSections = async.compose(getSectionData, fs.readFile);
  listSections(docPath+"sectionList.txt", "utf8", function(err, sections) {
    if (err)
      return next(new Error("Something borked"));
    
    var includeSections = sections.map(function(section) {
      return "<% include " + section.filename + " %>";
    });
    console.log(sections);
    
    res.render('playground', {sections: sections});
  });
};
