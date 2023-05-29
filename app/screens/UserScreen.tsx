import React, { FC, useContext, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { AutoImage, Button, Header, RelayContext, Screen, Text } from "app/components"
import { colors, spacing } from "app/theme"
import { useNavigation } from "@react-navigation/native"

interface UserScreenProps extends NativeStackScreenProps<AppStackScreenProps<"User">> {}

export const UserScreen: FC<UserScreenProps> = observer(function UserScreen({
  route,
}: {
  route: any
}) {
  const pool: any = useContext(RelayContext)
  const [profile, setProfile] = useState(null)

  // Get route params
  const { id } = route.params

  // Pull in navigation via hook
  const navigation = useNavigation<any>()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <Header
          title="Profile"
          titleStyle={{ color: colors.palette.cyan400 }}
          leftIcon="back"
          leftIconColor={colors.palette.cyan400}
          onLeftPress={() => navigation.goBack()}
        />
      ),
    })
  }, [])

  useEffect(() => {
    async function fetchProfile() {
      const list = await pool.list([{ kinds: [0], authors: [id] }], true)
      if (list.length > 0) {
        const content = JSON.parse(list[0].content)
        setProfile(content)
      }
    }

    fetchProfile().catch(console.error)
  }, [id])

  return (
    <Screen style={$root} preset="scroll">
      <View style={$cover}>
        <AutoImage
          source={{
            uri:
              profile?.banner ||
              "https://pbs.twimg.com/profile_banners/1216165042472620034/1670567469/1500x500",
          }}
          style={$image}
        />
      </View>
      <View style={$container}>
        <View style={$avatar}>
          <AutoImage
            source={{
              uri: profile?.picture || "https://void.cat/d/KmypFh2fBdYCEvyJrPiN89.webp",
            }}
            style={$image}
          />
        </View>
        <View>
          <View>
            <Text
              preset="bold"
              size="lg"
              text={profile?.display_name || "Loading..."}
              style={$userName}
            />
            <Text
              preset="default"
              size="sm"
              text={profile?.nip05 || "Loading..."}
              style={$userNip05}
            />
          </View>
          <View style={$userAbout}>
            <Text preset="default" text={profile?.about || "Loading..."} />
          </View>
        </View>
        <View style={$buttonGroup}>
          <Button
            text="Message"
            style={$profileButton}
            onPress={() => navigation.navigate("DirectMessage", { id })}
          />
          <Button text="Follow" onPress={() => alert("Coming soon!")} style={$profileButton} />
        </View>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  height: "100%",
  paddingHorizontal: spacing.medium,
}

const $cover: ImageStyle = {
  width: "100%",
  height: 200,
  resizeMode: "cover",
}

const $avatar: ViewStyle = {
  width: 80,
  height: 80,
  borderRadius: 100,
  borderWidth: 2,
  borderColor: "#000",
  marginTop: -40,
  overflow: "hidden",
}

const $image: ImageStyle = {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
}

const $userName: TextStyle = {
  color: colors.palette.cyan400,
}

const $userNip05: TextStyle = {
  lineHeight: 18,
  color: colors.palette.cyan600,
}

const $userAbout: ViewStyle = {
  marginTop: spacing.small,
}

const $buttonGroup: ViewStyle = {
  flexDirection: "row",
  gap: spacing.small,
  marginVertical: spacing.medium,
}

const $profileButton: ViewStyle = {
  flex: 1,
  width: "100%",
  backgroundColor: "transparent",
  borderColor: colors.palette.cyan500,
}