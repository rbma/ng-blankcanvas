listDirectives = angular.module('listDirectives', [])

listDirectives.directive('sendHeight', ->
	return{
		restrict: 'A'
		replace: false
		link: ->

			$('.list-wrapper').css
				height: '800px'

			height = $('.list-wrapper').innerHeight()

			$('.list-wrapper').css
				height: height


			sendHeight = (height) ->
				message = {height: height}
				messageJSON = JSON.stringify(message)
				console.log messageJSON
				console.log parent.document.body.clientHeight
				return window.parent.postMessage(messageJSON, '*')


			sendHeight(height)

			$(window).on('resize', ->
				sendHeight(height)
			)
	}
)


listDirectives.directive('sticky', ->

	return{
		restrict: 'A'
		replace: false
		link: ->


			# $.fn.waypoint.defaults = {
			# 	context: 
			# }
			$('.sidebar').waypoint (direction) ->
				if direction == 'down'
					$('.sidebar').addClass "sticky"
				else
					$('.sidebar').removeClass "sticky"

	}

)

listDirectives.directive('flag', ->
	return {
		restrict: 'A'
		replace: false
		link: ->
			$('.list-titles span').waypoint (direction) ->
				if direction == 'down'
					order = $(this).data('order')
					
					#clear actives
					$('.sidebar-item').removeClass "active"

					$(".sidebar-item[data-order=#{order}]").addClass "active"
				else
					order = $(this).data('order')
					
					#clear actives
					$('.sidebar-item').removeClass "active"

					$(".sidebar-item[data-order=#{order}]").addClass "active"
	}
)