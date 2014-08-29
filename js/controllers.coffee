'use strict'

#CONTROLLERS
listControllers = angular.module('listControllers', [])

listControllers.controller('ListListCtrl', ['$scope', '$http', ($scope, $http) ->
	$scope.lists = []
	$http.get('https://cdn.contentful.com/spaces/6s2rqhmim2vw/entries?content_type=1iKCsUgXpSuSouwuMIYACy&include=1&access_token=c74b04faaa839cf30d0fbf6d0fa5827984c15b39864d7fc3c48a6fe57ad6ad0d').success (data) ->
		$scope.lists = data.items
		console.log $scope.lists


])

listControllers.controller('ListDetailCtrl', [
	'$scope', 
	'$routeParams',
	'$http',
	'$location',
	'$anchorScroll',
	'$sce',
	($scope, $routeParams, $http, $location, $anchorScroll, $sce) ->
		converter = new Showdown.converter()
		$http.get('https://cdn.contentful.com/spaces/6s2rqhmim2vw/entries?sys.id=' + $routeParams.listId + '&include=10&access_token=c74b04faaa839cf30d0fbf6d0fa5827984c15b39864d7fc3c48a6fe57ad6ad0d').success (data) ->
			$scope.list = data
			console.log $scope.list
			$scope.list.items[0].fields.body = converter.makeHtml($scope.list.items[0].fields.body)

		$scope.trust = (body) ->

			return $sce.trustAsHtml(body)

		$scope.gotoBottom = ->
			$location.hash('bottom')

			$anchorScroll()

				# console.log item.includes.Entry.fields.body
				# item.includes.Entry.fields.body = converter.makeHtml(item.includes.Entry.fields.body)
				
])



