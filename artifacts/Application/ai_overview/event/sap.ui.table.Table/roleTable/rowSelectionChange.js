let context = oEvent.getParameter("rowContext");
let data = context.getObject();
console.log(data.name);
getRoleDetail(data.id);