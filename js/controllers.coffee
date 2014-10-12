'use strict'

#CONTROLLERS
listControllers = angular.module('listControllers', [])




#LIST INDEX PAGE
listControllers.controller('ListListCtrl', ['$scope', '$http', 'contentfulClient', ($scope, $http, contentfulClient) ->
	$scope.lists = ""
	

	contentfulClient.entries({'content_type': '1iKCsUgXpSuSouwuMIYACy', 'include': 1}).then (data) ->
		$scope.lists = data
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
	'stickyService'
	($scope, $routeParams, $http, $location, $sce, listService, contentfulClient, stickyService) ->
		
		converter = new Showdown.converter()

		$scope.desktop = true

		
		#kick off progress bar
		listService.progressInit()

		#get data
		contentfulClient.entries({'sys.id': $routeParams.listId, 'include': 10}).then (data) ->
			$scope.list = data[0]
			console.log $scope.list
			$scope.list.fields.body = converter.makeHtml($scope.list.fields.body)

			#loop through each item and convert to html
			for item in $scope.list.fields.individualListItems
				item.fields.body = converter.makeHtml(item.fields.body)

			listService.removeSpinner()


		#only show sticky if on desktop
		# $scope.desktop = stickyService.getDevice()

		#check again for device on resize
		# $(window).on('resize', ->
		# 	$scope.desktop = stickyService.getDevice()
		# 	)

			
		$scope.trust = (body) ->
			return $sce.trustAsHtml(body)



])



