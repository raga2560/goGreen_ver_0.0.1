angular.module('starter.oldcontrollers', ['ngMap', 'ngCordova'])
 
         .controller('GalleryPlusCtrl', function ($scope, $stateParams, ConfAppDetail, $ionicModal) {


            $scope.details = {};
            $scope.images = [];
            $scope.loadImages1 = function () {


                for (var i = 0; i < $scope.details.gallery.length; i++) {
                    $scope.images.push({id: i, src: $scope.details.gallery[i].image});
                }

            };



            // always we use geteventdetails() to reduce number of network calls.
            var promiseOrData = ConfAppDetail.geteventdetails();

            if (typeof promiseOrData.then == 'function')
            {
                promiseOrData.then(function (data) {

                    $scope.details = data;

                    $scope.loadImages1();


                },
                        function (data) {

                            $scope.details = data;
                            $scope.loadImages1();

                            console.log(data)
                        });
            } else
            {

                $scope.details = promiseOrData;
                $scope.loadImages1();

            }

            // alert(angular.toJson($scope.details, true));







            $scope.showImages = function (index) {
                $scope.activeSlide = index;
                $scope.imageSrc = $scope.images[index].src; // "img/agile.png"; //
                $scope.showModal('templates/image-popover.html');
            }

            $scope.showModal = function (templateUrl) {
                $ionicModal.fromTemplateUrl(templateUrl, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            }

            // Close the modal
            $scope.closeModal = function () {
                $scope.modal.hide();
                $scope.modal.remove()
            };




        })

        .controller('NotificationPlusCtrl', function ($scope, $stateParams, ConfAppDetail, $ionicModal) {


            $scope.details = {};
            $scope.notificationlists = [
            ];


            $scope.loadnotifications = function () {


                for (var i = 0; i < $scope.details.notifications.length; i++) {
                    $scope.notificationlists.push({id: i, src: $scope.details.notifications[i].image,
                        title: $scope.details.notifications[i].title,
                        description: $scope.details.notifications[i].description});
                }

            }



            // always we use geteventdetails() to reduce number of network calls.
            var promiseOrData = ConfAppDetail.geteventdetails();

            if (typeof promiseOrData.then == 'function')
            {
                promiseOrData.then(function (data) {

                    $scope.details = data;

                    $scope.loadnotifications();

                },
                        function (data) {

                            $scope.details = data;

                            $scope.loadnotifications();
                            console.log(data)
                        });
            } else
            {

                $scope.details = promiseOrData;

                $scope.loadnotifications();
            }

            // alert(angular.toJson($scope.details, true));

            $scope.notification = $scope.notificationlists[$stateParams.notificationId];



        })


		.controller('SearchPlusCtrl', function ($scope, $stateParams, $state, ConfAppDetail, $ionicModal) {

            $scope.searchstr = "";
            $scope.users = [
            ];


            $scope.getUsersByName = function (str) {
                return $scope.users;
            };
            $scope.changefun = function (str)
            {
                if (str.length > 0) {
                    //alert(str);
                    updateresults(str);

                }
            }
            function updateresults(str)
            {
                var promise = ConfAppDetail.search(str);

                promise.success(function (data) {
                    $scope.users = data;
                });

                promise.error(function (data) {

                });




            }
            $scope.selectevent = function (id)
            {
                //  alert(ab);
                var promiseOrData = ConfAppDetail.loadevent(id);
                promiseOrData.then(function (data) {
                    //$scope.users = data;
                    $state.go('app.home');
                });
            }



        })
		 .controller('DisposeableController', ['$scope', '$stateParams', '$location', 'Authentication', 'DisposeableService',
            function ($scope, $stateParams, $location, Authentication, DisposeableService) {
                $scope.authentication = Authentication;

                // Create new Article
                $scope.create = function () {
                    // Create new Article object
                    var article = new DisposeableService({
                        item: this.item,
                        desc: this.desc,
                    });

                    // Redirect after save
                    article.$save(function (response) {
                        $location.path('disposeable/' + response._id);

                        // Clear form fields
                        $scope.title = '';
                        $scope.content = '';
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };

                // Remove existing Article
                $scope.remove = function (article) {
                    if (article) {
                        article.$remove();

                        for (var i in $scope.articles) {
                            if ($scope.articles[i] === article) {
                                $scope.articles.splice(i, 1);
                            }
                        }
                    } else {
                        $scope.article.$remove(function () {
                            $location.path('disposeable');
                        });
                    }
                };

                // Update existing Article
                $scope.update = function () {
                    var article = $scope.article;

                    article.$update(function () {
                        $location.path('disposeable/' + article._id);
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };

                // Find a list of Articles
                $scope.find = function () {
                    $scope.articles = DisposeableService.query();
                };

                // Find existing Article
                $scope.findOne = function () {
                    $scope.article = DisposeableService.get({
                        disposeableId: $stateParams.disposeableId
                    });
                };
            }
        ])


        .controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Articles',
            function ($scope, $stateParams, $location, Articles) {
                //	$scope.authentication = Authentication;

                // Create new Article
                $scope.create = function () {
                    // Create new Article object
                    var article = new Articles({
                        title: this.title,
                        content: this.content
                    });

                    // Redirect after save
                    article.$save(function (response) {
                        $location.path('articles/' + response._id);

                        // Clear form fields
                        $scope.title = '';
                        $scope.content = '';
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };

                // Remove existing Article
                $scope.remove = function (article) {
                    if (article) {
                        article.$remove();

                        for (var i in $scope.articles) {
                            if ($scope.articles[i] === article) {
                                $scope.articles.splice(i, 1);
                            }
                        }
                    } else {
                        $scope.article.$remove(function () {
                            $location.path('articles');
                        });
                    }
                };

                // Update existing Article
                $scope.update = function () {
                    var article = $scope.article;

                    article.$update(function () {
                        $location.path('articles/' + article._id);
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };

                // Find a list of Articles
                $scope.find = function () {
                    $scope.articles = Articles.query();
                };

                // Find existing Article
                $scope.findOne = function () {
                    $scope.article = Articles.get({
                        articleId: $stateParams.articleId
                    });
                };
            }
        ])

		.controller('DisposetypeController', ['$scope', '$stateParams', '$location', 'Authentication', 'DisposetypeService',
            function ($scope, $stateParams, $location, Authentication, DisposetypeService) {
                $scope.authentication = Authentication;

                // Create new Article
                $scope.create = function () {
                    // Create new Article object
                    var article = new DisposetypeService({
                        item: this.item,
                        desc: this.desc,
                    });

                    // Redirect after save
                    article.$save(function (response) {
                        $location.path('disposetype/' + response._id);

                        // Clear form fields
                        $scope.title = '';
                        $scope.content = '';
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };

                // Remove existing Article
                $scope.remove = function (article) {
                    if (article) {
                        article.$remove();

                        for (var i in $scope.articles) {
                            if ($scope.articles[i] === article) {
                                $scope.articles.splice(i, 1);
                            }
                        }
                    } else {
                        $scope.article.$remove(function () {
                            $location.path('disposetype');
                        });
                    }
                };

                // Update existing Article
                $scope.update = function () {
                    var article = $scope.article;

                    article.$update(function () {
                        $location.path('disposetype/' + article._id);
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };

                // Find a list of Articles
                $scope.find = function () {
                    $scope.articles = DisposetypeService.query();
                };

                // Find existing Article
                $scope.findOne = function () {
                    $scope.article = DisposetypeService.get({
                        disposetypeId: $stateParams.disposetypeId
                    });
                };
            }
        ])
       
	   .controller('MapofDisposable', function ($scope, $http, $timeout) {

//$scope.longitude = 23;
//$scope.latitude = 34;


            var url = "http://localhost:3000/api";

            navigator.geolocation.getCurrentPosition(function (pos) {
                console.log('Got pos', pos);

                //  $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

                //  $scope.loading.hide();
                $scope.longitude = pos.coords.longitude;
                $scope.latitude = pos.coords.latitude;

//$scope.positions = [{lat:24.7699298,lng:35.4469157, desc:"hello"},{lat:25.7699298,lng:35.4469157, desc:"hello1"}];

                $http.get(url + '/disposeable/near?longitude=' + $scope.longitude + '&latitude=' + $scope.latitude).success(function (response) {
                    // If successful we assign the response to the global user model
                    $scope.positions = response;
                    //alert(angular.toJson(response));
                    // And redirect to the index page
                    //$location.path('/');
                }).error(function (response) {
                    //	alert('error');
                    $scope.error = response.message;
                });



            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });




            $scope.myloc = function (id, id1) {
                alert(angular.toJson(id));
                alert(angular.toJson(id1));
            };
            $scope.toggleBounce = function () {
                if (this.getAnimation() != null) {
                    this.setAnimation(null);
                } else {
                    this.setAnimation(google.maps.Animation.BOUNCE);
                }
            };
            var iterator = 0;
            $scope.addMarker = function () {
                for (var i = 0; i < $scope.neighborhoods.length; i++) {
                    $timeout(function () {
                        // add a marker this way does not sync. marker with <marker> tag
                        new google.maps.Marker({
                            position: $scope.neighborhoods[iterator++],
                            map: $scope.map,
                            draggable: false,
                            animation: google.maps.Animation.DROP
                        });
                    }, i * 2);
                }
            }
        })
        

		 .controller('SubmitDisp', function ($scope, $stateParams, $state, DisposetypeService1, DisposetypeService, Authentication, DisposeableService, $ionicModal) {
            //$scope.authentication = Authentication;
			$scope.authentication = Authentication.isloggedin();
            $scope.searchstr = "";
            $scope.items = [
            ];

            $scope.loginData = {};
            $scope.settings = {registered: true};
            $scope.itemdetails = {};

            $scope.getUsersByName = function (str) {
                return $scope.users;
            };
            $scope.changefun = function (str)
            {
                if (str.length > 0) {
                    //alert(str);
                    updateresults(str);

                }
            }
            function updateresults(str)
            {
                var promise = DisposetypeService1.search(str);

                promise.success(function (data) {
                    $scope.items = data;
                });

                promise.error(function (data) {

                });




            }
            $scope.selectevent = function (id)
            {
                //  alert(ab);
                $scope.itemdetails.item = $scope.items[id].item;

                $scope.prompt();

                /*
                 var promiseOrData = ConfAppDetail.loadevent(id);
                 promiseOrData.then(function(data) {
                 //$scope.users = data;
                 //$state.go('app.home');
                 $scope.settings.username = $scope.items[id];
                 
                 $scope.login();
                 }  ); */
            }



            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/submit2.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            // Triggered in the login modal to close it
            $scope.closeprompt = function () {
                $scope.modal.hide();
            };

            // Open the login modal
            $scope.prompt = function () {
                $scope.modal.show();
            };

            // Perform the login action when the user submits the login form
            $scope.submit = function () {
                console.log('Doing login', $scope.loginData);

                navigator.geolocation.getCurrentPosition(function (pos) {
                    console.log('Got pos', pos);

                    //  $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

                    //  $scope.loading.hide();
                    $scope.itemdetails.loc = [pos.coords.latitude, pos.coords.longitude];
                    var article = new DisposeableService($scope.itemdetails);


                    // Redirect after save
                    article.$save(function (response) {
                        //	$location.path('disposeable/' + response._id);

                        // Clear form fields
                        $scope.itemdetails.item = '';
                        $scope.itemdetails.desc = '';
                        $scope.itemdetails.price = '';

                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                        $scope.itemdetails.item = '';
                        $scope.itemdetails.desc = '';
                        $scope.itemdetails.price = '';
                    });


                }, function (error) {
                    alert('Unable to get location: ' + error.message);
                });




                $scope.closeprompt();
                $state.go('app.home');

            };


        })

		
        .controller('AccountCtrl', function ($scope, AccountDetail) {
            $scope.settings = {
                enableService: true,
                registered: false,
                teamname: 'teama',
                confirmed: false,
                emailid: ''
            };

            $scope.changereg = function ()
            {
                $scope.settings.registered != $scope.settings.registered;
            }
            $scope.register = function () {
                //  alert('submited');
                //alert ($scope.formData.group2[1]);
                //alert(angular.toJson($scope.selection));
                var registerobject = {
                    teamname: $scope.settings.teamname,
                    emailid: $scope.settings.emailid
                };

                AccountDetail.register(registerobject)
                        .success(function (dataFromServer, status, headers, config) {
                            //        alert(dataFromServer.id + "submitted successfully");
                            $scope.settings.registered = true;
                            $scope.settings.confirmed = true;
                        })
                        .error(function (data, status, headers, config) {
                            alert("Submitting form failed!");
                        });




            };

            $scope.cancel = function () {
                if ($scope.settings.confirmed == true) {
                    $scope.settings.registered = true;
                }
            }


        });

