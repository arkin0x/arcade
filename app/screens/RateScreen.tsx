import React, { FC, useContext, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import {
  AutoImage,
  Button,
  Header,
  ListItem,
  RelayContext,
  Screen,
  Text,
  Toggle,
} from "app/components"
import { colors, spacing } from "app/theme"
import { useNavigation } from "@react-navigation/native"
import { shortenKey } from "app/utils/shortenKey"
import { useStores } from "app/models"
import { HelpCircleIcon } from "lucide-react-native"
import { UnsignedEvent } from "nostr-tools"

interface RateScreenProps extends NativeStackScreenProps<AppStackScreenProps<"User">> {}

export const RateScreen: FC<RateScreenProps> = observer(function RateScreen({
  route,
}: {
  route: any
}) {
  const { id } = route.params
  const { pool } = useContext(RelayContext)

  const [profile, setProfile] = useState(null)

  const [thumbsUp, setThumbsUp] = useState(false)
  const [thumbsDown, setThumbsDown] = useState(false)
  const [friendly, setFriendly] = useState(false)
  const [helpful, setHelpful] = useState(false)
  const [responsive, setResponsive] = useState(false)
  const [knowledgable, setKnowledgable] = useState(false)
  const [funny, setFunny] = useState(false)

  const setNegative = (explicit?: boolean = true) => {
    setThumbsUp(false)
    setFriendly(false)
    setHelpful(false)
    setResponsive(false)
    setKnowledgable(false)
    setFunny(false)
    setThumbsDown(explicit)
  }

  const setPositive = (quality?: string) => {
    setThumbsDown(false)
    setThumbsUp(true)
    if (!quality) return 
    switch (quality) {
      case "friendly":
        setFriendly(!friendly)
        break
      case "helpful":
        setHelpful(!helpful)
        break
      case "responsive":
        setResponsive(!responsive)
        break
      case "knowledgable":
        setKnowledgable(!knowledgable)
        break
      case "funny":
        setFunny(!funny)
        break
    }
  }

  const calculateRating = () => {
    let rating = 0
    if (thumbsUp) rating += 0.5
    if (friendly) rating += 0.1
    if (helpful) rating += 0.1
    if (responsive) rating += 0.1
    if (knowledgable) rating += 0.1
    if (funny) rating += 0.1
    return rating
  }

  const rate = () => {
    const amt = calculateRating()
    const result = pool.send({
      kind: 1985,
      tags: [
        ["L", "city.arcade"],
        ["l", "social", "city.arcade", `{"quality":${amt}}`],
        ["p", id],
      ],
      content: '',
      created_at: Math.floor(Date.now()/1000),
    })
    result.then(() => {
      // todo - show your rating
    })
    // cleanup
    setNegative(false) // resets all rating variables
  }

  // Pull in navigation via hook
  const navigation = useNavigation<any>()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <Header
          title="Rate"
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
      const latest = list.slice(-1)[0]
      if (latest) {
        const content = JSON.parse(latest.content)
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
            uri: profile?.banner || "https://void.cat/d/2qK2KYMPHMjMD9gcG6NZcV.jpg",
          }}
          style={$image}
        />
      </View>
      <View style={$container}>
        <View style={$avatar}>
          <AutoImage
            source={{
              uri: profile?.picture || "https://void.cat/d/HxXbwgU9ChcQohiVxSybCs.jpg",
            }}
            style={$image}
          />
        </View>
        <View>
          <View>
            <Text
              preset="bold"
              size="lg"
              text={profile?.username || profile?.name || profile?.display_name || "No name"}
              style={$userName}
            />
            <Text
              preset="default"
              size="sm"
              text={profile?.nip05 || shortenKey(id)}
              style={$userNip05}
            />
          </View>
          <View style={$userAbout}>
            <Text preset="default" text={profile?.about || "No about"} />
          </View>
        </View>



        <View style={$section}>
          <View>
            <Text size="lg">Rate this user.</Text>
            <Text size="xs">
              This is a public NIP-32 rating. Ratings are not editable but only your most recent rating is used by Arcade.
            </Text>
          </View>
          <View style={$buttonGroup}>
            <Button
              text={thumbsDown ? "😒👎" : "👎"}
              style={$profileButton}
              onPress={setNegative}
            />
            <Text style={$note} size="lg">Or</Text>
            <Button
              text={thumbsUp ? "😀👍" : "👍"}
              style={$profileButton}
              onPress={() => setPositive()}
            />
            { thumbsUp ? <>
            <Button
              text="Friendly"
              style={$profileButton}
              RightAccessory={friendly ? () => <Text> ✅</Text> : null}
              onPress={() => setPositive("friendly")}
            />
            <Button
              text="Helpful"
              style={$profileButton}
              RightAccessory={helpful? () => <Text> ✅</Text> : null}
              onPress={() => setPositive("helpful")}
            />
            <Button
              text="Responsive"
              style={$profileButton}
              RightAccessory={responsive? () => <Text> ✅</Text> : null}
              onPress={() => setPositive("responsive")}
            />
            <Button
              text="Knowledgable"
              style={$profileButton}
              RightAccessory={knowledgable? () => <Text> ✅</Text> : null}
              onPress={() => setPositive("knowledgable")}
            />
            <Button
              text="Funny"
              style={$profileButton}
              RightAccessory={funny? () => <Text> ✅</Text> : null}
              onPress={() => setPositive("funny")}
            />
            </> : null }
          </View>
          { thumbsDown || thumbsUp ? 
            <View style={$section}>
              <Button
                text="Publish"
                onPress={rate}
                style={$profileButton}
              />
              <Text size="sm" style={$note}>You can revise your rating at any time. Just press Publish.</Text>
            </View>
              : 
            <Text>You will have a chance to review your rating before publishing it.</Text>
          }
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
  paddingBottom: spacing.massive,
}

const $cover: ImageStyle = {
  width: "100%",
  height: 150,
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
  marginBottom: spacing.large,
}

const $buttonGroup: ViewStyle = {
  flexDirection: "column",
  gap: spacing.small,
  marginVertical: spacing.medium,
}

const $profileButton: ViewStyle = {
  flex: 1,
  width: "100%",
  backgroundColor: colors.palette.overlay20,
  borderColor: colors.palette.cyan500,
}

const $note: TextStyle = {
  color: colors.palette.cyan500,
  textAlign: "center",
  marginTop: 2,
}

const $toggle: ViewStyle = {
  borderWidth: 1,
  marginTop: 1,
  borderColor: colors.palette.cyan900,
  borderRadius: spacing.extraSmall,
  backgroundColor: colors.palette.overlay80,
}

const $toggleDisabled: ViewStyle = {
  borderWidth: 1,
  marginTop: 1,
  borderColor: colors.palette.cyan900,
  borderRadius: spacing.extraSmall,
  backgroundColor: colors.palette.cyan800,
}

const $toggleInner: ViewStyle = {
  backgroundColor: colors.palette.cyan800,
}

const $toggleDetail: any = {
  borderRadius: spacing.tiny,
  backgroundColor: colors.palette.cyan500,
}

const $section: ViewStyle = {
  flexDirection: "column",
  gap: spacing.extraSmall,
  marginTop: spacing.medium,
}

const $sectionHeading: TextStyle = {
  color: colors.palette.cyan600,
}

const $sectionData: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.palette.cyan500,
  borderRadius: spacing.tiny,
  backgroundColor: colors.palette.overlay20,
  marginTop: spacing.tiny,
}

const $sectionItemContainer: ViewStyle = {
  alignItems: "center",
  paddingHorizontal: spacing.small,
}

const $sectionItem: ViewStyle = {
  alignItems: "center",
}

const $hidden: ViewStyle = {
  display: "none",
}
