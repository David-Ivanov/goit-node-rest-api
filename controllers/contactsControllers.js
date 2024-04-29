import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    res.status(200).send(await contactsService.listContacts());
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;

    try {
        res.status(200).send(await contactsService.getContactById(id));
    } catch (err) {
        res.status(404).send(JSON.stringify({ massage: HttpError(404).message }));
    }

};

export const deleteContact = async (req, res) => {
    const { id } = req.params;

    try {
        res.status(200).send(await contactsService.removeContact(id));
    } catch (err) {
        res.status(404).send(JSON.stringify({ massage: HttpError(404).message }));
    }
};

export const createContact = async (req, res) => {
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    }

    const { error } = createContactSchema.validate(contact);

    if (error) {
        res.status(400).send(JSON.stringify({ massage: HttpError(400).message }));
        return
    }

    res.status(201).send(await contactsService.addContact(contact))
};

export const updateContact = async (req, res) => {

    const { id } = req.params;

    const contact = {
        name: req.body?.name,
        email: req.body?.email,
        phone: req.body?.phone,
    }

    if (!contact.name && !contact.email && !contact.phone) {
        res.status(400).send(JSON.stringify({ massage: HttpError(400, "Body must have at least one field").message }));
        return
    }

    const { error } = updateContactSchema.validate(contact);

    if (error) {
        res.status(400).send(JSON.stringify({ massage: HttpError(400).message }));
        return
    }

    try {
        res.status(200).send(await contactsService.updateContact(contact, id));
    } catch (error) {
        res.status(404).send(JSON.stringify({ massage: HttpError(404).message }));
    }
};