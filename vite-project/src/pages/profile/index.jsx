import { useAppStore } from "@/store";
import React, { use, useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  UPDATE_USER_INFO,
  ADD_PROFILE_IMAGE,
  HOST,
  REMOVE_PROFILE_IMAGE,
} from "@/utils/constants";
import { apiClient } from "@/lib/api-client";

const Profile = () => {
  useEffect(() => {
    // Set the background color of #root when the component is mounted
    const rootElement = document.body;
    if (rootElement) {
      rootElement.style.backgroundColor = "#1b1c24";
    }

    // Optional: Reset the background color when the component is unmounted
    return () => {
      if (rootElement) {
        rootElement.style.backgroundColor = ""; // Reset to default
      }
    };
  }, []);
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);
  useEffect(() => {
    console.log(userInfo);
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
      //setImage(userInfo.image);
    }
    if (userInfo.image) {
      setImage(userInfo.image);
      console.log(userInfo);
    }
  }, [userInfo]);
  const validateProfile = () => {
    if (!firstName.length) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName.length) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_USER_INFO,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo(response.data);
          toast.success("Profile changes saved successfully");

          navigate("/chat");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error saving profile changes");
      }
    }
  };
  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please complete your profile first");
    }
  };
  const handleFileInputClick = () => {
    //alert("File input clicked");
    fileInputRef.current.click();
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      try {
        const response = await apiClient.post(ADD_PROFILE_IMAGE, formData, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data) {
          setUserInfo({ ...userInfo, image: response.data.image });
          toast.success("Image uploaded successfully");
        }
        // const reader = new FileReader();
        // reader.onload = () => {
        //   setImage(reader.result);
        // };
        //reader.readAsDataURL(file);
      } catch (error) {
        console.error(error);
        toast.error("Error uploading image");
      }
    }
  };
  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setImage(null);
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[95vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            onClick={handleNavigate}
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden flex items-center justify-center">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-full w-full d:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full "
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
              />
            </div>
            <div className="w-full">
              <input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
              />
            </div>
            <div className="w-full">
              <input
                placeholder="Second Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
              />
            </div>
            <div className="w-full flex gap-4 items-center">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-1"
                      : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 bg-amber-500 w-full hover:bg-amber-700 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
