namespace ArtifactScraperDirect {
type SelectInfo = string[];

interface ChildrenExtractFn {
    propertyExtractFn: Function,
    artifactType: string
}

interface UsingExtractFn {
    propertyExtractFn: Function,
    artifactType: string
}

export interface ArtifactScraper {
    artifactType: string,
    repositoryName: string,
    selectInfo: SelectInfo,
    artifactMapFn: Function,
    childrenFn?: (ChildrenExtractFn | Function)[]
    usingFn?: (UsingExtractFn | Function)[]
}

const artifactInfoBasic: SelectInfo =  ['id', 'name', 'description'];
const artifactInfoPackage: SelectInfo =  ['package', ...artifactInfoBasic];
const artifactInfoTitle: SelectInfo =  ['title', ...artifactInfoPackage];
const artifactInfoLaunchpad: SelectInfo =  ['startApp', ...artifactInfoTitle];
const artifactInfoTile: SelectInfo = ['actionApplication', 'settings', 'actionType', ...artifactInfoTitle];
const artifactInfoAPI: SelectInfo =  ['apiGroup','apiType', 'paths', ...artifactInfoPackage];
const artifactInfoScript: SelectInfo =  ['jsscriptGroup', 'globalScripts', 'externalModules', 'entitySets', 'apis', ...artifactInfoPackage];
const artifactInfoApp: SelectInfo =  ['id', 'package', 'application', 'title', 'description','objects'];
const artifactInfoAdaptive: SelectInfo =  ['application', 'connectorid', ...artifactInfoPackage];
const artifactConnector: SelectInfo =  ['settings', ...artifactInfoPackage];
const artifactJob: SelectInfo =  ['scripts', ...artifactInfoPackage];
const artifactWorkflowDefinition: SelectInfo = ['id', 'title', 'package', 'tasks'];

const artifactScrapers: ArtifactScraper[] = [
    {artifactType: 'package', repositoryName: 'package', selectInfo: artifactInfoBasic, artifactMapFn: mapDevelopmentPackage},
    {artifactType: 'launchpad', repositoryName: 'launchpad', selectInfo: artifactInfoLaunchpad, artifactMapFn: mapLaunchpad,
     usingFn: [{propertyExtractFn: x => x.cat, artifactType: "tile_group"}, mapLaunchpadApp]},
    {artifactType: 'tile_group', repositoryName: 'category', selectInfo: artifactInfoTitle, artifactMapFn: mapLaunchpad,
     usingFn: [{propertyExtractFn: x => x.tilegroups, artifactType: "tile_group"}, {propertyExtractFn: x => x.tiles, artifactType: "tile"}]},
    {artifactType: 'tile', repositoryName: 'tile', selectInfo: artifactInfoTile, artifactMapFn: mapLaunchpad,
     usingFn: [{propertyExtractFn: x => x.roles, artifactType: "role"}, mapTileChildren]},
    {artifactType: 'api_group', repositoryName: 'api_group', selectInfo: artifactInfoPackage, artifactMapFn: mapInfoPackage,
     childrenFn: [{propertyExtractFn: x => x.apis, artifactType: "api"}]},
    {artifactType: 'api', repositoryName: 'api', selectInfo: artifactInfoAPI, artifactMapFn: mapAPI,
     childrenFn: [mapAPIChildren]},
    {artifactType: 'api_operation', repositoryName: 'api', selectInfo: artifactInfoAPI, artifactMapFn: mapAPIOperation},    
     //childrenFn: [{propertyExtractFn: x => x.apis, artifactType: "api"}]},
    {artifactType: 'script_project', repositoryName: 'jsscript_group', selectInfo: artifactInfoPackage, artifactMapFn: mapInfoPackage,    
     childrenFn: [{propertyExtractFn: x => x.jsscripts, artifactType: "script"}]},
    {artifactType: 'script', repositoryName: 'jsscript', selectInfo: artifactInfoScript, artifactMapFn: mapInfoScript,    
     usingFn: [mapScriptUsing, {propertyExtractFn: x => x.entitySets.map(x => x.id?.toUpperCase()), artifactType: "table"},
                               {propertyExtractFn: x => x.globalScripts.map(x => x.id), artifactType: "script"},
                               {propertyExtractFn: x => x.apis.map(x => x.id), artifactType: "api_operation"}]},
    {artifactType: 'app', repositoryName: 'app_runtime', selectInfo: artifactInfoApp, artifactMapFn: mapApp,
     usingFn: [mapAppUsing] },
    {artifactType: 'adaptive', repositoryName: 'reports', selectInfo: artifactInfoAdaptive, artifactMapFn: mapInfoPackage,
     usingFn: [{propertyExtractFn: x => { return x.connectorid ? [x.connectorid] : []}, artifactType: "connector"},
               /*{propertyExtractFn: x => { return [{id:x.application}]}, artifactType: "app"}*/] },
    {artifactType: 'connector', repositoryName: 'connector', selectInfo: artifactConnector, artifactMapFn: mapInfoPackage,
     usingFn: [mapConnectorUsing]},
    {artifactType: 'table', repositoryName: 'dictionary', selectInfo: artifactInfoPackage, artifactMapFn: mapInfoPackage},
    {artifactType: 'role', repositoryName: 'role', selectInfo: artifactInfoPackage, artifactMapFn: mapInfoPackage},
    {artifactType: 'authentication', repositoryName: 'api_authentication', selectInfo: artifactInfoPackage, artifactMapFn: mapInfoPackage},
    {artifactType: 'job', repositoryName: 'script_scheduler', selectInfo: artifactJob, artifactMapFn: mapInfoPackage,
     usingFn: [{propertyExtractFn: x => x.scripts.map(x => x.id), artifactType: "script"}]}, 
    {artifactType: 'workflow_definition', repositoryName: "wf_definition", selectInfo: artifactWorkflowDefinition, artifactMapFn: mapInfoWorkflowDefinition,
     usingFn: [mapWorkflowDefinitionUsing] }

];

let apps = [];

const noPackageId = uuid().toUpperCase();
const noAPIGroupId = uuid().toUpperCase();
const noScriptProjectId = uuid().toUpperCase();

complete({
    scrapeArtifacts
});

function mapDevelopmentPackage({ id, name }) {
    return [{
        "type": "package",
        "packageId": null,
        "packageName": null,
        "objectId": id,
        "name": name,
        "id": uuid(),
        "parents": [],
        "children": []
    }]
}

function mapLaunchpad({ id, name, package, title, description }) {
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
    }]
}

