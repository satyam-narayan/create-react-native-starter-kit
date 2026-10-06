import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import BaseSkelton from '@/components/shared/skelton/BaseSkelton';
import { homeShimmerLayout } from '@/components/shared/skelton/layouts';

const HomeShimmer = () => {
  const layout = useMemo(() => homeShimmerLayout(), []);

  return (
    <View style={styles.content}>
      <BaseSkelton isLoading layout={layout} containerStyle={styles.skeleton} />
    </View>
  );
};

export default memo(HomeShimmer);

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  skeleton: {
    width: '100%',
  },
});
