export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  setChannels: (channels) => set({ channels }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },
  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          receiver:
            selectedChatType === "channel"
              ? message.receiver
              : message.receiver._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  addChannelInChannelList: (message) => {
    //console.log("addChannelInChannelList", message);
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
    if (index !== -1 && index !== undefined) {
      channels.splice(index, 1);
      channels.unshift(data);
    }
  },
  addContactsInDirectMessages: (message) => {
    const userId = get().userInfo.id;
    const fromId =
      message.sender._id === userId ? message.receiver._id : message.sender._id;
    const fromData =
      message.sender._id === userId ? message.receiver : message.sender;
    const dMContacts = get().directMessagesContacts;
    //  const data = dMContacts.find((contact) => contact._id === fromId);
    const index = dMContacts.findIndex((contact) => contact._id === fromId);
    if (index !== -1 && index !== undefined) {
      dMContacts.splice(index, 1);
      dMContacts.unshift(fromData);
    } else {
      dMContacts.unshift(fromData);
    }
    set({ directMessagesContacts: dMContacts });
  },
});
