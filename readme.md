Fbjsdk (V. 0.1 Beta)
==========================

Fbjsdk it's a small Javascript library which simplifies the use of the Facebook Javascript SDK.

Features
-----

* Easy load and initialization of the Facebook Javascript SDK.
* User data and authResponse cache
* Methods for get and delete requests
* More methods to come

Basic Usage
-----

First you need to include the library after the opening <body> tag as follow:
  
	<div id="fb-root"></div>
	<script src="fbjsdk.min.js"></script>	

The Basic usage of the library is:

	fbjsdk.init({appId : 'YOUR_APP_ID', channelUrl : 'YOUR_CHANNEL_URL'}, function(response){
		// Additional FB code goes here
		//The response have the user data if the login it's correct or the error description if something fails
	}); 

Methods
-----

###init
	
	fbjsdk.init({appId : 'YOUR_APP_ID', channelUrl : 'YOUR_CHANNEL_URL}, function(response){
		// Additional FB code goes here
		//The response have the user data if the login it's correct
	});	

The init method have the follow parameter

* opts => Object (Requiered) => Object with the option for initialization. The available options are:
	* appID => String (requiered) => Your App ID
	* channelURL => String (optional) => The URL for your channel file
	* locale => String (optional) => The localization to load. for default loads 'en_US' localization
	* debug => Boolean (optional) => Load the Javascript SKD in debug mode. The default value is false.
* autologin	=> Boolean (optional) => If is true will do the user login after the load. The default value is true.
* callback	=>	Function (requiered) => The fuction to call when the Facebook Javascript SKD is ready to use.

Check this [XML file](https://www.facebook.com/translations/FacebookLocales.xml) to see the list of supported locales.
	
###loginFb
Check if the user is logged in and have the permissions for your app for the permission request.

	fbjsdk.init({appId : 'YOUR_APP_ID', channelUrl : 'YOUR_CHANNEL_URL'}, false, function(response){
		fbjsdk.loginFb(function(user_data){
			console.log('Hello '+user_data.name);			
		});
	});
No parameters
	
###getUserData
Get a user info.	

	fbjsdk.init({appId : 'YOUR_APP_ID', channelUrl : 'YOUR_CHANNEL_URL'}, function(response){
		fbjsdk.getUserData(userId, function(user_data){
			console.log('Hello '+user_data.name);			
		});
	});

Parameter:

* userId => String (Optional) => The ID of the user to get the data. If not ID is passed get the data of the current user.

###getRequests
Get all the requests of the current user
	
	fbjsdk.init({appId : 'YOUR_APP_ID', channelUrl : 'YOUR_CHANNEL_URL'}, function(response){
		fbjsdk.getRequests(userId, function(response){
			console.log('You have the following requests '+response);
		});
	});
  
No Parameters
	
	
###deleteRequests	
Delete all the requests of the current user.

	fbjsdk.init({appId : 'YOUR_APP_ID', channelUrl : 'YOUR_CHANNEL_URL'}, function(response){
		fbjsdk.deleteRequests(function(response){
			console.log('Number of deleted requests: '+response);
		});
	});
  
No Parameters

Don't forget to see the [examples][1]

Links
===============
[Facebook Developers](http://developers.facebook.com/)

[Facebook Javascript SKD](http://developers.facebook.com/docs/reference/javascript/)

[1]: https://github.com/otorcatf/fbjsdk/tree/master/examples