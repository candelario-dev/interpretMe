const PictureUploads = require('./models/pictureUpload.js')
const ProfilePictures = require('./models/profilePic.js')
const CoverPictures = require('./models/profilePic.js')


module.exports = function(app, passport, db, multer, ObjectId) {
  var storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + ".png")
      }
  });
  var upload = multer({storage: storage});






// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    // PROFILE SECTION =========================
    // app.get('/profile', isLoggedIn, function(req, res) {
    //   let uId = ObjectId(req.session.passport.user)
    //     // db.collection('data').find().toArray((err, result) => {
    //       // console.log(result)
    //       db.collection('pictureuploads').find({'posterId': uId}).toArray((err, result) => {
    //         // console.log(result)
    //       if (err) return console.log(err)
    //       res.render('profile.ejs', {
    //         user : req.user,
    //         messages: result,
    //         pictureUpload: result,
    //         bio: ""
    //         })
    //       })
    //
    // });
    


    app.get('/profile', isLoggedIn, function(req, res) {
      let uId = ObjectId(req.session.passport.user)
          db.collection('pictureuploads').find({'posterId': uId}).toArray((err, result) => {
          if (err) return console.log(err)
          db.collection('profilepics').find({'posterId': uId}).toArray((err, results) =>{
            if (err) return console.log(err)
            db.collection('comments').find().toArray((err,resultado) =>{
              if (err) return console.log(err)

            console.log(result, 'yesss');
          res.render('profile.ejs', {
            user : req.user,
            messages: result,
            pictureUpload: result,
            bio: "",
            imgPath : results,
            comments: resultado
            })
          })
})
    });
  })




















    app.get('/messages', isLoggedIn, function(req, res) {
      let uId = ObjectId(req.session.passport.user)
        // db.collection('data').find().toArray((err, result) => {
          // console.log(result)
          db.collection('pictureuploads').find({'posterId': uId}).toArray((err, result) => {
            // console.log(result)
          if (err) return console.log(err)
          res.render('messages.ejs', {
            user : req.user,
            messages: result,
            pictureUpload: result,
            bio: ""
            })
          })
        // })
    });


    app.get('/editprofile', isLoggedIn, function(req, res) {
      let uId = ObjectId(req.session.passport.user)
          db.collection('pictureuploads').find({'posterId': uId}).toArray((err, result) => {
          if (err) return console.log(err)
          db.collection('profilepics').find({'posterId': uId}).toArray((err, results) =>{
            console.log(result, results, 'YESSSS');
          res.render('editprofile.ejs', {
            user : req.user,
            messages: result,
            pictureUpload: result,
            imgPath: results,
            posterId : results,
            })
          })
        })
    });

    // app.post('/bioPost', (req, res) => {
    // //   db.collection('users').save({bio: req.body.bio}, (err, result) => {
    // //     if (err) return console.log(err)
    // //     console.log('saved to database')
    // //     res.redirect('/profile')
    // //   })
    // // })

    app.post('/bioPost', (req, res) => {
      // let userPage = req.headers.referer
      let uId = ObjectId(req.session.passport.user)
      // let senderEmail = req.user.local.email
      // let recieverId = ObjectId(req.body.recieverId)

      db.collection('users')
      .update({_id: uId}, {
        $push: {'local.bio': {
          bio: req.body.bio
        } }
      }, {
        sort: {_id: 1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/profile')
      })
    })
    // app.get('/feed', isLoggedIn, function(req, res) {
    //     db.collection('posts').find().toArray((err, result) => {
    //       db.collection('pictureuploads').find().toArray((err, result) => {
    //       if (err) return console.log(err)
    //       res.render('feed.ejs', {
    //         user : req.user,
    //         messages: result,
    //         pictureUpload: result
    //       })
    //     })
    //   })
    // });


    app.get('/feed', isLoggedIn, function(req, res) {
        let uId = ObjectId(req.session.passport.user)
          db.collection('pictureuploads').find().toArray((err, result) => {
          if (err) return console.log(err)
          db.collection('requests').find({'recieverId': uId}).toArray((err, results) => {
            if (err) return console.log(err)
            db.collection('comments').find().toArray((err,resultado) =>{
              if (err) return console.log(err)
          res.render('feed.ejs', {
            user : req.user,
            messages: result,
            pictureUpload: result,
            requests : results,
            comments : resultado
          })
        })
    });
})
})











    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



    app.post('/pictureUpload', upload.single('file-to-upload'), (req, res, next) => {
      let userPage = req.headers.referer
      let uId = ObjectId(req.session.passport.user)
      let userEmail = req.user.local.email
      const newPicture = new PictureUploads({
        userEmail: userEmail,
        posterId: uId,
        caption: req.body.caption,
        likes: 0,
        imgPath: 'images/uploads/' + req.file.filename,
      })
      newPicture.save()
      .then(picture => {
        console.log(picture)
      })
      res.redirect(userPage)
    });

    //DIRECT MESSAGES========
    app.post('/directMessage', (req, res) => {
      let userPage = req.headers.referer
      let senderId = ObjectId(req.session.passport.user)
      let senderEmail = req.user.local.email
      let recieverId = ObjectId(req.body.recieverId)

      db.collection('users')
      .update({_id: recieverId}, {
        $push: {'local.messages': {
          senderId: senderId,
          senderEmail: senderEmail,
          message: req.body.message
        } }
      }, {
        sort: {_id: 1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.redirect(userPage)
      })
    })



//============================================Bio
// app.post('/orders', (req, res) => {
//   db.collection('bio').save({bio: req.body.bio}, (err, result) => {
//     if (err) return console.log(err)
//     console.log('saved to database')
//     res.redirect('/profile')
//   })
// })

    //DELETE MESSAGE=================
    setTimeout(function() {
}, 3000);
    app.post('/deleteMessage', (req, res) => {
      // let userPage = req.headers.referer
      let senderId = ObjectId(req.session.passport.user)
      console.log(senderId)
      let senderEmail = req.user.local.email
      console.log(req.body)
      let recieverId = ObjectId(req.body.recieverId)

      db.collection('users')
      .update({_id: senderId}, {
        $pull: {'local.messages': {
          message: req.body.thisMessage
        } }
      }, {
        sort: {_id: 1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/feed')
      })
    })

    // INDIVIDUAL PROFILE PAGE =========================
    app.get('/userProfile/:zebra', function(req, res) {
        let postId = ObjectId(req.params.zebra)
        console.log(postId);
        db.collection('pictureuploads').find({posterId: postId}).toArray((err, result) => {
          if (err) return console.log(err);
          db.collection('users').find({_id: postId}).toArray((err, results) => {
            console.log('HI', result, results);
          if (err) return console.log(err)
          db.collection('comments').find().toArray((err,resultado) =>{
            if (err) return console.log(err)
            db.collection('profilepics').find({'posterId': postId}).toArray((err, resulta) =>{
          res.render('userProfile.ejs', {
            user: req.user,
            pictureUpload: result,
            loved : results[0],
            comments : resultado,
            imgPath : resulta
})
})
  })
})
})
})

    app.put('/likePicture', (req, res) => {
      db.collection('pictureuploads')
      .findOneAndUpdate({_id: ObjectId(req.body._id), caption: req.body.caption}, {
        $set: {
          likes:req.body.likes + 1
        }
      }, {
        sort: {_id: 1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.post('/comment', (req, res) => {
      let userPage = req.headers.referer
      console.log(userPage)
      // console.log("from comment route", req.body)
      let pictureId = ObjectId(req.body.pictureId)
      console.log('this is pictureId' + pictureId)
      let commentPosterId = ObjectId(req.user._id)

      let commentPosterEmail = req.user.local.email
      console.log(commentPosterEmail)
      db.collection('comments')
      .save( {
           CommentPosterId: commentPosterId,
           commentPosterEmail: commentPosterEmail,
           CommentPost: req.body.comment,
           postId :pictureId
         }
      , {
        sort: {_id: 1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)

          res.redirect(userPage)

      })
    })


    app.post('/RComment', (req, res) => {
      let userPage = req.headers.referer
      console.log(userPage)
      console.log(req.body)
      let pictureId = ObjectId(req.body.pictureId)
      console.log('this is pictureId' + pictureId)
      let commentPosterId = ObjectId(req.user._id)
      // console.log(commentPosterId)
      let commentPosterEmail = req.user.local.email
      console.log(commentPosterEmail)
      PictureUploads.findOneAndUpdate({_id: pictureId}, {
         $pull: {comments: {
           CommentPosterId: commentPosterId,
         } }
      }, {
        sort: {_id: 1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)

          res.redirect(userPage)

      })
    })

    app.delete('/deletePost', (req, res) => {
      // console.log(req.body)
      db.collection('pictureuploads').findOneAndDelete({_id: ObjectId(req.body._id)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    app.delete('/deleteComment', (req, res) => {
      // console.log(req.body)
      db.collection('comments').findOneAndDelete({_id: ObjectId(req.body._id)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

//Help requests==================================================================

app.post('/helpReq', (req, res) => {
  let userPage = req.headers.referer
  let senderId = ObjectId(req.session.passport.user)
  let senderEmail = req.user.local.email
  let recieverId = ObjectId(req.body.recieverId)

  db.collection('requests')
  .save( {
      newId : ObjectId(),
      senderId: senderId,
      senderEmail: senderEmail,
      requests: req.body.message,
      recieverId : recieverId,
      accept: "",
      replied: "",
      helpful:"",
      love: ""
}
  , {
    sort: {_id: 1},
    upsert: false
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/feed')
  })
})

//=========Now we pull them
app.get('/viewReqs', isLoggedIn, function(req, res) {
  // console.log(req.local.requests)
  let uId = ObjectId(req.session.passport.user)
  db.collection('requests').find({'recieverId': uId}).toArray((err, result) => {
    console.log(result);
    if (err) return console.log(err)
    res.render('helpreqs.ejs', {
      requests : result
    })
  })
})

//===================Now we delete them (basically denying it)
app.delete('/deleteReq', isLoggedIn, function(req, res) {
    db.collection('requests').findOneAndDelete({_id: ObjectId(req.body._id)}, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })


 //====================Now we accept them

 app.put('/acceptReq', (req, res) => {
   db.collection('requests')
   .findOneAndUpdate({_id: ObjectId(req.body._id)}, {
     $set: {
       accept: "Accepted"
     }
   }, {
     sort: {_id: 1},
     upsert: true
   }, (err, result) => {
     if (err) return res.send(err)
     res.send(result)
   })
 })



 app.get('/profedit', isLoggedIn, function(req, res) {
   let uId = ObjectId(req.session.passport.user)
       db.collection('pictureuploads').find({'posterId': uId}).toArray((err, result) => {
       if (err) return console.log(err)
       db.collection('profilepics').find({'posterId': uId}).toArray((err, results) =>{
         if (err) return console.log(err)
         console.log('HEY', result, results[0].imgPath);
       res.render('profeditone.ejs', {
         user : req.user,
         messages: result,
         pictureUpload: result,
         bio: "",
         imgPath : results
         })
       })
})
 });
 //==========Deletion once replied

 // app.post('/messReq', (req, res) => {
 //   let userPage = req.headers.referer
 //   let senderId = ObjectId(req.session.passport.user)
 //   let senderEmail = req.user.local.email
 //   let recieverId = ObjectId(req.body.recieverId)
 //
 //   db.collection('users')
 //   .update({_id: recieverId}, {
 //     $push: {'local.messages': {
 //       senderId: senderId,
 //       senderEmail: senderEmail,
 //       message: req.body.message
 //     } }
 //   }, {
 //     sort: {_id: 1},
 //     upsert: false
 //   }, (err, result) => {
 //     if (err) return res.send(err)
 //     res.redirect('/feed')
 //   })
 // })


//===========post and put so its like replied
 app.route('/test')
   .put((req, res) => repliedNow(req, res))
   .post((req, res) => repliedMess(req, res))

 repliedNow = (req, res) => {
     db.collection('requests')
     .findOneAndUpdate({_id: ObjectId(req.body._id)}, {
       $set: {
         replied: "yes"
       }
     }, {
       sort: {_id: 1},
       upsert: true
     }, (err, result) => {
       if (err) return res.send(err)
       res.send(result)
     })
   }


 repliedMess = (req, res) => {
     let userPage = req.headers.referer
     let senderId = ObjectId(req.session.passport.user)
     let senderEmail = req.user.local.email
     let recieverId = ObjectId(req.body.recieverId)

     db.collection('users')
     .update({_id: recieverId}, {
       $push: {'local.messages': {
         senderId: senderId,
         senderEmail: senderEmail,
         message: req.body.message
       } }
     }, {
       sort: {_id: 1},
       upsert: false
     }, (err, result) => {
       if (err) return res.send(err)
       res.redirect('/viewReqs')
     })
   }

//==================for the helpfulness
   app.put('/helpful', (req, res) => {
     db.collection('requests')
     .findOneAndUpdate({_id: ObjectId(req.body._id)}, {
       $set: {
         helpful: "yes"
       }
     }, {
       sort: {_id: 1},
       upsert: true
     }, (err, result) => {
       if (err) return res.send(err)
       res.send(result)
     })
   })

   app.put('/notHelpful', (req, res) => {
     db.collection('requests')
     .findOneAndUpdate({_id: ObjectId(req.body._id)}, {
       $set: {
         helpful: "no"
       }
     }, {
       sort: {_id: 1},
       upsert: true
     }, (err, result) => {
       if (err) return res.send(err)
       res.send(result)
     })
   })

//Now for the love ==================================
app.put('/love', (req, res) => {
  db.collection('requests')
  .findOneAndUpdate({_id: ObjectId(req.body._id)}, {
    $set: {
      love: "sent"
    }
  }, {
    sort: {_id: 1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/loveDelete', isLoggedIn, function(req, res) {
    db.collection('requests').findOneAndDelete({_id: ObjectId(req.body._id)}, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })


  //=====================Delete what's not helpful
  app.delete('/notHelpfulDelete', isLoggedIn, function(req, res) {
      db.collection('requests').findOneAndDelete({_id: ObjectId(req.body._id)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })


//===================How to put the love in profile
app.put('/putLove', (req, res) => {
  let lover = ObjectId(req.body.sendId)
  db.collection('users')
  .findOneAndUpdate({_id: lover}, {
    $inc: {
      loved: 1
    }
  }, {
    sort: {_id: 1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})







//=======================help requ fprsm page


app.get('/helpform/:zebra', function(req, res) {
    let postId = ObjectId(req.params.zebra)
    console.log(postId);
    db.collection('pictureuploads').find({posterId: postId}).toArray((err, result) => {
      console.log(result)
      if (err) return console.log(err)
      res.render('helpform.ejs', {
        user: req.user,
        pictureUpload: result
      })
    })
});

//======================================================First editprofile
app.get('/firstedit', isLoggedIn, function(req, res) {

     res.render('firstprofedit.ejs') });
 // });


app.put('/bioEdit', (req, res) => {
  let uId = ObjectId(req.session.passport.user)
  // console.log("r")
  db.collection('users')
  .findOneAndUpdate({_id: uId}, {
    // to update in object use quotes with dot notation :)
     $set: {bio: req.body.bio}
  }, {
    sort: {_id: 1},
    upsert: false
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
    res.redirect('/profile')
})


app.post('/profilePic', upload.single('file-to-upload'), (req, res, next) => {
  let userPage = req.headers.referer
  let uId = ObjectId(req.session.passport.user)
  let userEmail = req.user.local.email
  const profPicture = new ProfilePictures({
    userEmail: userEmail,
    posterId: uId,
    imgPath: 'images/uploads/' + req.file.filename
  })
  profPicture.save()
  .then(picture => {
    console.log(picture)
  })
  res.redirect('/feed')
});

app.get('/pictureEdit', isLoggedIn, function(req, res) {


     res.render('pictureEdit.ejs') });

 app.get('/newBioEdit', isLoggedIn, function(req, res) {


          res.render('newbioedit.ejs') });



//================================Profile picture

app.post('/profilePic', upload.single('file-to-upload'), (req, res, next) => {
  let userPage = req.headers.referer
  let uId = ObjectId(req.session.passport.user)
  let userEmail = req.user.local.email
  const profPicture = new ProfilePictures({
    userEmail: userEmail,
    posterId: uId,
    imgPath: 'images/uploads/' + req.file.filename
  })
  profPicture.save()
  .then(picture => {
    console.log(picture)
  })
  res.redirect(userPage)
});

app.delete('/profilePic', (req, res) => {
  let userPage = req.headers.referer
  let uId = ObjectId(req.session.passport.user)
  db.collection('pictureuploads').findOneAndDelete({posterId: uId}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('THAT HAS BEEN DELETED');
    res.send('Message deleted!')
  })
})


// app.route('/profilePic')
//   .delete((req, res) => deleteAll(req, res))
//   .post(upload.single('file-to-upload'), (req, res, next) => postNew(req, res))
//
// deleteAll = (req, res) => {
//     let uId = ObjectId(req.session.passport.user)
//     db.collection('profilepics')
//     .deleteMany({ posterId: uId }, function(err, result) {
//       if (err) return res.send(500, err)
//       console.log('THAT HAS BEEN DELETED');
//       res.send('Message deleted!')
//     })
//   }
//
//   setTimeout(function() {
// }, 5000);
// postNew = (req, res ) => {
//   let userPage = req.headers.referer
//   let uId = ObjectId(req.session.passport.user)
//   let userEmail = req.user.local.email
//   const profPicture = new ProfilePictures({
//     userEmail: userEmail,
//     posterId: uId,
//     imgPath: 'images/uploads/' + req.file.filename
//   })
//   profPicture.save()
//   .then(picture => {
//     console.log(picture)
//   })
//   res.redirect(userPage)
// }













// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        // app.get('/login', function(req, res) {
        //     res.render('login.ejs', { message: req.flash('loginMessage') });
        // });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/feed', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/firstedit', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
