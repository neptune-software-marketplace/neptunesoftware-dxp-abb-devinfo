function showUsage(event) {
    let context = event.getParameter("rowContext");
    if (!context) {
        return;
    }
    let data = context.getObject();
    const typeName = data.type
        .split("_")
        .map((x) => {
            return x.charAt(0).toUpperCase() + x.slice(1);
        })
        .join(" ");
    whereUsedTree.setTitle(typeName + ": " + data.name);
    /*const using = [];
const whereUsed = modelwhereUsedData.getData().find(x => x.objectId === data.objectId);
const whereUsedTabData = whereUsed?.used_by.map(y => {
    const artifact = modelartifactsData.getData().find(z => z.objectId === y.id);
    if (artifact) {
        return { name: artifact.name, type: artifact.type };
    }
})

modelwhereUsedTable.setData(whereUsedTabData);*/

    modelusingSelected.setData(data);

    const tree = [];
    const usageMode = usageModes[data.type];
    if (usageMode.length === 1) {
        usingButton.setEnabled(usageMode[0] === "using");
        usedByButton.setEnabled(usageMode[0] === "used_by");
        usingModeButton.setSelectedKey(usageMode[0]);
    } else {
        usingButton.setEnabled(true);
        usedByButton.setEnabled(true);
    }

    switch (usingModeButton.getSelectedKey()) {
        case "using":
            getUsingTree(data.objectId, "", 0, tree);
            break;

        case "used_by":
            getWhereUsedTree(data.objectId, "", 0, tree);
            break;

        default:
            //Default catches all cases not specified above
            usingModeButton.setSelectedKey("using");
            getUsingTree(data.objectId, "", 0, tree);
            break;
    }

    modelwhereUsedTree.setData({
        children: _convertFlatToNested(tree, "key", "parent"),
    });
    /*modelartifactsData.getData().map(artifact => { 
    if (artifact.children ) {
        if (artifact.children.some( child => child.objectId === data.objectId)) {
            using.push(artifact);
        }
    }
})*/
    if (usingModeButton.getSelectedKey() === "using") {
        whereUsedTree.expandToLevel(2);
    }
}
