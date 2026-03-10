import { ApiService } from "../core/requests";

const UserRoles = {
    Admin: 'Admin',
    Manager: 'Manager',
    Viewer: 'Viewer'
};

export 

function canEditMenu(role) {
    return role === UserRoles.Admin || role === UserRoles.Manager;
}

function canDeleteMenu(role) {
    return role === UserRoles.Admin;
}
