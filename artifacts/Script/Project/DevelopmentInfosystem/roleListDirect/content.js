const manager = p9.manager ? p9.manager : modules.typeorm.getConnection().manager;

const roleList = []

const acl = await manager.find('acl', {
    select: ["id", "name", "mode"]});

const roles = await manager.find('role', {
        select: ["id", "name"],
        loadRelationIds: true});

const { roleUsers, userRoles } = await usersForRole();

//console.log(roleUsers);
//console.log(userRoles);

for (const role of roles) {
    const cockpitAccess = role.acl.some( key => { const aclData = acl.find(x => x.id === key); return aclData.mode !== 'N'});

    roleList.push({
        id: role.id,
        name: role.name,
        cockpitAccess: cockpitAccess,
        users: roleUsers[role.id],
        user_count: roleUsers[role.id]?.length ?? 0,
        sec_groups: role.departments.length,
        tile_groups: role.categories.length,
        tiles: role.tiles.length
    });
}

roleList.sort(sort);
userRoles.sort(sort2);

result.data = { roleList, userRoles };

complete();

async function usersForRole() {

  const roleUsers = [];
  const userRoles = [];

    const repo = await manager.getRepository('users');
    const listUsers = await repo.createQueryBuilder("user")
    .select(['user.id','user.name', 'user.username'])
    .getMany();

    for (const user of listUsers) {
        const userDetail = await repo.createQueryBuilder("user").
        select(['user.id'])
        .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('user.departments', 'departments')
        .where("user.id = :id", { id: user.id })
        .getOne();

        userDetail.roles.map(role => {
        if (!roleUsers[role.id]) {
            roleUsers[role.id] = [];
        }
        roleUsers[role.id].push({id: user.id, name: user.name, username: user.username,  type: "user", source: "U"});
        })

        userRoles.push({
        id: user.id,
        name: user.name,
        username: user.username,
        roles: userDetail.roles.map(role => ({id: role.id, name: role.name}))
        })
    }            

    const security_groups = await manager.find('department', {
        select: ["id", "name"],
        loadRelationIds: true});

    for (const group of security_groups) {
        group.roles.map(roleId => {
            if (!roleUsers[roleId]) {
                roleUsers[roleId] = [];
            }
            roleUsers[roleId].push(...group.users.map(userId => {
                const userData = userRoles.find( x => x.id === userId );
                return {id: userId, name: userData.name, username: userData.username, type: "user", source: "G"};
            }));
        })
        group.users.map(userId => { 
            const userRole = userRoles.find( x => x.id === userId );
            group.roles.map( roleId => { const roleData = roles.find(y => y.id === roleId);userRole.roles.push({id: roleId, name: roleData.name})}) });
    }

  return {roleUsers, userRoles};
}

function sort(a, b) {
  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

function sort2(a, b) {
  const nameA = a.username.toUpperCase(); // ignore upper and lowercase
  const nameB = b.username.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};