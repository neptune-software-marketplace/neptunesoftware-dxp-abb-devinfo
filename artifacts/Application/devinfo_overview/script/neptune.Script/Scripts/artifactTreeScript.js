function toggleNavMode(tree, navMode) {
    const data = modelartifactsData.getData();
    const filtered = data.filter(x => x.navMode === navMode[0]);
    let filteredTree = _convertFlatToNested(filtered, "key", "parent");


    if (navMode === 'TT') {
        ["API (", "API Operation", "Server Script"].forEach(type => {
            const index = filteredTree.findIndex(x => x.name.startsWith(type));
            filteredTree.splice(index,1);
        })
    }
    else if (navMode == 'TL') {
        ["API Group", "API (", "Script Project"].forEach(type => {
            const typeText = getTypeText(type) + ' ';
            const node = filteredTree.find(x => x.name.startsWith(type));
            node.children.forEach(child => {
                child.children = [];
            })
        })
    }
    
    if (filteredTree.length === 0) {
        filteredTree.push({name: "Please create a snapshot in the \"Snapshots\" tab!", children: []});
    }

    setSelMode(filteredTree);

    tree.getModel().setData({
        "children": filteredTree
    });

    if (navMode === "P") {
        tree.expandToLevel(1);
    }

}

function setSelMode(children) {
    children.forEach(function (child) {
        child.single_select_visible = child.objectId !== "";
        child.group_select_visible = child.children.length > 0;
        setSelMode(child.children);
    })
}

function getSelected(children, selected) {
    for (const child of children) {
        if (child.single_select) {
            selected.push(child);
        }
        getSelected(child.children, selected);
    }
}

function unsetSelected(children) {
    for (const child of children) {
        if (child.single_select) {
            child.single_select = false;
        }
        if (child.group_select) {
            child.group_select = false;
        }
        unsetSelected(child.children);
    }
}