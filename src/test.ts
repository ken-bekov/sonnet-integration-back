class Message {
    constructor(public content: string) {
    }

    public role = 'role';
}


const message = new Message('The content of the message');
const json = JSON.stringify(message);

console.log(json);
