const roleDetail = xhr.responseJSON;

modelgroupsForRoleTable.setData(roleDetail.groups);
modeltilegroupsForRoleTable.setData(roleDetail.tile_groups);
modeltilesForRoleTable.setData(roleDetail.tiles);

groupsForRoleTabFilter.setCount(roleDetail.groups.length);
tilegroupsForRoleTabFilter.setCount(roleDetail.tile_groups.length);
tilesForRole.setCount(roleDetail.tiles.length);

const roles =  modelroleTable.getData();

const role = roles.find(role => role.id === roleDetail.id);

modelusersForRoleTable.setData(role.users);
usersForRole.setCount(role.users.length);