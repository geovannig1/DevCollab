import { Dispatch } from 'redux';
import {
  NAVBAR_SELECTED,
  NAVBAR_CLEAR,
  NavbarDispatchTypes,
  SelectedType,
} from './navbarTypes';

export const setNavbar = (selected: SelectedType) => (
  dispatch: Dispatch<NavbarDispatchTypes>
) => {
  dispatch({ type: NAVBAR_SELECTED, payload: selected });
};

export const clearNavbar = () => (dispatch: Dispatch<NavbarDispatchTypes>) => {
  dispatch({ type: NAVBAR_CLEAR });
};
