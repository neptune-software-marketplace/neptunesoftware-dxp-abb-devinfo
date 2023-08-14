const onlyUsing = ["using"];
const onlyUsedBy = ["used_by"];
const allUsage = ["using", "used_by"];

const usageModes = [];
usageModes["launchpad"] = onlyUsing;
usageModes["package"] = allUsage;
usageModes["adaptive"] = allUsage;
usageModes["app"] = allUsage;
usageModes["api"] = allUsage;
usageModes["api_operation"] = allUsage;
usageModes["api_group"] = allUsage;
usageModes["authentication"] = onlyUsedBy;
usageModes["role"] = onlyUsedBy;
usageModes["table"] = onlyUsedBy;
usageModes["tile"] = allUsage;
usageModes["tile_group"] = allUsage;
usageModes["script_project"] = allUsage;
usageModes["script"] = allUsage;
usageModes["job"] = onlyUsing
usageModes["connector"] = allUsage;
usageModes["workflow_definition"] = onlyUsing;

function getWhereUsedTree(objectId, parent, level, tree) {
    // find originating object
    const whereUsed = modelwhereUsedData.getData().find(x => x.objectId === objectId);
    // find users
    const whereUsedTabData = whereUsed?.used_by.map(y => {
        const artifact = modelartifactsData.getData().find(z => z.objectId === y.id);
        if (artifact) {
            return { objectId: artifact.objectId, name: artifact.name, type: artifact.type };
        }
    });
    if (whereUsedTabData) {
        for (const element of whereUsedTabData) {
            const treeNode = {key: crypto.randomUUID(), parent: parent, level: level, name: element.name, type: element.type, objectId: element.objectId};
            tree.push(treeNode);
            getWhereUsedTree(element.objectId, treeNode.key, level+1, tree);
        }
    }
    console.log(tree);

}

function getUsingTree(objectId, parent, level, tree) {
    // find originating object
    const source = modelusingData.getData().find(x => x.objectId === objectId);
    const sourceArtifact = modelartifactsData.getData().find(z => z.objectId === objectId);
    console.log(sourceArtifact.name+":"+sourceArtifact.type);
    // find users
    const usingTabData = source?.using.map(y => {
        const artifact = modelartifactsData.getData().find(z => z.objectId === y.id);
        if (artifact) {
            return { objectId: artifact.objectId, name: artifact.name, type: artifact.type };
        }
    });
    if (usingTabData) {
        for (const element of usingTabData) {
            if (element) {
                const recursive = isRecursive(tree, parent, element.objectId);// tree.find(x => x.objectId === element.objectId);
                const name = recursive ? 'RECURSION: ' + element.name : element.name;
                const treeNode = {key: crypto.randomUUID(), parent: parent, level: level, name: name, type: element.type, objectId: element.objectId};
                tree.push(treeNode);
                if (!recursive) {
                    getUsingTree(element.objectId, treeNode.key, level+1, tree);
                }
            } else {
                
                console.log(source?.using);
                const treeNode = {key: crypto.randomUUID(), parent: parent, level: level, name: "element.name", type: "element.type", objectId: "element.objectId"};
            //tree.push(treeNode);
}
        }
    }

}

function isRecursive(tree, nodeId, objectId) {
    if (nodeId === "") {
        return false;
    }
    const node = tree.find(x => x.key === nodeId);
    if (node.objectId === objectId) {
        return true;
    }
    return isRecursive(tree, node.parent, objectId);
}

function toggleUsingMode(treeFunction) {
    //const index = artifactList.getSelectedIndices();
    //console.log(index);
    //const context = artifactList.getContextByIndex(index[0]);
    const data = modelusingSelected.getData();// context.getObject();

    const tree = [];
    treeFunction(data.objectId, "", 0, tree);        

    modelwhereUsedTree.setData({
        "children": _convertFlatToNested(tree, "key", "parent")
    });
    whereUsedTree.expandToLevel(4);
}