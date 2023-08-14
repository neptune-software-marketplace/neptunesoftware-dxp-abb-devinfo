if (!modelformNewBundle.oData.name) {
    informNewName.setValueState('Error');
    return;
}

console.log(modelformNewBundle.getData());

const artifacts = [];

var options = {
    parameters: {
        "fetch": true
    },
    data: {
        "name": modelformNewBundle.getData().name,
        "description": modelformNewBundle.getData().description ?? "",
        "artifacts": artifacts,
    }
};

let newId = "";
apipostBundle(options)
    .then(function(data) {
        newId = data.identifiers[0].id;
        return apilistBundles()})
    .then(function(data) {
        diaNewBundle.close();
        processBundleList(data);
        comboBundle.setSelectedKey(newId);
        butDeleteBundle.setEnabled(true);
        comboBundle.fireSelectionChange();
        return Promise.resolve();
    });
