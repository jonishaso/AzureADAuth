var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
router.get('/new', function(req, res, next) {
  res.render('edit', {
    content: null,
    err: null
  })
})
router.get('/:filename', function(req, res, next) {
  fs.readFile(
    path.join(__dirname, '../news/' + req.params['filename'] + '.json'),
    'utf8',
    function(err, data) {
      if (err) next(err)
      else
        res.render('edit', {
          content: JSON.parse(data).content,
          err: null
        })
    }
  )
})

router.post('/', function(req, res, next) {
  if (!req.body['head']) next(new Error('file name error'))
  var head = String(req.body['head']).replace(/\s+|\.+/g, '_')
  if ('' == head || '_' == head) next('file name error')
  else {
    fs.writeFile(
      path.join(__dirname, '../news/' + head + '.json'),
      JSON.stringify({ content: req.body }),
      { flag: 'w+' },
      (err) => {
        if (err) res.send(err)
        else res.redirect('/display')
      }
    )
  }
})
router.delete('/:filename', (req, res, next) => {
  fs.unlink(path.join(__dirname, '../news/' + req.params['filename'] + '.json'), (err) => {
    if (err) next(err)
    else res.redirect('/display/')
  })
})
export default router
