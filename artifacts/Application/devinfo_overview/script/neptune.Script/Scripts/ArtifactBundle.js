let currentBundle = null;

function ArtifactBundle(mode, data = {}, treeBundleModel = treeBundle) {
    this.dbData = { artifacts: [] };  // Initialize with a consistent structure
    this.uiData = [];

    if (mode === "db") {
        this.dbData = { ...data, artifacts: data.artifacts || [] }; // Ensure `artifacts` array exists
    }

    this.addData = function(data) {
        for (const item of data) {
            const itemIndex = this.dbData.artifacts.findIndex(x => x.id === item.objectId);
            if (itemIndex === -1) {
                const bundleItem = (({ objectId: id, name, type }) => ({ id, name, type }))(item);
                this.dbData.artifacts.push(bundleItem);
            }
        }
        this.createBundleTree();
    };

    this.removeData = function(data) {
        for (const item of data) {
            const itemIndex = this.dbData.artifacts.findIndex(x => x.id === item.id);
            if (itemIndex !== -1) {  // Only splice if itemIndex is valid
                this.dbData.artifacts.splice(itemIndex, 1);
            }
        }
        this.createBundleTree();
    };

    this.createBundleTree = function() {
        const bundleTreeFlat = this.dbData.artifacts.map(artifact => ({
            id: artifact.id,
            name: artifact.name,
            type: artifact.type,
            parent: "",
            key: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : generateUUID() // Fallback for `crypto.randomUUID()`
        }));

        if (typeof _convertFlatToNested !== "function") {
            console.error("Function _convertFlatToNested is not defined.");
            return;
        }

        let bundleTree = _convertFlatToNested(bundleTreeFlat, "key", "parent");

        if (bundleTree.length === 0) {
            bundleTree.push({ name: "Please select/create a bundle!", children: [] });
        }

        treeBundleModel.getModel().setData({
            "children": bundleTree
        });
    };

    // Fallback UUID generator if `crypto.randomUUID()` is unavailable
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

function processBundleList(list) {
    const comboItems = list.map(bundle => ({ id: bundle.id, name: bundle.name }));
    
    modelcomboBundle.setData(comboItems);

    const bundles = list.map(dbBundle => new ArtifactBundle('db', dbBundle));
    
    modelbundleData.setData(bundles);
}
