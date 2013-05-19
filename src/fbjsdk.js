var fbjsdk = {
    fbscope: null,
    fbready: false,
    authResponse: null,
    userData: null,
    init: function (options, autoload, callback) {
        if (typeof arguments[1] === "function") {
            callback = autoload;
            autoload = true;
        }
        if (this.fbready) {
            if (autoload && this.userData) {
                this.getUserData(callback);
                return false;
            }
            this.loginFb(callback);
            return false;
        }
        if (!options.appId) {
            console.error('The appId is requiered');
            return false;
        }
        this.fbscope = options.scope ? options.scope : null;
        window.fbAsyncInit = function () {
            FB.init({
                appId: options.appId,
                channelUrl: options.channelUrl,
                status: options.status ? options.status : true,
                cookie: options.cookie ? options.cookie : true,
                xfbml: options.xfbml ? options.xfbml : true
            });
            this.fbready = true;
            if (autoload) this.loginFb(callback);
            else if (typeof callback === "function") callback();
        };

        (function (d, s, id, debug) {
            var locale = options.locale ? options.locale : 'en_US';
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/" + locale + "/all" + (debug ? "/debug" : "") + ".js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk', options.debug ? true : false));
    },
    loginFb: function (callback) {
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                this.authResponse = response.authResponse;
                this.getUserData(function (user_data) {
                    callback(user_data);
                });
            } else {
                FB.login(function (response) {
                    if (response.authResponse) {
                        this.getUserData(function (user_data) {
                            callback(user_data);
                        });
                    } else {
                        callback(response);
                    }
                    return false;
                }, {
                    scope: this.fbscope
                });
            }
        });
    },
    getUserData: function (user_id, callback) {
        if (typeof arguments[0] === "function") {
            callback = user_id;
            user_id = 'me';
        }
        if (user_id == 'me' && this.userData) {
            callback(this.userData);
            return false;
        }
        FB.api('/' + user_id, function (response) {
            this.userData = response;
            callback(this.userData);
        });
    },
    getRequests: function (callback) {
        FB.api('/me/apprequests/', function (response) {
            callback(response);
            return false;
        });
    },
    deleteRequests: function (callback) {
        var deleted_requests = 0;
        this.getRequests(function (response) {
            if (response.data.length > 0) {
                $.each(response.data, function (index, request) {
                    FB.api('/' + request.id, 'DELETE', function (response) {
                        deleted_requests++;
                    });
                });
                callback(deleted_requests);
            }
        });
    },
    loginButtonResponse : function(callback){
        FB.Event.subscribe('auth.authResponseChange', function(response) {
            if (response.status === 'connected') {
                fbjsdk.getUserData(callback);
            }
        });
    },
    likeResponse : function(callback){
        FB.Event.subscribe('edge.create', callback);
    },
    unlikeResponse : function(callback){
        FB.Event.subscribe('edge.remove', callback);
    }
};