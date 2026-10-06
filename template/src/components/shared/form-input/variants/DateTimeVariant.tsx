import { useAppTheme } from '@/context/ThemeContext';
import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from '../../Icon';
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { DateTimeVariantProps } from '../type';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { isAndroid, isIOS } from '@/constants/device';
import { FontFamily } from '@/theme';
import { normalize } from '@/utils/normalize';
import { FORM_FIELD } from '../formFieldStyles';
import CustomText from '../../text/CustomText';

type IOSMode = 'date' | 'time' | 'datetime' | 'countdown';
type AndroidMode = 'date' | 'time';

type RHFDateTimeField = {
  value?: Date;
  onChange?: (date: Date) => void;
};

type DateTimeFormMode = {
  mode: 'form';
  field: RHFDateTimeField;
  dateTimeMode?: IOSMode | AndroidMode;
};

type DateTimeIndependentMode = {
  mode: 'standalone';
  value?: Date;
  onChange?: (date: Date) => void;
  dateTimeMode?: IOSMode | AndroidMode;
};

type DateTimeVisualProps =
  | (DateTimeFormMode & DateTimeVariantProps)
  | (DateTimeIndependentMode & DateTimeVariantProps);

const DateTimeVariant = (props: DateTimeVisualProps) => {
  const { t } = useTranslation();
  const { color } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [draftDate, setDraftDate] = useState<Date>(new Date());

  const {
    mode,
    disabled,
    placeholder = 'Select date',
    dateTimeMode = 'date',
    inputStyle,
    minimumDate,
    maximumDate,
    showIcon = true,
    iconName = 'calendar',
    placeholderTextColor,
    dateTimePickerProps,
    dateTimeContainerStyle,
  } = props;

  const value =
    mode === 'form' ? props.field.value ?? null : props.value ?? null;

  const onChange = mode === 'form' ? props.field.onChange : props.onChange;

  useEffect(() => {
    if (showPicker) {
      setDraftDate(value ?? new Date());
    }
  }, [showPicker, value]);

  const handleAndroidValueChange = useCallback(
    (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
      onChange?.(selectedDate);
      setShowPicker(false);
    },
    [onChange],
  );

  const handleIosValueChange = useCallback(
    (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
      setDraftDate(selectedDate);
    },
    [],
  );

  const handleDismiss = useCallback(() => {
    setShowPicker(false);
  }, []);

  const handleConfirmIos = useCallback(() => {
    onChange?.(draftDate);
    setShowPicker(false);
  }, [draftDate, onChange]);

  const handlePress = useCallback(() => {
    if (disabled) {
      return;
    }
    setShowPicker(true);
  }, [disabled]);

  const displayValue = value
    ? moment(value).format(dateTimeMode === 'time' ? 'hh:mm A' : 'DD/MM/YYYY')
    : '';

  return (
    <>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        style={[
          styles.wrapper,
          {
            backgroundColor: disabled
              ? color.disabled
              : color.background_primary,
            borderColor: color.border,
          },
          dateTimeContainerStyle,
        ]}
      >
        <Text
          numberOfLines={1}
          allowFontScaling={false}
          style={[
            styles.input,
            {
              color: displayValue
                ? color.text_primary
                : (placeholderTextColor ?? color.text_placeholder),
            },
            inputStyle,
          ]}
        >
          {displayValue || placeholder}
        </Text>

        {showIcon ? (
          <View style={styles.rightIconWrap} pointerEvents="none">
            <Icon
              name={iconName}
              width={FORM_FIELD.iconSize}
              height={FORM_FIELD.iconSize}
            />
          </View>
        ) : null}
      </Pressable>

      {showPicker && isAndroid ? (
        <DateTimePicker
          value={value ?? new Date()}
          mode={dateTimeMode}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          {...dateTimePickerProps}
          onValueChange={handleAndroidValueChange}
          onDismiss={handleDismiss}
        />
      ) : null}

      {isIOS ? (
        <Modal
          transparent
          visible={showPicker}
          animationType="fade"
          onRequestClose={handleDismiss}
        >
          <View style={styles.iosOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={handleDismiss} />
            <View
              style={[
                styles.iosSheet,
                { backgroundColor: color.background_primary },
              ]}
            >
              <View style={styles.iosToolbar}>
                <Pressable onPress={handleDismiss} hitSlop={12}>
                  <CustomText
                    variant="body"
                    weight="500"
                    textColor={color.text_secondary}
                  >
                    {t('common.cancel')}
                  </CustomText>
                </Pressable>
                <Pressable onPress={handleConfirmIos} hitSlop={12}>
                  <CustomText
                    variant="body"
                    weight="600"
                    textColor={color.primary}
                  >
                    {t('common.done')}
                  </CustomText>
                </Pressable>
              </View>

              <DateTimePicker
                value={draftDate}
                mode={dateTimeMode}
                display="spinner"
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                themeVariant="light"
                {...dateTimePickerProps}
                onValueChange={handleIosValueChange}
                onDismiss={handleDismiss}
                style={styles.iosPicker}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
};

export default memo(DateTimeVariant);

const styles = StyleSheet.create({
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
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: FontFamily.InterTightRegular,
    fontSize: FORM_FIELD.fontSize,
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  rightIconWrap: {
    marginLeft: normalize(8),
    width: FORM_FIELD.iconSize,
    height: FORM_FIELD.iconSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iosOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  iosSheet: {
    borderTopLeftRadius: normalize(16),
    borderTopRightRadius: normalize(16),
    paddingBottom: normalize(24),
    overflow: 'hidden',
  },
  iosToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(14),
  },
  iosPicker: {
    alignSelf: 'center',
    width: '100%',
  },
});
