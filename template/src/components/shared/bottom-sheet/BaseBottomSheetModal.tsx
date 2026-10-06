import React, { forwardRef, memo, useCallback, useMemo } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useAppTheme } from '@/context/ThemeContext';

interface Props extends Partial<Omit<BottomSheetModalProps, 'snapPoints'>> {
  children: React.ReactNode;
  snapPoints?: string[];
}

const BaseBottomSheetModal = forwardRef<BottomSheetModal, Props>(
  ({ children, snapPoints = ['50%'], ...rest }, ref) => {
    const memoSnapPoints = useMemo(() => snapPoints, [snapPoints]);
    const { color } = useAppTheme();

    const bottomSheetBackdropRenderer = useCallback(
      (backdropProps: BottomSheetDefaultBackdropProps) => {
        return (
          <BottomSheetBackdrop
            {...backdropProps}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior={'close'}
          />
        );
      },
      [],
    );
    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={memoSnapPoints}
        backgroundStyle={[{ backgroundColor: color.background_secondary }]}
        enablePanDownToClose
        enableDynamicSizing
        backdropComponent={bottomSheetBackdropRenderer}
        handleIndicatorStyle={{ backgroundColor: color.border }}
        {...rest}
      >
        {children}
      </BottomSheetModal>
    );
  },
);

export default memo(BaseBottomSheetModal);
