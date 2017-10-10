angular.module('starter.services', ['ngResource',  'ngCordova'])
 
.factory('Articles', ['$resource',
	function($resource) {
		var url = "http://localhost:3000/";
		return $resource(url+'articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('Camera', ['$q','$cordovaCamera', function($q, $cordovaCamera) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      $cordovaCamera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
	
  }
}])
.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
		// console.log(response);
      if (response.status === 401) {
        // handle the case where the user is not authenticated
		alert('got 401');
      }
      return response || $q.when(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
})

.factory('Authentication', ['$window','$http', '$q','Mystorage', function($window, $http,$q, Mystorage) {
	var auth = {
		user: $window.user
	};
	
	var settings = {};
	/* down check after 1 hour */
	/* normal check after 1 hour */
	
	var messageset ={
		time:'',
		content: ''
	};
	
	function mylogin()
	{
	  settings = Mystorage.getObject('settings');
	 if(settings.email != null && settings.password != null)
	 {
		 var url =   Mystorage.getObject('myconfig').url;
		  var deferred  = $q.defer();
		            $http.post(url + '/api/login', settings).success(function (response) {
                      
                      $window.sessionStorage.setItem('token', response.token);
                    deferred.resolve(true);
                       
						
                    }).error(function (response) {
                    deferred.reject(false);
                    });

			return deferred.promise;
	 }
	 return false;
	}
	function getmessage()
	{
	  
		 var url =   Mystorage.getObject('myconfig').url;
		//  var deferred  = $q.defer();
		   var promise =         $http.post(url + '/api/measure/getmessage', {}).then(
		   function (response) {
                      
                     // $window.sessionStorage.setItem('token', response.token);
				 alert(angular.toJson(response.data));
         //           deferred.resolve(response);
                       return response;
						
                    },function (response) {
				//		alert(angular.toJson(response ));
                    //deferred.reject(false);
					return response;
                    });

			return promise;
	 
	
	}
	
	
	
	return {
    isloggedin: function() {
     // $window.localStorage[key] = value;
	  if (!$window.sessionStorage.token) {
		 var ret = mylogin();
		 return ret;
		 // alert('notoken');
	  }
	  else {
		  return true;
	  }
    },
	anymessage: function () {
		
	//	var msg = getmessage();
		//alert(msg);
		 // alert(angular.toJson(msg ));
	/*
		  getmessage().$promise.success(function (data) {
		messageset.content = data.messagedata;
		messageset.time = Date.now();
		
		return messageset;
		  },  function(response) {  // error
                   
				   messageset.content = "testing";
				messageset.time = Date.now();
		
		return messageset;
		
					
                }
				);
		*/		
		var msg = getmessage();
		//alert(msg);
		  // alert(angular.toJson(msg ));
		  return msg;
	}
	}
	
	
	//return auth;
}])
.factory('Users', ['$resource', 'Mystorage',
	function($resource, Mystorage) {
	//	var url = "http://localhost:3000/";
	var url =  Mystorage.getObject('myconfig').url;
		return $resource(url+'users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
])

.factory('Mystorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('UserdataService', ['$resource', 'Mystorage',
	function($resource, Mystorage) {
		var url =  Mystorage.getObject('myconfig').url;
		return $resource(url+'/api/userdatas/:userdataId', {
			userdataId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('ObjecttypeService', ['$resource', 'Mystorage',
	function($resource, Mystorage) {
		var url =  Mystorage.getObject('myconfig').url;
		return $resource(url+'/api/objecttype/:objecttypeId', {
			objecttypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('ObjectService', ['$resource', 'Mystorage',
	function($resource, Mystorage) {
		var url =  Mystorage.getObject('myconfig').url;
		return $resource(url+'/api/object/:objectId', {
			objectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])


.factory('DisposetypeService', ['$resource',
	function($resource) {
		var url = "http://localhost:3000/api/";
		return $resource(url+'disposetype/:disposetypeId', {
			disposetypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])

.factory('DisposetypeService1', function($http, $q) {
	 var data1;
        var self = this;
      self.items = {};
	  var url = "http://localhost:3000/api/";
return {
    
	search: function(str) {
      var responsePromise = $http.get(url+"disposetype/mobile/search/" + str);
       
	   return responsePromise;
    }
};
})

.factory('DisposeableService', ['$resource',
	function($resource) {
		var url = "http://localhost:3000/api/";
		return $resource(url+'disposeable/:disposeableId', {
			disposeableId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])

.factory('Objectdata', function() {
	 var data1;
        var self = this;
      self.items = {};
	  var mapitem = {};
	  var mapobject = {};
	  var userdata = {};
	  var connection = {};
	   var interactobject = {};
	   var positionobject={};
	  
	  
  return {
    all: function() {
      return questionlist;
    },
	 
	setinteractobject: function( setobj) {
	 
     interactobject['interactobject'] = setobj;
	 
    },
	getinteractobject: function() {
		var m1 = interactobject['interactobject'];
     return( m1 );
    },
	setpositiondata: function( setobj) {
	 
     positionobject['position'] = setobj;
	 
    },
	getpositiondata: function() {
		var m1 = positionobject['position'];
     return( m1 );
    },
	
	setconnection: function( setobj) {
	 
     connection['connection'] = setobj;
	 
    },
	getconnection: function() {
		var m1 = connection['connection'];
     return( m1 );
    },
	
	setuserdata: function( setobj) {
	 
     userdata['userdata'] = setobj;
	 
    },
	getuserdata: function() {
		var m1 = userdata['userdata'];
     return( m1 );
    },
	
	setmapstorage: function( setobj) {
	 
     mapobject['mapobjects'] = setobj;
	 
    },
	getmapstorage: function() {
		var m1 = mapobject['mapobjects'];
     return( m1 );
    },

	setrecententry: function(setobj) {
     mapitem['recententry'] = setobj;
    },
	getrecententry: function() {
		var m1 = mapitem['recententry'];
     return( m1 );
    },
	
	setitemdata: function(setobj) {
     mapitem['itemdata'] = setobj;
    },
	getitemdata: function() {
		var m1 = mapitem['itemdata'];
     return( m1 );
    },
	
	
    setitem: function(setobj) {
     mapitem = setobj;
    },
	getitem: function(setobj) {
     return(mapitem );
    }
	};
})

	  
.factory('AccountDetail', function($http, $q) {
	 var data1;
        var self = this;
      self.items = {};
	  
  return {
    all: function() {
      return questionlist;
    },
    register: function(registerobj) {
      var responsePromise = $http.post("http://localhost:8888/confapp/register", registerobj, {});
       
	   return responsePromise;
    }
	};
})
	
.factory('ConfAppDetail', function($http, $q) {
	 var data1;
        var self = this;
      self.items = {};
	var url = "http://localhost:8888/confapp/mobile/";  
	var details = {
		home:
		{
	  name: "ABCD company",
	  theme : "img/agile.png",
	  description: "Good company"
  } ,
		venue:{},
		gallery: [],
		notifications:[]
	};
	 var items = {};
    var last_request_failed = true;
	var loaded = false;
    var promise = undefined;
	
  return {
    all: function() {
      return questionlist;
    },
	
	isloaded: function()
	{
		return loaded;
	},
	search: function(str) {
      var responsePromise = $http.get("http://localhost:8888/confapp/mobile/search/" + str);
       
	   return responsePromise;
    },
	
	loadevent: function (id) {
		
            
                promise = $http.get(url + "loadevent/" +id).then(
                function(response) {
                    last_request_failed = false;
                    items = response.data;
					details = items;
					loaded = true;
					/*details.home = items.home;
					details.venue = items.venue;
					details.agenda = items.agenda;
					details.gallery = items.agenda; */
                    return items;
                },function(response) {  // error
                    last_request_failed = true;
					
					
                    $q.reject(response);
					return details;
                });
            
            return promise;
			
	},
	 geteventdetails: function() {
		 if(loaded == true)
		 {
			 return details;
		 }
            if(!promise || last_request_failed) {
                promise = $http.get(url + "geteventdetails").then(
                function(response) {
                    last_request_failed = false;
                    items = response.data;
					details = items;
					loaded = true;
					/*details.home = items.home;
					details.venue = items.venue;
					details.agenda = items.agenda;
					details.gallery = items.agenda; */
                    return items;
                },function(response) {  // error
                    last_request_failed = true;
					
					
                    $q.reject(response);
					return details;
                });
            }
            return promise;
        },
	
   
	gethome: function() {
	 
      return (details.home);
    },
	getagenda: function() {
	  
	  
	return (details.agenda);
      
    },
	
	getvenue: function() {
	
      return (details.venue);
    },
	
    register: function(registerobj) {
		
		
      var responsePromise = $http.post("http://localhost:8888/confapp/register", registerobj, {});
       
	    
	   
	   
	   return responsePromise;
    }
	};
})

	
.factory('QuestionList', function($http, $q) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var questionlist = [{
    id: 0,
    content: 'MQ is availble in cloud.',
    description: 'True or False ? ',
	options : [{option:1, name: 'True' }, {option:2, name: 'False' }],
	type: 'yesno',
    hint: 'http://www.ibm.com'
  }, {
    id: 1,
    content: 'MQ has a feature called managed file transfer, which is useful for banks.',
    description: 'select all the features of managed file transfer. ',
	options : [{option:1, name: 'Secure file transfer' }, {option:2, name: 'File transfer with REDACT feature' }, {option:3, name: 'Auto replication of files' }, {option:4, name: 'Auto reconnect is available' }],
	type: 'multiselect',
    hint: 'http://www.ibm.com'
  },{
    id: 2,
    content: 'CICS is availble on many platforms.',
    description: 'Select one on which CICS is not avilable. ',
    options : [{option:1, name: 'Sequent' }, {option:2, name: 'windows-xp' }, {option:3, name: 'Dos' }, {option:4, name: 'azure' }],
	type: 'multiselectone',
    hint: 'http://www.ibm.com'
  }];

  var data1;
        var self = this;
      self.items = {};
	  
  return {
    all: function() {
      return questionlist;
    },
    remove: function(chat) {
     // chats.splice(chats.indexOf(chat), 1);
    },
	setanswer : function (answerobject){
		 var responsePromise = $http.post("http://localhost:4730/readyapp/question/teama/ramesh", answerobject, {});
       
	   return responsePromise;
	   
	},
	get: function() {
		
		 
		  var responsePromise = $http.get("http://localhost:4730/readyapp/question/teama/ramesh");

		  return responsePromise;
		  /*
              return (  responsePromise.success(function(data, status, headers, config) {
                    // $scope.myData.fromServer = data.title;
					alert (data.content);
					self.items  = data;
					return self.items;
                }));
                responsePromise.error(function(data, status, headers, config) {
                    alert("AJAX failed!");
                });
				
				*/
				//return self.items;
				
				/*
			 var deferred  = $q.defer();
			 
		  $http.get('http://localhost:4730/readyapp/question/teamb/ramesh').then(
            function(response) {
				
          data1 = response.data;
		  alert(data1.content);
		//  return data1;
		deferred.resolve(response.data);
		 //return (response.data);
		  
		  
        }, function(errResponse) {
          console.error('Error while fetching notes');
		  deferred.reject(errResponse);
		   
        });
		 
		// return dat1;
		   return deferred.promise;
	//	return (questionlist[0]);
       //  return null; */
    },
    get1: function(questionId) {
		
				
       for (var i = 0; i < questionlist.length; i++) {
        if (questionlist[i].id === parseInt(questionId)) {
          return questionlist[i];
        }
      } 
      return null;
    }
  };
})


.factory('ProductStatus', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var status = [{
    id: 0,
    content: 'MQ is availble in cloud.',
    description: 'MQ is available in azure, amazon and other cloud environment. ',
    reference: 'http://www.ibm.com'
  }, {
    id: 1,
    content: 'MQ has a feature called managed transfer, which is useful for banks.',
    description: 'managed file transfer is useful for effecient, secure transfer of files in banking industry. ',
    reference: 'http://www.ibm.com'
  },{
    id: 2,
    content: 'CICS is availble in cloud.',
    description: 'CICS is available in azure, amazon and other cloud environment. ',
    reference: 'http://www.ibm.com'
  }, {
    id: 3,
    content: 'Message broker is availble in cloud.',
    description: 'Message broker is available in azure, amazon and other cloud environment. ',
    reference: 'http://www.ibm.com'
  }, {
    id: 4,
    content: 'MQlight is an offering on cloud.',
    description: 'MQlight is available in azure, amazon and other cloud environment. ',
    reference: 'http://www.ibm.com'
  }];

  return {
    all: function() {
      return status;
    },
    remove: function(chat) {
     // chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      /* for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      } */
      return null;
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
