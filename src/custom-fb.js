//this will get a value if the response.status is connected
var myAccessToken = '';


  	//Bálint appID: 1804086756332445
	//Aztamindenitneki appId 126818527474122
	//Samsung TV 156122217846925
	var myAppId='126818527474122';
	
	
//share doesn't work from localhost
//response will return empty array if login didn't scope with 'publish_actions' or the user didn't log in to the app
  function customshare() {		    
   FB.ui({
    method: 'share_open_graph',
    action_type: 'og.shares',
    action_properties: JSON.stringify({
        object : {
           'og:url': 'https://github.io/fbml', 
           'og:title': 'Here my custom title',
           'og:description': 'here custom description'
        }
		    })
}, function(response){
  // Debug response (optional)
  console.log(response);
  console.log('console log');
});
    }
	
    function init() {
        FB.api(
          '/l214.animaux',
          {"fields":"fan_count"},
          function(response) {
            alert(response.fan_count);
          }
        );
    }
	
	  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
	  // Change the profile picture and the profile name in the navbar to the user's
      connectedFB();
	  myAccessToken=response.authResponse.accessToken;

	  
	  /* we don't call the testAPI function here,
	     that list the users data to the 'status' div
		 because the status div is in the profile.html
		 and that div will be reachable only if that html is loaded
	  */
	  
    } else {
      // The person is not logged into your app or we are unable to tell.
	  // Change the profile picture and the profile name in the navbar to default
      notconnectedFB();
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
  
    window.fbAsyncInit = function() {
      FB.init({
        appId      : myAppId,
        xfbml      : true,
        version    : 'v3.0'
      });
	  
      //custom-share();
	  //init();
	  
	  
  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
    
	};
/*	
	  // Load the SDK asynchronously
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/all.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
*/
	
//<div id="fb-root"></div>
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/hu_HU/sdk.js#xfbml=1&version=v3.0&appId=' +myAppId+'&autoLogAppEvents=1';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
	
  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function connectedFB() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
	    document.getElementById('profilename').innerText = ' ' + (response.name).split(" ").splice(-1) + ' ';
	    document.getElementById('profilepicture').innerHTML = 
		    '<img src="https://graph.facebook.com/' + response.id + '/picture" class="img-circle special-img" height="30" />';
    });
  }
  function notconnectedFB() {
	    document.getElementById('profilename').innerText = ' ' + 'Profile' + ' ';
	    document.getElementById('profilepicture').innerHTML = 
		    '<img src="img/profilepicture.png" class="img-circle special-img" height="30" />';
  }
  

//check the permissions get from the user  
function permStatus(){
//window.alert('permissions');
        FB.api('/me/permissions', function (response) {
			var perms2 = 'Permissions: <br />';
			for(var i =0; i < response.data.length; i++){
			perms2 += response.data[i].permission;
			perms2 += ': \t';
			perms2 += response.data[i].status;
			perms2 += '  <br/>   '; 
			}
			document.getElementById('perm').innerHTML = perms2;
        } );
}  
	
	
  
/*
Functions wrote by Bálint
*/

  // Adataidat keresi ki és ezeket továbbítja a userData függvénynek response formában
  function testAPI() {
    FB.api('/me?fields=name,email,location,birthday,gender,hometown,about,education', function(response) {
        if (response && !response.error) {
            userData(response);
          }
      });
    }
	
