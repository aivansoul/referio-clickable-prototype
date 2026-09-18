import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { DemoProvider } from './state/DemoContext'
import {
  ForgotPasswordScreen,
  LocationPermissionScreen,
  LoginScreen,
  NotificationPermissionScreen,
  SignupScreen,
} from './screens/ClientAuth'
import {
  DailyDiscoveryScreen,
  DiscoverScreen,
  HomeScreen,
  MapScreen,
  MerchantScreen,
  QrScreen,
  SearchScreen,
  SplashScreen,
  VisitErrorScreen,
  VisitSuccessScreen,
} from './screens/ClientCore'
import {
  EmptyFavoritesScreen,
  FavoritesScreen,
  LocationErrorScreen,
  NetworkErrorScreen,
  NewReviewScreen,
  NotificationsScreen,
  OnboardingScreen,
  ProfileScreen,
  RankingScreen,
  ReviewsScreen,
  ReviewSuccessScreen,
} from './screens/ClientCommunity'
import {
  ChallengeDetailScreen,
  ChallengesScreen,
  ChallengeSuccessScreen,
  CollectionsScreen,
  PassportDetailScreen,
  PassportsScreen,
  PointsHistoryScreen,
  PrivacyScreen,
  RewardActiveScreen,
  RewardDetailScreen,
  RewardsScreen,
  SettingsScreen,
} from './screens/ClientProgress'
import {
  BusinessChecklistScreen,
  BusinessClaimScreen,
  BusinessDashboardScreen,
  BusinessHoursScreen,
  BusinessInfoScreen,
  BusinessLandingScreen,
  BusinessLoginScreen,
  BusinessMediaScreen,
  BusinessPlansScreen,
  BusinessPreviewScreen,
  BusinessProfileScreen,
  BusinessPublishScreen,
  BusinessQrScreen,
  BusinessReviewsCampaignScreen,
  BusinessReviewsScreen,
  BusinessStatsScreen,
  BusinessSubscriptionScreen,
  BusinessUtilityScreen,
  BusinessVerificationScreen,
  BusinessVisibilityScreen,
} from './screens/BusinessScreens'
import {
  AdminAppealsScreen,
  AdminAuditScreen,
  AdminDashboardScreen,
  AdminLoginScreen,
  AdminModerationScreen,
  AdminSystemScreen,
  AdminUsersScreen,
  AdminVerificationsScreen,
} from './screens/AdminScreens'
import { WebBusinessLandingScreen } from './screens/WebScreens'
import { DesignSystemScreen, PrototypeHubScreen } from './screens/PrototypeScreens'
import { motionTransition } from './motion'

