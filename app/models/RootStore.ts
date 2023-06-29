import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChannelStoreModel } from "./ChannelStore"
import { UserStoreModel } from "./UserStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  channelStore: types.optional(ChannelStoreModel, {
    channels: [
      { id: "8b28c7374ba5891ea65db9a2d1234ecc369755c35f6db1a54f18424500dea4a0", privkey: "" },
      { id: "5b93e807c4bc055693be881f8cfe65b36d1f7e6d3b473ee58e8275216ff74393", privkey: "" },
      { id: "3ff1f0a932e0a51f8a7d0241d5882f0b26c76de83f83c1b4c1efe42adadb27bd", privkey: "" },
    ],
  }),
  userStore: types.optional(UserStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
