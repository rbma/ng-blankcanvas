listDirectives = angular.module('listDirectives', [])

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