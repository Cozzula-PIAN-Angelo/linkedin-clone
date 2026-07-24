import { createElement } from "react";
import type { ComponentType } from "react";
import {
  BellFill,
  BookFill,
  BriefcaseFill,
  Bug,
  CashCoin,
  ChatDotsFill,
  CodeSlash,
  CpuFill,
  Crosshair2,
  Diagram3Fill,
  Droplet,
  ExclamationOctagonFill,
  EyeFill,
  Feather,
  Fire,
  Gem,
  Incognito,
  List,
  Magic,
  MoonStars,
  PeopleFill,
  ShieldFill,
  Broadcast,
} from "react-bootstrap-icons";
import VillainLogo from "../../components/VillainLogo";
import UmbrellaCorpLogo from "../../components/UmbrellaCorpLogo";
import CyberpunkEffects from "./CyberpunkEffects";
// dentro themeConfig.ts
import HorrorEffects from "./HorrorEffects";
import FantasyEffects from "./FantasyEffects";
import FantasyRingLogo from "../../components/FantasyRingLogo";

export type BrandTheme =
  | "default"
  | "villain"
  | "fantasy"
  | "cyberpunk"
  | "horror";

export const brandThemes: BrandTheme[] = [
  "default",
  "villain",
  "fantasy",
  "cyberpunk",
  "horror",
];

export type IconComponent = ComponentType<{ size?: number }>;

// Badge "in" del logo LinkedIn originale, per il tema di default.
function DefaultLogo() {
  return createElement("span", null, "in");
}

type NavIconSet = {
  network: IconComponent;
  jobs: IconComponent;
  messaging: IconComponent;
  more: IconComponent;
  notifications: IconComponent;
};

export type ThemeConfig = {
  label: string;
  swatch: string;
  logo: IconComponent;
  icons: NavIconSet;
  effects?: ComponentType;
};

export const themeConfigs: Record<BrandTheme, ThemeConfig> = {
  default: {
    label: "LinkedIn (normale)",
    swatch: "#0a66c2",
    logo: DefaultLogo,
    icons: {
      network: PeopleFill,
      jobs: BriefcaseFill,
      messaging: ChatDotsFill,
      more: List,
      notifications: BellFill,
    },
  },
  villain: {
    label: "ex-Villain",
    swatch: "#c1121f",
    logo: VillainLogo,
    icons: {
      network: EyeFill,
      jobs: CashCoin,
      messaging: Broadcast,
      more: Magic,
      notifications: BellFill,
    },
  },
  fantasy: {
    label: "Fantasy",
    swatch: "#1f6d4c",
    logo: FantasyRingLogo,
    icons: {
      network: ShieldFill,
      jobs: Gem,
      messaging: Feather,
      more: BookFill,
      notifications: BellFill,
    },
    effects: FantasyEffects,
  },
  cyberpunk: {
    label: "Cyberpunk",
    swatch: "#9d00ff",
    logo: CpuFill,
    icons: {
      network: Diagram3Fill,
      jobs: Crosshair2,
      messaging: CodeSlash,
      more: Incognito,
      notifications: ExclamationOctagonFill,
    },
    effects: CyberpunkEffects,
  },
  horror: {
    label: "Umbrella Corp (Horror)",
    swatch: "#dc3545",
    logo: UmbrellaCorpLogo,
    icons: {
      network: MoonStars,
      jobs: Droplet,
      messaging: Bug,
      more: Fire,
      notifications: BellFill,
    },
    effects: HorrorEffects, 
  },
};
