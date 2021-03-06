import React from 'react';

//import WebSocket from './misc/websocket';
import WebSocket from './misc/sockets';

//Components
import Chat from './components/Chat';
import Header from './components/Header';
import Login from './components/Login';

import Push from 'push.js';

class App extends React.Component<any, any> {
    ws: any = WebSocket;
    room: string = "";

    constructor(props) {
        super(props);

        this.state = {
            //Web socket instance

            //user
            users: [],
            user: null,
            userBroadcastTimeoutId: null,

            //chats
            chats: [],
            chatNotifTimeoutId: null,
            typing: null,
            typingTimeoutId: null,

            //local state
            connection: false,
            loginok: false,
        }

        this.login = this.login.bind(this);
        this.runWsCallback = this.runWsCallback.bind(this);
        this.receiveTyping = this.receiveTyping.bind(this);
        this.receiveChat = this.receiveChat.bind(this);
        this.receiveUser = this.receiveUser.bind(this);
        this.blinkChatNotif = this.blinkChatNotif.bind(this);
    }

    login(user, room) {
        this.room = room;
        this.runWs();
        this.setState({ user });
        this.setState({ loginok: true });

        this.addUser(user);
    }

    runWs() {
        this.ws.room = this.room;
        this.ws.runCallback = this.runWsCallback;
        this.ws.receiveChatCallback = this.receiveChat;
        this.ws.receiveTypingCallback = this.receiveTyping;
        this.ws.receiveUserCallback = this.receiveUser;
        this.ws.run();
    }

    runWsCallback(connected) {
        this.setState({ connection: connected });
        this.broadcastUserStatus();
    }

    broadcastUserStatus() {
        clearTimeout(this.state.userBroadcastTimeoutId);
        const func = setTimeout(() => {
            this.ws.sendUser(this.state.user);
            this.broadcastUserStatus();
        }, 5000);
        this.setState({ userBroadcastTimeoutId: func });
    }

    blinkChatNotif(run, name) {
        if (run) {
            clearTimeout(this.state.chatNotifTimeoutId);

            const func = setTimeout(() => {
                document.title = name + " sent a new message!";
                this.blinkChatNotif(true, name);

                setTimeout(() => document.title = "Joy Talk", 1000);
            }, 1500);

            this.setState({ chatNotifTimeoutId: func });
        }
        else {
            clearTimeout(this.state.chatNotifTimeoutId);
            document.title = "Joy Talk";
        }
    }

    sendPushNotification(data) {
        if (data.type == 'text') {
            Push.create(data.name + ' sent a new message!', {
                body: data.content,
                timeout: 3000
            });
        }
        else {
            Push.create(data.name + ' sent a new message!', {
                body: 'Photo',
                icon: data.content,
                timeout: 3000
            });
        }
    }

    receiveChat(data) {
        this.state.chats.push(data);
        this.setState({ chats: this.state.chats });

        if (data.id !== this.state.user.id) {
            this.sendPushNotification(data);
            this.blinkChatNotif(true, data.name);
            this.setState({ typing: null });
        }
    }

    receiveTyping(data) {
        if (data.id !== this.state.user.id) {
            this.setState({ typing: { name: data.name } });

            clearTimeout(this.state.typingTimeoutId);
            const func = () => { this.setState({ typing: null }) };
            this.setState({ typingTimeoutId: setTimeout(func, 2000) });
        }
    }

    receiveUser(data) {
        if (data.id !== this.state.user.id) {
            const user = this.state.users.find(u => u.id === data.id);
            if (user) {
                if (!user.status) {
                    user.status = true;
                    this.setState({ users: this.state.users });
                }

                clearTimeout(user.connectionTimeoutId);
                user.connectionTimeoutId = setTimeout(() => {
                    user.status = false;
                    this.setState({ users: this.state.users });
                }, 6000);
            }
            else {
                data.connectionTimeoutId = null;
                const joined = this.state.users.concat([data]);
                this.setState({ users: joined });
            }
        }
    }

    addUser(user) {
        const users = Array.from(this.state.users);
        users.push(user);

        this.setState({ users: users });
    }

    public render() {
        return (
            <div className="container-wrapper">
                <div className="app-window">
                    <Header user={this.state.user} users={this.state.users} connection={this.state.connection} />
                    {
                        this.state.loginok ?
                            <Chat ws={this.ws}
                                room={this.room}
                                user={this.state.user}
                                chats={this.state.chats}
                                typing={this.state.typing}
                                blinkChatNotif={this.blinkChatNotif} /> :

                            <Login onSubmit={(user, room) => this.login(user, room)} />
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        //Apply theme from localStorage
        document.body.className = localStorage['joytalk_theme'] || 'deeporange';

    }
}

export default App;
