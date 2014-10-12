'use strict'

#CONTROLLERS
listControllers = angular.module('listControllers', [])




#LIST INDEX PAGE
listControllers.controller('ListListCtrl', ['$scope', '$http', 'contentfulClient', ($scope, $http, contentfulClient) ->
	$scope.lists = ""
	

	contentfulClient.entries({'content_type': '1iKCsUgXpSuSouwuMIYACy', 'include': 1}).then (data) ->
		$scope.lists = data
		console.log $scope.lists
])







#LIST DETAILS PAGE
listControllers.controller('ListDetailCtrl', [
	'$scope', 
	'$routeParams',
	'$http',
	'$location',
	'$sce',
	'listService',
	'contentfulClient'
	($scope, $routeParams, $http, $location, $sce, listService, contentfulClient) ->
		
		converter = new Showdown.converter()

		
		#kick off progress bar
		listService.progressInit()

		#get data
		contentfulClient.entries({'sys.id': $routeParams.listId, 'include': 10}).then (data) ->
			$scope.list = data[0]
			console.log $scope.list
			$scope.list.fields.body = converter.makeHtml($scope.list.fields.body)

			#loop through each item and convert to html
			for item in $scope.list.fields.individualListItems
				console.log item
				item.fields.body = converter.makeHtml(item.fields.body)

			listService.removeSpinner()

			
		$scope.trust = (body) ->
			return $sce.trustAsHtml(body)



])



