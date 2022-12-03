var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()

/* GET home page. */
router.get('/', function (req, res, next) {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists if not lets create it on the fly!
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='bloggington'`,
        (err, rows) => {
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(` select id, title, author, blog_txt from bloggington`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'Bloggington', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.run(`create table bloggington (
                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                     title text NOT NULL,
                     author text NOT NULL,
                     blog_txt text NOT NULL);

                      insert into bloggington (title, author, blog_txt)
                      values ('Welcome To Blog', 'Christian Galvan', 'If you see this, it's already too late...'),
                             ('Blogging', 'Anonymous User', 'What does that even mean??');`,
              () => {
                db.all(` select id, title, author, blog_txt from bloggington`, (err, rows) => {
                  res.render('index', { title: 'Bloggington', data: rows });
                });
              });
          }
        });
    });
});

router.post('/add', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("inserting data: " + req.body.blog);
      db.run(`INSERT INTO bloggington (title, author, blog_txt) VALUES (?,?,?)`, [req.body.tblog,req.body.aublog,req.body.ablog],
        function(err){
          if (err) {
            return console.error(err.message);
          }
        }
      );
      //redirect to homepage
      res.redirect('/');
    }
  );
})

router.post('/delete', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      db.run('DELETE FROM bloggington WHERE id=(?)', [req.body.dblog],
      function(err){
        if (err) {
          return console.error(err.message);
        }
      }
      );
      res.redirect('/');
    }
  );
})

router.post('/edit', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      db.run('UPDATE bloggington SET blog_txt = (?), title = (?) WHERE id = (?)', [req.body.etextblog, req.body.etblog, req.body.eblog],
        function (err) {
          if (err) {
            return console.error(err.message);
          }
        }
      );
      res.redirect('/');
    }
  );
})

module.exports = router;