const selected = [];
getSelected(treeArtifactSelectionBundle.getModel().getData().children, selected);
butAddToBundle.setEnabled((selected.length > 0) && (currentBundle !== null));