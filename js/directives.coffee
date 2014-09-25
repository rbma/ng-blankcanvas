'use strict'

listDirectives = angular.module('listDirectives', [])

listDirectives.directive('sendHeight', ->

	link = ($scope, element, attrs) ->

		height = element.parent().innerHeight()


		reset = ->
			height = element.parent().innerHeight()
			sendHeight(height)

		sendHeight = (height) ->
			message = {height: height}
			messageJSON = JSON.stringify(message)
			console.log messageJSON
			return window.parent.postMessage(messageJSON, '*')

		sendHeight(height)

		$(window).on('resize', ->
			reset()
		)

	
	return{
		restrict: 'A'
		replace: false
		link: link
	}
)


listDirectives.directive('sticky', ->


	link = ($scope, element, attrs) ->
		
		element.waypoint({
			context: '.frame'
			handler: (direction) ->
				if direction == 'down'
					element.addClass "sticky"
				else
					element.removeClass "sticky"
		})


	return{
		
		link: link

	}
)





listDirectives.directive('addWaypoint', ->

	link = ($scope, element, attrs) ->
		element.waypoint({
			context: '.frame'
			offset: 20
			handler: (direction) ->
				if direction == 'down'
					order = $(this).data('order')

					#clear all actives
					$('.sidebar-item').removeClass "active"

					#add to selected one
					$(".sidebar-item[data-order=#{order}]").addClass "active"
				
				else
					order = $(this).data('order')
					
					#clear
					$('.sidebar-item').removeClass "active"
					$(".sidebar-item[data-order=#{order}]").addClass "active"

			})
		

	return{
		link: link
	}
)





