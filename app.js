function doExcelTest(distTable, changeTable) {
    var n = distTable.length;
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var oExcel = new ActiveXObject("Excel.Application");
    oExcel.visible = false;  // Show excel
    var oBook = oExcel.Workbooks.Add();
    var oSheet = oBook.Activesheet;
    var odl = 4; // od gory w excelu zostawiamy 3 wiersze na komorke celu itp;
    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            oSheet.Range(letters[j] + "" + (i + odl + 1)).value = distTable[i][j];
            oSheet.Range(letters[j] + "" + (i + n + 2 * odl + 1)).value = changeTable[i][j];
        }
    }
    //funkcja celu =SUMA.ILOCZYN�W(A3:I11;A14:I22)
    var fCelu = "=SUMPRODUCT(";
    fCelu = fCelu + letters[0] + (odl + 1) + ":" + letters[n - 1] + (odl + n) + ",";//pierwsza tablica dystansow;
    fCelu = fCelu + letters[0] + (n + 2 * odl + 1) + ":" + letters[n - 1] + (2 * n + 2 * odl) + ")";
    oSheet.Range("A1").value = fCelu;
    //sumy kolumn
    for (var i = 0; i < n; i++) {
        var formula = "=SUM(";
        formula = formula + letters[i] + (n + 2 * odl + 1) + ":";
        formula = formula + letters[i] + (2 * n + 2 * odl) + ")";
        oSheet.Range(letters[i] + "2").value = formula;
    }
    //sumy wierszy
    for (i = 0; i < n; i++) {
        var formula = "=SUM(";
        formula = formula + letters[0] + (n + 2 * odl + 1 + i) + ":";
        formula = formula + letters[n - 1] + (n + 2 * odl + 1 + i) + ")";
        oSheet.Range(letters[i] + "3").value = formula;
    }
    //roznice pomiedzy tymi gownami
    for (i = 0; i < n; i++) {
        var formula = "=" + letters[i] + "2" + "-" + letters[i] + "3";
        oSheet.Range(letters[i] + "4").value = formula;
    }

    // fikcyjna tablica
    //Make sure we can access the solver addin
    //Forgot the MS kb article that describes this
    var oSolver = oExcel.Addins("Dodatek Solver");
    oExcel.Workbooks.Open(oSolver.FullName);
    oExcel.Workbooks(oSolver.Name).RunAutoMacros(1);
    oExcel.Application.Run(oSolver.Name + "!SolverOk", "$A$1", 2, "0", "$A$" + (n + 2 * odl + 1) + ":$" + letters[n - 1] + "$" + (2 * n + 2 * odl), 1, "Simplex LP");
    oExcel.Application.Run(oSolver.Name + "!SolverAdd", "$A$3", 2, "1");        // $Y$3 = 1
    oExcel.Application.Run(oSolver.Name + "!SolverAdd", "$A$" + (n + 2 * odl + 1) + ":$I$" + (2 * n + 2 * odl), 3, "0"); // $O$3:$W$11 >= 0
    oExcel.Application.Run(oSolver.Name + "!SolverAdd", "$B$4:$H$4", 2, "0");   // $P$17:$V$17 = 0
    oExcel.Application.Run(oSolver.Name + "!SolverAdd", "$" + letters[n - 1] + "$4", 2, "1");        // $W$13 = 1
    oExcel.Application.Run(oSolver.Name + "!SolverAdd", "$A$2", 2, "0");        // $O$13 = 0
    oExcel.Application.Run(oSolver.Name + "!SolverAdd", "$" + letters[n - 1] + "$3", 2, "0");        // $Y$11 = 0
    oExcel.Application.Run(oSolver.Name + "!SolverOptions", 100, 100, 0.000001, true, false, 1, 1, 1, 5, false, 0.0001, true);
    //Tell solver to solve the problem. Passed in a true to tell it to keep the numbers and not show the dialog box.
    oExcel.Application.Run(oSolver.Name + "!SolverSolve", true);

    var routeTable = [];
    var costValue = null;
    for (var i = 0; i < n; i++) {
        routeTable[i] = [];
        for (var j = 0; j < n; j++) {
            routeTable[i][j] = oSheet.Range(letters[j] + (i + n + 2 * odl + 1)).value;
        }
    }
    costValue = oSheet.Range("A1").value;

    oBook.Saved = true;
    oExcel.Application.Quit();

    return {
        cost:   costValue,
        routes: routeTable
    };
}

angular
    .module('sandbox', ['ngMaterial'])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('brown');
    })
    .controller('cost', function ($mdDialog) {
        var vm = this;
        vm.nodes = [];
        vm.changeTable = [];
        vm.results = null;

        vm.addNode = function (ev) {
            vm.nodes.push([]);
        };

        vm.removeNode = function (ev) {
            vm.nodes.pop();
        };

        vm.solve = function () {
            for (var k = 0; k < vm.nodes.length; k++) {
                vm.changeTable[k] = [];
                for (var l = 0; l < vm.nodes.length; l++) {
                    vm.changeTable[k][l] = 0;
                }
            }

            vm.results = doExcelTest(vm.nodes, vm.changeTable);
        };

        var $init = function () {
            for (var i = 0; i < 5; i++) vm.addNode.call();
        }

        $init();
    });
