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
  | 'switch'
  | 'colorBlock'
  | 'chipGroup'
  | 'categoryList'
  | 'checklist'
  | 'quickInput';

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
  items?: string[]; // 탭, 리스트, 칩, 체크리스트용
  headerColor?: string; // 컬러 블록 상단 바 색상 (보라, 초록 등)
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

export interface Panel {
  id: string;
  title: string;
  width: string; // '240px', '320px', 'flex-1' 등
  components: ComponentItem[];
}

export type PanelLayoutPreset = '1-panel' | '2-panel' | '3-panel';

export interface Screen {
  id: string;
  name: string;
  panels: Panel[];
}

export interface HistoryState {
  past: Screen[][];
  future: Screen[][];
}
