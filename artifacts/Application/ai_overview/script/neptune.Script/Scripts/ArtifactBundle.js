let currentBundle = null;

function ArtifactBundle(mode, data) {
    this.dbData = {}
    this.uiData = []

    if (mode === "db") {
        this.dbData = data;
    }

    this.addData = function(data) {
        for( const item of data) {
            const itemIndex = this.dbData.artifacts.findIndex(x => x.id === item.objectId);
            if (itemIndex === -1) {
                const bundleItem = (({ objectId:id, name, type }) => ({ id, name, type }))(item);
                this.dbData.artifacts.push(bundleItem);
            }
        }
        this.createBundleTree();
    }

    this.removeData = function(data) {
        for( const item of data) {
            const itemIndex = this.dbData.artifacts.findIndex(x => x.id === item.id);
            this.dbData.artifacts.splice(itemIndex, 1);
        }
        this.createBundleTree();
    }

    this.createBundleTree = function createBundleTree() {
        const bundleTreeFlat = [];

        this.dbData.artifacts.forEach(function (artifact) {
            bundleTreeFlat.push({id: artifact.id, name: artifact.name, type: artifact.type, parent: "", key: crypto.randomUUID()});
        })

        let bundleTree = _convertFlatToNested(bundleTreeFlat, "key", "parent");

        
        if (bundleTree.length === 0) {
            //bundleTree.push({name: "Please select/create a bundle!", children: []});
        }

        treeBundle.getModel().setData({
            "children": bundleTree
        });    
    }

}

function processBundleList(list) {
      const comboItems = list.map(bundle => { return {id: bundle.id, name: bundle.name}});

        modelcomboBundle.setData(comboItems);
        //modellistBundles2.setData(comboItems);

        const bundles = [];

        for (const dbBundle of list) {
            const bundle = new ArtifactBundle('db', dbBundle);
            bundles.push(bundle);
        }
        modelbundleData.setData(bundles);        
}

