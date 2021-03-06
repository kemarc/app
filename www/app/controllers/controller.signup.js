angular.module('module.view.signup', ['full_starter.factory'])
	.controller('signupCtrl', function($scope,$rootScope,engagementService,$ionicPopup,$state,conversationService,Utils,Popup,$localStorage,interestService,userInterestService) {
   $scope.$on('$ionicView.enter', function() {
    //Clear the Registration Form.
    $scope.user = {
      email: '',
      password: ''
    };
  })
	var ttgLogo = 'https://firebasestorage.googleapis.com/v0/b/trained-to-glory.appspot.com/o/TTG-Symbol-2015-02.png?alt=media&token=b10c70be-92a1-47af-84c4-ab82500922fb';

   $scope.register = function(user) {
		 	//Function to retrieve the account object from the Firebase database and store it on $localStorage.account.
    //Check if form is filled up.
    if (angular.isDefined(user)) {
      Utils.show();
      firebase.database().ref('accounts').orderByChild('userName').equalTo(user.userName).once('value').then(function(accounts) {
        if (accounts.exists()) {
          Utils.message(Popup.errorIcon, Popup.emailAlreadyExists);
        } else {
          //Create Firebase account.
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(function() {
							var userId = firebase.auth().currentUser.uid;
              //Add Firebase account reference to Database. Firebase v3 Implementation.
              firebase.database().ref('accounts').child(userId).set({
                email: user.email,
                firstName: user.firstName,
								userPhoto: ttgLogo,
                lastName: user.lastName,
                userName: user.userName,
                userId: firebase.auth().currentUser.uid,
                dateCreated: Date(),
                provider: 'Firebase'
              }).then(function(response) {
                //Account created successfully, logging user in automatically after a short delay.
                Utils.message(Popup.successIcon, Popup.accountCreateSuccess)
                  .then(function() {
                    getAccountAndLogin(firebase.auth().currentUser.uid);
                  })
                  .catch(function() {
                    //User closed the prompt, proceed immediately to login.
                    getAccountAndLogin(firebase.auth().currentUser.uid);
                  });
                $localStorage.loginProvider = "Firebase";
                $localStorage.email = user.email;
								$localStorage.firstName = user.firstName;
								$localStorage.lastName = user.lastName;
								$localStorage.userName = user.userName;
								$localStorage.photo= ttgLogo;
								$localStorage.userId = firebase.auth().currentUser.uid;
                $localStorage.password = user.password;
              });
            })
            .catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              //Show error message.
              console.log(errorCode);
              switch (errorCode) {
								case 'username is already in use':
									$ionicPopup.show({
										title: 'Error',
										subTitle: error.message,
										buttons: [
											{ text: 'OK' }
										]
									});
									break;
                case 'auth/email-already-in-use':
								$ionicPopup.show({
									title: 'Error',
									subTitle: error.message,
									buttons: [
										{ text: 'OK' }
									]
								});
                  Utils.message(Popup.errorIcon, Popup.emailAlreadyExists);
                  break;
                case 'auth/invalid-email':
								$ionicPopup.show({
									title: 'Error',
									subTitle: error.message,
									buttons: [
										{ text: 'OK' }
									]
								});
                  Utils.message(Popup.errorIcon, Popup.invalidEmail);
                  break;
                case 'auth/operation-not-allowed':
								$ionicPopup.show({
									title: 'Error',
									subTitle: error.message,
									buttons: [
										{ text: 'OK' }
									]
								});
                  Utils.message(Popup.errorIcon, Popup.notAllowed);
                  break;
                case 'auth/weak-password':
								$ionicPopup.show({
									title: 'Error',
									subTitle: error.message,
									buttons: [
										{ text: 'OK' }
									]
								});
                  Utils.message(Popup.errorIcon, Popup.weakPassword);
                  break;
                default:
								$ionicPopup.show({
									title: 'Error',
									subTitle: error.message,
									buttons: [
										{ text: 'OK' }
									]
								});
                  Utils.message(Popup.errorIcon, Popup.errorRegister);
                  break;
              }
            });
        }
      });
    }
  };


	getAccountAndLogin = function(key) {
		firebase.database().ref('accounts/' + key).on('value', function(response) {
			var account = response.val();
			$localStorage.account = account;
		});
		$state.go('tabs.rather');
	};

});
