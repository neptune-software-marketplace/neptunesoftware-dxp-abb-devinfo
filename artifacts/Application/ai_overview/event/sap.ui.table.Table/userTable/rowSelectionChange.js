let context = oEvent.getParameter("rowContext");
let data = context.getObject();

console.log(data.name);

modeluserTable1.setData(data.roles);

