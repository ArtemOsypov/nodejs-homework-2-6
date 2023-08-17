// import contactsService from "../models/contacts.js";

import Contact from "../models/contacts.js";

import { HttpError } from "../helpers/index.js";

import { contactAddSchema } from "../schema/schema.js";

export const getAll = async (req, res, next) => {
  try {
    // message": "Cannot use an expression limit: \"1\" in an exclusion projection"
    const { page = 1, limit = 5 } = req.query;
    console.log(req.query);
    const skip = (page - 1) * limit;
    const { _id: owner } = req.user;
    const result = await Contact.find({ owner }, { skip, limit }).populate(
      "owner",
      "name"
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, `Movie with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const add = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

export const delById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json({
      message: "Delete sucsess",
    });
  } catch (error) {
    next(error);
  }
};

export const updateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    console.log(id);
    const result = await Contact.findByIdAndUpdate(id, req.body);

    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  getById,
  add,
  delById,
  updateById,
  updateFavorite,
};
