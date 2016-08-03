app.controller('timeCardController', function ($scope, $mdSidenav) {

    $scope.listDays = [];
    $scope.listTimeCard = [];
    $scope.db;
    $scope.total = 30;

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
        $mdSidenav(navID).toggle();
      }
    }
    
    $scope.createList = function() {
        var listDays = [];

        var date = new Date();

        for(var i=0; i<$scope.total; i++) {

            var dt = new Date(date.getTime() - (i * 24 * 60 * 60 * 1000));
            
            dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
            var day = dt.getDate();
            
            var start = "";
            var startInterval = "";
            var finishInterval = "";
            var finish = "";

            for (var j = 0, len = $scope.listTimeCard.length; j<len; j++) {
                if (dt.getTime() == $scope.listTimeCard[j].date) {
                    start = $scope.listTimeCard[j].startTime;
                    startInterval = $scope.listTimeCard[j].startIntervalTime;
                    finishInterval = $scope.listTimeCard[j].finishIntervalTime;
                    finish = $scope.listTimeCard[j].finishTime;
                }
            }

            listDays.push({day:day, date:dt.getTime(), startTime:start, startIntervalTime:startInterval, 
            finishIntervalTime:finishInterval, finishTime:finish});
        }

        $scope.listDays = listDays;
    }

    $scope.generateDate = function() {
        $scope.createList();
        $scope.$apply();
    }

    $scope.openCreate = function(date) {
        location.href="#timeCardCreate/"+date;
    }

    $scope.openDB = function() {

        var request = indexedDB.open("timeCard", 1);

        request.onerror = function(event) {
            console.log("ERROR", event.target.error);
        };

        request.onsuccess = function(event) {
           $scope.db = request.result;
           $scope.getTimeCard();
        };

        request.onupgradeneeded = function(event) {
            var db = event.target.result;
            var objectStore = db.createObjectStore("timeCard", { autoIncrement : true });
            objectStore.transaction.oncomplete = function(event) {
                console.log("The database opened success")
            }
        };
    }

    $scope.getTimeCard = function() {
        var objectStore = $scope.db.transaction("timeCard").objectStore("timeCard");

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                $scope.listTimeCard.push(cursor.value);
                $scope.listTimeCard[$scope.listTimeCard.length-1].localId = cursor.key
                cursor.continue();
                $scope.$apply();
            }
            $scope.generateDate();
        };
    }

    $scope.plusTotal = function() {
        $scope.total += 5;
        $scope.createList();
    }

    $scope.openDB();

});