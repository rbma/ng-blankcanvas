'use strict'

#CONTROLLERS
listControllers = angular.module('listControllers', [])

client = contentful.createClient
		accessToken: 'c74b04faaa839cf30d0fbf6d0fa5827984c15b39864d7fc3c48a6fe57ad6ad0d'
		space: '6s2rqhmim2vw'


#LIST INDEX PAGE
listControllers.controller('ListListCtrl', ['$scope', '$http', ($scope, $http) ->
	$scope.lists = ""
	
	client.entries({'content_type': '1iKCsUgXpSuSouwuMIYACy', 'include': 1}).done (data) ->
		$scope.$apply(->
			$scope.lists = data
			console.log $scope.lists
		)	
])


#LIST DETAILS PAGE
listControllers.controller('ListDetailCtrl', [
	'$scope', 
	'$routeParams',
	'$http',
	'$location',
	'$anchorScroll',
	'$sce',
	($scope, $routeParams, $http, $location, $anchorScroll, $sce) ->
		
		converter = new Showdown.converter()



		client.entries({'sys.id': $routeParams.listId, 'include': 10}).done (data) ->
			$scope.$apply(->
				$scope.list = data[0]
				console.log $scope.list
				$scope.list.fields.body = converter.makeHtml($scope.list.fields.body)
			)


			height = $('.list-wrapper').innerHeight()
			$('.list-wrapper').css
					height: height

			sendHeight = (height) ->
				console.log height
				message = {height: height}
				messageJSON = JSON.stringify(message)
				return window.parent.postMessage(messageJSON, '*')


			# getHeight = ->
				
			# 	console.log $(document.body).height()
			# 	return $(document).height()

			sendHeight(height)
		

		$scope.trust = (body) ->
			return $sce.trustAsHtml(body)

		$scope.gotoBottom = (order) ->
			old = $location.hash()
			$location.hash(order)
			$anchorScroll()
			#reset to old
			$location.hash(old)


])



