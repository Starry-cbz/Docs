export interface MenuItem {
  id: string;
  title: string;
  url?: string;
  children?: MenuItem[];
}

export interface MenuProps {
  items: MenuItem[];
}

