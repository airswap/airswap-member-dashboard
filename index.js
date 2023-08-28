var express = require('express');
var app = express();
app.use(express.static('./dist'));
app.listen(process.env.PORT || 3000);