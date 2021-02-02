import {
  NAVBAR_SELECTED,
  NAVBAR_CLEAR,
  SelectedType,
  NavbarDispatchTypes,
} from '../actions/navbarTypes';

export interface NavbarInitialState {
  selected?: SelectedType;
}

const navbarInitialState: NavbarInitialState = {};

const navbarReducer = (
  state = navbarInitialState,
  action: NavbarDispatchTypes
): NavbarInitialState => {
  switch (action.type) {
    case NAVBAR_SELECTED:
      return { ...state, selected: action.payload };
    case NAVBAR_CLEAR:
      return {};
    default:
      return state;
  }
};

export default navbarReducer;
