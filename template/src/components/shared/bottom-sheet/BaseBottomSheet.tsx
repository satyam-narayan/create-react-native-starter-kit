import React, { forwardRef, memo, useMemo } from 'react';
import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet';
import { useAppTheme } from '@/context/ThemeContext';

interface Props extends Partial<Omit<BottomSheetProps, 'snapPoints'>> {
  children: React.ReactNode;
  snapPoints?: string[];
}

const BaseBottomSheet = forwardRef<BottomSheet, Props>(
  ({ children, snapPoints = ['50%'], ...rest }, ref) => {
    const memoSnapPoints = useMemo(() => snapPoints, [snapPoints]);
    const { color } = useAppTheme();

    return (
      <BottomSheet
        ref={ref}
        snapPoints={memoSnapPoints}
        backgroundStyle={[{ backgroundColor: color.background_secondary }]}
        enablePanDownToClose
        enableDynamicSizing
        {...rest}
      >
        {children}
      </BottomSheet>
    );
  },
);

export default memo(BaseBottomSheet);
