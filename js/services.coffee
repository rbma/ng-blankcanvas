'use strict'


listServices = angular.module('listServices', [])

listServices.factory('listService', ['ngProgress', (ngProgress) ->
	
	progressInit = ->
		ngProgress.height('10px')
		ngProgress.color('#ffffff')
		ngProgress.start()

	removeSpinner = ->
		ngProgress.complete()
		$('#spinner').animate
			opacity: 0
		, 600, ->
			$('#spinner').remove()

	return{
		progressInit: ->
			progressInit()
		removeSpinner: ->
			removeSpinner()
	}

])

listServices.factory('stickyService', ['$rootScope', '$window', ($rootScope, $window) ->

	getDevice = ->
		width = $window.innerWidth

		if width < 1024
			$('.sidebar').waypoint('destroy')
			return false
		else
			return true

	return{
		getDevice: ->
			getDevice()
	}
])