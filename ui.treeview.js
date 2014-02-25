angular.module("ui.treeview.tpls", ["template/treeview/treeview.html", "template/treeview/tree_view.html"]);
angular.module("ui.treeview", ['ui.treeview.tpls', 'template/treeview/tree_view.html']).filter('search', [function () {
    return function (inputData, searchText, displayAttr) {
        if (searchText != null && searchText != "") {
            function search(input) {
                var out = undefined;
                if ((input[displayAttr]).toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                    return angular.copy(input);
                }
                if (input.Children) {
                    var out = undefined;
                    for (var i = 0; i < input.Children.length; i++) {
                        var obj = undefined;
                        obj = search(input.Children[i]);
                        if (obj != undefined) {
                            if (out == undefined) {
                                out = angular.copy(input);
                                out.Children = [];
                            }
                            out.Children.push(obj);
                        }
                    }
                }
                if (out != undefined) return out;
                else return undefined;
            }
            var outData = [];
            for (var j = 0; j < inputData.length; j++) {
                var objData = undefined;
                objData = (search(inputData[j]));
                if (objData != undefined) {
                    outData.push(objData);
                }
            }
            return outData;
        }
        else
            return inputData;
    };
}]).controller("TreeViewController", ['$scope', '$attrs', '$filter', function ($scope, $attrs, $filter, $rootScope) {

    var selectedList = [];
    $scope.dataCheck = $attrs.check || false;
    $scope.isChecked = function (checked, data) {
        if (checked == true) {
            selectedList.push(data);
        }
    };
    $scope.initCheckBox = function (data) {
        data.dataCheck = $attrs.check || false;
        if ($attrs.expandAll == true || $attrs.expandAll == "true") {
            data.hide = 'show';
        }
    };
    // $scope.$apply(function () {
    $scope.originalData = angular.copy($scope.treeData);
    //});
    $scope.$watch("searchModel", function (newVal) {
        $scope.treeBindData = $filter('search')($scope.originalData, $scope.searchModel, $attrs.displayAttr);
    });
    $scope.$parent[$attrs.getSelection] = function () {
        return selectedList;
    }
    $scope.toggleShow = function (data) {
        if (data.hide == '' || data.hide == undefined) {
            data.hide = 'show';
        }
        else {
            data.hide = '';
        }
    };
    $scope.check = function (data, check) {
        if (!check) {
            data.confirm = true;
        } else {
            data.confirm = false;
        }
        if ($attrs.checkRec != "false" && data.Children) {
            var cl = data.Children.length;
            for (var i = 0; i < cl; i++) {
                $scope.check(data.Children[i], check);
            }
        }
    }
}]).directive('treeview', function () {
    return {
        restrict: 'EA',
        controller: 'TreeViewController',
        transclude: true,
        replace: true,
        compile: function (elem, attrs) {

        },
        scope: {
            treeData: '=treeviewData',
            uniqueId: '@',
            displayAttr: '@',
            dataCheck: '@',
            getSelection: '@',
            dataCheckRec: '@',
            expandAll: '@',
            searchModel: '=searchModel'
        },
        //scope: { treeData:'@' },
        //link: function (scope, element, attrs) {
        //},
        templateUrl: 'template/treeview/treeview.html'
    };
});
angular.module("template/treeview/treeview.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/treeview/treeview.html",
   "<ul style=\"padding:0px; margin:0px;\">" +
        "<li ng-repeat=\"data in treeBindData  \"  ng-include=\"'template/treeview/tree_view.html'\">" +
        "</li>" +
    "</ul>");
}]);
angular.module("template/treeview/tree_view.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/treeview/tree_view.html",
    "<div class='list-item' ng-init='initCheckBox(data)'>                                                                                                                        " +
    "    <div ng-show='data.Children' ng-class='{show :!data.hide, hide:data.hide}' class='pull-left' ng-click='toggleShow(data)'>    " +
    "        <img class='rightarrow' width='16px' height='16px' style='max-width: 16px' />                                                    " +
    "    </div>                                                                                                                                     " +
    "    <div ng-show='data.Children' ng-class='{hide:!data.hide, show:data.hide }' class='pull-left' ng-click='toggleShow(data)'>      " +
    "        <img class='downarrow' width='16px' height='16px' style='max-width: 16px' />                                                         " +
    "    </div>                                                                                                                                     " +
    "    <div ng-show='!data.Children' ng-class='{show :!data.hide, hide:data.hide}' class='pull-left'></div>               " +
    "    <div class='item' style='padding-left: 0px'>                                                                                               " +
    " <span ng-show=\"data.dataCheck\" type=\"checkbox\" style=\"margin-bottom: 7px;\" ng-class=\"{opacity:data.partial == true}\" ng-click=\"check(data, data.confirm)\" class=\"treecheckBox\">    " +
    "         <img ng-show=\"data.confirm\" class=\"checkBox checkBox-icon\"/>                                             " +
    "     </span>                                                                                                                                         " +
    "     <span ng-click=\"check(data, data.confirm)\">{{data[displayAttr]}}</span>                                                                               " +
    "    </div>                                                                                                                                     " +
    "</div>                                                                                                                                         " +
    "<ul ng-class='{display:!data.hide, displayshow:data.hide}' style='padding-left: 20px'>                                                         " +
    "    <li ng-repeat='data in data.Children' ng-include='\"template/treeview/tree_view.html\"' style='padding-left: 0px;'></li>    " +
    "</ul>                                                                                                                                          "
);
}]);
