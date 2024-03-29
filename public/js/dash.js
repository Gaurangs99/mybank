$(document).ready(function(){
    $(".button-collapse").sideNav();
    $('.tooltipped').tooltip({delay: 50});
});


var config = {
    apiKey: "AIzaSyAQ5o8MIKnwXM-C16Y3BI-Pqa0fWP9dgJQ",
    authDomain: "qwerty-c6cb6.firebaseapp.com",
    databaseURL: "https://qwerty-c6cb6.firebaseio.com",
    projectId: "qwerty-c6cb6",
    storageBucket: "qwerty-c6cb6.appspot.com",
    messagingSenderId: "140826346163",
    appId: "1:140826346163:web:8f8e63ae246afd38"
  };
firebase.initializeApp(config);  

  // Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

function signout() {
	firebase.auth().signOut().then(function() {
	  // Sign-out successful. 
	  window.location.assign('/');
	})
	.catch(function(error) {
		// An error happened.
		
	});
}

function changePassword() {
    var user = firebase.auth().currentUser;
    console.log(user.email);
    firebase.auth().sendPasswordResetEmail(user.email).then(function() {
        console.log("Email sent.");
        Materialize.toast("An Email  has been sent to you registered email id. Please visit the link and follow the instructions",10000);
      }).catch(function(error) {
        console.log("An error happened.");
    });

    /*
    var op = document.getElementById('oldpassword').value;
    var np = document.getElementById('newpassword').value;
    var cnp = document.getElementById('cnewpassword').value;
    if(np!=cnp) {
        Materialize.toast('New password mismatch',4000);
        return false;
    }
    else  {

    }
    */
}

function changeName() {
    console.log("CHANGE NAME")
    var user = firebase.auth().currentUser;
    var newName = document.getElementById('name').value;
    console.log(newName);
    return db.collection('users').doc(user.uid).update({
        Name:newName
        })
        .then(function(doc) {
            Materialize.toast("Name updated!");
            return true;    
        });
            
}

function deleteUser() {
    var user = firebase.auth().currentUser;
    console.log(user)
    user.delete().then(function() {
        console.log("deleted")
        db.collection('users').doc(user.uid).delete().then(function () {
            Materialize.toast("Account Deleted. Logging you out", 10000);
            setTimeout(function() {
                signout();
            },1000);
        }).catch(function(error) {
            console.log(error);
        });
        
    }).catch(function(error) {
        console.log(error);
        if(error.code == 'auth/requires-recent-login') {
            Materialize.toast("You need to login again before deleting this account", 1000); 
            setTimeout(function() {
                signout();
            },2000);   
        }
    // An error happened.
    });
}

// notification access
    $("#notif").click(function(){
        $.get("/notif", function(data, status){
            if(status == 'success') {
                console.log(data);
                var list ='';
                if(data.length==0) {
                    list = list + '<li><a href="">You have no Notifications</a></li><li class="divider"></li>';
                }
                else {
                    for(var i=0;i<data.length;i++) {
                        var theMessage = '';
                        theMessage = text_truncate(data[i].message,50);
                        if(data[i].read) {
                            var list = list + '<li style="background-color:#eee"><div class="row">\
                                            <div class="col s8">\
                                                <h6  style="margin-bottom:-25px;color: teal">'+data[i].title+'</h6>\
                                                <br><p style="color: teal;font-size:0.9em;padding:5px;margin-bottom:-12px;">'
                                                +data[i].message+'</p>\</div>\
                                                <a class="col s2"  onclick="unreadMessage(\''+data[i].id+'\')"><i class=" material-icons" style="color:black">markunread</i></a>\
                                            <a class="col s2"  onclick="deleteMessage(\''+data[i].id+'\')"><i class=" material-icons" style="color:red">delete</i></a>    \
                                           </div>\
                                           </li>\
                                           <li class="divider"></li>';
                        }else {
                            var list = list + '<li><a onclick="readMessage(\''+data[i].id+'\')"><div class="row">\
                                                <div class="col s10">\
                                                    <h6  style="margin-bottom:-25px;color: teal">'+data[i].title+'</h6>\
                                                    <br><p style="color: teal;font-size:0.9em;padding:5px;margin-bottom:-12px;">'
                                                    +theMessage+'</p>\</div>\
                                                    <a class="col s2"  onclick="deleteMessage(\''+data[i].id+'\')"><i class=" material-icons" style="color:red">delete</i></a>    \
                                            </div></a>\
                                            </li>\
                                            <li class="divider"></li>';
                        }
  
                    }
                }
                //$("#dropdown2").append('<li><a href="">'+data+'</a></li>');
                var content =  '<div id="content">' + list + '</div>'
                $('#content').replaceWith(content)
            }else {
                console.log(data);
            }
            
        });
    });

function readMessage(id) {
    $.post('/messageRead',  {
            id: id
        },function(data, success) {
            console.log("message read")
    })
}

function unreadMessage(id) {
    $.post('/messageUnread',  {
            id: id
        },function(data, success) {

    })
}

function deleteMessage(id) {
    $.post('/messageDelete',  {
            id: id
        },function(data, success) {
            
    })
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      db.collection('users').doc(user.uid).get()
        .then(function(doc) {
            document.getElementById("load").className =
                document.getElementById("load").className.replace(/\bprogress\b/,'');
            console.log(doc.data());
            document.getElementById('name-nav').innerHTML = doc.data().Name;
            document.getElementById('email-nav').innerHTML = doc.data().email;
            document.getElementById('acc-nav').innerHTML = doc.data().accountNo;
            document.getElementById('username-nav').innerHTML = 'Hello ' + doc.data().Name;
            document.getElementById('balance-nav').innerHTML = 'Savings Balance: ' + doc.data().savings.balance + '   Current Balance: ' + doc.data().current.balance;
            if(user.emailVerified) {
                document.getElementById('email-verify').innerHTML = 'Your email is verified. You can acess bank account functions';
            }else {
                document.getElementById('email-verify').innerHTML = 'Your email is <b>not</b> verified. You can not access account functions';           
            }
            
        });
    } else {
        window.location.assign('/');
      // No user is signed in.
    }
  });


  text_truncate = function(str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if(str!=undefined) {
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
    }else {
        return str
    }
  };