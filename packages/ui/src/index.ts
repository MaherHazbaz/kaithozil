// Public surface of @kaithozhil/ui. Apps import only from here.
export * from './tokens';

export { cssAngleToPoints, type GradientPoints, type Point } from './theme/gradient';
export { fontFamily, tamilWeight, type FontFamilyName, type FontWeight } from './theme/fonts';
export { antonFontAsset } from './theme/fontAssets';
export { splitByScript, type Script, type TextRun } from './text/splitByScript';

export { AppText, type AppTextProps } from './components/AppText';
export { Avatar, type AvatarProps } from './components/Avatar';
export { BottomNav, type BottomNavItem, type BottomNavProps } from './components/BottomNav';
export {
  GoldButton,
  GoldIconButton,
  PrimaryButton,
  SecondaryButton,
  type GoldIconButtonProps,
  type GradientButtonProps,
  type SecondaryButtonProps,
} from './components/Button';
export { Card, type CardProps } from './components/Card';
export { Chip, type ChipProps } from './components/Chip';
export { Gradient, type GradientProps } from './components/Gradient';
export { HeroHeader, type HeroHeaderProps } from './components/HeroHeader';
export { Icon, type IconName, type IconProps } from './components/Icon';
export { IconBox, type IconBoxProps, type IconBoxTone } from './components/IconBox';
export { InfoNote, type InfoNoteProps } from './components/InfoNote';
export { ListRow, type ListRowProps } from './components/ListRow';
export { Logo, type LogoProps } from './components/Logo';
export { Ripple, type RippleProps } from './components/Ripple';
export { ScreenBackground } from './components/ScreenBackground';
export { ScreenHeader, type ScreenHeaderProps } from './components/ScreenHeader';
export {
  SegmentedControl,
  type Segment,
  type SegmentedControlProps,
} from './components/SegmentedControl';
export { Skyline } from './components/Skyline';
export { StatusPill, type StatusPillProps } from './components/StatusPill';
export { Stepper, type StepperProps } from './components/Stepper';
export { Tappable, type TappableProps } from './components/Tappable';
