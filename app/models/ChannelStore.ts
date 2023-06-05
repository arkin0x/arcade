import { Instance, SnapshotIn, SnapshotOut, types, applySnapshot } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ChannelModel } from "./Channel"

/**
 * Model description here for TypeScript hints.
 */
export const ChannelStoreModel = types
  .model("ChannelStore")
  .props({
    channels: types.array(ChannelModel),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    createDefaultChannels() {
      self.channels.push({
        id: "1abf8948d2fd05dd1836b33b324dca65138b2e80c77b27eeeed4323246efba4d",
        privkey: "",
      })
      self.channels.push({
        id: "d4de13fde818830703539f80ae31ce3419f8f18d39c3043013bee224be341c3b",
        privkey: "",
      })
    },
    reset() {
      applySnapshot(self, { channels: [] })
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ChannelStore extends Instance<typeof ChannelStoreModel> {}
export interface ChannelStoreSnapshotOut extends SnapshotOut<typeof ChannelStoreModel> {}
export interface ChannelStoreSnapshotIn extends SnapshotIn<typeof ChannelStoreModel> {}
export const createChannelStoreDefaultModel = () => types.optional(ChannelStoreModel, {})
