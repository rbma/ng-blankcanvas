listDirectives = angular.module('listDirectives', [])

listDirectives.directive('sendHeight', ->
	return{
		restrict: 'A'
		replace: false
		link: ->


			height = $('.frame').innerHeight()
			console.log height

			reset = ->
				height = $('.frame').innerHeight()
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
	}
)


listDirectives.directive('sticky', ->

	return{
		restrict: 'A'
		replace: false
		link: ->

			mobile = false
			currentlyMobile = false
			width = 0
			prevWidth = 

			reset = ->
				if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
					mobile = true
				
				if $(window).width() <= 1024
					mobile = true
				
				else
					mobile = false



			$('.sidebar').waypoint({
				context: '.frame'
				handler: (direction) ->
					if direction == 'down'
						$('.sidebar').addClass "sticky"
					else
						$('.sidebar').removeClass "sticky"
			})


		

	}

)

