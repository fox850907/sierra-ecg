const fs = require('fs')
const { createCanvas } = require('canvas')
var sierraEcg = require('sierraecg');

const width = 1250
const height = 500


var filename = "./reableXML/Philips_TRIM3_0001_pyClear"

var str = "\n";

sierraEcg.readFile( filename + '.xml', function (err, ecg) {
// sierraEcg.readFile('3191723_ZZDEMOPTONLY_1-04_orig.XML', function (err, ecg) {
  if (err) { console.error(err); }
  else {
    // console.log('Found %d leads', ecg.leads.length);
    
    
    ecg.leads.filter(function (lead) { return lead.enabled; }).forEach(function (lead) {
		console.log("each");
       console.log(
         '    %s: %s ... (%d samples)',
         lead.name,
         lead.data.slice(0, 10).join(','),
         lead.data.length
      );

    
    fs.appendFile("./data/Philips_TRIM3_0001.csv", str ,function (error) {
      console.log(error)
      console.log('文件寫入成功')
    })
	})
  }
});
