const manager = p9.manager ? p9.manager : modules.typeorm.getConnection().manager;

const roleId = req.body?.id ?? 'FD76B0C4-E6C9-EC11-997E-DC9840109182';

const repo = await manager.getRepository('role');

const roleDetail = await repo.createQueryBuilder("role").
    select(['role.id', 'role.name'])
    .leftJoinAndSelect('role.tiles', 'tiles')
    .leftJoinAndSelect('role.categories', 'categories')
    .leftJoinAndSelect('role.departments', 'departments')
    .where("role.id = :id", { id: roleId })
    .getOne();

const roleUsage = {
    id: roleDetail.id,
    name: roleDetail.name,
    users: [],
    groups: roleDetail.departments.map(({id, name}) => ({id, name, type: "security_group"})),
    tile_groups: roleDetail.categories.map(({id, name}) => ({id, name, type: "tile_group"})),
    tiles: roleDetail.tiles.map(({id, name}) => ({id, name, type: "tile"}))
}

console.log(roleUsage);

result.data = roleUsage;

complete();