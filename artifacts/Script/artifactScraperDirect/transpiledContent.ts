var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var ArtifactScraperDirect;
(function (ArtifactScraperDirect) {
    var artifactInfoBasic = ['id', 'name', 'description'];
    var artifactInfoPackage = __spreadArrays(['package'], artifactInfoBasic);
    var artifactInfoTitle = __spreadArrays(['title'], artifactInfoPackage);
    var artifactInfoLaunchpad = __spreadArrays(['startApp'], artifactInfoTitle);
    var artifactInfoTile = __spreadArrays(['actionApplication', 'settings', 'actionType'], artifactInfoTitle);
    var artifactInfoAPI = __spreadArrays(['apiGroup', 'apiType', 'paths'], artifactInfoPackage);
    var artifactInfoScript = __spreadArrays(['jsscriptGroup', 'globalScripts', 'externalModules', 'entitySets', 'apis'], artifactInfoPackage);
    var artifactInfoApp = ['id', 'package', 'application', 'title', 'description', 'objects'];
    var artifactInfoAdaptive = __spreadArrays(['application', 'connectorid'], artifactInfoPackage);
    var artifactConnector = __spreadArrays(['settings'], artifactInfoPackage);
    var artifactJob = __spreadArrays(['scripts'], artifactInfoPackage);
    var artifactWorkflowDefinition = ['id', 'title', 'package', 'tasks'];
    var artifactScrapers = [
        { artifactType: 'package', repositoryName: 'package', selectInfo: artifactInfoBasic, artifactMapFn: mapDevelopmentPackage },
        { artifactType: 'launchpad', repositoryName: 'launchpad', selectInfo: artifactInfoLaunchpad, artifactMapFn: mapLaunchpad, usingFn: [{ propertyExtractFn: function (x) { return x.cat; }, artifactType: "tile_group" }, mapLaunchpadApp] },
        { artifactType: 'tile_group', repositoryName: 'category', selectInfo: artifactInfoTitle, artifactMapFn: mapLaunchpad, usingFn: [{ propertyExtractFn: function (x) { return x.tilegroups; }, artifactType: "tile_group" }, { propertyExtractFn: function (x) { return x.tiles; }, artifactType: "tile" }] },
        { artifactType: 'tile', repositoryName: 'tile', selectInfo: artifactInfoTile, artifactMapFn: mapLaunchpad, usingFn: [{ propertyExtractFn: function (x) { return x.roles; }, artifactType: "role" }, mapTileChildren] },
        { artifactType: 'api_group', repositoryName: 'api_group', selectInfo: artifactInfoPackage, artifactMapFn: mapInfoPackage, childrenFn: [{ propertyExtractFn: function (x) { return x.apis; }, artifactType: "api" }] },
        { artifactType: 'api', repositoryName: 'api', selectInfo: artifactInfoAPI, artifactMapFn: mapAPI,
            childrenFn: [mapAPIChildren] },
        { artifactType: 'api_operation', repositoryName: 'api', selectInfo: artifactInfoAPI, artifactMapFn: mapAPIOperation },
        //childrenFn: [{propertyExtractFn: x => x.apis, artifactType: "api"}]},
        { artifactType: 'script_project', repositoryName: 'jsscript_group', selectInfo: artifactInfoPackage, artifactMapFn: mapInfoPackage, childrenFn: [{ propertyExtractFn: function (x) { return x.jsscripts; }, artifactType: "script" }] },
        { artifactType: 'script', repositoryName: 'jsscript', selectInfo: artifactInfoScript, artifactMapFn: mapInfoScript, usingFn: [mapScriptUsing, { propertyExtractFn: function (x) { return x.entitySets.map(function (x) { var _a; return (_a = x.id) === null || _a === void 0 ? void 0 : _a.toUpperCase(); }); }, artifactType: "table" },
                { propertyExtractFn: function (x) { return x.globalScripts.map(function (x) { return x.id; }); }, artifactType: "script" },
                { propertyExtractFn: function (x) { return x.apis.map(function (x) { return x.id; }); }, artifactType: "api_operation" }] },
        { artifactType: 'app', repositoryName: 'app_runtime', selectInfo: artifactInfoApp, artifactMapFn: mapApp,
            usingFn: [mapAppUsing] },
        { artifactType: 'adaptive', repositoryName: 'reports', selectInfo: artifactInfoAdaptive, artifactMapFn: mapInfoPackage, usingFn: [{ propertyExtractFn: function (x) { return x.connectorid ? [x.connectorid] : []; }, artifactType: "connector" },
            ] },
        { artifactType: 'connector', repositoryName: 'connector', selectInfo: artifactConnector, artifactMapFn: mapInfoPackage,
            usingFn: [mapConnectorUsing] },
        { artifactType: 'table', repositoryName: 'dictionary', selectInfo: artifactInfoPackage, artifactMapFn: mapInfoPackage },
        { artifactType: 'role', repositoryName: 'role', selectInfo: artifactInfoPackage, artifactMapFn: mapInfoPackage },
        { artifactType: 'authentication', repositoryName: 'api_authentication', selectInfo: artifactInfoPackage, artifactMapFn: mapInfoPackage },
        { artifactType: 'job', repositoryName: 'script_scheduler', selectInfo: artifactJob, artifactMapFn: mapInfoPackage, usingFn: [{ propertyExtractFn: function (x) { return x.scripts.map(function (x) { return x.id; }); }, artifactType: "script" }] },
        { artifactType: 'workflow_definition', repositoryName: "wf_definition", selectInfo: artifactWorkflowDefinition, artifactMapFn: mapInfoWorkflowDefinition,
            usingFn: [mapWorkflowDefinitionUsing] }
    ];
    var apps = [];
    var noPackageId = uuid().toUpperCase();
    var noAPIGroupId = uuid().toUpperCase();
    var noScriptProjectId = uuid().toUpperCase();
    complete({
        scrapeArtifacts: scrapeArtifacts
    });
    function mapDevelopmentPackage(_a) {
        var id = _a.id, name = _a.name;
        return [{
                "type": "package",
                "packageId": null,
                "packageName": null,
                "objectId": id,
                "name": name,
                "id": uuid(),
                "parents": [],
                "children": []
            }];
    }
    function mapLaunchpad(_a) {
        var id = _a.id, name = _a.name, package = _a.package, title = _a.title, description = _a.description;
        return [{
                "type": "",
                "packageId": package,
                "packageName": null,
                "objectId": id,
                "name": name,
                "id": uuid(),
                "parents": [package],
                "children": [],
                "using": [],
                "used_by": [],
                "title": title,
                "description": description
            }];
    }
    function mapLaunchpadApp(data) {
        var using = [];
        if (data.startApp && data.startApp.length > 0) {
            using.push({ id: data.startApp, type: "app" });
        }
        return using;
    }
    function mapInfoPackage(_a) {
        var id = _a.id, name = _a.name, package = _a.package, description = _a.description;
        return [{
                "type": "",
                "packageId": package !== null && package !== void 0 ? package : noPackageId,
                "packageName": null,
                "objectId": id,
                "name": name,
                "id": uuid(),
                "parents": [package],
                "children": [],
                "using": [],
                "used_by": [],
                "description": description
            }];
    }
    function mapTileChildren(data) {
        var _a, _b, _c, _d;
        var children = [];
        var tile = data;
        if (tile.actionApplication && (tile.actionType === 'A' || !tile.actionType)) {
            children.push({ id: tile.actionApplication, type: "app" });
        }
        if (((_b = (_a = tile.settings) === null || _a === void 0 ? void 0 : _a.adaptive) === null || _b === void 0 ? void 0 : _b.id) && tile.actionType === 'F') {
            children.push({ id: tile.settings.adaptive.id.toUpperCase(), type: "adaptive" });
        }
        if ((_d = (_c = tile.settings) === null || _c === void 0 ? void 0 : _c.adaptive) === null || _d === void 0 ? void 0 : _d.idTile) {
            children.push({ id: tile.settings.adaptive.idTile.toUpperCase(), type: "adaptive" });
        }
        /*for (const role of tile.roles) {
            children.push({id: role.id, type: "role"});
        }*/
        return children;
    }
    function mapAPI(_a) {
        var id = _a.id, name = _a.name, description = _a.description, package = _a.package, apiGroup = _a.apiGroup, apiType = _a.apiType, paths = _a.paths;
        return {
            "type": "api",
            "packageId": package !== null && package !== void 0 ? package : noPackageId,
            "objectId": id,
            "name": name,
            "description": description,
            "id": uuid(),
            "children": [],
            "using": [],
            "used_by": [],
            "apiGroup": apiGroup !== null && apiGroup !== void 0 ? apiGroup : noAPIGroupId
        };
        /*for (const path of api.paths) {
                operations.push(
                    {
                        id: path.id,
                        path: path.path,
                        method: path.method,
                        serverScript: path.serverScript,
                        apiId: api.id,
                        apiName: api.name,
                        apiType: api.apiType
                    }
                )
            }*/
    }
    function mapAPIChildren(_a) {
        var paths = _a.paths;
        var children = [];
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var path = paths_1[_i];
            children.push({ id: path.id, type: "api_operation" });
        }
        return children;
    }
    function mapAPIOperation(_a) {
        var id = _a.id, name = _a.name, package = _a.package, apiType = _a.apiType, paths = _a.paths;
        var operations = [];
        for (var _i = 0, paths_2 = paths; _i < paths_2.length; _i++) {
            var path = paths_2[_i];
            var operation = {
                "type": "api_operation",
                "objectId": path.id,
                "name": name + " -> " + path.method + ":" + path.path,
                "id": uuid(),
                "api": id,
                "children": [],
                "using": [],
                "used_by": []
            };
            operations.push(operation);
            if (path.serverScript) {
                operation.using.push({ id: path.serverScript, type: "script" });
            }
            if (apiType === "table") {
                var secondSlash = path.path.indexOf("/", 1);
                var tableName = secondSlash === -1 ? path.path.substring(1) : path.path.substring(1, secondSlash);
                operation.using.push({ id: tableName, type: "table" });
            }
        }
        return operations;
    }
    function mapApp(_a) {
        var _b;
        var id = _a.id, application = _a.application, package = _a.package, title = _a.title, description = _a.description;
        var app = apps.find(function (x) { return x.id === id; });
        return [{
                "type": "",
                "packageId": (_b = app === null || app === void 0 ? void 0 : app.package) !== null && _b !== void 0 ? _b : noPackageId,
                "packageName": null,
                "objectId": id,
                "name": application,
                "id": uuid(),
                "parents": [package],
                "children": [],
                "using": [],
                "used_by": [],
                "title": title,
                "description": description
            }];
    }
    function mapAppUsing(application) {
        var using = [];
        var apiObjects = application.objects.filter(function (object) { return object.fieldType === "neptune.restapi"; });
        for (var i = 0; i < apiObjects.length; i++) {
            using.push({ id: apiObjects[i].restOperation, type: "api_operation", parentId: apiObjects[i].restSource, parentType: "api" });
        }
        return using;
    }
    function mapInfoScript(_a) {
        var id = _a.id, name = _a.name, package = _a.package, description = _a.description, jsscriptGroup = _a.jsscriptGroup;
        return [{
                "type": "",
                "packageId": package !== null && package !== void 0 ? package : noPackageId,
                "packageName": null,
                "objectId": id,
                "name": name,
                "id": uuid(),
                "parents": [package],
                "children": [],
                "using": [],
                "used_by": [],
                "description": description,
                "jsscriptGroup": jsscriptGroup !== null && jsscriptGroup !== void 0 ? jsscriptGroup : noScriptProjectId
            }];
    }
    function mapScriptUsing(scriptData) {
        var using = [];
        return using;
    }
    function mapConnectorUsing(connector) {
        var _a, _b, _c, _d, _e;
        var using = [];
        if ((_a = connector.settings) === null || _a === void 0 ? void 0 : _a.tableid) {
            using.push({ id: (_b = connector.settings) === null || _b === void 0 ? void 0 : _b.tableid, type: "table" });
        }
        if ((_c = connector.settings) === null || _c === void 0 ? void 0 : _c.scriptSel) {
            using.push({ id: (_d = connector.settings) === null || _d === void 0 ? void 0 : _d.scriptSel, type: "script" });
            using.push({ id: (_e = connector.settings) === null || _e === void 0 ? void 0 : _e.scriptRun, type: "script" });
        }
        return using;
    }
    function mapInfoWorkflowDefinition(_a) {
        var id = _a.id, title = _a.title, package = _a.package;
        return [{
                "type": "",
                "packageId": package !== null && package !== void 0 ? package : noPackageId,
                "packageName": null,
                "objectId": id,
                "name": title,
                "id": uuid(),
                "parents": [package],
                "children": [],
                "using": [],
                "used_by": [],
                "title": title,
                "description": ""
            }];
    }
    function mapWorkflowDefinitionUsing(workflow) {
        var using = [];
        for (var _i = 0, _a = workflow.tasks; _i < _a.length; _i++) {
            var task = _a[_i];
            if (task.taskType === 'ScriptTask' && task.scriptId) {
                using.push({ id: task.scriptId, type: "script" });
            }
        }
        return using;
    }
    function scrapeArtifacts() {
        return __awaiter(this, void 0, void 0, function () {
            var manager, allArtifacts, _i, artifactScrapers_1, scraper, res, final, artifactsUsingApps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = p9.manager ? p9.manager : modules.typeorm.getConnection().manager;
                        return [4 /*yield*/, manager.find('app', { select: ["id", , "package"] })];
                    case 1:
                        apps = _a.sent();
                        allArtifacts = [];
                        _i = 0, artifactScrapers_1 = artifactScrapers;
                        _a.label = 2;
                    case 2:
                        if (!(_i < artifactScrapers_1.length)) return [3 /*break*/, 5];
                        scraper = artifactScrapers_1[_i];
                        return [4 /*yield*/, scrapeIt(scraper, manager)];
                    case 3:
                        res = _a.sent();
                        allArtifacts.push(res);
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        ;
                        final = allArtifacts.reduce(function (acc, x) { return (__spreadArrays(acc, x)); }, []);
                        // add special grouping artifacts
                        final.push({ "type": "package", "packageId": null, "packageName": null, "objectId": noPackageId,
                            "name": "NO PACKAGE", "id": uuid(), "parents": [], "children": [] });
                        final.push({ "type": "api_group", "packageId": noPackageId, "packageName": null, "objectId": noAPIGroupId,
                            "name": "NO API GROUP", "id": uuid(), "parents": [noPackageId], "children": [], "using": [], "used_by": [],
                            "description": "Default API Group" });
                        final.push({ "type": "script_project", "packageId": noPackageId, "packageName": null, "objectId": noScriptProjectId,
                            "name": "NO SCRIPT PROJECT", "id": uuid(), "parents": [noPackageId], "children": [], "using": [], "used_by": [],
                            "description": "Default Script Project" });
                        artifactsUsingApps = ['launchpad', 'tile', 'adaptive'];
                        final.forEach(function (x) {
                            var _a, _b, _c;
                            var _d, _e;
                            if (x.type === "package") {
                                (_a = x.children).push.apply(_a, final.filter(function (y) { return y.packageId === x.objectId; }).map(function (x) { return ({ id: x.objectId, type: x.type }); }));
                            }
                            if (x.objectId === noAPIGroupId) {
                                (_b = x.children).push.apply(_b, final.filter(function (y) { return y.apiGroup === x.objectId; }).map(function (x) { return ({ id: x.objectId, type: x.type }); }));
                            }
                            if (x.objectId === noScriptProjectId) {
                                (_c = x.children).push.apply(_c, final.filter(function (y) { return y.jsscriptGroup === x.objectId; }).map(function (x) { return ({ id: x.objectId, type: x.type }); }));
                            }
                            if (artifactsUsingApps.includes(x.type)) {
                                x.using.filter(function (x) { return x.type === 'app'; }).forEach(function (x) { var _a; var app = final.find(function (y) { return y.type === "app" && y.name === x.id; }); x.id = (_a = app === null || app === void 0 ? void 0 : app.objectId) !== null && _a !== void 0 ? _a : x.id; });
                            }
                            if (x.type === "api_operation" && x.using && ((_d = x.using[0]) === null || _d === void 0 ? void 0 : _d.type) === "table") {
                                var table = final.find(function (y) { return y.type === "table" && y.name === x.using[0].id; });
                                if (table) {
                                    x.using[0].id = table.objectId;
                                }
                            }
                            if (x.type !== "package") {
                                var checkedChildren_1 = [];
                                (_e = x.using) === null || _e === void 0 ? void 0 : _e.forEach(function (child) {
                                    var _a;
                                    var childArtifact = final.find(function (z) { return z.objectId === child.id; });
                                    if (childArtifact) {
                                        if (x.type === "tile") {
                                        }
                                        (_a = childArtifact.used_by) === null || _a === void 0 ? void 0 : _a.push({ id: x.objectId, type: x.type });
                                        checkedChildren_1.push(child);
                                    }
                                    else {
                                        //console.log(x.name + ":" + x.type + ":" + child.id + ":" + child.type);
                                    }
                                });
                            }
                        });
                        return [2 /*return*/, final];
                }
            });
        });
    }
    function scrapeIt(scraper, manager) {
        return __awaiter(this, void 0, void 0, function () {
            var artifactData, artifacts, _loop_1, _i, artifactData_1, artifact, requestError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(scraper.artifactType);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, manager.find(scraper.repositoryName, {
                                select: scraper.selectInfo,
                                loadRelationIds: scraper.artifactType !== 'table'
                            })];
                    case 2:
                        artifactData = _a.sent();
                        return [4 /*yield*/, artifactData.map(scraper.artifactMapFn).flat().map(function (x) { x.type = scraper.artifactType; return x; })];
                    case 3:
                        artifacts = _a.sent();
                        if (scraper.usingFn || scraper.childrenFn) {
                            _loop_1 = function (artifact) {
                                var targetArtifact = artifacts.find(function (x) { return x.objectId === artifact.id; });
                                if (scraper.childrenFn) {
                                    var allChildren = [];
                                    var _loop_2 = function (childrenFn) {
                                        if (childrenFn instanceof Function) {
                                            allChildren.push(childrenFn(artifact));
                                        }
                                        else {
                                            allChildren.push(childrenFn.propertyExtractFn(artifact).map(function (x) { return { id: x, type: childrenFn.artifactType }; }));
                                        }
                                    };
                                    for (var _i = 0, _a = scraper.childrenFn; _i < _a.length; _i++) {
                                        var childrenFn = _a[_i];
                                        _loop_2(childrenFn);
                                    }
                                    targetArtifact.children = allChildren.reduce(function (acc, x) { return (__spreadArrays(acc, x)); }, []); //mapArtifactResponseFn(resp.data).map(x => x.id);
                                }
                                if (scraper.usingFn) {
                                    var allUsing = [];
                                    var _loop_3 = function (usingFn) {
                                        if (usingFn instanceof Function) {
                                            allUsing.push(usingFn(artifact));
                                        }
                                        else {
                                            allUsing.push(usingFn.propertyExtractFn(artifact).map(function (x) { return { id: x, type: usingFn.artifactType }; }));
                                            //usingFn.propertyExtractFn(artifact).map(x => { console.log(x) });
                                        }
                                    };
                                    for (var _b = 0, _c = scraper.usingFn; _b < _c.length; _b++) {
                                        var usingFn = _c[_b];
                                        _loop_3(usingFn);
                                    }
                                    targetArtifact.using = allUsing.reduce(function (acc, x) { return (__spreadArrays(acc, x)); }, []); //mapArtifactResponseFn(resp.data).map(x => x.id);
                                }
                            };
                            for (_i = 0, artifactData_1 = artifactData; _i < artifactData_1.length; _i++) {
                                artifact = artifactData_1[_i];
                                _loop_1(artifact);
                            }
                        }
                        return [2 /*return*/, artifacts];
                    case 4:
                        requestError_1 = _a.sent();
                        console.error(requestError_1);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
})(ArtifactScraperDirect || (ArtifactScraperDirect = {}));
