var express     = require('express');
var path        = require('path');
var app         = express();
var static_path = path.join(__dirname, 'public');
var port        = 4000;

app.use(express.static(static_path));

app.get('/*', function (req, res) {
  res.sendFile('index.html', {
    root: static_path
  });
});

app.listen(process.env.PORT || port, function (err) {
  if (err) { console.log(err) };
  console.log(`Listening at localhost:${port}`);
});
