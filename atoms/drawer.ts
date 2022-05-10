import { useAtom, atom } from 'jotai';
import { atomWithHash } from 'jotai/utils';
import { focusAtom } from 'jotai/optics';

export const baseDrawerAtom = {
  isOpen: false,
  isEditing: false,
  page: 0,
  isLoading: false,
  pageName: '',
  _id: '',
};

export const globalDrawerAtom = atomWithHash('drawer', {
  ...baseDrawerAtom,
});

// export const drawerPageAtom = focusAtom(drawerAtom, (optic) =>
//   optic.prop('page')
// );
