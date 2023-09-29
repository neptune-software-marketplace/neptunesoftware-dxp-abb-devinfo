if (!currentBundle) {
    return;
}
const bundle = currentBundle.dbData;

var options = {
    data: bundle
};

apipostBundle(options)
    .then(function(data) {
        sap.m.MessageToast.show("Bundle saved");
        return Promise.resolve();
    });
