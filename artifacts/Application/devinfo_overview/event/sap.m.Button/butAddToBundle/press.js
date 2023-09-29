const selected = [];
getSelected(treeArtifactSelectionBundle.getModel().getData().children, selected);

currentBundle.addData(selected);

unsetSelected(treeArtifactSelectionBundle.getModel().getData().children);

treeArtifactSelectionBundle.getModel().refresh();