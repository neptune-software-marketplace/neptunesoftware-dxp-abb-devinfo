

// Custom Init - Happens only once when mounting the component
sap.ui.getCore().attachInit(function(startParams) {

    // data = startParameters from Cockpit Tile application settings (action tab)
    // Do your Stuff
    artifactList.setBusy(true);

    // Some stuff needs to be timed later. Run them inside a timeout
    setTimeout(function() {
        //  Do something
        comboBundle.getBinding('items').sort(new sap.ui.model.Sorter('name', false, false));
    }, 50);

});