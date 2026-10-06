import { useState } from 'react';
import { FormInputProps } from './type';
import { StyleSheet, View } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Controller, FieldValues } from 'react-hook-form';
import { FormInputRenderer } from './FormInputRenderer';
import CustomText from '../text/CustomText';
import { useAppTheme } from '@/context/ThemeContext';
import Icon from '../Icon';
import { isIOS } from '@/constants/device';
import { FORM_FIELD } from './formFieldStyles';
import { spacing } from '@/theme';

const FormInput = <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  error,
  containerStyle,
  labelStyle,
  labelContainerStyle,
  labelVariant = 'footnote',
  labelWeight = '600',
  isTooltip,
  tooltipMessage,
  variant,
  ...rest
}: FormInputProps<T>) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const { color, icon } = useAppTheme();

  const handleTooltipPress = () => {
    setShowTooltip(prev => !prev);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <View style={[styles.labelCont, labelContainerStyle]}>
          <CustomText
            style={[styles.label, labelStyle]}
            variant={labelVariant}
            weight={labelWeight}
            textColor={color.text_primary}
          >
            {label}
          </CustomText>

          {isTooltip ? (
            <Tooltip
              isVisible={showTooltip}
              placement="bottom"
              tooltipStyle={styles.tooltip}
              content={
                <CustomText
                  variant="label"
                  textColor={color.text_input}
                  style={styles.tooltipText}
                >
                  {tooltipMessage}
                </CustomText>
              }
              contentStyle={[
                styles.tooltipContent,
                { backgroundColor: color.background_primary },
              ]}
              disableShadow
              closeOnBackgroundInteraction={true}
              closeOnContentInteraction={true}
              childContentSpacing={isIOS ? 0 : -10}
              showChildInTooltip={false}
              onClose={handleTooltipPress}
              backgroundColor="transparent"
            >
              <Icon
                name={icon.tooltip}
                size={15}
                style={styles.tooltipIcon}
                onPress={handleTooltipPress}
                hitSlop={20}
              />
            </Tooltip>
          ) : null}
        </View>
      ) : null}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => (
          <FormInputRenderer<T> variant={variant} field={field} {...rest} />
        )}
      />

      {error ? (
        <CustomText
          variant="footnote"
          weight="500"
          textColor={color.danger}
          style={styles.errorText}
        >
          {error}
        </CustomText>
      ) : null}
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  labelCont: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: FORM_FIELD.labelGap,
  },
  label: {
    marginBottom: 0,
  },
  errorText: {
    marginTop: 4,
    marginBottom: 0,
    marginLeft: 6,
  },
  tooltip: {
    backgroundColor: 'transparent',
  },
  tooltipContent: {},
  tooltipIcon: { marginBottom: 8 },
  tooltipText: {
    textAlign: 'center',
  },
});
