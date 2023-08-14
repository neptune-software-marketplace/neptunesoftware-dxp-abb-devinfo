const { In } = operators;

const snapshotIds = req.body;

await entities.dev_infosystem_snapshot.delete(snapshotIds);

await entities.dev_infosystem_snapshot_data.delete({
    snapshot_id: In(snapshotIds)
});

const snapshots = await entities.dev_infosystem_snapshot
  .find({
    select: [ 'id', 'createdAt'],
    order: { createdAt: 'DESC' }
  });

result.data = snapshots;

complete();