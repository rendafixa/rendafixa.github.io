var RendaFixaApp = angular.module('RendaFixaApp', []);

RendaFixaApp.controller('CalculatorController', function ($scope, $http) {
    var selicCentralBankService = 'http://www3.bcb.gov.br/selic/consulta/taxaSelic.do?method=listarTaxaDiaria';
    var selicXpath = "//table[@class='tabelaTaxaSelic']/tbody/tr[last()]/td[2]";
    var selicQuery = 'select * from html where url=\'' + selicCentralBankService + '\' and xpath="' + selicXpath + '"';
    var yqlSelicTaxUrl = '//query.yahooapis.com/v1/public/yql?q=' + fixedEncodeURIComponent(selicQuery) + '&format=json&callback=JSON_CALLBACK';

    $http.jsonp(yqlSelicTaxUrl).success(function (json) {
        if (json.query.results.td) {
            var selicValue = json.query.results.td;
            $scope.selic = selicValue.replace(',', '.');
            $scope.calculate();
        }
    });

    $http.get('taxes.json').success(function (data) {
        if ($scope.selic === undefined) {
            $scope.selic = data.selic;
        }
        $scope.cdi = data.cdi;
    });

    $scope.cdbTax = 83;
    $scope.lcxTax = 90;
    $scope.amount = 1000;
    $scope.period = 181;

    $scope.calculate = function () {
        $scope.poupanca = PoupancaType.calculate($scope.amount, $scope.period);
        $scope.cdb = CDBType.calculate($scope.cdi, $scope.amount, $scope.period, $scope.cdbTax);
        $scope.lcx = LCxType.calculate($scope.cdi, $scope.amount, $scope.period, $scope.lcxTax);
        $scope.tesouroselic = TesouroSelicType.calculate($scope.selic, $scope.amount, $scope.period);
        $scope.percent = AbstractType.calculatePercent($scope);
    };
});

var fixedEncodeURIComponent = function (str) {
    return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A").replace(/\"/g, "%22");
};

/**
 * @TODO do not allow negative amount on any type
 * @TODO do not allow negative period on any type
 */

var PoupancaType = {
    calculate: function (amount, period) {
        // Poupanca is compounded monthly
        if (period < 30) {
            return {'net': amount, 'interest': 0};
        }

        var months = AbstractType.getPeriodInMonths(period);
        var net = math.round(math.pow(1.005, months) * amount, 2);

        return {
            'net': net,
            'interest': math.round(net - amount, 2)
        };
    }
};

var CDBType = {
    calculate: function (cdi, amount, period, percent) {
        var months = AbstractType.getPeriodInMonths(period);
        var tax = math.pow((((cdi * (percent / 100)) / 100) + 1), (1 / 12));

        var gross = math.round(math.pow(tax, months) * amount, 2);
        var iof = AbstractType.calculateIof(gross - amount, period);
        var irpf = AbstractType.calculateIrpf(gross - amount, period);
        var net = math.round(gross - iof - irpf.amount, 2);

        return {
            'gross': gross,
            'irpf': irpf,
            'iof': iof,
            'net': net,
            'interest': math.round(net - amount, 2)
        };
    }
};

var LCxType = {
    calculate: function (cdi, amount, period, percent) {
        var months = AbstractType.getPeriodInMonths(period);
        var rate = math.pow((((cdi * (percent / 100)) / 100) + 1), (1 / 12));
        var net = math.round(math.pow(rate, months) * amount, 2);

        return {
            'net': net,
            'interest': math.round(net - amount, 2)
        };
    }
};

var TesouroSelicType = {
    cblc: 0.3,

    calculate: function (selic, amount, period) {
        var months = AbstractType.getPeriodInMonths(period);
        var tax = math.pow(((selic / 100) + 1), (1 / 12));

        var gross = math.round(math.pow(tax, months) * amount, 2);
        var iof = AbstractType.calculateIof(gross - amount, period);
        var irpf = AbstractType.calculateIrpf(gross - amount, period);
        var cblc = this.calculateCblc(amount, period);
        var net = math.round(gross - iof - irpf.amount - cblc, 2);

        return {
            'gross': gross,
            'irpf': irpf,
            'iof': iof,
            'cblc': cblc,
            'net': net,
            'interest': math.round(net - amount, 2)
        };
    },

    calculateCblc: function (amount, period) {
        var semesters = math.ceil(period / 180);
        return amount * ((this.cblc / 100) / 2) * semesters;
    }
};

var AbstractType = {
    getPeriodInMonths: function (period) {
        if (period < 0) {
            return 0;
        }

        return math.floor(period / 30);
    },

    calculateIof: function (amount, period) {
        if (period == 0 || period >= 30 || amount == 0) {
            return 0;
        }

        var percent = (100 - math.ceil(period * 10 / 3)) / 100;
        return math.round(percent * amount, 2);
    },

    calculateIrpf: function (amount, period) {
        var branch = 22.5;

        if (period > 720) {
            branch = 15;
        } else if (period > 360) {
            branch = 17.5;
        } else if (period > 180) {
            branch = 20;
        }

        var taxAmount = math.round(amount * (branch / 100), 2);

        return {
            'branch': branch,
            'amount': taxAmount
        }
    },

    calculatePercent: function (scope) {
        var netValues = [scope.lcx.interest, scope.cdb.interest, scope.tesouroselic.interest, scope.poupanca.interest];
        var max = math.max(netValues) / 100;

        if (max === 0) {
            max = 1;
        }

        return {
            'lcx': math.round(scope.lcx.interest / max, 2),
            'cdb': math.round(scope.cdb.interest / max, 2),
            'poupanca': math.round(scope.poupanca.interest / max, 2),
            'tesouroselic': math.round(scope.tesouroselic.interest / max, 2)
        };
    }

}