/* Ez egy kurva jó függvény ami olyan többként funkciónál amit egy az egyben ki lehet íratni a status div-re */
  function userData(user){
    let profile = `
      <ul>
        <li>  name:   ${user.name} </li>
		
        <li>  Profile picture:  <img src="https://graph.facebook.com/${user.id}" /> </li>
		<li>  Email address:   ${user.email}  </li>
		
        <li>  birthday:  ${user.birthday} </li>
        <li>  about me:  ${user.about} </li>
        <li>  University:  ${JSON.stringify(user.education)} </li>

    </ul>`;
	
	//var profile =  'Hibakeresés idejére kiiktatva';
    document.getElementById('status').innerHTML = profile;

  }


  // Amiket like-oltál facebookon, azokat listázza ki
  function myFavorites(){
	  /*
	  Graph explorer queries
	  v2.12 --> me/likes?fields=name,events{start_time,end_time,attending_count,name}
	  v2.5  --> me/likes?fields=name,events{start_time,end_time,attending_count,name}
	  next page: 935825559803267/likes?pretty=0&limit=25&after=NDgzNjA2OTM1MTQ5MDg0
	  */
      //FB.api("/me?fields=likes{name,events{name}}",
  FB.api('/me?fields=name,likes{name, events}',
          function (response) {
            if (response && !response.error) {
				console.log('myFavorites-ra kapott response: ');
                console.log(response);
                favoriteData(response);
            }else{document.getElementById('favorites').innerHTML += JSON.stringify(response.error);}
          }
      );
    }  
	
  // Ugyan úgy for ciklusban egy stringhez fűzzük az adatokat.
  function favoriteData(favorites){

  var myObject = JSON.stringify(favorites);
  var s = 'Fejlesztés alatt';
  s+=myObject;
  console.log('A favorites object tartalma: ');
  console.log(favorites);
  s+=JSON.stringify(favorites);
  /*    
	let s = ' ';
        s += `<ul>`;
        for (var i = 0; i < favorites.likes.data.length; i++) {
            s += `<li> ${favorites.likes.data[i].name} </li></br>`;
            try {
              for (var j = 0; j < favorites.likes.data[i].events.data.length; j++) {
                  s += `<b> ${favorites.likes.data[i].events.data[j].name} </b> </br>`;
              }
            } catch(e){
                s += "<b>Ehhez az oldalhoz nem tartoznak események </b></br>";
            }
      }
      s+= '</ul>';
	  */
        document.getElementById('favorites').innerHTML = s;
  }	
	

  // Események lekérdezése.
  function myEvents(){
    FB.api('/me?fields=events{name,place,start_time,end_time,description,attending_count,interested_count,picture}',  /* picture.type(large) */
        function (response) {
          if (response && !response.error) {
			  //console.log('myEvents response:');
              //console.log(response);
              //eventsData(response);
			  showMyEvent(response);

          }else{events2 = response.error;
		  showMyEvent(response.error); }//else
								
						
        }// function response
    ); //FB.api
	
	/*
	 * If we return a variable there, it will returned before
	 * the variable would be overwritten in the if-statement 
	*/
  } // function myEvents
  
 
function showMyEvent(events){
	
//	window.alert('showSignedEvents called' + JSON.stringify(events.events.data[0].name) );
	
			//document.getElementById('showMyEvents').innerHTML=` `;
			//document.getElementById('showMyEvents').innerHTML+=JSON.stringify(events.events.data[0].picture);
			
			console.log(events.events.data);


//Before the for loop, delete the markershtml array
markershtml=[];	
				
			
for (var i = 0; i < events.events.data.length; i++) {

			try{
				photoreference=events.events.data[i].picture.data.url;
			}catch(err) { 
			  //photoreference='https://cdn.browshot.com/static/images/not-found.png'; 
			  photoreference = 'http://graph.facebook.com/'+events.events.data[i].id+'/picture'; 

			} //catch


			try{
				lat = events.events.data[i].place.location.latitude;
				lng = events.events.data[i].place.location.longitude;
			}catch(err) { 
			  lat = '0';
			  lng = '0';
			} //catch


//Adding the datas to the markershtml array
markershtml.push( { Lat: lat, Lng: lng, name: events.events.data[i].name, img: photoreference  });	
	
	
		document.getElementById('showMyEvents').innerHTML+=`
		
					<li>
						
						<div class="thumb" style="background-image: url(`+photoreference+`); background-repeat: no-repeat; background-size: cover; background-position: center;" >
						
						<span class="bottom_date" style="background-color: green; color: white;">`+events.events.data[i].start_time.substring(0, 10)+`</span>
						</div>
												
						<div class="info">
							<h2 class="title">`+events.events.data[i].name+`</h2>
							<p class="desc">`+events.events.data[i].place.name+`<br/>
							</p>
							<ul>								
								<li style="width:33%; color: green;"  onclick="toogleBounds(`+lat+`, `+lng+`)" ><span class="glyphicon glyphicon-map-marker" ></span></li>
								<li style="width:33%; color: green;" class="fa fa-info" data-toggle="modal" data-target="#placeDetailsModal" onclick="listPlaceDetails('`+placeId+`')" ><span  ></span></li>
								<li style="width:33%; color: green;"  onclick="window.alert('Fejlesztés alatt!')" ><span class="fa fa-location-arrow"> `+distance+` m</span></li>
							</ul>
						</div>
					</li> `;
}//for				
			
/*
After the for loop, place the html markers
*/
markershtmlCreate();
	
}//  function showMyEvent
	
  
  
  
  
