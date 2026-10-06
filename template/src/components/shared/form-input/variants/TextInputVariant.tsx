import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/theme';
import React, {
  ComponentRef,
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, TextInput, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from '../../Icon';
import BaseSkelton from '../../skelton/BaseSkelton';
import { normalize } from '@/utils/normalize';
import { isHindiLanguage } from '@/utils/hindiText';
import { TextInputVariantProps } from '../type';
import { FORM_FIELD, formFieldText } from '../formFieldStyles';

type InputValue = string | number;

type RHFTextField<T = InputValue> = {
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
};

type TextFormMode<T> = {
  mode: 'form';
  field: RHFTextField<T>;
};

type TextIndependentMode<T> = {
  mode: 'standalone';
  value: T;
  onChangeText: (value: T) => void;
};
type TextInputVisualProps<T = InputValue> =
  | (TextFormMode<T> & TextInputVariantProps)
  | (TextIndependentMode<T> & TextInputVariantProps);

type TextInputInstance = ComponentRef<typeof TextInput>;

const TextInputVariant = forwardRef<TextInputInstance, TextInputVisualProps>(
  (props, ref) => {
    const {
      mode,
      disabled,
      inputContainerStyle,
      inputStyle,
      leftIcon,
      leftAdornment,
      leftAdornmentStyle,
      textInputProps,
      rightIcon,
      placeholder = 'Enter text',
      isPassword = false,
      focusOnContainerPress = true,
      isLoading = false,
      digitsOnly = false,
    } = props;

    const { color } = useAppTheme();
    const { i18n } = useTranslation();
    const isHindi = isHindiLanguage(i18n.language);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputRef = useRef<TextInputInstance | null>(null);

    const setRefs = useCallback(
      (node: TextInputInstance | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const togglePassword = useCallback(() => {
      setIsPasswordVisible(prev => !prev);
    }, []);

    const resolvedValue = mode === 'form' ? props.field.value : props.value;
    const handleChange =
      mode === 'form' ? props.field.onChange : props.onChangeText;
    const handleBlur = mode === 'form' ? props.field.onBlur : undefined;
    const isNumberValue = typeof resolvedValue === 'number';

    const onChangeText = useCallback(
      (text: string) => {
        const nextText = digitsOnly ? text.replace(/\D/g, '') : text;

        if (isNumberValue) {
          const next = nextText === '' ? 0 : Number(nextText);
          handleChange?.(next as never);
          return;
        }
        handleChange?.(nextText as never);
      },
      [digitsOnly, handleChange, isNumberValue],
    );

    const isMultiline = Boolean(textInputProps?.multiline);
    const { style: customTextInputStyle, ...restTextInputProps } =
      textInputProps || {};

    const wrapperToneStyle = useMemo(
      () => ({
        backgroundColor: disabled
          ? color.disabled
          : color.background_primary,
        borderColor: color.border,
      }),
      [color.background_primary, color.border, color.disabled, disabled],
    );

    const inputColorStyle = useMemo(
      () => ({ color: color.text_primary }),
      [color.text_primary],
    );

    const fieldShimmerLayout = useMemo(
      () => [
        {
          key: 'textField',
          width: '100%' as const,
          height: FORM_FIELD.height,
          borderRadius: FORM_FIELD.radius,
        },
      ],
      [],
    );

    if (isLoading) {
      return (
        <BaseSkelton
          isLoading
          layout={fieldShimmerLayout}
          containerStyle={styles.shimmer}
        />
      );
    }

    return (
      <View
        collapsable={false}
        onTouchEnd={() => {
          if (!disabled && focusOnContainerPress && !leftAdornment) {
            inputRef.current?.focus();
          }
        }}
        style={[
          styles.wrapper,
          isMultiline && styles.multilineWrapper,
          wrapperToneStyle,
          inputContainerStyle,
        ]}
      >
        {leftAdornment ? (
          <View style={[styles.leftAdornment, leftAdornmentStyle]}>
            {leftAdornment}
          </View>
        ) : (
          leftIcon && (
            <Pressable
              style={[styles.leftIcon, isMultiline && styles.multilineIcon]}
              disabled={disabled}
              hitSlop={20}
            >
              {leftIcon}
            </Pressable>
          )
        )}

        <View
          collapsable={false}
          style={[styles.inputFlex, isMultiline && styles.multilineInputFlex]}
        >
          <TextInput
            ref={setRefs}
            value={String(resolvedValue ?? '')}
            onChangeText={onChangeText}
            onBlur={handleBlur}
            editable={!disabled}
            placeholderTextColor={color.text_placeholder}
            secureTextEntry={isPassword && !isPasswordVisible}
            placeholder={placeholder}
            cursorColor={color.text_primary}
            allowFontScaling={false}
            underlineColorAndroid="transparent"
            {...restTextInputProps}
            style={[
              styles.input,
              formFieldText.input,
              isHindi && formFieldText.inputHindi,
              inputColorStyle,
              isMultiline && styles.multilineInput,
              isMultiline && isHindi && styles.multilineInputHindi,
              leftAdornment ? styles.inputWithAdornment : undefined,
              inputStyle,
              customTextInputStyle,
            ]}
          />
        </View>

        {isPassword && (
          <Pressable
            onPress={togglePassword}
            style={[styles.rightIcon, isMultiline && styles.multilineIcon]}
            disabled={disabled}
            hitSlop={20}
          >
            <Icon name={isPasswordVisible ? 'eye' : 'eyeClose'} size={22} />
          </Pressable>
        )}

        {rightIcon && (
          <Pressable
            style={[styles.rightIcon, isMultiline && styles.multilineIcon]}
            disabled={disabled}
            hitSlop={20}
          >
            {rightIcon}
          </Pressable>
        )}
      </View>
    );
  },
);

export default memo(TextInputVariant);

const styles = StyleSheet.create({
  shimmer: {
    width: '100%',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: FORM_FIELD.radius,
    height: FORM_FIELD.height,
    minHeight: FORM_FIELD.height,
    width: '100%',
    paddingHorizontal: FORM_FIELD.paddingH,
  },
  multilineWrapper: {
    minHeight: normalize(100),
    height: undefined,
    alignItems: 'stretch',
    paddingVertical: 0,
  },
  inputFlex: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  multilineInputFlex: {
    alignSelf: 'stretch',
  },
  input: {
    paddingVertical: 0,
  },
  multilineInput: {
    height: undefined,
    fontSize: FORM_FIELD.fontSize,
    fontFamily: FontFamily.InterTightRegular,
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: normalize(100),
    width: '100%',
    alignSelf: 'stretch',
    includeFontPadding: false,
  },
  multilineInputHindi: {
    includeFontPadding: true,
    paddingTop: 14,
    paddingBottom: 14,
  },
  leftAdornment: {
    flexShrink: 0,
  },
  inputWithAdornment: {
    width: '100%',
    paddingHorizontal: 0,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  multilineIcon: {
    marginTop: 14,
  },
});
