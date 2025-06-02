import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  countriesList: [],
  coursesList: [],
};

export const DataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.countriesList = action.payload.countriesList;
      state.coursesList = action.payload.coursesList;
    },
  },
});

export const { setData } = DataSlice.actions;
export default DataSlice.reducer;
