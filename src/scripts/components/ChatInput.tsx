import React from 'react';
import ReactDOM from 'react-dom';

import sendicon from '../../icons/send.svg';
import imageicon from '../../icons/image.svg';

import { toBase64 } from '../misc/utils';
import ChatMessage from '../models/ChatMessage';

class ChatInput extends React.Component<any, any>{
    typingTimeoutId: any;
    ws: any = null;

    constructor(props) {
        super(props);

        this.ws = props.ws;

        this.state = {
            user: props.user
        }

        this.sendChat = this.sendChat.bind(this);
        this.createChat = this.createChat.bind(this);
        this.typingChat = this.typingChat.bind(this);
        this.uploadPhoto = this.uploadPhoto.bind(this);
    }

    getStyle(): any {
        if (!this.ws.connected) return { opacity: 0.6, pointerEvents: "none" };
        else return { opacity: 1, pointerEvents: "initial" };
    }

    createChat(content, type?) {
        return new ChatMessage(
            this.state.user.id,
            this.state.user.name,
            content,
            type
        );
    }

    sendChat(e) {
        e.preventDefault();
        const input: any = ReactDOM.findDOMNode(this.refs.msg);
        const text = input.value.replace(/\n/g, "<br/>").replace(/\s\s+/g, ' ');

        if (text !== " " && text !== "") {
            const data = this.createChat(text);
            this.ws.sendChat(data);
        }

        input.value = "";
        this.props.blinkChatNotif();
    }

    typingChat(e) {
        const input: any = ReactDOM.findDOMNode(this.refs.msg);
        const text = input.value.replace(/\s\s+/g, ' ');
        const data = this.createChat(text);
        data.content = '';

        clearTimeout(this.typingTimeoutId);
        this.typingTimeoutId = setTimeout(() => { this.ws.sendTyping(data); }, 100);
    }

    allowNewLine(e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            this.sendChat(e);
        }
    }

    async uploadPhoto(e) {
        const inputel: any = this.refs.addphoto;
        const base64: any = await toBase64(inputel.files[0]);
        const data = this.createChat(base64, "image");
        this.ws.sendChat(data);
    }

    render() {
        return (
            <form className="input" onSubmit={(e) => this.sendChat(e)} style={this.getStyle()}>
                <label className="addphoto" htmlFor="#addphoto">
                    <img src={imageicon} alt="addphoto" />
                </label>
                <input className="addphotobtn" id="#addphoto" type="file" ref="addphoto" onChange={e => this.uploadPhoto(e)} />
                <textarea className="msgbox" ref="msg" placeholder="Type here..."
                    onKeyDown={e => this.allowNewLine(e)}
                    onInput={e => this.typingChat(e)} />
                <input className="submitbtn" type="submit" />
                <div className="submiticon" onClick={(e) => this.sendChat(e)}>
                    <img src={sendicon} alt="submit" />
                </div>
            </form>
        )
    }


}

export default ChatInput;