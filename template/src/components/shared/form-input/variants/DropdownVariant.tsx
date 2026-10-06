import { useAppTheme } from '@/context/ThemeContext';
import { DropdownItem, DropdownVariantProps } from '../type';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from '../../Icon';
import { normalize } from '@/utils/normalize';
import { isHindiLanguage } from '@/utils/hindiText';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FORM_FIELD, formFieldText } from '../formFieldStyles';

type RHFDropdownField = {
  value: string;
  onChange: (value: string) => void;
};
type DropdownFormMode = {
  mode: 'form';
  field: RHFDropdownField;
};

type DropdownStandaloneMode = {
  mode: 'standalone';
  value: string;
  onChange: (value: string) => void;
};

export type DropdownVisualProps =
  | (DropdownFormMode & DropdownVariantProps)
  | (DropdownStandaloneMode & DropdownVariantProps);

interface AnimatedArrowProps {
  visible?: boolean;
}

const AnimatedDropdownArrow = memo(
  ({ visible = false }: AnimatedArrowProps) => {
    const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;

    useEffect(() => {
      Animated.spring(anim, {
        toValue: visible ? 1 : 0,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }, [visible, anim]);

    const scale = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.75, 1],
    });

    const opacity = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.7, 1],
    });

    return (
      <Animated.View
        style={[styles.trailingIconSlot, { transform: [{ scale }], opacity }]}
      >
        <Icon
          name={visible ? 'upArrow' : 'downArrow'}
          width={FORM_FIELD.iconSize}
          height={FORM_FIELD.iconSize}
        />
      </Animated.View>
    );
  },
);

const DropdownVariant = (props: DropdownVisualProps) => {
  const { color } = useAppTheme();
  const { i18n } = useTranslation();
  const isHindi = isHindiLanguage(i18n.language);

  const {
    dropdownData,
    disabled,
    placeholder,
    isLoading,
    onLoadMore,
    onListFooterLoading,
    search,
    onSearchTextChange,
    onDropdownSelect,
    dropdownProps,
    dropdownStyle,
    dropdownListStyle,
    mode,
  } = props;

  const resolvedValue = mode === 'form' ? props.field.value : props.value;

  const handleChange = mode === 'form' ? props.field.onChange : props.onChange;

  const renderRightIcon = useCallback(
    (visible?: boolean) => {
      if (dropdownProps?.renderRightIcon) {
        return dropdownProps.renderRightIcon(visible);
      }
      if (isLoading) {
        return (
          <View style={styles.trailingIconSlot}>
            <ActivityIndicator size="small" color={color.primary} />
          </View>
        );
      }
      return <AnimatedDropdownArrow visible={visible} />;
    },
    [dropdownProps, isLoading, color.primary],
  );

  const handleDropdownChange = useCallback(
    (item: DropdownItem) => {
      handleChange(item.value);
      onDropdownSelect?.(item);
    },
    [handleChange, onDropdownSelect],
  );

  return (
    <Dropdown
      {...dropdownProps}
      data={dropdownData}
      labelField="label"
      valueField="value"
      value={resolvedValue}
      disable={disabled}
      showsVerticalScrollIndicator={false}
      placeholder={placeholder}
      style={[
        styles.dropdownTrigger,
        {
          borderColor: color.border,
          backgroundColor: disabled
            ? color.disabled
            : color.background_primary,
        },
        dropdownStyle,
      ]}
      containerStyle={[
        styles.dropdownList,
        {
          borderColor: color.border,
          backgroundColor: color.background_primary,
        },
        dropdownListStyle,
        dropdownProps?.containerStyle,
      ]}
      placeholderStyle={[
        formFieldText.dropdownText,
        isHindi && formFieldText.dropdownTextHindi,
        { color: color.text_placeholder },
        dropdownProps?.placeholderStyle,
      ]}
      selectedTextStyle={[
        formFieldText.dropdownText,
        isHindi && formFieldText.dropdownTextHindi,
        { color: color.text_primary },
        dropdownProps?.selectedTextStyle,
      ]}
      itemTextStyle={[
        formFieldText.dropdownText,
        isHindi && formFieldText.dropdownTextHindi,
        { color: color.text_primary },
        dropdownProps?.itemTextStyle,
      ]}
      itemContainerStyle={dropdownProps?.itemContainerStyle}
      activeColor={color.border}
      renderRightIcon={renderRightIcon}
      iconStyle={styles.dropdownIconStyle}
      onChange={handleDropdownChange}
      flatListProps={{
        onEndReachedThreshold: 0.05,
        onEndReached: onLoadMore,
        ListFooterComponent: onListFooterLoading,
      }}
      search={search}
      searchPlaceholder="Search..."
      onChangeText={onSearchTextChange}
      inputSearchStyle={{
        color: color.text_primary,
        borderRadius: normalize(12),
        borderColor: color.border,
      }}
    />
  );
};

export default memo(DropdownVariant);

const styles = StyleSheet.create({
  dropdownTrigger: {
    borderWidth: 1,
    borderRadius: FORM_FIELD.radius,
    height: FORM_FIELD.height,
    minHeight: FORM_FIELD.height,
    width: '100%',
    paddingLeft: FORM_FIELD.paddingH,
    paddingRight: FORM_FIELD.paddingH,
    justifyContent: 'center',
  },
  trailingIconSlot: {
    width: FORM_FIELD.iconSize,
    height: FORM_FIELD.iconSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIconStyle: {
    width: FORM_FIELD.iconSize,
    height: FORM_FIELD.iconSize,
    marginRight: 0,
  },
  dropdownList: {
    borderWidth: 1,
    maxHeight: normalize(200),
    overflow: 'hidden',
    borderRadius: 5,
  },
});
