angular.module('starter.controllers', ['ngMap', 'ngCordova'])
        .controller('AuthenticationController', ['$scope', '$state', '$ionicHistory', '$ionicScrollDelegate', '$http', '$window', '$location', 'Authentication', 'Objectdata', 'Mystorage',
            function ($scope, $state, $ionicHistory,$ionicScrollDelegate, $http, $window, $location, Authentication, Objectdata, Mystorage) {

                var url;
                $scope.$on('$ionicView.beforeEnter', function () {
                    $scope.authentication = Authentication.isloggedin();
                    $scope.settings = Mystorage.getObject('settings');

                    $scope.error = '';
                    $scope.locationerror = '';
                    $scope.errors = '';
                    url = Mystorage.getObject('myconfig').url;
					
                });

				$scope.$on('$ionicView.enter', function () {
						

					/*
                    if ($scope.settings.address == null || typeof $scope.settings.address == 'undefined')
                    {
                        $scope.setlocation();
						alert(angular.toJson($scope.settings));
                    } */

			   });
                $scope.credentials = {
                    username: '',
                    email: '',
                    password: '',
                    deviceuuid: ''
                };
                $scope.settings = {
                    username: '',
                    email: '',
                    userid: '',
                    validationcode: '',
                    password: '',
                    registered: false,
                    address: ''

                };

                url = Mystorage.getObject('myconfig').url;

                $scope.pos = {longitude: '', latitude: '', city: '', state: '', place: '', postal_code: '', country: ''};

                $scope.validated = {email: '', validationid: ''};
                /*
                 client ->Version, location, defaulturl -> server
                 <-newurl or message to upgrade, enable or disable
                 */

                /*
                 start - loop, time taken to finished
                 number of sessions on
                 number of requests
                 
                 */

                /*
                 app name
                 config for openshift
                 build app.
                 populate initial data.
                 
                 */



                
                // If user is signed in then redirect back home
                // if ($scope.authentication.user) $state.go('app.home');

				$scope.keyboardFocus = function(handleValue)
				{
					 $ionicScrollDelegate.$getByHandle(handleValue).scrollTop();
					
				//	$ionicScrollDelegate.scrollBy(0, 80, true);
				}

                $scope.logout = function ()
                {

                    $scope.settings = {};
                    $scope.settings.registered = false;
                    Mystorage.setObject('settings', $scope.settings);
                    window.sessionStorage.removeItem('token');

                    $ionicHistory.nextViewOptions({
                        disableAnimate: false,
                        disableBack: true
                    });


                    $state.go('app.home');

                }
                
                $scope.load = function ()
                {
                    $scope.settings = Mystorage.getObject('settings');


                
                }
                $scope.load();

                

                $scope.getvalidationcode = function ()
                {
                    var dataforvalidation = {
                        email: ''
                    };
                    dataforvalidation.email = $scope.settings.email;

                    $http.post(url + '/api/validateemail', dataforvalidation).success(function (response) {
                
                        $scope.validated.email = response.email;
                        $scope.validated.validationid = response.validationid;
                        $scope.settings.validationsent = true;
                    }).error(function (response) {
                
                    });



                }
                $scope.signup = function () {

                    /*
                     email: user.email,
                     password: user.password,
                     confirmPassword: user.confirmPassword,
                     username: user.username,
                     name: user.name
                     */
                    // alert($scope.settings.validationcode);
                    /*
                     $scope.validationerror ='';
                     if(angular.isUndefined($scope.settings.validationcode))
                     {
                     //alert('not set');
                     $scope.entervalidationcode = true;
                     return;
                     }
                     $scope.entervalidationcode = false;
                     if($scope.validated.email != $scope.settings.email)
                     {
                     $scope.validationerror = "Validated email and entered email does not match.";
                     return;
                     
                     }
                     if($scope.validated.validationid != $scope.settings.validationcode)
                     {
                     $scope.validationerror = "Validation id not correct";
                     return;
                     
                     }
                     */
                    $scope.credentials.username = $scope.settings.username;
                    $scope.credentials.name = $scope.settings.username;
                    $scope.credentials.email = $scope.settings.email;
                    $scope.credentials.password = $scope.settings.password;
                    $scope.credentials.confirmPassword = $scope.settings.password;
                
                    if (Mystorage.getObject('deviceid').uuid != null) {
                        $scope.credentials.deviceuuid = Mystorage.getObject('deviceid').uuid;
                    } else {
                        $scope.credentials.deviceuuid = 'testuuid';
                    }
                


                    $http.post(url + '/api/register', $scope.credentials).success(function (response) {
                
                        window.sessionStorage.setItem('token', response.token);
                
                        $scope.userdatacreate();
                        $scope.setlocation();
                        $scope.settings.registered = true;
                        Mystorage.setObject('settings', $scope.settings);
                
                        $scope.autosignin();
                        $ionicHistory.nextViewOptions({
                            disableAnimate: false,
                            disableBack: true
                        });


                        $state.go('app.home');

                    }).error(function (response) {
                
                        $scope.errors = response;
                    });
                };

                $scope.userdatacreate = function ()
                {
                    $http.post(url + '/api/userdatascreate', $scope.credentials).success(function (response) {
                
                        $scope.settings.userid = response.userid;
                        $scope.settings.username = response.username;
                        $scope.settings.supportedapp = response.supportedapp;


                        Mystorage.setObject('settings', $scope.settings);



                
                    }).error(function (response) {
                
                        $scope.error = response.message;
                    });

                }





                $scope.readuserdata = function ()
                {
                    $http.get(url + '/api/userdatasread', $scope.credentials).success(function (response) {
                

                        $scope.settings.userid = response.userid;
                        $scope.settings.username = response.username;
                        $scope.settings.supportedapp = response.supportedapp;

                        Mystorage.setObject('settings', $scope.settings);



                
                    }).error(function (response) {
                
                        $scope.error = response.message;
                    });

                }

                $scope.setlocation = function () {
                

                    if (!navigator.geolocation) {
                        if (Mystorage.getObject('prevlocation') != null) {
                            $scope.locationerror = "Unable to get location. Using previous location";
                            $scope.settings.address = Mystorage.getObject('prevlocation');
                            Mystorage.setObject('settings', $scope.settings);
                        }
                        else {
                            $scope.locationerror = "Unable to get location. ";
                        }
                        return;
                    }
                    ;
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        console.log('Got pos', pos);
                
                        geocoder = new google.maps.Geocoder();


                
                        $scope.pos.longitude = pos.coords.longitude;
                        $scope.pos.latitude = pos.coords.latitude;
                        var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                
                        geocoder.geocode({'latLng': latlng}, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                

                                var city = "";
                                var state = "";
                                var place = "";
                                var postal_code = "";
                                var country = "";
                                var address = "";
                                //		alert(angular.toJson(results));
                                for (var i = 0, len = results[0].address_components.length; i < len; i++) {
                                    var ac = results[0].address_components[i];
                                    if (ac.types.indexOf("locality") >= 0)
                                        city = ac.long_name;
                                    if (ac.types.indexOf("administrative_area_level_1") >= 0)
                                        state = ac.long_name;
                                    if (ac.types.indexOf("sublocality_level_1") >= 0)
                                        place = ac.long_name;
                                    if (ac.types.indexOf("postal_code") >= 0)
                                        postal_code = ac.long_name;
                                    if (ac.types.indexOf("country") >= 0)
                                        country = ac.long_name;
                                    //	if(ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.long_name;


                                }

                                $scope.pos.city = city;
                                $scope.pos.state = state;
                                $scope.pos.place = place;
                                $scope.pos.country = country;
                                $scope.pos.postal_code = postal_code;

                                //alert(angular.toJson($scope.settings));
                                // alert(angular.toJson($scope.pos));

                                $scope.settings.address = $scope.pos;
                                Mystorage.setObject('settings', $scope.settings);
                                Mystorage.setObject('prevlocation', $scope.settings.address);


                                $http.post(url + '/api/userdataslocationset', $scope.pos).success(function (response) {



                                }).error(function (response) {

                
                                    $scope.error = response;
                                });


                            }
                        });



                
                    }, function (error) {
                        if (Mystorage.getObject('prevlocation') != null) {
                            $scope.locationerror = "Unable to get location. Using previous location";
                            $scope.settings.address = Mystorage.getObject('prevlocation');
                            Mystorage.setObject('settings', $scope.settings);
                        }
                        else {
                            $scope.locationerror = "Unable to get location. ";
                        }
                
                    }, {maximumAge: 60000, timeout: 2000});



                };

                $scope.signin = function () {
                    $scope.credentials.email = $scope.settings.email;
                    $scope.credentials.password = $scope.settings.password;


                    $http.post(url + '/api/login', $scope.credentials).success(function (response) {
                
                        window.sessionStorage.setItem('token', response.token);
                
                        $scope.settings.registered = true;
                
                        Mystorage.setObject('settings', $scope.settings);
                
                        $scope.readuserdata();
                
                        $scope.setlocation();
                        $ionicHistory.nextViewOptions({
                            disableAnimate: false,
                            disableBack: true
                        });


                        $state.go('app.home');


                
                    }).error(function (response) {
                        window.sessionStorage.removeItem('token');
                
                        $scope.error = response;
                    });
                };
                $scope.autosignin = function ()
                {
                    if ($scope.settings.email != null && $scope.settings.password != null)
                    {
                        $scope.signin();
                    }
                };

                

            }
        ])

        .controller('CommercialController', function ($scope, $http, $timeout, Authentication, Objectdata, UserdataService) {
            $scope.authentication = Authentication;

            $scope.articles = [
                {'name': 'Ola cabs', 'offer': '100Rs off for recycling 100Rs goods'},
                {'name': 'Big bazar', 'offer': '500Rs off for recycling 500Rs goods'}
            ];


        })

        .controller('MapofObject', function ($scope, $state, $http, $timeout, $ionicConfig, $ionicModal, Authentication, Objectdata, UserdataService, Mystorage) {

            var url;


            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.authentication = Authentication.isloggedin();
                $scope.settings = Mystorage.getObject('settings');

                $scope.error = '';
                $scope.locationerror = '';
                $scope.errors = '';

                if ($scope.authentication == false) {
                    $scope.error = "Login to proceed";
                    return;
                }
                
                $ionicConfig.backButton.previousTitleText(false).text('');

                url = Mystorage.getObject('myconfig').url + "/api";
                if ($scope.settings.address == null) {
                    $scope.locationerror = 'Location not set.';
                    return;
                }

				if($scope.settings.address == null)
				{
					return ;
				}
                $scope.longitude = $scope.settings.address.longitude;

                $scope.latitude = $scope.settings.address.latitude;


            });
            $scope.$on('$ionicView.enter', function () {

                loadmapobjects();
            });

            


            $scope.mapchoice = '';
            $scope.currentPage1 = 0;
            $scope.ticklestart = 0;
            $scope.pageSize1 = 10;
            $scope.zoom = 14;
            $scope.locationerror = '';

            var mymarkers = [];

            $scope.choice = {
                name: 'involvement'
            };



            var obj = Objectdata.getitem();

            $scope.item = obj['item'];






            function loadmapobjects()
            {

                if ($scope.item == null) {
                    var actionitem = '';
                } else {
                    //  var actionitem = '&item=' + obj[$scope.item].item + '&action=' + obj[$scope.item].action + '&typedesc=' + obj[$scope.item].typedesc;	  
                    var actionitem = '&item=' + obj[$scope.item].item + '&typedesc=' + obj[$scope.item].typedesc;
                }


				if(typeof $scope.latitude == 'undefined' || typeof $scope.longitude == 'undefined')
				{
				return ;
				}
	

                /*
                 [{"_id":"566d22ba3cdafe2450f09994","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"Sell","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"jsd","loc":[13.0274167,77.5950955],
                 "objectdetails":"dsjdsds","created":"2015-12-13T07:48:10.997Z"},{"_id":"566d22ac3cdafe2450f09993","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"Buy","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"sdjsdjs","loc":[13.027403399999999,77.5950494],
                 "objectdetails":"dsjdsds","created":"2015-12-13T07:47:56.971Z"},{"_id":"566d22973cdafe2450f09992","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"Dispose","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"ajdadsa","loc":[13.0273997,77.59511309999999],
                 "objectdetails":"dsjdsds","created":"2015-12-13T07:47:35.052Z"},{"_id":"566d21423cdafe2450f09991","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"offer","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"prodvide","loc":[13.027415099999999,77.5950601],"objectdetails":"volunteerdsjdjs",
                 "created":"2015-12-13T07:41:54.264Z"},{"_id":"566d21333cdafe2450f09990","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"volunteer","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"need volunteer","loc":[13.0274045,77.5950988],
                 "objectdetails":"volunteer","created":"2015-12-13T07:41:39.633Z"},{"_id":"566d21243cdafe2450f0998f","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"receive","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"need utincils","loc":[13.0274217,77.5951441],
                 "objectdetails":"utincils","created":"2015-12-13T07:41:24.434Z"},{"_id":"566d210f3cdafe2450f0998e","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"receive","objecttypedesc":"clothes for girls","objecttype":"Charity","objectdesc":"need clothes","loc":[13.0273919,77.59506979999999],"objectdetails":"djdjdj","created":"2015-12-13T07:41:03.646Z"},{"_id":"566d1fc63cdafe2450f0998d","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"Weekend class","objecttypedesc":"Hybrid development","objecttype":"Training","objectdesc":"hybitid class","loc":[13.027401800000002,77.5951336],"objectdetails":"1000","created":"2015-12-13T07:35:34.291Z"},{"_id":"566d1fb83cdafe2450f0998c","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"Morning class","objecttypedesc":"Hybrid development","objecttype":"Training","objectdesc":"testing class","loc":[13.0273873,77.5950805],"objectdetails":"1000","created":"2015-12-13T07:35:20.569Z"},{"_id":"566ad442d71ac8f031e7742b","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"offer","objecttypedesc":"furniture","objecttype":"Reuse","objectdesc":"fur-1","loc":[13.027439699999999,77.5952602],"objectdetails":"fur-1","created":"2015-12-11T13:48:50.787Z"},{"_id":"566a77e8d71ac8f031e77427","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"offer","objecttypedesc":"cleaning","objecttype":"Service","objectdesc":"raju6 cleaning service","loc":[12.9522152,77.6437521],"objectdetails":"raju6 cleaning service","created":"2015-12-11T07:14:48.859Z"},{"_id":"564d926a77455a1822c75b9d","userdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"objectaction":"Free class","objecttypedesc":"Mobile app development","objecttype":"Training","objectdesc":"angularjs","loc":[12.952404,77.6438189],"objectdetails":"in the veninings","created":"2015-11-19T09:12:10.115Z"}]
                 
                 */

                $http.get(url + '/object/near?longitude=' + $scope.longitude + '&latitude=' + $scope.latitude + actionitem).success(function (response) {

                    var mapdata = {longitude: $scope.longitude,
                        latitude: $scope.latitude,
                        data: response};

                    Objectdata.setmapstorage(mapdata);

                    if ($scope.allpositions) {
                        $scope.allpositions.length = 0;
                    }

                    $scope.allpositions = getrelevantpostions(response);

                    $scope.totalobjects = $scope.allpositions.length;
                    if ($scope.allpositions.length < $scope.pageSize1) {
                        $scope.positions = $scope.allpositions.slice(0);
                        updateposlength();
                        $scope.currentPage1 = 1;
                    } else {
                        $scope.positions = $scope.allpositions.slice(0, $scope.pageSize1);
                        $scope.currentPage1 = 1;
                        updateposlength();
                    }



                }).error(function (response) {

					if(response != null) {
                    $scope.error = response.message;
					}
                });



            }

            $scope.test = function (index) {
                alert(index);
            }
            function zoom()
            {

                // $scope.zoom = 15;
            }


            $scope.refresh = function ()
            {

                loadmapobjects();
            }

            /*
             [{"_id":"566d22ba3cdafe2450f09994","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"Sell","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"jsd","loc":[13.0274167,77.5950955],
             "objectdetails":"dsjdsds","created":"2015-12-13T07:48:10.997Z"},{"_id":"566d22ac3cdafe2450f09993","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"Buy","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"sdjsdjs","loc":[13.027403399999999,77.5950494],
             "objectdetails":"dsjdsds","created":"2015-12-13T07:47:56.971Z"},{"_id":"566d22973cdafe2450f09992","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"Dispose","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"ajdadsa","loc":[13.0273997,77.59511309999999],
             "objectdetails":"dsjdsds","created":"2015-12-13T07:47:35.052Z"},{"_id":"566d21423cdafe2450f09991","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"offer","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"prodvide","loc":[13.027415099999999,77.5950601],"objectdetails":"volunteerdsjdjs",
             "created":"2015-12-13T07:41:54.264Z"},{"_id":"566d21333cdafe2450f09990","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"volunteer","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"need volunteer","loc":[13.0274045,77.5950988],
             "objectdetails":"volunteer","created":"2015-12-13T07:41:39.633Z"},{"_id":"566d21243cdafe2450f0998f","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"receive","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"need utincils","loc":[13.0274217,77.5951441],
             "objectdetails":"utincils","created":"2015-12-13T07:41:24.434Z"},{"_id":"566d210f3cdafe2450f0998e","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"receive","objecttypedesc":"clothes for girls","objecttype":"Charity","objectdesc":"need clothes","loc":[13.0273919,77.59506979999999],"objectdetails":"djdjdj","created":"2015-12-13T07:41:03.646Z"},{"_id":"566d1fc63cdafe2450f0998d","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"Weekend class","objecttypedesc":"Hybrid development","objecttype":"Training","objectdesc":"hybitid class","loc":[13.027401800000002,77.5951336],"objectdetails":"1000","created":"2015-12-13T07:35:34.291Z"},{"_id":"566d1fb83cdafe2450f0998c","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"Morning class","objecttypedesc":"Hybrid development","objecttype":"Training","objectdesc":"testing class","loc":[13.0273873,77.5950805],"objectdetails":"1000","created":"2015-12-13T07:35:20.569Z"},{"_id":"566ad442d71ac8f031e7742b","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"offer","objecttypedesc":"furniture","objecttype":"Reuse","objectdesc":"fur-1","loc":[13.027439699999999,77.5952602],"objectdetails":"fur-1","created":"2015-12-11T13:48:50.787Z"},{"_id":"566a77e8d71ac8f031e77427","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"offer","objecttypedesc":"cleaning","objecttype":"Service","objectdesc":"raju6 cleaning service","loc":[12.9522152,77.6437521],"objectdetails":"raju6 cleaning service","created":"2015-12-11T07:14:48.859Z"},{"_id":"564d926a77455a1822c75b9d","userdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"objectaction":"Free class","objecttypedesc":"Mobile app development","objecttype":"Training","objectdesc":"angularjs","loc":[12.952404,77.6438189],"objectdetails":"in the veninings","created":"2015-11-19T09:12:10.115Z"}]
             
             
             
             
             */
            function getrelevantpostions(data)
            {
                var resp = [];

                var obj = Objectdata.getitem();
                $scope.item = obj['item'];


                if ($scope.item == null || obj[$scope.item] == null)
                {
                    return data;
                }

                for (var i = 0; i < data.length; i++) {
                    if ($scope.item != null && obj[$scope.item] != null)
                    {

                        if ($scope.item == data[i].objecttype) {

                            resp.push(data[i]);

                        }

                    }
                }
                if (resp.length == 0)
                {
                    return resp;
                }
                else {
                    return resp;
                }


            }




            $scope.doSomething = function ()
            {
                alert("will be available shortly");
            }
            $scope.nextitem = function ()
            {
                if ($scope.totalobjects > $scope.currentPage1 * $scope.pageSize1) {
                    var start = $scope.currentPage1 * $scope.pageSize1;
                    var end = start + $scope.pageSize1;
                    $scope.positions = $scope.allpositions.slice(start, end);


                    $scope.currentPage1++;
                } else {
                    $scope.positions = $scope.allpositions.slice(0, $scope.pageSize1);
                    $scope.currentPage1 = 1;
                }

                $scope.ticklestart = 0;
                updateposlength();
                zoom();
            }
            $scope.tickle = function ()
            {

                $scope.positions = $scope.positions.slice($scope.ticklestart + 1);
                updateposlength();

                zoom();

            }
            /*
             [{"_id":"5674113123df0009126c6055","userdata":{"_id":"5672795223df0009126c6050","username":"sudanshu"},"objectaction":"Need","objecttypedesc":"Tailoring","objecttype":"Education Market","objectdesc":"Gents tailoring","loc":[13.027427099999999,77.5950055],"objectdetails":"Gents tailoring","created":"2015-12-18T13:59:13.397Z"},{"_id":"56728f5023df0009126c6054","userdata":{"_id":"5672795223df0009126c6050","username":"sudanshu"},"objectaction":"Sell","objecttypedesc":"Garden manure","objecttype":"Manure Market","objectdesc":"Rose manure","loc":[12.9522385,77.6437754],"objectdetails":"Manure for rose plants","created":"2015-12-17T10:32:48.951Z"},{"_id":"56727d9123df0009126c6053","userdata":{"_id":"5672795223df0009126c6050","username":"sudanshu"},"objectaction":"Offer","objecttypedesc":"Dog food","objecttype":"Feed Animals Birds","objectdesc":"Good dog food","loc":[12.9522052,77.64377379999999],"objectdetails":"available","created":"2015-12-17T09:17:05.463Z"},{"_id":"56727d4c23df0009126c6052","userdata":{"_id":"563f0d0cf915103778ad3b17","username":"raju1"},"objectaction":"Offer","objecttypedesc":"Veg food","objecttype":"Share Food","objectdesc":"cooked food","loc":[12.9522105,77.64377549999999],"objectdetails":"south indian available","created":"2015-12-17T09:15:56.789Z"},{"_id":"56714a7b23df0009126c6047","userdata":{"_id":"563f0d0cf915103778ad3b17","username":"raju1"},"objectaction":"Need","objecttypedesc":"Software training","objecttype":"Education Market","objectdesc":"mqseries","loc":[12.9521528,77.6437307],"objectdetails":"Mq training","created":"2015-12-16T11:26:51.898Z"},{"_id":"56713a1523df0009126c6046","userdata":{"_id":"5663e9ed0df5b8d751968bd3","username":"ramesh2"},"objectaction":"Join","objecttypedesc":"Yoga","objecttype":"Elder social","objectdesc":"Yoga class at EGL","loc":[12.9522394,77.6437576],"objectdetails":"Yoga class at EGL","created":"2015-12-16T10:16:53.770Z"},{"_id":"56710c1323df0009126c603a","userdata":{"_id":"5670474223df0009126c6032","username":"raju2"},"objectaction":"Join","objecttypedesc":"Chatting","objecttype":"Youth social","objectdesc":"Chatting on movie","loc":[12.9522143,77.64375969999999],"objectdetails":"Chatting on movie","created":"2015-12-16T07:00:35.322Z"},{"_id":"5670469a23df0009126c6030","userdata":{"_id":"563f0d0cf915103778ad3b17","username":"raju1"},"objectaction":"Paid class","objecttypedesc":"Mobile app development","objecttype":"Web App Training","objectdesc":"test class","loc":[13.0273995,77.5950126],"objectdetails":"Test","created":"2015-12-15T16:58:02.059Z"},{"_id":"566416472941322c5461a719","userdata":{"_id":"5663e9ed0df5b8d751968bd3","username":"ramesh2"},"objectaction":"Join","objecttypedesc":"Walking","objecttype":"Youth social","objectdesc":"Morning walk","loc":[12.8908559,77.6077561],"objectdetails":"I plan to go for walk in vijaya bank layout at 6.00 AM.","created":"2015-12-06T11:04:39.970Z"},{"_id":"56377a8f6bdfd39244290a16","userdata":{"_id":"56360a29f93753441fe258bf","username":"ragu2"},"objectaction":"Offer","objecttypedesc":"Gardening","objecttype":"Service","objectdesc":"terrace garden ing","loc":[13.0274573,77.5948731],"objectdetails":"Terrace garden ing","created":"2015-11-02T15:00:31.996Z"},{"_id":"563650a0182cb8a02270cd9f","userdata":{"_id":"56364cd5182cb8a02270cd9c","username":"Ganesh Babu M"},"objectaction":"Offer","objecttypedesc":"Clothes for men","objecttype":"Charity","objectdesc":"Used clothes available","loc":[12.8979648,77.6317926],"objectdetails":"Used  clothes available for men","created":"2015-11-01T17:49:20.200Z"},{"_id":"5636503b182cb8a02270cd9e","userdata":{"_id":"56364cd5182cb8a02270cd9c","username":"Ganesh Babu M"},"objectaction":"Offer","objecttypedesc":"Clothes for children","objecttype":"Charity","loc":[12.8979589,77.6317806],"objectdetails":"","created":"2015-11-01T17:47:39.451Z"},{"_id":"56364d5d182cb8a02270cd9d","userdata":{"_id":"56364cd5182cb8a02270cd9c","username":"Ganesh Babu M"},"objectaction":"Free class","objecttypedesc":"Mobile app development","objecttype":"Training","objectdesc":"HSR Layout","loc":[12.897961,77.6317591],"objectdetails":"Phonegap Framework","created":"2015-11-01T17:35:25.772Z"},{"_id":"563620f8f93753441fe258c2","userdata":{"_id":"56360a29f93753441fe258bf","username":"ragu2"},"objectaction":"Paid class","objecttypedesc":"Soft skill","objecttype":"Training","objectdesc":"ionic framework training","loc":[13.0274322,77.5949143],"objectdetails":"Ionic framework training","created":"2015-11-01T14:26:00.509Z"},{"_id":"563619d9f93753441fe258c1","userdata":{"_id":"5636027af93753441fe258bc","username":"ramesh1"},"objectaction":"Need","objecttypedesc":"Welding training","objecttype":"Education","objectdesc":"Gate making","loc":[13.027388499999999,77.595045],"objectdetails":"Gate making","created":"2015-11-01T13:55:37.196Z"},{"_id":"56360fc1f93753441fe258c0","userdata":{"_id":"5636027af93753441fe258bc","username":"ramesh1"},"objectaction":"Need","objecttypedesc":"Welding training","objecttype":"Education","objectdesc":"Gate making","loc":[13.027435899999999,77.5949452],"objectdetails":"Gate making class","created":"2015-11-01T13:12:33.066Z"},{"_id":"56360616f93753441fe258bd","userdata":{"_id":"5636027af93753441fe258bc","username":"ramesh1"},"objectaction":"Free class","objecttypedesc":"Mobile app development","objecttype":"Training","objectdesc":"Simple mobile apps","loc":[13.027385599999999,77.5951048],"objectdetails":"Simple mobile app development using ionic framework.\n\n1 months class","created":"2015-11-01T12:31:18.040Z"}]
             */

            function updateposlength()
            {
                $scope.poslength = $scope.positions.length;
            }



            $scope.myloc = function (id, id1) {
                $scope.sendclick($scope.positions[id1]);
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
                var mymarker1 = new google.maps.Marker({
                    position: $scope.neighborhoods[iterator++],
                    map: $scope.map,
                    draggable: false,
                    animation: google.maps.Animation.DROP
                });

                for (var i = 0; i < $scope.neighborhoods.length; i++) {
                    $timeout(function () {
                        // add a marker this way does not sync. marker with <marker> tag
                        mymarker1
                    }, i * 2);
                }
                mymarker.push(mymarker1);
            }


            $scope.sendclick = function (pos) {
                var subscribe = {
                    item: pos,
                    likedtime: Date.now()
                };


                Objectdata.setitemdata(subscribe);


                $state.go('app.itemdetails');



            }
            $scope.listmapitems = function (pos) {

                Objectdata.setpositiondata($scope.positions);
                $state.go('app.listmapitems');

            }


            $ionicModal.fromTemplateUrl('templates/mapsearchoption.html', {
                scope: $scope
            }).then(function (modal1) {
                $scope.modal1 = modal1;
            });


            $scope.searchlist = function () {
                $scope.modal1.show();
            };
            $scope.closelist = function () {
                $scope.modal1.hide();
            };

            $scope.setsearch = function ()
            {


                $scope.modal1.hide();

                if ($scope.choice.name == 'involvement') {
                    $state.go('app.involvement');
                } else {
                    $state.go('app.contribution');
                }

            }

            $scope.gotorequests = function ()
            {
                $state.go('app.requests');
            }
            $scope.gotoresponses = function ()
            {
                $state.go('app.responses');
            }


            $scope.create = function (pos) {

                var obj = [];
                obj.push(pos);

                var article = new UserdataService({
                    subscribe: obj

                });

                // Redirect after save
                article.$save(function (response) {

                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

        })

        .controller('ListMapofObject', function ($scope, $state, $http, $timeout, $ionicConfig, $ionicModal, Authentication, Objectdata, UserdataService, Mystorage) {

            var url = {};
            var obj = {};

            $scope.authentication = Authentication.isloggedin();
            $scope.settings = Mystorage.getObject('settings');


            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.authentication = Authentication.isloggedin();
                $scope.settings = Mystorage.getObject('settings');


                $scope.error = '';
                $scope.locationerror = '';
                $scope.errors = '';


                if ($scope.authentication == false) {
                    $scope.error = "Login to proceed";
                    return;
                }



                $ionicConfig.backButton.previousTitleText(false).text('');

                if ($scope.settings.address == null) {
                    $scope.locationerror = 'Location not set.';
                    return;
                }

                $scope.longitude = $scope.settings.address.longitude;

                $scope.latitude = $scope.settings.address.latitude;


            });

            $scope.$on('$ionicView.enter', function () {


                loadmapobjects();

            });





            $scope.mapchoice = '';
            $scope.currentPage1 = 0;
            $scope.ticklestart = 0;
            $scope.pageSize1 = 10;
            $scope.zoom = 14;
            $scope.locationerror = '';

            var mymarkers = [];

            $scope.choice = {
                name: 'involvement'
            };

            url = Mystorage.getObject('myconfig').url + "/api";


            obj = Objectdata.getitem();

            $scope.item = obj['item'];

            function loadmapobjects()
            {

                /*
                 // The user has following information
                 $scope.action = $scope.options[id].name;
                 $scope.itemdetails.objectaction = $scope.options[id].name; // sell, rent etc
                 $scope.itemdetails.objecttypedesc = obj[$scope.item].typedesc ; //  "used furniture", "c++ training"
                 $scope.itemdetails.objecttype = $scope.item ; //  "item", "training"
                 
                 */

                if ($scope.item == null) {
                    var actionitem = '';
                } else {
                    //  var actionitem = '&item=' + obj[$scope.item].item + '&action=' + obj[$scope.item].action + '&typedesc=' + obj[$scope.item].typedesc;	  
                    var actionitem = '&item=' + obj[$scope.item].item + '&typedesc=' + obj[$scope.item].typedesc;
                }


				if(typeof $scope.latitude == 'undefined' || typeof $scope.longitude == 'undefined')
				{
				return ;
				}
				

                /*
                 [{"_id":"566d22ba3cdafe2450f09994","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"Sell","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"jsd","loc":[13.0274167,77.5950955],
                 "objectdetails":"dsjdsds","created":"2015-12-13T07:48:10.997Z"},{"_id":"566d22ac3cdafe2450f09993","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"Buy","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"sdjsdjs","loc":[13.027403399999999,77.5950494],
                 "objectdetails":"dsjdsds","created":"2015-12-13T07:47:56.971Z"},{"_id":"566d22973cdafe2450f09992","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"Dispose","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"ajdadsa","loc":[13.0273997,77.59511309999999],
                 "objectdetails":"dsjdsds","created":"2015-12-13T07:47:35.052Z"},{"_id":"566d21423cdafe2450f09991","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"offer","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"prodvide","loc":[13.027415099999999,77.5950601],"objectdetails":"volunteerdsjdjs",
                 "created":"2015-12-13T07:41:54.264Z"},{"_id":"566d21333cdafe2450f09990","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"volunteer","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"need volunteer","loc":[13.0274045,77.5950988],
                 "objectdetails":"volunteer","created":"2015-12-13T07:41:39.633Z"},{"_id":"566d21243cdafe2450f0998f","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"receive","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"need utincils","loc":[13.0274217,77.5951441],
                 "objectdetails":"utincils","created":"2015-12-13T07:41:24.434Z"},{"_id":"566d210f3cdafe2450f0998e","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
                 "objectaction":"receive","objecttypedesc":"clothes for girls","objecttype":"Charity","objectdesc":"need clothes","loc":[13.0273919,77.59506979999999],"objectdetails":"djdjdj","created":"2015-12-13T07:41:03.646Z"},{"_id":"566d1fc63cdafe2450f0998d","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"Weekend class","objecttypedesc":"Hybrid development","objecttype":"Training","objectdesc":"hybitid class","loc":[13.027401800000002,77.5951336],"objectdetails":"1000","created":"2015-12-13T07:35:34.291Z"},{"_id":"566d1fb83cdafe2450f0998c","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"Morning class","objecttypedesc":"Hybrid development","objecttype":"Training","objectdesc":"testing class","loc":[13.0273873,77.5950805],"objectdetails":"1000","created":"2015-12-13T07:35:20.569Z"},{"_id":"566ad442d71ac8f031e7742b","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"offer","objecttypedesc":"furniture","objecttype":"Reuse","objectdesc":"fur-1","loc":[13.027439699999999,77.5952602],"objectdetails":"fur-1","created":"2015-12-11T13:48:50.787Z"},{"_id":"566a77e8d71ac8f031e77427","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"offer","objecttypedesc":"cleaning","objecttype":"Service","objectdesc":"raju6 cleaning service","loc":[12.9522152,77.6437521],"objectdetails":"raju6 cleaning service","created":"2015-12-11T07:14:48.859Z"},{"_id":"564d926a77455a1822c75b9d","userdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"objectaction":"Free class","objecttypedesc":"Mobile app development","objecttype":"Training","objectdesc":"angularjs","loc":[12.952404,77.6438189],"objectdetails":"in the veninings","created":"2015-11-19T09:12:10.115Z"}]
                 
                 */

                $http.get(url + '/object/near?longitude=' + $scope.longitude + '&latitude=' + $scope.latitude + actionitem).success(function (response) {

                    var mapdata = {longitude: $scope.longitude,
                        latitude: $scope.latitude,
                        data: response};

                    Objectdata.setmapstorage(mapdata);

                    if ($scope.allpositions) {
                        $scope.allpositions.length = 0;
                    }

                    $scope.allpositions = getrelevantpostions(response);

                    $scope.totalobjects = $scope.allpositions.length;
                    if ($scope.allpositions.length < $scope.pageSize1) {
                        $scope.positions = $scope.allpositions.slice(0);
                        updateposlength();
                        $scope.currentPage1 = 1;
                    } else {
                        $scope.positions = $scope.allpositions.slice(0, $scope.pageSize1);
                        $scope.currentPage1 = 1;
                        updateposlength();
                    }



                }).error(function (response) {

					if(response != null){
                    $scope.error = response.message;
					}
                });



            }

            $scope.test = function (index) {
                alert(index);
            }
            function zoom()
            {


            }


            $scope.refresh = function ()
            {

                loadmapobjects();
            }

            /*
             [{"_id":"566d22ba3cdafe2450f09994","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"Sell","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"jsd","loc":[13.0274167,77.5950955],
             "objectdetails":"dsjdsds","created":"2015-12-13T07:48:10.997Z"},{"_id":"566d22ac3cdafe2450f09993","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"Buy","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"sdjsdjs","loc":[13.027403399999999,77.5950494],
             "objectdetails":"dsjdsds","created":"2015-12-13T07:47:56.971Z"},{"_id":"566d22973cdafe2450f09992","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"Dispose","objecttypedesc":"Other Plastics","objecttype":"Plastics","objectdesc":"ajdadsa","loc":[13.0273997,77.59511309999999],
             "objectdetails":"dsjdsds","created":"2015-12-13T07:47:35.052Z"},{"_id":"566d21423cdafe2450f09991","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"offer","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"prodvide","loc":[13.027415099999999,77.5950601],"objectdetails":"volunteerdsjdjs",
             "created":"2015-12-13T07:41:54.264Z"},{"_id":"566d21333cdafe2450f09990","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"volunteer","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"need volunteer","loc":[13.0274045,77.5950988],
             "objectdetails":"volunteer","created":"2015-12-13T07:41:39.633Z"},{"_id":"566d21243cdafe2450f0998f","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"receive","objecttypedesc":"utensils","objecttype":"Charity","objectdesc":"need utincils","loc":[13.0274217,77.5951441],
             "objectdetails":"utincils","created":"2015-12-13T07:41:24.434Z"},{"_id":"566d210f3cdafe2450f0998e","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},
             "objectaction":"receive","objecttypedesc":"clothes for girls","objecttype":"Charity","objectdesc":"need clothes","loc":[13.0273919,77.59506979999999],"objectdetails":"djdjdj","created":"2015-12-13T07:41:03.646Z"},{"_id":"566d1fc63cdafe2450f0998d","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"Weekend class","objecttypedesc":"Hybrid development","objecttype":"Training","objectdesc":"hybitid class","loc":[13.027401800000002,77.5951336],"objectdetails":"1000","created":"2015-12-13T07:35:34.291Z"},{"_id":"566d1fb83cdafe2450f0998c","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"Morning class","objecttypedesc":"Hybrid development","objecttype":"Training","objectdesc":"testing class","loc":[13.0273873,77.5950805],"objectdetails":"1000","created":"2015-12-13T07:35:20.569Z"},{"_id":"566ad442d71ac8f031e7742b","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"offer","objecttypedesc":"furniture","objecttype":"Reuse","objectdesc":"fur-1","loc":[13.027439699999999,77.5952602],"objectdetails":"fur-1","created":"2015-12-11T13:48:50.787Z"},{"_id":"566a77e8d71ac8f031e77427","userdata":{"_id":"566a7739d71ac8f031e77426","username":"raju6"},"objectaction":"offer","objecttypedesc":"cleaning","objecttype":"Service","objectdesc":"raju6 cleaning service","loc":[12.9522152,77.6437521],"objectdetails":"raju6 cleaning service","created":"2015-12-11T07:14:48.859Z"},{"_id":"564d926a77455a1822c75b9d","userdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"objectaction":"Free class","objecttypedesc":"Mobile app development","objecttype":"Training","objectdesc":"angularjs","loc":[12.952404,77.6438189],"objectdetails":"in the veninings","created":"2015-11-19T09:12:10.115Z"}]
             
             
             
             
             */
            function getrelevantpostions(data)
            {
                var resp = [];

                var obj = Objectdata.getitem();
                $scope.item = obj['item'];


                if ($scope.item == null || obj[$scope.item] == null)
                {
                    return data;
                }

                for (var i = 0; i < data.length; i++) {
                    if ($scope.item != null && obj[$scope.item] != null)
                    {

                        if ($scope.item == data[i].objecttype) {

                            resp.push(data[i]);

                        }

                    }
                }
                if (resp.length == 0)
                {
                    return resp;
                }
                else {
                    return resp;
                }


            }




            $scope.doSomething = function ()
            {
                alert("will be available shortly");
            }
            $scope.nextitem = function ()
            {
                if ($scope.totalobjects > $scope.currentPage1 * $scope.pageSize1) {
                    var start = $scope.currentPage1 * $scope.pageSize1;
                    var end = start + $scope.pageSize1;
                    $scope.positions = $scope.allpositions.slice(start, end);


                    $scope.currentPage1++;
                } else {
                    $scope.positions = $scope.allpositions.slice(0, $scope.pageSize1);
                    $scope.currentPage1 = 1;
                }

                $scope.ticklestart = 0;
                updateposlength();
                zoom();
            }
            $scope.tickle = function ()
            {

                $scope.positions = $scope.positions.slice($scope.ticklestart + 1);
                updateposlength();

                zoom();

            }
            /*
             [{"_id":"5674113123df0009126c6055","userdata":{"_id":"5672795223df0009126c6050","username":"sudanshu"},"objectaction":"Need","objecttypedesc":"Tailoring","objecttype":"Education Market","objectdesc":"Gents tailoring","loc":[13.027427099999999,77.5950055],"objectdetails":"Gents tailoring","created":"2015-12-18T13:59:13.397Z"},{"_id":"56728f5023df0009126c6054","userdata":{"_id":"5672795223df0009126c6050","username":"sudanshu"},"objectaction":"Sell","objecttypedesc":"Garden manure","objecttype":"Manure Market","objectdesc":"Rose manure","loc":[12.9522385,77.6437754],"objectdetails":"Manure for rose plants","created":"2015-12-17T10:32:48.951Z"},{"_id":"56727d9123df0009126c6053","userdata":{"_id":"5672795223df0009126c6050","username":"sudanshu"},"objectaction":"Offer","objecttypedesc":"Dog food","objecttype":"Feed Animals Birds","objectdesc":"Good dog food","loc":[12.9522052,77.64377379999999],"objectdetails":"available","created":"2015-12-17T09:17:05.463Z"},{"_id":"56727d4c23df0009126c6052","userdata":{"_id":"563f0d0cf915103778ad3b17","username":"raju1"},"objectaction":"Offer","objecttypedesc":"Veg food","objecttype":"Share Food","objectdesc":"cooked food","loc":[12.9522105,77.64377549999999],"objectdetails":"south indian available","created":"2015-12-17T09:15:56.789Z"},{"_id":"56714a7b23df0009126c6047","userdata":{"_id":"563f0d0cf915103778ad3b17","username":"raju1"},"objectaction":"Need","objecttypedesc":"Software training","objecttype":"Education Market","objectdesc":"mqseries","loc":[12.9521528,77.6437307],"objectdetails":"Mq training","created":"2015-12-16T11:26:51.898Z"},{"_id":"56713a1523df0009126c6046","userdata":{"_id":"5663e9ed0df5b8d751968bd3","username":"ramesh2"},"objectaction":"Join","objecttypedesc":"Yoga","objecttype":"Elder social","objectdesc":"Yoga class at EGL","loc":[12.9522394,77.6437576],"objectdetails":"Yoga class at EGL","created":"2015-12-16T10:16:53.770Z"},{"_id":"56710c1323df0009126c603a","userdata":{"_id":"5670474223df0009126c6032","username":"raju2"},"objectaction":"Join","objecttypedesc":"Chatting","objecttype":"Youth social","objectdesc":"Chatting on movie","loc":[12.9522143,77.64375969999999],"objectdetails":"Chatting on movie","created":"2015-12-16T07:00:35.322Z"},{"_id":"5670469a23df0009126c6030","userdata":{"_id":"563f0d0cf915103778ad3b17","username":"raju1"},"objectaction":"Paid class","objecttypedesc":"Mobile app development","objecttype":"Web App Training","objectdesc":"test class","loc":[13.0273995,77.5950126],"objectdetails":"Test","created":"2015-12-15T16:58:02.059Z"},{"_id":"566416472941322c5461a719","userdata":{"_id":"5663e9ed0df5b8d751968bd3","username":"ramesh2"},"objectaction":"Join","objecttypedesc":"Walking","objecttype":"Youth social","objectdesc":"Morning walk","loc":[12.8908559,77.6077561],"objectdetails":"I plan to go for walk in vijaya bank layout at 6.00 AM.","created":"2015-12-06T11:04:39.970Z"},{"_id":"56377a8f6bdfd39244290a16","userdata":{"_id":"56360a29f93753441fe258bf","username":"ragu2"},"objectaction":"Offer","objecttypedesc":"Gardening","objecttype":"Service","objectdesc":"terrace garden ing","loc":[13.0274573,77.5948731],"objectdetails":"Terrace garden ing","created":"2015-11-02T15:00:31.996Z"},{"_id":"563650a0182cb8a02270cd9f","userdata":{"_id":"56364cd5182cb8a02270cd9c","username":"Ganesh Babu M"},"objectaction":"Offer","objecttypedesc":"Clothes for men","objecttype":"Charity","objectdesc":"Used clothes available","loc":[12.8979648,77.6317926],"objectdetails":"Used  clothes available for men","created":"2015-11-01T17:49:20.200Z"},{"_id":"5636503b182cb8a02270cd9e","userdata":{"_id":"56364cd5182cb8a02270cd9c","username":"Ganesh Babu M"},"objectaction":"Offer","objecttypedesc":"Clothes for children","objecttype":"Charity","loc":[12.8979589,77.6317806],"objectdetails":"","created":"2015-11-01T17:47:39.451Z"},{"_id":"56364d5d182cb8a02270cd9d","userdata":{"_id":"56364cd5182cb8a02270cd9c","username":"Ganesh Babu M"},"objectaction":"Free class","objecttypedesc":"Mobile app development","objecttype":"Training","objectdesc":"HSR Layout","loc":[12.897961,77.6317591],"objectdetails":"Phonegap Framework","created":"2015-11-01T17:35:25.772Z"},{"_id":"563620f8f93753441fe258c2","userdata":{"_id":"56360a29f93753441fe258bf","username":"ragu2"},"objectaction":"Paid class","objecttypedesc":"Soft skill","objecttype":"Training","objectdesc":"ionic framework training","loc":[13.0274322,77.5949143],"objectdetails":"Ionic framework training","created":"2015-11-01T14:26:00.509Z"},{"_id":"563619d9f93753441fe258c1","userdata":{"_id":"5636027af93753441fe258bc","username":"ramesh1"},"objectaction":"Need","objecttypedesc":"Welding training","objecttype":"Education","objectdesc":"Gate making","loc":[13.027388499999999,77.595045],"objectdetails":"Gate making","created":"2015-11-01T13:55:37.196Z"},{"_id":"56360fc1f93753441fe258c0","userdata":{"_id":"5636027af93753441fe258bc","username":"ramesh1"},"objectaction":"Need","objecttypedesc":"Welding training","objecttype":"Education","objectdesc":"Gate making","loc":[13.027435899999999,77.5949452],"objectdetails":"Gate making class","created":"2015-11-01T13:12:33.066Z"},{"_id":"56360616f93753441fe258bd","userdata":{"_id":"5636027af93753441fe258bc","username":"ramesh1"},"objectaction":"Free class","objecttypedesc":"Mobile app development","objecttype":"Training","objectdesc":"Simple mobile apps","loc":[13.027385599999999,77.5951048],"objectdetails":"Simple mobile app development using ionic framework.\n\n1 months class","created":"2015-11-01T12:31:18.040Z"}]
             */

            function updateposlength()
            {
                $scope.poslength = $scope.positions.length;
            }



            $scope.myloc = function (id, id1) {
                $scope.sendclick($scope.positions[id1]);
            };


            $scope.myselection = function (id1) {

                $scope.sendclick($scope.positions[id1]);
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
                var mymarker1 = new google.maps.Marker({
                    position: $scope.neighborhoods[iterator++],
                    map: $scope.map,
                    draggable: false,
                    animation: google.maps.Animation.DROP
                });

                for (var i = 0; i < $scope.neighborhoods.length; i++) {
                    $timeout(function () {
                        // add a marker this way does not sync. marker with <marker> tag
                        mymarker1
                    }, i * 2);
                }
                mymarker.push(mymarker1);
            }


            $scope.sendclick = function (pos) {
                var subscribe = {
                    item: pos,
                    likedtime: Date.now()
                };


                Objectdata.setitemdata(subscribe);


                $state.go('app.itemdetails');



            }
            $scope.listmapitems = function (pos) {



                Objectdata.setpositiondata($scope.positions);


                $state.go('app.listmapitems');



            }


            $ionicModal.fromTemplateUrl('templates/mapsearchoption.html', {
                scope: $scope
            }).then(function (modal1) {
                $scope.modal1 = modal1;
            });


            $scope.searchlist = function () {
                $scope.modal1.show();
            };
            $scope.closelist = function () {
                $scope.modal1.hide();
            };

            $scope.setsearch = function ()
            {


                $scope.modal1.hide();

                if ($scope.choice.name == 'involvement') {
                    $state.go('app.involvement');
                } else {
                    $state.go('app.contribution');
                }

            }

            $scope.gotorequests = function ()
            {
                $state.go('app.requests');
            }
            $scope.gotoresponses = function ()
            {
                $state.go('app.responses');
            }


            $scope.create = function (pos) {

                var obj = [];
                obj.push(pos);

                var article = new UserdataService({
                    subscribe: obj

                });


                article.$save(function (response) {

                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

        })

        .controller('ObjecttypeController', ['$scope', '$stateParams', '$state', '$location', '$http', '$ionicHistory', '$timeout', 'Authentication', 'ObjecttypeService',
            'ObjectService', 'Objectdata', '$ionicModal', 'Mystorage',
            function ($scope, $stateParams, $state, $location, $http, $ionicHistory, $timeout, Authentication, ObjecttypeService, ObjectService, Objectdata, $ionicModal, Mystorage) {

                $scope.$on('$ionicView.beforeEnter', function () {
                    $scope.authentication = Authentication.isloggedin();
                    $scope.settings = Mystorage.getObject('settings');



                });
                $scope.authentication = Authentication.isloggedin();

                $scope.articles = [];
                $scope.itemdetails = {};
                $scope.selected = "";
                $scope.options = [];
                $scope.typedesc1 = {};
                $scope.involveitems = new Array();
                $scope.contribtems = new Array();

                $scope.dataentry = false;


                $scope.loadinvolvement = function () {


                    $scope.list1 = ObjecttypeService.query();

                    $scope.list1.$promise.then(function (data) {

                        var testa = [];
                        var testb = [];
                        for (var i = 0; i < data.length; i++) {

                            if (data[i].group == 'involve') {
                                testb.push(data[i]);

                            }

                            if (data[i].group == "contrib") {

                                var xx1 = {};
                                xx1.name = data[i].name;

                                testa.push(data[i]);

                            }
                        }

                        $scope.contribtems = testa;
                        $scope.involveitems = testb;

                    });




                }



                $scope.loadinvolvement();

                function setoptions(doc)
                {
                    $scope.options.length = 0;

                    for (var i = 0; i < doc.length; i++)
                    {
                        var opt = {};
                        opt.name = doc[i];
                        opt.selected = false;
                        $scope.options.push(opt);

                    }


                }

                function getitems()
                {


                    for (var i = 0; i < $scope.articles.length; i++)
                    {

                        if ($scope.articles[i].name == $stateParams.itemname)
                        {
                            $scope.items = $scope.articles[i].typedesc;
                            $scope.item = $scope.articles[i].name;
                            setoptions($scope.articles[i].giver);
                            var obj = Objectdata.getitem();
                            obj[$scope.item] = {};
                            obj['item'] = $scope.item;
                            obj[$scope.item].item = $scope.item;
                            obj[$scope.item].options = $scope.options;

                            Objectdata.setitem(obj);

                            break;
                        }
                    }
                }

                $scope.test = "hello";
                $scope.loadoptions = function ()
                {
                    var obj = Objectdata.getitem();

                    $scope.options1 = obj[$scope.item].options;




                }
                $scope.selectevent = function (id)
                {

                    $scope.itemdetails.typedesc = $scope.items[id];


                    var obj = Objectdata.getitem();

                    obj['item'] = $scope.item;
                    obj[$scope.item].item = $scope.item;
                    obj[$scope.item].typedesc = $scope.items[id];

                    obj[$scope.item].options = $scope.options;

                    Objectdata.setitem(obj);




                    $scope.test = "hello1";
                    $state.go('app.selection');



                }


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




                $scope.find = function () {
                    $scope.articles = ObjecttypeService.query();
                    $scope.articles.$promise.then(function (data) {
                        $scope.users = data;

                        getitems();


                    });


                };

                $scope.find();

            }
        ])

        .filter('startFrom', function () {
            return function (input, start) {
                start = +start; //parse to int

                return input.slice(start);
            }
        })



        .controller('InteractionCtrl', function ($scope, $state, $stateParams, $http, $q, $ionicHistory, UserdataService, Authentication, ObjectService, Objectdata, Mystorage) {

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.authentication = Authentication.isloggedin();
                $scope.settings = Mystorage.getObject('settings');

                $scope.dataobj = {senderkey: $scope.settings.userid,
                    senderusername: $scope.settings.username,
                    sendermessage: '',
                    firstuserdata: $stateParams.firstuserdata,
                    seconduserdata: $stateParams.seconduserdata

                };
                $scope.myuserrec = {
                    userid: $scope.settings.userid,
                    username: $scope.settings.username
                };


            });

			 $scope.$on('$ionicView.enter', function () {
			$scope.connectionlist();	 
		     });

            /*
             {"_id":"5654aad8e135b95836e7c230","firstuser":"raju3","firstuserdata":"5617d5853ef6fd142e1e9707","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,
             "exchanges":[{"message":"test1","firstkey":"5617d5853ef6fd142e1e9707"},{"message":"test1","firstkey":"5617d5853ef6fd142e1e9707"}],"mykeys":["5617d5853ef6fd142e1e9707",
             "561a29b188512a5c4aac34bf"],"itemdetails":[{"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"connect3","objectdetails":"in the veninings",
             "objectdesc":"angularjs","owneruserid":"561a29b188512a5c4aac34bf","owneruser":"raju4"},
             {"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"hi33","objectdetails":"paper rangoli","objectdesc":"rangoli","owneruserid":"561a29b188512a5c4aac34bf",
             "owneruser":"raju4"},{"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"ashaskahsksh","objectdetails":"jss","objectdesc":"tj"}],
             "created":"2015-11-24T18:22:16.031Z"}
             */
            /*
             [{"_id":"5664481561bb3f875890790c","firstuser":"ramesh2","firstuserdata":"5663e9ed0df5b8d751968bd3","seconduser":"raju1","seconduserdata":"563f0d0cf915103778ad3b17","__v":0,
             "exchanges":[{"sendermessage":"hello","senderusername":"ramesh2","senderkey":"5663e9ed0df5b8d751968bd3"},
             {"sendermessage":"test","senderusername":"raju1","senderkey":"563f0d0cf915103778ad3b17"}],"mykeys":["5663e9ed0df5b8d751968bd3","563f0d0cf915103778ad3b17"],"itemdetails":[{"objectdesc":"Morning walk","objectdetails":"I plan to go for walk in vijaya bank layout at 6.00 AM.","responsemsg":"raju, welcome","likeduser":"raju1","likeduserid":"563f0d0cf915103778ad3b17"}],"created":"2015-12-06T14:37:09.309Z"}]
             */


            $scope.requests = [];
            $scope.records = [];

            $scope.interactobject = {};

            $scope.data = {
                message: ''
            };
            $scope.myGoBack = function () {
                $ionicHistory.goBack();
            };


            var url = Mystorage.getObject('myconfig').url + "/api";

            $scope.connectionlist = function () {


                $http.post(url + '/messageexchange/getrecords', $scope.myuserrec).success(function (response) {

                    $scope.records = response;
                    $scope.interactobject = findrecord();

					if(typeof $scope.interactobject  != 'undefined') {
                    $scope.exchanges = $scope.interactobject.exchanges.length > 4 ? $scope.interactobject.exchanges.slice(-5) : $scope.interactobject.exchanges;
					}



                }).error(function (response) {

                    $scope.error = response;


                });

            };

            




            function findrecord()
            {
                var tmpobj;

                var alldone = false;


                for (var i = 0; i < $scope.records.length; i++) {
                    if ($scope.records[i].firstuserdata == $stateParams.firstuserdata && $scope.records[i].seconduserdata == $stateParams.seconduserdata) {
                        tmpobj = $scope.records[i];
                        alldone = true;

                        break;
                    } else if ($scope.records[i].firstuserdata == $stateParams.seconduserdata && $scope.records[i].seconduserdata == $stateParams.firstuserdata) {
                        tmpobj = $scope.records[i];
                        alldone = true;




                        break;
                    }
                }


                return tmpobj;


            }
            ;



            /*
             [{"_id":"5654aad8e135b95836e7c230","firstuser":"raju3","firstuserdata":"5617d5853ef6fd142e1e9707","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,
             "exchanges":[{"message":"test1","firstkey":"5617d5853ef6fd142e1e9707"},{"message":"test1","firstkey":"5617d5853ef6fd142e1e9707"},
             {"sendermessage":"","senderusername":"raju4","senderkey":"561a29b188512a5c4aac34bf"},{"sendermessage":"","senderusername":"raju4","senderkey":"561a29b188512a5c4aac34bf"}],"mykeys":["561a29b188512a5c4aac34bf","5617d5853ef6fd142e1e9707"],"itemdetails":[{"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"connect3","objectdetails":"in the veninings","objectdesc":"angularjs","owneruserid":"561a29b188512a5c4aac34bf","owneruser":"raju4"},{"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"hi33","objectdetails":"paper rangoli","objectdesc":"rangoli","owneruserid":"561a29b188512a5c4aac34bf","owneruser":"raju4"},{"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"ashaskahsksh","objectdetails":"jss","objectdesc":"tj"}],"created":"2015-11-24T18:22:16.031Z"},{"_id":"5651efcccf86f3fc2dab695d","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","__v":0,"exchanges":[{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"}],"mykeys":[null,"561a29b188512a5c4aac34bf"],"itemdetails":[],"created":"2015-11-29T07:23:29.076Z"},{"_id":"5651e4619333834c2082d7ee","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,"exchanges":[{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"},{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"},{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"}],"mykeys":["561a29b188512a5c4aac34bf","561a29b188512a5c4aac34bf"],"itemdetails":[{"likeduserid":"561a29b188512a5c4aac34bf","likeduser":"raju4","responsemsg":"my reply13","objectdetails":"in the veninings","objectdesc":"angularjs","owneruserid":"561a29b188512a5c4aac34bf","owneruser":"raju4"}],"created":"2015-11-29T07:23:29.076Z"},{"_id":"5651e47a9333834c2082d7ef","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,"exchanges":[],"mykeys":["561a29b188512a5c4aac34bf","561a29b188512a5c4aac34bf"],"itemdetails":[{"likeduserid":"561a29b188512a5c4aac34bf","likeduser":"raju4","responsemsg":"my reply13","objectdetails":"in the veninings","objectdesc":"angularjs","owneruserid":"561a29b188512a5c4aac34bf","owneruser":"raju4"}],"created":"2015-11-29T07:23:29.076Z"}]
             
             {"_id":"5654aad8e135b95836e7c230","firstuser":"raju3","firstuserdata":"5617d5853ef6fd142e1e9707","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","exchanges":[{"firstkey":"5617d5853ef6fd142e1e9707","message":"test1"},{"firstkey":"5617d5853ef6fd142e1e9707","message":"test1"},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":""},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":""},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":""},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":"test4"},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":"test5"},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":"test6"},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":"test7"},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":"test8"}],"mykeys":["5617d5853ef6fd142e1e9707","561a29b188512a5c4aac34bf"],"created":"2015-11-24T18:22:16.031Z","__v":0,"itemdetails":[{"owneruser":"raju4","owneruserid":"561a29b188512a5c4aac34bf","objectdesc":"angularjs","objectdetails":"in the veninings","responsemsg":"connect3","likeduser":"raju3","likeduserid":"5617d5853ef6fd142e1e9707"},{"owneruser":"raju4","owneruserid":"561a29b188512a5c4aac34bf","objectdesc":"rangoli","objectdetails":"paper rangoli","responsemsg":"hi33","likeduser":"raju3","likeduserid":"5617d5853ef6fd142e1e9707"},{"objectdesc":"tj","objectdetails":"jss","responsemsg":"ashaskahsksh","likeduser":"raju3","likeduserid":"5617d5853ef6fd142e1e9707"}]}
             
             */

            $scope.submitmessage = function () {

                $http.post(url + '/messageexchange/sendinteractionmessage', $scope.dataobj).success(function (response) {

                    $scope.interactobject = response;
					if($scope.interactobject != null) {
                    $scope.exchanges = $scope.interactobject.exchanges.length > 4 ? $scope.interactobject.exchanges.slice(-5) : $scope.interactobject.exchanges;
					}

                    $scope.dataobj.sendermessage = '';

                }).error(function (response) {

                    $scope.error = response;

                });
            };









        })

        .controller('ConnectionsCtrl', function ($scope, $state, $http, $timeout, $ionicHistory, $ionicConfig, UserdataService, Authentication, ObjectService, Objectdata, Mystorage) {

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.authentication = Authentication.isloggedin();
                $scope.settings = Mystorage.getObject('settings');
                $ionicConfig.backButton.previousTitleText(false).text('');


            });
			$scope.$on('$ionicView.enter', function () {
                $timeout(function () {
                if ($scope.authentication == true) {
                    $scope.connectionlist(); //close the popup after 3 seconds for some reason
                }
            }, 1000);

            });



            $scope.requests = [];
            $scope.records = [];



            /*
             [{"_id":"5654aad8e135b95836e7c230","firstuser":"raju3","firstuserdata":"5617d5853ef6fd142e1e9707","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,
             "exchanges":[{"message":"test1","firstkey":"5617d5853ef6fd142e1e9707"},{"message":"test1","firstkey":"5617d5853ef6fd142e1e9707"}],"mykeys":["5617d5853ef6fd142e1e9707",
             "561a29b188512a5c4aac34bf"],"itemdetails":[{"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"connect3","objectdetails":"in the veninings",
             "objectdesc":"angularjs","owneruserid":"561a29b188512a5c4aac34bf","owneruser":"raju4"},
             {"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"hi33","objectdetails":"paper rangoli","objectdesc":"rangoli","owneruserid":"561a29b188512a5c4aac34bf",
             "owneruser":"raju4"},{"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"ashaskahsksh","objectdetails":"jss","objectdesc":"tj"}],
             "created":"2015-11-24T18:22:16.031Z"},{"_id":"5651e47a9333834c2082d7ef","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","seconduser":"raju4",
             "seconduserdata":"561a29b188512a5c4aac34bf","__v":0,"exchanges":[],"mykeys":["561a29b188512a5c4aac34bf","561a29b188512a5c4aac34bf"],"itemdetails":[],"created":"2015-11-25T11:33:55.673Z"},{"_id":"5651efcccf86f3fc2dab695d","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","__v":0,"exchanges":[{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"}],"mykeys":[null,"561a29b188512a5c4aac34bf"],"itemdetails":[],"created":"2015-11-25T11:33:55.673Z"},{"_id":"5651e4619333834c2082d7ee","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,"exchanges":[{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"},{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"},{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"}],"mykeys":["561a29b188512a5c4aac34bf","561a29b188512a5c4aac34bf"],"itemdetails":[{"likeduserid":"561a29b188512a5c4aac34bf","likeduser":"raju4","responsemsg":"my reply13","objectdetails":"in the veninings","objectdesc":"angularjs","owneruserid":"561a29b188512a5c4aac34bf","owneruser":"raju4"}],"created":"2015-11-25T11:33:55.674Z"}]
             
             */

            var url = Mystorage.getObject('myconfig').url + "/api";

            $scope.connectionlist = function () {
                $scope.myuserrec = {
                    userid: $scope.settings.userid,
                    username: $scope.settings.username
                };

                $http.post(url + '/messageexchange/getrecords', $scope.myuserrec).success(function (response) {

                    $scope.records = response;
                    $scope.totalobjects = $scope.records.length;

                }).error(function (response) {

				    
                    $scope.error = response;

                });
            };


            $scope.myGoBack = function () {
                $ionicHistory.goBack();
            };

           

            /*
             [{"_id":"56711fba23df0009126c603b","firstuser":"raju2","firstuserdata":"5670474223df0009126c6032","seconduser":"raju1","seconduserdata":"563f0d0cf915103778ad3b17","__v":0,
             "exchanges":[{"sendermessage":"hi","senderusername":"raju2","senderkey":"5670474223df0009126c6032"},{"sendermessage":"tes","senderusername":"raju1","senderkey":"563f0d0cf915103778ad3b17"},
             {"sendermessage":"sss"},{"sendermessage":"sss"},{"sendermessage":"sss","senderusername":"raju2","senderkey":"5670474223df0009126c6032"}],
             "mykeys":["563f0d0cf915103778ad3b17","5670474223df0009126c6032"],
             "itemdetails":[{"owneruser":"raju2","owneruserid":"5670474223df0009126c6032","objectdesc":"Chatting on movie",
             "objectdetails":"Chatting on movie","responsemsg":"i want to join movie chats","likeduser":"raju1","likeduserid":"563f0d0cf915103778ad3b17"}],
             "created":"2015-12-16T08:24:26.808Z"},
             {"_id":"5664481561bb3f875890790c","firstuser":"ramesh2","firstuserdata":"5663e9ed0df5b8d751968bd3","seconduser":"raju1","seconduserdata":"563f0d0cf915103778ad3b17","__v":0,
             "exchanges":[{"sendermessage":"hello","senderusername":"ramesh2","senderkey":"5663e9ed0df5b8d751968bd3"},{"sendermessage":"test","senderusername":"raju1",
             "senderkey":"563f0d0cf915103778ad3b17"},{"sendermessage":"hi","senderusername":"ramesh2","senderkey":"5663e9ed0df5b8d751968bd3"},
             {"sendermessage":"hi2","senderusername":"raju1","senderkey":"563f0d0cf915103778ad3b17"},{"sendermessage":"hi","senderusername":"raju1","senderkey":"563f0d0cf915103778ad3b17"},
             {"sendermessage":"ghjj","senderusername":"raju1","senderkey":"563f0d0cf915103778ad3b17"},{"sendermessage":"sjsjs","senderusername":"raju1","senderkey":"563f0d0cf915103778ad3b17"},
             {"sendermessage":"ghhhh","senderusername":"raju1","senderkey":"563f0d0cf915103778ad3b17"}],"mykeys":["5663e9ed0df5b8d751968bd3","563f0d0cf915103778ad3b17"],
             "itemdetails":[{"objectdesc":"Morning walk","objectdetails":"I plan to go for walk in vijaya bank layout at 6.00 AM.","responsemsg":"raju, welcome","likeduser":"raju1",
             "likeduserid":"563f0d0cf915103778ad3b17"}],"created":"2015-12-06T14:37:09.309Z"}]
             
             */
            $scope.interact = function (index)
            {
                var interactobject = $scope.records[index];
                Objectdata.setinteractobject(interactobject);

                if ($scope.settings.userid == interactobject.firstuserdata) {
                    $state.go('app.interaction', {firstuserdata: interactobject.firstuserdata, seconduserdata: interactobject.seconduserdata});
                }
                else {
                    $state.go('app.interaction', {firstuserdata: interactobject.seconduserdata, seconduserdata: interactobject.firstuserdata});
                }
            }

            $scope.disconnect = function (index)
            {
                var disconnectobject = $scope.records[index];

                var delobj = {};
                if ($scope.settings.userid == disconnectobject.firstuserdata) {
                    delobj = {firstuserdata: disconnectobject.firstuserdata,
                        seconduserdata: disconnectobject.seconduserdata};
                }
                else {
                    delobj = {firstuserdata: disconnectobject.seconduserdata,
                        seconduserdata: disconnectobject.firstuserdata};
                }

                $http.post(url + '/messageexchange/deleterecord2key', delobj).success(function (response) {


                    $scope.refresh();

                }).error(function (response) {


                });


            }





            $scope.currentPage1 = 0;
            $scope.pageSize1 = 3;

            $scope.nextitem = function ()
            {
                if ($scope.totalobjects > ($scope.currentPage1 + 1) * $scope.pageSize1) {
                    $scope.currentPage1++;
                } else {
                    $scope.currentPage1 = 0;
                }


            }
            $scope.refresh = function ()
            {
                $scope.connectionlist();

            }



        })




        .controller('RequestCtrl', function ($scope, $state, $timeout, $ionicConfig, UserdataService, Authentication, ObjectService, Objectdata, Mystorage) {

            /*
             
             [{"unique_id":"56261e6b6ef90d1816dc46fc561a29b188512a5c4aac34bf1445338757020","objectdetails":"junk reuse","objectdesc":"junk reuse","responsetime":1445499352858,
             "responsemsg":"i like your junksssssssgsgs","likedtime":1445338757020,"loc":[12.952274899999999,77.6438852],"created":"2015-10-20T10:58:51.207Z",
             "object_id":"56261e6b6ef90d1816dc46fc"},
             {"object_id":"560f9e137a78962c91f69ae1","created":"2015-10-03T09:21:23.892Z","loc":[13.0274051,77.5950004],
             "likedtime":1445430989236,"responsemsg":"","responsetime":"","objectdesc":"t1","objectdetails":"d1",
             "unique_id":"560f9e137a78962c91f69ae1561a29b188512a5c4aac34bf1445430989236"},
             {"object_id":"560f9c607a78962c91f69ade","created":"2015-10-03T09:14:08.817Z",
             "loc":[13.0274298,77.5949091],"price":null,"likedtime":1445501731793,"responsemsg":"","responsetime":"","objectdesc":"t1","objectdetails":"d1",
             "unique_id":"560f9c607a78962c91f69ade561a29b188512a5c4aac34bf1445501731793"},
             {"object_id":"5628a1027b97f850175b5193","created":"2015-10-22T08:40:34.204Z",
             "loc":[13.027448,77.5948927],"likedtime":1445503256160,"responsemsg":"","responsetime":"","objectdesc":"t1","objectdetails":"d1",
             "unique_id":"5628a1027b97f850175b5193561a29b188512a5c4aac34bf1445503256160"},
             {"userid":"561a29b188512a5c4aac34bf","username":"raju4",
             "object_id":"562a2b6a4ce946d4292c4c69","created":"2015-10-23T12:43:22.007Z","loc":[13.0274307,77.5950068],"likedtime":1445604233429,"responsemsg":"come to my home2322","responsetime":1448191308322,"objectdesc":"rangoli","objectdetails":"paper rangoli","unique_id":"562a2b6a4ce946d4292c4c69561a29b188512a5c4aac34bf1445604233429"},{"userid":"561a29b188512a5c4aac34bf","username":"raju4","unique_id":"562a2b6a4ce946d4292c4c69561a29b188512a5c4aac34bf1447582573379","objectdetails":"paper rangoli","objectdesc":"rangoli","responsetime":1448191310480,"responsemsg":"tetst22","likedtime":1447582573379,"loc":[13.0274307,77.5950068],"created":"2015-10-23T12:43:22.007Z","object_id":"562a2b6a4ce946d4292c4c69"},{"userid":"561a29b188512a5c4aac34bf","username":"raju4","unique_id":"5628a30c7b97f850175b5194561a29b188512a5c4aac34bf1447586242798","objectdetails":"jss","objectdesc":"tj","responsetime":1448191316810,"responsemsg":"222","likedtime":1447586242798,"loc":[13.0291822,77.5910111],"created":"2015-10-22T08:49:16.344Z","object_id":"5628a30c7b97f850175b5194"},{"userid":"561a29b188512a5c4aac34bf","username":"raju4","unique_id":"564d926a77455a1822c75b9d561a29b188512a5c4aac34bf1447924371155","objectdetails":"in the veninings","objectdesc":"angularjs","responsetime":1448191300005,"responsemsg":"my reply1","likedtime":1447924371155,"loc":[12.952404,77.6438189],"created":"2015-11-19T09:12:10.115Z","object_id":"564d926a77455a1822c75b9d"}]
             
             
             
             (username, userid) I request -->
             (reply userid, username) <--- (owner of objectid)
             
             above is list of objects i liked
             
             
             */

            $scope.$on('$ionicView.enter', function () {



                $timeout(function () {
                    if ($scope.authentication == true) {
                        loaddata(); //close the popup after 3 seconds for some reason
                    }
                }, 1000);
            });

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.authentication = Authentication.isloggedin();
                $scope.settings = Mystorage.getObject('settings');
                $ionicConfig.backButton.previousTitleText(false).text('');

            });

            $scope.requests = [];


            function loaddata() {
                UserdataService.query({'subscribed': 'thisuser'}).$promise.then(function (data) {
                    $scope.requests = data;
                    $scope.totalobjects = $scope.requests.length;

                }, function (error) {

                    $scope.error = error.data;

                });

            }




            $scope.currentPage1 = 0;
            $scope.pageSize1 = 10;
            $scope.doSomething = function ()
            {
                alert("will be available shortly");
            }
            $scope.connections = function ()
            {
                $state.go('app.connections');

            }
            $scope.saveconnection = function (index)
            {



                var obj = $scope.requests[index];

                var tmp = {
                    firstuser: $scope.settings.username,
                    firstuserdata: $scope.settings.userid,
                    seconduser: obj.username,
                    seconduserdata: obj.userid,
                    objectdesc: obj.objectdesc,
                    objectdetails: obj.objectdetails,
                    responsemsg: obj.responsemsg,
                    owneruser: obj.username,
                    owneruserid: obj.userid,
                    likeduser: $scope.settings.username,
                    likeduserid: $scope.settings.userid


                };

                Objectdata.setconnection(tmp);
                $state.go('app.msgexchangeconfirm');

            }
            $scope.nextitem = function ()
            {
                if ($scope.totalobjects > ($scope.currentPage1 + 1) * $scope.pageSize1) {
                    $scope.currentPage1++;
                } else {
                    $scope.currentPage1 = 0;
                }


            }

