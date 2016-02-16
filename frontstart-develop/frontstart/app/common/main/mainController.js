app.controller('mainController', [ '$rootScope', '$scope', '$state', function($rootScope, $scope, $state ) {


	// VARS
	$scope.version 			= '';


	//-----------------------------------------
	//
	// MAIN MENU
	//

	// init
	function init(){
		$scope.version 		= '0.6.0rc';
	}

	// INIT
	init();

}]);