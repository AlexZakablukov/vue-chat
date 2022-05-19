import { Store, Commit, Dispatch } from 'vuex'
import {ChatState} from "~/store/chat/types";

export interface RootState {
  chat: ChatState
}

export type RootStore = Store<RootState>

export type ActionsArguments<StateType> = {
  commit: Commit
  state: StateType
  dispatch: Dispatch
  rootState: RootState
}
