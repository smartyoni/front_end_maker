export type ViewportMode = 'mobile' | 'tablet' | 'desktop';

export type ComponentType =
  | 'header'
  | 'bottomNav'
  | 'button'
  | 'input'
  | 'card'
  | 'text'
  | 'image'
  | 'badge'
  | 'avatar'
  | 'tabs'
  | 'list'
  | 'switch';

export type ActionType = 'navigate' | 'openModal' | 'toast' | 'none';

export interface ActionConfig {
  type: ActionType;
  targetScreenId?: string;
  modalTitle?: string;
  toastMessage?: string;
}

export interface ComponentItem {
  id: string;
  type: ComponentType;
  name: string;
  label?: string;
  placeholder?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  content?: string;
  imageUrl?: string;
  items?: string[]; // 탭이나 리스트 아이템용
  action?: ActionConfig;
  styles?: {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    fullWidth?: boolean;
    shadow?: 'none' | 'sm' | 'md' | 'lg';
  };
}

export interface Screen {
  id: string;
  name: string;
  components: ComponentItem[];
}

export interface HistoryState {
  past: Screen[][];
  future: Screen[][];
}
