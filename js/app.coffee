'use strict'

app = angular.module('textfeature', [
	'ngRoute',
	'listControllers'
])

app.config(['$routeProvider', ($routeProvider) ->
	$routeProvider.when('/lists', {
		templateUrl: 'partials/list.html',
		controller: 'ListListCtrl'
		})
	.when('/lists/:listId',{
		templateUrl: 'partials/detail.html',
		controller: 'ListDetailCtrl'
		})
	.otherwise({
			redirectTo: '/lists'
			})
])

app.directive('markdown', ->
	converter = new Showdown.converter()
	return {
		restrict: 'E',
		link: (scope, element, attrs) ->
			htmlText = converter.makeHtml(element.text())
			element.html(htmlText)
	}

)