function mapLaunchpadApp(data) {
    const using = [];

    if (data.startApp && data.startApp.length > 0) {
        using.push({id: data.startApp, type: "app"})
    }

    return using;
}

function mapInfoPackage({ id, name, package, description }) {
    return [{
        "type": "",
        "packageId": package ?? noPackageId,
        "packageName": null,
        "objectId": id,
        "name": name,
        "id": uuid(),
        "parents": [package],
        "children": [],
        "using": [],
        "used_by": [],
        "description": description
    }]
}

function mapTileChildren(data) {
    const children = [];

    const tile = data;
    if (tile.actionApplication && (tile.actionType === 'A' || !tile.actionType)) {
        children.push({id: tile.actionApplication, type: "app"});
    }
    if (tile.settings?.adaptive?.id && tile.actionType === 'F') {
        children.push({id: tile.settings.adaptive.id.toUpperCase(), type: "adaptive"});
    }
    if (tile.settings?.adaptive?.idTile) {
        children.push({id: tile.settings.adaptive.idTile.toUpperCase(), type: "adaptive"});
    }
    /*for (const role of tile.roles) {
        children.push({id: role.id, type: "role"});
    }*/
    return children;
}

function mapAPI({id, name, description, package, apiGroup, apiType, paths}) {

    return {
        "type": "api",
        "packageId": package ?? noPackageId,
        "objectId": id,
        "name": name,
        "description": description,
        "id": uuid(),
        "children": [],
        "using": [],
        "used_by": [],
        "apiGroup": apiGroup ?? noAPIGroupId
    }

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

function mapAPIChildren({paths}) {
    const children = [];
    for (const path of paths) {
        children.push({id: path.id, type: "api_operation"});
    }
    return children;
}

function mapAPIOperation({id, name, package, apiType, paths}) {
    const operations = [];
    for (const path of paths) {
        const operation = {
            "type": "api_operation",
            "objectId": path.id,
            "name": name + " -> " + path.method + ":" + path.path,
            "id": uuid(),
            "api": id,
            "children": [],
            "using": [],
            "used_by": []
        }
        operations.push(operation);

        if (path.serverScript) {
            operation.using.push({id: path.serverScript, type: "script"});
        }

        if (apiType === "table") {
            const secondSlash = path.path.indexOf("/",1);
            const tableName =  secondSlash === -1 ? path.path.substring(1) : path.path.substring(1, secondSlash);
            operation.using.push({id: tableName, type: "table"});
        }
    }

    return operations;
}

function mapApp({ id, application, package, title, description }) {
    const app = apps.find(x => x.id === id);
    return [{
        "type": "",
        "packageId": app?.package ?? noPackageId,
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
    }]
}

function mapAppUsing(application) {
    const using = []

    const apiObjects = application.objects.filter(object => object.fieldType === "neptune.restapi");

    for ( let i=0; i<apiObjects.length; i++) {
        using.push({id: apiObjects[i].restOperation, type: "api_operation", parentId: apiObjects[i].restSource, parentType: "api"});
    }

    return using;
}

function mapInfoScript({ id, name, package, description, jsscriptGroup }) {
    return [{
        "type": "",
        "packageId": package ?? noPackageId,
        "packageName": null,
        "objectId": id,
        "name": name,
        "id": uuid(),
        "parents": [package],
        "children": [],
        "using": [],
        "used_by": [],
        "description": description,
        "jsscriptGroup": jsscriptGroup ?? noScriptProjectId
    }]
}

function mapScriptUsing(scriptData) {
    const using = [];
    return using;
}

function mapConnectorUsing(connector) {
    const using = [];
    if (connector.settings?.tableid) {
        using.push({id: connector.settings?.tableid, type: "table"});
    }
    if (connector.settings?.scriptSel) {
        using.push({id: connector.settings?.scriptSel, type: "script"});
        using.push({id: connector.settings?.scriptRun, type: "script"});
    }
    return using;
}

function mapInfoWorkflowDefinition({id, title, package}) {
        return [{
        "type": "",
        "packageId": package ?? noPackageId,
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
        }]
}

function mapWorkflowDefinitionUsing(workflow) {
    const using = [];

    for (const task of workflow.tasks) {    
        if (task.taskType === 'ScriptTask' && task.scriptId) {
            using.push({id: task.scriptId, type: "script"});
        }
    }

    return using;
}

async function scrapeArtifacts() {
    const manager = p9.manager ? p9.manager : modules.typeorm.getConnection().manager;

    apps = await manager.find('app', { select: ["id", "package"] });

    const allArtifacts = [];

    for (const scraper of artifactScrapers) {
        const res = await scrapeIt(scraper, manager);
        allArtifacts.push(res);
    };

    // flatten array of arrays
    const final = allArtifacts.reduce((acc, x) => ([...acc, ...x]), []);

    // add special grouping artifacts
    final.push({"type": "package", "packageId": null, "packageName": null, "objectId": noPackageId,
                "name": "NO PACKAGE", "id": uuid(), "parents": [], "children": []});

    final.push({"type": "api_group", "packageId": noPackageId, "packageName": null, "objectId": noAPIGroupId,
                "name": "NO API GROUP", "id": uuid(), "parents": [noPackageId], "children": [], "using": [], "used_by": [],
                "description": "Default API Group"});

    final.push({"type": "script_project", "packageId": noPackageId, "packageName": null, "objectId": noScriptProjectId,
                "name": "NO SCRIPT PROJECT", "id": uuid(), "parents": [noPackageId], "children": [], "using": [], "used_by": [],
                "description": "Default Script Project"});

    // post processing
    const artifactsUsingApps = ['launchpad', 'tile', 'adaptive'];

    final.forEach(x => {
        if (x.type === "package") {
            x.children.push(...final.filter(y => y.packageId === x.objectId).map(x => ({ id: x.objectId, type: x.type})));            
        }
        if (x.objectId === noAPIGroupId) {
            x.children.push(...final.filter(y => y.apiGroup === x.objectId).map(x => ({ id: x.objectId, type: x.type})));            
        }
        if (x.objectId === noScriptProjectId) {
            x.children.push(...final.filter(y => y.jsscriptGroup === x.objectId).map(x => ({ id: x.objectId, type: x.type})));            
        }
        if (artifactsUsingApps.includes(x.type)) {
            x.using.filter(x => x.type === 'app').forEach(x => {const app = final.find(y => y.type === "app" && y.name === x.id); x.id = app?.objectId ?? x.id});
        }
        if (x.type === "api_operation" && x.using && x.using[0]?.type === "table") {
            const table = final.find(y => y.type === "table" && y.name === x.using[0].id);
            if (table) {
                x.using[0].id = table.objectId;
            }
        }
        if (x.type !== "package") {
            const checkedChildren = [];
            x.using?.forEach(child => {
                    const childArtifact = final.find(z => z.objectId === child.id);
                    if (childArtifact) {
                        if (x.type === "tile") {
                        }
                        childArtifact.used_by?.push({id: x.objectId, type: x.type});
                        checkedChildren.push(child);
                    } else {
                        //console.log(x.name + ":" + x.type + ":" + child.id + ":" + child.type);
                    }
            })
        }
    })
    return final;
}
async function scrapeIt(scraper: ArtifactScraper, manager) {
                console.log(scraper.artifactType);
                try {
                    const artifactData = await manager.find(scraper.repositoryName, {
                        select: scraper.selectInfo,
                        loadRelationIds: scraper.artifactType !== 'table'
                    });

                    const artifacts = await artifactData.map(scraper.artifactMapFn).flat().map( x => { x.type = scraper.artifactType; return x});

                    if ( scraper.usingFn || scraper.childrenFn ) {
                        for (const artifact of artifactData) {
                            const targetArtifact = artifacts.find(x => x.objectId === artifact.id);
                            if (scraper.childrenFn) {
                                const allChildren = [];
                                for (const childrenFn of scraper.childrenFn) {
                                    if (childrenFn instanceof Function) {
                                        allChildren.push(childrenFn(artifact));
                                    } else {
                                        allChildren.push(childrenFn.propertyExtractFn(artifact).map(x => { return { id: x, type: childrenFn.artifactType}}));
                                    }
                                }
                                targetArtifact.children = allChildren.reduce((acc, x) => ([...acc, ...x]), []);//mapArtifactResponseFn(resp.data).map(x => x.id);
                            }
                            if (scraper.usingFn) {
                                const allUsing = [];
                                for (const usingFn of scraper.usingFn) {
                                    if (usingFn instanceof Function) {
                                        allUsing.push(usingFn(artifact));
                                    } else {
                                        allUsing.push(usingFn.propertyExtractFn(artifact).map(x => {  return { id: x, type: usingFn.artifactType}}));
                                        //usingFn.propertyExtractFn(artifact).map(x => { console.log(x) });
                                    }
                                }
                                
                                targetArtifact.using = allUsing.reduce((acc, x) => ([...acc, ...x]), []);//mapArtifactResponseFn(resp.data).map(x => x.id);
                            }
                        }
                    }
                    return artifacts;

                } catch (requestError) {
                    console.error(requestError)
                    return [];
                }
            //}

}
}

