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