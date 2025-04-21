import { Mongoose } from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (req, res) => {
  try {
    const { e } = req.body;
    const searchTerm = e; // Log the search term for debugging
    if (!searchTerm) {
      return res.status(400).send({ error: "Search term is required" });
    }
    // Replacing all the special character from the search term
    const sanitizedSearchTerm = searchTerm.replace(
      / [.✶+?^${}() | [\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    if (contacts.length === 0) {
      return res.status(404).send({ error: "No contacts found" });
    }
    return res.status(200).json({
      contacts: contacts.map((contact) => ({
        id: contact.id,
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        image: contact.image,
        color: contact.color,
      })),
    });
  } catch (error) {
    console.error(error);
    //   return res.status(500).json({ error: error.message });
  }
};

export const getContactsForDMList = async (req, res) => {
  try {
    console.log("Request received for /get-contacts-dm");
    let { userId } = req;
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      { $unwind: "$contactInfo" },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({ contacts });
  } catch (error) {
    //console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
