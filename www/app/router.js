var club = angular.module("app").config(function ($stateProvider, $urlRouterProvider) {
//
// For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/login");
    //    $urlRouterProvider.when('clubears/main', '/clubears/main/clubes');
    $stateProvider
            .state('index', {
                url: "^",
                resolve: {
                    deviceReady: function (CordovaService) {
                        return CordovaService.ready;
                    }, watchLocation: function (GEOLOCATION, deviceReady, $rootScope) {
                        $rootScope.device = deviceReady;
                        switch ($rootScope.locationAuth) {
                            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                                console.log("Permission not requested");
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                                return GEOLOCATION.watchUserLocation();
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.DENIED:
                                console.log("Permission denied");
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                                console.log("Permission permanently denied");
                                break;
                        }
                    },                  
                    route: function (watchLocation, $state) {
                        $state.go('login');

                    }

                }

            })
            .state('login', {
                url: "/login",
                templateUrl: "app/pages/login.html",
                controller: "loginCtrl",
                resolve: {

                    currentAuth: function (Auth) {
                        return Auth.$waitForSignIn();
                    },

                    userObj: function (USERS, currentAuth) {
                        if (currentAuth && currentAuth.uid)
                            return USERS.getUser(currentAuth.uid);
                        else
                            return null;
                    }
                }

            })
            .state('phone', {
                url: "/phone",
                templateUrl: "app/pages/phone.html",
                controller: "phoneCtrl",
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    userObj: function (USERS, currentAuth) {
                        return USERS.getUser(currentAuth.uid);
                    }
                }
            })
            .state('clubears', {
                url: "/clubears",
                abstract: true,
                templateUrl: "app/pages/clubears.html",
                controller: "clubears.Ctrl",
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    }, userObj: function (USERS, currentAuth) {
                        return USERS.getUser(currentAuth.uid);
                    }
                }
            })
            .state('clubears.friends', {

                url: "/friends",
                abstract: true,
                templateUrl: "app/pages/clubears.friends.html",
                controller: "clubears.friends.ctrl",
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    }
                }
            })
            .state('clubears.friends.all', {
                url: "/all-friends",
                templateUrl: "app/pages/clubears.friends.all.html",
                controller: 'clubears.friends.all.ctrl',
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    friends: function (FRIENDS, currentAuth) {
                        FRIENDS.getUserFriends(currentAuth.uid);
                    }
                }
            })
            .state('clubears.friends.search', {
                url: "/search-friends",
                templateUrl: "app/pages/clubears.friends.search.html",
                controller: 'clubears.friends.search.ctrl',
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    }
                }
            })
            .state('clubears.friends.sugg', {
                url: "/suggest-friends",
                templateUrl: "app/pages/clubears.friends.sugg.html",
                controller: 'clubears.friends.sugg.ctrl',
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    faceFriends: function (USERS,currentAuth) {
                        return USERS.getUserFreinds(currentAuth.uid);
                    }
                }
            })
            .state('clubears.contact', {
                url: "/contact",
                templateUrl: "app/pages/contact.html"

                        //
                        //      }
            })
            .state('clubears.aboutus', {
                url: "/aboutus",
                templateUrl: "app/pages/aboutus.html"

                        //
                        //      }
            })
            .state('clubears.main', {

                url: "/main",
                abstract: true,
                templateUrl: "app/pages/clubears.main.html",
                controller: "clubears.main.Ctrl",
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    }
                }
            })
            .state('clubears.main.clubes', {
                url: "/clubes",
                templateUrl: "app/pages/clubears.main.clubes.html",
                controller: 'clubears.main.clubes.Ctrl',
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },

                    clubesNearBy: function (currentAuth, $rootScope) {
                        return $rootScope.clubesNearBy;
                    }
                }
            })
            .state('clubears.main.search', {
                url: "/search",
                templateUrl: "app/pages/clubears.main.search.html"
                        //      controller: mainClubesCtrl
                        //              function($scope) {
                        //        $scope.items = ["A", "List", "Of", "Items"];
                        //      }
            })
            .state('clubears.main.favorites', {
                url: "/favorites",
                controller: 'mainFavoritesCtrl',
                templateUrl: "app/pages/clubears.main.favorites.html"
                        //      controller: mainClubesCtrl
                        //              function($scope) {
                        //        $scope.items = ["A", "List", "Of", "Items"];
                        //      }
            })

            .state('space', {
                url: "/space",
                templateUrl: "app/pages/space.html"
                        //      controller: mainClubesCtrl
                        //              function($scope) {
                        //        $scope.items = ["A", "List", "Of", "Items"];
                        //      }
            })
            .state('space.gallery', {
                url: "/space.gallery",
                templateUrl: "app/pages/space.gallery.html"

                        //
                        //      }
            })
            .state('space.boys', {
                url: "/space.boys",
                templateUrl: "app/pages/space.boys.html"

                        //
                        //      }
            })
            .state('space.girls', {
                url: "/space.girls",
                templateUrl: "app/pages/space.girls.html"

                        //
                        //      }
            })
            .state('clubears.profile', {
                url: "/profile",
                templateUrl: "app/pages/clubears.profile.html",
                controller: "profileCtrl",
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    userObj: function (USERS, currentAuth) {
                        return USERS.getUser(currentAuth.uid);
                    }
                }
            })
            .state('managment', {
                url: "/managment",
                templateUrl: "app/pages/managment.html",
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    userObj: function (USERS, currentAuth) {
                        return USERS.getUser(currentAuth.uid);
                    },
                    userClubesRoll: function (ROLES, currentAuth) {
                        return ROLES.getClubesUserAssign(currentAuth.uid);
                    },
                    clubesAssign: function (CLUBES, userClubesRoll) {
                        return CLUBES.getClubesUserAssign(userClubesRoll);
                    }
                },
                controller: "managment.Ctrl"
            })
            .state('managment.parties', {
                url: "/parties",
                templateUrl: "app/pages/managment.parties.html",
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    currentEvents: function (EVENTS, $stateParams, $q, $state) {
                        if (!$stateParams.clubId || !$stateParams.role) {
                            return $q.reject({code: 'MANAGMENT'});
//                          $state.go('managment');
                        } else
                            return EVENTS.GetFirstEvents($stateParams.clubId);
                    }
                },
                params: {
                    clubId: null,
                    role: null

                },
                controller: "managment.parties.Ctrl"
            })
            .state('managment.parties.newevent', {
                url: "/newevent",
                templateUrl: "app/pages/managment.parties.newevent.html",
                params: {
                    clubId: null,
                    role: null
                },
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    isError: function ($stateParams, $q) {
                        if (!$stateParams.clubId || !$stateParams.role) {
                            return $q.reject({code: 'MANAGMENT'});
                        } else
                            return $q.resolve();
                    }
                },
                controller: "managment.parties.newevent.Ctrl"

            })
            .state('managment.parties.editevent', {
                url: "/editevent",
                templateUrl: "app/pages/managment.parties.editevent.html",
                controller: "managment.parties.editevent.Ctrl",
                params: {
                    eventId: null,
                    clubId: null,
                    role: null
                },
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    currentEvent: function ($stateParams, EVENTS, $q) {
                        if (!$stateParams.clubId || !$stateParams.role) {
                            return $q.reject({code: 'MANAGMENT'});
                        } else
                            return EVENTS.GetOneEvent($stateParams.clubId, $stateParams.eventId);
                    }
                }
            })
            .state('managment.parties.pending', {
                url: "/editpending",
                templateUrl: "app/pages/managment.parties.pending.html",
                controller: "managment.parties.pending.Ctrl",
                params: {
                    eventId: null,
                    clubId: null,
                    role: null
                },
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    usersInEvent: function ($stateParams, EVENTS, $q) {
                        if (!$stateParams.clubId || !$stateParams.role || !$stateParams.eventId) {
                            return $q.reject({code: 'MANAGMENT'});
                        } else
                            return EVENTS.GetUsersInEvent($stateParams.clubId, $stateParams.eventId);
                    }
                }
            })
            .state('managment.parties.approved', {
                url: "/editapproved",
                templateUrl: "app/pages/managment.parties.approved.html",
                controller: "managment.parties.approved.Ctrl",
                params: {
                    eventId: null,
                    clubId: null,
                    role: null
                },
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    usersInEvent: function ($stateParams, EVENTS, $q) {
                        if (!$stateParams.clubId || !$stateParams.role || !$stateParams.eventId) {
                            return $q.reject({code: 'MANAGMENT'});
                        } else
                            return EVENTS.GetUsersInEventByName($stateParams.clubId, $stateParams.eventId);
                    }
                }
            })
            .state('managment.profile', {
                url: "/profile",
                templateUrl: "app/pages/managment.profile.html",
                params: {
                    clubId: null,
                    role: null
                },
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    currentClub: function ($stateParams, CLUBES, $q) {
                        if (!$stateParams.clubId || !$stateParams.role) {
                            return $q.reject({code: 'MANAGMENT'});
                        } else
                            return CLUBES.GetOneClub($stateParams.clubId);
                    },
                    clubPO: function ($stateParams, CLUBES, $q) {
                        if (!$stateParams.clubId || !$stateParams.role) {
//                              $state.go('managment');
                            return $q.reject({code: 'MANAGMENT'});
                        } else
                            return CLUBES.GetClubPOActive($stateParams.clubId);
                    }
                },
                controller: "managment.profile.Ctrl"
            })
            .state('managment.permmisions', {
                url: "/permmisions",
                templateUrl: "app/pages/managment.permmisions.html",
                params: {
                    clubId: null,
                    role: null
                },
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    currentClub: function ($stateParams, CLUBES, $q) {
                        if (!$stateParams.clubId || !$stateParams.role) {
                            return $q.reject({code: 'MANAGMENT'});
                        } else
                            return CLUBES.GetOneClub($stateParams.clubId);
                    },
                    clubPOS: function ($stateParams, CLUBES, $q) {
                        if (!$stateParams.clubId || !$stateParams.role) {
                            return $q.reject({code: 'MANAGMENT'});
                        } else
                            return CLUBES.GetClubPOActive($stateParams.clubId);
                    },
                    ClubManagers: function ($stateParams, CLUBES, $q) {
                        if (!$stateParams.clubId || !$stateParams.role) {
                            return $q.reject({code: 'MANAGMENT'});
                        } else
                            return CLUBES.GetClubManagersActive($stateParams.clubId);
                    }
                },

                controller: "managment.permmisions.Ctrl"
            })
            .state('superuser', {
                url: "/superuser",
                templateUrl: "app/pages/superuser.html",
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    userObj: function (USERS, currentAuth) {
                        return USERS.getUser(currentAuth.uid);
                    }
                },
                controller: "superUserCtrl"
            })

            .state('managment.stats', {
                url: "/stats",
                templateUrl: "app/pages/managment.stats.html"

                        //
                        //      }
            })
            .state('clubears.events', {
                url: "/events",
                templateUrl: "app/pages/events.html"

                        //
                        //      }
            })
            .state('clubears.pictures', {
                url: "/pictures",
                templateUrl: "app/pages/pictures.html"

                        //
                        //      }
            })
            .state('profile.images', {
                url: "/profile.images",
                templateUrl: "app/pages/profile.images.html"

                        //
                        //      }
            })
            .state('clubears.club', {
                url: "/club",
                templateUrl: "app/pages/clubears.club.html",
                controller: 'clubears.club.Ctrl',
                params: {
                    clubId: null
                },
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    userObj: function (USERS, currentAuth) {
                        return USERS.getUser(currentAuth.uid);
                    },
                    currentClub: function (CLUBES, $stateParams) {
                        return CLUBES.GetOneClub($stateParams.clubId);
                    },
                    clubesEvents: function (EVENTS, $stateParams) {
                        return EVENTS.GetFirstEvents($stateParams.clubId);
                    }
                }
            })
            .state('clubears.club.party', {
                url: "/club.party",
                templateUrl: "app/pages/clubears.club.party.html",
                controller: 'clubPartyCtrl',
                resolve: {
                    currentAuth: function (Auth) {
                        return Auth.$requireSignIn();
                    },
                    checkSigned: function (clubesEvents, currentClub, currentAuth, EVENTS) {
                        return EVENTS.checkUserRegisteredToEvent(clubesEvents, currentClub.$id, currentAuth.uid);
                    }
                }
            })
            .state('clubears.club.about', {
                url: "/club.about",
                templateUrl: "app/pages/clubears.club.about.html"
                        //      controller: clubAboutCtrl
                        //              function($scope) {
                        //        $scope.items = ["A", "List", "Of", "Items"];
                        //      }

            })
            .state('clubears.profileUpdate', {
                url: "/profileUpdate",
                templateUrl: "app/pages/clubears.profileUpdate.html"

                        //
                        //      }
            });
});
