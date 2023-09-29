let binding = artifactList.getBinding("rows");
let filter = new sap.ui.model.Filter({
    filters: [
        new sap.ui.model.Filter("name", "Contains", this.getValue()),
        new sap.ui.model.Filter("type", "Contains", this.getValue()),
    ],
    and: false,
});
binding.filter([filter]);
artifactList.expandToLevel(99);