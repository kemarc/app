angular.module('module.view.explore', [])
	.controller('exploreCtrl', function($scope,$rootScope,appointmentsService,$localStorage,$state,postService,usersService,engagementService,$ionicSideMenuDelegate,$ionicPopover) {
        $scope.newsPopover = $ionicPopover.fromTemplate(newsTemplate, {
                    scope: $scope
        });
				usersService.getUserNames().then(function(results) {
          //create a local object so we can create the datastructure we want
          //so we can use it to show/hide, toggle ui items
          var names = results;
          //make it available to the directive to officially show/hide, toggle
          $scope.names = names;
        });



		$scope.gotoBrowse = function () {
                    $state.go('tabs.news');

        };

        $scope.gotoMatch = function () {
                    $state.go('tabs.match');

        };

       $scope.gotoAccount = function () {
                    $state.go('tabs.account');

        };

        $scope.gotoCoaches = function () {
                    $state.go('tabs.coach');

        };

        $scope.searchPopover = $ionicPopover.fromTemplate(searchTemplate, {
                    scope: $scope
                });

        $ionicSideMenuDelegate.canDragContent(false);

				var publicServices = {
						'post': true,
						'engagement': true,
						'appointments': true
				}

				//for dev purposes only. remove when done
				for (var key in publicServices) {
						if (publicServices[key]) {
								$scope[key + 'Service'] = eval(key + 'Service');
								window[key + 'Service'] = $scope[key + 'Service'];
						}
				}

				$scope.goBack = function (ui_sref) {
						var currentView = $ionicHistory.currentView();
						var backView = $ionicHistory.backView();

						if (backView) {
								//there is a back view, go to it
								if (currentView.stateName == backView.stateName) {
										//if not works try to go doubleBack
										var doubleBackView = $ionicHistory.getViewById(backView.backViewId);
										$state.go(doubleBackView.stateName, doubleBackView.stateParams);
								} else {
										backView.go();
								}
						} else {
								$state.go(ui_sref);
						}
				}

				$scope.toggleLike = function(postId, userId){
					var posts = $scope.news.items;
					console.log({postId: postId, posts: posts, userId: $localStorage.account.userId});
					if(postId in posts){
						var post = $scope.news.items[postId];
						var actionable = post.state.actionable;
						if(actionable){
							post.liked = !post.liked;
							var state = (post.liked)?'like':'unlike';
							return engagementService[state]({type:'post', categoryId:postId, itemId: $localStorage.account.userId});
						}
					}
						return false;
				};

				$scope.toggleCommit = function(postId, userId){
					var posts = $scope.news.items;
					if(postId in posts){
						var post = $scope.news.items[postId];
						var actionable = post.state.actionable;
						if(actionable){
							post.committed = !post.committed;
							var state = (post.committed)?'commit':'decommit';
							return engagementService[state]({type:'post', categoryId:postId, itemId: $localStorage.account.userId});
						}
					}
						return false;
				};

				$ionicSideMenuDelegate.canDragContent(false);

				$scope.delete = function (id) {
						return postService.delete(id);
				};

				$scope.update = function (data) {
						return postService.update(data);
				};

				$scope.event = function () {

						$state.go('tabs.event');
				};

				postService.getNews().then(function(results) {
					//create a local object so we can create the datastructure we want
					//so we can use it to show/hide, toggle ui items
					var news = {
							type: 'image',
							items: results
					};
					for(var id in news.items){
						//check to see if there is a like on this post
						engagementService.liked({category:'post', categoryId:id, itemId: $localStorage.account.userId}).then(function(liked){
							news.items[id].liked = liked;
						});
						engagementService.committed({category:'post', categoryId:id, itemId: $localStorage.account.userId}).then(function(committed){
							news.items[id].committed = committed;
						});
						engagementService.totalLikes({category:'post', categoryId: $localStorage.account.userId}).then(function(totalLikes){
							news.items[id].totalLikes = totalLikes;
						});
						engagementService.totalCommits({category:'post', categoryId: $localStorage.account.userId}).then(function(totalCommits){
							news.items[id].totalCommits = totalCommits;
						});
					}
					//make it available to the directive to officially show/hide, toggle
					$scope.news = news;
				});

	});



				var searchTemplate =
				'<ion-popover-view class="search">' +
				'<ion-content scroll="false">' +
				'<div class="list item-input-inset">' +
				'<label class="item-input-wrapper">' +
				'<i class="icon ion-ios-search placeholder-icon"></i>' +
				'<input type="search" placeholder="Search" ng-model="schoolSearch" ng-model-options="{ debounce: 550 }" ng-change="getSearch(schoolSearch)"></label>' +
				' <i class="icon ion-close" ng-show="schoolSearch" ng-click="getSearch(\'\');popover.hide($event);schoolSearch=\'\'"></i>' +
				'</div>' +
				'<ion-list>' +
				'<ion-item class="user">' +
				'</ion-item>' +
				'</ion-list>'
				'</ion-content>' +
				'</ion-popover-view>';
