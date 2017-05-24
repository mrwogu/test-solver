<html>
    <head><title></title></head>
    <body>
        <script language="javascript">
		var n = 9; //ilosc wezlow
		var distTable = [];
		var changeTable = [];
			function prepareData() {
				
				
				for(i=0;i<n;i++){
					distTable[i] = [];
					for(j=0;j<n;j++){
						distTable[i][j] = Math.random()*100;
					}
				}
				
				for(k=0;k<n;k++){
					changeTable[k] = [];
					for(l=0;l<n;l++){
						changeTable[k][l] = 0;
					}
				}
			}
            function doExcelTest() {
				var letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
                var oExcel = new ActiveXObject("Excel.Application");
                oExcel.visible = true;  // Show excel
                var oBook  = oExcel.Workbooks.Add();
                var oSheet = oBook.Activesheet;
				
				var odl = 4; // od gory w excelu zostawiamy 3 wiersze na komorke celu itp;
				
				for(i=0;i<n;i++){
					for(j=0;j<n;j++){
						oSheet.Range(letters[j] + "" + (i + odl + 1)).value = distTable[i][j];
						oSheet.Range(letters[j] + "" + (i + n + 2*odl + 1)).value = changeTable[i][j];
					}
					
				}
				
				//funkcja celu =SUMA.ILOCZYNÓW(A3:I11;A14:I22)
				
				var fCelu = "=SUMPRODUCT(";
				fCelu = fCelu + letters[0] + (odl+1) + ":" + letters[n-1] + (odl+n) + ",";//pierwsza tablica dystansow;
				fCelu = fCelu + letters[0] + (n+2*odl+1) + ":" + letters[n-1] + (2*n + 2*odl) + ")";
				oSheet.Range("A1").value = fCelu;
				
				
				//sumy kolumn 
				
				for(i=0;i<n;i++){
					var formula = "=SUM(";
					formula = formula + letters[i] + (n+2*odl+1) + ":";
					formula = formula + letters[i] + (2*n + 2*odl) + ")";
					oSheet.Range(letters[i] + "2").value = formula;
				}
				
				//sumy wierszy 
				for(i=0;i<n;i++){
					var formula = "=SUM(";
					formula = formula + letters[0] + (n+2*odl+1 + i) + ":";
					formula = formula + letters[n-1] + (n+2*odl+1 + i) + ")";
					oSheet.Range(letters[i] + "3").value = formula;
				}
				
				//roznice pomiedzy tymi gownami
				for(i=0;i<n;i++){
					var formula = "=" + letters[i] + "2" + "-" + letters[i] + "3";
					
					oSheet.Range(letters[i] + "4").value = formula;
				}
				/*
                oSheet.Range("C2").value = "Total Weekend Employees";
                oSheet.Range("C3").value = "=SUM(C5:C6)";
 
                oSheet.Range("C4").value = "Number Starting";
                oSheet.Range("D4").value = "Day Emp Starts";
                oSheet.Range("E4").value = "Friday";
                oSheet.Range("F4").value = "Saturday";
                oSheet.Range("G4").value = "Sunday";
 
                oSheet.Range("D5").value = "Friday";
                oSheet.Range("E5").value = "1";
                oSheet.Range("F5").value = "1";
                oSheet.Range("G5").value = "0";
 
                oSheet.Range("D5").value = "Saturday";
                oSheet.Range("E5").value = "0";
                oSheet.Range("F5").value = "1";
                oSheet.Range("G5").value = "1";
 
                oSheet.Range("D8").value = "Number Working";
                oSheet.Range("E8").value = "=SUMPRODUCT($C$5:$C$6,E5:E6)";
                oSheet.Range("F8").value = "=SUMPRODUCT($C$5:$C$6,F5:F6)";
                oSheet.Range("G8").value = "=SUMPRODUCT($C$5:$C$6,G5:G6)";
 
                oSheet.Range("D9").value = ">=";
 
                oSheet.Range("D10").value = "Number Needed";
                oSheet.Range("E10").value = "25";
                oSheet.Range("F10").value = "35";
                oSheet.Range("G10").value = "12";
				*/
				
				
				// fikcyjna tablica 
				
				
 
               //Make sure we can access the solver addin
				//Forgot the MS kb article that describes this
				var oSolver = oExcel.Addins("Dodatek Solver");
				
				oExcel.Workbooks.Open(oSolver.FullName);
				oExcel.Workbooks(oSolver.Name).RunAutoMacros(1);
				 
				//Populate the solver with the parameters to use (copying what the excel macro produced in lines 45-54)
				//See http://support.microsoft.com/kb/198571 for more details on accessing add-ins
				oExcel.Application.Run(oSolver.Name + "!SolverOk", "$C$3", 2, "0", "$C$5:$C$6");
				oExcel.Application.Run(oSolver.Name + "!SolverAdd", "$C$5:$C$6", 4, "integer");
				oExcel.Application.Run(oSolver.Name + "!SolverAdd", "$E$8:$G$8", 3, "$E$10:$G$10");
				oExcel.Application.Run(oSolver.Name + "!SolverOptions", 100, 100, 0.000001, true, false, 1, 1, 1, 5, false, 0.0001, true);
				 
				//Tell solver to solve the problem. Passed in a true to tell it to keep the numbers and not show the dialog box.
				oExcel.Application.Run(oSolver.Name + "!SolverSolve", true);
				
				console.log(oSheet.Range("G10").value);
				
				//oBook.Saved = true;
				//oExcel.Application.Quit();
				 
/*
    ' equivalent excel macro I want to be able to do from javascript
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    SolverOk SetCell:="$C$3", MaxMinVal:=2, ValueOf:="0", ByChange:="$C$5:$C$6"
    SolverAdd CellRef:="$C$5:$C$6", Relation:=4, FormulaText:="integer"
    SolverAdd CellRef:="$E$8:$G$8", Relation:=3, FormulaText:="$E$10:$G$10"
    SolverOk SetCell:="$C$3", MaxMinVal:=2, ValueOf:="0", ByChange:="$C$5:$C$6"
    SolverOptions MaxTime:=100, Iterations:=100, Precision:=0.000001, AssumeLinear:=True, StepThru:=False, Estimates:=1, Derivatives:=1, SearchOption:=1, IntTolerance:=5, Scaling:=False, Convergence:=0.0001, AssumeNonNeg:=True
    SolverOk SetCell:="$C$3", MaxMinVal:=2, ValueOf:="0", ByChange:="$C$5:$C$6"
    SolverSolve
*/
            }
            //doExcelTest();
        </script>
    </body>
</html>
 
 