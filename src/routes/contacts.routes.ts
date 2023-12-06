import { Router } from "express";
import { ContactsController } from "../Controllers/ContactsController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";

const contactsRoutes = Router(); 

const contactsController =  new ContactsController()


contactsRoutes.put("/", ensureAuthenticated, contactsController.update )
contactsRoutes.get("/:user_id", contactsController.show )


export {contactsRoutes}