var fbjsdk = {
	fbready : false,
	authResponse : null,	
	userData : null,
    fbscope : null,
	init : function(options, autoload , callback){
		if (typeof arguments[1] === "function"){
			callback = autoload;
			autoload = true;
		}
		if (fbjsdk.fbready){
			if (autoload && fbjsdk.userData){ fbjsdk.getUserData(callback); return false; }
			fbjsdk.loginFb(callback);
			return false;
		}
		if (!options.appId){ console.error('The appId is requiered'); return false; }
        fbjsdk.scope = options.scope ? options.scope : null;
		window.fbAsyncInit = function() {
			FB.init({
			  appId      : options.appId,
			  channelUrl : options.channelUrl ,
			  status     : true,
			  cookie     : true,
			  xfbml      : true
			});
			fbjsdk.fbready= true;
			if (autoload)
				fbjsdk.loginFb(callback);
			else if(typeof callback === "function")
				callback();
		};
	  
		(function(d, s, id, debug){
			 var locale = options.locale ?  options.locale : 'en_US';
			 var js, fjs = d.getElementsByTagName(s)[0];
			 if (d.getElementById(id)) {return;}
			 js = d.createElement(s); js.id = id;
			 js.src = "//connect.facebook.net/"+locale+"/all" + (debug ? "/debug" : "") + ".js";
			 fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk', options.debug ? true : false));
	},
	loginFb : function(callback){
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				fbjsdk.authResponse = response.authResponse;				
				fbjsdk.getUserData(function(user_data){
					callback(user_data);
				});
			} else {
				FB.login(function(response) {
					if (response.authResponse) {
						fbjsdk.getUserData(function(user_data){
							callback(user_data);							
						});
					} else {					
						callback(response);
					}					
					return false;
				}, {scope : fbjsdk.scope});
			}
		});
	},
	getUserData : function(user_id, callback){
		if (typeof arguments[0] === "function"){
			callback = user_id;
			user_id = 'me';
		}
		if (user_id == 'me' && fbjsdk.userData){
			callback(fbjsdk.userData);
			return false;
		}		
		FB.api('/'+user_id, function(response) {
			fbjsdk.userData = response;
			callback(fbjsdk.userData);
		});			
	},
	getRequests : function(callback){
		FB.api('/me/apprequests/', function(response) {
			callback(response);
			return false;
		});
	},
	deleteRequests : function(callback){
		var deleted_requests = 0;
		fbjsdk.getRequests(function(response){
			if (response.data.length > 0){
				$.each(response.data, function(index, request){
					FB.api('/'+request.id,'DELETE', function(response){ deleted_requests++; });					
				});
				callback(deleted_requests);
			}						
		});
	}	
}