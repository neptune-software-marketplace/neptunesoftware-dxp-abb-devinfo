function toggleNavMode(tree, navMode) {
    const data = modelartifactsData.getData();
    if (!data) {
        console.error("No data found in modelartifactsData");
        return;
    }

    const filtered = data.filter(x => x.navMode === navMode[0]);
    let filteredTree = _convertFlatToNested(filtered, "key", "parent");

    if (navMode === 'TT') {
        ["API (", "API Operation", "Server Script"].forEach(type => {
            const index = filteredTree.findIndex(x => x.name && x.name.startsWith(type));
            if (index !== -1) {
                filteredTree.splice(index, 1);
            }
        });
    } else if (navMode === 'TL') {
        ["API Group", "API (", "Script Project"].forEach(type => {
            const node = filteredTree.find(x => x.name && x.name.startsWith(type));
            if (node) {
                node.children.forEach(child => {
                    child.children = [];
                });
            }
        });
    }

    if (filteredTree.length === 0) {
        filteredTree.push({ name: "Please create a snapshot in the \"Snapshots\" tab!", children: [] });
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
    });
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

// Convert flat data to a nested structure based on parent-child relationships
function _convertFlatToNested(flatData, keyField, parentField) {
    if (!Array.isArray(flatData)) {
        console.error("_convertFlatToNested error: flatData is not an array");
        return [];
    }

    const lookup = {};
    flatData.forEach(item => {
        if (item && item[keyField]) {
            lookup[item[keyField]] = { ...item, children: [] };
        } else {
            console.error("Missing key in item:", item);
        }
    });

    const nestedData = [];
    flatData.forEach(item => {
        if (!item) return;

        const parentKey = item[parentField];
        const currentItem = lookup[item[keyField]];

        if (!parentKey || !lookup[parentKey]) {
            // If no parent or parent is missing, add to root
            nestedData.push(currentItem);
            if (parentKey && !lookup[parentKey]) {
                console.warn(`Parent key ${parentKey} not found for item`, item);
            }
        } else {
            // Add to parent's children
            lookup[parentKey].children.push(currentItem);
        }
    });

    return nestedData;
}