import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { TabNavigator } from "./TabNavigator"
import { AuthNavigator } from "./AuthNavigator"
import { useStores } from "app/models"
import { BlurredPopupProvider } from "app/components/BlurredPopup"

export type AppStackParamList = {
  AIChannel: undefined
  TrainAI: undefined
  Auth: undefined
  Hud: undefined
  Home: undefined
  Login: undefined
  Changelog: undefined
  CreateAccount: undefined
  Tabs: undefined
  HomeMessages: undefined
  Discover: undefined
  Chat: undefined
  Listing: undefined
  ListingDetail: undefined
  Channels: undefined
  User: { id: string }
  Profile: undefined
  EditProfile: undefined
  DirectMessage: undefined
  CreateChannel: undefined
  Contacts: undefined
  Invite: undefined
  ChannelManager: undefined
  RelayManager: undefined
  NotificationSetting: undefined
  PrivacySetting: undefined
  Demos: undefined
  Backup: undefined
  AddContact: undefined
  NewMessage: undefined
  ChannelMembers: undefined
  Rate: undefined
}

const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const {
    userStore: { isLoggedIn },
  } = useStores()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="AIChannel" component={Screens.AIChannel} />
          <Stack.Screen name="TrainAI" component={Screens.TrainAI} />
          <Stack.Screen name="Discover" component={Screens.DiscoverScreen} />
          <Stack.Screen name="Chat" component={Screens.ChatScreen} />
          <Stack.Screen name="Changelog" component={Screens.ChangelogScreen} />
          <Stack.Screen name="Listing" component={Screens.ListingScreen} />
          <Stack.Screen name="ListingDetail" component={Screens.ListingDetailScreen} />
          <Stack.Screen name="Channels" component={Screens.ChannelsScreen} />
          <Stack.Screen name="CreateChannel" component={Screens.CreateChannelScreen} />
          <Stack.Screen name="User" component={Screens.UserScreen} />
          <Stack.Screen name="EditProfile" component={Screens.EditProfileScreen} />
          <Stack.Screen name="DirectMessage" component={Screens.DirectMessageScreen} />
          <Stack.Screen name="AddContact" component={Screens.AddContactScreen} />
          <Stack.Screen name="Contacts" component={Screens.ContactsScreen} />
          <Stack.Screen name="Invite" component={Screens.InviteScreen} />
          <Stack.Screen name="ChannelManager" component={Screens.ChannelManagerScreen} />
          <Stack.Screen name="RelayManager" component={Screens.RelayManagerScreen} />
          <Stack.Screen name="NotificationSetting" component={Screens.NotificationSettingScreen} />
          <Stack.Screen name="PrivacySetting" component={Screens.PrivacySettingScreen} />
          <Stack.Screen name="Backup" component={Screens.BackupScreen} />
          <Stack.Screen name="NewMessage" component={Screens.NewMessageScreen} />
          <Stack.Screen name="ChannelMembers" component={Screens.ChannelMembersScreen} />
          <Stack.Screen name="Demos" component={Screens.DemosScreen} />
          <Stack.Screen name="Rate" component={Screens.RateScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <BlurredPopupProvider>
        <AppStack />
      </BlurredPopupProvider>
    </NavigationContainer>
  )
})
