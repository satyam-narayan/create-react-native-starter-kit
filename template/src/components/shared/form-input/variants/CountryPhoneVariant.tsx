import React, { forwardRef, memo } from 'react';
import { StyleSheet } from 'react-native';
import PhoneInput, {
  IPhoneInputRef,
} from 'rn-international-phone-number';
import { useAppTheme } from '@/context/ThemeContext';
import { CountryPhoneVariantProps } from '../type';
import { FORM_FIELD } from '../formFieldStyles';
import { FontFamily } from '@/theme';
import { normalize } from '@/utils/normalize';

type RHFPhoneField = {
  value: string;
  onChange: (value: string) => void;
};

type FormModeProps = {
  mode: 'form';
  field: RHFPhoneField;
};

type StandaloneModeProps = {
  mode: 'standalone';
  value: string;
  onChange: (value: string) => void;
};

export type CountryPhoneVisualProps =
  | (FormModeProps & CountryPhoneVariantProps)
  | (StandaloneModeProps & CountryPhoneVariantProps);

const CountryPhoneVariant = forwardRef<IPhoneInputRef, CountryPhoneVisualProps>(
  (props, ref) => {
    const { color } = useAppTheme();
    const {
      mode,
      appearance = 'login',
      countryContainerStyle,
      defaultCountry = 'IN',
      showFlag = true,
      disabled,
      modalDisabled = false,
      onChangeSelectedCountry,
      phoneInputProps,
      placeholder = 'Enter phone number',
    } = props;

    const resolvedValue = mode === 'form' ? props.field.value : props.value;
    const handleChange =
      mode === 'form' ? props.field.onChange : props.onChange;
    const showCountryCaret = showFlag && !modalDisabled;
    const isFieldAppearance = appearance === 'field';
    const chrome = isFieldAppearance ? fieldChrome : loginChrome;
    const fillColor = disabled
      ? color.disabled
      : isFieldAppearance
        ? color.background_primary
        : color.background_secondary;
    const prefixFillColor = disabled
      ? color.disabled
      : color.background_primary;
    const placeholderColor = isFieldAppearance
      ? color.text_placeholder
      : color.placeholder;

    return (
      <PhoneInput
        ref={ref ?? null}
        value={resolvedValue ?? ''}
        defaultCountry={defaultCountry}
        onChangePhoneNumber={handleChange}
        onChangeCountry={onChangeSelectedCountry}
        allowFontScaling={false}
        disabled={disabled}
        modalDisabled={modalDisabled}
        customFlag={isFieldAppearance ? () => null : undefined}
        customCaret={
          isFieldAppearance ? (() => null as unknown as React.ReactElement) : undefined
        }
        phoneInputStyles={{
          flag: showFlag
            ? { display: 'flex' }
            : {
                display: 'none',
                width: 0,
                height: 0,
                margin: 0,
                padding: 0,
              },
          caret: showCountryCaret
            ? { display: 'flex', color: color.text_primary }
            : {
                display: 'none',
                width: 0,
                height: 0,
                margin: 0,
                padding: 0,
                color: color.text_primary,
              },
          divider: isFieldAppearance
            ? {
                display: 'none',
                width: 0,
                height: 0,
                marginHorizontal: 0,
                marginLeft: 0,
                marginRight: 0,
              }
            : {
                display: showCountryCaret ? 'flex' : 'none',
                width: showCountryCaret ? undefined : 0,
                height: showCountryCaret ? undefined : 0,
                opacity: showCountryCaret ? 1 : 0,
                margin: showCountryCaret ? undefined : 0,
                padding: showCountryCaret ? undefined : 0,
                backgroundColor: showCountryCaret
                  ? color.border
                  : 'transparent',
              },
          container: [
            chrome.container,
            {
              backgroundColor: fillColor,
              borderColor: color.border,
            },
            countryContainerStyle,
          ],
          callingCode: [
            chrome.callingCode,
            {
              color: color.text_primary,
            },
          ],
          input: [
            chrome.input,
            { color: color.text_primary },
          ],
          flagContainer: isFieldAppearance
            ? {
                ...fieldChrome.flagContainer,
                backgroundColor: prefixFillColor,
              }
            : [
                chrome.flagContainer,
                {
                  backgroundColor: prefixFillColor,
                },
                !showFlag && chrome.flagContainerNoFlag,
              ],
        }}
        placeholder={placeholder}
        cursorColor={color.text_primary}
        modalStyles={{
          countryItem: { backgroundColor: color.background_primary },
          content: { backgroundColor: color.background_secondary },
          countryName: { color: color.text_primary },
          callingCode: { color: color.text_primary },
          searchInput: [
            styles.searchInput,
            {
              backgroundColor: color.background_primary,
              color: color.text_primary,
            },
          ],
          countryNotFoundMessage: {
            color: color.text_primary,
          },
          alphabetLetterText: { color: color.text_primary },
          alphabetLetterTextActive: { color: color.text_primary },
        }}
        modalSearchInputPlaceholderTextColor={placeholderColor}
        placeholderTextColor={placeholderColor}
        keyboardType="number-pad"
        {...phoneInputProps}
      />
    );
  },
);

export default memo(CountryPhoneVariant);

const loginChrome = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingRight: 12,
    minHeight: normalize(52),
    borderTopWidth: 1.5,
  },
  callingCode: {
    paddingRight: 18,
    fontSize: normalize(16),
    lineHeight: normalize(20),
    fontFamily: FontFamily.InterTightMedium,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: normalize(16),
    fontFamily: FontFamily.InterTightRegular,
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  flagContainer: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 0,
    alignSelf: 'stretch',
  },
  flagContainerNoFlag: {
    paddingLeft: 14,
  },
});

const fieldChrome = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: FORM_FIELD.radius,
    height: FORM_FIELD.height,
    minHeight: FORM_FIELD.height,
    paddingLeft: FORM_FIELD.paddingH,
    paddingRight: FORM_FIELD.paddingH,
  },
  callingCode: {
    paddingLeft: 0,
    paddingRight: 6,
    margin: 0,
    fontSize: FORM_FIELD.fontSize,
    lineHeight: FORM_FIELD.lineHeight,
    fontFamily: FontFamily.InterTightRegular,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  input: {
    flex: 1,
    width: 'auto',
    height: '100%',
    fontSize: FORM_FIELD.fontSize,
    fontFamily: FontFamily.InterTightRegular,
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    paddingLeft: 0,
    paddingRight: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: FORM_FIELD.radius,
    borderBottomLeftRadius: FORM_FIELD.radius,
    paddingHorizontal: 0,
    paddingVertical: 0,
    paddingLeft: 0,
    paddingRight: 0,
    margin: 0,
    gap: 0,
    minWidth: 0,
    height: '100%',
  },
  flagContainerNoFlag: {
    paddingHorizontal: 0,
    paddingLeft: 0,
    gap: 0,
    minWidth: 0,
  },
});

const styles = StyleSheet.create({
  searchInput: {
    paddingLeft: 10,
  },
});
