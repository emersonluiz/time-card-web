app.controller('timeCardCreateController', function ($scope, $mdSidenav, $routeParams) {

    $scope.db;
    $scope.listserviceorder = [];
    $scope.toolBar = false;
    $scope.toggleRight = buildToggler('right');
    $scope.open = function() {
        $scope.toolBar = true;
        $mdSidenav('right').toggle();
    }

    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle();
      }
    }

    $scope.openDB = function() {

        var request = indexedDB.open("timeCard", 1);

        request.onerror = function(event) {
            console.log("ERROR", event.target.error);
        };

        request.onsuccess = function(event) {
           $scope.db = request.result;
           $scope.loadTimeCard();
        };

        request.onupgradeneeded = function(event) {
            var db = event.target.result;
            var objectStore = db.createObjectStore("timeCard", { autoIncrement : true });
            objectStore.transaction.oncomplete = function(event) {
                console.log("The database opened success")
            }
        };
    }

    $scope.save = function() {
        if ($scope.localId != undefined && $scope.localId != "" && $scope.localId != null) {
            $scope.edit();
        } else {
            $scope.create();
        }
    }

    $scope.create = function() {

        var object = $scope.db.transaction(["timeCard"], "readwrite").objectStore("timeCard");
        var request = object.add($scope.timecard)

        request.onsuccess = function(event) {
            $scope.timecard = {date:'', startTime:'', startIntervalTime:'',
                           finishIntervalTime:'', finishTime:''};
            $scope.localId = "";
            location.href = "#timeCard";
        };

        request.onerror = function(event) {
            console.log("ERROR", event.target.error);
        };
    }

    $scope.edit = function() {
        var objectStore = $scope.db.transaction(["timeCard"], "readwrite").objectStore("timeCard")

        var request = objectStore.put($scope.timecard, $scope.localId);
        request.onerror = function(event) {
            console.log("ERROR", event.target.error);
        };
        request.onsuccess = function(event) {
            $scope.timecard = {date:'', startTime:'', startIntervalTime:'',
                           finishIntervalTime:'', finishTime:''};
            $scope.localId = "";
            location.href = "#timeCard";
        };
    }

    $scope.loadTimeCard = function() {
        var param = $routeParams.date;
        $scope.timecard = {date:param, startTime:'', startIntervalTime:'',
                           finishIntervalTime:'', finishTime:''};
        $scope.getTimeCard(param);
    }

    $scope.getTimeCard = function(dt) {
        var objectStore = $scope.db.transaction("timeCard").objectStore("timeCard");

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.date == dt) {
                     $scope.timecard.date = dt
                     $scope.timecard.startTime = cursor.value.startTime;
                     $scope.timecard.startIntervalTime = cursor.value.startIntervalTime;
                     $scope.timecard.finishIntervalTime = cursor.value.finishIntervalTime;
                     $scope.timecard.finishTime = cursor.value.finishTime;
                     $scope.localId = cursor.key
                }
                cursor.continue();
                $scope.$apply();
            }
        };
    }

    $scope.openDB();

});