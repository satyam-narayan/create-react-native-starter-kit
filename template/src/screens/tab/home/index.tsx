import CustomText from '@/components/shared/text/CustomText';
import AvatarPicker from '@/components/shared/AvatarPicker';
import { OfflineQueryBoundary } from '@/components/shared/offline';
import { layout } from '@/theme/layout';
import { TabScreenProps } from '@/types';
import React from 'react';
import { ShimmerHolder } from '@/components/shared/skelton/ShimmerHolder';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

type props = TabScreenProps<'Home'>;

/**
 * Set to `false`, then turn on airplane mode, to see the offline screen.
 * In a real screen pass whether the query has data, e.g. `hasData={!!data}`.
 */
const HAS_DATA = true;

const Home = ({}: props) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={layout.flex}>
        <CustomText
          variant="header"
          textAlign="center"
          style={layout.marginTopMd}
        >
          {t('home-screen')}
        </CustomText>
      <OfflineQueryBoundary
        hasData={HAS_DATA}
        loading={<ShimmerHolder.Home />}
      >
        <AvatarPicker
          editable
          width={150}
          height={150}
          editIconSize={39}
          source="both"
          onImageChange={(image: any) => console.log('Selected image:', image)}
          isLoading={false}
        />
      </OfflineQueryBoundary>
    </SafeAreaView>
  );
};

export default Home;
