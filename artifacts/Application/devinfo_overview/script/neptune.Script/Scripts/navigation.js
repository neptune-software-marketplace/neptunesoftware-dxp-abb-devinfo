
function getRoleDetail(id) {
    apiroleDetail({ data: { id: id} }).done(
        function(data) {
            console.log(data);
        }
    );    
    apiRestAPI().done(
        function(data) {
            console.log(data);
        }

    )
}

async function toExternal(event) {
    let context = event.oSource.getBindingContext();
    let data = context.getObject();
    const artifactId = data.id ?? data.objectId;
    const artifact = modelartifactsData.getData().find(z => z.objectId === artifactId);
    console.log(artifact);

    const toExternal = {
        target: {
            semanticObject: "",
            action: "",
        },
        params: {
            id: data.id ?? data.objectId,
            name: data.name,
        },
        query: {},
    };

    switch (data.type) {
        case "development_package":
            toExternal.target.semanticObject = "development";
            toExternal.target.action = "package";
            break;

        case "adaptive":
            toExternal.target.semanticObject = "development";
            toExternal.target.action = "adaptivedesigner";
            break;

        case "app":
            toExternal.target.semanticObject = "development";
            toExternal.target.action = "appdesigner";
            break;

        case "Documentation":
            toExternal.target.semanticObject = "development";
            toExternal.target.action = "documentation";
            break;

        case "Email Templates":
            toExternal.target.semanticObject = "development";
            toExternal.target.action = "emailtemplate";
            break;

        case "api":
            toExternal.target.semanticObject = "connectivity";
            toExternal.target.action = "apidesigner";
            break;

        case "api_operation":
            toExternal.target.semanticObject = "connectivity";
            toExternal.target.action = "apidesigner";
            toExternal.params.id = artifact.api;
            break;

        case "Connectivity Group":
            toExternal.target.semanticObject = "connectivity";
            toExternal.target.action = "apigroup";
            break;

        case "Certificates":
            toExternal.target.semanticObject = "connectivity";
            toExternal.target.action = "certificates";
            break;

        case "Proxy Authentication":
            toExternal.target.semanticObject = "connectivity";
            toExternal.target.action = "apiauthentication";
            break;

        case "Remote Systems":
            toExternal.target.semanticObject = "settings";
            toExternal.target.action = "systems";
            break;

        case "role":
            toExternal.target.semanticObject = "security";
            toExternal.target.action = "role";
            break;

        case "user":
            toExternal.target.semanticObject = "security";
            toExternal.target.action = "user";
            break;

        case "oData Source":
            toExternal.target.semanticObject = "connectivity";
            toExternal.target.action = "odatasource";
            break;

        case "oData Mock Data":
            toExternal.target.semanticObject = "connectivity";
            toExternal.target.action = "odatamockdata";
            break;

        case "launchpad":
            toExternal.target.semanticObject = "run";
            toExternal.target.action = "launchpad";
            break;

        case "table":
            toExternal.target.semanticObject = "tools";
            toExternal.target.action = "tabledefinition";
            break;

        case "tile":
            toExternal.target.semanticObject = "run";
            toExternal.target.action = "tile";
            break;

        case "tile_group":
            toExternal.target.semanticObject = "run";
            toExternal.target.action = "group";
            break;

        case "Rules Engine":
            toExternal.target.semanticObject = "tools";
            toExternal.target.action = "rulesengine";
            break;

        case "script_project":
            toExternal.target.semanticObject = "tools";
            toExternal.target.action = "scripteditor";
            break;

        case "script":
            toExternal.target.semanticObject = "tools";
            toExternal.target.action = "scripteditor";

            //const script = await getScript(toExternal.params.id);
            toExternal.params.id = artifact.scriptProject;
            toExternal.params.scriptid = data.id ?? data.objectId;
            break;

        case "Theme":
            toExternal.target.semanticObject = "development";
            toExternal.target.action = "themedesigner";
            break;

        case "security_group":
            toExternal.target.semanticObject = "security";
            toExternal.target.action = "department";
            break;

        case "workflow_definition":
            toExternal.target.semanticObject = "workflow";
            toExternal.target.action = "definition";
            break;

        case "job":
            toExternal.target.semanticObject = "tools";
            toExternal.target.action = "scheduler";
            break;

        case "PDF Designer":
            toExternal.target.semanticObject = "development";
            toExternal.target.action = "pdfdesigner";
            toExternal.params.name = data.application;
            break;

        case "connector":
            toExternal.target.semanticObject = "connectivity";
            toExternal.target.action = "connector";
            break;

        case "Events":
            toExternal.target.semanticObject = "tools";
            toExternal.target.action = "events";
            break;

        case "Media Library":
            toExternal.target.semanticObject = "development";
            toExternal.target.action = "media";
            break;

        case "Code Snippets":
            toExternal.target.semanticObject = "development";
            toExternal.target.action = "jshelpers";
            break;

        case "Approvers":
            toExternal.target.semanticObject = "workflow";
            toExternal.target.action = "approvers";
            break;

        case "Task Action":
            toExternal.target.semanticObject = "workflow";
            toExternal.target.action = "taskaction";
            break;
    }

    if (toExternal.target.semanticObject && toExternal.target.action) {
        sap.n.HashNavigation.toExternal(toExternal);
    }
}

