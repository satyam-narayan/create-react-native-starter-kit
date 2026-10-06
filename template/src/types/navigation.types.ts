import {
  createNavigationContainerRef,
  NavigatorScreenParams,
  type CompositeScreenProps,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ============================================================================
// Auth Stack - Unauthenticated screens
// ============================================================================

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  VerifyEmail: undefined;
  ResetPassword: undefined;
};

// ============================================================================
// Main Tab Navigator - Bottom tabs for authenticated users
// ============================================================================

export type BottomTabParamList = {
  Home: undefined;
  Profile: undefined;
};

// ============================================================================
// App Stack - Authenticated screens (including tabs)
// ============================================================================

export type AppStackParamList = {
  MainTabs: undefined;
  ProfileSetup: undefined;
  BottomTabs: NavigatorScreenParams<BottomTabParamList>;
};

// ============================================================================
// Screen Props Types - For use in screen components
// ============================================================================

/**
 * --------------------
 * Auth Screens
 * --------------------
 * Used ONLY inside AuthStack screens
 */
export type AuthStackScreenProps<RouteName extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, RouteName>;

/**
 * --------------------
 * App Stack Screens
 * --------------------
 * Used for non-tab authenticated screens
 * (Settings, Help, About, etc.)
 */
export type AppStackScreenProps<RouteName extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, RouteName>;

/**
 * --------------------
 * Tab Screens (Nested inside AppStack)
 * --------------------
 * These screens can navigate:
 * - within tabs
 * - to AppStack screens
 */
export type TabScreenProps<RouteName extends keyof BottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, RouteName>,
    NativeStackScreenProps<AppStackParamList>
  >;

// ============================================================================
// Global React Navigation typing
// ============================================================================
// This tells React Navigation what the ROOT navigation param list is.
// It enables type-safe `useNavigation()` without generics
// and prevents navigating to invalid routes globally.

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}

// ============================================================================
// Navigation Ref - For navigating outside of components
// ============================================================================

export const navigationRef = createNavigationContainerRef<AppStackParamList>();
