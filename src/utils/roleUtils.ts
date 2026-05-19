export const hasRole = (roles: Role[], target: Role) => {
  return roles.includes(target);
};

export const buildMenu = (roles: Role[]) => {
  const menu = [];

  if (roles.includes("admin")) {
    menu.push("Doctors", "Staff", "Patients");
  }

  if (roles.includes("doctor")) {
    menu.push("Appointments", "My Patients");
  }

  if (roles.includes("staff")) {
    menu.push("Schedule", "Reception");
  }

  if (roles.includes("patient")) {
    menu.push("My Appointments");
  }

  return menu;
};