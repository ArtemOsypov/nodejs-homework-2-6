import contactsService from "../models/contacts.js";

import { HttpError } from "../helpers/index.js";

import addSchema from "../schema/schema.js";

export const getAll = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await contactsService.contactById(id);
    if (!result) {
      throw HttpError(404, `Movie with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const add = async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const delById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
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
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    console.log(id);
    const result = await contactsService.updateContact(id, req.body);

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
};
