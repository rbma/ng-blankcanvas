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
	'ngProgress',
	($scope, $routeParams, $http, $location, $anchorScroll, $sce, ngProgress) ->
		
		converter = new Showdown.converter()

		ngProgress.height('10px')
		ngProgress.color('#ffffff')

		ngProgress.start()

		removeSpinner = ->
			ngProgress.complete()
			$('#spinner').animate
				opacity: 0
			, 600, ->
				$('#spinner').remove()


		addWaypoints = ->
			$('a.item-order-link').waypoint({
					context: '.frame'
					offset: 20
					handler: (direction) ->
						if direction == 'down'
							order = $(this).data('order')

							#clear actives
							$('.sidebar-item').removeClass "active"
							$(".sidebar-item[data-order=#{order}]").addClass "active"
						else
							order = $(this).data('order')
							#clear
							$('.sidebar-item').removeClass "active"
							$(".sidebar-item[data-order=#{order}]").addClass "active"

				})



		client.entries({'sys.id': $routeParams.listId, 'include': 10}).done (data) ->
			$scope.$apply(->
				$scope.list = data[0]
				console.log $scope.list
				$scope.list.fields.body = converter.makeHtml($scope.list.fields.body)
			)


			addWaypoints()

			setTimeout(removeSpinner, 2000)

			
		$scope.trust = (body) ->
			return $sce.trustAsHtml(body)

		$scope.gotoBottom = (order) ->
			old = $location.hash()
			$location.hash(order)
			$anchorScroll()
			#reset to old
			$location.hash(old)


])



