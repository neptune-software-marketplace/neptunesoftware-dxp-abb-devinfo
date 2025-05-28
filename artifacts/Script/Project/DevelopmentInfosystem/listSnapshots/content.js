 let snapshots = await entities.dev_infosystem_snapshot
  .find({
    select: [ 'id', 'createdAt'], // A
    order: { createdAt: 'DESC' }
  });

result.data = snapshots;

complete();
