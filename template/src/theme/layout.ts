import { StyleSheet } from 'react-native';
import { spacing } from './spacing';

export const layout = StyleSheet.create({
  flexContainer: {
    flex: 1,
    padding: spacing.md,
  },
  rowGapCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  flexEnd: { flex: 1, justifyContent: 'flex-end' },
  flexStart: { flex: 1, justifyContent: 'flex-start' },
  flex: { flex: 1 },
  separator: { height: 1, marginVertical: spacing.md },
  marginTopMd: { marginTop: spacing.md },
  marginBottomMd: { marginBottom: spacing.md },
});
