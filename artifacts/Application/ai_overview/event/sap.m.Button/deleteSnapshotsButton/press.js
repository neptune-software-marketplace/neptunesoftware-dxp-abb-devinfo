const indices = snapshotTable.getSelectedIndices();
const snapshotIds = [];

indices.forEach(index => {
    const snapshot = snapshotTable.getContextByIndex(index).getObject();
    snapshotIds.push(snapshot.id);
})

console.log(snapshotIds);

const options = { data: snapshotIds};

apideleteSnapshots(options);