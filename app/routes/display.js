import express from 'express'
import fs from 'fs'
import path from 'path'
var router = express.Router()

router.get('/:filename', (req, res, next) => {
  fs.readFile(
    path.join(__dirname, '../news/' + req.params['filename'] + '.json'),
    'utf8',
    function(err, data) {
      if (err) {
        res.render('displayFile', { err: err })
        throw err
      } else {
        try {
          res.render('displayFile', {
            content: JSON.parse(data).content,
            fname: req.params['filename'],
            err: null
          })
        } catch (SyntaxError) {
          res.render('displayFile', {
            content: null,
            err: null
          })
        }
      }
    }
  )
})
router.get('/', function(req, res, next) {
  fs.readdir(
    path.join(__dirname, '../news/'),
    { withFileTypes: false },
    (err, files) => {
      if (err) next(err)
      else
        res.render('display', {
          files: files,
          err: null
        })
    }
  )
})

export default router
