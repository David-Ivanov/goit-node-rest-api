import { error } from 'console';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import path from 'path';

const contactsPath = path.resolve('db', 'contacts.json');

const list = fs.readFile(contactsPath, { encoding: "utf-8" })
    .then(data => {
        const parsedData = JSON.parse(data);
        return parsedData
    })
    .catch(error => console.log(error));


const writeList = data => fs.writeFile(contactsPath, data);


export async function listContacts() {
    return await list;
}

export async function getContactById(contactId) {
    const awaitedList = await listContacts();
    const contact = awaitedList.find(contact => contact.id === contactId);

    return contact ?? Promise.reject();
}

export async function removeContact(contactId) {
    const awaitedList = await listContacts();
    const contact = awaitedList.find(contact => contact.id === contactId);
    if (contact) {
        const index = awaitedList.indexOf(contact);
        awaitedList.splice(index, 1);

        writeList(JSON.stringify(awaitedList));
        return contact;
    } else {
        return Promise.reject();
    }

}

export async function addContact({ id, name, email, phone }) {
    const awaitedList = await listContacts();

    const newContact = {
        id: id ?? nanoid(),
        name,
        email,
        phone
    }

    awaitedList.push(newContact)

    writeList(JSON.stringify(awaitedList));

    return newContact;
}

const isEmpty = value => value === '' ? null : value;

export async function updateContact({ name, email, phone }, id) {
    try {
        let contact = await getContactById(id);

        if (contact === undefined) {
            return Promise.reject()
        }

        contact = {
            id,
            name: isEmpty(name) ?? contact.name,
            email: isEmpty(email) ?? contact.email,
            phone: isEmpty(phone) ?? contact.phone,
        }

        await removeContact(id);
        await addContact(contact);

        return contact;
    } catch (err) {
        return Promise.reject();
    }
}