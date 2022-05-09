import { useAtom, atom } from 'jotai';
import { atomWithHash } from 'jotai/utils';
import { focusAtom } from 'jotai/optics';

export const baseProductDrawerAtom = {
  isOpen: false,
  isEditing: false,
  page: 0,
  isLoading: false,
  _id: '',
};

export const drawerAtom = atomWithHash('product', {
  ...baseProductDrawerAtom,
});

export const drawerPageAtom = focusAtom(drawerAtom, (optic) =>
  optic.prop('page')
);
