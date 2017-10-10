// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.oldcontrollers', 'starter.services'])

        .run(function ($ionicPlatform, $ionicPopup, $state, $http, $cordovaDevice, Mystorage) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                var myconfig = {
                    //    url: "http://localhost:3000"
                    // url: "http://54.187.254.112:3000"
                    url: "http://indiaconnect.ggconnect.net:3000"

                };


                Mystorage.setObject('myconfig', myconfig);

                var settings = Mystorage.getObject('settings');


                var appversion = 'ABC123';



                var url = myconfig.url;

                try {

                    var uu = {
                        uuid: $cordovaDevice.getUUID()
                    };
                    Mystorage.setObject('deviceid', uu);
                    
                }
                catch (err) {
                    
                }



                if (window.Connection) {
                    if (navigator.connection.type == Connection.NONE) {
                        $ionicPopup.alert({
                            title: "Internet Disconnected",
                            content: "The internet is disconnected on your device."
                        })
                                .then(function (result) {

                                    //  ionic.Platform.exitApp();

                                });
                    }
                }

                $http.get(url + '/api/getversion', {}).success(function (response) {

                    var supportedapp = response.supportedapp;
                    if (supportedapp != appversion)
                    {

                        $ionicPopup.alert({
                            title: "New version of app available.",
                            content: "Your app need to be upgraded."
                        })
                                .then(function (result) {

                                    //    ionic.Platform.exitApp();

                                });
                    }






                }).error(function (response) {
                    
                });



                if (settings.email == null || settings.password == null)
                {
                    $state.go('app.register');
                }


                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                    .state('app', {
                        url: "/app",
                        abstract: true,
                        templateUrl: "templates/menu.html",
                        controller: 'AppCtrl'
                    })



                    .state('app.home', {
                        url: "/home",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/home.html",
                                controller: 'HomePlusCtrl'
                            }
                        }
                    })
                    .state('app.login2', {
                        url: "/login2",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/login_reset.html",
                                controller: 'AuthenticationController'
                            }
                        }
                    })

                    .state('app.register', {
                        url: "/register",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/register.html",
                                controller: 'AuthenticationController'
                            }
                        }
                    })
                    .state('app.settings', {
                        url: "/settings",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/settings.html",
                                controller: 'AuthenticationController'
                            }
                        }
                    })

                    .state('app.agenda', {
                        url: "/agenda",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/agenda.html",
                                controller: 'HomePlusCtrl'
                            }
                        }
                    })
                    .state('app.involvement', {
                        url: "/involvement",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/involvement.html",
                                controller: 'ObjecttypeController'
                            }
                        }
                    })
                    .state('app.contribution', {
                        url: "/contribution",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/contribution.html",
                                controller: 'ObjecttypeController'
                            }
                        }
                    })

                    .state('app.items', {
                        url: "/listitems",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/listitems.html",
                                controller: 'ObjecttypeController'
                            }
                        }
                    })
                    .state('app.itemname', {
                        url: "/listitems1/:itemname",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/listitems.html",
                                controller: 'ObjecttypeController'
                            }
                        }
                    })

                    .state('app.selection', {
                        url: "/selection",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/selection.html",
                                controller: 'SelectionCtrl'
                            }
                        }
                    })

                    .state('app.itemdetails', {
                        url: "/itemdetails",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/itemdetails.html",
                                controller: 'ItemdetailsCtrl'
                            }
                        }
                    })
                    .state('app.connections', {
                        url: "/connections",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/connections.html",
                                controller: 'ConnectionsCtrl'
                            }
                        }
                    })
                    .state('app.interaction', {
                        url: "/interaction/:firstuserdata/:seconduserdata",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/interaction.html",
                                controller: 'InteractionCtrl'
                            }
                        }
                    })
                    .state('app.msgexchangeconfirm', {
                        url: "/msgexchangeconfirm",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/msgexchangeconfirm.html",
                                controller: 'MessageExchangeCtrl'
                            }
                        }
                    })
                    .state('app.itemdetails.advt', {
                        url: "/advt",
                        views: {
                            'advContent': {
                                templateUrl: "templates/itemdetailsadvt.html"
                                        //	controller: 'ItemdetailsCtrl'
                            }
                        }
                    })

                    .state('app.additionaldetails', {
                        url: "/additionaldetails",
                        views: {
                            'menuContent': {
                                //  templateUrl: "templates/list-items.client.view.html",
                                templateUrl: "templates/additionaldetails.html",
                                controller: 'AdditionaldetailsCtrl'
                            }
                        }
                    })

                    .state('app.commercial', {
                        url: "/commercial",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/commercial.html",
                                controller: 'CommercialController'
                            }
                        }
                    })
                    .state('app.requests', {
                        url: "/requests",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/requests.html",
                                controller: 'RequestCtrl'
                            }
                        }
                    })
                    .state('app.responses', {
                        url: "/responses",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/responses.html",
                                controller: 'ResponseCtrl'
                            }
                        }
                    })
                    .state('app.objects', {
                        url: "/objects",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/map-objects.html",
                                controller: 'MapofObject'
                            }
                        }
                    })
                    .state('app.listmapitems', {
                        url: "/listmapitems",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/listmapitems.html",
                                controller: 'ListMapofObject'
                            }
                        }
                    })



                    ;
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/home');
        });
