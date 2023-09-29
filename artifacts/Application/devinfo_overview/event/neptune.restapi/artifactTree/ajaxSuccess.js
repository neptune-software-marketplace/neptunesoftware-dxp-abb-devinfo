artifactList.setBusy(false);

modelartifactsData.setData(xhr.responseJSON.artifactTree);
modelwhereUsedData.setData(xhr.responseJSON.whereUsed);
modelusingData.setData(xhr.responseJSON.using);

const timestamp = Number(xhr.responseJSON.timestamp);
if (timestamp > 0) {
    const date = new Date(timestamp);
    artifactList.setTitle("Artifact Snapshot (as of "+ date.toLocaleString() +")");
    treeArtifactSelectionBundle.setTitle("Artifact Snapshot (as of "+ date.toLocaleString() +")");
}

let navMode  = navModeButton.getSelectedKey() === '' ? 'TT' : navModeButton.getSelectedKey();
toggleNavMode(artifactList, navMode);
navMode = navModeButton1.getSelectedKey() === '' ? 'TT' : navModeButton1.getSelectedKey();
toggleNavMode(treeArtifactSelectionBundle,navMode);

/*modelartifactList.setData({
    "children": _convertFlatToNested(xhr.responseJSON.artifactTree, "key", "parent")
});*/


//sap.m.MessageToast.show("Success");