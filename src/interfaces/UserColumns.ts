export default interface PersonColumn {
    id: "id" | "name" | "last_name" | "email" | "username" | "roles" | "username_legacy" | "group_id" | "is_active" | "role" | "isPartner";
    label: string;
    minWidth?: number;
    align?: "left" |"right";
    component: any;
  }