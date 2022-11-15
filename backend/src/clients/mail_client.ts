import Mail from "../domain/mail";

export default interface MailClient {

    getCashMails(labelId: string): Promise<Mail[]>;
    getMail(id: string): Promise<Mail>;
    deleteMail(id: string): Promise<void>;

}