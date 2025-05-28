const { scrapeArtifacts } = globals.artifactScraperDirect;

const artifacts = await scrapeArtifacts();

const snapshot = await entities.dev_infosystem_snapshot.insert({ "name": "name" });

let artifactLists = [];

if (artifacts.length > 0) {
    artifacts.forEach((item) => {
        if (artifactLists[item.type]) {
            artifactLists[item.type].push(item);
        } else {
            artifactLists[item.type] = [item];
        }
    });
}

for (const artifactType of Object.keys(artifactLists)) {
  console.log(artifactType);
  await entities.dev_infosystem_snapshot_data.insert({ "snapshot_id": snapshot.identifiers[0].id,
                                                       "artifact_type": artifactType,
                                                       "graph_data": artifactLists[artifactType] });
};



const snapshots = await entities.dev_infosystem_snapshot
  .find({
    select: [ 'id', 'createdAt'],
    order: { createdAt: 'DESC' }
  });

result.data = snapshots;

complete();