import Back from './back.svg';
import Calendar from './calendar.svg';
import Claim_upload from './claim_upload.svg';
import Clock from './clock.svg';
import DownArrow from './downArrow.svg';
import Edit from './edit.svg';
import Eye from './eye.svg';
import EyeClose from './eyeClose.svg';
import Folder from './folder.svg';
import Home from './home.svg';
import Log_out from './log_out.svg';
import Setting from './setting.svg';
import Tooltip_dark from './tooltip_dark.svg';
import Tooltip_light from './tooltip_light.svg';
import UpArrow from './upArrow.svg';

export const Icons = {
  back: Back,
  calendar: Calendar,
  claim_upload: Claim_upload,
  clock: Clock,
  downArrow: DownArrow,
  edit: Edit,
  eye: Eye,
  eyeClose: EyeClose,
  folder: Folder,
  home: Home,
  log_out: Log_out,
  setting: Setting,
  tooltip_dark: Tooltip_dark,
  tooltip_light: Tooltip_light,
  upArrow: UpArrow,
} as const;

export type IconName = keyof typeof Icons;
