import { IconName } from '@/assets/icons';
import {
  AndroidNativeProps,
  IOSNativeProps,
} from '@react-native-community/datetimepicker';
import { ReactNode } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import { DropdownProps } from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
import {
  ICountry,
  ICountryCca2,
  PhoneInputProps,
} from 'rn-international-phone-number';
import type { FontWeight, TextVariant } from '@/theme/typography';

export type FormInputVariant =
  | 'text'
  | 'dropdown'
  | 'date'
  | 'time'
  | 'country-phone'
  | 'toggle';

export type DropdownItem = {
  label: string;
  value: string;
};

export interface BaseFormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  rules?: object;
  label?: string;
  error?: string;

  /** Styles */
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  labelContainerStyle?: StyleProp<ViewStyle>;
  labelVariant?: TextVariant;
  labelWeight?: FontWeight;

  /** Tooltip */
  isTooltip?: boolean;
  tooltipMessage?: string;
}

//Text Input Variant Props
export interface TextInputVariantProps {
  leftIcon?: ReactNode;
  leftAdornment?: ReactNode;
  leftAdornmentStyle?: StyleProp<ViewStyle>;
  rightIcon?: ReactNode;
  isPassword?: boolean;
  focusOnContainerPress?: boolean;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  placeholder?: string;
  /** Replaces the field with a shimmer bone while true */
  isLoading?: boolean;
  /** Keep digits only (like phone / OTP) */
  digitsOnly?: boolean;
  textInputProps?: Partial<
    Omit<TextInputProps, 'onChangeText' | 'value' | 'placeholder' | 'editable'>
  >;
}

//Dropdown Variant Props
export interface DropdownVariantProps {
  dropdownData: DropdownItem[];
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onListFooterLoading?: () => React.ReactElement | null;
  search?: boolean;
  onSearchTextChange?: (text: string) => void;
  onDropdownSelect?: (item: DropdownItem) => void;
  /** Styles the closed dropdown trigger (maps to Dropdown `style`) */
  dropdownStyle?: StyleProp<ViewStyle>;
  /** Styles the open options list (maps to Dropdown `containerStyle`) */
  dropdownListStyle?: StyleProp<ViewStyle>;
  dropdownProps?: Partial<
    Omit<
      DropdownProps<any>,
      | 'data'
      | 'value'
      | 'onChange'
      | 'labelField'
      | 'valueField'
      | 'placeholder'
      | 'disable'
    >
  >;
}

//DateTime Variant Props

type Display = 'spinner' | 'default' | 'clock' | 'calendar';
type IOSDisplay = 'default' | 'compact' | 'inline' | 'spinner';
export interface DateTimeVariantProps {
  minimumDate?: Date;
  maximumDate?: Date;
  dateTimeContainerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  display?: Display | IOSDisplay;
  placeholder?: string;
  inputStyle?: StyleProp<TextStyle>;
  showIcon?: boolean;
  iconName?: IconName;
  placeholderTextColor?: string;

  dateTimePickerProps?: Partial<
    Omit<
      IOSNativeProps | AndroidNativeProps,
      | 'value'
      | 'onChange'
      | 'onValueChange'
      | 'onDismiss'
      | 'onNeutralButtonPress'
      | 'mode'
      | 'display'
      | 'minimumDate'
      | 'maximumDate'
      | 'disabled'
      | 'children'
    >
  >;
}

//Toggle Variant Props
type ToggleSize = 'sm' | 'md';

type ToggleStyles = {
  wrapper?: ViewStyle;
  track?: ViewStyle;
  thumb?: ViewStyle;
  label?: TextStyle;
};
export interface ToggleVariantProps {
  disabled?: boolean;
  size?: ToggleSize;
  showLabel?: boolean;
  onLabel?: string;
  offLabel?: string;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  styles?: ToggleStyles;
}

//Country Phone Variant Props
export type CountryPhoneAppearance = 'login' | 'field';

export interface CountryPhoneVariantProps {
  showFlag?: boolean;
  defaultCountry?: ICountryCca2;
  disabled?: boolean;
  modalDisabled?: boolean;
  /** `login` keeps the grey, taller input. `field` matches other form fields. */
  appearance?: CountryPhoneAppearance;
  countryContainerStyle?: StyleProp<ViewStyle>;
  placeholder?: string;
  onChangeSelectedCountry?: (country: ICountry) => void;
  phoneInputProps?: Partial<
    Omit<
      PhoneInputProps,
      | 'defaultValue'
      | 'onChangePhoneNumber'
      | 'defaultCountry'
      | 'onChangeCountry'
      | 'placeholder'
      | 'disabled'
      | 'modalDisabled'
    >
  >;
}

export type FormInputProps<T extends FieldValues> = BaseFormInputProps<T> &
  (
    | (TextInputVariantProps & { variant: 'text' })
    | (DropdownVariantProps & { variant: 'dropdown' })
    | (DateTimeVariantProps & { variant: 'date' | 'time' })
    | (CountryPhoneVariantProps & { variant: 'country-phone' })
    | (ToggleVariantProps & { variant: 'toggle' })
  );