export default function App() {
  const location = useLocation()
  const reduced = useReducedMotion()
  return (
    <DemoProvider>
      <div className="route-viewport">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            className="route-transition"
            key={location.pathname}
            initial={{ opacity: 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -6 }}
            transition={reduced ? motionTransition.fast : motionTransition.base}
          >
            <Routes location={location}>
        <Route path="/" element={<Navigate to="/hub" replace />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/onboarding/1" element={<OnboardingScreen step={1} />} />
        <Route path="/onboarding/2" element={<OnboardingScreen step={2} />} />
        <Route path="/onboarding/3" element={<OnboardingScreen step={3} />} />
        <Route path="/onboarding/4" element={<OnboardingScreen step={4} />} />

        <Route path="/client/login" element={<LoginScreen />} />
        <Route path="/client/signup" element={<SignupScreen />} />
        <Route path="/client/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/client/permissions/location" element={<LocationPermissionScreen />} />
        <Route path="/client/permissions/notifications" element={<NotificationPermissionScreen />} />
        <Route path="/client/home" element={<HomeScreen />} />
        <Route path="/client/discover" element={<DiscoverScreen />} />
        <Route path="/client/daily" element={<DailyDiscoveryScreen />} />
        <Route path="/client/search" element={<SearchScreen />} />
        <Route path="/client/map" element={<MapScreen />} />
        <Route path="/client/merchant/:merchantId" element={<MerchantScreen />} />
        <Route path="/client/reviews" element={<ReviewsScreen />} />
        <Route path="/client/review/new" element={<NewReviewScreen />} />
        <Route path="/client/review/success" element={<ReviewSuccessScreen />} />
        <Route path="/client/qr" element={<QrScreen />} />
        <Route path="/client/visit/success" element={<VisitSuccessScreen />} />
        <Route path="/client/visit/error" element={<VisitErrorScreen />} />
        <Route path="/client/profile" element={<ProfileScreen />} />
        <Route path="/client/ranking" element={<RankingScreen />} />
        <Route path="/client/favorites" element={<FavoritesScreen />} />
        <Route path="/client/favorites/empty" element={<EmptyFavoritesScreen />} />
        <Route path="/client/notifications" element={<NotificationsScreen />} />
        <Route path="/client/passports" element={<PassportsScreen />} />
        <Route path="/client/passports/cafe-moka" element={<PassportDetailScreen />} />
        <Route path="/client/points" element={<PointsHistoryScreen />} />
        <Route path="/client/challenges" element={<ChallengesScreen />} />
        <Route path="/client/challenges/centre-ville" element={<ChallengeDetailScreen />} />
        <Route path="/client/challenges/centre-ville/success" element={<ChallengeSuccessScreen />} />
        <Route path="/client/rewards" element={<RewardsScreen />} />
        <Route path="/client/rewards/atelier-basilic" element={<RewardDetailScreen />} />
        <Route path="/client/rewards/atelier-basilic/active" element={<RewardActiveScreen />} />
        <Route path="/client/collections" element={<CollectionsScreen />} />
        <Route path="/client/settings" element={<SettingsScreen />} />
        <Route path="/client/privacy" element={<PrivacyScreen />} />
        <Route path="/client/error/network" element={<NetworkErrorScreen />} />
        <Route path="/client/error/location" element={<LocationErrorScreen />} />

        <Route path="/business/landing" element={<BusinessLandingScreen />} />
        <Route path="/business/login" element={<BusinessLoginScreen />} />
        <Route path="/business/plans" element={<BusinessPlansScreen />} />
        <Route path="/business/claim" element={<BusinessClaimScreen />} />
        <Route path="/business/verification" element={<BusinessVerificationScreen />} />
        <Route path="/business/onboarding/info" element={<BusinessInfoScreen />} />
        <Route path="/business/onboarding/hours" element={<BusinessHoursScreen />} />
        <Route path="/business/onboarding/media" element={<BusinessMediaScreen />} />
        <Route path="/business/preview" element={<BusinessPreviewScreen />} />
        <Route path="/business/checklist" element={<BusinessChecklistScreen />} />
        <Route path="/business/dashboard" element={<BusinessDashboardScreen />} />
        <Route path="/business/visibility" element={<BusinessVisibilityScreen />} />
        <Route path="/business/profile" element={<BusinessProfileScreen />} />
        <Route path="/business/stats" element={<BusinessStatsScreen />} />
        <Route path="/business/publish" element={<BusinessPublishScreen />} />
        <Route path="/business/reviews" element={<BusinessReviewsScreen />} />
        <Route path="/business/subscription" element={<BusinessSubscriptionScreen />} />
        <Route path="/business/qr" element={<BusinessQrScreen />} />
        <Route path="/business/review-campaign" element={<BusinessReviewsCampaignScreen />} />
        <Route path="/business/team" element={<BusinessUtilityScreen kind="team" />} />
        <Route path="/business/integrations" element={<BusinessUtilityScreen kind="integrations" />} />
        <Route path="/business/security" element={<BusinessUtilityScreen kind="security" />} />
        <Route path="/business/support" element={<BusinessUtilityScreen kind="support" />} />

        <Route path="/admin/login" element={<AdminLoginScreen />} />
        <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
        <Route path="/admin/verifications" element={<AdminVerificationsScreen />} />
        <Route path="/admin/moderation" element={<AdminModerationScreen />} />
        <Route path="/admin/appeals" element={<AdminAppealsScreen />} />
        <Route path="/admin/users" element={<AdminUsersScreen />} />
        <Route path="/admin/audit" element={<AdminAuditScreen />} />
        <Route path="/admin/system" element={<AdminSystemScreen />} />

        <Route path="/web/business" element={<WebBusinessLandingScreen />} />
        <Route path="/web/client" element={<Navigate to="/client/home" replace />} />
        <Route path="/web/cockpit" element={<Navigate to="/business/dashboard" replace />} />
        <Route path="/hub" element={<PrototypeHubScreen />} />
        <Route path="/design-system" element={<DesignSystemScreen />} />
        <Route path="*" element={<Navigate to="/hub" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </DemoProvider>
  )
}
