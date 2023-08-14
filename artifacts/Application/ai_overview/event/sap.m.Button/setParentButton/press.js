let context = oEvent.oSource.getBindingContext();
let data = context.getObject();


const treeData = modelartifactList.getData();

console.log(data.key);

modelartifactList.setData({
    "children": [data]
});