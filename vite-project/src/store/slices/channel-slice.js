// filepath: d:\Projects\Messy\vite-project\src\store\slices\channel-slice.js
export const createChannelSlice = (set) => ({
  channels: [],
  addChannel: (newChannel) =>
    set((state) => ({
      channels: [...state.channels, newChannel],
    })),
});
