'use strict';

angular.module('lockAdmin', [
    'ngResource',
    'ngAnimate',
    'angularMoment'
])

    // This limits Angular animations to elements that begin
    // with the classname 'ng-animate-'
    .config(['$animateProvider', function($animateProvider) {
        $animateProvider.classNameFilter(/ng-animate-/);
    }])

    .run([function() {
        // Whatever stuff you want to do when the app starts.
    }])

    .factory('Residence', function($resource) {
    	return $resource('/residence/:id', {
            id: "@id"
        }, {
            update: {
                method: 'PUT'
            }
        });
    })

    .controller('MainController', function($scope, Residence) {

        $scope.loaded = false;

        $scope.residences = [];

        Residence.query(function(success) {
        	$scope.residences = success;
        	$scope.loaded = true;
        });

        $scope.getLatestEvent = function(residence) {
            if (residence.auditLog && residence.auditLog.length > 0) {
                var event = residence.auditLog[residence.auditLog.length-1];
                return event;
            }
            return null;
        };

        $scope.edit = function(index, residence) {
            residence.$update();
        };

        $scope.toggleEditingMode = function(residence) {
            residence.editing = !residence.editing;
        };

        $scope.delete = function(index, residence) {
            Residence.delete({
                id: residence.id
            }, function(success) {
                $scope.residences.splice(index, 1);
               // SimpleNotifications.create('Residence deleted.', 'good');
            });
        };

        $scope.new = function(name) {
            Residence.save({
                name: name
            }, function(success) {
                $scope.residences.push(success);
                $scope.newResidenceName = "";
                //SimpleNotifications.create('Residence "' + success.name + '" created.', 'good');
            });
        };
    })
;