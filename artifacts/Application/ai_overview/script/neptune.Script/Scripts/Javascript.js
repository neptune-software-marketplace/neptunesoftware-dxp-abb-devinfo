 function navigateArtifactTree(event) {
    let context = event.getParameter("rowContext");
    let data = context.getObject();
    selectWhere(context => context.getProperty("objectId") == data.objectId);
 }

 function selectWhere(keysAreMatching) {
    const contexts = artifactList.getBinding("rows").getContexts();
    const index = getRowIndexWhere(keysAreMatching, contexts);
    return selectRowByIndex(index, artifactList);
  }

function getRowIndexWhere(keysAreMatching, contexts) {
    let index = -1;
    contexts.find((context, i) => keysAreMatching(context) && (index = i));
    return index;
}

function selectRowByIndex(i, table) {
    const shouldSelect = i > -1 && !table.isIndexSelected(i);
    return shouldSelect ? table.setSelectedIndex(i) : table;
}