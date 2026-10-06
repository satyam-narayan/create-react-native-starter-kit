import React, { memo, useCallback, useMemo } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import FormInput from './FormInput';
import DropdownVariant from './variants/DropdownVariant';
import Icon from '../Icon';
import CustomText from '@/components/shared/text/CustomText';
import { useAppTheme } from '@/context/ThemeContext';
import { ColorType, FontFamily } from '@/theme';
import { FontWeight, TextVariant } from '@/theme/typography';
import { normalize } from '@/utils/normalize';
import { DropdownItem, TextInputVariantProps } from './type';
import { FORM_FIELD } from './formFieldStyles';

export interface FullNameInputProps<T extends FieldValues> {
  control: Control<T>;
  titleName: Path<T>;
  name: Path<T>;
  titleOptions: DropdownItem[];
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  labelVariant?: TextVariant;
  labelWeight?: FontWeight;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  labelContainerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  titleDropdownStyle?: StyleProp<ViewStyle>;
  titleDropdownListStyle?: StyleProp<ViewStyle>;
  textInputProps?: TextInputVariantProps['textInputProps'];
}

const TITLE_DROPDOWN_WIDTH = normalize(64);
const TITLE_DROPDOWN_HEIGHT = normalize(32);

const FullNameInput = <T extends FieldValues>({
  control,
  titleName,
  name,
  titleOptions,
  label,
  placeholder,
  error,
  disabled,
  labelVariant,
  labelWeight,
  containerStyle,
  labelStyle,
  labelContainerStyle,
  inputContainerStyle,
  inputStyle,
  titleDropdownStyle,
  titleDropdownListStyle,
  textInputProps,
}: FullNameInputProps<T>) => {
  const { color } = useAppTheme();
  const styles = useMemo(() => makeStyles(color), [color]);

  const renderTitleIcon = useCallback(
    (visible?: boolean) => (
      <View style={styles.titleDropdownIcon}>
        <Icon
          name={visible ? 'upArrow' : 'downArrow'}
          width={normalize(10)}
          height={normalize(6)}
          color={color.text_primary}
        />
      </View>
    ),
    [styles.titleDropdownIcon, color.text_primary],
  );

  const renderTitleItem = useCallback(
    (item: DropdownItem) => (
      <View style={styles.titleDropdownItem}>
        <CustomText
          variant="subtitle"
          weight="500"
          style={styles.titleDropdownItemText}
        >
          {item.label}
        </CustomText>
      </View>
    ),
    [styles.titleDropdownItem, styles.titleDropdownItemText],
  );

  const titleDropdown = useMemo(
    () => (
      <Controller
        control={control}
        name={titleName}
        render={({ field }) => (
          <DropdownVariant
            mode="form"
            field={field}
            dropdownData={titleOptions}
            disabled={disabled}
            dropdownStyle={[styles.titleDropdown, titleDropdownStyle]}
            dropdownListStyle={[
              styles.titleDropdownList,
              titleDropdownListStyle,
            ]}
            dropdownProps={{
              renderRightIcon: renderTitleIcon,
              renderItem: renderTitleItem,
              selectedTextStyle: styles.titleDropdownText,
              placeholderStyle: styles.titleDropdownText,
            }}
          />
        )}
      />
    ),
    [
      control,
      titleName,
      titleOptions,
      disabled,
      styles.titleDropdown,
      styles.titleDropdownList,
      styles.titleDropdownText,
      titleDropdownStyle,
      titleDropdownListStyle,
      renderTitleIcon,
      renderTitleItem,
    ],
  );

  return (
    <FormInput
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      error={error}
      variant="text"
      disabled={disabled}
      labelVariant={labelVariant}
      labelWeight={labelWeight}
      containerStyle={containerStyle}
      labelStyle={labelStyle}
      labelContainerStyle={labelContainerStyle}
      inputContainerStyle={[styles.inputContainer, inputContainerStyle]}
      inputStyle={[styles.inputText, inputStyle]}
      leftAdornment={titleDropdown}
      focusOnContainerPress={false}
      textInputProps={{
        autoCapitalize: 'words',
        ...textInputProps,
      }}
    />
  );
};

export default memo(FullNameInput) as typeof FullNameInput;

const makeStyles = (color: ColorType) =>
  StyleSheet.create({
    inputContainer: {
      backgroundColor: color.background_primary,
      borderColor: color.border,
      borderRadius: FORM_FIELD.radius,
      height: FORM_FIELD.height,
      paddingHorizontal: normalize(8),
      paddingVertical: normalize(8),
      gap: normalize(8),
      alignItems: 'center',
    },
    inputText: {
      flex: 1,
      width: '100%',
      fontFamily: FontFamily.InterTightRegular,
      fontSize: FORM_FIELD.fontSize,
      lineHeight: FORM_FIELD.lineHeight,
      height: TITLE_DROPDOWN_HEIGHT,
      paddingHorizontal: 0,
      paddingTop: 0,
      paddingBottom: 0,
      margin: 0,
      minWidth: 0,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    titleDropdown: {
      width: TITLE_DROPDOWN_WIDTH,
      height: TITLE_DROPDOWN_HEIGHT,
      minHeight: TITLE_DROPDOWN_HEIGHT,
      maxHeight: TITLE_DROPDOWN_HEIGHT,
      borderRadius: normalize(8),
      paddingHorizontal: normalize(6),
      paddingVertical: 0,
      paddingLeft: normalize(6),
      paddingRight: normalize(6),
      backgroundColor: color.background_soft,
      borderColor: color.border,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible',
    },
    titleDropdownText: {
      fontFamily: FontFamily.InterTightMedium,
      fontSize: FORM_FIELD.fontSize,
      lineHeight: FORM_FIELD.lineHeight,
      color: color.text_primary,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    titleDropdownIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: normalize(2),
    },
    titleDropdownList: {
      width: TITLE_DROPDOWN_WIDTH,
      minWidth: TITLE_DROPDOWN_WIDTH,
      maxWidth: TITLE_DROPDOWN_WIDTH,
      marginTop: normalize(4),
      borderRadius: normalize(8),
      overflow: 'hidden',
    },
    titleDropdownItem: {
      height: normalize(36),
      width: TITLE_DROPDOWN_WIDTH,
      paddingHorizontal: normalize(6),
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleDropdownItemText: {
      fontFamily: FontFamily.InterTightMedium,
      fontSize: FORM_FIELD.fontSize,
      lineHeight: FORM_FIELD.lineHeight,
      color: color.text_primary,
      textAlign: 'center',
      includeFontPadding: false,
    },
  });
