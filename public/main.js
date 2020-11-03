var thumbUp = document.getElementsByClassName("thumbsUp");
var trash = document.getElementsByClassName("postTrash");
var commentTrash = document.getElementsByClassName("commentTrash");
var edit = document.getElementById("bio");
var submitEdit = document.querySelector(".submit")
let trashy = document.getElementsByClassName('trashy')
let accept = document.getElementsByClassName('accept')
let done = document.getElementsByClassName('done')
let yes = document.getElementsByClassName('yes')
let no = document.getElementsByClassName('no')
let notHelpfulDelete = document.getElementsByClassName('notHelpfulDelete')
let love = document.getElementsByClassName('love')
let loveDelete = document.getElementsByClassName('loveDelete')
let deletePic = document.getElementById('deletePic')
let deleteBio = document.getElementById('deleteBio')



Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const caption = this.parentNode.parentNode.childNodes[5].innerText
        let _id = this.parentNode.childNodes[9].dataset.id
        const likes = parseFloat(this.parentNode.childNodes[1].innerText)

        if(likes < 1){
        fetch('likePicture', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            '_id' : _id,
            'caption' : caption,
            'likes' : likes
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
      .then(data => {
          window.location.reload(true)
        })
      }
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        let _id = this.getAttribute('id')

        fetch('deletePost', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            '_id': _id
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


Array.from(commentTrash).forEach(function(element) {
      element.addEventListener('click', function(){
        const _id = this.getAttribute('id')
        console.log('HEYYYYYY', _id);

        fetch('deleteComment', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            '_id': _id
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

  let replyButton = document.getElementById('replyButton')
  let deleteMessage = document.getElementById('deleteMessage')

  replyButton.addEventListener('click', () => {
    fetch('deleteMessage', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        senderId: recieverId,
        message: req.body.thisMessage
      })
    }).then(function (response) {
      window.location.reload()
    })
    })

//==========================Delete requests

// function deleteOne (){
//         const ids = this.parentNode.childNodes[1].getAttribute('id')
//         console.log('THIS CLICKS', ids)
//         fetch('deleteReq', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           }, //headers
//           body: JSON.stringify({
//             '_id' : ids
//           }) //stringify
//         }//fetch {}
//       ) //fetch ()
//       .then(function (response) {
//           window.location.reload()
//         }) //.then
//       } //deleteOne

      Array.from(trashy).forEach(function(element) {
            element.addEventListener('click', function(){
              const ids = this.getAttribute('id')
              console.log('THIS CLICKS', ids)
              fetch('deleteReq', {
                method: 'delete',
                headers: {
                  'Content-Type': 'application/json'
                }, //headers
                body: JSON.stringify({
                  '_id' : ids
                }) //stringify
              }//fetch {}
            ) //fetch ()
            .then(function (response) {
                window.location.reload()
              }) //.then
            });
      });

 //=========accept requests


         Array.from(accept).forEach(function(element) {
               element.addEventListener('click', function(){
                 const ids = this.getAttribute('id')
                 console.log('THIS HAS BEEN ACCEPTED', ids)
                 fetch('acceptReq', {
                   method: 'put',
                   headers: {
                     'Content-Type': 'application/json'
                   }, //headers
                   body: JSON.stringify({
                     '_id' : ids
                   }) //stringify
                 }//fetch {}
               ) //fetch ()
               .then(function (response) {
                   window.location.reload()
                 }) //.then
               });
         });

         //==========================says it was replied

         Array.from(done).forEach(function(element) {
               element.addEventListener('click', function(){
                 const ids = this.getAttribute('id')
                 console.log('THIS HAS BEEN ACCEPTED', ids)
                 fetch('test', {
                   method: 'put',
                   headers: {
                     'Content-Type': 'application/json'
                   }, //headers
                   body: JSON.stringify({
                     '_id' : ids
                   }) //stringify
                 }//fetch {}
               ) //fetch ()
               .then(function (response) {
                   window.location.reload()
                 }) //.then
               });
         });
//=================Measure helpfulness
Array.from(yes).forEach(function(element) {
      element.addEventListener('click', function(){
        const ids = this.getAttribute('id')
        console.log('THIS HAS BEEN HELPFUL', ids)
        fetch('helpful', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          }, //headers
          body: JSON.stringify({
            '_id' : ids
          }) //stringify
        }//fetch {}
      ) //fetch ()
      .then(function (response) {
          window.location.reload()
        }) //.then
      });
});


Array.from(no).forEach(function(element) {
      element.addEventListener('click', function(){
        const ids = this.getAttribute('id')
        console.log('THIS HAS Not BEEN HELPFUL', ids)
        fetch('notHelpful', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          }, //headers
          body: JSON.stringify({
            '_id' : ids
          }) //stringify
        }//fetch {}
      ) //fetch ()
      .then(function (response) {
          window.location.reload()
        }) //.then
      });
});

Array.from(notHelpfulDelete).forEach(function(element) {
      element.addEventListener('click', function(){
        const ids = this.getAttribute('id')
        console.log('THIS HAS Not BEEN HELPFUL', ids)
        fetch('notHelpfulDelete', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          }, //headers
          body: JSON.stringify({
            '_id' : ids
          }) //stringify
        }//fetch {}
      ) //fetch ()
      .then(function (response) {
          window.location.reload()
        }) //.then
      });
});

Array.from(love).forEach(function(element) {
      element.addEventListener('click', function(){
        const ids = this.getAttribute('id')
        console.log('THIS HAS Not BEEN HELPFUL', ids)
        fetch('love', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          }, //headers
          body: JSON.stringify({
            '_id' : ids
          }) //stringify
        }//fetch {}
      ) //fetch ()
      .then(function (response) {
          window.location.reload()
        }) //.then
      });
});

Array.from(loveDelete).forEach(function(element) {
      element.addEventListener('click', function(){
        const ids = this.getAttribute('id')
        console.log('THIS HAS Not BEEN HELPFUL', ids)
        fetch('loveDelete', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          }, //headers
          body: JSON.stringify({
            '_id' : ids
          }) //stringify
        }//fetch {}
      ) //fetch ()
      .then(function (response) {
          window.location.reload()
        }) //.then
      });
});

Array.from(love).forEach(function(element) {
      element.addEventListener('click', function(){
        const ids = this.getAttribute('id')
        console.log('THIS IS FOR LOVE', ids)
        fetch('putLove', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          }, //headers
          body: JSON.stringify({
            'sendId' : ids
          }) //stringify
        }//fetch {}
      ) //fetch ()
      .then(function (response) {
          window.location.reload()
        }) //.then
      });
});

Array.from(submitBtn).forEach(function(element) {
      element.addEventListener('click', function(){
        const imgPath = this.parentNode
        console.log('THIS IS FOR LOVE', imgPath)
        fetch('profilePic', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          }, //headers
          body: JSON.stringify({
            'imgPath' : imgPath
          }) //stringify
        }//fetch {}
      ) //fetch ()
      .then(function (response) {
          window.location.reload()
        }) //.then
      });
});

Array.from(deletePic).forEach(function(element) {
      element.addEventListener('click', function(){
        const ids = this.getAttribute('class')
        console.log('THIS CLICKS', ids)
        fetch('deletePic', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          }, //headers
          body: JSON.stringify({
            '_id' : ids
          }) //stringify
        }//fetch {}
      ) //fetch ()
      .then(function (response) {
          window.location.reload()
        }) //.then
      });
});
