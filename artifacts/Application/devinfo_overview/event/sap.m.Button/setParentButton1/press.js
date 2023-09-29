let context = oEvent.oSource.getBindingContext();
let data = context.getObject();


const treeData = modeltreeArtifactSelectionBundle.getData();

console.log(data.key);

modeltreeArtifactSelectionBundle.setData({
    "children": [data]
});