// http://stackoverflow.com/questions/20584367/how-to-handle-resource-service-errors-in-angularjs

            $scope.refresh = function ()
            {
                UserdataService.query({'subscribed': 'thisuser'}).$promise.then(function (data) {
                    $scope.requests = data;
                    $scope.totalobjects = $scope.requests.length;

                }, function (error) {

                    $scope.error = error.data;

                });

            }


        })

        .controller('ResponseCtrl', function ($scope, $state, $http, $timeout,$ionicScrollDelegate, $ionicConfig, ObjectService, Authentication, Objectdata, Mystorage) {

            /*
             [{"_id":"564d926a77455a1822c75b9d","objectdesc":"angularjs","responses":[{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},
             "likedtime":1447924371155,"replied":false,"responsemsg":"","responsetime":"","object_id":"564d926a77455a1822c75b9d","user_id":"561a29b188512a5c4aac34bf",
             "unique_id":"564d926a77455a1822c75b9d561a29b188512a5c4aac34bf1447924371155"}],"objectdetails":"in the veninings"},{"_id":"56345760573a077856a7c68a","objectdesc":"tsjs","responses":[],"objectdetails":"jsaa"},{"_id":"562a2b6a4ce946d4292c4c69","objectdesc":"rangoli","responses":[{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"likedtime":1445604233429,"replied":true,"responsemsg":"come to my home2","responsetime":1447585415003,"object_id":"562a2b6a4ce946d4292c4c69","user_id":"561a29b188512a5c4aac34bf","unique_id":"562a2b6a4ce946d4292c4c69561a29b188512a5c4aac34bf1445604233429"},{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"likedtime":1447582573379,"replied":false,"responsemsg":"","responsetime":"","object_id":"562a2b6a4ce946d4292c4c69","user_id":"561a29b188512a5c4aac34bf","unique_id":"562a2b6a4ce946d4292c4c69561a29b188512a5c4aac34bf1447582573379"}],"objectdetails":"paper rangoli"},{"_id":"5628a30c7b97f850175b5194","objectdesc":"tj","responses":[{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"likedtime":1447586242798,"replied":false,"responsemsg":"","responsetime":"","object_id":"5628a30c7b97f850175b5194","user_id":"561a29b188512a5c4aac34bf","unique_id":"5628a30c7b97f850175b5194561a29b188512a5c4aac34bf1447586242798"}],"objectdetails":"jss"},{"_id":"5628a1027b97f850175b5193","objectdesc":"t1","responses":[{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"likedtime":1445503256160,"replied":false,"responsemsg":"","responsetime":"","object_id":"5628a1027b97f850175b5193","user_id":"561a29b188512a5c4aac34bf","unique_id":"5628a1027b97f850175b5193561a29b188512a5c4aac34bf1445503256160"}],"objectdetails":"d1"}]
             
             */
            $scope.$on('$ionicView.enter', function () {



                $timeout(function () {
                    if ($scope.authentication == true) {
                        loaddata(); //close the popup after 3 seconds for some reason
                    }
                }, 1000);
            });
            // http://ionicframework.com/docs/api/directive/ionView/
            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.authentication = Authentication.isloggedin();
                $scope.settings = Mystorage.getObject('settings');

                $ionicConfig.backButton.previousTitleText(false).text('');
            });

            $scope.$on('$ionicView.beforeLeave', function () {
				if(typeof $scope.oneobj == 'undefined' || typeof $scope.currentitem == 'undefined')
				{
					return;
				}
                $scope.oneobj_forupdate = $scope.oneobj;
                updateresponse_ifchanged($scope.currentitem);
            });


            var url = Mystorage.getObject('myconfig').url + "/api";

            $scope.connections = function ()
            {
                $state.go('app.connections');

            }

			$scope.keyboardFocus = function(handleValue)
				{
					 $ionicScrollDelegate.$getByHandle(handleValue).scrollTop();
					
					// $ionicScrollDelegate.scrollBy(0, 80, true);
				}

            $scope.saveconnection = function (index)

            {
                /*	
                 [{"_id":"564d926a77455a1822c75b9d","objectdesc":"angularjs","responses":[{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"likedtime":1447924371155,
                 "replied":true,"responsemsg":"my reply1","responsetime":1448191300005,"object_id":"564d926a77455a1822c75b9d","user_id":"561a29b188512a5c4aac34bf","unique_id":"564d926a77455a1822c75b9d561a29b188512a5c4aac34bf1447924371155","username":"raju4",
                 "userid":"561a29b188512a5c4aac34bf"},{"likinguserdata":{"_id":"5617d5853ef6fd142e1e9707","username":"raju3"},"likedtime":1448389120875,"replied":true,"responsemsg":"connect","responsetime":1448389199704,"object_id":"564d926a77455a1822c75b9d","user_id":"5617d5853ef6fd142e1e9707","unique_id":"564d926a77455a1822c75b9d5617d5853ef6fd142e1e97071448389120875","username":"raju4","userid":"561a29b188512a5c4aac34bf"}],"objectdetails":"in the veninings"},{"_id":"56345760573a077856a7c68a","objectdesc":"tsjs","responses":[],"objectdetails":"jsaa"},{"_id":"562a2b6a4ce946d4292c4c69","objectdesc":"rangoli","responses":[{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"likedtime":1445604233429,"replied":true,"responsemsg":"come to my home2322","responsetime":1448191308322,"object_id":"562a2b6a4ce946d4292c4c69","user_id":"561a29b188512a5c4aac34bf","unique_id":"562a2b6a4ce946d4292c4c69561a29b188512a5c4aac34bf1445604233429","username":"raju4","userid":"561a29b188512a5c4aac34bf"},{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"likedtime":1447582573379,"replied":true,"responsemsg":"tetst22","responsetime":1448191310480,"object_id":"562a2b6a4ce946d4292c4c69","user_id":"561a29b188512a5c4aac34bf","unique_id":"562a2b6a4ce946d4292c4c69561a29b188512a5c4aac34bf1447582573379","username":"raju4","userid":"561a29b188512a5c4aac34bf"},{"likinguserdata":{"_id":"5617d5853ef6fd142e1e9707","username":"raju3"},"likedtime":1448389106371,"replied":true,"responsemsg":"hi","responsetime":1448389219620,"object_id":"562a2b6a4ce946d4292c4c69","user_id":"5617d5853ef6fd142e1e9707","unique_id":"562a2b6a4ce946d4292c4c695617d5853ef6fd142e1e97071448389106371","username":"raju4","userid":"561a29b188512a5c4aac34bf"}],"objectdetails":"paper rangoli"},{"_id":"5628a30c7b97f850175b5194","objectdesc":"tj","responses":[{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"likedtime":1447586242798,"replied":true,"responsemsg":"222","responsetime":1448191316810,"object_id":"5628a30c7b97f850175b5194","user_id":"561a29b188512a5c4aac34bf","unique_id":"5628a30c7b97f850175b5194561a29b188512a5c4aac34bf1447586242798","username":"raju4","userid":"561a29b188512a5c4aac34bf"},{"likinguserdata":{"_id":"5617d5853ef6fd142e1e9707","username":"raju3"},"likedtime":1448389093344,"replied":false,"responsemsg":"","responsetime":"","object_id":"5628a30c7b97f850175b5194","user_id":"5617d5853ef6fd142e1e9707","unique_id":"5628a30c7b97f850175b51945617d5853ef6fd142e1e97071448389093344"}],"objectdetails":"jss"},{"_id":"5628a1027b97f850175b5193","objectdesc":"t1","responses":[{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"likedtime":1445503256160,"replied":false,"responsemsg":"","responsetime":"","object_id":"5628a1027b97f850175b5193","user_id":"561a29b188512a5c4aac34bf","unique_id":"5628a1027b97f850175b5193561a29b188512a5c4aac34bf1445503256160"}],"objectdetails":"d1"}]
                 
                 */

                var tmp = {
                    firstuser: $scope.settings.username,
                    firstuserdata: $scope.settings.userid,
                    seconduser: $scope.oneobj.responses[index].likinguserdata.username,
                    seconduserdata: $scope.oneobj.responses[index].likinguserdata._id,
                    objectdesc: $scope.oneobj.objectdesc,
                    objectdetails: $scope.oneobj.objectdetails,
                    responsemsg: $scope.oneobj.responses[index].responsemsg,
                    owneruser: $scope.oneobj.responses[index].username,
                    owneruserid: $scope.oneobj.responses[index].userid,
                    likeduser: $scope.oneobj.responses[index].likinguserdata.username,
                    likeduserid: $scope.oneobj.responses[index].likinguserdata._id


                };

                Objectdata.setconnection(tmp);
                $state.go('app.msgexchangeconfirm');
            }

            function loaddata()
            {
                var promise = ObjectService.query({'user': 'thisuser'});

                promise.$promise.then(function (data) {
                    $scope.objresponses = data;
                    $scope.currentitem = 0;
                    $scope.oneobj = $scope.objresponses[$scope.currentitem];
                    $scope.changedlist = new Array($scope.objresponses.length);

                    $scope.currentobject = $scope.currentitem;
                    $scope.totalobjects = $scope.objresponses.length;


                    for (var i = 0; i < $scope.changedlist.length; i++) {
                        $scope.changedlist[i] = false;
                    }




                }, function (err) {

                    $scope.error = err.data;
                    console.log(err);
                });

            }

            function setreplyobj(pointer)
            {
                $scope.replies[pointer] = [];
                for (var i = 0; i < $scope.oneobj.responses.length; i++) {
                    var singleobjreply = {
                        modified: false,
                        msg: '',
                        likinguser: '',
                        likingobj: ''
                    };
                    $scope.replies[$scope.currentitem].push(singleobjreply);
                }


            }

            $scope.objreplyfun = function (index)
            {
				if($scope.oneobj.responses[index].responsemsg == '')
				{
					
					return;
				}
                $scope.oneobj.responses[index].responsetime = Date.now();
                $scope.oneobj.responses[index].replied = true;
                $scope.oneobj.responses[index].username = $scope.settings.username;
                $scope.oneobj.responses[index].userid = $scope.settings.userid;
                $scope.changedlist[$scope.currentitem] = true;

            }

            function loadonedata()
            {
                if (typeof $scope.oneobj_forupdate == 'undefined') {
                    return;
                }
                var promise = ObjectService.get({
                    objectId: $scope.oneobj_forupdate._id
                });



                promise.$promise.then(function (data) {
                    $scope.thisdata = data;
                    if ($scope.thisdata.responses.length > $scope.oneobj_forupdate.responses.length)
                    {
                        var dest1 = $scope.thisdata.slice($scope.oneobj_forupdate.responses.length);

                        $scope.oneobj_forupdate = $scope.oneobj_forupdate.concat(dest1);

                        updatenow();
                    }
                    else {
                        updatenow();
                    }



                }, function (err) {

                    $scope.error = err.data;


                });

            }
            $scope.deletenow = function ()
            {
                var objecttodelete = {
                    object: $scope.oneobj
                };
                $http.post(url + '/object/deleteobject', objecttodelete).success(function (response) {
                    loaddata();

                }).error(function (response) {

                    $scope.error = response.data;

                });
            }

            function updatenow()
            {
                var objecttoupdate = {
                    object: $scope.oneobj_forupdate
                };
                $http.post(url + '/object/updateresponses', objecttoupdate).success(function (response) {
                    $scope.changedlist[$scope.updateitem] = false;
                }).error(function (response) {

                    $scope.error = response.data;

                });
            }
            function updateresponse_ifchanged(item)
            {
				if(typeof item == 'undefined' || typeof $scope.changedlist == 'undefined')
				{
					return;
				}

                if ($scope.changedlist[item] == false)
                    return;

                loadonedata();

            }
            $scope.submit = function ()
            {
                $scope.oneobj_forupdate = $scope.oneobj;
                updateresponse_ifchanged($scope.currentitem);
                $state.go('app.home');

            }

            $scope.refresh = function ()
            {
                loaddata();
            }


            $scope.nextitem = function ()
            {
                $scope.oneobj_forupdate = $scope.oneobj;
                $scope.updateitem = $scope.currentitem;
                updateresponse_ifchanged($scope.currentitem);

                if ($scope.currentitem < $scope.objresponses.length - 1)
                {
                    $scope.currentitem++;
                }
                else {
                    $scope.currentitem = 0;
                }
                $scope.oneobj = $scope.objresponses[$scope.currentitem];
                $scope.currentobject = $scope.currentitem;

            }

        })
        .controller('SelectionTestCtrl', function ($scope, $cordovaCamera, $cordovaFile, Camera) {


            $scope.images = [];


            $scope.addImage = function () {

                var options = {
                };

                Camera.getPicture(options).then(function (imageURI) {
                    alert(imageURI);
                    console.log(imageURI);
                }, function (err) {
                    alert(err);
                    console.err(err);
                });
                /*    
                 
                 //var Camera = $cordovaCamera;
                 var options = {
                 destinationType : Camera.DestinationType.FILE_URI,
                 sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                 allowEdit : false,
                 encodingType: Camera.EncodingType.JPEG,
                 popoverOptions: CameraPopoverOptions,
                 };
                 alert('hello 3');
                 // 3
                 $cordovaCamera.getPicture(options).then(function(imageData) {
                 //	navigator.camera.getPicture(options).then(function(imageData) {
                 alert('hello 4');
                 // 4
                 onImageSuccess(imageData);
                 
                 function onImageSuccess(fileURI) {
                 alert('hello 4.1 ');
                 createFileEntry(fileURI);
                 }
                 
                 function createFileEntry(fileURI) {
                 window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                 }
                 
                 // 5
                 function copyFile(fileEntry) {
                 var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                 var newName = makeid() + name;
                 
                 window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                 fileEntry.copyTo(
                 fileSystem2,
                 newName,
                 onCopySuccess,
                 fail
                 );
                 },
                 fail);
                 }
                 
                 // 6
                 function onCopySuccess(entry) {
                 $scope.$apply(function () {
                 $scope.images.push(entry.nativeURL);
                 });
                 }
                 
                 function fail(error) {
                 console.log("fail: " + error.code);
                 }
                 
                 function makeid() {
                 var text = "";
                 var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                 
                 for (var i=0; i < 5; i++) {
                 text += possible.charAt(Math.floor(Math.random() * possible.length));
                 }
                 return text;
                 }
                 
                 }, function(err) {
                 console.log(err);
                 });
                 */
            }

            $scope.urlForImage = function (imageName) {
                var name = imageName.substr(imageName.lastIndexOf('/') + 1);
                var trueOrigin = cordova.file.dataDirectory + name;
                return trueOrigin;
            }

            $scope.sendEmail = function () {
                // 1
                var bodyText = "<h2>Look at this images!</h2>";
                if (null != $scope.images) {
                    var images = [];
                    var savedImages = $scope.images;
                    for (var i = 0; i < savedImages.length; i++) {
                        // 2
                        images.push("" + $scope.urlForImage(savedImages[i]));
                        // 3
                        images[i] = images[i].replace('file://', '');
                    }

                    // 4
                    window.plugin.email.open({
                        to: ["saimon@devdactic.com"], // email addresses for TO field
                        cc: Array, // email addresses for CC field
                        bcc: Array, // email addresses for BCC field
                        attachments: images, // file paths or base64 data streams
                        subject: "Just some images", // subject of the email
                        body: bodyText, // email body (for HTML, set isHtml to true)
                        isHtml: true, // indicats if the body is HTML or plain text
                    }, function () {
                        console.log('email view dismissed');
                    },
                            this);
                }
            }
        })


        .controller('SelectionCtrl', function ($scope, $state, $ionicConfig, $ionicHistory, ObjectService, Objectdata, Authentication, Mystorage, $ionicModal, $cordovaCamera, $cordovaFile) {

            var obj = {};

            // http://ionicframework.com/docs/api/directive/ionView/
            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.authentication = Authentication.isloggedin();
                $scope.settings = Mystorage.getObject('settings');

                $ionicConfig.backButton.previousTitleText(false).text('');

                $scope.itemdetails = {};


                obj = Objectdata.getitem();


                $scope.error = '';
                $scope.locationerror = '';

                $scope.item = obj['item'];

                if (typeof obj[$scope.item] == 'undefined') {
                    $scope.error = "Selection not done";
                    return;
                }


                $scope.typedesc1 = obj[$scope.item].typedesc;
                if ($scope.item == null) {
                    $state.go('app.involvement');
                    return;
                }
                $scope.options = obj[$scope.item].options;
                for (var i = 0; i < $scope.options.length; i++) {
                    $scope.options[i].selected = false;
                }

            });


            $scope.$on('$ionicView.enter', function () {

            });


            $scope.clearsel = function ()
            {
                var obj = Objectdata.getitem();

                $scope.item = obj['item'];
                if (obj[$scope.item] != null)
                    obj[$scope.item].action = '';

                obj['item'] = null;
                Objectdata.setitem(obj);

            }


            $scope.maplist = function ()
            {


                $scope.clearsel();

                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });

                $state.go('app.objects');
            }
            $scope.listmaplist = function ()
            {
                $scope.clearsel();
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });

                $state.go('app.listmapitems');
            }




            $scope.selected = function (id)
            {
                $scope.options[id].selected = true;

            }
            $scope.newentry = function (id)
            {
                $scope.action = $scope.options[id].name;
                $scope.itemdetails.objectaction = $scope.options[id].name; // sell, rent etc
                $scope.itemdetails.objecttypedesc = obj[$scope.item].typedesc; //  "used furniture", "c++ training"
                $scope.itemdetails.objecttype = $scope.item; //  "item", "training"

                $scope.prompt();
            }


            $ionicModal.fromTemplateUrl('templates/newentry.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.closeprompt = function () {
                $scope.modal.hide();
            };


            $scope.prompt = function () {
                $scope.modal.show();
            };

            $scope.getPhoto = function () {

                /*
                 // https://github.com/saimon24/devdactic-ionic_image_capture/blob/master/www/js/app.js
                 // 2
                 var options = {
                 destinationType : Camera.DestinationType.FILE_URI,
                 sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                 allowEdit : false,
                 encodingType: Camera.EncodingType.JPEG,
                 popoverOptions: CameraPopoverOptions,
                 };
                 
                 // 3
                 $cordovaCamera.getPicture(options).then(function(imageData) {
                 
                 // 4
                 onImageSuccess(imageData);
                 
                 function onImageSuccess(fileURI) {
                 createFileEntry(fileURI);
                 }
                 
                 function createFileEntry(fileURI) {
                 window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                 }
                 
                 // 5
                 function copyFile(fileEntry) {
                 var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                 var newName = makeid() + name;
                 
                 window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                 fileEntry.copyTo(
                 fileSystem2,
                 newName,
                 onCopySuccess,
                 fail
                 );
                 },
                 fail);
                 }
                 
                 // 6
                 function onCopySuccess(entry) {
                 $scope.$apply(function () {
                 $scope.images.push(entry.nativeURL);
                 });
                 }
                 
                 function fail(error) {
                 console.log("fail: " + error.code);
                 }
                 
                 function makeid() {
                 var text = "";
                 var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                 
                 for (var i=0; i < 5; i++) {
                 text += possible.charAt(Math.floor(Math.random() * possible.length));
                 }
                 return text;
                 }
                 
                 }, function(err) {
                 console.log(err);
                 });
                 */
                /*		
                 Camera.getPicture().then(function(imageURI) {
                 
                 console.log(imageURI);
                 $scope.lastPhoto = imageURI;
                 // $scope.upload(); <-- call to upload the pic
                 },
                 function(err) {
                 console.err(err);
                 }, {
                 quality: 75,
                 targetWidth: 320,
                 targetHeight: 320,
                 saveToPhotoAlbum: false
                 destinationType: Camera.DestinationType.DATA_URL
                 });  */
            };



            $scope.submit = function () {

                $scope.itemdetails.loc = [$scope.settings.address.latitude, $scope.settings.address.longitude];
                var article = new ObjectService($scope.itemdetails);



                article.$save(function (response) {

                    Objectdata.setrecententry(response);

                    $scope.itemdetails.objectdesc = '';
                    $scope.itemdetails.item = '';
                    $scope.itemdetails.desc = '';
                    $scope.itemdetails.price = '';
                    $scope.closeprompt();
                    $state.go('app.additionaldetails');

                }, function (errorResponse) {

                    $scope.error = errorResponse.data;
                    $scope.itemdetails.objectdesc = '';
                    $scope.itemdetails.item = '';
                    $scope.itemdetails.desc = '';
                    $scope.itemdetails.price = '';
                });




                $scope.closeprompt();



            };

            $scope.listobjects = function (id)
            {
                $scope.action = $scope.options[id].name;

                var obj = Objectdata.getitem();

                obj[$scope.item].action = $scope.action;


                Objectdata.setitem(obj);

                $state.go('app.listmapitems');

            }

        })
        .controller('AdditionaldetailsCtrl', function ($scope, $ionicHistory, Authentication, Objectdata) {

            $scope.authentication = Authentication.isloggedin();

            $scope.object = Objectdata.getrecententry();

            $scope.myGoBack = function () {
                $ionicHistory.goBack();
            };





        })

        .controller('MessageExchangeCtrl', function ($scope, $ionicHistory, $http, Objectdata, Authentication, Mystorage) {

            $scope.authentication = Authentication.isloggedin();

            var url = Mystorage.getObject('myconfig').url + "/api";

            $scope.connection = Objectdata.getconnection();


            $scope.confirmconnection = function () {

                $http.post(url + '/messageexchange/sendmessage', $scope.connection).success(function (response) {

                    $ionicHistory.goBack();

                }).error(function (response) {

                    $scope.error = response;

                });
            };

            $scope.myGoBack = function () {
                $ionicHistory.goBack();
            };





        })

        /*
         [{"_id":"5664481561bb3f875890790c","firstuser":"ramesh2","firstuserdata":"5663e9ed0df5b8d751968bd3","seconduser":"raju1","seconduserdata":"563f0d0cf915103778ad3b17","__v":0,
         "exchanges":[{"sendermessage":"hello","senderusername":"ramesh2","senderkey":"5663e9ed0df5b8d751968bd3"},
         {"sendermessage":"test","senderusername":"raju1","senderkey":"563f0d0cf915103778ad3b17"}],"mykeys":["5663e9ed0df5b8d751968bd3","563f0d0cf915103778ad3b17"],
         "itemdetails":[{"objectdesc":"Morning walk","objectdetails":"I plan to go for walk in vijaya bank layout at 6.00 AM.","responsemsg":"raju, welcome",
         "likeduser":"raju1","likeduserid":"563f0d0cf915103778ad3b17"}],"created":"2015-12-06T14:37:09.309Z"}]
         */

        .controller('ItemdetailsCtrl', function ($scope, $ionicHistory, $http, Objectdata, Authentication, Mystorage) {

            $scope.authentication = Authentication.isloggedin();

            var url = Mystorage.getObject('myconfig').url + "/api";

            $scope.subscribe = Objectdata.getitemdata();
            $scope.object = $scope.subscribe.item;

            $scope.expressinterest = function () {

                $http.post(url + '/userdatas/subscriberupdate', $scope.subscribe).success(function (response) {

                    $ionicHistory.goBack();

                }).error(function (response) {

                    $scope.error = response;

                });
            };

            $scope.myGoBack = function () {
                $ionicHistory.goBack();
            };

            $scope.advts = {
                title: '',
                desc: '',
                price: '',
                offer: '',
                noofreserves: '',
                reserveprice: '',
                area: '',
                nooflikes: '',
                likeprice: ''
            };

            $scope.sendadvt = function () {

                $http.post(url + '/advts/sendadvts', $scope.advts).success(function (response) {

                    $ionicHistory.goBack();

                }).error(function (response) {
                    $scope.error = response;
                });
            };






        })




        .controller('HomePlusCtrl', function ($scope, $ionicPopup, $state, $http, $timeout, ObjectService, Authentication, Objectdata, Mystorage) {


            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.authentication = Authentication.isloggedin();
                $scope.settings = Mystorage.getObject('settings');



                $scope.locationerror = '';


                if ($scope.settings.address == null && $scope.authentication == true)
                {
                    $scope.locationerror = "Unable to get location";
                }



            });
			
			$scope.$on('$ionicView.enter', function () {
				$scope.settings = Mystorage.getObject('settings');
				
				if((typeof $scope.settings.address == 'undefined' || typeof Object.keys($scope.settings.address)[0] === 'undefined') && $scope.authentication == true)
				{
						$scope.setlocation();
					    $scope.settings = Mystorage.getObject('settings');
				}

				
						
                    if (($scope.settings.address == null || typeof $scope.settings.address == 'undefined' || typeof Object.keys($scope.settings.address)[0] === 'undefined') && $scope.authentication == true )
                    {
						/*
						 $ionicPopup.alert({
                            title: "Unable to get location.",
                            content: "Check internet and location settings."
                        })
                                .then(function (result) {

                                    //  ionic.Platform.exitApp();

                        });
								
						*/
                        
						$scope.locationerror = "Unable to get location1";
						
                    }
					else {
					
						  $scope.locationerror = '';
					}

			   });
			   

            var url = Mystorage.getObject('myconfig').url + "/api";




			$scope.setlocation = function () {
                

                    if (!navigator.geolocation) {
                        if(typeof Object.keys(Mystorage.getObject('prevlocation'))[0] != 'undefined' )  {
                            $scope.locationerror = "Unable to get location. Using previous location";
                            $scope.settings.address = Mystorage.getObject('prevlocation');
                            Mystorage.setObject('settings', $scope.settings);
                        }
                        else {
                            $scope.locationerror = "Unable to get location. ";
                        }
                        return;
                    }
                    ;
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        console.log('Got pos', pos);
                
                        geocoder = new google.maps.Geocoder();


                
                        $scope.pos.longitude = pos.coords.longitude;
                        $scope.pos.latitude = pos.coords.latitude;
                        var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                
                        geocoder.geocode({'latLng': latlng}, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                

                                var city = "";
                                var state = "";
                                var place = "";
                                var postal_code = "";
                                var country = "";
                                var address = "";
                                //		alert(angular.toJson(results));
                                for (var i = 0, len = results[0].address_components.length; i < len; i++) {
                                    var ac = results[0].address_components[i];
                                    if (ac.types.indexOf("locality") >= 0)
                                        city = ac.long_name;
                                    if (ac.types.indexOf("administrative_area_level_1") >= 0)
                                        state = ac.long_name;
                                    if (ac.types.indexOf("sublocality_level_1") >= 0)
                                        place = ac.long_name;
                                    if (ac.types.indexOf("postal_code") >= 0)
                                        postal_code = ac.long_name;
                                    if (ac.types.indexOf("country") >= 0)
                                        country = ac.long_name;
                                    //	if(ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.long_name;


                                }

                                $scope.pos.city = city;
                                $scope.pos.state = state;
                                $scope.pos.place = place;
                                $scope.pos.country = country;
                                $scope.pos.postal_code = postal_code;

                                //alert(angular.toJson($scope.settings));
                                // alert(angular.toJson($scope.pos));

                                $scope.settings.address = $scope.pos;
                                Mystorage.setObject('settings', $scope.settings);
                                Mystorage.setObject('prevlocation', $scope.settings.address);


                                $http.post(url + '/api/userdataslocationset', $scope.pos).success(function (response) {



                                }).error(function (response) {

                
                                    $scope.error = response;
                                });


                            }
                        });



                
                    }, function (error) {
                       if(typeof Object.keys(Mystorage.getObject('prevlocation'))[0] != 'undefined' )  {
                            $scope.locationerror = "Unable to get location. Using previous location";
                            $scope.settings.address = Mystorage.getObject('prevlocation');
                            Mystorage.setObject('settings', $scope.settings);
                        }
                        else {
                            $scope.locationerror = "Unable to get location. ";
                        }
                
                    }, {maximumAge: 60000, timeout: 2000});



                };
				

            $scope.disableback = function ()
            {

            }
            function loaddata()
            {
                var promise = ObjectService.query({'user': 'thisuser'});

                promise.$promise.then(function (data) {

                    $scope.objresponses = data.length > 4 ? data.slice(-5) : data;
                    $scope.error = '';

                }, function (err) {

                    $scope.error = '';
                });

            }


            $timeout(function () {
                if ($scope.authentication == true) {
                    loaddata(); //close the popup after 3 seconds for some reason
                }
            }, 1000);





            $scope.refresh = function ()
            {
                loaddata();
            }

            $scope.details = {
                name: 'Go Green Express',

                theme: "img/green.jpg"

            };


            $scope.dataobj = {senderkey: $scope.settings.userid,
                senderusername: $scope.settings.username,
                sendermessage: '',
                senttime: Date.now()


            };
            /*
             [{"_id":"5654aad8e135b95836e7c230","firstuser":"raju3","firstuserdata":"5617d5853ef6fd142e1e9707","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,
             "exchanges":[{"message":"test1","firstkey":"5617d5853ef6fd142e1e9707"},{"message":"test1","firstkey":"5617d5853ef6fd142e1e9707"},
             {"sendermessage":"","senderusername":"raju4","senderkey":"561a29b188512a5c4aac34bf"},{"sendermessage":"","senderusername":"raju4","senderkey":"561a29b188512a5c4aac34bf"}],"mykeys":["561a29b188512a5c4aac34bf","5617d5853ef6fd142e1e9707"],"itemdetails":[{"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"connect3","objectdetails":"in the veninings","objectdesc":"angularjs","owneruserid":"561a29b188512a5c4aac34bf","owneruser":"raju4"},{"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"hi33","objectdetails":"paper rangoli","objectdesc":"rangoli","owneruserid":"561a29b188512a5c4aac34bf","owneruser":"raju4"},{"likeduserid":"5617d5853ef6fd142e1e9707","likeduser":"raju3","responsemsg":"ashaskahsksh","objectdetails":"jss","objectdesc":"tj"}],"created":"2015-11-24T18:22:16.031Z"},{"_id":"5651efcccf86f3fc2dab695d","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","__v":0,"exchanges":[{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"}],"mykeys":[null,"561a29b188512a5c4aac34bf"],"itemdetails":[],"created":"2015-11-29T07:23:29.076Z"},{"_id":"5651e4619333834c2082d7ee","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,"exchanges":[{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"},{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"},{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"}],"mykeys":["561a29b188512a5c4aac34bf","561a29b188512a5c4aac34bf"],"itemdetails":[{"likeduserid":"561a29b188512a5c4aac34bf","likeduser":"raju4","responsemsg":"my reply13","objectdetails":"in the veninings","objectdesc":"angularjs","owneruserid":"561a29b188512a5c4aac34bf","owneruser":"raju4"}],"created":"2015-11-29T07:23:29.076Z"},{"_id":"5651e47a9333834c2082d7ef","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,"exchanges":[],"mykeys":["561a29b188512a5c4aac34bf","561a29b188512a5c4aac34bf"],"itemdetails":[{"likeduserid":"561a29b188512a5c4aac34bf","likeduser":"raju4","responsemsg":"my reply13","objectdetails":"in the veninings","objectdesc":"angularjs","owneruserid":"561a29b188512a5c4aac34bf","owneruser":"raju4"}],"created":"2015-11-29T07:23:29.076Z"}]
             
             {"_id":"5654aad8e135b95836e7c230","firstuser":"raju3","firstuserdata":"5617d5853ef6fd142e1e9707","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","exchanges":[{"firstkey":"5617d5853ef6fd142e1e9707","message":"test1"},{"firstkey":"5617d5853ef6fd142e1e9707","message":"test1"},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":""},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":""},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":""},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":"test4"},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":"test5"},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":"test6"},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":"test7"},{"senderkey":"561a29b188512a5c4aac34bf","senderusername":"raju4","sendermessage":"test8"}],"mykeys":["5617d5853ef6fd142e1e9707","561a29b188512a5c4aac34bf"],"created":"2015-11-24T18:22:16.031Z","__v":0,"itemdetails":[{"owneruser":"raju4","owneruserid":"561a29b188512a5c4aac34bf","objectdesc":"angularjs","objectdetails":"in the veninings","responsemsg":"connect3","likeduser":"raju3","likeduserid":"5617d5853ef6fd142e1e9707"},{"owneruser":"raju4","owneruserid":"561a29b188512a5c4aac34bf","objectdesc":"rangoli","objectdetails":"paper rangoli","responsemsg":"hi33","likeduser":"raju3","likeduserid":"5617d5853ef6fd142e1e9707"},{"objectdesc":"tj","objectdetails":"jss","responsemsg":"ashaskahsksh","likeduser":"raju3","likeduserid":"5617d5853ef6fd142e1e9707"}]}
             
             */

            $scope.submitstatus = '';

            $scope.submitmessage = function () {

                $http.post(url + '/comment/sendmessage', $scope.dataobj).success(function (response) {


                    $scope.dataobj.sendermessage = '';
                    $scope.submitstatus = "Message sent";
                    $scope.error = '';

                }).error(function (response) {

                    $scope.error = '';
                    $scope.submitstatus = "Sorry message submit failed";
                });
            };

            $scope.homedataobj = {
                senderkey: $scope.settings.userid,
                senderusername: $scope.settings.username,
                address: $scope.settings.address

            };

            $scope.homeadvt = {};
            /*
             {"_id":"5662974787bc28b41bb6170c","messagearray":[{"messageid":"XKBFbNkwj0l4","ownerkey":"561a29b188512a5c4aac34bf","ownerusername":"raju4",
             "ownermessage":{"title":"NLP training","desc":"This is good for learning","link":"http://ggconnect.net"},"senttime":1449301777083,"replyuserkey":"",
             "replyusername":"","replymessage":"","replytime":""}]}
             */


            /*
             [{"_id":"56629f1620708b20266972ee","messagearray":[{"messageid":"pv3FfMTS0TiL","ownerkey":"561a29b188512a5c4aac34bf","ownerusername":"raju4",
             "ownermessage":{"title":"Ionic classes","desc":"bangalore","link":"http://abcde.com"},"senttime":1449303583511,"replyuserkey":"","replyusername":"","replymessage":"","replytime":""}]},{"_id":"5662974787bc28b41bb6170c","messagearray":[{"messageid":"XKBFbNkwj0l4","ownerkey":"561a29b188512a5c4aac34bf","ownerusername":"raju4","ownermessage":{"title":"NLP training","desc":"This is good for learning","link":"http://ggconnect.net"},"senttime":1449301777083,"replyuserkey":"","replyusername":"","replymessage":"","replytime":""},{"messageid":"pv3FfMTS0TiL","ownerkey":"561a29b188512a5c4aac34bf","ownerusername":"raju4","ownermessage":{"title":"Ionic classes","desc":"bangalore","link":"http://abcde.com"},"senttime":1449303583511,"replyuserkey":"","replyusername":"","replymessage":"","replytime":""},{"messageid":"sLZ9Jhqtkgs4","ownerkey":"561a29b188512a5c4aac34bf","ownerusername":"raju4","ownermessage":{"title":"Nodejs class","desc":"in kalocota","link":"http://sjsjs.com","city":"Bengaluru","place":"jayanagar"},"senttime":1449305064845,"replyuserkey":"","replyusername":"","replymessage":"","replytime":""}]},{"_id":"5662a4660eefd8901ecfd761","messagearray":[{"messageid":"sLZ9Jhqtkgs4","ownerkey":"561a29b188512a5c4aac34bf","ownerusername":"raju4","ownermessage":{"title":"Nodejs class","desc":"in kalocota",
             "link":"http://sjsjs.com","city":"Bengaluru","place":"jayanagar"},
             "senttime":1449305064845,"replyuserkey":"","replyusername":"","replymessage":"","replytime":""}]}]
             */
            $scope.gethomeadvtmessage = function () {

                $http.post(url + '/home/gethomemessage', $scope.homedataobj).success(function (response) {
                    $scope.homeadvt = response;
                    $scope.error = '';
                }).error(function (response) {
                    $scope.error = '';


                });
            };
            $scope.gethomeadvtmessage();


            $scope.replymessage = function () {

                $http.post(url + '/home/sendreplymessage', $scope.dataobj).success(function (response) {

                    $scope.dataobj.sendermessage = '';

                }).error(function (response) {
                    $scope.error = '';


                });
            };

            $scope.advtmessage = {
                title: '',
                desc: '',
                link: '',
                city: '',
                place: '',
                type: ''
            };


            $scope.inserthomemessage = function () {
                $scope.tmpaddr = {
                    place: $scope.advtmessage.place,
                    city: $scope.advtmessage.city,
                    type: $scope.advtmessage.type
                };
                $scope.inserthomedata = {
                    senderkey: $scope.settings.userid,
                    senderusername: $scope.settings.username,
                    address: $scope.tmpaddr,
                    sendermessage: $scope.advtmessage,
                    senttime: Date.now()

                };


                $http.post(url + '/home/insertmessage_homepage', $scope.inserthomedata).success(function (response) {


                    $scope.dataobj.sendermessage = '';

                }).error(function (response) {
                    $scope.error = '';


                });
            };


            $scope.clearhomedata = {
                senderkey: $scope.settings.userid,
                senderusername: $scope.settings.username,
                address: {place: '', city: ''}

            };

            $scope.clearmessage_homepage = function () {

                $http.post(url + '/home/clearmessage_homepage', $scope.clearhomedata).success(function (response) {


                    $scope.error = '';


                }).error(function (response) {
                    $scope.error = '';


                });
            };







        })



        .controller('AppCtrl', function ($scope, $ionicModal, $timeout, AccountDetail, Authentication, Mystorage, ObjecttypeService) {

            $scope.loginData = {};
            $scope.settings = {registered: true};





            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            // Triggered in the login modal to close it
            $scope.closeLogin = function () {
                $scope.modal.hide();
            };

            // Open the login modal
            $scope.login = function () {
                $scope.modal.show();
            };

            $scope.find = function () {


            };

            $scope.find();

            // Perform the login action when the user submits the login form
            $scope.doLogin = function () {
                console.log('Doing login', $scope.loginData);



                AccountDetail.register($scope.loginData)
                        .success(function (dataFromServer, status, headers, config) {

                            $scope.closeLogin();
                        })
                        .error(function (data, status, headers, config) {

                        });

            };
        });

