const { scrapeArtifacts } = globals.artifactScraperDirect;

const queryMode = "C"; // cached or "D" = direct

const artifactTypeNames = {
    package: "Package",
    launchpad: "Launchpad",
    tile_group: "Tile Group",
    tile: "Tile",
    api_group: "API Group",
    api: "API",
    api_operation: "API Operation",
    script_project: "Script Project",
    script: "Server Script",
    app: "Application",
    adaptive: "Adaptive App",
    connector: "Connector",
    table: "Table",
    role: "Role",
    authentication: "Authentication",
    job: "Job",
    workflow_definition: "Workflow Definition"
}

let artifacts = [];
let artifactLists = [];
let packages = [];
const whereUsed = [];
const using = [];
let artifactTree = [];
let timestamp = 0;

if (queryMode === "C") {
    let snapshots = await entities.dev_infosystem_snapshot.find({
        skip: 0,
        take: 1,
        order: { createdAt: "DESC" },
    });
    if (snapshots[0]) {
        timestamp = snapshots[0].updatedAt;
        const snapshotData = await entities.dev_infosystem_snapshot_data.find({
            where: {"snapshot_id": snapshots[0].id}
        });

        for (const snapshotDataType of snapshotData) {
            if (snapshotDataType.artifact_type === "package") {
                packages = snapshotDataType.graph_data;
            } else {
                artifactLists[snapshotDataType.artifact_type] = snapshotDataType.graph_data;
            }
        }

    }
} else if (queryMode === "D") {
    artifacts = await scrapeArtifacts();
    if (artifacts.length > 0) {
        artifacts
            .filter((x) => x.type !== "package")
            .forEach((item) => {
                if (artifactLists[item.type]) {
                    artifactLists[item.type].push(item);
                } else {
                    artifactLists[item.type] = [item];
                }
            });
        packages = artifacts.filter((x) => x.type === "package");
        timestamp = Date.now();
    }
}

processPackages(packages);

processArtifactLists(artifactLists, "", 0, "T");

console.log(timestamp);

result.data = { artifactTree, whereUsed, using, timestamp };

complete();

function processPackages(packages) {
    if (packages.length === 0) {
        return;
    }
    const packageRootItem = {};
    packageRootItem.name = artifactTypeNames["package"] + " (" + packages.length + ")";
    packageRootItem.objectId = "";
    packageRootItem.type = "package";
    packageRootItem.key = uuid();
    packageRootItem.parent = "";
    packageRootItem.level = 0;
    packageRootItem.navMode = "P";
    artifactTree.push(packageRootItem);

    packages.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });

    packages.forEach((package) => {
        const packageItem = {};
        packageItem.name = package.name;
        packageItem.objectId = package.objectId;
        packageItem.type = "package";
        packageItem.key = uuid();
        packageItem.parent = packageRootItem.key;
        packageItem.level = 1;
        packageItem.navMode = "P";
        artifactTree.push(packageItem);

        const packageContentLists = [];
        package.children.forEach((item) => {
            const sourceArtifact = artifactLists[item.type].find(
                (element) => element.objectId === item.id || element.name === item.id
            );
            if (packageContentLists[item.type]) {
                packageContentLists[item.type].push(sourceArtifact);
            } else {
                packageContentLists[item.type] = [sourceArtifact];
            }
        });
        //console.log(packageContentLists["app"]);
        processArtifactLists(packageContentLists, packageItem.key, 2, "P");
    });
}

function processArtifactLists(artifacts, parent, level, navMode) {
    if (Object.keys(artifacts).length === 0) {
        return;
    }
    for (const type in artifacts) {
        //console.log(type);
        //if (type === "authentication") continue;
        const treeItem = {};
        treeItem.name = artifactTypeNames[type] + " (" + artifacts[type].length + " )";
        treeItem.objectId = "";
        treeItem.type = type;
        treeItem.key = uuid();
        treeItem.parent = parent;
        treeItem.level = level;
        treeItem.navMode = navMode;
        artifactTree.push(treeItem);

        artifacts[type].sort((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });

        if (type === "package") {
        } else {
            // create a reduced artifact list as input for generic tree generation function below
            const artifactIds = artifacts[type].map((artifact) => {
                return { id: artifact.objectId, type: type };
            });
            if (type === "workflow_definition") {
                console.log(artifactIds.length);
            }

            try {
                createTree(artifactIds, treeItem.key, level + 1, navMode);
            } catch (e) {
                //console.log("oops");
                //console.log(e);
            }
        }
    }

    
}

function createTree(sourceArray, parentId, level, navMode) {
    // sanity check
    //console.log(level);
    if (level > 30) {
        return;
    }
    //console.log(sourceArray);
    sourceArray.forEach((sourceItem) => {
        //console.log(sourceItem.type);
        const sourceArtifact = artifactLists[sourceItem.type].find(
            (element) => element.objectId === sourceItem.id || element.name === sourceItem.id
        );
        if (sourceArtifact) {
            //console.log(sourceArtifact.name+ " : " + sourceArtifact.type);
            const treeItem = {};
            treeItem.name = sourceArtifact.name;
            treeItem.description = sourceArtifact.description ?? "";
            treeItem.type = sourceArtifact.type;
            (treeItem.used_by = sourceArtifact.used_by?.length ?? 0), (treeItem.key = uuid()); //sourceArtifact.id;//objectId;
            treeItem.objectId = sourceArtifact.objectId;
            treeItem.parent = parentId;
            treeItem.level = level;
            treeItem.navMode = navMode;
            if (sourceArtifact.type === 'script') {
                treeItem.scriptProject = sourceArtifact.jsscriptGroup;
            }
            if (sourceArtifact.type === 'api_operation') {
                //console.log(sourceArtifact.api);
                treeItem.api = sourceArtifact.api;
            }
            //console.log(treeItem.name + ":" + treeItem.type);
            artifactTree.push(treeItem);

            if (sourceArtifact.used_by) {
                whereUsed.push({
                    objectId: sourceArtifact.objectId,
                    used_by: sourceArtifact.used_by,
                });
            }

            if (sourceArtifact.using) {
                using.push({
                    objectId: sourceArtifact.objectId,
                    using: sourceArtifact.using,
                });
            }

            if (sourceArtifact.children?.length) {
                //console.log(sourceArtifact.children);
                createTree(sourceArtifact.children, treeItem.key, level + 1, navMode);
            }
        }
    });
}
