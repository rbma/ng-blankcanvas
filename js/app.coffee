'use strict'

app = angular.module('textfeature', [
	'ngRoute',
	'ngSanitize',
	'listControllers',
	'listDirectives',
	'ui.utils'
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