// Eseményeket hzzáfűzzük egy stringhez és majd azt írjatjuk ki.
  function eventsData(events){
    let s = ' ';
    for (let i in events.events.data) {

          s += `<ul>
                  <li><b>Neve:</b> ${events.events.data[i].name} </li>
                  <b>ID:</b> ${events.events.data[i].id} </br>
                  <b>Hol:</b> ${events.events.data[i].place.name} </br>
                  <b>Mikortól:</b> ${events.events.data[i].start_time} </br>
                  <b>Meddig:</b> ${events.events.data[i].end_time} </br>
                  <b>Leírás:</b> ${events.events.data[i].description} </br>
                  <b><u>Egyéb leírások:</u></b> </br>
                  <b>Résztvevők száma:</b> ${events.events.data[i].attending_count} </br>
                  <b>Érdeklődök száma:</b> ${events.events.data[i].interested_count} </br>
                  <b>Esemény képe:</b> <img src="${events.events.data[i].picture.data.url}" /> </br>
               </ul>
                <hr size="2">`;

    }
      document.getElementById('events').innerHTML = s;
  } //function eventsData
  
  
  
  

  // Helyek keresése
  function placesFB(){
    FB.api('/search?q=*&type=place&center='+myLocation.lat+','+myLocation.lng+'&distance=5000&fields=name,category,location,picture.type(large)',  
        function (response) {
          if (response && !response.error) {
			  //console.log('myEvents response:');
              //console.log(response);
              //eventsData(response);
			  showPlacesFB(response);

          }else{events2 = response.error;
		  showPlacesFB(response.error); }//else
								
						
        }// function response
    ); //FB.api
	
	/*
	 * If we return a variable there, it will returned before
	 * the variable would be overwritten in the if-statement 
	*/
	
  } // function placesFB
  
 
function showPlacesFB(places){

let s =' ';

	
for (var i = 0; i < places.data.length; i++) {

			try{
				photoreference= places.data[i].picture.data.url;
			}catch(err) { 
			  //photoreference='https://cdn.browshot.com/static/images/not-found.png'; 
			  photoreference = 'http://graph.facebook.com/'+events.events.data[i].id+'/picture'; 

			} //catch


			try{
				lat = places.data[i].location.latitude;
				lng = places.data[i].location.longitude;
			}catch(err) { 
			  lat = '0';
			  lng = '0';
			} //catch
			
			try{
				if(places.data[i].location.street != undefined){
				address=places.data[i].location.city + ', ' + places.data[i].location.street;
				}else{address=places.data[i].location.city;}
			}catch(err) { 
			  address= '-';
			} //catch

distance = (haversineDistance(lat, lng, myLocation.lat, myLocation.lng)*1000).toFixed(0);
			
//Adding the datas to the markershtml array
markershtml.push( { Lat: lat, Lng: lng, name: places.data[i].name, img: photoreference  });	
	
	
photoreference = places.data[i].picture.data.url;
		document.getElementById('placesFB').innerHTML+=`
		
					<li>
						
						<div class="thumb" style="background-image: url(`+photoreference+`); background-repeat: no-repeat; background-size: cover; background-position: center;" >
						
						<span class="bottom_date" style="background-color: green; color: white;">`+places.data[i].name+`</span>
						</div>
												
						<div class="info">
							<h2 class="title">`+places.data[i].name+`</h2>
							<p class="desc">`+address+`<br/>
							</p>
							<ul>								
								<li style="width:33%; color: green;"  onclick="toogleBounds(`+lat+`, `+lng+`)" ><span class="glyphicon glyphicon-map-marker" ></span></li>
								<li style="width:33%; color: green;" class="fa fa-info" data-toggle="modal" data-target="#placeDetailsModal" onclick="listPlaceDetails('`+placeId+`')" ><span  ></span></li>
								<li style="width:33%; color: green;"  onclick="window.open('https://www.google.com/maps/dir/?api=1&origin=`+myLocation.lat+`,`+myLocation.lng+`&destination=`+lat+`,`+lng+`&travelmode=walking')" ><span class="fa fa-location-arrow"> `+distance+` m</span></li>
							</ul>
						</div>
					</li> `;
}//for

		
/*
After the for loop, place the html markers
*/
markershtmlCreate();

s+= places.data[0].name;
document.getElementById('places_fb').innerHTML += JSON.stringify(myLocation);


//Before the for loop, delete the markershtml array
markershtml=[];	
	
	
/*			
for (var i = 0; i < places.data.length; i++) {




//Adding the datas to the markershtml array
markershtml.push( { Lat: lat, Lng: lng, name: events.events.data[i].name, img: photoreference  });	
	
	
}//for	
*/
	
 } //showPlacesFB
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	