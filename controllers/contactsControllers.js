import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contactsModel.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
    const result = await Contact.find();
    res.json(result);
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;

    const result = await Contact.findById(id);

    if (!result) {
        res.status(404).send(JSON.stringify({ massage: HttpError(404).message }));
    }

    res.status(200).json(result);
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;

    const result = await Contact.findByIdAndDelete(id);

    if (!result) {
        res.status(404).send(JSON.stringify({ massage: HttpError(404).message }));
    }

    res.status(201).json(result);

};

export const createContact = async (req, res) => {
    const contact = {
        ...req.body,
        favorite: false,
    }

    const { error } = createContactSchema.validate(contact);

    if (error) {
        res.status(400).send(JSON.stringify({ massage: HttpError(400).message }));
        return
    }

    const result = await Contact.create(contact)

    res.status(201).send(result)
};

export const updateContact = async (req, res) => {
    const { id } = req.params;

    const contact = { ...req.body }

    if (!contact.name && !contact.email && !contact.phone) {
        res.status(400).send(JSON.stringify({ massage: HttpError(400, "Body must have at least one field").message }));
        return
    }

    const { error } = updateContactSchema.validate(contact);

    if (error) {
        res.status(400).send(JSON.stringify({ massage: HttpError(400).message }));
        return
    }

    const result = await Contact.findByIdAndUpdate(id, contact);

    if (!result) {
        res.status(404).send(JSON.stringify({ massage: HttpError(404).message }));
        return
    }

    res.status(200).json(await Contact.findById(id));
};

export const updateStatusContact = async (req, res) => {
    const { id } = req.params;

    const body = req.body;


    try {
        await Contact.findByIdAndUpdate(id, body);
    } catch (error) {
        res.status(404).send(JSON.stringify({ massage: HttpError(404).message }));
        return
    }

    res.status(200).json(await Contact.findById(id));
}