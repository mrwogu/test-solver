angular
	.module('sandbox', ['ngMaterial'])
  .config(function ($mdThemingProvider) {
  	$mdThemingProvider.theme('default')
      .primaryPalette('green')
			.accentPalette('brown');
  })
	.controller('cost', function ($mdDialog) {
		var vm = this;
  	vm.cost = 0;
  
    vm.params = {
      alfa: {
        d1: 0,
        d2: 0,
        d3: 0
      },
      beta: {
        d1: 0,
        d2: 0,
        d3: 0
      }
    };

		vm.supplierCosts = {
      0: {},
      1: {}
    };

    vm.customerCosts = {
      0: {},
      1: {}
    };
    
    vm.data = {
      suppliers: [],	// dostawcy
      brokers: [],		// posrednicy
      customers: [],  // odbiorcy - klienci

      d1: {
        o1: 0,
        o2: 0,
        o3: 0
      },
      d2: {
        o1: 0,
        o2: 0,
        o3: 0
      },
      d3: {
        o1: 0,
        o2: 0,
        o3: 0
      }
    };

    var $init = function () {
      angular.forEach(vm.data, function (d) {
        // d = d1, d2, d3
      });

       vm.data.suppliers.push({
          name: 'D1',
          amount: 0
       });
       
       vm.data.customers.push({
          name: 'O1',
          amount: 0
       });

       vm.data.brokers.push({
          name: 'P1',
          amount: 0
       });
    }

    vm.addCustomerRow = function (ev) {
       vm.data.customers.push({
          name: 'O' + (vm.data.customers.length+1),
          amount: 0
       });
    };
    
     vm.addSupplierRow = function (ev) {
      vm.data.suppliers.push({
          name: 'D' + (vm.data.suppliers.length+1),
          amount: 0
       });
    };
    
    vm.addBrokerRow = function (ev) {
       vm.data.brokers.push({
          name: 'P' + (vm.data.brokers.length+1),
          amount: 0
       });

    };
    
    vm.removeSupplierRow = function (ev) {
    	vm.data.suppliers.pop();
    };

		vm.removeCustomerRow = function (ev) {
      vm.data.customers.pop();
    };
    
    vm.removeBrokerRow = function (ev) {
      vm.data.brokers.pop();
    };
    
    $init();
	});