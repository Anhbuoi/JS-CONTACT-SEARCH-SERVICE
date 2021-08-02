// Start your code here!
// You should not need to edit any other existing files (other than if you would like to add tests)
// You do not need to import anything as all the necessary data and events will be delivered through
// updates and service, the 2 arguments to the constructor
// Feel free to add files as necessary
// import contacts, { addedContact, lock, modifiedContact, removedContact, reset, unlock } from '../accessLayer/data';
// import Contact from '../accessLayer/model';
// import contacts from '../accessLayer/data';
// import service from '../accessLayer/service';
// import updates from 'dd../accessLayer/updates';
import contacts, { addedContact, lock, modifiedContact, removedContact, reset, unlock } from '../accessLayer/data';
// import service from '../accessLayer/service';


export default class {
    constructor(updates, service) {
        this.updates = updates;
        this.service = service;
    }

    search(query) {
        let results = [];

        // for (let id in contacts) {
        //     try {
        //         this.service.getById(id)
        //         .then(value => {
        //             if (value && query && !JSON.stringify(value).includes(query)) {
        //                 updates.emit('remove', id); //todo probably need to emit events but not sure what to do
        //             }

        //             // for (let k in value) {
        //             //     if (k && query && query === value[k]) {
        //             //         // results.push(value);
        //             //         return value;
        //             //         continue;
        //             //     }
        //             // }
        //         });
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }

        const testLock = Symbol('test.lock');
        contacts[lock] = testLock;
        contacts[unlock] = testLock;
        for (let id in contacts) {
            for (let key in contacts[id]) {
                if (contacts[id][key].includes(query)) {
                    this.addContact(id, results, contacts);
                    break;

                } else if (key === 'primaryPhoneNumber' || key === 'secondaryPhoneNumber') {
                    let cleanQuery = ('' + query).replace(/\D/g, '');
                    let cleanPhone = ('' + contacts[id][key]).replace(/\D/g, '');
                    
                    if (cleanPhone && cleanQuery && cleanPhone.includes(cleanQuery)) {
                        this.addContact(id, results, contacts);
                        break;
                    }
                } else if (key === 'firstName' || key === 'nickName' || key === 'lastName') {
                    let firstName = contacts[id].firstName;
                    let lastName = contacts[id].lastName;
                    let nickName = contacts[id].nickName;
                    let fullNickName = nickName ? nickName + " " + lastName : lastName;
                    let fullFirstName = firstName ? firstName + " " + lastName : lastName;
              
                    if (fullNickName.includes(query) || fullFirstName.includes(query)) {
                        this.addContact(id, results, contacts);
                        break;
                    }
                }
            }
        }

        return results;
    }

    formatPhoneNumber(str) {
        let cleaned = ('' + str).replace(/\D/g, '');
        
        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        
        if (match) {
            return '(' + match[2] + ') ' + match[3] + '-' + match[4]
        };
        return null
    }

    addContact(id, results, contacts) {
        let phones = [];
        let name = [];
        let email = "";
        if (contacts[id].primaryPhoneNumber) {
            phones.push(this.formatPhoneNumber(contacts[id].primaryPhoneNumber));
        }
        if (contacts[id].secondaryPhoneNumber) {
            phones.push(this.formatPhoneNumber(contacts[id].secondaryPhoneNumber));
        }
        if (contacts[id].nickName) {
            name.push(contacts[id].nickName);
        } else if (contacts[id].firstName) {
            name.push(contacts[id].firstName);
        }
        if (name.length > 0) {
            name.push(" ");
        }
        if (contacts[id].lastName) {
            name.push(contacts[id].lastName);
        }

        if (contacts[id].primaryEmail) {
            email = contacts[id].primaryEmail;
        } else if (contacts[id].secondaryEmail) {
            email = contacts[id].secondaryEmail;
        }

        let contact = {
            id: id,
            name: name.join(''),
            email: email,
            phones: phones,
            address: contacts[id].addressLine1,
        }
        results.push(contact)
    }
}
