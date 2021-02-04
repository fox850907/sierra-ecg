const fs = require('fs')
const { createCanvas } = require('canvas')
var sierraEcg = require('sierraecg');

const width = 1250
const height = 500

const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

context.strokeWidth = 1;

// draw small grid
context.strokeStyle = "#f1dedf";
context.beginPath();
for (var x = 0.5; x < width; x += 1) {
  context.moveTo(x, 0);
  context.lineTo(x, height);
}
for (var y = 0.5; y < height; y += 1) {
  context.moveTo(0, y);
  context.lineTo(width, y);
}
context.stroke();
context.closePath();

// draw medium grid
context.strokeStyle = "#f0adaa";
context.beginPath();
for (var x = 0.5; x < width; x += 5) {
  context.moveTo(x, 0);
  context.lineTo(x, height);
}
for (var y = 0.5; y < height; y += 5) {
  context.moveTo(0, y);
  context.lineTo(width, y);
}
context.stroke();
context.closePath();

// draw big grid
context.strokeStyle = "#e0514b";
context.beginPath();
for (var x = 0.5; x < width; x += 25) {
  context.moveTo(x, 0);
  context.lineTo(x, height);
}
for (var y = 0.5; y < height; y += 25) {
  context.moveTo(0, y);
  context.lineTo(width, y);
}
context.stroke();
context.closePath();

// 12 lead grid
context.strokeStyle = "blue";
context.beginPath();
for (var x = 312.5; x < width; x += 312.5) {
  context.moveTo(x, 0);
  context.lineTo(x, 375);
}
// for (var y = 175; y < height; y += 175) {
//   context.moveTo(0, y);
//   context.lineTo(width, y);
// }
context.stroke();
context.closePath();

var d = [];
for (var i = 0; i < 4; i++) { d.push([]); }
// console.log(d);
var idx = 0, x = 0;
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
      str += lead.name + "," + lead.data.join(',') +"\n";
      var y = 75 + 125 * idx;
      // console.log(y);

      var y2 = 25 + 125 * idx;
      var x2 = 12.5 + width / 4 * parseInt(x/3);
      context.fillStyle = 'blue';
      context.font = '20pt Sans';
      context.fillText(lead.name, x2, y2);
      
      for (var i = 1250 * parseInt(x/3); i < 1250 * parseInt(x/3) + 1250; i++) {
        var tmpdata = lead.data[i] / 100 * 25;
        // var tmpdata = lead.data[i] / 200 * 25;
        if (tmpdata < 0) { tmpdata = tmpdata * (-1) + y; }
        else { tmpdata = y - tmpdata; }
        d[idx].push(tmpdata);
      }
    
      if (lead.name === "II") {
        for (var i = 0; i < 5000; i++) {
			//console.log(lead.data[i]);
          var tmpdata = lead.data[i] / 100 * 25;
          // var tmpdata = lead.data[i] / 200 * 25;
          if (tmpdata < 0) { tmpdata = tmpdata * (-1) + 450; }
          else { tmpdata = 450 - tmpdata; }
          d[3].push(tmpdata);
        }
        context.fillStyle = 'blue';
        context.font = '20pt Sans';
        context.fillText(lead.name, x2, 25+125*3);
      }

      idx = (idx + 1) % 3;
      x += 1;
    });
    
    // console.log(d[1].length);
    dx = width / d[1].length;
    // console.log(dx);
    context.strokeStyle = "#000";
    context.beginPath();
    for (var i = 0; i < d.length; i++) {
      for (var j = 0; j < d[i].length - 1; j++) {
        context.moveTo(j * dx, d[i][j]);
        context.lineTo((j+1) * dx, d[i][j+1]);
      }
    }
    context.stroke();
    context.closePath();

    const buffer = canvas.toBuffer('image/png');
    // fs.writeFileSync('./ecg.png', buffer);
    fs.writeFileSync( filename+'.png', buffer);
    
    fs.appendFile("./data/Philips_TRIM3_0001.csv", str ,function (error) {
      console.log(error)
      console.log('文件寫入成功')
    })
  }
});
