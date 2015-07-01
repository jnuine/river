import { INIT_NOTES, NEW_NOTE } from '../constants/ActionTypes';

const initialState = [];

export default function notes(state = initialState, action) {
  switch (action.type) {
  case INIT_NOTES:
    console.log('INIT_NOTES', action);
    return state.concat(action.notes);
  case NEW_NOTE:
    console.log('NEW_NOTE', action);
    return state.concat([action.note]);
  default:
    return state;
  }
}
