import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { useEffect } from "react";

const ContactList = ({ contacts, isChannel = false }) => {
  console.log(contacts, "contacts in contact list");
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
  } = useAppStore();
  useEffect(() => {
    console.log(selectedChatData, "Updated selectedChatData");
  }, [selectedChatData]);
  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }
    setSelectedChatData(contact);
    console.log(contact, "contact");
    console.log(selectedChatData, "selectedChatData");
    if (selectedChatData && selectedChatData._id !== contact._id) {
      console.log("This is getting invoked");
      setSelectedChatMessages([]);
    }
  };
  console.log(isChannel, "isChannel 42432in contact list");

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? " bg-[#8417ff] hover:bg-[$8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden ">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`${
                      selectedChatData &&
                      (selectedChatData.id || selectedChatData._id) ===
                        contact._id
                        ? "bg-[ffffff22] border-2 border-white/70"
                        : getColor(contact.color)
                    }uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full `}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className=" bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}

            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>{`${contact.firstName} ${contact.lastName}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
