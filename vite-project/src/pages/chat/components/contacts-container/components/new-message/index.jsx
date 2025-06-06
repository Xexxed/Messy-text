//import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { GET_CONTACTS, HOST } from "@/utils/constants";
import { apiClient } from "@/lib/api-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

function NewMessage() {
  const [openNewContactMode, setOpenNewContactMode] = useState(false);
  const [searchedContacts, setsearchedContacts] = useState([]);
  const { selectedChatData, setSelectedChatType, setSelectedChatData } =
    useAppStore();

  const searchContacts = async (e) => {
    try {
      if (e.length > 0) {
        const response = await apiClient.post(
          GET_CONTACTS,
          { e },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setsearchedContacts(response.data.contacts);
        }
      } else {
        setsearchedContacts([]);
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
    }
  };
  const selectNewContact = (contact) => {
    setOpenNewContactMode(false);
    setsearchedContacts([]);
    setSelectedChatType("contact");

    setSelectedChatData(contact);
    console.log(
      useAppStore.getState().selectedChatData,
      "useAppStore.getState().selectedChatData"
    );
    //console.log("Hellllllllll");

    // console.log("Selected contact:", contact);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactMode(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactMode} onOpenChange={setOpenNewContactMode}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className=" rounded-lg p-6 bg-[2c2e2b] border-none "
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className={"h-[250px]"}>
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={() => selectNewContact(contact)}
                >
                  <div className=" w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center">
                      {contact.image ? (
                        <AvatarImage
                          src={contact.image}
                          alt="Profile"
                          className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                        <div
                          className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                            contact.color
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {searchedContacts.length <= 0 && (
            <div className="flex-1  md:bg-[#181920] md:flex flex-col justify-center items-center duration-1000 transition-all ">
              <Lottie
                isClickToPauseDisabled={true}
                height={150}
                width={150}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">! </span>
                  Search new
                  <span className="text-purple-500"> Contact.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewMessage;
